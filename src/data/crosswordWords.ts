
import { WordDefinition } from '../types/crossword';

export const words: WordDefinition[] = [
  // Palavra principal horizontal no centro
  { word: 'MEIO', clue: 'Ambiente onde vivemos', startRow: 4, startCol: 2, direction: 'horizontal', number: 1 },
  
  // Palavras verticais que cruzam com MEIO
  { word: 'MAR', clue: 'Grande massa de água salgada', startRow: 4, startCol: 2, direction: 'vertical', number: 2 }, // cruza no M
  { word: 'ECO', clue: 'Prefixo relacionado à casa/ambiente', startRow: 3, startCol: 3, direction: 'vertical', number: 3 }, // cruza no E
  { word: 'RIO', clue: 'Curso de água doce', startRow: 2, startCol: 4, direction: 'vertical', number: 4 }, // cruza no I
  { word: 'SOL', clue: 'Estrela que nos fornece energia', startRow: 3, startCol: 5, direction: 'vertical', number: 5 }, // cruza no O
  
  // Palavras horizontais que cruzam com as verticais
  { word: 'VERDE', clue: 'Cor da natureza', startRow: 2, startCol: 4, direction: 'horizontal', number: 6 }, // cruza com RIO no R
  { word: 'AGUA', clue: 'Líquido essencial à vida', startRow: 6, startCol: 2, direction: 'horizontal', number: 7 }, // cruza com MAR no A
  { word: 'TERRA', clue: 'Nosso planeta', startRow: 3, startCol: 1, direction: 'horizontal', number: 8 }, // cruza com ECO no E
  
  // Palavras adicionais
  { word: 'VIDA', clue: 'Existência dos seres vivos', startRow: 0, startCol: 6, direction: 'vertical', number: 9 },
  { word: 'AR', clue: 'Mistura gasosa que respiramos', startRow: 1, startCol: 0, direction: 'horizontal', number: 10 },
  { word: 'FOLHA', clue: 'Parte verde das plantas', startRow: 5, startCol: 8, direction: 'vertical', number: 11 },
  { word: 'CASA', clue: 'Local onde moramos', startRow: 7, startCol: 3, direction: 'horizontal', number: 12 }
];

export const gridSize = 12;
