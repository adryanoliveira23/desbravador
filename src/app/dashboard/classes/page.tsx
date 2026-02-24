"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, Shield, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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
          <p className="text-slate-500 font-medium">
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
          <Button className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
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
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    Público: {cls.age}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">
                  {stats[cls.id] || 0}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Membros
                </p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">Progresso Médio</span>
                  <span className="text-primary">
                    {stats[cls.id] ? "12%" : "0%"}
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
                  className="w-full text-[10px] font-black uppercase h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl"
                >
                  Relatórios
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-[10px] font-black uppercase h-11 border-blue-100 text-primary hover:bg-blue-50 rounded-xl"
                >
                  Gerenciar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
