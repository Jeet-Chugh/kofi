import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GameSessionProps {
  sessionId: string;
  playerId: string;
  gameData: any;
  onEndGame: () => void;
  apiBase: string;
}

const GameSession: React.FC<GameSessionProps> = ({ 
  sessionId, 
  playerId, 
  gameData, 
  onEndGame, 
  apiBase 
}) => {
  const [currentGameData, setCurrentGameData] = useState(gameData);
  const [action, setAction] = useState('');
  const [pace, setPace] = useState(3);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (gameData) {
      setCurrentGameData(gameData);
      checkTurn();
    }
  }, [gameData]);

  const checkTurn = () => {
    if (currentGameData) {
      const currentPlayer = currentGameData.current_player;
      const isPlayer1 = currentGameData.player1_id === playerId;
      setIsMyTurn(
        (currentPlayer === 'player1' && isPlayer1) ||
        (currentPlayer === 'player2' && !isPlayer1)
      );
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await axios.get(`${apiBase}/game-status/${sessionId}`);
      setCurrentGameData(response.data);
      checkTurn();
    } catch (error) {
      console.error('Failed to fetch game status:', error);
    }
  };

  const submitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${apiBase}/player-action`, {
        session_id: sessionId,
        player_id: playerId,
        action: action.trim(),
        pace: pace
      });

      setAction('');
      setPace(3);
      setCurrentGameData(response.data);
      checkTurn();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to submit action');
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = action.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        {/* Game Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Story Session</h2>
          <p className="text-gray-300">Session ID: {sessionId}</p>
          <p className="text-gray-300">Playing as: {playerId}</p>
        </div>

        {/* Story Setting */}
        {currentGameData?.narrator_setting && (
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Story Setting</h3>
            <p className="text-gray-300 leading-relaxed">{currentGameData.narrator_setting}</p>
          </div>
        )}

        {/* Objectives */}
        {currentGameData?.objectives && (
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Objectives</h3>
            <div className="space-y-2">
              {currentGameData.objectives.map((objective: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Actions */}
        {currentGameData?.story_actions && currentGameData.story_actions.length > 0 && (
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Story Progress</h3>
            <div className="space-y-4">
              {currentGameData.story_actions.map((actionItem: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-blue-300">{actionItem.player_id}</span>
                    <span className="text-sm text-gray-400">Pace: {actionItem.pace}/5</span>
                  </div>
                  <p className="text-gray-300">{actionItem.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Turn Status */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              {isMyTurn ? "Your Turn" : "Opponent's Turn"}
            </span>
            <button
              onClick={fetchGameStatus}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Action Input */}
        {isMyTurn && (
          <form onSubmit={submitAction} className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Action</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Action (max 50 words, single sentence)
              </label>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Write your action here..."
                disabled={isSubmitting}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${wordCount > 50 ? 'text-red-400' : 'text-gray-400'}`}>
                  {wordCount}/50 words
                </span>
                <span className="text-sm text-gray-400">
                  {action.split('.').length - 1} sentences
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pace: {pace} ({pace === 1 ? 'Subtle' : pace === 5 ? 'Major Twist' : 'Moderate'})
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={pace}
                onChange={(e) => setPace(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Subtle</span>
                <span>Major Twist</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !action.trim() || wordCount > 50 || action.split('.').length > 2}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Action'}
            </button>
          </form>
        )}

        {/* End Game Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onEndGame}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSession; 