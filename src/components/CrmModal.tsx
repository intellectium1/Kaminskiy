import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadRecord, AnalyticsStats, LeadStatus, ResultId } from '../types/quiz';
import { CrmStorage, KioskSettings } from '../services/crmStorage';
import { QUIZ_RESULTS } from '../data/quizData';
import {
  X,
  Users,
  BarChart3,
  Settings,
  Download,
  Search,
  Phone,
  MessageCircle,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle,
  FileSpreadsheet,
  Building2,
  Calendar,
} from 'lucide-react';

interface CrmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrmModal: React.FC<CrmModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics' | 'settings'>('leads');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [settings, setSettings] = useState<KioskSettings>(CrmStorage.getSettings());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');

  // Manual lead creation modal state
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadResult, setNewLeadResult] = useState<ResultId>('status_recognition');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Editing note inline
  const [editingNoteLeadId, setEditingNoteLeadId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');

  const refreshData = () => {
    setLeads(CrmStorage.getLeads());
    setAnalytics(CrmStorage.getAnalytics());
    setSettings(CrmStorage.getSettings());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesResult = resultFilter === 'all' || lead.resultId === resultFilter;

    return matchesSearch && matchesStatus && matchesResult;
  });

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    CrmStorage.updateLeadStatus(leadId, status);
    refreshData();
  };

  const handleSaveNote = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      CrmStorage.updateLeadStatus(leadId, lead.status, currentNoteText);
      setEditingNoteLeadId(null);
      refreshData();
    }
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Удалить данный контакт из базы CRM?')) {
      CrmStorage.deleteLead(leadId);
      refreshData();
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    CrmStorage.saveLead({
      name: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      company: newLeadCompany.trim(),
      resultId: newLeadResult,
      resultTitle: QUIZ_RESULTS[newLeadResult].title,
      notes: newLeadNotes.trim() || 'Добавлен менеджером вручную на стенде',
      source: 'Стенд (Ручной ввод)',
      answers: { 1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'A' },
    });

    setIsAddingLead(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadCompany('');
    setNewLeadNotes('');
    refreshData();
  };

  const handleSaveSettings = (newSettings: KioskSettings) => {
    setSettings(newSettings);
    CrmStorage.saveSettings(newSettings);
  };

  const handleResetDemoData = () => {
    if (confirm('Сбросить данные к демо-состоянию? Все добавленные контакты будут заменены.')) {
      CrmStorage.resetDemoData();
      refreshData();
    }
  };

  // Funnel calculations
  const totalViews = analytics?.screenViews || 1;
  const totalStarts = analytics?.quizzesStarted || 0;
  const totalCompleted = analytics?.quizzesCompleted || 0;
  const totalLeads = analytics?.leadsSubmitted || leads.length;

  const startRate = Math.round((totalStarts / totalViews) * 100);
  const completionRate = totalStarts > 0 ? Math.round((totalCompleted / totalStarts) * 100) : 0;
  const leadConvRate = totalCompleted > 0 ? Math.round((totalLeads / totalCompleted) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-5xl h-[90vh] bg-[#27040B] border border-[#F5E6D3]/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#F5E6D3]"
      >
        {/* CRM Top Header */}
        <header className="px-5 py-4 border-b border-[#F5E6D3]/15 flex items-center justify-between bg-[#380912]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C87D39]/20 border border-[#C87D39]/50 flex items-center justify-center text-[#C87D39]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-tercia text-lg sm:text-xl text-[#F5E6D3] tracking-wider leading-none">
                CRM & Аналитика · ЖК Каминский
              </h2>
              <p className="text-[11px] text-[#E5D3BA]/60 font-norms mt-0.5">
                Панель управления лидами интерактивного квиза
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => CrmStorage.exportToCsv()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C87D39] hover:bg-[#DA8F4B] text-white text-xs font-norms font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт CSV</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#3E0C16] hover:bg-[#5A1423] text-[#F5E6D3] flex items-center justify-center transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Quick KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:px-6 sm:py-3 bg-[#1F0308] border-b border-[#F5E6D3]/10 text-xs font-norms">
          <div className="p-2.5 rounded-xl bg-[#2D050D] border border-[#F5E6D3]/10">
            <p className="text-[#E5D3BA]/60 text-[10px] uppercase">Просмотры стенда</p>
            <p className="text-lg font-bold text-[#F5E6D3] mt-0.5">{totalViews}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#2D050D] border border-[#F5E6D3]/10">
            <p className="text-[#E5D3BA]/60 text-[10px] uppercase">Запуски теста</p>
            <p className="text-lg font-bold text-[#E8A15C] mt-0.5">
              {totalStarts}{' '}
              <span className="text-[11px] font-normal text-[#F5E6D3]/50">({startRate}%)</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#2D050D] border border-[#F5E6D3]/10">
            <p className="text-[#E5D3BA]/60 text-[10px] uppercase">Завершений теста</p>
            <p className="text-lg font-bold text-[#F5E6D3] mt-0.5">
              {totalCompleted}{' '}
              <span className="text-[11px] font-normal text-[#F5E6D3]/50">({completionRate}%)</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#2D050D] border border-[#C87D39]/30">
            <p className="text-[#C87D39] text-[10px] uppercase font-semibold">Собрано лидов</p>
            <p className="text-lg font-bold text-[#C87D39] mt-0.5">
              {leads.length}{' '}
              <span className="text-[11px] font-normal text-emerald-400">({leadConvRate}% CR)</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-[#F5E6D3]/10 bg-[#27040B]">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-norms font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'border-[#C87D39] text-white'
                  : 'border-transparent text-[#E5D3BA]/60 hover:text-[#F5E6D3]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>База контактов ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-norms font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'border-[#C87D39] text-white'
                  : 'border-transparent text-[#E5D3BA]/60 hover:text-[#F5E6D3]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Аналитика по 8 результатам</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-norms font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-[#C87D39] text-white'
                  : 'border-transparent text-[#E5D3BA]/60 hover:text-[#F5E6D3]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Настройки стенда</span>
            </button>
          </div>

          {activeTab === 'leads' && (
            <button
              onClick={() => setIsAddingLead(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E0C16] hover:bg-[#521320] text-[#E8A15C] text-xs font-norms transition-colors cursor-pointer mb-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить лид</span>
            </button>
          )}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#27040B]">
          {/* TAB 1: LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#F5E6D3]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по имени, телефону, компании или заметке..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-[#F5E6D3] placeholder-[#F5E6D3]/40 focus:outline-none focus:border-[#C87D39]"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-[#F5E6D3] focus:outline-none focus:border-[#C87D39]"
                  >
                    <option value="all">Все статусы</option>
                    <option value="new">Новый</option>
                    <option value="processing">В обработке</option>
                    <option value="meeting">Встреча / Показ</option>
                    <option value="deal">Сделка</option>
                    <option value="archive">Архив</option>
                  </select>

                  <select
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-[#F5E6D3] focus:outline-none focus:border-[#C87D39] max-w-[180px] truncate"
                  >
                    <option value="all">Все 8 результатов</option>
                    {Object.values(QUIZ_RESULTS).map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              {filteredLeads.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#1C0207]/60 border border-[#F5E6D3]/10">
                  <Users className="w-8 h-8 text-[#C87D39]/50 mx-auto mb-2" />
                  <p className="text-sm text-[#F5E6D3]/70 font-norms">Лиды по данному фильтру не найдены</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-[#320811]/90 border border-[#F5E6D3]/15 hover:border-[#C87D39]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-norms"
                    >
                      {/* Left: Contact Info */}
                      <div className="flex-1 min-w-[220px]">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm sm:text-base font-semibold text-[#F5E6D3]">
                            {lead.name}
                          </h4>
                          {lead.company && (
                            <span className="text-xs text-[#E5D3BA]/70 px-2 py-0.5 rounded bg-[#24040A]">
                              {lead.company}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#E5D3BA]/70">
                          <a
                            href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                            className="flex items-center gap-1 text-[#E8A15C] hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </a>

                          <span className="text-[#F5E6D3]/20">·</span>

                          <span className="flex items-center gap-1 text-[11px] text-[#F5E6D3]/50">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Result Archetype Badge */}
                        <div className="mt-2 text-xs text-[#F5E6D3]/80">
                          <span className="text-[#C87D39] text-[11px] uppercase tracking-wider font-semibold">
                            Результат:
                          </span>{' '}
                          <span className="font-tercia text-xs tracking-wide">
                            {lead.resultTitle || QUIZ_RESULTS[lead.resultId]?.title}
                          </span>
                        </div>

                        {/* Inline Note */}
                        <div className="mt-2 text-xs text-[#D1BEA8]/80 bg-[#24040A]/60 p-2 rounded-lg border border-[#F5E6D3]/5">
                          {editingNoteLeadId === lead.id ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={currentNoteText}
                                onChange={(e) => setCurrentNoteText(e.target.value)}
                                className="flex-1 px-2 py-1 text-xs rounded bg-[#1C0207] border border-[#F5E6D3]/30 text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveNote(lead.id)}
                                className="px-2 py-1 text-[11px] rounded bg-[#C87D39] text-white"
                              >
                                Сохранить
                              </button>
                              <button
                                onClick={() => setEditingNoteLeadId(null)}
                                className="px-2 py-1 text-[11px] text-[#F5E6D3]/60"
                              >
                                Отмена
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingNoteLeadId(lead.id);
                                setCurrentNoteText(lead.notes || '');
                              }}
                              className="cursor-pointer hover:text-white"
                              title="Нажмите, чтобы изменить заметку"
                            >
                              💬 {lead.notes || 'Нажмите, чтобы добавить заметку о клиенте...'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status & Quick Communication Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end">
                        {/* Status Select */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium focus:outline-none ${
                            lead.status === 'new'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                              : lead.status === 'processing'
                              ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                              : lead.status === 'meeting'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                              : lead.status === 'deal'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                              : 'bg-stone-900/60 text-stone-400 border-stone-800/60'
                          }`}
                        >
                          <option value="new">Новый</option>
                          <option value="processing">В обработке</option>
                          <option value="meeting">Встреча / Показ</option>
                          <option value="deal">Сделка</option>
                          <option value="archive">Архив</option>
                        </select>

                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                            `Здравствуйте, ${lead.name}! Вы проходили тест по клубному особняку «Каминский». Ваш персональный сценарий — «${
                              lead.resultTitle || 'Роскошь'
                            }». Готовы ответить на любые вопросы и организовать приватный показ.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 transition-colors"
                          title="Написать в WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Call button */}
                        <a
                          href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                          className="p-2 rounded-lg bg-[#3E0C16] hover:bg-[#521320] text-[#E8A15C] border border-[#F5E6D3]/15 transition-colors"
                          title="Позвонить"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 rounded-lg bg-[#27040B] hover:bg-rose-950/60 text-rose-400/60 hover:text-rose-400 border border-rose-900/30 transition-colors cursor-pointer"
                          title="Удалить лид"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALYTICS BY 8 RESULTS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6 font-norms">
              {/* Distribution across all 8 results */}
              <div className="p-5 rounded-2xl bg-[#320811] border border-[#F5E6D3]/15">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-tercia text-lg text-[#F5E6D3]">
                      Конверсия и распределение по 8 сценариям роскоши
                    </h3>
                    <p className="text-xs text-[#E5D3BA]/60">
                      Анализ интересов аудитории на основе выбранных ответов в квизе
                    </p>
                  </div>
                  <span className="text-xs text-[#C87D39] font-medium">
                    Всего завершений: {totalCompleted}
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.values(QUIZ_RESULTS).map((res) => {
                    const count = analytics.resultDistribution[res.id] || 0;
                    const pct = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;

                    return (
                      <div key={res.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#F5E6D3]">
                            {res.title}{' '}
                            <span className="text-[#E5D3BA]/60 font-normal">({res.archetype})</span>
                          </span>
                          <span className="text-[#E8A15C] font-mono">
                            {count} чел. ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#1C0207] overflow-hidden border border-[#F5E6D3]/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#B86B28] via-[#C87D39] to-[#E8A15C]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="p-5 rounded-2xl bg-[#320811] border border-[#F5E6D3]/15">
                <h3 className="font-tercia text-lg text-[#F5E6D3] mb-3">
                  Воронка прохождения квиза
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[#24040A] border border-[#F5E6D3]/10">
                    <p className="text-xs text-[#E5D3BA]/60">1. Заставка</p>
                    <p className="text-lg font-bold text-white mt-1">{totalViews}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">100% базы</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#24040A] border border-[#F5E6D3]/10">
                    <p className="text-xs text-[#E5D3BA]/60">2. Старт теста</p>
                    <p className="text-lg font-bold text-white mt-1">{totalStarts}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">{startRate}% от заставки</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#24040A] border border-[#F5E6D3]/10">
                    <p className="text-xs text-[#E5D3BA]/60">3. Все 8 вопросов</p>
                    <p className="text-lg font-bold text-white mt-1">{totalCompleted}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">{completionRate}% дошли</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#24040A] border border-[#C87D39]/30">
                    <p className="text-xs text-[#C87D39]">4. Отправка контакта</p>
                    <p className="text-lg font-bold text-[#E8A15C] mt-1">{leads.length}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">{leadConvRate}% конверсия в лид</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KIOSK SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl mx-auto font-norms">
              <div className="p-5 rounded-2xl bg-[#320811] border border-[#F5E6D3]/15 space-y-4">
                <h3 className="font-tercia text-lg text-[#F5E6D3]">
                  Параметры работы интерактивного стенда
                </h3>

                <div>
                  <label className="block text-xs text-[#E5D3BA]/80 mb-1.5">
                    Время таймера неактивности на финальном экране (секунды):
                  </label>
                  <select
                    value={settings.inactivityTimeoutSeconds}
                    onChange={(e) =>
                      handleSaveSettings({
                        ...settings,
                        inactivityTimeoutSeconds: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white"
                  >
                    <option value={15}>15 секунд (быстрый сброс для выставок)</option>
                    <option value={30}>30 секунд</option>
                    <option value={45}>45 секунд (рекомендуется)</option>
                    <option value={60}>60 секунд (1 минута)</option>
                    <option value={120}>120 секунд (2 минуты)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#E5D3BA]/80 mb-1.5">
                    Действие после истечения таймера:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          timeoutAction: 'restart_quiz',
                        })
                      }
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        settings.timeoutAction === 'restart_quiz'
                          ? 'border-[#C87D39] bg-[#C87D39]/20 text-white'
                          : 'border-[#F5E6D3]/15 bg-[#1C0207] text-[#E5D3BA]/60'
                      }`}
                    >
                      <strong className="block text-white mb-0.5">В начало квиза</strong>
                      Возврат на заставку с воблером
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          timeoutAction: 'redirect_website',
                        })
                      }
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        settings.timeoutAction === 'redirect_website'
                          ? 'border-[#C87D39] bg-[#C87D39]/20 text-white'
                          : 'border-[#F5E6D3]/15 bg-[#1C0207] text-[#E5D3BA]/60'
                      }`}
                    >
                      <strong className="block text-white mb-0.5">На сайт особняка</strong>
                      Переход на wwgroup.ru/kaminskiy
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5E6D3]/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Демо-данные</p>
                    <p className="text-[11px] text-[#E5D3BA]/60">
                      Восстановить примеры лидов и статистики
                    </p>
                  </div>
                  <button
                    onClick={handleResetDemoData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E0C16] hover:bg-[#521320] text-[#E8A15C] text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Сбросить к демо</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for adding lead manually */}
        {isAddingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#2D050D] border border-[#F5E6D3]/30 shadow-2xl font-norms">
              <h3 className="font-tercia text-lg text-white mb-4">
                Добавить контакт вручную
              </h3>
              <form onSubmit={handleCreateLead} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Имя клиента *"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white placeholder-[#F5E6D3]/40"
                />

                <input
                  type="tel"
                  required
                  placeholder="Телефон (+7 ...) *"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white placeholder-[#F5E6D3]/40"
                />

                <input
                  type="text"
                  placeholder="Компания"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white placeholder-[#F5E6D3]/40"
                />

                <select
                  value={newLeadResult}
                  onChange={(e) => setNewLeadResult(e.target.value as ResultId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white"
                >
                  {Object.values(QUIZ_RESULTS).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.archetype})
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Заметка или пожелания..."
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0207] border border-[#F5E6D3]/20 text-xs text-white placeholder-[#F5E6D3]/40"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingLead(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#E5D3BA]/70 hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs bg-[#C87D39] text-white hover:bg-[#DA8F4B]"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
