
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Target, Grid3X3, Printer } from 'lucide-react';
import { generateCrosswordPDF } from '../utils/pdfGenerator';
import { words } from '../data/crosswordWords';

interface CrosswordHeaderProps {
  timeLeft: number;
  score: number;
  completedWords: string[];
  formatTime: (seconds: number) => string;
}

const CrosswordHeader: React.FC<CrosswordHeaderProps> = ({
  timeLeft,
  score,
  completedWords,
  formatTime
}) => {
  const handlePrintPDF = () => {
    generateCrosswordPDF();
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 mb-6 sm:mb-8">
      <Card className="border-green-200 bg-white/80 backdrop-blur-sm col-span-1 sm:col-span-2 md:col-span-1">
        <CardContent className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">{formatTime(timeLeft)}</div>
            <div className="text-xs sm:text-sm text-green-600">Tempo restante</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">{score}</div>
            <div className="text-xs sm:text-sm text-green-600">Pontos</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-white/80 backdrop-blur-sm col-span-2 sm:col-span-1">
        <CardContent className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">{completedWords.length}/{words.length}</div>
            <div className="text-xs sm:text-sm text-green-600">Palavras completadas</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-white/80 backdrop-blur-sm col-span-2 sm:col-span-1">
        <CardContent className="flex items-center justify-center p-3 sm:p-4">
          <Button 
            variant="outline" 
            onClick={handlePrintPDF}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrosswordHeader;
