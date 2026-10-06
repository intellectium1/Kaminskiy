export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  key: OptionKey;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: QuizOption[];
}

export type ResultId = 
  | 'status_recognition'       // A pure (Вас знают)
  | 'flawless_detail'          // B pure (Всё готово)
  | 'absolute_privacy'         // C pure (Своё пространство)
  | 'time_freedom'             // D pure (Время остаётся вам)
  | 'privileged_reception'     // A + B
  | 'quiet_sovereignty'        // A + C
  | 'creative_autonomy'        // B + C
  | 'delegated_leadership';    // B + D / C + D / balanced

export interface QuizResult {
  id: ResultId;
  title: string;
  archetype: string;
  subtitle: string;
  summary: string;
  details: string[];
  kaminskiySolution: string;
  lotRecommendation: {
    name: string;
    area: string;
    highlights: string[];
  };
  dominantKeys: OptionKey[];
}

export type LeadStatus = 'new' | 'processing' | 'meeting' | 'deal' | 'archive';

export interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  company?: string;
  resultId: ResultId;
  resultTitle: string;
  answers: Record<number, OptionKey>;
  status: LeadStatus;
  notes?: string;
  source: string;
}

export interface AnalyticsStats {
  screenViews: number;
  quizzesStarted: number;
  quizzesCompleted: number;
  leadsSubmitted: number;
  resultDistribution: Record<ResultId, number>;
  questionDropoff: Record<number, number>;
  answersCount: Record<number, Record<OptionKey, number>>;
}
