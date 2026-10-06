import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { PROJECT_LINKS } from '../data/quizData';

interface WebsiteFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  inactivityLimitMs?: number;
}

export const WebsiteFrameModal: React.FC<WebsiteFrameModalProps> = ({
  isOpen,
  onClose,
  inactivityLimitMs = 10000,
}) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [progressPercent, setProgressPercent] = useState(100);
  const [iframeKey, setIframeKey] = useState(0);
  const lastActivityRef = useRef(Date.now());

  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    setProgressPercent(100);
    setTimeLeft(10);
  };

  useEffect(() => {
    if (!isOpen) return;

    resetActivity();

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, inactivityLimitMs - elapsed);
      const pct = (remaining / inactivityLimitMs) * 100;
      setProgressPercent(pct);
      setTimeLeft(Math.max(1, Math.ceil(remaining / 1000)));

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, inactivityLimitMs, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none"
      onClick={onClose}
    >
      {/* Browser/Device Frame in Kaminskiy Brandbook Palette */}
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => {
          e.stopPropagation();
          resetActivity();
        }}
        onPointerMove={resetActivity}
        onTouchStart={resetActivity}
        className="relative w-full max-w-5xl h-[92vh] sm:h-[94vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#25030A] border border-[#DE6C35]/40 shadow-2xl flex flex-col"
      >
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-[#380812] border-b border-[#F5E5D3]/15 text-xs text-[#F5E5D3]">
          {/* Left: SSL and Address */}
          <div className="flex items-center gap-2 max-w-[55%] sm:max-w-md truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE6C35] shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A0207] border border-[#F5E5D3]/20 text-[11px] text-[#F5E5D3] font-norms truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DE6C35] shrink-0" />
              <span className="truncate tracking-wide">wwgroup.ru/kaminskiy</span>
            </div>
            <button
              onClick={() => {
                setIframeKey((prev) => prev + 1);
                resetActivity();
              }}
              className="p-1 rounded-full hover:bg-white/10 text-[#F5E5D3]/70 transition-colors cursor-pointer"
              title="Обновить страницу"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center / Right: Auto-close timer indicator & External link */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#200308] border border-[#DE6C35]/40 text-[11px] font-norms text-[#F5E5D3] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE6C35] animate-ping" />
              <span>
                Закрытие: <strong className="text-white font-mono">{timeLeft}с</strong>
              </span>
            </div>

            <a
              href={PROJECT_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={resetActivity}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE6C35] hover:bg-[#E87A44] text-[#F5E5D3] text-[11px] font-norms font-medium tracking-wider uppercase transition-colors"
              title="Открыть на сайте"
            >
              <span>Сайт</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#200308] hover:bg-[#4E0E1B] text-[#F5E5D3] flex items-center justify-center transition-colors cursor-pointer border border-[#F5E5D3]/20 shrink-0"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Depleting Countdown Progress Bar (Убывающая полоска обратного отсчета) */}
        <div className="w-full h-1 bg-[#1A0207] relative overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#DE6C35] via-[#C89D58] to-[#DE6C35] transition-[width] duration-100 ease-linear shadow-[0_0_8px_rgba(222,108,53,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Iframe Frame Body */}
        <div className="relative flex-1 w-full h-full bg-[#120104] overflow-hidden">
          <iframe
            key={iframeKey}
            src="/proxy-site"
            className="w-full h-full border-0 bg-[#120104]"
            title="Официальный сайт делового центра Каминский"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            loading="eager"
          />

          {/* Touch interaction overlay */}
          <div
            className="absolute bottom-0 inset-x-0 h-10 pointer-events-none flex items-center justify-center bg-gradient-to-t from-black/85 to-transparent"
          >
            <span className="text-[10px] text-[#F5E5D3]/60 font-norms">
              Коснитесь экрана для продления времени просмотра
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
