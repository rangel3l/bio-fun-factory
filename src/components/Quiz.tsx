import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Lightbulb, Printer } from 'lucide-react';
import { generateQuizPDF } from '../utils/pdfGenerator';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  keyword: string; // Palavra que será usada no caça-palavras
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é o principal gás responsável pelo efeito estufa?",
    options: ["Oxigênio", "Dióxido de carbono", "Nitrogênio", "Hidrogênio"],
    correct: 1,
    explanation: "O dióxido de carbono (CO2) é o principal gás do efeito estufa, liberado principalmente pela queima de combustíveis fósseis.",
    keyword: "CARBONO"
  },
  {
    id: 2,
    question: "O que significa sustentabilidade?",
    options: ["Usar recursos sem limites", "Atender necessidades atuais sem comprometer o futuro", "Produzir apenas energia limpa", "Reciclar todos os materiais"],
    correct: 1,
    explanation: "Sustentabilidade é atender às necessidades do presente sem comprometer a capacidade das futuras gerações.",
    keyword: "SUSTENTABILIDADE"
  },
  {
    id: 3,
    question: "Qual o principal benefício da reciclagem?",
    options: ["Reduz o custo de produtos", "Diminui a poluição e economiza recursos naturais", "Aumenta o emprego", "Melhora a aparência das cidades"],
    correct: 1,
    explanation: "A reciclagem reduz significativamente a poluição e o consumo de recursos naturais.",
    keyword: "RECICLAGEM"
  },
  {
    id: 4,
    question: "O que é biodiversidade?",
    options: ["Variedade de espécies em um ecossistema", "Quantidade de plantas", "Número de animais", "Tamanho do habitat"],
    correct: 0,
    explanation: "Biodiversidade refere-se à variedade de vida em todas as suas formas em um ecossistema.",
    keyword: "BIODIVERSIDADE"
  },
  {
    id: 5,
    question: "Qual fonte de energia é renovável?",
    options: ["Petróleo", "Carvão", "Solar", "Gás natural"],
    correct: 2,
    explanation: "A energia solar é renovável pois provém do Sol, uma fonte inesgotável na escala humana.",
    keyword: "SOLAR"
  },
  {
    id: 6,
    question: "O que causa a chuva ácida?",
    options: ["Vapor d'água", "Poluição do ar", "Radiação solar", "Vento forte"],
    correct: 1,
    explanation: "A chuva ácida é causada pela poluição do ar, especialmente por óxidos de enxofre e nitrogênio.",
    keyword: "POLUICAO"
  },
  {
    id: 7,
    question: "Qual é o principal objetivo das áreas de conservação?",
    options: ["Turismo", "Proteger ecossistemas e espécies", "Agricultura", "Mineração"],
    correct: 1,
    explanation: "As áreas de conservação visam proteger ecossistemas e preservar a biodiversidade.",
    keyword: "CONSERVACAO"
  },
  {
    id: 8,
    question: "O que é compostagem?",
    options: ["Queima de lixo", "Decomposição natural de resíduos orgânicos", "Reciclagem de plástico", "Purificação da água"],
    correct: 1,
    explanation: "Compostagem é o processo natural de decomposição de resíduos orgânicos para formar adubo.",
    keyword: "COMPOSTAGEM"
  },
  {
    id: 9,
    question: "Qual fator NÃO contribui para o desmatamento?",
    options: ["Agricultura extensiva", "Urbanização", "Reflorestamento", "Pecuária"],
    correct: 2,
    explanation: "O reflorestamento é uma prática que ajuda a combater o desmatamento, não contribui para ele.",
    keyword: "REFLORESTAMENTO"
  },
  {
    id: 10,
    question: "O que são ecossistemas?",
    options: ["Apenas animais", "Interação entre seres vivos e ambiente", "Apenas plantas", "Apenas o clima"],
    correct: 1,
    explanation: "Ecossistemas são sistemas onde seres vivos interagem entre si e com o ambiente físico.",
    keyword: "ECOSSISTEMA"
  },
  {
    id: 11,
    question: "Qual é a importância das florestas?",
    options: ["Apenas madeira", "Produção de oxigênio e absorção de CO2", "Apenas beleza", "Apenas turismo"],
    correct: 1,
    explanation: "As florestas são fundamentais por produzirem oxigênio e absorverem dióxido de carbono.",
    keyword: "FLORESTA"
  },
  {
    id: 12,
    question: "O que é pegada ecológica?",
    options: ["Tamanho do pé", "Impacto ambiental de uma pessoa", "Rastro de animais", "Área de uma floresta"],
    correct: 1,
    explanation: "Pegada ecológica mede o impacto ambiental total de uma pessoa ou atividade.",
    keyword: "PEGADA"
  },
  {
    id: 13,
    question: "Qual problema é causado pelo uso excessivo de agrotóxicos?",
    options: ["Maior produtividade", "Contaminação do solo e água", "Plantas maiores", "Mais nutrientes"],
    correct: 1,
    explanation: "O uso excessivo de agrotóxicos contamina solo, água e pode afetar a saúde humana.",
    keyword: "AGROTOXICO"
  },
  {
    id: 14,
    question: "O que caracteriza um desenvolvimento sustentável?",
    options: ["Crescimento econômico rápido", "Equilíbrio entre economia, sociedade e ambiente", "Apenas lucro", "Apenas tecnologia"],
    correct: 1,
    explanation: "Desenvolvimento sustentável equilibra crescimento econômico, bem-estar social e proteção ambiental.",
    keyword: "DESENVOLVIMENTO"
  },
  {
    id: 15,
    question: "Qual é a principal causa do aquecimento global?",
    options: ["Vulcões", "Atividades humanas", "Variação solar", "Movimento dos oceanos"],
    correct: 1,
    explanation: "As atividades humanas, especialmente a queima de combustíveis fósseis, são a principal causa.",
    keyword: "AQUECIMENTO"
  }
];

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score => score + 10);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 5) {
          console.log('Warning: Less than 5 seconds remaining!', timeLeft);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(-1); // Tempo esgotado
    }
  }, [timeLeft, showExplanation, isCompleted, handleAnswer]);

  const handlePrintPDF = () => {
    generateQuizPDF(questions);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setIsCompleted(true);
      onComplete(score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0));
    }
  };

  if (isCompleted) {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0);
    const percentage = Math.round((finalScore / (questions.length * 10)) * 100);
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-800 mb-4">
              🎉 Quiz Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-600">{finalScore}</div>
              <div className="text-xl text-green-700">pontos de {questions.length * 10} possíveis</div>
              <div className="text-lg text-green-600">{percentage}% de acertos</div>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Palavras-chave descobertas:
              </h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((q) => (
                  <Badge key={q.id} variant="secondary" className="bg-green-100 text-green-700">
                    {q.keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-green-600 mt-3">
                Essas palavras estarão nos próximos jogos!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  const isIncorrect = selectedAnswer !== null && selectedAnswer !== question.correct;

  return (
    <div className="min-h-screen">
      <div 
        className={`container mx-auto px-4 py-8 rounded-lg border-2 ${
          timeLeft <= 5 ? 'animate-warning-flash border-red-500' : 'border-transparent'
        }`}
      >
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Questão {currentQuestion + 1} de {questions.length}
            </Badge>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handlePrintPDF}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir PDF
              </Button>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                  {timeLeft}s
                </span>
              </div>
              <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                {score} pontos
              </Badge>
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
        </div>

        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800 leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showExplanation
                      ? index === question.correct
                        ? "default"
                        : index === selectedAnswer && index !== question.correct
                        ? "destructive"
                        : "outline"
                      : selectedAnswer === index
                      ? "secondary"
                      : "outline"
                  }
                  className={`text-left p-6 h-auto text-wrap justify-start transition-all duration-300 ${
                    showExplanation
                      ? index === question.correct
                        ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                        : index === selectedAnswer && index !== question.correct
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                        : "opacity-50"
                      : "hover:scale-105 hover:border-green-300"
                  }`}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold min-w-[2rem]">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className="text-lg">{option}</span>
                    {showExplanation && index === question.correct && (
                      <CheckCircle className="w-6 h-6 ml-auto" />
                    )}
                    {showExplanation && index === selectedAnswer && index !== question.correct && (
                      <XCircle className="w-6 h-6 ml-auto" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Explicação:</h4>
                    <p className="text-green-700 leading-relaxed">{question.explanation}</p>
                    <div className="mt-3">
                      <Badge className="bg-green-100 text-green-700">
                        Palavra-chave: {question.keyword}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={nextQuestion}
                  className="mt-4 bg-green-500 hover:bg-green-600"
                >
                  {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'} →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
