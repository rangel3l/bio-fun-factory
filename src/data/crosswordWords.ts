
import { WordDefinition } from '../types/crossword';

export const words: WordDefinition[] = [
  { word: 'SUSTENTAVEL', clue: 'Desenvolvimento que atende às necessidades presentes sem comprometer o futuro', startRow: 2, startCol: 1, direction: 'horizontal', number: 1 },
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

export const gridSize = 15;
