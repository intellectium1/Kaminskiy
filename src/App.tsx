/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivationScreen } from './components/ActivationScreen';
import { QuizQuestionScreen } from './components/QuizQuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { FinalProjectScreen } from './components/FinalProjectScreen';
import { CrmModal } from './components/CrmModal';
import { PlansCatalogModal } from './components/PlansCatalogModal';
import { QUIZ_QUESTIONS, calculateQuizResult, QUIZ_RESULTS } from './data/quizData';
import { OptionKey, QuizResult } from './types/quiz';
import { CrmStorage } from './services/crmStorage';

type ScreenStep = 'activation' | 'quiz' | 'result' | 'final';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenStep>('activation');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [activeResult, setActiveResult] = useState<QuizResult>(QUIZ_RESULTS.status_recognition);
  const [leadData, setLeadData] = useState<{ name: string; phone: string; company?: string } | null>(null);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  // Track initial page view on mount
  useEffect(() => {
    CrmStorage.trackScreenView();
  }, []);

  // Start the quiz from activation screen
  const handleStartQuiz = () => {
    CrmStorage.trackQuizStart();
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentScreen('quiz');
  };

  // Answer selection
  const handleSelectOption = (key: OptionKey) => {
    const qId = QUIZ_QUESTIONS[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: key }));
    CrmStorage.trackAnswer(qId, key);
  };

  // Next question or calculate result
  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all 8 questions! Calculate result among the 8 profiles
      const calculated = calculateQuizResult(answers);
      setActiveResult(calculated);
      CrmStorage.trackQuizCompleted(calculated.id);
      setCurrentScreen('result');
    }
  };

  // Back to previous question
  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Restart quiz completely
  const handleRestartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setLeadData(null);
    setCurrentScreen('activation');
  };

  // Lead successfully submitted
  const handleLeadSubmitted = (data: { name: string; phone: string; company: string }) => {
    setLeadData(data);
    setCurrentScreen('final');
  };

  // Skip to final project screen without form
  const handleSkipToFinal = () => {
    setCurrentScreen('final');
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const selectedOptionForCurrentQ = answers[currentQuestion?.id];

  return (
    <div className={`min-h-screen w-full ${currentScreen === 'activation' ? 'bg-[#1A0207]' : 'bg-[#380912]'} text-[#F5E6D3] flex flex-col font-norms selection:bg-[#C87D39] selection:text-white relative`}>
      {/* View routing */}
      {currentScreen === 'activation' && (
        <ActivationScreen
          onStartQuiz={handleStartQuiz}
          onOpenCrm={() => setIsCrmOpen(true)}
          onOpenPlans={() => setIsPlansOpen(true)}
        />
      )}

      {currentScreen === 'quiz' && currentQuestion && (
        <QuizQuestionScreen
          question={currentQuestion}
          currentStep={currentQuestionIndex + 1}
          totalSteps={QUIZ_QUESTIONS.length}
          selectedOption={selectedOptionForCurrentQ}
          onSelectOption={handleSelectOption}
          onNext={handleNextQuestion}
          onBack={handleBackQuestion}
          onRestart={handleRestartQuiz}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          result={activeResult}
          userAnswers={answers}
          onLeadSubmitted={handleLeadSubmitted}
          onSkipToFinal={handleSkipToFinal}
          onRestart={handleRestartQuiz}
        />
      )}

      {currentScreen === 'final' && (
        <FinalProjectScreen
          result={activeResult}
          leadInfo={leadData}
          onRestartQuiz={handleRestartQuiz}
          onOpenPlans={() => setIsPlansOpen(true)}
          inactivitySeconds={CrmStorage.getSettings().inactivityTimeoutSeconds}
        />
      )}

      {/* Floor Plans & Lots Catalog Modal */}
      <PlansCatalogModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
      />

      {/* CRM & Analytics Modal (available from secret logo tap or footer) */}
      <CrmModal isOpen={isCrmOpen} onClose={() => setIsCrmOpen(false)} />
    </div>
  );
}
