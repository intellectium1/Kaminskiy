import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { PROJECT_LINKS } from '../data/quizData';

interface PresentationFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  inactivityLimitMs?: number;
}

interface PresentationSlide {
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  fallbackUrl: string;
  specs: string[];
}

const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    title: 'Вечерний фасад особняка 1887 года',
    category: 'Архитектурное наследие',
    desc: 'Редевелопмент исторического особняка выдающегося мастера московской эклектики Александра Каминского в центре Москвы.',
    imgUrl: '/images/kaminskiy/facade.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6261-3962-4565-b262-353337656161/convertioin_fasad-ve.webp',
    specs: ['Основан в 1887 году', 'Исторический центр Москвы', 'Редевелопмент WW Group'],
  },
  {
    title: 'Монументальный стеклянный купол',
    category: 'Атриум второго этажа',
    desc: 'Уникальное архитектурное решение: стеклянный купол наполняет центральное пространство естественным светом на протяжении всего дня.',
    imgUrl: '/images/kaminskiy/dome.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild3230-3034-4262-b663-656336326230/nano-banana-2-4k-6a3.webp',
    specs: ['Световой атриум', 'Высота купола до 8 м', 'Архитектурная доминанта'],
  },
  {
    title: 'Представительский клубный лот',
    category: 'Камерный масштаб: 22 лота',
    desc: 'Всего 22 эксклюзивных лота в здании. От компактного офиса для собственной команды до двухуровневого представительского пространства уровня штаб-квартиры.',
    imgUrl: '/images/kaminskiy/office.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6462-3235-4030-b138-346334336335/_9.webp',
    specs: ['Площади от 85 до 290 м²', 'Свободные планировки', 'Автономные входы'],
  },
  {
    title: 'Сервис уровня 5★ отеля',
    category: 'Консьерж и батлер-служба',
    desc: 'Консьерж-служба, персональный батлер, представительский этикет встречи гостей, организация доставок и решение бытовых поручений без ваших звонков.',
    imgUrl: '/images/kaminskiy/lobby.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild3465-3032-4938-b431-663233616233/photo_2025-11-19_16-.webp',
    specs: ['100% делегирование рутины', 'Встреча статусных гостей', 'Сервис 24/7'],
  },
  {
    title: 'Кабинеты с высокими потолками',
    category: 'Пространство и акустика',
    desc: 'Высота потолков до 4.2 м и метровые исторические кирпичные стены обеспечивают редкую для центра Москвы глубокую тишину.',
    imgUrl: '/images/kaminskiy/ceilings.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6565-3333-4437-b537-356161303461/_8.webp',
    specs: ['Потолки до 4.2 метра', 'Метровые кирпичные стены', 'Шумоизоляция 55+ дБ'],
  },
  {
    title: 'Подготовленные переговорные капсулы',
    category: 'Инфраструктура резидентов',
    desc: 'Переговорные комнаты с премиальным мультимедийным оснащением, изолированные капсулы для конфиденциальных звонков и ресторанный кейтеринг.',
    imgUrl: '/images/kaminskiy/meeting.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6432-3735-4665-a461-633832626561/25.webp',
    specs: ['Мультимедиа 4K', 'Кейтеринг в лот', 'Бронирование через приложение'],
  },
];

export const PresentationFrameModal: React.FC<PresentationFrameModalProps> = ({
  isOpen,
  onClose,
  inactivityLimitMs = 10000,
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [progressPercent, setProgressPercent] = useState(100);
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

  const currentSlide = PRESENTATION_SLIDES[currentSlideIdx];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetActivity();
    setCurrentSlideIdx((prev) => (prev - 1 + PRESENTATION_SLIDES.length) % PRESENTATION_SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetActivity();
    setCurrentSlideIdx((prev) => (prev + 1) % PRESENTATION_SLIDES.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none"
      onClick={onClose}
    >
      {/* Presentation Frame Container */}
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
        className="relative w-full max-w-5xl h-[92vh] sm:h-[94vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#180206] border border-[#DE6C35]/40 shadow-2xl flex flex-col"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 bg-[#25040B] border-b border-[#F5E6D3]/15 text-xs text-[#E5D3BA]">
          {/* Document label */}
          <div className="flex items-center gap-2 max-w-[50%] sm:max-w-md truncate">
            <FileText className="w-4 h-4 text-[#DE6C35] shrink-0" />
            <div className="truncate font-norms">
              <span className="text-[#F5E6D3] font-medium">Презентация_Каминский_1887.pdf</span>
              <span className="text-[11px] text-[#DE6C35] ml-2 hidden sm:inline">
                ({currentSlideIdx + 1} / {PRESENTATION_SLIDES.length})
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Auto-close indicator badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3E0C16] border border-[#DE6C35]/40 text-[11px] font-norms text-[#E5D3BA] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE6C35] animate-ping" />
              <span>
                Закрытие: <strong className="text-white font-mono">{timeLeft}с</strong>
              </span>
            </div>

            {/* Download Original PDF */}
            <a
              href={PROJECT_LINKS.presentationPdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={resetActivity}
              className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#DE6C35] hover:bg-[#E87A44] text-[#F5E5D3] text-[11px] font-norms font-medium tracking-wide uppercase transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Скачать PDF</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#3E0C16] hover:bg-[#5A1423] text-[#F5E6D3] flex items-center justify-center transition-colors cursor-pointer border border-[#F5E6D3]/20 shrink-0"
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

        {/* Main Presentation Slide Viewport */}
        <div className="relative flex-1 w-full bg-[#120104] overflow-hidden flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Slide Image Background */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={currentSlide.imgUrl}
                  onError={(e) => {
                    if (e.currentTarget.src !== currentSlide.fallbackUrl) {
                      e.currentTarget.src = currentSlide.fallbackUrl;
                    }
                  }}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
              </div>

              {/* Slide Header Tag */}
              <div className="relative z-10 p-4 sm:p-6 text-left">
                <span className="px-3 py-1 rounded-full bg-[#DE6C35]/85 backdrop-blur-md text-white text-[11px] font-norms uppercase tracking-wider font-semibold">
                  {currentSlide.category}
                </span>
              </div>

              {/* Slide Bottom Caption Card */}
              <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-left">
                <h3 className="font-tercia text-xl sm:text-2xl md:text-3xl text-[#F5E6D3] font-light mb-2 drop-shadow-md">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D1BEA8] font-norms leading-relaxed max-w-2xl mb-3">
                  {currentSlide.desc}
                </p>

                {/* Specs pill badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {currentSlide.specs.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-full bg-[#380912]/80 border border-[#F5E6D3]/20 text-[11px] text-[#F5E6D3] font-norms"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Navigation Left/Right Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#DE6C35] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#DE6C35] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            aria-label="Следующий слайд"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Thumbnails Strip */}
        <div className="px-3 sm:px-4 py-2 bg-[#200308] border-t border-[#F5E6D3]/15 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIdx(idx);
                  resetActivity();
                }}
                className={`relative h-10 w-16 rounded-md overflow-hidden border transition-all cursor-pointer shrink-0 ${
                  idx === currentSlideIdx
                    ? 'border-[#DE6C35] ring-2 ring-[#DE6C35]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                title={slide.title}
              >
                <img src={slide.imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <a
            href={PROJECT_LINKS.presentationPdf}
            target="_blank"
            rel="noopener noreferrer"
            onClick={resetActivity}
            className="sm:hidden px-3 py-1 rounded-full bg-[#DE6C35] text-[#F5E5D3] text-[11px] font-medium flex items-center gap-1 shrink-0"
          >
            <Download className="w-3 h-3" />
            <span>PDF</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
