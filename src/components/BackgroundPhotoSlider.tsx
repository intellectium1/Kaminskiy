import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface BackgroundSlide {
  id: string;
  url: string;
  fallbackUrl: string;
  title: string;
  location: string;
}

export const KAMINSKIY_BG_SLIDES: BackgroundSlide[] = [
  {
    id: 'facade',
    url: '/images/kaminskiy/facade.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6261-3962-4565-b262-353337656161/convertioin_fasad-ve.webp',
    title: 'Вечерний фасад особняка 1887 года',
    location: 'Архитектурный шедевр Александра Каминского',
  },
  {
    id: 'dome',
    url: '/images/kaminskiy/dome.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild3230-3034-4262-b663-656336326230/nano-banana-2-4k-6a3.webp',
    title: 'Монументальный стеклянный купол',
    location: 'Атриум на уровне второго этажа',
  },
  {
    id: 'office',
    url: '/images/kaminskiy/office.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6462-3235-4030-b138-346334336335/_9.webp',
    title: 'Представительский лот резидента',
    location: 'Камерный формат: всего 22 лота',
  },
  {
    id: 'meeting',
    url: '/images/kaminskiy/meeting.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6432-3735-4665-a461-633832626561/25.webp',
    title: 'Подготовленные переговорные',
    location: 'Сервис уровня пятизвёздочного отеля',
  },
  {
    id: 'ceilings',
    url: '/images/kaminskiy/ceilings.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild6565-3333-4437-b537-356161303461/_8.webp',
    title: 'Кабинеты с высокими потолками',
    location: 'Метровые исторические стены и тишина',
  },
  {
    id: 'lobby',
    url: '/images/kaminskiy/lobby.webp',
    fallbackUrl: 'https://static.tildacdn.com/tild3465-3032-4938-b431-663233616233/photo_2025-11-19_16-.webp',
    title: 'Парадное лобби и консьерж-служба',
    location: 'Встреча резидентов и ключевых гостей',
  },
];

interface BackgroundPhotoSliderProps {
  intervalMs?: number;
}

export const BackgroundPhotoSlider: React.FC<BackgroundPhotoSliderProps> = ({
  intervalMs = 7000,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((current) => {
        setPrevIdx(current);
        return (current + 1) % KAMINSKIY_BG_SLIDES.length;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  const activeSlide = KAMINSKIY_BG_SLIDES[activeIdx] || KAMINSKIY_BG_SLIDES[0];
  const prevSlide = prevIdx !== null ? KAMINSKIY_BG_SLIDES[prevIdx] : null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#140105]">
      {/* PREVIOUS SLIDE (stays completely solid underneath during transition so NO black screen ever flashes!) */}
      {prevSlide && (
        <div key={`prev-${prevSlide.id}`} className="absolute inset-0 w-full h-full">
          <img
            src={prevSlide.url}
            onError={(e) => {
              if (e.currentTarget.src !== prevSlide.fallbackUrl) {
                e.currentTarget.src = prevSlide.fallbackUrl;
              }
            }}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{
              filter: 'brightness(0.70) contrast(1.08)',
              transform: 'scale(1.0)',
            }}
            loading="eager"
          />
        </div>
      )}

      {/* ACTIVE SLIDE (fades in smoothly over 4 full seconds with gentle zoom out from 1.08 to 1.0) */}
      <motion.div
        key={`active-${activeSlide.id}`}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1.0 }}
        transition={{
          opacity: { duration: 4.0, ease: 'easeInOut' },
          scale: { duration: 7.0, ease: 'easeOut' },
        }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={activeSlide.url}
          onError={(e) => {
            if (e.currentTarget.src !== activeSlide.fallbackUrl) {
              e.currentTarget.src = activeSlide.fallbackUrl;
            }
          }}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center"
          style={{
            filter: 'brightness(0.70) contrast(1.08)',
          }}
          loading="eager"
        />
      </motion.div>

      {/* Cinematic Vignette: Keeps center luminous while ensuring typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#24040A]/30 to-black/75" />

      {/* Radial spotlight focused on the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,9,18,0.08)_0%,rgba(16,2,5,0.72)_100%)]" />

      {/* Ambient warm champagne accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C87D39]/12 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
};
