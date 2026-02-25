"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, Shield, BookOpen, Loader2, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { Input } from "@/components/ui/Input";

interface Member {
  id: string;
  displayName: string;
  email: string;
  activeClass: string;
  role: string;
  createdAt: string;
  clubName: string;
  // Add any other fields that might be stored in a user document
}

const classes = [
  {
    id: "amigo",
    name: "Amigo",
    age: "10 anos",
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "companheiro",
    name: "Companheiro",
    age: "11 anos",
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "pesquisador",
    name: "Pesquisador",
    age: "12 anos",
    icon: Shield,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    id: "pioneiro",
    name: "Pioneiro",
    age: "13 anos",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "excursionista",
    name: "Excursionista",
    age: "14 anos",
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "guia",
    name: "Guia",
    age: "15 anos",
    icon: Shield,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function ClassesPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedClassForManage, setSelectedClassForManage] = useState<
    (typeof classes)[0] | null
  >(null);
  const [classMembers, setClassMembers] = useState<Member[]>([]);

  // New Enrollment Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserClass, setNewUserClass] = useState("amigo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "desbravador"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.activeClass) {
          counts[data.activeClass] = (counts[data.activeClass] || 0) + 1;
        }
      });
      setStats(counts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "users"), {
        displayName: newUserName,
        email: newUserEmail,
        activeClass: newUserClass,
        role: "desbravador",
        createdAt: new Date().toISOString(),
        clubName: "Clube Central", // Placeholder or fetch from context
      });
      setShowEnrollModal(false);
      setNewUserName("");
      setNewUserEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageClass = (cls: (typeof classes)[0]) => {
    setSelectedClassForManage(cls);
    setShowManageModal(true);
    // Fetch members for this specific class
    const mq = query(
      collection(db, "users"),
      where("activeClass", "==", cls.id),
      where("role", "==", "desbravador"),
    );
    onSnapshot(mq, (snapshot) => {
      const members = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Member),
      }));
      setClassMembers(members);
    });
    // This unsubscribe needs to be handled when the modal closes or component unmounts
    // For simplicity, we'll let it run until the component unmounts or a new class is selected.
    // In a real app, you might want to return this unsubscribe and call it on modal close.
    // return unsubscribe;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Carregando classes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Gestão de <span className="text-primary italic">Classes</span>
          </h1>
          <p className="text-slate-700 font-medium">
            Acompanhe o progresso das classes regulares e avançadas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 h-14 px-6 border-amber-100 text-slate-600 font-bold rounded-2xl"
          >
            <BookOpen size={18} /> Requisitos
          </Button>
          <Button
            onClick={() => setShowEnrollModal(true)}
            className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <Zap size={18} /> Nova Inscrição
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card
            key={cls.id}
            className="p-0 overflow-hidden group bg-white border-amber-50 hover:border-amber-200 transition-all shadow-lg hover:shadow-2xl shadow-amber-900/5 transition-all duration-500"
          >
            <div
              className={cn(
                "p-8 flex items-center justify-between border-b border-slate-50",
                cls.bg,
              )}
            >
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                    cls.bg,
                  )}
                >
                  <cls.icon className={cn("w-8 h-8", cls.color)} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">
                    {cls.name}
                  </h3>
                  <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">
                    Público: {cls.age}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">
                  {stats[cls.id] || 0}
                </p>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  Membros
                </p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-600">Progresso Médio</span>
                  <span className="text-primary">
                    {stats[cls.id] ? "5%" : "0%"}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      cls.color.replace("text-", "bg-"),
                    )}
                    style={{ width: stats[cls.id] ? "12%" : "0%" }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  className="w-full text-[10px] font-black uppercase h-11 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl"
                >
                  Relatórios
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleManageClass(cls)}
                  className="w-full text-[10px] font-black uppercase h-11 border-blue-100 text-primary hover:bg-blue-50 rounded-xl"
                >
                  Gerenciar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnrollModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white !p-10 rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setShowEnrollModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Nova Inscrição
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">
                Registre um novo desbravador no sistema do clube.
              </p>

              <form onSubmit={handleEnroll} className="space-y-4">
                <Input
                  label="Nome Completo"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="joao@email.com"
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Classe Inicial
                  </label>
                  <select
                    value={newUserClass}
                    onChange={(e) => setNewUserClass(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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
                    "Confirmar Inscrição"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManageModal && selectedClassForManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white !p-10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between mb-8 overflow-visible">
                <div className="flex items-center gap-4">
                  <div
                    className={cn("p-4 rounded-2xl", selectedClassForManage.bg)}
                  >
                    <selectedClassForManage.icon
                      className={cn("w-6 h-6", selectedClassForManage.color)}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                      Membros: {selectedClassForManage.name}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {classMembers.length} membros ativos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {classMembers.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                      Nenhum membro encontrado nesta classe
                    </p>
                  </div>
                ) : (
                  classMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase">
                          {member.displayName?.charAt(0) || "D"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {member.displayName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-widest"
                      >
                        Ver Cartão <ChevronRight size={14} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
