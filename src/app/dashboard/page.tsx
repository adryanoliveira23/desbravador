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
  limit,
  orderBy,
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

  // Efeito para carregar as estatísticas e reuniões
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Carregar dados do usuário/clube
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);

          // 2. Mocking real stats search (idealmente viria de um doc do clube ou agregados)
          // Para esta versão, vamos buscar dinamicamente o que houver nas coleções

          // Membros (Exemplo de query real)
          const membersQ = query(
            collection(db, "users"),
            where("clubName", "==", userData.clubName || ""),
          );
          onSnapshot(membersQ, (snap) => {
            const count = snap.size;
            setStats((prev) => {
              const newStats = [...prev];
              newStats[0].value = count.toString();
              return newStats;
            });
          });

          // Reuniões (Próximas 3)
          const meetingsQ = query(
            collection(db, "meetings"),
            where("clubName", "==", userData.clubName || ""),
            orderBy("date", "asc"),
            limit(3),
          );
          onSnapshot(meetingsQ, () => {
            // meetings data available if needed in future
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
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">
            Sincronizando Dados...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Banner - Estilo Portal Oficial */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-900 p-12 text-white shadow-2xl min-h-[240px] flex flex-col justify-center border-b-4 border-secondary"
        >
          {/* Decorative Shield Pattern (simulando elementos do escudo) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rotate-45 translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 border-[32px] border-secondary/10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                <Zap size={24} className="text-primary fill-current" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
                Portal de Liderança
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">
              Bem-vindo ao <span className="text-secondary">Portal!</span>
            </h1>
            <p className="text-lg text-blue-50 font-medium max-w-2xl leading-relaxed">
              Central oficial de recursos para o ministério dos Desbravadores.
              Gestão de classes e materiais para o clube{" "}
              <span className="font-bold border-b-2 border-primary">
                {user?.clubName || "Carregando..."}
              </span>
              .
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid - Estilo Imagem 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all p-6 py-8 flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-4xl font-bold text-slate-800 tracking-tight">
                {stat.value}+
              </h3>
            </div>
            <div
              className={cn(
                "p-4 rounded-xl shadow-sm group-hover:scale-110 transition-transform",
                stat.bg.replace("/10", "/5"),
              )}
            >
              <stat.icon size={28} className={stat.color} />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access Section - Estilo Imagem 2 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
          <ArrowUpRight size={20} className="text-primary" /> Acesso Rápido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {mainTools.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="bg-white border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all p-6 group cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                      tool.color.replace("from-", "bg-").split(" ")[0],
                    )}
                  >
                    <tool.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[180px]">
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Timeline / Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline & Info - Estilo Imagem 2 */}
        <div className="lg:col-span-2">
          {" "}
          {/* Adjusted to wrap the two cards */}
          <Card className="bg-white border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Atividades do Clube
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Cronograma atualizado em tempo real.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 font-bold text-xs uppercase hover:bg-blue-50"
              >
                Ver Calendário
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Instrução de Nós",
                  type: "Classe",
                  time: "Hoje, 19:00",
                  color: "bg-blue-500",
                },
                {
                  title: "Reunião de Staff",
                  type: "Gestão",
                  time: "Amanhã, 20:00",
                  color: "bg-slate-800",
                },
                {
                  title: "Acampamento de Unid.",
                  type: "Evento",
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
                      className={cn("w-2 h-10 rounded-full", item.color)}
                    ></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {item.type} • {item.time}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 group-hover:text-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-primary text-white p-8 relative overflow-hidden group">
          <div className="absolute top-1/2 right-[-20px] w-48 h-48 border-[20px] border-white/5 rounded-full -translate-y-1/2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-blue-900 opacity-60"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">
                IA <span className="text-secondary">Premium</span>
              </h3>
              <p className="text-sm text-white/80 font-medium leading-relaxed">
                Crie planos de ensino e provas personalizadas em segundos com
                nossa inteligência líder.
              </p>
            </div>

            <Button className="w-full bg-white text-primary hover:bg-slate-50 font-bold uppercase tracking-widest mt-8 py-6 rounded-xl shadow-lg border-none">
              Começar Agora
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
