
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Quiz from '../components/Quiz';
import WordSearch from '../components/WordSearch';
import Crossword from '../components/Crossword';
import { Leaf, Brain, Target, Trophy, BookOpen, Users } from 'lucide-react';

const Index = () => {
  const [activeGame, setActiveGame] = useState<'home' | 'quiz' | 'wordsearch' | 'crossword'>('home');
  const [totalScore, setTotalScore] = useState(0);
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  const games = [
    {
      id: 'quiz',
      title: 'Quiz Sustentabilidade',
      description: 'Teste seus conhecimentos sobre meio ambiente e sustentabilidade',
      icon: Brain,
      color: 'bg-emerald-500',
      completed: completedGames.includes('quiz')
    },
    {
      id: 'wordsearch',
      title: 'Caça-Palavras Ecológico',
      description: 'Encontre termos importantes sobre ecologia e conservação',
      icon: Target,
      color: 'bg-teal-500',
      completed: completedGames.includes('wordsearch')
    },
    {
      id: 'crossword',
      title: 'Palavras Cruzadas Verdes',
      description: 'Complete as palavras cruzadas sobre biodiversidade',
      icon: BookOpen,
      color: 'bg-green-500',
      completed: completedGames.includes('crossword')
    }
  ];

  const handleGameComplete = (gameId: string, score: number) => {
    setTotalScore(prev => prev + score);
    setCompletedGames(prev => [...prev.filter(id => id !== gameId), gameId]);
    setActiveGame('home');
  };

  if (activeGame !== 'home') {
    const GameComponent = {
      quiz: Quiz,
      wordsearch: WordSearch,
      crossword: Crossword
    }[activeGame];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveGame('home')}
              className="hover:bg-green-50"
            >
              ← Voltar ao Menu
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Pontos: {totalScore}
              </Badge>
            </div>
          </div>
          <GameComponent onComplete={(score: number) => handleGameComplete(activeGame, score)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">BioCiência Interativa</h1>
                <p className="text-green-600">Sustentabilidade e Meio Ambiente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="w-5 h-5 mr-2" />
                {totalScore} pontos
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Users className="w-5 h-5 mr-2" />
                {completedGames.length}/3 jogos
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-800 mb-6 animate-fade-in">
            Aprenda Biologia de Forma Divertida!
          </h2>
          <p className="text-xl text-green-600 max-w-3xl mx-auto mb-8 animate-fade-in">
            Explore conceitos importantes sobre sustentabilidade, conservação e meio ambiente 
            através de jogos educativos interativos. Perfeito para estudantes e visitantes!
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full animate-scale-in"></div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-12 border-green-200 bg-white/60 backdrop-blur-sm animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Trophy className="w-6 h-6" />
              Seu Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-green-700">Jogos Completados</span>
                  <span className="font-bold text-green-800">{completedGames.length}/3</span>
                </div>
                <Progress 
                  value={(completedGames.length / 3) * 100} 
                  className="h-3"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {games.map((game) => (
                  <div key={game.id} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      game.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <game.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm ${game.completed ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                      {game.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-green-200 bg-white/60 backdrop-blur-sm hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setActiveGame(game.id as any)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${game.color} group-hover:scale-110 transition-transform duration-300`}>
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-800 group-hover:text-green-600 transition-colors">
                  {game.title}
                </CardTitle>
                <CardDescription className="text-green-600">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {game.completed && (
                  <Badge className="mb-4 bg-green-100 text-green-700 border-green-300">
                    ✓ Concluído
                  </Badge>
                )}
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3"
                  size="lg"
                >
                  {game.completed ? 'Jogar Novamente' : 'Começar Jogo'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="border-green-200 bg-white/60 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-green-800 text-2xl">
              Sobre Este Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-green-700 text-lg max-w-2xl mx-auto">
              Este material didático interativo foi desenvolvido como atividade de extensão 
              para tornar o aprendizado de biologia mais envolvente e acessível. 
              Ideal para visitas escolares e atividades educativas sobre sustentabilidade!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
