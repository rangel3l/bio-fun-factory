import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Grid3X3 } from 'lucide-react';
import { gridSize, words } from '../data/crosswordWords';

interface CrosswordGridProps {
  grid: string[][];
  userInputs: string[][];
  completedWords: string[];
  isWordCell: (row: number, col: number) => boolean;
  getWordNumber: (row: number, col: number) => string | number;
  handleInputChange: (row: number, col: number, value: string) => void;
  isCompleted: boolean;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  userInputs,
  completedWords,
  isWordCell,
  getWordNumber,
  handleInputChange,
  isCompleted
}) => {
  return (
    <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-green-800 flex items-center justify-center gap-2 text-base sm:text-xl">
          <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Palavras Cruzadas Verdes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="grid gap-0.5 sm:gap-1 max-w-full overflow-auto mx-auto" 
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(auto, 1fr))`,
            width: "fit-content"
          }}
        >
          {Array.from({ length: gridSize }, (_, row) =>
            Array.from({ length: gridSize }, (_, col) => {
              const isWord = isWordCell(row, col);
              const wordNumber = getWordNumber(row, col);
              const isWordCompleted = completedWords.some(word => {
                const wordDef = words.find(w => w.word === word);
                if (!wordDef) return false;
                const { startRow, startCol, direction, word: wordText } = wordDef;
                
                if (direction === 'horizontal') {
                  return row === startRow && col >= startCol && col < startCol + wordText.length;
                } else {
                  return col === startCol && row >= startRow && row < startRow + wordText.length;
                }
              });

              return (
                <div className="relative" key={`${row}-${col}`}>
                  {isWord ? (
                    <div className={`
                      w-6 h-6 sm:w-8 sm:h-8 
                      border-2 rounded relative 
                      flex items-center justify-center
                      ${isWordCompleted 
                        ? 'bg-green-500 text-white border-green-600' 
                        : 'bg-white border-gray-300'
                      }
                    `}>
                      {wordNumber && (
                        <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] font-bold">
                          {wordNumber}
                        </span>
                      )}
                      <Input
                        className={`
                          w-5 h-5 sm:w-6 sm:h-6 p-0 border-none text-center uppercase
                          text-xs sm:text-sm font-bold bg-transparent focus:ring-0
                          ${isWordCompleted ? 'text-white' : 'text-green-800'}
                        `}
                        value={userInputs[row][col]}
                        onChange={(e) => handleInputChange(row, col, e.target.value)}
                        maxLength={1}
                        disabled={isCompleted}
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrosswordGrid;
