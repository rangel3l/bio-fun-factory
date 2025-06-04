import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Search, Clock, Target, Printer } from 'lucide-react';
import { generateWordSearchPDF } from '../utils/pdfGenerator';

const words = [
  'CARBONO', 'SUSTENTABILIDADE', 'RECICLAGEM', 'BIODIVERSIDADE', 'SOLAR',
  'POLUICAO', 'CONSERVACAO', 'COMPOSTAGEM', 'REFLORESTAMENTO', 'ECOSSISTEMA',
  'FLORESTA', 'PEGADA', 'AGROTOXICO', 'DESENVOLVIMENTO', 'AQUECIMENTO'
];

const gridSize = 15;

interface Cell {
  letter: string;
  isPartOfWord: boolean;
  isSelected: boolean;
  isFound: boolean;
  wordIndex?: number;
}

interface FoundWord {
  word: string;
  cells: { row: number; col: number }[];
}

const WordSearch: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Gerar grid
  useEffect(() => {
    generateGrid();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCompleted(true);
      onComplete(score);
    }
  }, [timeLeft, isCompleted, score, onComplete]);

  const generateGrid = () => {
    const newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        isPartOfWord: false,
        isSelected: false,
        isFound: false
      }))
    );

    const placedWords: FoundWord[] = [];

    // Tentar colocar cada palavra
    words.forEach((word, wordIndex) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const direction = Math.floor(Math.random() * 8); // 8 direções
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          const cells = placeWord(newGrid, word, row, col, direction, wordIndex);
          placedWords.push({ word, cells });
          placed = true;
        }
        attempts++;
      }
    });

    // Preencher células vazias com letras aleatórias
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j].letter === '') {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (grid: Cell[][], word: string, row: number, col: number, direction: number): boolean => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const [dr, dc] = directions[direction];

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;

      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }

      const cell = grid[newRow][newCol];
      if (cell.letter !== '' && cell.letter !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (grid: Cell[][], word: string, row: number, col: number, direction: number, wordIndex: number): { row: number; col: number }[] => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const [dr, dc] = directions[direction];
    const cells: { row: number; col: number }[] = [];

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      
      grid[newRow][newCol] = {
        letter: word[i],
        isPartOfWord: true,
        isSelected: false,
        isFound: false,
        wordIndex
      };

      cells.push({ row: newRow, col: newCol });
    }

    return cells;
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells([{ row, col }]);
    updateCellSelection([{ row, col }]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
      updateCellSelection(newSelection);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      checkForWord();
      setIsDragging(false);
      setSelectedCells([]);
      clearSelection();
    }
  };

  const updateCellSelection = (cells: { row: number; col: number }[]) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => 
        row.map(cell => ({ ...cell, isSelected: false }))
      );

      cells.forEach(({ row, col }) => {
        if (newGrid[row] && newGrid[row][col]) {
          newGrid[row][col].isSelected = true;
        }
      });

      return newGrid;
    });
  };

  const clearSelection = () => {
    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(cell => ({ ...cell, isSelected: false }))
      )
    );
  };

  const checkForWord = () => {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells
      .map(({ row, col }) => grid[row][col]?.letter || '')
      .join('');

    const reverseWord = selectedWord.split('').reverse().join('');

    const foundWord = words.find(word => word === selectedWord || word === reverseWord);

    if (foundWord && !foundWords.some(fw => fw.word === foundWord)) {
      // Marcar células como encontradas
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        selectedCells.forEach(({ row, col }) => {
          newGrid[row][col] = { ...newGrid[row][col], isFound: true };
        });
        return newGrid;
      });

      const newFoundWords = [...foundWords, { word: foundWord, cells: selectedCells }];
      setFoundWords(newFoundWords);
      
      const newScore = score + foundWord.length * 10;
      setScore(newScore);

      if (newFoundWords.length === words.length) {
        setIsCompleted(true);
        onComplete(newScore + Math.floor(timeLeft / 10)); // Bônus por tempo
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrintPDF = () => {
    generateWordSearchPDF(grid, words);
  };

  if (isCompleted) {
    const finalScore = score + Math.floor(timeLeft / 10);
    const percentage = Math.round((foundWords.length / words.length) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-800 mb-4">
              🎯 Caça-Palavras Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-600">{finalScore}</div>
              <div className="text-xl text-green-700">pontos totais</div>
              <div className="text-lg text-green-600">
                {foundWords.length} de {words.length} palavras encontradas ({percentage}%)
              </div>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Palavras encontradas:
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {foundWords.map((fw, index) => (
                  <Badge key={index} className="bg-green-100 text-green-700">
                    ✓ {fw.word}
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
            <Search className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{foundWords.length}/{words.length}</div>
              <div className="text-sm text-green-600">Palavras encontradas</div>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Grid do caça-palavras */}
        <div className="lg:col-span-2">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-green-800 flex items-center justify-center gap-2">
                <Search className="w-6 h-6" />
                Caça-Palavras Ecológico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="grid gap-1 p-4 bg-green-50 rounded-lg select-none"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                        border-2 rounded transition-all duration-200 hover:scale-110
                        ${cell.isFound 
                          ? 'bg-green-500 text-white border-green-600' 
                          : cell.isSelected 
                          ? 'bg-blue-300 border-blue-500' 
                          : 'bg-white border-gray-300 hover:border-green-400'
                        }
                      `}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                    >
                      {cell.letter}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de palavras */}
        <div>
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Palavras para encontrar</CardTitle>
              <Progress value={(foundWords.length / words.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {words.map((word, index) => {
                  const isFound = foundWords.some(fw => fw.word === word);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isFound 
                          ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className={`font-medium ${isFound ? 'line-through' : ''}`}>
                        {word}
                      </span>
                      {isFound && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">Como jogar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700 space-y-2">
              <p>• Clique e arraste para selecionar palavras</p>
              <p>• As palavras podem estar em qualquer direção</p>
              <p>• Cada letra vale 10 pontos</p>
              <p>• Bônus de tempo ao finalizar!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;
