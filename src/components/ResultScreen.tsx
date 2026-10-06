import React from 'react';
import { motion } from 'motion/react';
import { QuizResult, OptionKey } from '../types/quiz';
import { KaminskiyLogo, LuxuryFlourish } from './LuxuryFlourish';
import { BackgroundPhotoSlider } from './BackgroundPhotoSlider';
import { Check, ArrowRight } from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  userAnswers: Record<number, OptionKey>;
  onLeadSubmitted: (leadData: { name: string; phone: string; company: string }) => void;
  onSkipToFinal: () => void;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onSkipToFinal,
  onRestart,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-6 md:py-8 overflow-y-auto">
      {/* Living Background Slider with 4s smooth fade */}
      <BackgroundPhotoSlider intervalMs={7000} />
      <LuxuryFlourish variant="corner-arcs" className="z-10 pointer-events-none" />

      {/* Main Result Presentation Container (Cleanly focused per Screenshot 1) */}
      <main className="w-full max-w-xl flex flex-col items-center z-10 my-auto pt-2">
        
        {/* Category Label */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-1.5"
        >
          <span className="text-[11px] md:text-xs text-[#C87D39] tracking-[0.25em] uppercase font-norms font-medium drop-shadow">
            ВАШ ПЕРСОНАЛЬНЫЙ РЕЗУЛЬТАТ
          </span>
        </motion.div>

        {/* Main Result Headline (One of 4 archetypes) */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-tercia text-2xl sm:text-3xl md:text-4xl text-[#F5E6D3] text-center font-light tracking-wide leading-tight uppercase mb-3 text-balance drop-shadow-lg"
        >
          ВАША РОСКОШЬ — {result.title}
        </motion.h1>

        {/* Archetype Subtitle & Rich Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full text-center max-w-lg mb-5"
        >
          <p className="text-sm sm:text-base text-[#E8A15C] font-norms font-medium leading-relaxed mb-2 drop-shadow">
            {result.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#D1BEA8] font-norms leading-relaxed drop-shadow">
            {result.summary}
          </p>
        </motion.div>

        {/* 3 Pillars of this Archetype (with checkmarks, as marked by green checkmark in Screenshot 3) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full flex flex-col gap-2.5 mb-6"
        >
          {result.details.map((detail, idx) => (
            <div
              key={idx}
              className="liquid-glass rounded-2xl p-3 flex items-start gap-2.5 text-left"
            >
              <div className="liquid-edge-glow" />
              <div className="w-5 h-5 rounded-full bg-[#C87D39]/30 text-[#C87D39] border border-[#C87D39]/50 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm text-[#F5E6D3] font-norms leading-snug">
                {detail}
              </p>
            </div>
          ))}
        </motion.div>

        {/* TRANSITION CARD (Screenshot 4: Clean, punchy question card with CTA button) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="liquid-glass liquid-glass-interactive rounded-3xl w-full p-5 sm:p-6 text-center cursor-pointer border border-[#C87D39]/40 hover:border-[#C87D39] transition-all group"
          onClick={onSkipToFinal}
        >
          <div className="liquid-edge-glow" />

          <h2 className="font-tercia text-xl sm:text-2xl text-[#F5E6D3] font-light leading-snug tracking-wide uppercase max-w-md mx-auto text-balance mb-4 drop-shadow">
            А ЧТО, ЕСЛИ ВСЁ УЖЕ ЕСТЬ В ОДНОМ ПРОЕКТЕ?
          </h2>

          <div className="relative overflow-hidden inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-gradient-to-r from-[#C87D39] via-[#DE6C35] to-[#B86B28] group-hover:brightness-110 text-[#F5E6D3] font-norms font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase transition-all shadow-[0_8px_24px_rgba(222,108,53,0.35)] border border-[#F5E6D3]/40">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <span>УЗНАТЬ О ПРОЕКТЕ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </main>

      {/* Spacer footer to keep balanced layout */}
      <footer className="w-full max-w-xl z-10 py-1" />
    </div>
  );
};
