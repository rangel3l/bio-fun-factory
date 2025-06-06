
export interface WordDefinition {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical';
  number: number;
}

export interface CrosswordProps {
  onComplete: (score: number) => void;
}
