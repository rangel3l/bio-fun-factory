
import jsPDF from 'jspdf';

export const generateQuizPDF = (questions: any[]) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Título
  doc.setFontSize(20);
  doc.text('Quiz - Sustentabilidade e Meio Ambiente', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.text('Nome: _____________________________ Data: __________', 20, yPosition);
  yPosition += 20;

  questions.forEach((question, index) => {
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Pergunta
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
    yPosition += 10;

    // Opções
    question.options.forEach((option: string, optIndex: number) => {
      const letter = String.fromCharCode(65 + optIndex);
      doc.text(`   ${letter}) ${option}`, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 5;
  });

  // Página de respostas
  doc.addPage();
  doc.setFontSize(16);
  doc.text('GABARITO', 20, 20);
  yPosition = 40;

  questions.forEach((question, index) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }

    const correctLetter = String.fromCharCode(65 + question.correct);
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${correctLetter}) ${question.options[question.correct]}`, 20, yPosition);
    doc.setFontSize(10);
    doc.text(`Explicação: ${question.explanation}`, 25, yPosition + 5);
    yPosition += 15;
  });

  doc.save('quiz-sustentabilidade.pdf');
};

export const generateWordSearchPDF = (grid: any[][], words: string[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Caça-Palavras Ecológico', 20, 20);
  
  doc.setFontSize(12);
  doc.text('Nome: _____________________________ Data: __________', 20, 35);
  
  // Instruções
  doc.text('Encontre as palavras escondidas no caça-palavras:', 20, 50);
  doc.text('As palavras podem estar na horizontal, vertical ou diagonal.', 20, 60);
  
  // Grid
  const gridStartY = 80;
  const cellSize = 8;
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const x = 20 + col * cellSize;
      const y = gridStartY + row * cellSize;
      
      // Desenhar célula
      doc.rect(x, y, cellSize, cellSize);
      doc.text(grid[row][col]?.letter || '', x + 2, y + 6);
    }
  }
  
  // Lista de palavras
  const wordsStartY = gridStartY + (grid.length * cellSize) + 20;
  doc.text('Palavras para encontrar:', 20, wordsStartY);
  
  words.forEach((word, index) => {
    const x = 20 + (index % 3) * 60;
    const y = wordsStartY + 15 + Math.floor(index / 3) * 10;
    doc.text(`• ${word}`, x, y);
  });
  
  doc.save('caca-palavras-ecologico.pdf');
};

export const generateCrosswordPDF = () => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Palavras Cruzadas Verdes', 20, 20);
  
  doc.setFontSize(12);
  doc.text('Nome: _____________________________ Data: __________', 20, 35);
  
  // Instruções
  doc.text('Complete as palavras cruzadas com termos relacionados à sustentabilidade:', 20, 50);
  
  // Grid das palavras cruzadas (exemplo simplificado)
  const gridStartY = 70;
  const cellSize = 12;
  
  // Criar um grid exemplo 10x10
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const x = 50 + col * cellSize;
      const y = gridStartY + row * cellSize;
      
      // Algumas células ficam em branco (padrão de palavras cruzadas)
      if ((row + col) % 3 !== 0) {
        doc.rect(x, y, cellSize, cellSize);
      }
    }
  }
  
  // Dicas
  const cluesStartY = gridStartY + (10 * cellSize) + 20;
  doc.setFontSize(14);
  doc.text('HORIZONTAL:', 20, cluesStartY);
  
  const horizontalClues = [
    '1. Gás responsável pelo efeito estufa (7 letras)',
    '3. Processo de decomposição de resíduos orgânicos (11 letras)',
    '5. Fonte de energia renovável (5 letras)'
  ];
  
  horizontalClues.forEach((clue, index) => {
    doc.setFontSize(10);
    doc.text(clue, 25, cluesStartY + 10 + (index * 8));
  });
  
  doc.text('VERTICAL:', 120, cluesStartY);
  
  const verticalClues = [
    '2. Variedade de espécies (13 letras)',
    '4. Área de proteção ambiental (11 letras)',
    '6. Reutilização de materiais (9 letras)'
  ];
  
  verticalClues.forEach((clue, index) => {
    doc.setFontSize(10);
    doc.text(clue, 125, cluesStartY + 10 + (index * 8));
  });
  
  doc.save('palavras-cruzadas-verdes.pdf');
};
