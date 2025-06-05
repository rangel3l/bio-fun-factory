
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle, Grid3X3, Clock, Target, Printer } from 'lucide-react';
import { generateCrosswordPDF } from '../utils/pdfGenerator';

interface CrosswordProps {
  onComplete: (score: number) => void;
}

interface WordDefinition {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical';
  number: number;
}

const Crossword: React.FC<CrosswordProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [isGridInitialized, setIsGridInitialized] = useState(false);

  const words: WordDefinition[] = [
    { word: 'SUSTENTABILIDADE', clue: 'Desenvolvimento que atende às necessidades presentes sem comprometer o futuro', startRow: 2, startCol: 1, direction: 'horizontal', number: 1 },
    { word: 'RECICLAGEM', clue: 'Processo de transformação de resíduos em novos produtos', startRow: 0, startCol: 1, direction: 'vertical', number: 2 },
    { word: 'BIODIVERSIDADE', clue: 'Variedade de formas de vida na Terra', startRow: 4, startCol: 0, direction: 'horizontal', number: 3 },
    { word: 'CARBONO', clue: 'Principal elemento responsável pelo efeito estufa', startRow: 1, startCol: 5, direction: 'vertical', number: 4 },
    { word: 'AGUA', clue: 'Recurso natural essencial para a vida', startRow: 6, startCol: 2, direction: 'horizontal', number: 5 },
    { word: 'SOLAR', clue: 'Tipo de energia renovável obtida do sol', startRow: 2, startCol: 7, direction: 'vertical', number: 6 },
    { word: 'FLORESTA', clue: 'Ecossistema rico em árvores e biodiversidade', startRow: 8, startCol: 1, direction: 'horizontal', number: 7 },
    { word: 'POLUICAO', clue: 'Contaminação do meio ambiente', startRow: 1, startCol: 11, direction: 'vertical', number: 8 },
    { word: 'VERDE', clue: 'Cor associada à natureza e sustentabilidade', startRow: 0, startCol: 9, direction: 'horizontal', number: 9 },
    { word: 'CLIMA', clue: 'Condições atmosféricas de uma região', startRow: 5, startCol: 6, direction: 'vertical', number: 10 },
    { word: 'ECO', clue: 'Prefixo relacionado ao meio ambiente', startRow: 7, startCol: 0, direction: 'horizontal', number: 11 },
    { word: 'OXIGENIO', clue: 'Gás vital produzido pelas plantas', startRow: 3, startCol: 13, direction: 'vertical', number: 12 },
    { word: 'TERRA', clue: 'Nosso planeta azul', startRow: 10, startCol: 3, direction: 'horizontal', number: 13 },
    { word: 'NATUREZA', clue: 'Conjunto de todos os seres vivos e não vivos', startRow: 0, startCol: 0, direction: 'vertical', number: 14 }
  ];

  const gridSize = 15;

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCompleted(true);
      onComplete(score);
    }
  }, [timeLeft, isCompleted, score, onComplete]);

  const initializeGrid = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const newUserInputs: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Preencher o grid com as palavras
    words.forEach(wordDef => {
      const { word, startRow, startCol, direction } = wordDef;
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
        if (row < gridSize && col < gridSize) {
          newGrid[row][col] = word[i];
        }
      }
    });

    setGrid(newGrid);
    setUserInputs(newUserInputs);
    setIsGridInitialized(true);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    
    const newInputs = [...userInputs];
    newInputs[row][col] = value.toUpperCase();
    setUserInputs(newInputs);
    
    checkCompletedWords(newInputs);
  };

  const checkCompletedWords = (inputs: string[][]) => {
    const completed: string[] = [];
    let totalScore = 0;

    words.forEach(wordDef => {
      const { word, startRow, startCol, direction } = wordDef;
      let isComplete = true;
      
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
        
        if (row >= gridSize || col >= gridSize || inputs[row][col] !== word[i]) {
          isComplete = false;
          break;
        }
      }
      
      if (isComplete && !completedWords.includes(word)) {
        completed.push(word);
        totalScore += word.length * 10;
      }
    });

    if (completed.length > completedWords.length) {
      setCompletedWords(prev => [...new Set([...prev, ...completed])]);
      setScore(prev => prev + (completed.length - completedWords.length) * 50);
    }

    if (completed.length === words.length) {
      setIsCompleted(true);
      onComplete(score + totalScore);
    }
  };

  const handlePrintPDF = () => {
    generateCrosswordPDF();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWordCell = (row: number, col: number) => {
    if (!isGridInitialized || !grid[row] || row >= gridSize || col >= gridSize) {
      return false;
    }
    return grid[row][col] !== '';
  };

  const getWordNumber = (row: number, col: number) => {
    const word = words.find(w => w.startRow === row && w.startCol === col);
    return word?.number || '';
  };

  // Don't render the grid until it's initialized
  if (!isGridInitialized) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-green-600">Carregando palavras cruzadas...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    const finalScore = score + Math.floor(timeLeft / 15);
    const percentage = Math.round((completedWords.length / words.length) * 100);

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
                {completedWords.length} de {words.length} palavras completadas ({percentage}%)
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
              <div className="text-2xl font-bold text-green-800">{completedWords.length}/{words.length}</div>
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
              <div className="grid grid-cols-15 gap-1 max-w-3xl mx-auto" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {Array.from({ length: gridSize }, (_, row) =>
                  Array.from({ length: gridSize }, (_, col) => {
                    const isWord = isWordCell(row, col);
                    const wordNumber = getWordNumber(row, col);
                    const isCompleted = completedWords.some(word => {
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
                      <div key={`${row}-${col}`} className="relative">
                        {isWord ? (
                          <div className="relative">
                            <Input
                              value={userInputs[row]?.[col] || ''}
                              onChange={(e) => handleInputChange(row, col, e.target.value)}
                              className={`w-8 h-8 text-center text-sm font-bold border-2 p-0 ${
                                isCompleted 
                                  ? 'bg-green-100 border-green-400 text-green-800' 
                                  : 'bg-white border-gray-300'
                              }`}
                              maxLength={1}
                            />
                            {wordNumber && (
                              <span className="absolute -top-1 -left-1 text-xs font-bold text-green-600 bg-white rounded-full w-4 h-4 flex items-center justify-center border border-green-300">
                                {wordNumber}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-800"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas */}
        <div>
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Dicas</CardTitle>
              <Progress value={(completedWords.length / words.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">HORIZONTAL:</h4>
                  <div className="space-y-2 text-sm">
                    {words.filter(w => w.direction === 'horizontal').map((word, index) => (
                      <div key={index} className={`p-2 rounded ${completedWords.includes(word.word) ? 'bg-green-100 text-green-800' : 'text-green-700'}`}>
                        <span className="font-semibold">{word.number}.</span> {word.clue}
                        {completedWords.includes(word.word) && <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">VERTICAL:</h4>
                  <div className="space-y-2 text-sm">
                    {words.filter(w => w.direction === 'vertical').map((word, index) => (
                      <div key={index} className={`p-2 rounded ${completedWords.includes(word.word) ? 'bg-green-100 text-green-800' : 'text-green-700'}`}>
                        <span className="font-semibold">{word.number}.</span> {word.clue}
                        {completedWords.includes(word.word) && <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />}
                      </div>
                    ))}
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
              <p>• Digite uma letra por célula</p>
              <p>• Use as dicas para encontrar as palavras</p>
              <p>• Palavras se cruzam nas letras em comum</p>
              <p>• Complete todas as {words.length} palavras para ganhar pontos!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
