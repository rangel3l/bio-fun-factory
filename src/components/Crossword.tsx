
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lightbulb, Grid3X3, Trophy } from 'lucide-react';

interface CrosswordClue {
  id: number;
  direction: 'horizontal' | 'vertical';
  startRow: number;
  startCol: number;
  answer: string;
  clue: string;
  length: number;
}

const clues: CrosswordClue[] = [
  {
    id: 1,
    direction: 'horizontal',
    startRow: 2,
    startCol: 3,
    answer: 'CARBONO',
    clue: 'Principal elemento químico nos gases do efeito estufa',
    length: 7
  },
  {
    id: 2,
    direction: 'vertical',
    startRow: 1,
    startCol: 6,
    answer: 'SOLAR',
    clue: 'Tipo de energia renovável que vem do sol',
    length: 5
  },
  {
    id: 3,
    direction: 'horizontal',
    startRow: 5,
    startCol: 1,
    answer: 'RECICLAGEM',
    clue: 'Processo de reaproveitamento de materiais',
    length: 10
  },
  {
    id: 4,
    direction: 'vertical',
    startRow: 3,
    startCol: 9,
    answer: 'FLORESTA',
    clue: 'Ecossistema rico em árvores que produz oxigênio',
    length: 8
  },
  {
    id: 5,
    direction: 'horizontal',
    startRow: 8,
    startCol: 2,
    answer: 'POLUICAO',
    clue: 'Contaminação do ar, água ou solo',
    length: 8
  },
  {
    id: 6,
    direction: 'vertical',
    startRow: 6,
    startCol: 4,
    answer: 'CONSERVACAO',
    clue: 'Proteção e preservação do meio ambiente',
    length: 11
  },
  {
    id: 7,
    direction: 'horizontal',
    startRow: 11,
    startCol: 5,
    answer: 'SUSTENTAVEL',
    clue: 'Desenvolvimento que não compromete o futuro',
    length: 11
  }
];

const gridSize = 15;

interface CrosswordCell {
  letter: string;
  isStart: boolean;
  number?: number;
  isCorrect: boolean;
  belongsToClue: number[];
}

const Crossword: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>(() => initializeGrid());
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [completedClues, setCompletedClues] = useState<number[]>([]);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHints, setShowHints] = useState<number[]>([]);

  function initializeGrid(): CrosswordCell[][] {
    const newGrid: CrosswordCell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        isStart: false,
        isCorrect: false,
        belongsToClue: []
      }))
    );

    // Marcar células que fazem parte das palavras
    clues.forEach((clue) => {
      for (let i = 0; i < clue.length; i++) {
        const row = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        
        if (row < gridSize && col < gridSize) {
          newGrid[row][col].belongsToClue.push(clue.id);
          
          // Marcar início da palavra
          if (i === 0) {
            newGrid[row][col].isStart = true;
            newGrid[row][col].number = clue.id;
          }
        }
      }
    });

    return newGrid;
  }

  const handleAnswerChange = (clueId: number, answer: string) => {
    const clue = clues.find(c => c.id === clueId);
    if (!clue) return;

    const upperAnswer = answer.toUpperCase();
    setCurrentAnswers(prev => ({ ...prev, [clueId]: upperAnswer }));

    // Atualizar grid
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      
      for (let i = 0; i < clue.length; i++) {
        const row = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        
        if (row < gridSize && col < gridSize) {
          const letter = upperAnswer[i] || '';
          newGrid[row][col] = {
            ...newGrid[row][col],
            letter,
            isCorrect: letter === clue.answer[i]
          };
        }
      }
      
      return newGrid;
    });

    // Verificar se a resposta está correta
    if (upperAnswer === clue.answer && !completedClues.includes(clueId)) {
      const newCompletedClues = [...completedClues, clueId];
      setCompletedClues(newCompletedClues);
      
      const newScore = score + clue.answer.length * 15;
      setScore(newScore);

      if (newCompletedClues.length === clues.length) {
        setIsCompleted(true);
        onComplete(newScore + 100); // Bônus por completar
      }
    }
  };

  const showHint = (clueId: number) => {
    if (!showHints.includes(clueId)) {
      setShowHints(prev => [...prev, clueId]);
      setScore(prev => Math.max(0, prev - 20)); // Penalidade por usar dica
    }
  };

  if (isCompleted) {
    const finalScore = score + 100;
    const percentage = Math.round((completedClues.length / clues.length) * 100);

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
                {completedClues.length} de {clues.length} palavras completadas ({percentage}%)
              </div>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                🎉 Parabéns! Você demonstrou excelente conhecimento em sustentabilidade!
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                <div>• Cada letra vale 15 pontos</div>
                <div>• Bônus de 100 pontos por completar</div>
                <div>• Dicas custam 20 pontos</div>
                <div>• Total de {clues.reduce((acc, clue) => acc + clue.length, 0)} letras encontradas!</div>
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
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Grid3X3 className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{completedClues.length}/{clues.length}</div>
              <div className="text-sm text-green-600">Palavras completadas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Trophy className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{score}</div>
              <div className="text-sm text-green-600">Pontos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Lightbulb className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{showHints.length}</div>
              <div className="text-sm text-green-600">Dicas usadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Grid das palavras cruzadas */}
        <div className="lg:col-span-2">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-green-800 flex items-center justify-center gap-2">
                <Grid3X3 className="w-6 h-6" />
                Palavras Cruzadas Verdes
              </CardTitle>
              <Progress value={(completedClues.length / clues.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent>
              <div 
                className="grid gap-1 p-4 bg-green-50 rounded-lg max-w-fit mx-auto"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const hasClue = cell.belongsToClue.length > 0;
                    const isSelected = selectedClue && cell.belongsToClue.includes(selectedClue);
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 relative border-2 transition-all duration-200
                          ${hasClue 
                            ? cell.isCorrect 
                              ? 'bg-green-200 border-green-400'
                              : cell.letter 
                              ? 'bg-yellow-100 border-yellow-400'
                              : 'bg-white border-gray-400'
                            : 'bg-gray-800 border-gray-700'
                          }
                          ${isSelected ? 'ring-2 ring-blue-400' : ''}
                        `}
                        onClick={() => {
                          if (cell.belongsToClue.length > 0) {
                            setSelectedClue(cell.belongsToClue[0]);
                          }
                        }}
                      >
                        {hasClue && (
                          <>
                            {cell.isStart && cell.number && (
                              <div className="absolute -top-1 -left-1 bg-green-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cell.number}
                              </div>
                            )}
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-800">
                              {cell.letter}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de pistas */}
        <div className="space-y-6">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Horizontais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clues.filter(clue => clue.direction === 'horizontal').map((clue) => {
                const isCompleted = completedClues.includes(clue.id);
                const hasHint = showHints.includes(clue.id);
                
                return (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedClue === clue.id 
                        ? 'border-blue-400 bg-blue-50' 
                        : isCompleted 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    onClick={() => setSelectedClue(clue.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-green-800">{clue.id}.</span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{clue.clue}</p>
                    
                    {hasHint && (
                      <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                        <strong>Dica:</strong> A palavra tem {clue.length} letras e começa com "{clue.answer[0]}"
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        value={currentAnswers[clue.id] || ''}
                        onChange={(e) => handleAnswerChange(clue.id, e.target.value)}
                        placeholder={`${clue.length} letras`}
                        maxLength={clue.length}
                        className={`text-uppercase ${isCompleted ? 'bg-green-100' : ''}`}
                        disabled={isCompleted}
                      />
                      {!isCompleted && !hasHint && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            showHint(clue.id);
                          }}
                          className="whitespace-nowrap"
                        >
                          💡 Dica (-20pts)
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Verticais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clues.filter(clue => clue.direction === 'vertical').map((clue) => {
                const isCompleted = completedClues.includes(clue.id);
                const hasHint = showHints.includes(clue.id);
                
                return (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedClue === clue.id 
                        ? 'border-blue-400 bg-blue-50' 
                        : isCompleted 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    onClick={() => setSelectedClue(clue.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-green-800">{clue.id}.</span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{clue.clue}</p>
                    
                    {hasHint && (
                      <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                        <strong>Dica:</strong> A palavra tem {clue.length} letras e começa com "{clue.answer[0]}"
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        value={currentAnswers[clue.id] || ''}
                        onChange={(e) => handleAnswerChange(clue.id, e.target.value)}
                        placeholder={`${clue.length} letras`}
                        maxLength={clue.length}
                        className={`text-uppercase ${isCompleted ? 'bg-green-100' : ''}`}
                        disabled={isCompleted}
                      />
                      {!isCompleted && !hasHint && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            showHint(clue.id);
                          }}
                          className="whitespace-nowrap"
                        >
                          💡 Dica (-20pts)
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
