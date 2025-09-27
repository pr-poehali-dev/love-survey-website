import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const LoveQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHappyAnimation, setShowHappyAnimation] = useState(false);
  const [showSadScreen, setShowSadScreen] = useState(false);
  const [showScareScreen, setShowScareScreen] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; delay: number }>>([]);

  const questions = [
    "Ты меня любишь?",
    "Ты меня ценишь?", 
    "Хочешь быть со мной?"
  ];

  const generateHearts = () => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      delay: Math.random() * 2
    }));
    setHearts(newHearts);
  };

  const handleYesClick = () => {
    setShowHappyAnimation(true);
    generateHearts();
    
    setTimeout(() => {
      setShowHappyAnimation(false);
      setHearts([]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Все вопросы отвечены положительно
        setCurrentQuestion(0);
      }
    }, 3000);
  };

  const handleNoClick = () => {
    setShowSadScreen(true);
  };

  const handleDefinitelyNo = () => {
    setShowSadScreen(false);
    setTimeout(() => {
      setShowScareScreen(true);
    }, 1000);
  };

  const handleChanged = () => {
    setShowSadScreen(false);
    setCurrentQuestion(0);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setShowHappyAnimation(false);
    setShowSadScreen(false);
    setShowScareScreen(false);
    setHearts([]);
  };

  if (showScareScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="text-center animate-bounce-in">
          <div className="text-9xl mb-8">👹</div>
          <h1 className="text-6xl md:text-8xl font-bold text-red-500 font-playfair animate-pulse">
            ПОШЕЛ В ПОПУ!
          </h1>
          <Button 
            onClick={restartQuiz}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white font-lato"
          >
            Попробовать еще раз
          </Button>
        </div>
      </div>
    );
  }

  if (showSadScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md w-full animate-scale-in bg-white/80 backdrop-blur-sm">
          <div className="text-8xl mb-6">😢</div>
          <h2 className="text-3xl font-playfair text-gray-700 mb-8">Точно?</h2>
          <div className="space-y-4">
            <Button 
              onClick={handleDefinitelyNo}
              variant="outline"
              className="w-full text-lg py-6 border-red-300 text-red-600 hover:bg-red-50 font-lato"
            >
              Точно НЕТ!
            </Button>
            <Button 
              onClick={handleChanged}
              className="w-full text-lg py-6 bg-love-pink hover:bg-love-rose text-white font-lato"
            >
              Я передумал! 💕
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-peach via-love-lavender to-love-blush flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts animation */}
      {showHappyAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute text-6xl animate-heart-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              ❤️
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-6xl md:text-8xl font-playfair text-love-rose animate-bounce-in text-center">
              Я тебя тоже!!! 💖
            </h1>
          </div>
        </div>
      )}

      {/* Main quiz content */}
      <div className={`w-full max-w-2xl text-center transition-opacity duration-500 ${showHappyAnimation ? 'opacity-20' : 'opacity-100'}`}>
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-playfair text-gray-800 mb-4 leading-tight">
            Любимый, у меня есть к тебе
          </h1>
          <h2 className="text-3xl md:text-5xl font-playfair text-love-rose">
            несколько вопросов...
          </h2>
        </div>

        <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm shadow-2xl animate-scale-in">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Icon name="Heart" className="text-love-rose w-16 h-16" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-playfair text-gray-800 mb-8">
              {questions[currentQuestion]}
            </h3>
            
            <div className="space-y-6">
              <Button 
                onClick={handleYesClick}
                className="w-full text-2xl py-8 bg-love-rose hover:bg-pink-600 text-white font-lato transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                ДА! 💕
              </Button>
              
              <Button 
                onClick={handleNoClick}
                variant="outline"
                className="w-full text-lg py-4 border-gray-300 text-gray-500 hover:bg-gray-50 font-lato text-sm opacity-60"
              >
                нет...
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion ? 'bg-love-rose' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </Card>
        
        <div className="mt-8 text-love-rose text-xl font-lato animate-pulse">
          Ответь честно... 💘
        </div>
      </div>
    </div>
  );
};

export default LoveQuiz;