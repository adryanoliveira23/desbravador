"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Package,
  Trash2,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

interface PlannerEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  items: string[];
}

import { generateContent } from "@/lib/ai";

export default function PlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // ... (rest of helper functions)

  const handleAISuggest = async () => {
    setIsSuggesting(true);
    try {
      const prompt = `Sugira um título criativo e curto para um evento de Desbravadores/Aventureiros no mês de ${monthNames[currentMonth]}. Retorne APENAS o título (máximo 4 palavras).`;
      const suggestion = await generateContent(prompt);
      setTitle(suggestion.replace(/"/g, ""));
    } catch (error) {
      console.error("Erro na sugestão IA:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    // Buscar todos os eventos do clube (podemos filtrar por ano no futuro se crescer muito)
    const q = query(collection(db, "meetings"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<PlannerEvent, "id">),
      }));
      setEvents(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: 42 }); // 6 weeks grid

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "meetings"), {
        title,
        date,
        time,
        location: eventLocation,
        createdAt: new Date().toISOString(),
        items: [],
      });
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Deseja excluir este evento?")) {
      await deleteDoc(doc(db, "meetings", id));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setEventLocation("");
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            Planejador{" "}
            <span className="text-primary italic font-serif">Anual</span>
          </h1>
          <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em]">
            Agenda estratégica integrada com Firebase
          </p>
        </div>
        <Button
          className="gap-2 h-12 md:h-14 px-6 md:px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-xs md:text-sm"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Novo Evento
        </Button>
      </div>

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Sincronizando agenda...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Calendar Grid */}
          <Card className="lg:col-span-8 bg-white border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden !p-0">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <h3 className="font-black text-slate-900 text-base md:text-xl uppercase tracking-tighter">
                  {monthNames[currentMonth]}{" "}
                  <span className="text-primary">{currentYear}</span>
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevMonth}
                    className="p-1 md:p-2 h-auto text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextMonth}
                    className="p-1 md:p-2 h-auto text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-50 border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] px-4"
                >
                  Mês
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grow min-h-[400px] md:min-h-[500px]">
              {days.map((_, i) => {
                const dayNumber = i - firstDay + 1;
                const isCurrentMonth =
                  dayNumber > 0 && dayNumber <= daysInMonth;

                // Formatar data para comparação (YYYY-MM-DD)
                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

                const dayEvents = events.filter((e) => e.date === dateString);

                return (
                  <div
                    key={i}
                    className={cn(
                      "border-r border-b border-slate-50 p-2 md:p-3 h-20 md:h-32 transition-colors relative group overflow-hidden",
                      !isCurrentMonth ? "bg-slate-50/30" : "hover:bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs md:text-sm font-black transition-colors",
                        !isCurrentMonth ? "text-slate-200" : "text-slate-900",
                        dayEvents.length > 0 && isCurrentMonth
                          ? "text-primary"
                          : "",
                      )}
                    >
                      {isCurrentMonth ? dayNumber : ""}
                    </span>

                    <div className="mt-1 space-y-1">
                      {isCurrentMonth &&
                        dayEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="px-1.5 py-0.5 md:py-1 bg-primary text-white text-[7px] md:text-[8px] font-black uppercase tracking-tighter rounded-md truncate shadow-sm"
                            title={evt.title}
                          >
                            {evt.title}
                          </div>
                        ))}
                    </div>

                    {isCurrentMonth && dayEvents.length > 0 && (
                      <div className="absolute right-1 bottom-1 md:right-3 md:bottom-3 w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full animate-pulse lg:hidden"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Events List */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
              Agenda{" "}
              <span className="text-primary italic font-serif">Ativa</span>
            </h3>

            {events.filter((e) => {
              const d = new Date(e.date);
              return (
                d.getMonth() === currentMonth && d.getFullYear() === currentYear
              );
            }).length === 0 ? (
              <div className="p-8 md:p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <CalendarIcon
                  size={32}
                  className="mx-auto text-slate-200 mb-4"
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Não há eventos planejados de forma oficial para este mês.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {events
                  .filter((e) => {
                    const d = new Date(e.date);
                    return (
                      d.getMonth() === currentMonth &&
                      d.getFullYear() === currentYear
                    );
                  })
                  .map((event) => (
                    <Card
                      key={event.id}
                      className="bg-white border-slate-100 border-l-4 border-l-primary !p-6 md:!p-8 shadow-lg hover:shadow-xl transition-all relative group"
                    >
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="mb-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">
                          Estratégia do Mês
                        </span>
                        <h4 className="font-black text-slate-900 text-base md:text-lg leading-tight">
                          {event.title}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <Clock size={16} />
                          </div>{" "}
                          {event.time}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <MapPin size={16} />
                          </div>{" "}
                          {event.location}
                        </div>
                      </div>

                      {event.items && event.items.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2 mb-3">
                            <Package size={14} className="text-primary" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Logística Geral
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {event.items.map((item: string) => (
                              <span
                                key={item}
                                className="px-2.5 py-1 bg-slate-50 text-[9px] font-black text-slate-700 border border-slate-100 rounded-md"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Novo Evento */}
      <AnimatePresence mode="wait">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white !p-8 md:!p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl z-50 overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-orange-500"></div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                  Novo{" "}
                  <span className="text-primary italic font-serif">
                    Compromisso
                  </span>
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Agendamento estratégico integrado
                </p>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      Título do Evento
                    </label>
                    <button
                      type="button"
                      onClick={handleAISuggest}
                      disabled={isSuggesting}
                      className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      {isSuggesting ? (
                        <>
                          <Loader2 size={10} className="animate-spin" />{" "}
                          Sugerindo...
                        </>
                      ) : (
                        <>
                          <Sparkles size={10} /> Sugerir com IA
                        </>
                      )}
                    </button>
                  </div>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Reunião de Staff Avançada"
                    required
                    className="h-12 border-slate-200 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
                      Data Oficial
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="h-12 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
                      Horário
                    </label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="h-12 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
                    Localização / Endereço
                  </label>
                  <Input
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Ex: Sede do Clube ou Link Meet"
                    required
                    className="h-12 border-slate-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 mt-6 md:mt-8 bg-slate-900 text-white hover:bg-primary transition-all rounded-2xl md:rounded-3xl"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
