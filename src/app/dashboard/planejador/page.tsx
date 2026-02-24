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

export default function PlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Planejador <span className="text-primary italic">Inteligente</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Agenda integrada com recursos e materiais necessários.
          </p>
        </div>
        <Button
          className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Novo Evento
        </Button>
      </div>

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Carregando agenda...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <Card className="lg:col-span-2 bg-white border-amber-50 shadow-2xl shadow-amber-900/5">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-black text-slate-900 text-lg">
                  Março 2026
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto text-slate-400 hover:text-primary"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto text-slate-400 hover:text-primary"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-amber-50 border-amber-200 text-amber-700 font-bold"
                >
                  Mês
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 font-bold"
                >
                  Semana
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 grow min-h-[500px]">
              {Array.from({ length: 35 }).map((_, i) => {
                const currentDay = i - 1;
                const hasEvent = events.some((e) => {
                  const eventDate = new Date(e.date);
                  return (
                    eventDate.getDate() === currentDay &&
                    eventDate.getMonth() === 2
                  );
                });

                return (
                  <div
                    key={i}
                    className="border-r border-b border-slate-50 p-3 h-32 hover:bg-slate-50/50 transition-colors relative group"
                  >
                    <span className="text-sm font-black text-slate-300 group-hover:text-primary transition-colors">
                      {currentDay > 0 && currentDay <= 31 ? currentDay : ""}
                    </span>
                    {hasEvent && (
                      <div className="absolute inset-x-1 bottom-1 p-1 bg-primary/10 border-l-4 border-primary rounded text-[8px] text-primary font-bold truncate">
                        Evento Marcado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Events List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Próximos <span className="text-primary italic">Eventos</span>
            </h3>
            {events.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Nenhum evento próximo
                </p>
              </div>
            ) : (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white border-slate-100 border-l-4 border-l-primary !p-8 shadow-lg hover:shadow-xl transition-all relative group"
                >
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <h4 className="font-black text-slate-900 mb-4 text-lg">
                    {event.title}
                  </h4>
                  <div className="space-y-3 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-primary">
                        <CalendarIcon size={16} />
                      </div>{" "}
                      {event.date}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-primary">
                        <Clock size={16} />
                      </div>{" "}
                      {event.time}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-primary">
                        <MapPin size={16} />
                      </div>{" "}
                      {event.location}
                    </div>
                  </div>
                  {event.items && event.items.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Logística e Materiais:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.items.map((item: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 border border-slate-100 flex items-center gap-2"
                          >
                            <Package size={12} className="text-primary" />{" "}
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Novo Evento */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-100 !p-10 rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Agendar Evento
              </h2>
              <p className="text-slate-400 mb-8 text-sm font-medium">
                Sincronize as atividades do clube com a agenda real.
              </p>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Título do Evento
                  </label>
                  <button
                    type="button"
                    onClick={() => window.open("/dashboard/ia", "_blank")}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Sparkles size={12} /> Sugerir com IA
                  </button>
                </div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Reunião de Unidade"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                      Data
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                      Hora
                    </label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Localização
                  </label>
                  <Input
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Ex: Sede do Clube"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Salvar Evento"
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
