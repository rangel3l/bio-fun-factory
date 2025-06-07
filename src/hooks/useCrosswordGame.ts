
import { useState, useEffect } from 'react';
import { words, gridSize } from '../data/crosswordWords';

export const useCrosswordGame = (onComplete: (score: number) => void) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [isGridInitialized, setIsGridInitialized] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted && !hasGivenUp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCompleted(true);
      onComplete(score);
    }
  }, [timeLeft, isCompleted, hasGivenUp, score, onComplete]);

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

  const handleGiveUp = () => {
    console.log('handleGiveUp called - starting process');
    setHasGivenUp(true);
    setScore(0);
    
    // Criar uma nova cópia do array userInputs
    const newInputs: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    console.log('Filling grid with correct answers...');
    words.forEach((wordDef, index) => {
      const { word, startRow, startCol, direction } = wordDef;
      console.log(`Processing word ${index + 1}: ${word} at (${startRow}, ${startCol}) direction: ${direction}`);
      
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
        
        if (row < gridSize && col < gridSize) {
          newInputs[row][col] = word[i];
          console.log(`Set cell (${row}, ${col}) = ${word[i]}`);
        } else {
          console.log(`Out of bounds: (${row}, ${col}) for word ${word}`);
        }
      }
    });
    
    console.log('New inputs array:', newInputs);
    setUserInputs(newInputs);
    setCompletedWords(words.map(w => w.word));
    setIsCompleted(true);
    console.log('handleGiveUp completed');
    onComplete(0);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1 || hasGivenUp) return;
    
    const newInputs = [...userInputs];
    newInputs[row][col] = value.toUpperCase();
    setUserInputs(newInputs);
    
    checkCompletedWords(newInputs);
  };

  const checkCompletedWords = (inputs: string[][]) => {
    if (hasGivenUp) return;
    
    console.log('Checking completed words...', inputs);
    const newCompletedWords: string[] = [];

    words.forEach(wordDef => {
      const { word, startRow, startCol, direction } = wordDef;
      let isComplete = true;
      let userWord = '';
      
      console.log(`Checking word: ${word} at (${startRow}, ${startCol}) direction: ${direction}`);
      
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
        
        if (row >= gridSize || col >= gridSize) {
          console.log(`Out of bounds for ${word} at position ${i}: (${row}, ${col})`);
          isComplete = false;
          break;
        }
        
        const userChar = inputs[row] && inputs[row][col] ? inputs[row][col] : '';
        const expectedChar = word[i];
        userWord += userChar;
        
        if (userChar !== expectedChar) {
          isComplete = false;
        }
      }
      
      console.log(`Word ${word}: expected="${word}", user="${userWord}", complete=${isComplete}`);
      
      if (isComplete) {
        newCompletedWords.push(word);
      }
    });

    console.log('New completed words:', newCompletedWords);
    console.log('Previously completed words:', completedWords);

    // Encontrar palavras recém-completadas
    const justCompleted = newCompletedWords.filter(word => !completedWords.includes(word));
    
    if (justCompleted.length > 0) {
      console.log('Just completed words:', justCompleted);
      setCompletedWords(newCompletedWords);
      
      // Calcular pontos para palavras recém-completadas
      const newPoints = justCompleted.reduce((total, word) => total + (word.length * 10), 0);
      setScore(prev => {
        const newScore = prev + newPoints;
        console.log(`Score updated: ${prev} + ${newPoints} = ${newScore}`);
        return newScore;
      });
    }

    // Verificar se o jogo foi completado
    if (newCompletedWords.length === words.length && !isCompleted) {
      console.log('Game completed!');
      setIsCompleted(true);
      const finalScore = score + Math.floor(timeLeft / 15);
      onComplete(finalScore);
    }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
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
  };
};
