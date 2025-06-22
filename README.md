# Kofi - AI-Powered Collaborative Storytelling Game

A collaborative-competitive storytelling experience featuring two players co-creating a narrative driven by specialized AI systems. The game blends creative writing with objective-based competition, culminating in AI-generated video summaries.

## 🎮 Game Concept

### Core Mechanics
- **Narrator AI**: Establishes initial setting, characters, and context
- **Objective AI**: Generates two mutually exclusive goals from the narrator's setup
- **Turn-based storytelling**: Players alternate writing 50-word actions (1 sentence max)
- **Pace slider**: Controls narrative impact (1=subtle detail, 5=major plot twist)
- **Moderator AI**: Validates inputs for consistency and appropriate pacing
- **Judge AI**: Analyzes full story transcript to declare winning objective
- **Scribe AI**: Generates 15-30 second video summary script

### Gameplay Flow
1. **Initialization**: Two players join, AI creates setting and objectives
2. **Creative Phase**: Players take turns writing actions with pace control
3. **AI Validation**: Each action is moderated for consistency
4. **Resolution**: AI judges the story and generates video script

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Vite
- **Backend**: FastAPI (Python), httpx for API calls
- **LLMs**: Groq API (llama3-8b-8192 model)
- **State**: In-memory Python dict (no database)
- **Deployment**: Local development setup

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API key

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Groq API key**:
   ```bash
   export GROQ_API_KEY="your_groq_api_key_here"
   ```

4. **Start the backend server**:
   ```bash
   python main.py
   ```
   
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## 🎯 How to Play

1. **Start a Game**: Enter player names to create a new session
2. **Join a Game**: Use session ID to join an existing game
3. **Take Turns**: Write 50-word actions and set pace (1-5)
4. **Follow Rules**: 
   - Single sentence per action
   - Maximum 50 words
   - AI moderates for consistency
5. **End Game**: When both players are satisfied
6. **View Results**: See AI judgment and video script

## 📁 Project Structure

```
kofi/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameLobby.tsx
│   │   │   ├── GameSession.tsx
│   │   │   └── GameResults.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## 🔧 API Endpoints

- `POST /start-game` - Initialize new game session
- `POST /player-action` - Submit player action
- `POST /end-game` - End game and generate results
- `GET /game-status/{session_id}` - Get current game status

## 🎨 Features

- **Real-time Game State**: Live updates of story progress
- **AI Moderation**: Ensures narrative consistency
- **Pace Control**: Fine-tune story impact levels
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Video Script Generation**: Ready for Veo3 or similar tools
- **Session Management**: Join existing games or create new ones

## 🔑 Environment Variables

- `GROQ_API_KEY`: Your Groq API key for AI functionality

## 🚧 Development Notes

- All game state is stored in memory (resets on server restart)
- No authentication required for hackathon simplicity
- CORS configured for localhost development
- Error handling for API failures and validation

## 🎬 Video Integration

The game generates video scripts that can be used with:
- Veo3 AI video generation
- Runway ML
- Pika Labs
- Other AI video tools

## 🤝 Contributing

This is a hackathon project built with minimal complexity. For production use, consider:
- Adding a database for persistence
- Implementing user authentication
- Adding WebSocket support for real-time updates
- Enhanced error handling and validation
