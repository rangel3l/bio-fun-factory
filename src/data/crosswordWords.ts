
import { WordDefinition } from '../types/crossword';

export const words: WordDefinition[] = [
  // Palavra principal horizontal no centro
  { word: 'NATUREZA', clue: 'Conjunto de todos os seres vivos e não vivos', startRow: 5, startCol: 2, direction: 'horizontal', number: 1 },
  
  // Palavras verticais que cruzam com NATUREZA
  { word: 'AGUA', clue: 'Recurso natural essencial para a vida', startRow: 3, startCol: 2, direction: 'vertical', number: 2 }, // cruza no N
  { word: 'TERRA', clue: 'Nosso planeta azul', startRow: 4, startCol: 4, direction: 'vertical', number: 3 }, // cruza no T
  { word: 'VERDE', clue: 'Cor associada à sustentabilidade', startRow: 2, startCol: 6, direction: 'vertical', number: 4 }, // cruza no R
  { word: 'SOLAR', clue: 'Energia renovável do sol', startRow: 4, startCol: 8, direction: 'vertical', number: 5 }, // cruza no Z
  
  // Palavras horizontais que cruzam com as verticais
  { word: 'ECO', clue: 'Prefixo relacionado ao meio ambiente', startRow: 2, startCol: 6, direction: 'horizontal', number: 6 }, // cruza com VERDE no E
  { word: 'AR', clue: 'Mistura de gases que respiramos', startRow: 3, startCol: 1, direction: 'horizontal', number: 7 }, // cruza com AGUA no A
  { word: 'CLIMA', clue: 'Condições atmosféricas de uma região', startRow: 6, startCol: 3, direction: 'horizontal', number: 8 }, // cruza com TERRA no L
  
  // Palavras adicionais para completar o grid
  { word: 'OXIGENIO', clue: 'Gás vital produzido pelas plantas', startRow: 0, startCol: 7, direction: 'vertical', number: 9 },
  { word: 'FLORESTA', clue: 'Ecossistema rico em árvores', startRow: 1, startCol: 0, direction: 'horizontal', number: 10 },
  { word: 'RECICLAR', clue: 'Transformar resíduos em novos produtos', startRow: 7, startCol: 1, direction: 'horizontal', number: 11 },
  
  // Palavra vertical longa à direita
  { word: 'SUSTENTAVEL', clue: 'Desenvolvimento que preserva o futuro', startRow: 0, startCol: 10, direction: 'vertical', number: 12 }
];

export const gridSize = 15;
