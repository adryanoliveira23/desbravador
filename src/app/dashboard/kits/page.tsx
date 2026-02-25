"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Package,
  Plus,
  Tag,
  Trash2,
  Loader2,
  X,
  Sparkles,
  Zap,
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

interface Kit {
  id: string;
  name: string;
  category: string;
  status: string;
  items: number;
  alert?: boolean;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Logística");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "kits"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Kit, "id">),
      }));
      setKits(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateAI = async () => {
    if (!name) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Crie um kit completo para Desbravadores sobre o tema: ${name}. Liste os itens necessários e uma breve explicação pedagógica.`,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setGeneratedContent(data.result);
      }
    } catch (error) {
      console.error(error);
      setGeneratedContent("Erro ao gerar conteúdo via IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "kits"), {
        name,
        category,
        status: "Completo",
        items: 0,
        createdAt: new Date().toISOString(),
      });
      setShowModal(false);
      setName("");
      setGeneratedContent(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKit = async (id: string) => {
    if (confirm("Deseja excluir este kit?")) {
      await deleteDoc(doc(db, "kits", id));
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Package size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
              Painel IA / Ferramentas
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">
              Portal{" "}
              <span className="text-primary uppercase tracking-tighter">
                Desbravadores
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <Plus size={20} />
          </button>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs uppercase">
              U
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">
                Diretor
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                Configurações
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ─── LEFT SIDE: CONFIG ─── */}
        <Card className="bg-white rounded-[3rem] p-12 border-none shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                FÁBRICA DE KITS
              </h2>
              <p className="text-slate-700 font-medium">
                Gere materiais pedagógicos, listas de compras e passos de
                atividades.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 block">
                Tema ou Especialidade
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Kit de Primeiros Socorros"
                className="h-16 bg-slate-50 border-none rounded-2xl px-6 text-lg font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating || !name}
              className="w-full h-16 md:h-20 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-lg md:text-xl uppercase tracking-widest rounded-2xl md:rounded-3xl shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Gerar com Inteligência"
              )}
            </Button>
          </div>
        </Card>

        {/* ─── RIGHT SIDE: RESULTS ─── */}
        <Card className="bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            {!generatedContent && !isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-600 mx-auto border border-slate-100 shadow-xl">
                  <Sparkles size={40} />
                </div>
                <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">
                  Aguardando sua ideia...
                </p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                  <Zap
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse"
                    size={32}
                  />
                </div>
                <div>
                  <p className="text-primary font-black uppercase text-sm tracking-widest mb-2">
                    Processando
                  </p>
                  <p className="text-slate-600 font-medium">
                    Consultando manuais oficiais da DSA...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full text-left"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                      <Zap size={20} />
                    </div>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                      Análise concluída com sucesso
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateKit}
                    className="h-10 px-6 font-black uppercase tracking-widest text-[10px]"
                  >
                    Salvar Kit
                  </Button>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl prose prose-slate max-w-none prose-sm">
                  {generatedContent?.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className="mb-2 last:mb-0 font-medium text-slate-600"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative gradients */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100/50 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
        </Card>
      </div>

      <div className="pt-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Meus <span className="text-primary italic">Kits Salvos</span>
          </h2>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Carregando inventário...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <Card
              key={kit.id}
              className="relative overflow-hidden group bg-white border-amber-50 hover:border-amber-200 transition-all shadow-lg hover:shadow-2xl shadow-amber-900/5 !p-8"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Package
                    size={28}
                    className="text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 ${
                      kit.alert
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {kit.status}
                  </span>
                  <button
                    onClick={() => handleDeleteKit(kit.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {kit.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-8 flex items-center gap-2">
                <Tag size={16} className="text-primary/60" /> {kit.category} •{" "}
                <span className="text-slate-900 font-bold">
                  {kit.items} itens
                </span>
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1 text-[10px] font-black uppercase h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl"
                >
                  Ver Itens
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-[10px] font-black uppercase h-11 border-blue-50 text-primary hover:bg-blue-50 rounded-xl"
                >
                  Editar
                </Button>
              </div>

              {kit.alert && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                  <div className="absolute top-[-25px] right-[-25px] w-12 h-12 bg-red-500/20 blur-xl"></div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Novo Kit */}
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
              className="relative w-full max-w-md bg-white !p-10 rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Novo Kit de Materiais
              </h2>
              <form onSubmit={handleCreateKit} className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nome do Kit
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Kit de Primeiros Socorros"
                  required
                />
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="Logística">Logística</option>
                    <option value="Instrução">Instrução</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Cozinha">Cozinha</option>
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
                    "Criar Kit"
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
