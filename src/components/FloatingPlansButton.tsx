import React from 'react';
import { motion } from 'motion/react';
import { Building2, Layers } from 'lucide-react';

interface FloatingPlansButtonProps {
  onClick: () => void;
  availableCount?: number;
}

export const FloatingPlansButton: React.FC<FloatingPlansButtonProps> = ({
  onClick,
  availableCount = 8,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2A050D] via-[#3E0C16] to-[#24040A] text-[#F5E6D3] border border-[#C87D39]/60 shadow-2xl hover:border-[#C87D39] transition-all cursor-pointer backdrop-blur-md group"
      title="Посмотреть планировки свободных лотов в наличии"
      aria-label="Помещения в наличии"
    >
      {/* Icon with subtle luxury pulse */}
      <div className="relative w-8 h-8 rounded-full bg-[#C87D39] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#C87D39]/40 group-hover:bg-[#DA8F4B] transition-colors">
        <Layers className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
      </div>

      {/* Label and Badge */}
      <div className="text-left font-norms">
        <p className="text-xs sm:text-sm font-semibold tracking-tight text-white leading-tight">
          Помещения в наличии
        </p>
        <p className="text-[10px] text-[#E8A15C] leading-none mt-0.5">
          {availableCount} свободных лотов · Планировки
        </p>
      </div>
    </motion.button>
  );
};
