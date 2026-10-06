import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion, OptionKey } from '../types/quiz';
import { KaminskiyLogo, LuxuryFlourish } from './LuxuryFlourish';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface QuizQuestionScreenProps {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  selectedOption?: OptionKey;
  onSelectOption: (key: OptionKey) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
}

export const QuizQuestionScreen: React.FC<QuizQuestionScreenProps> = ({
  question,
  currentStep,
  totalSteps,
  selectedOption,
  onSelectOption,
  onNext,
  onBack,
  onRestart,
}) => {
  const [activeHover, setActiveHover] = useState<OptionKey | null>(null);

  const handleOptionClick = (key: OptionKey) => {
    onSelectOption(key);
    // Smooth auto-advance after 280ms for delightful tactile mobile experience
    setTimeout(() => {
      onNext();
    }, 280);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-5 md:py-8 overflow-hidden bg-gradient-to-b from-[#380912] via-[#2F060E] to-[#24040A]">
      <LuxuryFlourish variant="corner-arcs" />

      {/* Top Navigation & Brand Header */}
      <header className="w-full max-w-xl flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={currentStep === 1 ? onRestart : onBack}
            className="flex items-center gap-1.5 text-xs text-[#E5D3BA]/70 hover:text-[#F5E6D3] transition-colors py-1.5 px-2.5 rounded-lg active:scale-95"
            aria-label="Назад"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-norms">{currentStep === 1 ? 'В начало' : 'Назад'}</span>
          </button>

          <KaminskiyLogo size="sm" subtitleVisible={false} />

          <div className="text-right">
            <span className="font-tercia text-xs text-[#C87D39] tracking-widest">
              {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Minimalist Champagne Progress Bar */}
        <div className="w-full h-1 bg-[#24040A] rounded-full overflow-hidden border border-[#F5E6D3]/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B86B28] via-[#C87D39] to-[#E8A15C]"
            initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </header>

      {/* Main Question & Options Area */}
      <main className="w-full max-w-xl flex flex-col items-center justify-center my-auto py-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Question Counter label */}
            <p className="text-[11px] md:text-xs text-[#C87D39] uppercase tracking-[0.25em] font-norms mb-2.5">
              Вопрос {currentStep} из {totalSteps}
            </p>

            {/* Question Text */}
            <h2 className="font-tercia text-xl sm:text-2xl md:text-3xl text-[#F5E6D3] text-center font-light leading-snug tracking-wide mb-6 md:mb-8 px-2 max-w-lg text-balance">
              {question.question}
            </h2>

            {/* Options List - Matching style from Image 1 */}
            <div className="w-full flex flex-col gap-3 sm:gap-3.5">
              {question.options.map((option) => {
                const isSelected = selectedOption === option.key;

                return (
                  <motion.button
                    key={option.key}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleOptionClick(option.key)}
                    onMouseEnter={() => setActiveHover(option.key)}
                    onMouseLeave={() => setActiveHover(null)}
                    className={`relative w-full text-left p-4 sm:p-5 rounded-2xl md:rounded-3xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 border ${
                      isSelected
                        ? 'bg-[#C87D39]/20 border-[#C87D39] shadow-lg shadow-[#C87D39]/20'
                        : activeHover === option.key
                        ? 'bg-[#4A101C]/80 border-[#F5E6D3]/40'
                        : 'bg-[#3E0C16]/60 border-[#F5E6D3]/20 hover:border-[#F5E6D3]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      {/* Letter badge (A, B, C, D) */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-tercia shrink-0 transition-colors border ${
                          isSelected
                            ? 'bg-[#C87D39] text-white border-[#C87D39]'
                            : 'bg-[#2A050D]/80 text-[#E5D3BA] border-[#F5E6D3]/20'
                        }`}
                      >
                        {option.key}
                      </span>

                      {/* Option description text */}
                      <p className="text-sm sm:text-base text-[#F5E6D3] font-norms font-normal leading-relaxed">
                        {option.text}
                      </p>
                    </div>

                    {/* Checkmark or Selection dot */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#C87D39] bg-[#C87D39] text-white'
                          : 'border-[#F5E6D3]/25 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Action Footer with Next Button (as seen in Image 1: circular button with arrow) */}
      <footer className="w-full max-w-xl flex items-center justify-between pt-3 border-t border-[#F5E6D3]/10 z-10">
        <span className="text-[11px] text-[#E5D3BA]/50 font-norms">
          Выберите подходящий вариант
        </span>

        <button
          onClick={onNext}
          disabled={!selectedOption}
          className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-200 active:scale-95 ${
            selectedOption
              ? 'bg-[#C87D39] text-white border-[#C87D39] shadow-lg shadow-[#C87D39]/30 hover:brightness-110 cursor-pointer'
              : 'bg-[#2A050D]/50 text-[#F5E6D3]/30 border-[#F5E6D3]/10 cursor-not-allowed'
          }`}
          aria-label="Следующий вопрос"
          title="Следующий вопрос"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
