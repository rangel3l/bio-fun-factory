
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { words } from '../data/crosswordWords';

interface CrosswordCompletionProps {
  score: number;
  timeLeft: number;
  completedWords: string[];
  hasGivenUp?: boolean;
}

const CrosswordCompletion: React.FC<CrosswordCompletionProps> = ({
  score,
  timeLeft,
  completedWords,
  hasGivenUp = false
}) => {
  const finalScore = hasGivenUp ? 0 : score + Math.floor(timeLeft / 15);
  const percentage = Math.round((completedWords.length / words.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0">
      <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl text-green-800 mb-4">
            {hasGivenUp ? '🏳️ Jogo Abandonado' : '🧩 Palavras Cruzadas Concluídas!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="text-4xl sm:text-6xl font-bold text-green-600">{finalScore}</div>
            <div className="text-lg sm:text-xl text-green-700">
              {hasGivenUp ? 'pontos (sem pontuação por desistência)' : 'pontos totais'}
            </div>
            <div className="text-base sm:text-lg text-green-600">
              {completedWords.length} de {words.length} palavras completadas ({percentage}%)
            </div>
            {hasGivenUp && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                Você desistiu do jogo. Todas as respostas foram reveladas, mas não houve pontuação.
              </div>
            )}
          </div>
          
          <Progress value={percentage} className="h-3 sm:h-4" />
          
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200">
            <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-4">
              {hasGivenUp ? 'Todas as respostas:' : 'Palavras completadas:'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {words.map((wordDef, index) => (
                <Badge 
                  key={index} 
                  className={`text-xs sm:text-base ${
                    hasGivenUp 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  ✓ {wordDef.word}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrosswordCompletion;
