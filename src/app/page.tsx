"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Menu,
  Monitor,
  BrainCircuit,
  Shield,
  Globe,
  CheckCircle2,
  ArrowRight,
  Zap,
  Tent,
  BookOpen,
  Trophy,
  Users2,
  Award,
  Check,
  Compass,
  ChevronDown,
  Bot,
  Heart,
  Home,
  TrendingUp,
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
    name: "Aventureiro",
    price: "24,90",
    description: "Para Clubes de Aventureiros (6-9 anos)",
    theme: "orange",
    features: [
      "Fichas de Acompanhamento Kids",
      "Manual do Conselheiro Lúdico",
      "Especialidades em Áudio e Vídeo",
      "Gestão de Classes e Caderno de Requisitos",
      "Suporte exclusivo do Ministério",
      "Garantia de 7 dias",
    ],
    gradient: "from-orange-600 to-red-600",
    glow: "rgba(234, 88, 12, 0.15)",
    iconColor: "text-orange-500",
    link: process.env.NEXT_PUBLIC_CAKTO_BOM_AVENTUREIRO || "#",
  },
  {
    name: "Desbravador",
    price: "25,90",
    description: "Para Clubes de Desbravadores (10-15 anos)",
    theme: "blue",
    features: [
      "Gestão de Classes Regulares e Avançadas",
      "Banco Oficial de +200 Especialidades",
      "Sistema de Pontuação da Secretaria",
      "Relatórios Mensais Pré-preenchidos",
      "Suporte exclusivo direto",
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
    description: "A solução oficial completa",
    theme: "gold",
    features: [
      "Acesso Total: Aventureiro + Desbravador",
      "Cantinho da IA (Roteiros & Provas em segundos)",
      "Emissor de Certificados Ilimitados",
      "PWA - Funciona em acampamentos (Offline)",
      "Analytics de Retenção e Crescimento",
      "Integração de Dados e Exportação SGC",
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

/* ============================================================
   DEMO TABS DATA
   ============================================================ */

interface DemoTool {
  title: string;
  icon: React.ElementType;
  color: string;
}

interface DemoTab {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ElementType;
  features: string[];
  tools: DemoTool[];
}

const demoTabs: DemoTab[] = [
  {
    id: "aventureiro",
    label: "Aventureiro",
    title: "Portal do Crescimento",
    subtitle: "Ideal para o Ministério da Criança e clubes de Aventureiros.",
    color: "blue",
    icon: Compass,
    features: [
      "Álbuns de Atividades Digitais",
      "Manual do Conselheiro Mirim",
      "Fichas Lúdicas PDF",
    ],
    tools: [
      { title: "Atividades", icon: BookOpen, color: "text-blue-500" },
      { title: "Infantil", icon: Heart, color: "text-rose-500" },
      { title: "Manual", icon: Shield, color: "text-emerald-500" },
    ],
  },
  {
    id: "desbravador",
    label: "Desbravador",
    title: "Gestão de Unidade Pro",
    subtitle: "A ferramenta definitiva para o conselheiro e o instrutor.",
    color: "orange",
    icon: Tent,
    features: [
      "Acompanhamento de Classes",
      "Provas de Especialidades Online",
      "Check-list de Atividades",
    ],
    tools: [
      { title: "Classes", icon: Trophy, color: "text-orange-500" },
      { title: "Unidades", icon: Users2, color: "text-blue-500" },
      { title: "Cartões", icon: Award, color: "text-yellow-500" },
    ],
  },
  {
    id: "total",
    label: "Desbrava Total",
    title: "Inteligência & Estratégia",
    subtitle: "O poder da IA e do Analytics para a diretoria do clube.",
    color: "yellow",
    icon: Zap,
    features: [
      "IA para Roteiros e Provas",
      "Exportação Direta para o SGC",
      "Dashboard de Retenção",
    ],
    tools: [
      { title: "IA Assist", icon: Bot, color: "text-yellow-500" },
      { title: "Analytics", icon: BrainCircuit, color: "text-purple-500" },
      { title: "SGC Sync", icon: Globe, color: "text-blue-500" },
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
  const [activeTab, setActiveTab] = useState("total");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Soluções", href: "#solucoes" },
    { label: "Recursos", href: "#recursos" },
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
        {/* Abstract Background Decor - Lighter Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none opacity-60">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT SIDE: Content & Focus */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-400 uppercase tracking-widest mb-8">
                <Shield size={14} className="text-blue-500" />
                Liderança Oficial e Padronizada
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[85px] font-bebas tracking-tight leading-[0.85] text-white mb-8 uppercase">
                GERE SEU CLUBE <br />
                <span className="text-yellow-500">DE FORMA OFICIAL.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-semibold max-w-xl">
                Organize todo o seu clube em um único sistema. Ganhe tempo para
                o que realmente importa:{" "}
                <span className="text-white italic">
                  investir na vida dos seus juvenis.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-10 py-5 rounded-2xl text-xl transition-all shadow-xl shadow-yellow-500/10 active:scale-95 group uppercase"
                >
                  Criar Meu Clube
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="#funcionalidades"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white font-black px-10 py-5 rounded-2xl text-xl transition-all border border-white/10 active:scale-95 group uppercase"
                >
                  Ver Demonstração
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0A0D14] bg-slate-800 border-2 border-blue-500/30"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    +500 Clubes <br />
                    <span className="text-blue-500">Oficiais Conectados</span>
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Padrão DSA
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: Product Showcase (Realistic Mockup) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] bg-blue-600/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-[#0A0D14] rounded-[2.5rem] border border-white/10 p-4 shadow-2xl overflow-hidden shadow-blue-900/40">
                  <Image
                    src="/dashboard_mockup.png"
                    alt="Desbrava Total Dashboard"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-3xl"
                  />
                </div>

                {/* Overlaid labels for official elements */}
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex flex-col gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Oficial
                    </p>
                    <p className="text-xs font-bold text-white">
                      Classes Regulares
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl translate-x-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Integrado
                    </p>
                    <p className="text-xs font-bold text-white">
                      SGC Exportação
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CORE BENEFITS: THE FOUR PILLARS ─── */}
      <section id="recursos" className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-7xl text-slate-900 uppercase tracking-tight mb-4">
              A Ferramenta <span className="text-blue-600">Completa</span> para
              seu Clube
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Tudo o que você precisa para uma gestão padronizada, eficiente e
              100% digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Classes Completas",
                desc: "Requisitos de todas as classes com acompanhamento em tempo real.",
                icon: BookOpen,
                color: "bg-blue-600",
              },
              {
                title: "Especialidades",
                desc: "Processo automatizado de provas, correção e entrega de insígnias.",
                icon: Award,
                color: "bg-yellow-500",
              },
              {
                title: "Cartões Digitais",
                desc: "Substitua o papel pelo acompanhamento digital oficial e seguro.",
                icon: Shield,
                color: "bg-emerald-600",
              },
              {
                title: "Sistema da Diretoria",
                desc: "Relatórios mensais e gestão de secretaria em um só lugar.",
                icon: Users2,
                color: "bg-slate-800",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all",
                    benefit.color,
                  )}
                >
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE DASHBOARD DEMOS (REAL APP STYLE) ─── */}
      <section className="py-24 bg-white overflow-hidden relative border-y border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-7xl text-slate-900 uppercase tracking-tight mb-4">
              Explore o <span className="text-blue-600">Dashboard Real</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Veja exatamente como é a interface que você e sua diretoria usarão
              todos os dias.
            </p>
          </div>

          {/* Tab Selection (Institutional Buttons) */}
          <div className="flex overflow-x-auto pb-6 mb-12 scrollbar-hide md:justify-center gap-4">
            {demoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap border-2 flex items-center gap-3",
                  activeTab === tab.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105"
                    : "bg-slate-100 border-slate-100 text-slate-500 hover:bg-slate-200",
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Preview Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Content Description */}
            <div className="lg:col-span-4 space-y-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg",
                        activeTab === "aventureiro"
                          ? "bg-orange-500"
                          : "bg-blue-600",
                      )}
                    >
                      <Zap size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                      {demoTabs.find((t) => t.id === activeTab)?.title}
                    </h3>
                    <p className="text-base text-slate-500 font-medium leading-relaxed mb-6">
                      {demoTabs.find((t) => t.id === activeTab)?.subtitle}
                    </p>

                    <ul className="space-y-4">
                      {demoTabs
                        .find((t) => t.id === activeTab)
                        ?.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-slate-700 text-sm"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <Check size={12} className="text-emerald-600" />
                            </div>
                            <span className="font-bold">{feat}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {demoTabs
                      .find((t) => t.id === activeTab)
                      ?.tools.map((tool, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-white border border-slate-100 text-center group hover:border-blue-200 hover:shadow-lg transition-all"
                        >
                          <tool.icon
                            size={20}
                            className={cn(
                              "mx-auto mb-2 transition-transform group-hover:scale-110",
                              tool.color,
                            )}
                          />
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">
                            {tool.title}
                          </p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Real Mockup Preview */}
            <div className="lg:col-span-8">
              <div className="relative group">
                <div
                  className={cn(
                    "absolute -inset-10 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000",
                    activeTab === "aventureiro"
                      ? "bg-orange-500"
                      : "bg-blue-500",
                  )}
                />

                {/* Browser Frame */}
                <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex-1 max-w-md mx-auto h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        app.desbravatotal.com.br
                      </span>
                    </div>
                    <div className="w-12 h-3 bg-slate-200 rounded-full" />
                  </div>

                  {/* Real App HUD Simulation */}
                  <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Menu size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                          <Home size={10} /> /{" "}
                          <span className="text-slate-600">Dashboard</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                          Portal{" "}
                          <span
                            className={cn(
                              "italic",
                              activeTab === "aventureiro"
                                ? "text-orange-600"
                                : "text-blue-700",
                            )}
                          >
                            {activeTab === "aventureiro"
                              ? "Aventureiros"
                              : "Desbravadores"}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100" />
                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <Image
                          src={`https://ui-avatars.com/api/?name=Lider&background=${activeTab === "aventureiro" ? "ea580c" : "1d4ed8"}&color=fff&bold=true`}
                          alt="User"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Content Area */}
                  <div className="bg-slate-50/50 p-6 md:p-8 aspect-[16/10] md:aspect-[16/9] relative lg:h-[500px] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full space-y-6"
                      >
                        {/* Welcome Banner Simulation */}
                        <div
                          className={cn(
                            "rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg min-h-[160px] md:min-h-[200px] flex flex-col justify-center",
                            activeTab === "aventureiro"
                              ? "bg-gradient-to-br from-orange-600 to-red-600"
                              : "bg-gradient-to-br from-blue-700 to-blue-900",
                          )}
                        >
                          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rotate-45 translate-x-1/2 -translate-y-1/2 blur-2xl" />
                          <div className="relative z-10">
                            <h5 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2 italic">
                              {activeTab === "aventureiro"
                                ? "Grande Líder!"
                                : "Bem-vindo ao Portal!"}
                            </h5>
                            <p className="text-xs md:text-sm font-medium text-white/80 max-w-md">
                              {activeTab === "total"
                                ? "O poder da IA e do Analytics para a diretoria do seu clube em tempo real."
                                : activeTab === "desbravador"
                                  ? "Gestão eficiente de classes e unidades com controle total de requisitos."
                                  : "Ministério da criança digital: gestão lúdica e organizada para aventureiros."}
                            </p>
                          </div>
                          {activeTab === "total" && (
                            <div className="absolute top-6 right-6 px-3 py-1 bg-yellow-400 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                              Desbrava Total
                            </div>
                          )}
                        </div>

                        {/* Stats Simulation */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            {
                              label: "Ativos",
                              val: "48",
                              ic: TrendingUp,
                              col: "bg-blue-50 text-blue-600",
                            },
                            {
                              label: "Classes",
                              val: "85%",
                              ic: BookOpen,
                              col: "bg-green-50 text-green-600",
                            },
                            {
                              label: "Espec.",
                              val: "142",
                              ic: Award,
                              col: "bg-orange-50 text-orange-600",
                            },
                            {
                              label: "Status",
                              val: "SGC",
                              ic: Globe,
                              col: "bg-purple-50 text-purple-600",
                            },
                          ].map((s, i) => (
                            <div
                              key={i}
                              className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm"
                            >
                              <div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">
                                  {s.label}
                                </p>
                                <p className="text-lg font-black text-slate-800 tracking-tighter">
                                  {s.val}
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center",
                                  s.col,
                                )}
                              >
                                <s.ic size={12} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recent Activity Card Simulation */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hidden md:block">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                              Atividades Recentes
                            </h6>
                            <div className="w-16 h-2 bg-slate-100 rounded-full" />
                          </div>
                          <div className="space-y-3">
                            {[1, 2].map((n) => (
                              <div
                                key={n}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-1 h-6 rounded-full bg-blue-500" />
                                  <div className="h-3 w-32 bg-slate-100 rounded-full" />
                                </div>
                                <div className="h-2 w-12 bg-slate-50 rounded-full" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Floating elements based on activeTab */}
                        {activeTab === "total" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute bottom-6 right-6 bg-yellow-400 p-4 rounded-2xl shadow-xl z-20"
                          >
                            <Bot size={24} className="text-slate-900" />
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Overlaid Label */}
                <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-30 font-black text-[10px] uppercase tracking-[0.2em]">
                  Interface Oficial v2.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROLE-BASED SOLUTIONS (PARA QUEM É?) ─── */}
      <section
        id="solucoes"
        className="py-24 bg-[#0A0D14] relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-7xl text-white uppercase tracking-wider mb-6">
              Soluções Sob <span className="text-yellow-500">Medida</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Desenvolvemos ferramentas específicas para cada nível de liderança
              do seu clube.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                role: "Para Líderes",
                title: "Gestão de Unidade",
                desc: "Controle de presença, pontuação e progresso de cada desbravador na palma da mão.",
                features: [
                  "Presença Digital",
                  "Pontuação da Unidade",
                  "Chat com os Pais",
                ],
                icon: Tent,
                color: "blue",
              },
              {
                role: "Para Instrutores",
                title: "Poder de Ensino",
                desc: "Acesse materiais, envie provas e valide requisitos em segundos com ajuda da IA.",
                features: [
                  "Gabaritos Oficiais",
                  "Gerador de Provas",
                  "Checklist de Requisitos",
                ],
                icon: BrainCircuit,
                color: "gold",
              },
              {
                role: "Para a Diretoria",
                title: "Visão Estratégica",
                desc: "Relatórios automáticos para o SGC, gestão financeira e analytics de retenção.",
                features: [
                  "Exportação SGC",
                  "Relatório Mensal",
                  "Controle Financeiro",
                ],
                icon: Shield,
                color: "emerald",
              },
            ].map((sol, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.08] transition-all group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                      sol.color === "blue"
                        ? "bg-blue-600"
                        : sol.color === "gold"
                          ? "bg-yellow-600"
                          : "bg-emerald-600",
                    )}
                  >
                    <sol.icon size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {sol.role}
                  </span>
                </div>
                <h3 className="text-3xl font-bebas text-white mb-4 uppercase tracking-wider">
                  {sol.title}
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                  {sol.desc}
                </p>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  {sol.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
      <section className="py-24 bg-[#11141D] relative overflow-hidden border-t border-white/5">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[130px] rounded-full animate-pulse [animation-delay:1s]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider">
              Explore <span className="text-yellow-500">Especialidades</span>
            </h2>
            <p className="text-slate-400 mt-4 font-medium italic">
              Mais de 200 especialidades organizadas para o crescimento do seu
              clube.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              {
                name: "Natureza",
                color: "text-orange-400",
                bg: "bg-orange-500/15",
                border: "hover:border-orange-500/40 shadow-orange-500/5",
              },
              {
                name: "Artes",
                color: "text-pink-400",
                bg: "bg-pink-500/15",
                border: "hover:border-pink-500/40 shadow-pink-500/5",
              },
              {
                name: "Saúde",
                color: "text-red-400",
                bg: "bg-red-500/15",
                border: "hover:border-red-500/40 shadow-red-500/5",
              },
              {
                name: "Habilidades",
                color: "text-yellow-400",
                bg: "bg-yellow-500/15",
                border: "hover:border-yellow-500/40 shadow-yellow-500/5",
              },
              {
                name: "Ciência",
                color: "text-blue-400",
                bg: "bg-blue-500/15",
                border: "hover:border-blue-500/40 shadow-blue-500/5",
              },
              {
                name: "Ativ. Missionárias",
                color: "text-blue-300",
                bg: "bg-blue-400/15",
                border: "hover:border-blue-400/40 shadow-blue-400/5",
              },
              {
                name: "Ativ. Agrícolas",
                color: "text-emerald-400",
                bg: "bg-emerald-500/15",
                border: "hover:border-emerald-500/40 shadow-emerald-500/5",
              },
              {
                name: "Mestrados",
                color: "text-purple-400",
                bg: "bg-purple-500/15",
                border: "hover:border-purple-500/40 shadow-purple-500/5",
              },
            ].map((spec, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center group transition-all cursor-default relative overflow-hidden flex flex-col items-center justify-between min-h-[160px]",
                  spec.border,
                  "hover:bg-white/[0.07] hover:shadow-2xl",
                )}
              >
                {/* Dynamic Inner Glow */}
                <div
                  className={cn(
                    "absolute -inset-10 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity pointer-events-none",
                    spec.bg,
                  )}
                />

                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform relative z-10",
                    spec.bg,
                  )}
                >
                  <BookOpen size={28} className={spec.color} />
                </div>

                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.1em] transition-colors relative z-10 leading-tight h-8 flex items-center justify-center",
                    "text-slate-400 group-hover:text-white",
                  )}
                >
                  {spec.name}
                </span>

                {/* Micro-interaction line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className={cn(
                    "h-[1px] absolute bottom-0 left-0 opacity-40",
                    spec.bg,
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIBRARY SECTION ─── */}
      <section className="py-24 bg-[#11141D] border-t border-white/5">
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
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-12 border border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

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

      <section
        id="funcionalidades"
        className="py-24 md:py-32 px-6 md:px-10 bg-[#11141D] border-t border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 transition-all group relative overflow-hidden",
                  "hover:border-white/20 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
                  feat.title === "Suporte Total" && "hover:shadow-blue-500/20",
                  feat.title === "Acervo Acadêmico" &&
                    "hover:shadow-purple-500/20",
                  feat.title === "Central de Avaliações" &&
                    "hover:shadow-emerald-500/20",
                  feat.title === "Interface Business" &&
                    "hover:shadow-orange-500/20",
                  feat.title === "Emissor de Certificados" &&
                    "hover:shadow-blue-400/20",
                  feat.title === "Controle Administrativo" &&
                    "hover:shadow-slate-300/20",
                )}
              >
                <div
                  className={cn(
                    "absolute -inset-10 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity pointer-events-none",
                    feat.bg,
                  )}
                />

                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative z-10",
                    feat.bg,
                    feat.color,
                  )}
                >
                  <feat.icon size={28} />
                </motion.div>
                <h3 className="text-xl font-bebas text-white mb-3 tracking-widest uppercase relative z-10">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
                  {feat.desc}
                </p>

                {/* Visual indicator at bottom */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className={cn(
                    "h-[2px] absolute bottom-0 left-0",
                    feat.bg,
                    "opacity-40",
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16 font-bebas">
            <h2 className="text-5xl md:text-7xl text-slate-900 uppercase tracking-tight mb-4">
              Quem <span className="text-blue-600">Lidera</span>, Confia
            </h2>
            <p className="font-inter text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Junte-se a centenas de diretores que transformaram a gestão de
              seus clubes com o Desbrava Total.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pr. Marcos Silva",
                role: "Regional - 4ª Região",
                text: "A facilidade de exportar dados para o SGC e o controle de classes digitais economiza pelo menos 10 horas de trabalho burocrático por mês.",
                avatar: "MS",
              },
              {
                name: "Luciana Oliveira",
                role: "Diretora de Aventureiros",
                text: "O material para o Ministério da Criança e as fichas lúdicas são encantadores. Meus aventureiros amam as especialidades em áudio!",
                avatar: "LO",
              },
              {
                name: "Ricardo Santos",
                role: "Diretor de Desbravadores",
                text: "O Cantinho da IA é surreal. Gerar roteiros de acampamento e provas de especialidade em segundos mudou nosso patamar de organização.",
                avatar: "RS",
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                    {testi.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testi.name}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                      {testi.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic font-medium">
                  &quot;{testi.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION (Padronizado) ─── */}
      <section
        id="pricing"
        className="py-24 bg-[#0A0D14] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-7xl text-white uppercase tracking-wider mb-6">
              Invista no Seu <span className="text-yellow-500">Clube</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Planos acessíveis para clubes de todos os tamanhos. Sem contratos,
              cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full",
                  plan.popular
                    ? "bg-white/10 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                    : "bg-white/5 border-white/10 hover:border-white/20",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                    Recomendado
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-slate-400 font-bold">R$</span>
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-sm font-bold">/mês</span>
                </div>
                <div className="space-y-4 mb-10 border-t border-white/5 pt-8 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
                      <span className="text-slate-300 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={plan.link}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-center transition-all active:scale-95",
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20"
                      : "bg-white/10 hover:bg-white/20 text-white",
                  )}
                >
                  {plan.popular ? "Acessar Agora" : "Assinar Plano"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-bebas text-5xl md:text-8xl text-white mb-8 leading-none tracking-tight uppercase">
            NÃO PERCA MAIS TEMPO COM <br />
            <span className="text-slate-900">PAPELADAS E PLANILHAS.</span>
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium">
            Seja um líder transformador. Foque nas pessoas, deixe o sistema
            cuidar da burocracia.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-12 py-6 rounded-[2.5rem] text-2xl transition-all shadow-2xl active:scale-95 group uppercase"
          >
            Começar Meu Clube Agora
            <ArrowRight
              size={28}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 px-6 md:px-10 bg-[#11141D]">
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
