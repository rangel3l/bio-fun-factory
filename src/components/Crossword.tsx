
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Grid3X3, Clock, Target, Printer } from 'lucide-react';
import { generateCrosswordPDF } from '../utils/pdfGenerator';

interface CrosswordProps {
  onComplete: (score: number) => void;
}

const Crossword: React.FC<CrosswordProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  const totalWords = 6;

  React.useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCompleted(true);
      onComplete(score);
    }
  }, [timeLeft, isCompleted, score, onComplete]);

  const handlePrintPDF = () => {
    generateCrosswordPDF();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteGame = () => {
    setIsCompleted(true);
    onComplete(score + Math.floor(timeLeft / 15)); // Bônus por tempo
  };

  if (isCompleted) {
    const finalScore = score + Math.floor(timeLeft / 15);
    const percentage = Math.round((completedWords.length / totalWords) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-800 mb-4">
              🧩 Palavras Cruzadas Concluídas!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-600">{finalScore}</div>
              <div className="text-xl text-green-700">pontos totais</div>
              <div className="text-lg text-green-600">
                {completedWords.length} de {totalWords} palavras completadas ({percentage}%)
              </div>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Palavras completadas:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {completedWords.map((word, index) => (
                  <Badge key={index} className="bg-green-100 text-green-700">
                    ✓ {word}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{formatTime(timeLeft)}</div>
              <div className="text-sm text-green-600">Tempo restante</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Target className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{score}</div>
              <div className="text-sm text-green-600">Pontos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Grid3X3 className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{completedWords.length}/{totalWords}</div>
              <div className="text-sm text-green-600">Palavras completadas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-4">
            <Button 
              variant="outline" 
              onClick={handlePrintPDF}
              className="flex items-center gap-2 w-full"
            >
              <Printer className="w-4 h-4" />
              Imprimir PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Palavras Cruzadas */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-green-800 flex items-center justify-center gap-2">
                <Grid3X3 className="w-6 h-6" />
                Palavras Cruzadas Verdes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">🧩</div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Palavras Cruzadas Interativas
                </h3>
                <p className="text-green-700 mb-6">
                  As palavras cruzadas estão sendo desenvolvidas! Por enquanto, 
                  você pode imprimir uma versão em PDF para completar no papel.
                </p>
                <Button 
                  onClick={handleCompleteGame}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Simular Conclusão
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas */}
        <div>
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Dicas</CardTitle>
              <Progress value={(completedWords.length / totalWords) * 100} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">HORIZONTAL:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700">1. Gás responsável pelo efeito estufa (7 letras)</p>
                    <p className="text-green-700">3. Processo de decomposição de resíduos orgânicos (11 letras)</p>
                    <p className="text-green-700">5. Fonte de energia renovável (5 letras)</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">VERTICAL:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700">2. Variedade de espécies (13 letras)</p>
                    <p className="text-green-700">4. Área de proteção ambiental (11 letras)</p>
                    <p className="text-green-700">6. Reutilização de materiais (9 letras)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">Como jogar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700 space-y-2">
              <p>• Imprima o PDF para jogar no papel</p>
              <p>• Use as dicas para encontrar as palavras</p>
              <p>• Palavras se cruzam nas letras em comum</p>
              <p>• Complete todas as palavras para ganhar pontos!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
