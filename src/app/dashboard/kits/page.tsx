"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Package,
  Plus,
  Tag,
  ShoppingCart,
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

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Logística");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Gestão de <span className="text-primary italic">Kits</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Organize materiais, recursos visuais e listas de compras do clube.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 h-14 px-6 border-amber-100 text-slate-600 font-bold rounded-2xl"
          >
            <ShoppingCart size={18} /> Lista de Compras
          </Button>
          <Button
            className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} /> Novo Kit
          </Button>
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
