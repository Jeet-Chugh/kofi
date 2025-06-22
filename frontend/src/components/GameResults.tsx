import React from 'react';

interface GameResultsProps {
  gameData: any;
  onReset: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ gameData, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Game Complete!</h2>

        {/* Final Story */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">The Complete Story</h3>
          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {gameData.final_story}
            </p>
          </div>
        </div>

        {/* AI Judge Results */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">🏆 AI Judge's Verdict</h3>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {gameData.judge_result}
            </p>
          </div>
        </div>

        {/* Video Script */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">🎬 Video Summary Script</h3>
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {gameData.video_script}
            </p>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            This script can be used with Veo3 or similar AI video generation tools to create a visual summary of your story.
          </p>
        </div>

        {/* Objectives Summary */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Original Objectives</h3>
          <div className="space-y-3">
            {gameData.objectives.map((objective: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-300">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Summary */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Story Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {gameData.final_story.split('\n').filter(line => line.startsWith('Action')).length}
              </div>
              <div className="text-sm text-gray-400">Total Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(gameData.final_story.split(' ').length / 200 * 100) / 100}
              </div>
              <div className="text-sm text-gray-400">Story Length (minutes)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {gameData.final_story.split('\n').filter(line => line.startsWith('Action')).length * 2}
              </div>
              <div className="text-sm text-gray-400">Player Turns</div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResults; 