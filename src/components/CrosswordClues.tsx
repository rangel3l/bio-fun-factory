
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { words } from '../data/crosswordWords';

interface CrosswordCluesProps {
  completedWords: string[];
}

const CrosswordClues: React.FC<CrosswordCluesProps> = ({ completedWords }) => {
  return (
    <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-green-800 text-base sm:text-xl">Dicas</CardTitle>
        <Progress value={(completedWords.length / words.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="text-xs sm:text-sm">
        <div className="space-y-3 sm:space-y-4 max-h-72 sm:max-h-96 overflow-y-auto pr-2">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-green-800">HORIZONTAL:</h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              {words.filter(w => w.direction === 'horizontal').map((word, index) => (
                <div key={index} className={`${completedWords.includes(word.word) ? 'text-green-500 line-through' : 'text-green-700'}`}>
                  <span className="font-bold">{word.number}.</span> {word.clue}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-green-800">VERTICAL:</h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              {words.filter(w => w.direction === 'vertical').map((word, index) => (
                <div key={index} className={`${completedWords.includes(word.word) ? 'text-green-500 line-through' : 'text-green-700'}`}>
                  <span className="font-bold">{word.number}.</span> {word.clue}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrosswordClues;
