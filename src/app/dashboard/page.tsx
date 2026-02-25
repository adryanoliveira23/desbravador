"use client";

import React from "react";
import {
  Award,
  Calendar as CalendarIcon,
  ArrowUpRight,
  BookOpen,
  Package,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap, // Added Zap icon
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface UserData {
  clubName?: string;
  [key: string]: unknown;
}

// Dados estáticos padrão caso o Firebase falhe
const defaultStatsData = [
  {
    label: "Membros Ativos",
    value: "48",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Meta de Classes",
    value: "85%",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Kits Completos",
    value: "12/15",
    icon: Package,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Especialidades",
    value: "142",
    icon: Award,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const mainTools = [
  {
    title: "Gestão de Classes",
    desc: "Controle de requisitos e progressão individual.",
    icon: BookOpen,
    color: "from-blue-600 to-indigo-600",
    href: "/dashboard/classes",
  },
  {
    title: "Especialidades",
    desc: "Catálogo completo com gerador de provas IA.",
    icon: Award,
    color: "from-green-600 to-emerald-600",
    href: "/dashboard/especialidades",
  },
  {
    title: "Cantinho da IA",
    desc: "Crie roteiros e materiais com inteligência artificial.",
    icon: Sparkles,
    color: "from-primary to-orange-600",
    href: "/dashboard/ia",
    premium: true,
  },
  {
    title: "Kits e Patrimônio",
    desc: "Inventário inteligente de materiais do clube.",
    icon: Package,
    color: "from-purple-600 to-pink-600",
    href: "/dashboard/kits",
  },
  {
    title: "Planejador Anual",
    desc: "Calendário interativo com sincronização de eventos.",
    icon: CalendarIcon,
    color: "from-orange-500 to-yellow-600",
    href: "/dashboard/planejador",
  },
  {
    title: "Emissor de Certificados",
    desc: "Geração instantânea em PDF para investiduras.",
    icon: Award,
    color: "from-red-600 to-rose-700",
    href: "/dashboard/certificados",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState(defaultStatsData);
  const [loading, setLoading] = useState(true);

  // Determinar contexto do ministério (Aventureiro vs Desbravador)
  const isAventureiro = user?.ministry === "aventureiro";
  const ministryTheme = isAventureiro
    ? {
        primary: "text-orange-600",
        bg: "bg-orange-600",
        gradient: "from-orange-600 to-red-700",
        label: "Aventureiros",
        icon: Zap,
        shield: "border-orange-500/20",
      }
    : {
        primary: "text-blue-700",
        bg: "bg-blue-700",
        gradient: "from-blue-700 to-blue-900",
        label: "Desbravadores",
        icon: Zap,
        shield: "border-secondary/10",
      };

  const isPremium = user?.plan === "desbrava_total";

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);

          // 1. Membros Ativos Real
          const membersQ = query(
            collection(db, "users"),
            where("clubName", "==", userData.clubName || ""),
          );
          onSnapshot(membersQ, (snap) => {
            setStats((prev) => {
              const newStats = [...prev];
              newStats[0].value = snap.size.toString();
              return newStats;
            });
          });

          // 2. Especialidades Concluídas Real
          // Aqui usamos a coleção que criamos/otimizamos antes
          const specQ = query(collection(db, "specialties_concluded"));
          onSnapshot(specQ, (snap) => {
            setStats((prev) => {
              const newStats = [...prev];
              newStats[3].value = snap.size.toString();
              return newStats;
            });
          });
        }
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            Sincronizando Dados...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 pb-20">
      {/* Welcome Banner */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 text-white shadow-2xl min-h-[220px] md:min-h-[280px] flex flex-col justify-center bg-gradient-to-br",
            ministryTheme.gradient,
          )}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rotate-45 translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                <ministryTheme.icon
                  size={24}
                  className={cn(
                    "fill-current",
                    isAventureiro ? "text-orange-600" : "text-blue-700",
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                  Portal de Liderança
                </span>
                <span className="text-[10px] font-bold text-white/60 uppercase">
                  Contexto: {ministryTheme.label}
                </span>
              </div>
              {isPremium && (
                <div className="ml-auto md:ml-4 px-3 py-1 bg-secondary text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                  Desbrava Total
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter uppercase leading-[0.9]">
              {isAventureiro ? "Grande" : "Bem-vindo ao"}{" "}
              <span className="text-secondary">
                {isAventureiro ? "Líder!" : "Portal!"}
              </span>
            </h1>
            <p className="text-sm md:text-lg text-white/90 font-medium max-w-2xl leading-relaxed">
              Gestão inteligente para o clube{" "}
              <span className="font-bold border-b-2 border-secondary/50">
                {user?.clubName || "Seu Clube"}
              </span>
              .
              {isPremium
                ? " Todas as ferramentas premium estão desbloqueadas."
                : " Explore os recursos essenciais do seu ministério."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </h3>
            </div>
            <div
              className={cn(
                "p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform",
                stat.bg,
              )}
            >
              <stat.icon size={24} className={stat.color} />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <ArrowUpRight size={20} className="text-primary" /> Ferramentas do
            Clube
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mainTools.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="bg-white border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all p-5 md:p-6 group cursor-pointer flex items-center justify-between min-h-[100px]">
                <div className="flex items-center gap-4 md:gap-5">
                  <div
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0",
                      tool.color.replace("from-", "bg-").split(" ")[0],
                    )}
                  >
                    <tool.icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors text-sm md:text-base truncate">
                      {tool.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Timeline & Premium Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Atividades Recentes
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Eventos sincronizados do {user?.clubName}
                </p>
              </div>
              <Link href="/dashboard/planejador">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary font-black text-[10px] uppercase hover:bg-primary/5 tracking-widest"
                >
                  Ver Agenda
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: isAventureiro
                    ? "Manual do Castor"
                    : "Instrução de Nós",
                  type: "Ensino",
                  time: "Hoje, 19:00",
                  color: "bg-blue-500",
                },
                {
                  title: "Reunião de Diretoria",
                  type: "Gestão",
                  time: "Amanhã, 20:00",
                  color: "bg-slate-900",
                },
                {
                  title: isAventureiro
                    ? "Passeio no Parque"
                    : "Acampamento de Unid.",
                  type: "Outdoor",
                  time: "Sexta, 18:00",
                  color: "bg-orange-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn("w-1.5 h-8 rounded-full", item.color)}
                    ></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {item.type} • {item.time}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 group-hover:text-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {!isPremium && (
          <Card className="bg-slate-900 text-white p-8 relative overflow-hidden group border-none">
            <div className="absolute top-1/2 right-[-20px] w-48 h-48 border-[20px] border-white/5 rounded-full -translate-y-1/2"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles size={24} className="text-secondary" />
                </div>
                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">
                  IA <span className="text-secondary">Premium</span>
                </h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Desbloqueie geradores de provas, roteiros e planejadores IA
                  com o plano{" "}
                  <span className="text-white font-bold">Desbrava Total</span>.
                </p>
              </div>

              <Button className="w-full bg-secondary text-slate-900 hover:bg-white font-black uppercase tracking-widest mt-8 py-6 rounded-xl shadow-lg border-none text-xs">
                Assinar Agora
              </Button>
            </div>
          </Card>
        )}

        {isPremium && (
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 p-8 flex flex-col justify-center items-center text-center group">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <Sparkles size={32} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
              Líder <span className="text-primary italic">Total</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">
              Acesso Completo Ativado
            </p>
            <Link href="/dashboard/ia" className="w-full">
              <Button className="w-full h-12 font-black uppercase tracking-widest">
                Usar Ferramentas IA
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
