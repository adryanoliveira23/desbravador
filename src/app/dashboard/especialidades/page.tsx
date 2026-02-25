"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Award,
  Search,
  Filter,
  Plus,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const mainSpecializations = [
  {
    title: "Artes e Habilidades Manuais",
    category: "artes",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Atividades Agrícolas",
    category: "agricolas",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Ciência e Saúde",
    category: "ciencia",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Natureza",
    category: "natureza",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Vida Prática",
    category: "pratica",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Atividades Missionárias",
    category: "missionaria",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

interface Conclusion {
  id: string;
  title: string;
  category: string;
  concludedAt: string;
  userId: string;
  displayName?: string;
  // userPhotoURL?: string; // Add if we start storing photos
}

export default function SpecialtiesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSpecTitle, setNewSpecTitle] = useState("");
  const [newSpecCategory, setNewSpecCategory] = useState("artes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentConclusions, setRecentConclusions] = useState<Conclusion[]>([]);

  useEffect(() => {
    // 1. Optimized listener for category counts
    const qCount = query(collection(db, "specialties_concluded"));
    const unsubscribeCounts = onSnapshot(qCount, (snapshot) => {
      const newCounts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const cat = doc.data().category;
        if (cat) newCounts[cat] = (newCounts[cat] || 0) + 1;
      });
      setCounts(newCounts);
      setLoading(false);
    });

    // 2. Optimized listener for recent activity (limit 15 globally)
    const qRecent = query(
      collection(db, "specialties_concluded"),
      orderBy("concludedAt", "desc"),
      limit(15),
    );
    const unsubscribeRecent = onSnapshot(qRecent, (snapshot) => {
      const recent = snapshot.docs.map((doc) => ({
        ...(doc.data() as Conclusion),
        id: doc.id,
      }));
      setRecentConclusions(recent);
    });

    return () => {
      unsubscribeCounts();
      unsubscribeRecent();
    };
  }, []);

  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecTitle) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "specialties_concluded"), {
        title: newSpecTitle,
        category: newSpecCategory,
        concludedAt: new Date().toISOString(),
        userId: "demo-user", // In a real app, get from Auth context
      });
      setShowAddModal(false);
      setNewSpecTitle("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Especialidades{" "}
            <span className="text-primary italic">e Conquistas</span>
          </h1>
          <p className="text-slate-700 font-medium">
            Gerencie e acompanhe a conclusão de especialidades do seu clube.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <Plus size={18} /> Adicionar Nova
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar especialidade..."
            icon={<Search size={18} />}
            className="bg-white border-amber-50 h-14 rounded-2xl"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 h-14 px-6 rounded-2xl border-amber-100 text-slate-600 font-bold"
        >
          <Filter size={18} /> Filtros
        </Button>
      </div>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Carregando especialidades...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainSpecializations.map((spec, i) => (
            <Card
              key={i}
              className="bg-white border-blue-50/50 group hover:border-primary/20 transition-all shadow-lg hover:shadow-2xl shadow-blue-900/5 !p-8"
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${spec.bg}`}>
                  <Award className={spec.color} size={32} />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900">
                    {counts[spec.category] || 0}
                  </p>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    Concluídas
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {spec.title}
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Avaliação e registro de{" "}
                  <span className="text-slate-900 font-bold uppercase text-[10px]">
                    {spec.category}
                  </span>{" "}
                  conforme diretrizes oficiais do clube.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {recentConclusions
                    .filter((c) => c.category === spec.category)
                    .map((c) => (
                      <div
                        key={c.id}
                        className="w-10 h-10 rounded-full border-4 border-white bg-primary flex items-center justify-center text-[10px] text-white font-black overflow-hidden shadow-sm uppercase"
                        title={c.title}
                      >
                        {c.title.charAt(0)}
                      </div>
                    ))}
                  {(counts[spec.category] || 0) > 0 &&
                    recentConclusions.filter(
                      (c) => c.category === spec.category,
                    ).length === 0 && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-3">
                        Total: {counts[spec.category]}
                      </p>
                    )}
                  {counts[spec.category] === 0 && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-3">
                      Sem registros
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 hover:bg-transparent text-primary font-black uppercase tracking-widest text-[10px]"
                >
                  Detalhes <ChevronRight size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white !p-10 rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Nova Conquista
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">
                Registre uma nova especialidade concluída por um membro.
              </p>

              <form onSubmit={handleAddSpecialty} className="space-y-4">
                <Input
                  label="Nome da Especialidade"
                  value={newSpecTitle}
                  onChange={(e) => setNewSpecTitle(e.target.value)}
                  placeholder="Ex: Primeiros Socorros"
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Categoria
                  </label>
                  <select
                    value={newSpecCategory}
                    onChange={(e) => setNewSpecCategory(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {mainSpecializations.map((s) => (
                      <option key={s.category} value={s.category}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Registrar Especialidade"
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
