"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Award,
  Search,
  Plus,
  Download,
  ChevronRight,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect, useMemo } from "react";
import { SPECIALTIES_CATALOG } from "@/lib/specialties-catalog";
import { cn } from "@/lib/utils";

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
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [clubName, setClubName] = useState("");
  const [ministry, setMinistry] = useState("");

  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserName(
            userData.fullName || userData.name || user.displayName || "Usuário",
          );
          setClubName(userData.clubName || "");
          setMinistry(
            userData.ministry === "aventureiro"
              ? "Aventureiros"
              : "Desbravadores",
          );
        } else {
          setCurrentUserName(user.displayName || "Usuário");
        }
      }
    });

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
      unsubscribeAuth();
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCatalog = useMemo(() => {
    return SPECIALTIES_CATALOG.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const [selectedSpec, setSelectedSpec] = useState<{
    title: string;
    category: string;
  } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "quiz">("summary");

  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecTitle || !currentUserId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "specialties_concluded"), {
        title: newSpecTitle,
        category: newSpecCategory,
        concludedAt: new Date().toISOString(),
        userId: currentUserId,
        displayName: currentUserName,
      });
      setShowAddModal(false);
      setNewSpecTitle("");
      alert("Especialidade registrada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar especialidade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpecialty = async (id: string) => {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    try {
      await deleteDoc(doc(db, "specialties_concluded", id));
      alert("Registro excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir registro.");
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedSpec) return;
    setAiLoading(true);
    setAiResult("");
    setActiveTab("summary");
    try {
      const prompt = `Aja como um instrutor master de Desbravadores. Crie um resumo completo, didático e organizado para estudo da especialidade "${selectedSpec.title}" (Categoria: ${selectedSpec.category}). O resumo deve cobrir os principais requisitos e conhecimentos necessários para passar na prova. Use Markdown para formatar com títulos, listas e negrito.`;
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResult(data.result || "Erro ao gerar resumo.");
    } catch (error) {
      console.error(error);
      setAiResult("Ocorreu um erro ao conectar com a IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedSpec) return;
    setAiLoading(true);
    setAiResult("");
    setActiveTab("quiz");
    try {
      const prompt = `Crie um quiz interativo e divertido com 5 perguntas de múltipla escolha sobre a especialidade "${selectedSpec.title}". Formato: numere cada pergunta, coloque 4 alternativas (a, b, c, d) e ao final uma seção GABARITO. Use um tom encorajador para um Desbravador.`;
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResult(data.result || "Erro ao gerar quiz.");
    } catch (error) {
      console.error(error);
      setAiResult("Ocorreu um erro ao conectar com a IA.");
    } finally {
      setAiLoading(false);
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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar especialidade pelo nome..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-slate-100 h-14 rounded-2xl shadow-sm focus:ring-primary/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scroll-hide">
          <Button
            variant={selectedCategory === null ? "primary" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="h-14 px-6 rounded-2xl whitespace-nowrap font-bold"
          >
            Todas
          </Button>
          {mainSpecializations.map((cat) => (
            <Button
              key={cat.category}
              variant={
                selectedCategory === cat.category ? "primary" : "outline"
              }
              onClick={() => setSelectedCategory(cat.category)}
              className={cn(
                "h-14 px-6 rounded-2xl whitespace-nowrap font-bold transition-all",
                selectedCategory === cat.category
                  ? ""
                  : "border-slate-100 text-slate-500 hover:text-primary",
              )}
            >
              {cat.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCatalog.slice(0, 20).map((spec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              setSelectedSpec(spec);
              setShowDetailModal(true);
              setAiResult("");
            }}
          >
            <Card className="p-5 h-full border-slate-100 group hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    mainSpecializations.find(
                      (c) => c.category === spec.category,
                    )?.bg || "bg-slate-100",
                  )}
                >
                  <Award
                    className={cn(
                      "w-6 h-6",
                      mainSpecializations.find(
                        (c) => c.category === spec.category,
                      )?.color || "text-slate-600",
                    )}
                  />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight group-hover:text-primary transition-colors italic uppercase text-sm">
                    {spec.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {mainSpecializations.find(
                      (c) => c.category === spec.category,
                    )?.title || spec.category}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredCatalog.length > 20 && (
          <div className="col-span-full py-8 text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              E mais {filteredCatalog.length - 20} especialidades disponíveis no
              catálogo
            </p>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-100 font-black uppercase tracking-widest text-xs h-12 px-10"
            >
              Ver Catálogo Completo (205)
            </Button>
          </div>
        )}
      </div>

      <div className="pt-12 border-t border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">
          Resumo de{" "}
          <span className="text-primary italic">Conquistas do Clube</span>
        </h2>
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
                        className="w-10 h-10 rounded-full border-4 border-white bg-primary flex items-center justify-center text-[10px] text-white font-black overflow-hidden shadow-sm uppercase group/avatar relative"
                        title={`${c.displayName || "Usuário"}: ${c.title}`}
                      >
                        {c.displayName?.charAt(0) || c.title.charAt(0)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSpecialty(c.id);
                          }}
                          className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
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

      {/* Specialty Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSpec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white !p-0 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-12 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "p-5 rounded-2xl shadow-xl shadow-primary/5",
                      mainSpecializations.find(
                        (c) => c.category === selectedSpec.category,
                      )?.bg || "bg-slate-100",
                    )}
                  >
                    <Award
                      size={40}
                      className={cn(
                        mainSpecializations.find(
                          (c) => c.category === selectedSpec.category,
                        )?.color || "text-slate-600",
                      )}
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                      {selectedSpec.title}
                    </h2>
                    <p className="text-sm font-black text-primary uppercase tracking-[0.2em] mt-1">
                      {mainSpecializations.find(
                        (c) => c.category === selectedSpec.category,
                      )?.title || selectedSpec.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 text-slate-400 hover:text-slate-900 rounded-full transition-all bg-white shadow-sm border border-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    onClick={handleGenerateSummary}
                    className={cn(
                      "p-8 cursor-pointer border-2 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group",
                      activeTab === "summary" && aiResult
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                        : "border-slate-100 hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-4 text-left">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          Gerar Resumo para Estudo
                        </h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          Nossa IA vai preparar um guia completo baseado nos
                          requisitos oficiais desta especialidade.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    onClick={handleGenerateQuiz}
                    className={cn(
                      "p-8 cursor-pointer border-2 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group",
                      activeTab === "quiz" && aiResult
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                        : "border-slate-100 hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-4 text-left">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          Realizar Simulado/Quiz
                        </h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          Teste seus conhecimentos com um quiz dinâmico gerado
                          especialmente sobre este tema.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {aiLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                      <Award
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse"
                        size={32}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-2">
                        Preparando material especial...
                      </p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Aguarde a IA concluir o processamento
                      </p>
                    </div>
                  </div>
                ) : aiResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 md:p-14 bg-slate-900 rounded-[2rem] text-slate-100 shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                          <ChevronRight size={20} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.3em]">
                          {activeTab === "summary"
                            ? "Conteúdo de Estudo"
                            : "Quiz Interativo"}
                        </p>
                      </div>
                      <Button
                        onClick={() => window.print()}
                        className="bg-primary hover:bg-primary/90 text-white h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                      >
                        <Download size={16} /> Baixar Prova (PDF)
                      </Button>
                    </div>

                    <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-strong:text-primary prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded relative z-10 no-print">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiResult}
                      </ReactMarkdown>
                    </div>

                    {/* HIDDEN PRINT AREA */}
                    <div className="hidden print:block print-area">
                      <div className="print-border"></div>
                      <div className="print-header">
                        <div className="flex items-center gap-4">
                          <div className="print-logo bg-primary text-white p-2 rounded-xl flex items-center justify-center font-black">
                            PB
                          </div>
                          <div className="print-title">
                            <h1>{clubName || "Portal dos Desbravadores"}</h1>
                            <p>
                              Ministério {ministry || "Jovem"} •{" "}
                              {selectedSpec.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="print-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {aiResult}
                        </ReactMarkdown>
                      </div>

                      <div className="print-footer">
                        Este documento foi gerado via Inteligência Artificial no
                        Portal dos Desbravadores. Ministério{" "}
                        {ministry || "Jovem"}.
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-10 text-center flex flex-col items-center gap-4">
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                      <Award size={48} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        Aguardando Ação
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Escolha uma opção acima para começar sua jornada de
                        aprendizado.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
