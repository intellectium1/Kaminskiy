import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building,
  Layers,
  Maximize2,
  ExternalLink,
  Check,
  Phone,
  MessageCircle,
  Download,
  Filter,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { PROJECT_LINKS } from '../data/quizData';
import { CrmStorage } from '../services/crmStorage';

export interface LotItem {
  id: string;
  number: string;
  name: string;
  floor: number;
  floorName: string;
  area: number; // in m²
  ceilingHeight: string;
  type: 'office' | 'residence' | 'penthouse' | 'gastro';
  typeName: string;
  status: 'AVAILABLE' | 'RESERVED';
  statusName: string;
  description: string;
  features: string[];
  windowsView: string;
  priceNote: string;
  // Floor plan layout specs
  layoutSvg: {
    viewBox: string;
    rooms: { name: string; area: string; x: number; y: number; w: number; h: number; color?: string }[];
    walls: string;
  };
}

export const KAMINSKIY_LOTS: LotItem[] = [
  {
    id: 'lot-04',
    number: 'Лот №04',
    name: 'Офисный лот «Купеческий»',
    floor: 1,
    floorName: '1 этаж',
    area: 54.2,
    ceilingHeight: '3.8 м',
    type: 'office',
    typeName: 'Офисный лот',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Уютный камерный офис с отдельным коридором в исторической части особняка. Идеален для управляющей команды или частной практики.',
    features: ['Историческая кирпичная кладка', 'Индивидуальная система вентиляции', 'Приватный санузел', 'Окна в тихий сквер'],
    windowsView: 'Вид в приватный благоустроенный двор',
    priceNote: 'Условия по запросу · Аренда / Продажа',
    layoutSvg: {
      viewBox: '0 0 300 220',
      rooms: [
        { name: 'Кабинет / Open space', area: '34.2 м²', x: 20, y: 20, w: 170, h: 180, color: 'rgba(200, 125, 57, 0.15)' },
        { name: 'Переговорная', area: '12.0 м²', x: 195, y: 20, w: 85, h: 100, color: 'rgba(235, 213, 191, 0.12)' },
        { name: 'Холл / Санузел', area: '8.0 м²', x: 195, y: 125, w: 85, h: 75, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L280,20 L280,200 L20,200 Z M190,20 L190,200 M190,120 L280,120',
    },
  },
  {
    id: 'lot-07',
    number: 'Лот №07',
    name: 'Резиденция «Александр Каминский»',
    floor: 1,
    floorName: '1 этаж',
    area: 112.5,
    ceilingHeight: '4.2 м',
    type: 'residence',
    typeName: 'Офисная резиденция',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Представительский лот с высокими сводчатыми потолками и парадной приёмной зоной. Создан для респектабельных переговоров высшего уровня.',
    features: ['Парадный холл для приёма гостей', 'Личная переговорная комната', 'Зона сервиса и мини-кухня батлера', 'Сводчатые потолки 4.2 м'],
    windowsView: 'Фасадные окна на исторический переулок',
    priceNote: 'Специальные условия резидентам',
    layoutSvg: {
      viewBox: '0 0 340 240',
      rooms: [
        { name: 'Приёмная / Холл', area: '26.5 м²', x: 20, y: 20, w: 100, h: 200, color: 'rgba(200, 125, 57, 0.15)' },
        { name: 'Главный кабинет', area: '48.0 м²', x: 125, y: 20, w: 195, h: 115, color: 'rgba(235, 213, 191, 0.15)' },
        { name: 'Зал совещаний', area: '24.0 м²', x: 125, y: 140, w: 120, h: 80, color: 'rgba(200, 125, 57, 0.12)' },
        { name: 'Сервис / WC', area: '14.0 м²', x: 250, y: 140, w: 70, h: 80, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L320,20 L320,220 L20,220 Z M120,20 L120,220 M120,135 L320,135 M245,135 L245,220',
    },
  },
  {
    id: 'lot-11',
    number: 'Лот №11',
    name: 'Центральный лот «Атриум»',
    floor: 2,
    floorName: '2 этаж',
    area: 88.4,
    ceilingHeight: '4.0 м',
    type: 'office',
    typeName: 'Офисный лот',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Лот с прямым выходом в световой атриум второго этажа под монументальным стеклянным куполом. Исключительная инсоляция в течение всего дня.',
    features: ['Стеклянный купол над головой', 'Умная климатическая система', 'Шумоизоляционные стеклопакеты', 'Выделенный скоростной канал связи'],
    windowsView: 'Вид в световой купольный атриум и тихий двор',
    priceNote: 'Готов к чистовой отделке',
    layoutSvg: {
      viewBox: '0 0 320 220',
      rooms: [
        { name: 'Атриумная рабочая зона', area: '52.4 м²', x: 20, y: 20, w: 180, h: 180, color: 'rgba(200, 125, 57, 0.18)' },
        { name: 'Переговорный бокс', area: '22.0 м²', x: 205, y: 20, w: 95, h: 95, color: 'rgba(235, 213, 191, 0.12)' },
        { name: 'Кофе-поинт / WC', area: '14.0 м²', x: 205, y: 120, w: 95, h: 80, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L300,20 L300,200 L20,200 Z M200,20 L200,200 M200,115 L300,115',
    },
  },
  {
    id: 'lot-14',
    number: 'Лот №14',
    name: 'Представительский сьют «Монумент»',
    floor: 2,
    floorName: '2 этаж',
    area: 194.0,
    ceilingHeight: '4.2 м',
    type: 'residence',
    typeName: 'Офисная резиденция',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Флагманский представительский сьют второго этажа. Включает парадную анфиладу, конференц-зал на 14 персон, кабинет топ-менеджера и зону отдыха.',
    features: ['Двусторонняя ориентация окон', 'Конференц-зал с мультимедиа', 'Собственная терраса 18 м²', 'Серверная и архивное помещение'],
    windowsView: 'Двусторонний вид: парадный фасад и приватный парк',
    priceNote: 'Индивидуальный график платежей',
    layoutSvg: {
      viewBox: '0 0 360 250',
      rooms: [
        { name: 'Приёмная & Холл', area: '38.0 м²', x: 20, y: 20, w: 110, h: 210, color: 'rgba(200, 125, 57, 0.14)' },
        { name: 'Конференц-зал', area: '46.0 м²', x: 135, y: 20, w: 205, h: 100, color: 'rgba(235, 213, 191, 0.16)' },
        { name: 'Кабинет СЕО', area: '65.0 м²', x: 135, y: 125, w: 125, h: 105, color: 'rgba(200, 125, 57, 0.20)' },
        { name: 'Серверная / WC / Душ', area: '45.0 м²', x: 265, y: 125, w: 75, h: 105, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L340,20 L340,230 L20,230 Z M130,20 L130,230 M130,120 L340,120 M260,120 L260,230',
    },
  },
  {
    id: 'lot-18',
    number: 'Лот №18',
    name: 'Офисный лот «Интеллект»',
    floor: 2,
    floorName: '2 этаж',
    area: 68.0,
    ceilingHeight: '3.9 м',
    type: 'office',
    typeName: 'Офисный лот',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Эргономичное пространство с эффективным коэффициентом планировки. Никаких лишних коридоров — каждый квадратный метр работает на бизнес.',
    features: ['Свободная планировка', 'Предусмотрено до 12 рабочих мест', 'Акустические перегородки', 'Автономный климатический контур'],
    windowsView: 'Окна в исторический тихий переулок',
    priceNote: 'Оптимально для инвестиций / аренды',
    layoutSvg: {
      viewBox: '0 0 310 210',
      rooms: [
        { name: 'Основной зал', area: '46.0 м²', x: 20, y: 20, w: 180, h: 170, color: 'rgba(200, 125, 57, 0.15)' },
        { name: 'Переговорная капсула', area: '14.0 м²', x: 205, y: 20, w: 85, h: 90, color: 'rgba(235, 213, 191, 0.12)' },
        { name: 'Кухня / WC', area: '8.0 м²', x: 205, y: 115, w: 85, h: 75, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L290,20 L290,190 L20,190 Z M200,20 L200,190 M200,110 L290,110',
    },
  },
  {
    id: 'lot-21',
    number: 'Лот №21',
    name: 'Офисный пентхаус «Купол & Антресоль»',
    floor: 3,
    floorName: '3 этаж (Мансарда)',
    area: 230.5,
    ceilingHeight: 'до 5.4 м',
    type: 'penthouse',
    typeName: 'Офисный пентхаус',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Двухуровневый пентхаус под сводами исторической крыши со стеклянным куполом и зенитными окнами. Премиальный статус и независимый приватный лифт.',
    features: ['Два уровня (антресоль)', 'Зенитные окна и стеклянный купол', 'Высота потолков в коньке 5.4 м', 'Индивидуальный лифтовой шлюз'],
    windowsView: 'Панорамный вид на исторический центр Москвы',
    priceNote: 'Флагманский лот проекта',
    layoutSvg: {
      viewBox: '0 0 360 250',
      rooms: [
        { name: '1 Уровень: Офис & Лаундж', area: '145.0 м²', x: 20, y: 20, w: 200, h: 210, color: 'rgba(200, 125, 57, 0.22)' },
        { name: '2 Уровень: Антресоль', area: '55.5 м²', x: 225, y: 20, w: 115, h: 110, color: 'rgba(235, 213, 191, 0.20)' },
        { name: 'Приватная терраса / SPA', area: '30.0 м²', x: 225, y: 135, w: 115, h: 95, color: 'rgba(200, 125, 57, 0.15)' },
      ],
      walls: 'M20,20 L340,20 L340,230 L20,230 Z M220,20 L220,230 M220,130 L340,130',
    },
  },
  {
    id: 'lot-22',
    number: 'Лот №22',
    name: 'Клубный пентхаус «Гранд Сьют»',
    floor: 3,
    floorName: '3 этаж (Мансарда)',
    area: 165.8,
    ceilingHeight: '4.5 м',
    type: 'penthouse',
    typeName: 'Офисный пентхаус',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Атмосферный видовой пентхаус с открытыми историческими деревянными балками и террасой на эксплуатируемой кровле.',
    features: ['Выход на приватную террасу на кровле', 'Открытые исторические балки XIX века', 'Каминная зона с живым паром', 'Обособленный сервисный контур'],
    windowsView: 'Крыши старой Москвы и исторические переулки',
    priceNote: 'Редкий коллекционный лот',
    layoutSvg: {
      viewBox: '0 0 330 230',
      rooms: [
        { name: 'Рабочая гостиная', area: '85.0 м²', x: 20, y: 20, w: 170, h: 190, color: 'rgba(200, 125, 57, 0.18)' },
        { name: 'Мастер-кабинет', area: '50.8 м²', x: 195, y: 20, w: 115, h: 100, color: 'rgba(235, 213, 191, 0.15)' },
        { name: 'Кровельная терраса', area: '30.0 м²', x: 195, y: 125, w: 115, h: 85, color: 'rgba(100, 20, 30, 0.22)' },
      ],
      walls: 'M20,20 L310,20 L310,210 L20,210 Z M190,20 L190,210 M190,120 L310,120',
    },
  },
  {
    id: 'lot-01',
    number: 'Лот №01',
    name: 'Гастро-пространство особняка',
    floor: 1,
    floorName: '1 этаж',
    area: 285.0,
    ceilingHeight: '4.2 м',
    type: 'gastro',
    typeName: 'Гастрономическое пространство',
    status: 'AVAILABLE',
    statusName: 'В наличии',
    description: 'Эксклюзивное угловое помещение с панорамными витринами под закрытый клубный ресторан, винный салон или флагманское представительское арт-пространство.',
    features: ['Высокая электрическая мощность', 'Технологическая вытяжка на кровлю', 'Отдельный гостевой и дебаркадерный входы', 'Витринные окна 3.2 м'],
    windowsView: 'Панорамные витрины на пешеходный поток центра',
    priceNote: 'Условия аренды / продажи по запросу',
    layoutSvg: {
      viewBox: '0 0 380 250',
      rooms: [
        { name: 'Основной зал ресторана', area: '165.0 м²', x: 20, y: 20, w: 220, h: 210, color: 'rgba(200, 125, 57, 0.20)' },
        { name: 'Кухня полного цикла', area: '75.0 м²', x: 245, y: 20, w: 115, h: 120, color: 'rgba(235, 213, 191, 0.15)' },
        { name: 'VIP-комната / Санузлы', area: '45.0 м²', x: 245, y: 145, w: 115, h: 85, color: 'rgba(100, 20, 30, 0.25)' },
      ],
      walls: 'M20,20 L360,20 L360,230 L20,230 Z M240,20 L240,230 M240,140 L360,140',
    },
  },
];

interface PlansCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingModal?: (lot: LotItem) => void;
}

export const PlansCatalogModal: React.FC<PlansCatalogModalProps> = ({
  isOpen,
  onClose,
  onOpenBookingModal,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeLot, setActiveLot] = useState<LotItem>(KAMINSKIY_LOTS[0]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [bookingLot, setBookingLot] = useState<LotItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter lots
  const filteredLots = KAMINSKIY_LOTS.filter((lot) => {
    const matchFloor = selectedFloor === 'all' || lot.floor === selectedFloor;
    const matchType = selectedType === 'all' || lot.type === selectedType;
    return matchFloor && matchType;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    // Save lead into our unified CRM
    CrmStorage.saveLead({
      name: clientName.trim(),
      phone: clientPhone.trim(),
      company: `Бронь: ${bookingLot?.number} (${bookingLot?.name})`,
      resultId: 'status_recognition',
      resultTitle: `Запрос планировки: ${bookingLot?.number} - ${bookingLot?.area} м²`,
      source: 'Каталог планировок (Официальный сайт)',
      notes: `Клиент запросил расчет и планировку по лоту ${bookingLot?.number} (${bookingLot?.floorName}, площадь ${bookingLot?.area} м²).`,
      answers: { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'A', 6: 'B', 7: 'C', 8: 'D' },
    });

    setIsBookedSuccess(true);
    setTimeout(() => {
      setIsBookedSuccess(false);
      setBookingLot(null);
      setClientName('');
      setClientPhone('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-5xl h-[92vh] bg-[#27040B] border border-[#F5E6D3]/25 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#F5E6D3]"
      >
        {/* Header */}
        <header className="px-5 py-4 border-b border-[#F5E6D3]/15 flex items-center justify-between bg-[#380912]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C87D39]/20 border border-[#C87D39]/50 flex items-center justify-center text-[#C87D39]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-tercia text-lg sm:text-xl text-[#F5E6D3] tracking-wide leading-tight">
                  Планировки свободных лотов
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-norms bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                  8 лотов в наличии
                </span>
              </div>
              <p className="text-[11px] text-[#E5D3BA]/60 font-norms mt-0.5">
                ЖК «Каминский» · Центр Москвы, Лубянка · Исторический особняк 1887 г.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wwgroup.ru/kaminskiy#/catalog/projects/plans?filter=property.status:AVAILABLE"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3E0C16] hover:bg-[#521320] text-[#E8A15C] text-xs font-norms transition-colors border border-[#F5E6D3]/20"
              title="Открыть на официальном сайте WW Group"
            >
              <span>Виджет Profitbase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#3E0C16] hover:bg-[#5A1423] text-[#F5E6D3] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрыть каталог"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Filter bar */}
        <div className="px-5 py-2.5 bg-[#1F0308] border-b border-[#F5E6D3]/10 flex flex-wrap items-center justify-between gap-2.5 text-xs font-norms">
          {/* Floor filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[#E5D3BA]/50 text-[11px] uppercase mr-1">Этаж:</span>
            {[
              { val: 'all', label: 'Все' },
              { val: 1, label: '1 этаж' },
              { val: 2, label: '2 этаж (Купол)' },
              { val: 3, label: '3 этаж (Пентхаусы)' },
            ].map((f) => (
              <button
                key={String(f.val)}
                onClick={() => setSelectedFloor(f.val as any)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFloor === f.val
                    ? 'bg-[#C87D39] text-white font-medium'
                    : 'bg-[#2A050D] text-[#E5D3BA]/70 hover:text-white border border-[#F5E6D3]/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[#E5D3BA]/50 text-[11px] uppercase mr-1">Формат:</span>
            {[
              { val: 'all', label: 'Все форматы' },
              { val: 'office', label: 'Офисные лоты' },
              { val: 'residence', label: 'Резиденции' },
              { val: 'penthouse', label: 'Пентхаусы' },
              { val: 'gastro', label: 'Гастрономия' },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setSelectedType(t.val)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  selectedType === t.val
                    ? 'bg-[#C87D39] text-white font-medium'
                    : 'bg-[#2A050D] text-[#E5D3BA]/70 hover:text-white border border-[#F5E6D3]/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content body: Master-Detail split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Lots List (scrollable) */}
          <div className="lg:col-span-5 border-r border-[#F5E6D3]/10 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-[#24040A]">
            <p className="text-[11px] text-[#E5D3BA]/50 font-norms px-1">
              Найдено лотов: {filteredLots.length} из {KAMINSKIY_LOTS.length}
            </p>

            {filteredLots.map((lot) => {
              const isSelected = activeLot.id === lot.id;
              return (
                <div
                  key={lot.id}
                  onClick={() => setActiveLot(lot)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer font-norms ${
                    isSelected
                      ? 'bg-[#3E0C16] border-[#C87D39] shadow-lg shadow-[#C87D39]/20'
                      : 'bg-[#2D050D]/80 border-[#F5E6D3]/10 hover:border-[#F5E6D3]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-tercia text-xs text-[#C87D39] font-medium tracking-wide">
                      {lot.number} · {lot.floorName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {lot.statusName}
                    </span>
                  </div>

                  <h4 className="font-tercia text-sm sm:text-base text-[#F5E6D3] font-light leading-snug mb-1">
                    {lot.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-[#E5D3BA]/80 mt-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm font-semibold">{lot.area} м²</strong>
                      <span className="text-[#F5E6D3]/30">·</span>
                      <span className="text-[11px] text-[#D1BEA8]">Потолки {lot.ceilingHeight}</span>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider text-[#C87D39] font-medium">
                      {lot.typeName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Floor Plan & Specifications */}
          <div className="lg:col-span-7 overflow-y-auto p-4 sm:p-6 bg-[#27040B] flex flex-col justify-between">
            <div>
              {/* Lot Title & Key Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#F5E6D3]/10 font-norms">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-[#C87D39] font-tercia">
                      {activeLot.number} · {activeLot.floorName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                      Свободен
                    </span>
                  </div>
                  <h3 className="font-tercia text-xl sm:text-2xl text-[#F5E6D3] font-light mt-1">
                    {activeLot.name}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <div className="font-tercia text-2xl sm:text-3xl text-white font-light">
                    {activeLot.area} <span className="text-lg text-[#C87D39]">м²</span>
                  </div>
                  <p className="text-[11px] text-[#E5D3BA]/60">Потолки: {activeLot.ceilingHeight}</p>
                </div>
              </div>

              {/* ARCHITECTURAL FLOOR PLAN DRAWING (Interactive SVG Blueprint) */}
              <div className="relative w-full rounded-2xl bg-[#1E0308] border border-[#F5E6D3]/15 p-4 sm:p-6 mb-5 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-3 text-xs text-[#E5D3BA]/60 font-norms">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Compass className="w-3.5 h-3.5 text-[#C87D39]" />
                    <span>Архитектурный план лота</span>
                  </span>
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="flex items-center gap-1 text-[11px] text-[#E8A15C] hover:underline cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>{isZoomed ? 'Уменьшить' : 'Масштаб'}</span>
                  </button>
                </div>

                {/* SVG Blueprint */}
                <div className={`w-full flex items-center justify-center transition-all ${isZoomed ? 'scale-115 my-6' : ''}`}>
                  <svg
                    viewBox={activeLot.layoutSvg.viewBox}
                    className="w-full max-h-[220px] sm:max-h-[260px] drop-shadow-md"
                  >
                    {/* Grid Pattern */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(245, 230, 211, 0.05)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Room Boxes */}
                    {activeLot.layoutSvg.rooms.map((room, idx) => (
                      <g key={idx}>
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          fill={room.color || 'rgba(200, 125, 57, 0.15)'}
                          stroke="#C87D39"
                          strokeWidth="1.2"
                          rx="4"
                        />
                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 - 6}
                          textAnchor="middle"
                          fill="#F5E6D3"
                          fontSize="9"
                          fontFamily="sans-serif"
                          fontWeight="500"
                        >
                          {room.name}
                        </text>
                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 + 10}
                          textAnchor="middle"
                          fill="#E8A15C"
                          fontSize="8.5"
                          fontFamily="monospace"
                        >
                          {room.area}
                        </text>
                      </g>
                    ))}

                    {/* Outer & Internal Walls */}
                    <path
                      d={activeLot.layoutSvg.walls}
                      fill="none"
                      stroke="#F5E6D3"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="mt-3 pt-2 border-t border-[#F5E6D3]/10 flex items-center justify-between text-[10px] text-[#E5D3BA]/50 font-norms">
                  <span>Окна: {activeLot.windowsView}</span>
                  <span>Масштаб: 1:100</span>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 font-norms mb-6">
                <p className="text-xs sm:text-sm text-[#D1BEA8] leading-relaxed">
                  {activeLot.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {activeLot.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#1E0308] border border-[#F5E6D3]/10 flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#C87D39] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#F5E6D3]/90">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar at Bottom of Details */}
            <div className="pt-4 border-t border-[#F5E6D3]/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-norms">
              <div>
                <p className="text-[10px] uppercase text-[#E5D3BA]/60 tracking-wider">Финансовые условия</p>
                <p className="text-xs text-[#E8A15C] font-semibold">{activeLot.priceNote}</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setBookingLot(activeLot)}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#C87D39] hover:bg-[#DA8F4B] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#C87D39]/30 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Забронировать лот</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://wa.me/79991501887?text=${encodeURIComponent(
                    `Добрый день! Интересует лот ${activeLot.number} (${activeLot.name}, ${activeLot.area} м²) в ЖК Каминский. Отправьте, пожалуйста, коммерческое предложение и планировку.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-[#1E0308] hover:bg-[#340710] text-emerald-400 border border-emerald-800/40 transition-colors"
                  title="Узнать в WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href="tel:+74951501887"
                  className="p-3 rounded-full bg-[#1E0308] hover:bg-[#340710] text-[#E8A15C] border border-[#F5E6D3]/15 transition-colors"
                  title="Позвонить в офис продаж"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Quick Booking / Inquiry Form */}
        <AnimatePresence>
          {bookingLot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-md p-6 rounded-3xl bg-[#320811] border border-[#F5E6D3]/30 shadow-2xl font-norms relative text-left"
              >
                <button
                  onClick={() => setBookingLot(null)}
                  className="absolute right-4 top-4 text-[#F5E6D3]/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#C87D39] font-semibold">
                    Запрос бронирования
                  </span>
                  <h3 className="font-tercia text-xl text-white mt-0.5">
                    {bookingLot.number} ({bookingLot.area} м²)
                  </h3>
                  <p className="text-xs text-[#E5D3BA]/70 mt-1">
                    Менеджер консьерж-сервиса свяжется с вами в течение 10 минут и зафиксирует бронь.
                  </p>
                </div>

                {isBookedSuccess ? (
                  <div className="p-6 text-center rounded-2xl bg-emerald-950/60 border border-emerald-800/60">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-tercia text-base text-white">Заявка успешно принята!</h4>
                    <p className="text-xs text-emerald-200 mt-1">
                      Данные сохранены в CRM. Мы выслали планировку на ваш контакт.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Ваше имя *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-full bg-[#1C0207] border border-[#F5E6D3]/25 text-xs text-white placeholder-[#F5E6D3]/40 focus:outline-none focus:border-[#C87D39]"
                    />

                    <input
                      type="tel"
                      required
                      placeholder="Телефон для связи *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-full bg-[#1C0207] border border-[#F5E6D3]/25 text-xs text-white placeholder-[#F5E6D3]/40 focus:outline-none focus:border-[#C87D39]"
                    />

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#C87D39] hover:bg-[#DA8F4B] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                    >
                      Подтвердить бронь и получить расчёт
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
