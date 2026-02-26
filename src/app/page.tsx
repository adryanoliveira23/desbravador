"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Menu,
  Monitor,
  BrainCircuit,
  Shield,
  MessageCircle,
  Globe,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Zap,
  Bot,
  Check,
  Compass,
  Tent,
  BookOpen,
  Trophy,
  Star,
  Heart,
  Users2,
  ArrowUpRight,
  Package,
  Award,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

const ideals = [
  {
    title: "Voto",
    text: "Pela graça de Deus, serei puro, bondoso e leal; guardarei a lei do Desbravador, serei servo de Deus e amigo de todos.",
    color: "from-blue-600 to-blue-400",
  },
  {
    title: "Lei",
    text: "A Lei do Desbravador ordena-me: Observar a devoção matinal; Cumprir com fidelidade a parte que me corresponde...",
    color: "from-yellow-600 to-yellow-400",
  },
  {
    title: "Alvo",
    text: "A mensagem do advento a todo o mundo em minha geração.",
    color: "from-red-600 to-red-400",
  },
  {
    title: "Lema",
    text: "O amor de Cristo me motiva.",
    color: "from-emerald-600 to-emerald-400",
  },
];

const classes = [
  { name: "Amigo", color: "bg-blue-600" },
  { name: "Companheiro", color: "bg-red-600" },
  { name: "Pesquisador", color: "bg-emerald-600" },
  { name: "Pioneiro", color: "bg-gray-600" },
  { name: "Excursionista", color: "bg-purple-600" },
  { name: "Guia", color: "bg-yellow-500" },
];

const plans = [
  {
    name: "Bom Aventureiro",
    price: "24,90",
    description: "Ideal para novos clubes de 6-9 anos",
    theme: "orange",
    features: [
      "Fichas de Acompanhamento Kids",
      "Manual do Conselheiro Lúdico",
      "Especialidades em Áudio e Vídeo",
      "Acesso completo e vitalício",
      "Suporte exclusivo",
      "Garantia de 7 dias",
    ],
    gradient: "from-orange-600 to-red-600",
    glow: "rgba(234, 88, 12, 0.15)",
    iconColor: "text-orange-500",
    link: process.env.NEXT_PUBLIC_CAKTO_BOM_AVENTUREIRO || "#",
  },
  {
    name: "Só Desbravador",
    price: "25,90",
    description: "O favorito dos diretores de 10-15 anos",
    theme: "blue",
    features: [
      "Gestão de Classes Regulares",
      "Banco de +200 Especialidades",
      "Sistema de Pontos de Unidades",
      "Acesso completo e vitalício",
      "Suporte exclusivo",
      "Garantia de 7 dias",
    ],
    gradient: "from-blue-600 to-indigo-600",
    glow: "rgba(37, 99, 235, 0.15)",
    iconColor: "text-blue-500",
    link: process.env.NEXT_PUBLIC_CAKTO_SO_DESBRAVADOR || "#",
  },
  {
    name: "Desbrava Total",
    price: "32,90",
    description: "Experiência completa e ilimitada",
    theme: "gold",
    features: [
      "Tudo do Aventureiro + Desbravador",
      "Cantinho da IA (Roteiros & Provas)",
      "Emissor de Certificados Ilimitado",
      "PWA - Funciona sem Internet",
      "Analytics de Retenção",
      "Exportação Direta SGC",
    ],
    gradient: "from-yellow-500 via-orange-500 to-purple-600",
    glow: "rgba(245, 158, 11, 0.2)",
    iconColor: "text-yellow-500",
    popular: true,
    link: process.env.NEXT_PUBLIC_CAKTO_DESBRAVA_TOTAL || "#",
  },
];

const faqItems = [
  {
    q: "A plataforma funciona sem sinal de internet?",
    a: "Sim. Utilizamos tecnologia PWA de última geração que permite o acesso e a sincronização automática de dados, mesmo em locais remotos como acampamentos.",
  },
  {
    q: "Como funciona a integração com sistemas oficiais?",
    a: "Oferecemos ferramentas de exportação de dados em formatos compatíveis com os padrões de lançamento em massa, facilitando a atualização das informações do seu clube.",
  },
  {
    q: "Existe limite de membros inscritos no clube?",
    a: "Não há limites. Nosso sistema foi projetado para crescer junto com o seu clube, permitindo o cadastro ilimitado de membros em nossos planos principais.",
  },
  {
    q: "Quais dispositivos podem acessar o sistema?",
    a: "Qualquer dispositivo com navegador de internet. A interface é 100% responsiva, funcionando perfeitamente em celulares, tablets e computadores.",
  },
];

/* ============================================================
   DEMO TABS DATA
   ============================================================ */

interface DemoTool {
  title: string;
  icon: React.ElementType;
  color: string;
  premium: boolean;
}

interface DemoTab {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  icon: React.ElementType;
  label_tag: string;
  popular?: boolean;
  features: string[];
  accent: string;
  tools: DemoTool[];
  stats: { label: string; value: string; icon: React.ElementType }[];
}

const demoTabs: DemoTab[] = [
  {
    id: "aventureiro",
    label: "Aventureiro",
    title: "Bom Aventureiro",
    subtitle:
      "Interface lúdica e completa para o Clube de Aventureiros. Gestão de classes, manuais e especialidades kids.",
    color: "orange",
    gradient: "from-orange-600 to-red-700",
    icon: Zap,
    label_tag: "Aventureiros",
    features: [
      "Fichas de Acompanhamento Kids",
      "Manual do Conselheiro Lúdico",
      "Especialidades em Áudio e Vídeo",
    ],
    accent: "bg-orange-600",
    tools: [
      {
        title: "Gestão de Classes",
        icon: BookOpen,
        color: "bg-orange-600",
        premium: false,
      },
      {
        title: "Manual do Castor",
        icon: BookOpen,
        color: "bg-red-600",
        premium: false,
      },
      {
        title: "Kits de Atividades",
        icon: Package,
        color: "bg-orange-500",
        premium: false,
      },
    ],
    stats: [
      { label: "Aventureiros", value: "24", icon: Heart },
      { label: "Espec. Concluídas", value: "156", icon: Star },
      { label: "Presença", value: "98%", icon: Users2 },
    ],
  },
  {
    id: "desbravador",
    label: "Desbravador",
    title: "Só Desbravador",
    subtitle:
      "A central definitiva para o Clube de Desbravadores. Foco em requisitos, especialidades e civismo.",
    color: "blue",
    gradient: "from-blue-700 to-blue-900",
    icon: Zap,
    label_tag: "Desbravadores",
    features: [
      "Gestão de Classes Regulares",
      "Banco de +200 Especialidades",
      "Sistema de Pontuação de Unidades",
    ],
    accent: "bg-blue-700",
    tools: [
      {
        title: "Gestão de Classes",
        icon: BookOpen,
        color: "bg-blue-700",
        premium: false,
      },
      {
        title: "Especialidades",
        icon: Award,
        color: "bg-emerald-600",
        premium: false,
      },
      {
        title: "Planejador Anual",
        icon: Calendar,
        color: "bg-amber-500",
        premium: false,
      },
    ],
    stats: [
      { label: "Desbravadores", value: "42", icon: Users2 },
      { label: "Membros Ativos", value: "48", icon: TrendingUp },
      { label: "Espec. Concluídas", value: "142", icon: Award },
    ],
  },
  {
    id: "total",
    label: "Desbrava Total",
    title: "Desbrava Total",
    subtitle:
      "A experiência máxima com Inteligência Artificial. Roteiros automáticos e analytics avançado para todo o clube.",
    color: "primary",
    gradient: "from-primary to-orange-600",
    icon: Sparkles,
    label_tag: "Master & IA",
    popular: true,
    features: [
      "IA para Criação de Materiais",
      "Analytics de Retenção",
      "Exportação de Dados SGC",
    ],
    accent: "bg-primary",
    tools: [
      {
        title: "Cantinho da IA",
        icon: Sparkles,
        color: "bg-primary",
        premium: true,
      },
      {
        title: "Gerador de Provas",
        icon: Award,
        color: "bg-red-600",
        premium: false,
      },
      {
        title: "Emissor de Certificados",
        icon: Award,
        color: "bg-rose-700",
        premium: false,
      },
    ],
    stats: [
      { label: "Total de Membros", value: "128", icon: Globe },
      { label: "Uso da IA", value: "Alta", icon: Zap },
      { label: "Tempo Salvo", value: "12h/sem", icon: BrainCircuit },
    ],
  },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(demoTabs[1].id); // Default to Desbravador

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Preços", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3"
            : "bg-transparent py-6",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                DESBRAVA<span className="text-blue-500">TOTAL</span>
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-5 py-2.5"
            >
              Entrar
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Começar Agora
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-[#0A0D14] border-t border-white/5 absolute w-full shadow-2xl"
            >
              <div className="px-6 py-8 space-y-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileMenu(false)}
                    className="block py-4 text-lg font-bold text-slate-300 hover:text-white border-b border-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-6 space-y-4">
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenu(false)}
                    className="block text-center py-4 text-lg font-bold text-slate-300"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="#pricing"
                    onClick={() => setMobileMenu(false)}
                    className="block text-center bg-blue-600 text-white font-bold py-4 rounded-2xl text-lg shadow-xl shadow-blue-600/20"
                  >
                    Começar Agora
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-44 pb-24 md:pt-60 md:pb-40 px-6 md:px-10 overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Notion-style floating icons placeholder logic */}
            <div className="relative mb-14 inline-block">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-4">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                O Primeiro com IA Integrada
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[102px] font-bebas tracking-wide leading-[0.85] text-white mb-10 uppercase">
              CHEGOU NOVO APLICATIVO <br />
              <span className="text-yellow-500">
                COM INTELIGÊNCIA ARTIFICIAL.
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              Além de ter um banco de matérias, agora você conta com uma{" "}
              <span className="text-white font-bold underline decoration-yellow-500/50 decoration-4 underline-offset-8">
                Inteligência Artificial que cria o que você quiser para você.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-32">
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-500 text-white font-black px-14 py-6 rounded-2xl text-2xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95 group"
              >
                QUERO ACESSAR AGORA
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* NEW: AI Feature Spread Visual */}
            <div className="relative max-w-4xl mx-auto h-[400px] md:h-[500px]">
              {/* Central IA Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />

              <div className="relative z-10 w-full h-full">
                {/* AI Script Card */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute top-0 left-4 md:left-20 w-48 md:w-64 bg-[#111622]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <Sparkles size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Roteiro IA
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10 rounded" />
                    <div className="h-2 w-5/6 bg-white/5 rounded" />
                    <div className="h-2 w-4/6 bg-white/5 rounded" />
                    <div className="h-6 w-1/2 bg-blue-500/20 rounded mt-4 border border-blue-500/30 animate-pulse" />
                  </div>
                </motion.div>

                {/* Certificate Mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 md:w-72 bg-white rounded-3xl p-8 shadow-[0_32px_64px_-12px_rgba(255,255,255,0.1)] border border-slate-200 z-20 group"
                >
                  <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl border-4 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 w-8 h-8 bg-slate-200 rounded-full" />
                    <Award
                      size={40}
                      className="text-yellow-500 mb-2 group-hover:scale-110 transition-transform"
                    />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
                      Certificado de Especialidade
                    </p>
                    <div className="absolute bottom-4 right-4 w-12 h-4 bg-slate-200 rounded" />
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full mb-1" />
                    <div className="h-1 w-16 bg-slate-50 rounded-full" />
                  </div>
                </motion.div>

                {/* Class Progress Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-10 right-4 md:right-20 w-48 md:w-64 bg-[#111622]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Progresso
                    </span>
                    <TrendingUp size={14} className="text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[xs] font-bold">Amigo</span>
                      <span className="text-[xs] text-blue-500 font-black">
                        95%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* IA Floating Chips */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-20 right-10 md:right-40 px-4 py-2 bg-yellow-500 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                >
                  <Zap size={12} fill="currentColor" />
                  Gerador Automático
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-20 left-10 md:left-40 px-4 py-2 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                >
                  <Bot size={12} fill="currentColor" />
                  Assistente 24h
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEWS ─── */}
      <section className="py-24 bg-[#0A0D14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider mb-6">
              Experiência <span className="text-blue-500">Personalizada</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-12">
              Escolha o plano que melhor se adapta ao seu clube e veja como a
              plataforma se transforma para você.
            </p>

            {/* Tab Selectors */}
            <div className="inline-flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 mb-16">
              {demoTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 relative",
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                      : "text-slate-400 hover:text-white",
                  )}
                >
                  {tab.label}
                  {tab.popular && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-[8px] text-slate-900 px-2 py-0.5 rounded-full font-black">
                      HOT
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {demoTabs.map(
              (tab) =>
                tab.id === activeTab && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                  >
                    {/* Text Content */}
                    <div className="lg:col-span-5 space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-4xl md:text-5xl font-bebas text-white uppercase tracking-tight">
                          {tab.title}
                        </h3>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                          {tab.subtitle}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {tab.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center",
                                tab.color === "blue"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : tab.color === "primary"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-orange-500/10 text-orange-500",
                              )}
                            >
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-slate-300 font-bold text-sm tracking-wide uppercase italic">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href="#pricing"
                        className={cn(
                          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl",
                          tab.color === "blue"
                            ? "bg-blue-600 shadow-blue-600/20"
                            : tab.color === "primary"
                              ? "bg-primary shadow-primary/20"
                              : "bg-orange-600 shadow-orange-600/20",
                        )}
                      >
                        Ver Planos <ArrowRight size={18} />
                      </Link>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="lg:col-span-7 relative">
                      <div className="relative group">
                        <div
                          className={cn(
                            "absolute -inset-4 rounded-[3rem] blur-3xl opacity-30 transition-opacity duration-700",
                            tab.id === "aventureiro"
                              ? "bg-orange-500/40"
                              : tab.id === "desbravador"
                                ? "bg-blue-500/40"
                                : "bg-primary/40",
                          )}
                        />

                        <div className="relative bg-[#F8FAFC] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                          {/* Dashboard Sidebar + Header Simulation */}
                          <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                              </div>
                              <div className="h-4 w-24 bg-slate-100 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100" />
                            </div>
                          </div>

                          {/* Dashboard Content Mock */}
                          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[600px] bg-slate-50/50">
                            {/* Welcome Banner Mock */}
                            <div
                              className={cn(
                                "relative overflow-hidden rounded-[1.5rem] p-6 text-white shadow-lg min-h-[160px] flex flex-col justify-center bg-gradient-to-br",
                                tab.gradient,
                              )}
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rotate-45 translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
                                    <tab.icon
                                      size={18}
                                      className={cn(
                                        "fill-current",
                                        tab.id === "aventureiro"
                                          ? "text-orange-600"
                                          : tab.id === "desbravador"
                                            ? "text-blue-700"
                                            : "text-primary",
                                      )}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/80">
                                      Portal de Liderança
                                    </span>
                                    <span className="text-[7px] font-bold text-white/60 uppercase">
                                      Contexto: {tab.label_tag}
                                    </span>
                                  </div>
                                </div>
                                <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter">
                                  {tab.id === "aventureiro"
                                    ? "Grande Líder!"
                                    : "Bem-vindo!"}
                                </h4>
                                <p className="text-[10px] text-white/90 font-medium">
                                  Gestão inteligente para o seu clube.
                                </p>
                              </div>
                            </div>

                            {/* Stats Row Mock */}
                            <div className="grid grid-cols-3 gap-3">
                              {tab.stats.map((stat, i) => (
                                <div
                                  key={i}
                                  className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-sm"
                                >
                                  <div>
                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                      {stat.label}
                                    </p>
                                    <p className="text-lg font-black text-slate-900 tracking-tighter leading-none">
                                      {stat.value}
                                    </p>
                                  </div>
                                  <div
                                    className={cn(
                                      "p-2 rounded-lg bg-slate-50",
                                      tab.id === "aventureiro"
                                        ? "text-orange-600"
                                        : tab.id === "desbravador"
                                          ? "text-blue-700"
                                          : "text-primary",
                                    )}
                                  >
                                    <stat.icon size={14} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Tools Section Mock */}
                            <div className="space-y-4">
                              <h5 className="text-[8px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 px-1">
                                <ArrowUpRight
                                  size={10}
                                  className="text-primary"
                                />{" "}
                                Ferramentas do Clube
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tab.tools.map((tool, i) => (
                                  <div
                                    key={i}
                                    className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-primary/20 transition-all cursor-default relative overflow-hidden"
                                  >
                                    {tool.premium && (
                                      <div className="absolute top-0 right-0 bg-primary/10 px-1.5 py-0.5 rounded-bl-lg text-[6px] font-black text-primary uppercase">
                                        IA
                                      </div>
                                    )}
                                    <div
                                      className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0",
                                        tool.color,
                                      )}
                                    >
                                      <tool.icon size={16} />
                                    </div>
                                    <div className="min-w-0">
                                      <h6 className="font-black text-slate-900 text-[9px] truncate">
                                        {tool.title}
                                      </h6>
                                      <div className="h-1 w-8 bg-slate-100 rounded-full mt-1" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recent Activity Mock */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
                                <p className="text-[8px] font-black text-slate-800 uppercase">
                                  Atividades Recentes
                                </p>
                                <div className="h-3 w-10 bg-slate-50 rounded-full" />
                              </div>
                              {[1, 2].map((i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={cn(
                                      "w-1 h-6 rounded-full",
                                      tab.id === "aventureiro"
                                        ? "bg-orange-500"
                                        : "bg-blue-600",
                                    )}
                                  />
                                  <div className="space-y-1 flex-1">
                                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                                    <div className="h-1.5 w-1/3 bg-slate-50 rounded" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Floating Indicator */}
                          <div className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full shadow-2xl flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live Interface Sync
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── IDEAIS SECTION ─── */}
      <section className="py-24 bg-[#0D111A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider">
              Nossos <span className="text-yellow-500">Ideais</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ideals.map((ideal, i) => (
              <div
                key={i}
                className="bg-[#161C2C] border border-white/5 p-8 rounded-[2rem] hover:border-yellow-500/30 transition-all"
              >
                <h3 className="font-bebas text-3xl text-yellow-500 mb-4 tracking-widest">
                  {ideal.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {ideal.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLASSES SECTION ─── */}
      <section className="py-24 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider mb-16">
            Classes <span className="text-blue-500">Oficiais</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {classes.map((cls, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div
                  className={cn(
                    "w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110",
                    cls.color,
                  )}
                >
                  <Trophy className="text-white/80" size={40} />
                </div>
                <span className="font-bold text-sm text-slate-300">
                  {cls.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPECIALTIES SECTION ─── */}
      <section className="py-24 bg-[#0D111A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider">
              Explore <span className="text-yellow-500">Especialidades</span>
            </h2>
            <p className="text-slate-400 mt-4 font-medium">
              Mais de 200 especialidades organizadas para o crescimento do seu
              clube.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              "Natureza",
              "Artes",
              "Saúde",
              "Habilidades",
              "Ciência",
              "Ativ. Missionárias",
              "Ativ. Agrícolas",
              "Mestrados",
            ].map((spec, i) => (
              <div
                key={i}
                className="bg-[#111622] border border-white/5 p-4 rounded-xl text-center group hover:border-blue-500/50 transition-all cursor-default"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/10">
                  <BookOpen size={20} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">
                  {spec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIBRARY SECTION ─── */}
      <section className="py-24 bg-[#0A0D14] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-bebas text-5xl md:text-7xl text-white leading-none mb-8">
                  ACERVO <br />
                  <span className="text-yellow-500 italic">
                    COMPLETO E INTEGRADO
                  </span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                  Tenha acesso a todos os manuais administrativos, cartões de
                  requisitos e orientações pedagógicas em um só lugar.
                  Facilitamos a burocracia para você focar na missão.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: "Manuais Administrativos",
                      desc: "Regulamentos e orientações oficiais",
                    },
                    {
                      title: "Cartões de Classe",
                      desc: "Acompanhamento digital de requisitos",
                    },
                    {
                      title: "Gabaritos e Orientações",
                      desc: "Suporte total para os instrutores",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                        <Check size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-wide">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                <div className="relative bg-[#111622] rounded-[3rem] p-12 border border-white/5 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5">
                      <BookOpen size={40} className="text-blue-400 mb-4" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Manuais
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5">
                      <Trophy size={40} className="text-yellow-500 mb-4" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Insignias
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5">
                      <Globe size={40} className="text-emerald-400 mb-4" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Global
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5">
                      <Compass size={40} className="text-red-500 mb-4" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Explorar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM OFFERS ─── */}
      <section
        id="funcionalidades"
        className="py-24 md:py-32 px-6 md:px-10 bg-[#0A0D14] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Recursos Premium
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bebas tracking-tight text-white mb-6 uppercase">
              O que a plataforma{" "}
              <span className="text-yellow-500">oferece.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Tudo que você precisa para conduzir seu clube com excelência e
              modernidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Suporte Total",
                desc: "Requisitos e orientações integrados para todas as etapas da jornada.",
                icon: Globe,
                color: "text-blue-500",
                bg: "bg-blue-500/5",
              },
              {
                title: "Acervo Acadêmico",
                desc: "Material estruturado em diversas áreas para expandir conhecimentos.",
                icon: Monitor,
                color: "text-purple-500",
                bg: "bg-purple-500/5",
              },
              {
                title: "Central de Avaliações",
                desc: "Modelos de testes inspirados nos padrões oficiais para validar o aprendizado.",
                icon: BrainCircuit,
                color: "text-emerald-500",
                bg: "bg-emerald-500/5",
              },
              {
                title: "Interface Business",
                desc: "Navegação moderna e fluida, desenhada para máxima produtividade.",
                icon: Zap,
                color: "text-orange-500",
                bg: "bg-orange-500/5",
              },
              {
                title: "Emissor de Certificados",
                desc: "Gere documentos prontos para impressão com apenas um clique.",
                icon: CheckCircle2,
                color: "text-blue-400",
                bg: "bg-blue-400/5",
              },
              {
                title: "Controle Administrativo",
                desc: "Gestão completa de membros, secretaria e progresso individual.",
                icon: Shield,
                color: "text-slate-300",
                bg: "bg-slate-300/5",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-[#111622] border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-500/30 transition-all group"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl",
                    feat.bg,
                    feat.color,
                  )}
                >
                  <feat.icon size={28} />
                </div>
                <h3 className="text-xl font-bebas text-white mb-3 tracking-widest uppercase">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-24 md:py-32 px-6 md:px-10 bg-[#0A0D14] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black text-blue-500 mb-4 uppercase tracking-[0.3em]">
              Planos e Investimento
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bebas text-white mb-6 uppercase tracking-wider">
              Escolha o melhor para <br />
              <span className="text-yellow-500">seu clube.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "relative group rounded-[3rem] p-10 transition-all duration-500 hover:scale-[1.02] overflow-hidden flex flex-col h-full",
                  plan.popular
                    ? "bg-[#161C2C] border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/10"
                    : cn(
                        "bg-[#111622] border transition-colors duration-300",
                        plan.theme === "orange"
                          ? "border-orange-500/30 bg-orange-500/[0.02] hover:border-orange-500/50"
                          : "border-blue-500/30 bg-blue-500/[0.02] hover:border-blue-500/50",
                      ),
                )}
                style={{
                  boxShadow: plan.popular
                    ? `0 20px 50px -12px ${plan.glow}`
                    : undefined,
                }}
              >
                {/* Background Glow */}
                <div
                  className="absolute -top-24 -right-24 w-80 h-80 blur-3xl rounded-full opacity-30 pointer-events-none transition-transform duration-700 group-hover:scale-150"
                  style={{ backgroundColor: plan.glow }}
                />

                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 text-[10px] font-black px-6 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg">
                    Recomendado
                  </div>
                )}

                <div className="mb-10 relative z-10">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white/5",
                      plan.iconColor,
                    )}
                  >
                    {plan.theme === "orange" ? (
                      <Compass size={24} />
                    ) : plan.theme === "blue" ? (
                      <Tent size={24} />
                    ) : (
                      <Zap size={24} fill="currentColor" />
                    )}
                  </div>
                  <h3
                    className={cn(
                      "text-3xl font-bebas mb-2 tracking-widest uppercase transition-colors",
                      plan.theme === "orange"
                        ? "text-orange-500"
                        : plan.theme === "blue"
                          ? "text-blue-500"
                          : "text-yellow-500",
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-80">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-10 relative z-10">
                  <span className="text-2xl font-black text-white/50">R$</span>
                  <span
                    className={cn(
                      "text-7xl font-black tracking-tighter",
                      plan.popular ? "text-white" : "text-white/90",
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="text-slate-500 font-bold ml-2 uppercase text-[10px] tracking-widest">
                    /mês
                  </span>
                </div>

                <div className="space-y-4 mb-12 flex-1 relative z-10">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                          plan.popular ? "bg-yellow-500/20" : "bg-white/5",
                        )}
                      >
                        <Check
                          size={10}
                          className={
                            plan.popular ? "text-yellow-500" : "text-slate-400"
                          }
                        />
                      </div>
                      <span className="text-[11px] text-slate-300 font-bold leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.link}
                  className={cn(
                    "relative z-10 block w-full text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg",
                    plan.popular
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:shadow-yellow-500/20"
                      : cn(
                          "text-white transition-all border",
                          plan.theme === "orange"
                            ? "bg-orange-600/10 border-orange-500/20 hover:bg-orange-500 hover:text-white"
                            : "bg-blue-600/10 border-blue-500/20 hover:bg-blue-500 hover:text-white",
                        ),
                  )}
                >
                  Garantir Acesso
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500 opacity-50" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bebas text-white mb-10 tracking-tight uppercase">
            Pronto para revolucionar o seu clube?
          </h2>
          <Link
            href="/auth"
            className="inline-flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white font-black px-14 py-6 rounded-2xl text-2xl transition-all shadow-2xl active:scale-95"
          >
            QUERO ACESSAR AGORA
            <ArrowRight size={28} />
          </Link>
          <p className="text-blue-100 text-sm mt-8 font-black uppercase tracking-widest opacity-80">
            Junte-se a centenas de clubes em todo o Brasil.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 px-6 md:px-10 bg-[#0A0D14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bebas text-white uppercase tracking-wider">
              Perguntas <span className="text-yellow-500">frequentes.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-[#111622] border border-white/5 rounded-[2rem] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-lg text-white">{item.q}</span>
                  <ChevronDown
                    size={24}
                    className={cn(
                      "text-slate-500 transition-transform",
                      openFaq === i && "rotate-180 text-blue-500",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="p-8 pt-0 text-slate-400 font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-white py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="font-bebas text-3xl tracking-wide">
              DESBRAVA <span className="text-yellow-500">TOTAL</span>
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-slate-500 text-sm mb-2">
              © 2024 — Desbrava Total management system
            </p>
            <p className="text-slate-600 text-xs">
              Todos os direitos reservados ao Ministério dos Clubes.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── AI CHAT BOT ─── */}
      <AIChatBot />
    </div>
  );
}

function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Olá! Sou o assistente do Desbrava Total. Como posso ajudar seu clube hoje?",
      isBot: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNamespace, setCurrentNamespace] = useState("start");

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const botBrain: Record<
    string,
    {
      options: { label: string; action: string; next?: string }[];
      response: string;
    }
  > = {
    start: {
      response:
        "Olá! Sou o assistente do Desbrava Total. Como posso ajudar seu clube hoje?",
      options: [
        { label: "Ver Planos", action: "pricing", next: "pricing_node" },
        { label: "Dúvidas sobre IA", action: "ia", next: "ia_node" },
        {
          label: "Recursos do Sistema",
          action: "features",
          next: "features_node",
        },
      ],
    },
    pricing_node: {
      response:
        "Temos 3 planos ideais: Bom Aventureiro (R$ 24,90), Só Desbravador (R$ 25,90) e o Desbrava Total (R$ 32,90) com IA ilimitada. Qual você quer conhecer melhor?",
      options: [
        {
          label: "Bom Aventureiro",
          action: "info_aventureiro",
          next: "cta_node",
        },
        {
          label: "Só Desbravador",
          action: "info_desbravador",
          next: "cta_node",
        },
        { label: "Desbrava Total", action: "info_total", next: "cta_node" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    ia_node: {
      response:
        "Minha Inteligência Artificial cria roteiros, provas e especialidades em segundos, poupando horas de trabalho do líder. O que deseja saber?",
      options: [
        {
          label: "Como criar roteiros?",
          action: "ia_roteiros",
          next: "ia_node",
        },
        { label: "Gerador de Provas", action: "ia_provas", next: "ia_node" },
        { label: "Como falar com a IA?", action: "ia_how", next: "ia_node" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    features_node: {
      response:
        "Além de IA, temos PWA (funciona sem internet), emissor de certificados e gestão completa de classes. Qual recurso te interessa?",
      options: [
        {
          label: "Funciona Offline?",
          action: "off_pwa",
          next: "features_node",
        },
        { label: "SGC Integração", action: "sgc", next: "features_node" },
        { label: "Certificados", action: "certs", next: "features_node" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    cta_node: {
      response:
        "Excelente escolha! Quer garantir seu acesso agora com desconto ou prefere tirar mais dúvidas no WhatsApp?",
      options: [
        { label: "Garantir Acesso", action: "go_pricing" },
        { label: "Chamar no WhatsApp", action: "whatsapp" },
        { label: "Voltar ao Início", action: "back", next: "start" },
      ],
    },
  };

  const handleAction = (action: string, label: string, next?: string) => {
    setMessages((prev) => [...prev, { text: label, isBot: false }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      let botResponse = "";
      if (next && botBrain[next]) {
        botResponse = botBrain[next].response;
        setCurrentNamespace(next);
      } else {
        // Simple action handling
        if (action === "whatsapp") {
          botResponse =
            "Perfeito! Vou te direcionar agora para o nosso WhatsApp oficial. Um segundo...";
          setTimeout(
            () => window.open("https://wa.me/556699762785", "_blank"),
            1500,
          );
        } else if (action === "go_pricing") {
          botResponse =
            "Ótimo! Role um pouco para baixo ou clique no botão 'Preços' no menu superior.";
        } else {
          botResponse = "Entendi! Como posso te ajudar mais?";
        }
      }

      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: `Ótima pergunta sobre "${userText}"! Minha IA está analisando os manuais da DSA para te dar a melhor resposta. Enquanto isso, posso te ajudar com os atalhos abaixo ou te direcionar para um consultor no WhatsApp?`,
          isBot: true,
        },
      ]);
      setCurrentNamespace("cta_node"); // Drive towards conversion
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[320px] sm:w-[400px] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden mb-2 flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest">
                    Suporte IA
                  </h4>
                  <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Agente Inteligente
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-6 space-y-5 bg-slate-50/50 custom-scrollbar scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.isBot
                      ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                      : "bg-blue-600 text-white ml-auto rounded-tr-none",
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none w-16 shadow-sm flex gap-1.5 justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Interaction Footer */}
            <div className="p-5 border-t border-slate-100 bg-white">
              {/* Quick Options */}
              <div className="flex flex-wrap gap-2 mb-4">
                {botBrain[currentNamespace]?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleAction(opt.action, opt.label, opt.next)
                    }
                    className="text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all bg-slate-50 group shadow-sm active:scale-95"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua dúvida aqui..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-12"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 transition-all hover:bg-blue-700 active:scale-95"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all duration-300",
          isOpen ? "bg-slate-900 rotate-90" : "bg-blue-600",
        )}
      >
        {isOpen ? (
          <X className="text-white" size={28} />
        ) : (
          <div className="relative">
            <Bot className="text-white" size={28} />
            <span className="absolute -top-4 -right-4 w-5 h-5 bg-yellow-500 border-2 border-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900">
              1
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
