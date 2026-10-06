import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SlideItem {
  url: string;
  title: string;
  subtitle: string;
}

export const OFFICIAL_KAMINSKIY_SLIDES: SlideItem[] = [
  {
    url: 'https://static.tildacdn.com/tild6261-3962-4565-b262-353337656161/convertioin_fasad-ve.webp',
    title: 'Исторический фасад особняка 1887 года',
    subtitle: 'Шедевр мастера русской эклектики Александра Каминского в центре Москвы',
  },
  {
    url: 'https://static.tildacdn.com/tild3230-3034-4262-b663-656336326230/nano-banana-2-4k-6a3.webp',
    title: 'Монументальный стеклянный купол',
    subtitle: 'Большой атриум на уровне второго этажа, наполняющий пространство естественным светом',
  },
  {
    url: 'https://static.tildacdn.com/tild6462-3235-4030-b138-346334336335/_9.webp',
    title: 'Представительские лоты для резидентов',
    subtitle: 'Камерный закрытый формат всего на 22 лота: от приватного офиса до штаб-квартиры',
  },
  {
    url: 'https://static.tildacdn.com/tild6432-3735-4665-a461-633832626561/25.webp',
    title: 'Подготовленные переговорные пространства',
    subtitle: 'Пятизвёздочный отельный протокол встреч, кейтеринг и передовая инженерия',
  },
  {
    url: 'https://static.tildacdn.com/tild6565-3333-4437-b537-356161303461/_8.webp',
    title: 'Кабинеты с высокими потолками',
    subtitle: 'Метровые исторические стены, безупречная шумоизоляция и дизайнерский свет',
  },
  {
    url: 'https://static.tildacdn.com/tild3465-3032-4938-b431-663233616233/photo_2025-11-19_16-.webp',
    title: 'Парадное лобби и консьерж-сервис',
    subtitle: 'Встреча резидентов по имени, сопровождение гостей и круглосуточная забота 5★',
  },
];

interface ImageSliderProps {
  className?: string;
  autoPlayInterval?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  className = '',
  autoPlayInterval = 4500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = OFFICIAL_KAMINSKIY_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, total]);

  // Touch navigation for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const currentSlide = OFFICIAL_KAMINSKIY_SLIDES[currentIndex];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-[#F5E6D3]/20 bg-[#27040B] shadow-2xl select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Container with Aspect Ratio */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#1E0308]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.url}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlays for Luxury Contrast and Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#27040B] via-[#27040B]/40 to-black/20" />
            <div className="absolute inset-0 bg-[#380912]/20 mix-blend-multiply pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Caption Box */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-10 text-left pointer-events-none">
          <span className="text-[10px] sm:text-xs text-[#C87D39] font-tercia uppercase tracking-[0.2em] font-medium block mb-1">
            {currentIndex + 1} / {total} · Особняк Каминский
          </span>
          <h4 className="font-tercia text-base sm:text-xl text-[#F5E6D3] font-light leading-snug drop-shadow-md">
            {currentSlide.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#D1BEA8]/90 font-norms mt-1 leading-relaxed max-w-lg drop-shadow">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0308]/60 hover:bg-[#3E0C16] text-[#F5E6D3] border border-[#F5E6D3]/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-20 active:scale-95 cursor-pointer"
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0308]/60 hover:bg-[#3E0C16] text-[#F5E6D3] border border-[#F5E6D3]/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-20 active:scale-95 cursor-pointer"
          aria-label="Следующее фото"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators / Thumbnails Row */}
      <div className="px-4 py-3 bg-[#1C0207] border-t border-[#F5E6D3]/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {OFFICIAL_KAMINSKIY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 sm:w-9 bg-[#C87D39]'
                  : 'w-2 bg-[#F5E6D3]/20 hover:bg-[#F5E6D3]/50'
              }`}
              aria-label={`Перейти к фото ${idx + 1}`}
            />
          ))}
        </div>

        <span className="text-[11px] text-[#E5D3BA]/50 font-norms">
          Официальные фотографии проекта
        </span>
      </div>
    </div>
  );
};
