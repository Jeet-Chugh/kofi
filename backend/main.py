from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import httpx
import json
import os
from datetime import datetime

app = FastAPI(title="Kofi - AI Storytelling Game")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory game state storage
game_sessions: Dict[str, dict] = {}

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"

class GameSession(BaseModel):
    session_id: str
    player1_id: str
    player2_id: str
    narrator_setting: Optional[str] = None
    objectives: Optional[List[str]] = None
    story_actions: List[dict] = []
    current_player: str = "player1"
    game_status: str = "waiting"  # waiting, active, completed

class PlayerAction(BaseModel):
    session_id: str
    player_id: str
    action: str
    pace: int  # 1-5 scale

class StartGameRequest(BaseModel):
    session_id: str
    player1_id: str
    player2_id: str

async def call_groq_api(prompt: str, system_message: str = "") -> str:
    """Make API call to Groq for AI responses"""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    messages = []
    if system_message:
        messages.append({"role": "system", "content": system_message})
    messages.append({"role": "user", "content": prompt})
    
    data = {
        "model": "llama3-8b-8192",
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 500
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_BASE_URL, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise HTTPException(status_code=500, detail="Failed to get AI response")

@app.post("/start-game")
async def start_game(request: StartGameRequest):
    """Initialize a new game session with narrator and objectives"""
    
    # Generate narrator setting
    narrator_prompt = "Create a brief, engaging setting for a collaborative storytelling game. Include a location, time period, and initial situation. Keep it under 100 words."
    narrator_system = "You are a creative narrator setting up story scenarios. Be imaginative and provide a foundation for two players to build upon."
    
    narrator_setting = await call_groq_api(narrator_prompt, narrator_system)
    
    # Generate conflicting objectives
    objectives_prompt = f"Based on this setting: '{narrator_setting}', create two mutually exclusive objectives for two players. Each objective should be achievable but conflict with the other. Format as a simple list."
    objectives_system = "You are an objective generator. Create clear, conflicting goals that players can pursue in a story."
    
    objectives_response = await call_groq_api(objectives_prompt, objectives_system)
    # Parse objectives (simple split for now)
    objectives = [obj.strip() for obj in objectives_response.split('\n') if obj.strip()][:2]
    
    # Create game session
    game_sessions[request.session_id] = {
        "session_id": request.session_id,
        "player1_id": request.player1_id,
        "player2_id": request.player2_id,
        "narrator_setting": narrator_setting,
        "objectives": objectives,
        "story_actions": [],
        "current_player": "player1",
        "game_status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    return {
        "session_id": request.session_id,
        "narrator_setting": narrator_setting,
        "objectives": objectives,
        "current_player": "player1"
    }

@app.post("/player-action")
async def player_action(action_data: PlayerAction):
    """Process a player's action and validate it"""
    
    if action_data.session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session = game_sessions[action_data.session_id]
    
    # Validate it's the player's turn
    expected_player = session["current_player"]
    if action_data.player_id != session[f"{expected_player}_id"]:
        raise HTTPException(status_code=400, detail="Not your turn")
    
    # Validate pace value
    if not 1 <= action_data.pace <= 5:
        raise HTTPException(status_code=400, detail="Pace must be between 1 and 5")
    
    # Validate action length (50 words max, 1 sentence)
    if len(action_data.action.split()) > 50:
        raise HTTPException(status_code=400, detail="Action must be 50 words or less")
    
    if action_data.action.count('.') > 1:
        raise HTTPException(status_code=400, detail="Action must be a single sentence")
    
    # Call moderator AI for validation
    story_context = session["narrator_setting"] + "\n" + "\n".join([f"Action {i+1}: {action['action']}" for i, action in enumerate(session["story_actions"])])
    
    moderator_prompt = f"""Story context: {story_context}

New action: {action_data.action} (Pace: {action_data.pace})

Validate this action:
1. Does it maintain the established environment/setting?
2. Does it follow logically from the previous story context?
3. Is it appropriate for the pace level (1=subtle, 5=major twist)?

Respond with only 'APPROVED' or 'REJECTED' followed by a brief reason."""
    
    moderator_system = "You are a story moderator ensuring narrative consistency and appropriate pacing."
    
    moderator_response = await call_groq_api(moderator_prompt, moderator_system)
    
    if not moderator_response.startswith("APPROVED"):
        raise HTTPException(status_code=400, detail=f"Action rejected: {moderator_response}")
    
    # Add action to story
    action_entry = {
        "player_id": action_data.player_id,
        "action": action_data.action,
        "pace": action_data.pace,
        "timestamp": datetime.now().isoformat()
    }
    
    session["story_actions"].append(action_entry)
    
    # Switch players
    session["current_player"] = "player2" if session["current_player"] == "player1" else "player1"
    
    return {
        "status": "success",
        "action": action_entry,
        "current_player": session["current_player"],
        "story_actions": session["story_actions"]
    }

@app.post("/end-game")
async def end_game(request: Request):
    """End the game and generate final judgment and video summary"""
    data = await request.json()
    session_id = data.get("session_id")
    
    if not session_id or session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session = game_sessions[session_id]
    session["game_status"] = "completed"
    
    # Generate full story transcript
    story_transcript = session["narrator_setting"] + "\n\n"
    for i, action in enumerate(session["story_actions"]):
        story_transcript += f"Action {i+1}: {action['action']}\n"
    
    # Judge AI evaluation
    judge_prompt = f"""Story: {story_transcript}

Objectives: {session['objectives']}

Evaluate which objective was achieved based on the story. Consider:
- Which player's actions better aligned with each objective
- The overall narrative outcome
- The effectiveness of each player's strategy

Declare the winner and explain your reasoning."""
    
    judge_system = "You are a fair judge evaluating story outcomes against stated objectives."
    
    judge_result = await call_groq_api(judge_prompt, judge_system)
    
    # Scribe AI video summary
    scribe_prompt = f"""Create a 15-30 second video summary script for this story:

{story_transcript}

Focus on the most dramatic moments and key plot points. Write in a cinematic style suitable for video narration."""
    
    scribe_system = "You are a video script writer creating engaging summaries for storytelling games."
    
    video_script = await call_groq_api(scribe_prompt, scribe_system)
    
    return {
        "session_id": session_id,
        "judge_result": judge_result,
        "video_script": video_script,
        "final_story": story_transcript,
        "objectives": session["objectives"]
    }

@app.get("/game-status/{session_id}")
async def get_game_status(session_id: str):
    """Get current game status"""
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    return game_sessions[session_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 