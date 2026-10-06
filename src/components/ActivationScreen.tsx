import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KaminskiyLogo, LuxuryFlourish } from './LuxuryFlourish';
import { BackgroundPhotoSlider } from './BackgroundPhotoSlider';
import { ArrowRight, Clock, Building2, Award, History, Shield } from 'lucide-react';

interface ActivationScreenProps {
  onStartQuiz: () => void;
  onOpenCrm: () => void;
  onOpenPlans?: () => void;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({ onStartQuiz, onOpenCrm, onOpenPlans }) => {
  const [logoClicks, setLogoClicks] = useState<number>(0);

  // Discreet secret access for staff/managers: tapping logo 3 times opens CRM
  const handleLogoSecretTap = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      setLogoClicks(0);
      onOpenCrm();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 md:py-12 overflow-hidden select-none">
      {/* 1. SEAMLESS LIVING BACKGROUND PHOTO SLIDER (Photos cross-fade automatically, sharp & vibrant, no UI controls) */}
      <BackgroundPhotoSlider intervalMs={5500} />

      {/* Decorative architectural corner lines */}
      <LuxuryFlourish variant="corner-arcs" className="z-10 pointer-events-none" />

      {/* Top Header / Brand Logo */}
      <header className="relative w-full max-w-xl flex flex-col items-center text-center z-10 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="cursor-pointer"
          onClick={handleLogoSecretTap}
          title="Деловой центр Каминский"
        >
          <KaminskiyLogo size="lg" />
        </motion.div>
      </header>

      {/* Center Main Stage (Ultra-Clean, Grand, Focused on Lead-In) */}
      <main className="relative w-full max-w-xl flex flex-col items-center text-center z-10 my-auto py-4">
        
        {/* Refined Smaller Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-4 max-w-md"
        >
          <p className="text-[11px] sm:text-xs text-[#E5D3BA]/85 uppercase tracking-[0.22em] font-norms drop-shadow">
            Премиальный деловой центр
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#E5D3BA]/65 tracking-wider font-norms mt-0.5 drop-shadow">
            с сервисом уровня пятизвёздочного отеля
          </p>
        </motion.div>

        {/* MAIN QUESTION: LARGER & SOFTLY PULSING WITH BREATHING LUXURY GLOW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="my-3 sm:my-6 px-2 w-full"
        >
          <h1 className="animate-question-pulse font-tercia text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5E6D3] font-light leading-tight tracking-[0.06em] uppercase max-w-xl mx-auto text-balance drop-shadow-lg">
            А ЧТО ДЛЯ ВАС РОСКОШЬ?
          </h1>
          <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C87D39] to-transparent mx-auto mt-4 opacity-80" />
        </motion.div>

        {/* Invitation Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-sm sm:text-base text-[#D1BEA8] font-norms max-w-md mx-auto leading-relaxed mb-8 drop-shadow"
        >
          Пройдите короткий тест из 8 вопросов и узнайте свой персональный сценарий роскоши.
        </motion.p>

        {/* Start Button: Liquid Glass Specular Edge + Copper Gold Core */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="w-full max-w-xs flex flex-col items-center relative"
        >
          <button
            onClick={onStartQuiz}
            className="relative overflow-hidden w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#C87D39] via-[#DE6C35] to-[#B86B28] hover:brightness-110 text-white font-norms font-semibold text-base tracking-[0.14em] uppercase shadow-[0_12px_32px_rgba(222,108,53,0.45),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-[#F5E6D3]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {/* Liquid edge light glint */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <span>НАЧАТЬ ТЕСТ</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <p className="text-[11px] text-[#F5E6D3]/75 font-norms mt-3 tracking-wider flex items-center gap-1.5 drop-shadow">
            <Clock className="w-3 h-3 text-[#DE6C35]" />
            <span>Займёт менее 2 минут · 8 вопросов</span>
          </p>
        </motion.div>
      </main>

      {/* Footer Trust Markers (Unboxed clean luxury typography) */}
      <footer className="relative w-full max-w-xl z-10 pt-4 pb-2 border-t border-[#F5E6D3]/15 flex items-center justify-between text-[11px] text-[#E5D3BA]/60 font-norms">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mx-auto text-center">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#C87D39]" /> 22 клубных лота
          </span>
          <span aria-hidden="true" className="text-[#C87D39]/60">·</span>
          <span>Особняк 1887 г.</span>
          <span aria-hidden="true" className="text-[#C87D39]/60">·</span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3 text-[#C87D39]" /> Консьерж 5★
          </span>
          <span aria-hidden="true" className="text-[#C87D39]/60">·</span>
          <span>Центр Москвы</span>
        </div>

        {/* Discreet management trigger (small quiet shield for staff without disturbing buyers) */}
        <button
          onClick={onOpenCrm}
          className="opacity-30 hover:opacity-100 transition-opacity p-1 text-[#E5D3BA] cursor-pointer shrink-0 ml-2"
          title="CRM и аналитика"
          aria-label="CRM"
        >
          <Shield className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
};
