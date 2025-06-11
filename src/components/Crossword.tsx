
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CrosswordProps } from '../types/crossword';
import { useCrosswordGame } from '../hooks/useCrosswordGame';
import CrosswordHeader from './CrosswordHeader';
import CrosswordGrid from './CrosswordGrid';
import CrosswordClues from './CrosswordClues';
import CrosswordInstructions from './CrosswordInstructions';
import CrosswordCompletion from './CrosswordCompletion';
import { words } from '../data/crosswordWords';

const Crossword: React.FC<CrosswordProps> = ({ onComplete }) => {
  const {
    score,
    timeLeft,
    isCompleted,
    hasGivenUp,
    completedWords,
    grid,
    userInputs,
    isGridInitialized,
    handleInputChange,
    handleGiveUp,
    isWordCell,
    getWordNumber,
    formatTime
  } = useCrosswordGame(onComplete);

  // Don't render the grid until it's initialized
  if (!isGridInitialized) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-0">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-4 sm:p-8">
            <div className="text-green-600">Carregando palavras cruzadas...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Só mostrar a tela de conclusão se realmente completou o jogo (não desistiu)
  if (isCompleted && !hasGivenUp) {
    return (
      <CrosswordCompletion
        score={score}
        timeLeft={timeLeft}
        completedWords={completedWords}
        hasGivenUp={hasGivenUp}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-0">
      {hasGivenUp && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-center font-semibold">
            🏳️ Você desistiu do jogo! Todas as respostas foram reveladas em verde.
          </div>
        </div>
      )}
      
      <CrosswordHeader
        timeLeft={timeLeft}
        score={score}
        completedWords={completedWords}
        formatTime={formatTime}
        onGiveUp={handleGiveUp}
        hasGivenUp={hasGivenUp}
      />

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 overflow-x-auto">
          <CrosswordGrid
            grid={grid}
            userInputs={userInputs}
            completedWords={completedWords}
            isWordCell={isWordCell}
            getWordNumber={getWordNumber}
            handleInputChange={handleInputChange}
            isCompleted={isCompleted}
            hasGivenUp={hasGivenUp}
          />
        </div>

        <div>
          <CrosswordClues completedWords={completedWords} />
          <CrosswordInstructions />
        </div>
      </div>
    </div>
  );
};

export default Crossword;
