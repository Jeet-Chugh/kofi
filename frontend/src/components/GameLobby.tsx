import React, { useState } from 'react';

interface GameLobbyProps {
  onStartGame: (player1Id: string, player2Id: string) => void;
  onJoinGame: (sessionId: string, playerId: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame, onJoinGame }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [joiningPlayerId, setJoiningPlayerId] = useState('');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1Id.trim() && player2Id.trim()) {
      onStartGame(player1Id.trim(), player2Id.trim());
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim() && joiningPlayerId.trim()) {
      onJoinGame(sessionId.trim(), joiningPlayerId.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Kofi</h2>
        
        <div className="space-y-6">
          {/* Create New Game */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Game</h3>
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Player 1 Name</label>
                <input
                  type="text"
                  value={player1Id}
                  onChange={(e) => setPlayer1Id(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Player 2 Name</label>
                <input
                  type="text"
                  value={player2Id}
                  onChange={(e) => setPlayer2Id(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter opponent's name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Start New Game
              </button>
            </form>
          </div>

          {/* Join Existing Game */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Join Existing Game</h3>
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Session ID</label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter session ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={joiningPlayerId}
                  onChange={(e) => setJoiningPlayerId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Join Game
              </button>
            </form>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How to Play</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Two players collaborate to create a story</li>
            <li>• Each player takes turns writing 50-word actions</li>
            <li>• Use the pace slider to control story impact (1=subtle, 5=major twist)</li>
            <li>• AI moderates for consistency and appropriate pacing</li>
            <li>• At the end, AI judges which objective was achieved</li>
            <li>• A video summary is generated from your story</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLobby; 