import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameLobby from './components/GameLobby';
import GameSession from './components/GameSession';
import GameResults from './components/GameResults';

// API base URL
const API_BASE = 'http://localhost:8000';

interface GameState {
  sessionId: string | null;
  playerId: string | null;
  gameStatus: 'lobby' | 'active' | 'completed';
  gameData: any;
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    playerId: null,
    gameStatus: 'lobby',
    gameData: null
  });

  const startNewGame = async (player1Id: string, player2Id: string) => {
    try {
      const sessionId = `session_${Date.now()}`;
      const response = await axios.post(`${API_BASE}/start-game`, {
        session_id: sessionId,
        player1_id: player1Id,
        player2_id: player2Id
      });

      setGameState({
        sessionId,
        playerId: player1Id,
        gameStatus: 'active',
        gameData: response.data
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  const joinGame = (sessionId: string, playerId: string) => {
    setGameState({
      sessionId,
      playerId,
      gameStatus: 'active',
      gameData: null
    });
  };

  const endGame = async () => {
    if (!gameState.sessionId) return;

    try {
      const response = await axios.post(`${API_BASE}/end-game`, {
        session_id: gameState.sessionId
      });

      setGameState(prev => ({
        ...prev,
        gameStatus: 'completed',
        gameData: response.data
      }));
    } catch (error) {
      console.error('Failed to end game:', error);
      alert('Failed to end game. Please try again.');
    }
  };

  const resetGame = () => {
    setGameState({
      sessionId: null,
      playerId: null,
      gameStatus: 'lobby',
      gameData: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Kofi</h1>
          <p className="text-xl text-gray-300">AI-Powered Collaborative Storytelling</p>
        </header>

        {gameState.gameStatus === 'lobby' && (
          <GameLobby 
            onStartGame={startNewGame}
            onJoinGame={joinGame}
          />
        )}

        {gameState.gameStatus === 'active' && gameState.sessionId && gameState.playerId && (
          <GameSession
            sessionId={gameState.sessionId}
            playerId={gameState.playerId}
            gameData={gameState.gameData}
            onEndGame={endGame}
            apiBase={API_BASE}
          />
        )}

        {gameState.gameStatus === 'completed' && gameState.gameData && (
          <GameResults
            gameData={gameState.gameData}
            onReset={resetGame}
          />
        )}
      </div>
    </div>
  );
}

export default App; 