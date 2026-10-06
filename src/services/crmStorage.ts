import { LeadRecord, AnalyticsStats, ResultId, OptionKey, LeadStatus } from '../types/quiz';
import { QUIZ_RESULTS } from '../data/quizData';

const LEADS_STORAGE_KEY = 'kaminskiy_crm_leads_v2';
const ANALYTICS_STORAGE_KEY = 'kaminskiy_crm_analytics_v2';
const SETTINGS_STORAGE_KEY = 'kaminskiy_kiosk_settings_v2';

export interface KioskSettings {
  inactivityTimeoutSeconds: number; // e.g. 45
  timeoutAction: 'restart_quiz' | 'redirect_website';
  enableSound: boolean;
}

const DEFAULT_SETTINGS: KioskSettings = {
  inactivityTimeoutSeconds: 45,
  timeoutAction: 'restart_quiz',
  enableSound: false,
};

// Initial realistic sample leads to demonstrate immediate CRM utility
const INITIAL_SAMPLE_LEADS: LeadRecord[] = [
  {
    id: 'lead-1887-101',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    name: 'Александр Романов',
    phone: '+7 (916) 482-19-20',
    company: 'Capital Heritage Partners',
    resultId: 'privileged_reception',
    resultTitle: QUIZ_RESULTS.privileged_reception.title,
    status: 'meeting',
    notes: 'Интересует представительский офис на 2 этаже от 180 м². Назначен закрытый показ на вторник 15:00.',
    source: 'Интерактивный квиз (Стенд)',
    answers: { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A', 6: 'B', 7: 'A', 8: 'B' },
  },
  {
    id: 'lead-1887-102',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    name: 'Екатерина Воронова',
    phone: '+7 (925) 731-90-55',
    company: 'Family Office Voronova & Co',
    resultId: 'absolute_privacy',
    resultTitle: QUIZ_RESULTS.absolute_privacy.title,
    status: 'processing',
    notes: 'Приоритет — приватность и отдельный лифт. Просила отправить PDF-презентацию в WhatsApp.',
    source: 'Интерактивный квиз (Мобильный)',
    answers: { 1: 'C', 2: 'C', 3: 'C', 4: 'C', 5: 'C', 6: 'C', 7: 'C', 8: 'C' },
  },
  {
    id: 'lead-1887-103',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    name: 'Михаил Белосельский',
    phone: '+7 (903) 112-44-88',
    company: 'Nordic Tech Venture',
    resultId: 'flawless_detail',
    resultTitle: QUIZ_RESULTS.flawless_detail.title,
    status: 'new',
    notes: 'Интересуется лотом с чистовой премиальной отделкой под инвестиционную сдачу в аренду.',
    source: 'Интерактивный квиз (Стенд)',
    answers: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 7: 'B', 8: 'A' },
  },
  {
    id: 'lead-1887-104',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    name: 'Дмитрий Соколов',
    phone: '+7 (985) 654-32-10',
    company: 'Sokolov Legal Group',
    resultId: 'time_freedom',
    resultTitle: QUIZ_RESULTS.time_freedom.title,
    status: 'deal',
    notes: 'Одобрена бронь на 22 лот (пентхаус). Согласование договора с юридическим департаментом.',
    source: 'Интерактивный квиз (Стенд)',
    answers: { 1: 'D', 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D' },
  },
];

const INITIAL_ANALYTICS: AnalyticsStats = {
  screenViews: 248,
  quizzesStarted: 164,
  quizzesCompleted: 138,
  leadsSubmitted: 47,
  resultDistribution: {
    status_recognition: 18,
    flawless_detail: 26,
    absolute_privacy: 32,
    time_freedom: 24,
    privileged_reception: 14,
    quiet_sovereignty: 11,
    creative_autonomy: 8,
    delegated_leadership: 5,
  },
  questionDropoff: {
    1: 164,
    2: 159,
    3: 153,
    4: 149,
    5: 145,
    6: 142,
    7: 140,
    8: 138,
  },
  answersCount: {
    1: { A: 48, B: 42, C: 46, D: 28 },
    2: { A: 34, B: 52, C: 44, D: 29 },
    3: { A: 31, B: 38, C: 54, D: 30 },
    4: { A: 40, B: 48, C: 36, D: 25 },
    5: { A: 35, B: 44, C: 31, D: 35 },
    6: { A: 29, B: 33, C: 52, D: 28 },
    7: { A: 45, B: 49, C: 32, D: 14 },
    8: { A: 38, B: 41, C: 39, D: 20 },
  },
};

export const CrmStorage = {
  getLeads(): LeadRecord[] {
    try {
      const data = localStorage.getItem(LEADS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
        return INITIAL_SAMPLE_LEADS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAMPLE_LEADS;
    }
  },

  saveLead(lead: Omit<LeadRecord, 'id' | 'createdAt' | 'status'>): LeadRecord {
    const leads = this.getLeads();
    const newLead: LeadRecord = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    leads.unshift(newLead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));

    // Also update analytics
    this.trackLeadSubmission(lead.resultId);
    return newLead;
  },

  updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): void {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index !== -1) {
      leads[index].status = status;
      if (notes !== undefined) {
        leads[index].notes = notes;
      }
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    }
  },

  deleteLead(leadId: string): void {
    const leads = this.getLeads().filter((l) => l.id !== leadId);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  },

  getAnalytics(): AnalyticsStats {
    try {
      const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(INITIAL_ANALYTICS));
        return INITIAL_ANALYTICS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ANALYTICS;
    }
  },

  trackScreenView(): void {
    const stats = this.getAnalytics();
    stats.screenViews += 1;
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(stats));
  },

  trackQuizStart(): void {
    const stats = this.getAnalytics();
    stats.quizzesStarted += 1;
    stats.questionDropoff[1] = (stats.questionDropoff[1] || 0) + 1;
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(stats));
  },

  trackAnswer(questionId: number, optionKey: OptionKey): void {
    const stats = this.getAnalytics();
    if (!stats.answersCount[questionId]) {
      stats.answersCount[questionId] = { A: 0, B: 0, C: 0, D: 0 };
    }
    stats.answersCount[questionId][optionKey] = (stats.answersCount[questionId][optionKey] || 0) + 1;

    const nextQ = questionId + 1;
    if (nextQ <= 8) {
      stats.questionDropoff[nextQ] = (stats.questionDropoff[nextQ] || 0) + 1;
    }
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(stats));
  },

  trackQuizCompleted(resultId: ResultId): void {
    const stats = this.getAnalytics();
    stats.quizzesCompleted += 1;
    stats.resultDistribution[resultId] = (stats.resultDistribution[resultId] || 0) + 1;
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(stats));
  },

  trackLeadSubmission(resultId: ResultId): void {
    const stats = this.getAnalytics();
    stats.leadsSubmitted += 1;
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(stats));
  },

  getSettings(): KioskSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: KioskSettings): void {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  },

  resetDemoData(): void {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(INITIAL_ANALYTICS));
  },

  exportToCsv(): void {
    const leads = this.getLeads();
    const headers = ['ID', 'Дата создания', 'Имя', 'Телефон', 'Компания', 'Результат теста', 'Статус', 'Заметки'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString('ru-RU'),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.resultTitle || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kaminskiy_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
