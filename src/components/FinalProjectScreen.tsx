import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { KaminskiyLogo, LuxuryFlourish } from './LuxuryFlourish';
import { BackgroundPhotoSlider } from './BackgroundPhotoSlider';
import { WebsiteFrameModal } from './WebsiteFrameModal';
import { PresentationFrameModal } from './PresentationFrameModal';
import { PROJECT_LINKS } from '../data/quizData';
import { QuizResult } from '../types/quiz';
import {
  Download,
  ExternalLink,
  RotateCcw,
  MessageCircle,
  Phone,
} from 'lucide-react';

interface FinalProjectScreenProps {
  result?: QuizResult;
  leadInfo?: { name: string; phone: string; company?: string } | null;
  onRestartQuiz: () => void;
  onOpenPlans?: () => void;
  inactivitySeconds?: number;
}

const PROJECT_PILLARS = [
  {
    id: 'lots',
    title: '22 камерных лота',
    desc: 'Форматы под разные сценарии: от компактного офиса для собственной команды до двухуровневого представительского пространства уровня штаб-квартиры.',
    badge: 'Площади от 85 до 290 м²',
  },
  {
    id: 'mansion',
    title: 'Особняк 1887 года',
    desc: 'Наследие архитектора Александра Каминского. Большой стеклянный купол на втором этаже, высокие потолки до 4.2 м и метровые кирпичные стены.',
    badge: 'Стеклянный купол и атриум',
  },
  {
    id: 'service',
    title: 'Сервис уровня 5★ отеля',
    desc: 'Консьерж-служба, персональный батлер, представительский этикет встречи гостей, организация доставок и решение бытовых поручений без ваших звонков.',
    badge: '100% делегирование рутины',
  },
  {
    id: 'privacy',
    title: 'Гастрономия и приватность',
    desc: 'Закрытый клубный доступ для резидентов, ресторанные концепции внутри здания, приватные переговорные капсулы и автономные входы.',
    badge: 'Абсолютный суверенитет',
  },
];

export const FinalProjectScreen: React.FC<FinalProjectScreenProps> = ({
  onRestartQuiz,
  inactivitySeconds = 75,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);

  // In-app Frame Modals with 10s auto-close and depleting countdown bar
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Endless News-Ticker Slider: 6 SECONDS INTERVAL per requirement 2
  useEffect(() => {
    if (isPaused || showPresentationModal || showWebsiteModal) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActivePillarIdx((prev) => (prev + 1) % PROJECT_PILLARS.length);
    }, 6000); // 6 seconds

    return () => clearInterval(timer);
  }, [isPaused, showPresentationModal, showWebsiteModal]);

  // Overall inactivity reset on idle
  useEffect(() => {
    if (showPresentationModal || showWebsiteModal) return;

    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onRestartQuiz();
      }, inactivitySeconds * 1000);
    };

    resetTimer();
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [inactivitySeconds, onRestartQuiz, showPresentationModal, showWebsiteModal]);

  const handlePrev = () => {
    setDirection(-1);
    setActivePillarIdx((prev) => (prev - 1 + PROJECT_PILLARS.length) % PROJECT_PILLARS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActivePillarIdx((prev) => (prev + 1) % PROJECT_PILLARS.length);
  };

  // Mobile swipe gestures
  const onTouchStartHandler = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEndHandler = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 28) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -28 || info.velocity.x < -150) {
      handleNext();
    } else if (info.offset.x > 28 || info.velocity.x > 150) {
      handlePrev();
    }
  };

  const currentPillar = PROJECT_PILLARS[activePillarIdx];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-4 sm:py-6 overflow-x-hidden select-none"
    >
      {/* Living background photo slider (smooth 4s fade) */}
      <BackgroundPhotoSlider intervalMs={7000} />
      <LuxuryFlourish variant="corner-arcs" className="z-10 pointer-events-none" />

      {/* COMPOSITION CONTAINER: Exact 1/3 Header & 2/3 Text Block alignment */}
      <div className="w-full max-w-xl flex flex-col items-center z-10 my-auto">
        
        {/* UPPER 1/3 ZONE: HEADER (Logo positioned on the top 1/3 of the space) */}
        <header className="w-full flex flex-col items-center text-center pt-1 pb-3 sm:pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <KaminskiyLogo size="md" subtitleVisible={true} />
          </motion.div>
        </header>

        {/* LOWER 2/3 ZONE: TEXT BLOCK (Centered on the lower 2/3 line) */}
        <div className="w-full flex flex-col items-center text-center mb-5 sm:mb-6 px-1">
          {/* Headline «КОНЦЕПЦИЯ КЛУБНОГО ДЕЛОВОГО ОСОБНЯКА» */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full mb-3"
          >
            <h1 className="font-tercia text-lg sm:text-xl md:text-2xl text-[#F5E6D3] uppercase tracking-[0.20em] font-normal leading-snug drop-shadow">
              КОНЦЕПЦИЯ КЛУБНОГО ДЕЛОВОГО ОСОБНЯКА
            </h1>
            <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C87D39] to-transparent mx-auto mt-2 opacity-80" />
          </motion.div>

          {/* Main Text (Large, elegant body text) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-lg"
          >
            <p className="text-sm sm:text-base md:text-[17px] text-[#D1BEA8] font-norms leading-relaxed drop-shadow">
              «Каминский» — редевелопмент исторического особняка в центре Москвы, где премиальный офис
              встречается с принципами пятизвёздочного гостеприимства. Роскошь, созданная вокруг вас.
            </p>
          </motion.div>
        </div>

        {/* SLIDER CARD: ENDLESS NEWS-TICKER STYLE (6s rotation, buttons removed, lighter & sleek) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStartHandler}
          onTouchEnd={onTouchEndHandler}
          className="liquid-glass rounded-2xl w-full p-4 sm:p-4.5 mb-3.5 relative text-left shadow-xl touch-pan-y cursor-grab active:cursor-grabbing border border-[#F5E6D3]/15"
        >
          <div className="liquid-edge-glow" />

          {/* Endless ticker content area (No < > buttons, lighter and cleaner) */}
          <div className="relative min-h-[82px] sm:min-h-[88px] flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPillar.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: direction > 0 ? 25 : -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -25 : 25 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full select-none"
              >
                {/* Title & Counter Row */}
                <div className="flex items-center justify-between gap-2 mb-1 pointer-events-none">
                  <h2 className="font-tercia text-base sm:text-lg text-[#F5E6D3] font-light drop-shadow">
                    {currentPillar.title}
                  </h2>
                  <span className="text-[11px] text-[#C87D39] font-mono tracking-widest font-semibold">
                    {activePillarIdx + 1} / {PROJECT_PILLARS.length}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#D1BEA8] font-norms leading-relaxed mb-2 pointer-events-none">
                  {currentPillar.desc}
                </p>

                {/* Badge Highlight */}
                <span className="text-[11px] text-[#E8A15C] font-norms font-medium block pointer-events-none">
                  {currentPillar.badge}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimalist dot pills at bottom (Tappable) */}
          <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-[#F5E6D3]/10">
            <div className="flex items-center gap-1.5">
              {PROJECT_PILLARS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(idx > activePillarIdx ? 1 : -1);
                    setActivePillarIdx(idx);
                  }}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activePillarIdx ? 'w-5 bg-[#C87D39]' : 'w-2 bg-[#F5E6D3]/20 hover:bg-[#F5E6D3]/40'
                  }`}
                  aria-label={`Пункт ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-[10px] text-[#E5D3BA]/50 font-norms tracking-wider uppercase">
              Смахните для просмотра · 6 сек
            </span>
          </div>
        </motion.div>

        {/* MODAL TRIGGERS: Open Frame Modals strictly according to DUGA® Brandbook (No green buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full grid grid-cols-2 gap-3 mb-3.5"
        >
          {/* Trigger 1: Презентация — Brand Champagne Ivory with Deep Burgundy Typography */}
          <button
            onClick={() => setShowPresentationModal(true)}
            className="group relative overflow-hidden w-full py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#F5E6D3] hover:bg-white text-[#380912] font-norms font-semibold text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all duration-200 shadow-[0_8px_24px_rgba(245,230,211,0.22)] hover:shadow-[0_12px_28px_rgba(245,230,211,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-white/60"
          >
            {/* Top specular shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
            <Download className="w-4 h-4 text-[#380912] group-hover:-translate-y-0.5 transition-transform shrink-0" />
            <span className="truncate">Презентация</span>
          </button>

          {/* Trigger 2: Сайт проекта — Brand Terracotta Copper (DUGA® brandbook solar ray color #DE6C35) */}
          <button
            onClick={() => setShowWebsiteModal(true)}
            className="group relative overflow-hidden w-full py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#C87D39] via-[#DE6C35] to-[#B86B28] hover:brightness-110 text-[#F5E6D3] font-norms font-semibold text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all duration-200 shadow-[0_8px_24px_rgba(222,108,53,0.35)] hover:shadow-[0_12px_30px_rgba(222,108,53,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-[#F5E6D3]/40"
          >
            {/* Top specular shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <span className="truncate">Сайт проекта</span>
            <ExternalLink className="w-4 h-4 text-[#F5E6D3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </button>
        </motion.div>

        {/* FOOTER: Contacts and Restart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full flex items-center justify-between text-xs text-[#E5D3BA]/80 font-norms px-1 pt-1"
        >
          <div className="flex items-center gap-3.5 sm:gap-5">
            <a
              href={PROJECT_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#DE6C35]" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${PROJECT_LINKS.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#DE6C35]" />
              <span>Офис продаж</span>
            </a>
          </div>

          <button
            onClick={onRestartQuiz}
            className="flex items-center gap-1.5 text-[#E5D3BA]/75 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#DE6C35]" />
            <span>В начало</span>
          </button>
        </motion.div>
      </div>

      {/* FRAME MODAL 1: ACTUAL PRESENTATION FRAME OVER SURVEY INTERFACE WITH 10s AUTO-CLOSE COUNTDOWN */}
      <AnimatePresence>
        {showPresentationModal && (
          <PresentationFrameModal
            isOpen={showPresentationModal}
            onClose={() => setShowPresentationModal(false)}
            inactivityLimitMs={10000}
          />
        )}
      </AnimatePresence>

      {/* FRAME MODAL 2: ACTUAL WEBSITE FRAME OVER SURVEY INTERFACE WITH 10s AUTO-CLOSE COUNTDOWN */}
      <AnimatePresence>
        {showWebsiteModal && (
          <WebsiteFrameModal
            isOpen={showWebsiteModal}
            onClose={() => setShowWebsiteModal(false)}
            inactivityLimitMs={10000}
          />
        )}
      </AnimatePresence>

      {/* Bottom spacing anchor */}
      <footer className="w-full max-w-xl z-10 py-1" />
    </div>
  );
};
