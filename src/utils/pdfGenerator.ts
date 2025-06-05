
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

  // Adicionar créditos
  const finalPageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('Desenvolvido por Rangel Gomes | Design por Laissa Pinho e Davi Ivad', 20, finalPageHeight - 10);

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

  // Adicionar créditos
  const finalPageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('Desenvolvido por Rangel Gomes | Design por Laissa Pinho e Davi Ivad', 20, finalPageHeight - 10);
  
  doc.save('caca-palavras-ecologico.pdf');
};

export const generateCrosswordPDF = () => {
  // Criar PDF em orientação horizontal
  const doc = new jsPDF('landscape');
  
  // Título
  doc.setFontSize(20);
  doc.text('Palavras Cruzadas Verdes', 20, 20);
  
  doc.setFontSize(12);
  doc.text('Nome: _____________________________ Data: __________', 20, 35);
  
  // Instruções
  doc.text('Complete as palavras cruzadas com termos relacionados à sustentabilidade:', 20, 50);
  
  // Grid das palavras cruzadas - movido 2cm mais alto (aproximadamente 57 pontos)
  const gridStartY = 13; // Reduzido de 70 para 13 (aproximadamente 2cm mais alto)
  const gridStartX = 20;
  const cellSize = 12;
  const gridSize = 15;
  
  // Definir as palavras e suas posições (mesmas do componente)
  const words = [
    { word: 'SUSTENTABILIDADE', startRow: 2, startCol: 1, direction: 'horizontal', number: 1 },
    { word: 'RECICLAGEM', startRow: 0, startCol: 1, direction: 'vertical', number: 2 },
    { word: 'BIODIVERSIDADE', startRow: 4, startCol: 0, direction: 'horizontal', number: 3 },
    { word: 'CARBONO', startRow: 1, startCol: 5, direction: 'vertical', number: 4 },
    { word: 'AGUA', startRow: 6, startCol: 2, direction: 'horizontal', number: 5 },
    { word: 'SOLAR', startRow: 2, startCol: 7, direction: 'vertical', number: 6 },
    { word: 'FLORESTA', startRow: 8, startCol: 1, direction: 'horizontal', number: 7 },
    { word: 'POLUICAO', startRow: 1, startCol: 11, direction: 'vertical', number: 8 },
    { word: 'VERDE', startRow: 0, startCol: 9, direction: 'horizontal', number: 9 },
    { word: 'CLIMA', startRow: 5, startCol: 6, direction: 'vertical', number: 10 },
    { word: 'ECO', startRow: 7, startCol: 0, direction: 'horizontal', number: 11 },
    { word: 'OXIGENIO', startRow: 3, startCol: 13, direction: 'vertical', number: 12 },
    { word: 'TERRA', startRow: 10, startCol: 3, direction: 'horizontal', number: 13 },
    { word: 'NATUREZA', startRow: 0, startCol: 0, direction: 'vertical', number: 14 }
  ];

  // Criar grid em branco
  const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

  // Marcar células que fazem parte das palavras
  words.forEach(wordDef => {
    const { word, startRow, startCol, direction } = wordDef;
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'horizontal' ? startRow : startRow + i;
      const col = direction === 'horizontal' ? startCol + i : startCol;
      if (row < gridSize && col < gridSize) {
        grid[row][col] = true;
      }
    }
  });

  // Desenhar o grid
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = gridStartX + col * cellSize;
      const y = gridStartY + row * cellSize;
      
      if (grid[row][col]) {
        doc.rect(x, y, cellSize, cellSize);
        
        // Adicionar números das palavras que começam nesta célula
        const wordStart = words.find(w => w.startRow === row && w.startCol === col);
        if (wordStart) {
          doc.setFontSize(8);
          doc.text(wordStart.number.toString(), x + 1, y + 7);
        }
      }
    }
  }
  
  // Dicas posicionadas no topo da página (mesma linha do nome em x)
  const cluesStartX = gridStartX + (gridSize * cellSize) + 20;
  const cluesStartY = 20; // Mesma altura do título
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(14);
  doc.text('DICAS', cluesStartX, cluesStartY);
  
  let currentY = cluesStartY + 20;
  
  // Dicas horizontais
  doc.setFontSize(12);
  doc.text('HORIZONTAL:', cluesStartX, currentY);
  currentY += 10;
  
  const horizontalClues = [
    '1. Desenvolvimento que atende às necessidades presentes',
    '3. Variedade de formas de vida na Terra',
    '5. Recurso natural essencial para a vida',
    '7. Ecossistema rico em árvores',
    '9. Cor associada à natureza',
    '11. Prefixo relacionado ao meio ambiente',
    '13. Nosso planeta azul'
  ];
  
  horizontalClues.forEach((clue, index) => {
    // Verificar se precisa quebrar a página
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(9);
    doc.text(clue, cluesStartX, currentY);
    currentY += 10;
  });
  
  currentY += 10; // Espaço entre seções
  
  // Dicas verticais
  doc.setFontSize(12);
  // Verificar se precisa quebrar a página
  if (currentY > pageHeight - 30) {
    doc.addPage();
    currentY = 20;
  }
  doc.text('VERTICAL:', cluesStartX, currentY);
  currentY += 10;
  
  const verticalClues = [
    '2. Processo de transformação de resíduos',
    '4. Principal elemento do efeito estufa',
    '6. Energia renovável do sol',
    '8. Contaminação do meio ambiente',
    '10. Condições atmosféricas',
    '12. Gás vital das plantas',
    '14. Conjunto de seres vivos'
  ];
  
  verticalClues.forEach((clue, index) => {
    // Verificar se precisa quebrar a página
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(9);
    doc.text(clue, cluesStartX, currentY);
    currentY += 10;
  });

  // Adicionar créditos
  const finalPageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('Desenvolvido por Rangel Gomes | Design por Laissa Pinho e Davi Ivad', 20, finalPageHeight - 10);
  
  doc.save('palavras-cruzadas-verdes.pdf');
};
