'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Shield, Award, AlertTriangle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/constants';
import Link from 'next/link';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export default function QuizPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const filteredQuestions = difficulty 
    ? QUIZ_QUESTIONS.filter((q: any) => q.difficulty === difficulty) 
    : [];

  const handleStart = (level: Difficulty) => {
    setDifficulty(level);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsFinished(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);
    
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400);
    } else {
      setTimeout(() => setIsFinished(true), 400);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === filteredQuestions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsFinished(false);
  };

  if (!difficulty) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <HelpCircle className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Awareness Quiz</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-8 backdrop-blur-xl"
        >
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <Shield className="w-16 h-16 text-cyan-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Test Your Knowledge</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Evaluate your understanding of common security threats, best practices, and protective measures. Choose a difficulty level to begin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleStart(level)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 group"
                >
                  {level}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    
    let rating = { text: 'Needs Improvement', color: 'text-red-500', icon: AlertTriangle };
    if (percentage >= 80) rating = { text: 'Security Expert', color: 'text-emerald-500', icon: Award };
    else if (percentage >= 60) rating = { text: 'Good Awareness', color: 'text-amber-500', icon: Shield };

    const RatingIcon = rating.icon;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-8 text-center backdrop-blur-xl"
        >
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle className="text-gray-200 dark:text-gray-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
              <circle 
                className="text-cyan-500 transition-all duration-1000 ease-out" 
                strokeWidth="8" 
                strokeDasharray={364} 
                strokeDashoffset={364 - (364 * percentage) / 100}
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="58" cx="64" cy="64" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You scored {score} out of {filteredQuestions.length} correct.</p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 ${rating.color}`}>
            <RatingIcon className="w-5 h-5" />
            <span className="font-medium">{rating.text}</span>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={resetQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-medium shadow-lg shadow-cyan-500/20"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white px-2">Review Answers</h3>
          {filteredQuestions.map((q: any, i: number) => {
            const userAnswer = selectedAnswers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="font-medium text-gray-900 dark:text-white text-lg">{q.question}</p>
                    
                    <div className="grid gap-2">
                      <div className={`p-3 rounded-lg text-sm flex items-center justify-between ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'}`}>
                        <span><strong>Your answer:</strong> {q.options[userAnswer]}</span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-3 rounded-lg text-sm flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          <span><strong>Correct answer:</strong> {q.options[q.correctAnswer]}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = filteredQuestions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-cyan-500 mb-2 block">{difficulty} Level</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question {currentQuestionIndex + 1} of {filteredQuestions.length}</h1>
        </div>
        <button 
          onClick={resetQuiz}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Exit Quiz
        </button>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-cyan-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIndex) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-8 backdrop-blur-xl"
        >
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option: string, index: number) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                    ${isSelected 
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-cyan-500/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  <span className="font-medium text-lg">{option}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-cyan-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-cyan-500/50'}
                  `}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
