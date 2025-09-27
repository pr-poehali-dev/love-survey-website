import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const LoveQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHappyAnimation, setShowHappyAnimation] = useState(false);
  const [showSadScreen, setShowSadScreen] = useState(false);
  const [showScareScreen, setShowScareScreen] = useState(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; delay: number }>>([]);
  const [answeredYes, setAnsweredYes] = useState<boolean[]>([false, false, false]);

  const questions = [
    "Ты меня любишь?",
    "Ты меня ценишь?", 
    "Хочешь быть со мной?"
  ];

  // Звуковые эффекты
  const playSound = (type: 'yes' | 'no' | 'scare' | 'celebration') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'yes':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case 'no':
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
          break;
        case 'scare':
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1);
          break;
        case 'celebration':
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
            osc.start(audioContext.currentTime + i * 0.15);
            osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
          });
          break;
      }
    } catch (error) {
      console.log('Audio не поддерживается');
    }
  };

  const generateHearts = () => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      delay: Math.random() * 2
    }));
    setHearts(newHearts);
  };

  const handleYesClick = () => {
    playSound('yes');
    setShowHappyAnimation(true);
    generateHearts();
    
    // Отмечаем текущий вопрос как отвеченный положительно
    const newAnsweredYes = [...answeredYes];
    newAnsweredYes[currentQuestion] = true;
    setAnsweredYes(newAnsweredYes);
    
    setTimeout(() => {
      setShowHappyAnimation(false);
      setHearts([]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Все вопросы отвечены положительно - показываем финальную концовку
        setShowFinalCelebration(true);
        playSound('celebration');
      }
    }, 3000);
  };

  const handleNoClick = () => {
    playSound('no');
    setShowSadScreen(true);
  };

  const handleDefinitelyNo = () => {
    setShowSadScreen(false);
    setTimeout(() => {
      playSound('scare');
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
    setShowFinalCelebration(false);
    setHearts([]);
    setAnsweredYes([false, false, false]);
  };

  if (showFinalCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex items-center justify-center relative overflow-hidden">
        {/* Праздничные эффекты */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-heart-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: `${20 + Math.random() * 40}px`
              }}
            >
              {['❤️', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '🧡', '🤍', '🖤', '💝', '💟', '❣️'][Math.floor(Math.random() * 15)]}
            </div>
          ))}
        </div>
        
        <div className="text-center z-10 animate-bounce-in">
          <div className="text-8xl mb-6 animate-pulse">🎉✨🎊</div>
          <h1 className="text-4xl md:text-7xl font-playfair text-pink-800 mb-6 animate-scale-in">
            УРА! ТЫ ПРОШЕЛ ТЕСТ!
          </h1>
          <h2 className="text-2xl md:text-4xl font-lato text-purple-700 mb-8 animate-fade-in">
            Теперь ты официально мой любимый! 💍
          </h2>
          
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 animate-scale-in">
              <p className="text-xl font-lato text-gray-700 mb-4">
                🏆 Поздравляю! Ты получаешь:
              </p>
              <ul className="text-lg font-lato text-left space-y-2">
                <li>💋 Бесконечные поцелуи</li>
                <li>🤗 Объятия по требованию</li>
                <li>🍰 Домашние вкусняшки</li>
                <li>🎮 Совместные игры</li>
                <li>💤 Совместный сон</li>
              </ul>
            </div>
            
            <Button 
              onClick={restartQuiz}
              className="bg-pink-500 hover:bg-pink-600 text-white text-xl py-6 px-12 font-lato transform hover:scale-105 transition-all duration-200"
            >
              Пройти еще раз! 😄
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              {currentQuestion === 2 ? "И я хочу быть с тобой!!! 💖" : "Я тебя тоже!!! 💖"}
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
                className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                  answeredYes[index] 
                    ? 'bg-green-500 text-white text-xs' 
                    : index === currentQuestion 
                    ? 'bg-love-rose animate-pulse' 
                    : 'bg-gray-300'
                }`}
              >
                {answeredYes[index] && '✓'}
              </div>
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