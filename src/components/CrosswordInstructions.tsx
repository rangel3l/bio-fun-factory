
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { words } from '../data/crosswordWords';

const CrosswordInstructions: React.FC = () => {
  return (
    <Card className="border-green-200 bg-white/80 backdrop-blur-sm mt-6">
      <CardHeader>
        <CardTitle className="text-green-800 text-lg">Como jogar</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-green-700 space-y-2">
        <p>• Digite uma letra por célula</p>
        <p>• Use as dicas para encontrar as palavras</p>
        <p>• Palavras se cruzam nas letras em comum</p>
        <p>• Complete todas as {words.length} palavras para ganhar pontos!</p>
      </CardContent>
    </Card>
  );
};

export default CrosswordInstructions;
