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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

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
    bgColor: "bg-orange-500/5",
    borderColor: "border-orange-500/20",
    link: process.env.NEXT_PUBLIC_CAKTO_BOM_AVENTUREIRO || "#",
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
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/40",
    popular: true,
    link: process.env.NEXT_PUBLIC_CAKTO_DESBRAVA_TOTAL || "#",
  },
  {
    name: "Desbravador",
    price: "25,90",
    description: "Para Clubes de Desbravadores (10-15 anos)",
    theme: "blue",
    features: [
      "Gestão de Classes Regulares e Avançadas",
      "Banco Oficial de +200 Especialidades",
      "Relatórios Mensais Pré-preenchidos",
      "Suporte exclusivo direto",
      "Garantia de 7 dias",
      "Sistema de Pontuação Secretaria",
    ],
    gradient: "from-blue-600 to-indigo-600",
    glow: "rgba(37, 99, 235, 0.15)",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-blue-500/20",
    link: process.env.NEXT_PUBLIC_CAKTO_SO_DESBRAVADOR || "#",
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
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("total");
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Fixed background state
      setScrolled(currentScrollY > 50);

      // Hide/Show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Soluções", href: "#solucoes" },
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden w-full max-w-[100vw]">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3"
            : "bg-transparent py-6",
          navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0",
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
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-400 uppercase tracking-widest mb-8">
                Liderança Oficial e Padronizada
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[85px] font-bebas tracking-tight leading-[0.85] text-white mb-8 uppercase">
                GERENCIE SEU CLUBE <br />
                <span className="text-yellow-500">
                  COM INTELIGÊNCIA ARTIFICIAL
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-semibold max-w-xl mx-auto lg:mx-0">
                Além de ter um banco de materiais, agora você conta com uma{" "}
                <span className="text-yellow-400 italic">
                  Inteligência Artificial
                </span>{" "}
                que cria o que você quiser para você.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start justify-center lg:justify-start">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-10 py-5 rounded-2xl text-xl transition-all shadow-xl shadow-yellow-500/10 active:scale-95 group uppercase"
                >
                  QUERO O APLICATIVO
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="#demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white font-black px-10 py-5 rounded-2xl text-xl transition-all border border-white/10 active:scale-95 group uppercase"
                >
                  Ver Demonstração
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
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
      <section
        id="demo"
        className="py-24 bg-white overflow-hidden relative border-y border-slate-100"
      >
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

                  {/* App Content Area: Real dashboard layout */}
                  <div className="flex h-[520px] overflow-hidden">
                    {/* Sidebar */}
                    <div className="hidden md:flex flex-col w-[180px] bg-slate-50 border-r border-slate-100 p-3 gap-1 shrink-0">
                      {[
                        { icon: Home, label: "Início", active: false },
                        { icon: Users2, label: "Membros", active: false },
                        {
                          icon: BookOpen,
                          label: "Classes",
                          active:
                            activeTab === "desbravador" ||
                            activeTab === "aventureiro",
                        },
                        { icon: Award, label: "Especialidades", active: false },
                        {
                          icon: Bot,
                          label: "IA Cantinho",
                          active: activeTab === "total",
                        },
                        { icon: Globe, label: "SGC Sync", active: false },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-default",
                            item.active
                              ? activeTab === "aventureiro"
                                ? "bg-orange-50 text-orange-600 border border-orange-100"
                                : activeTab === "total"
                                  ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                  : "bg-blue-50 text-blue-700 border border-blue-100"
                              : "text-slate-400 hover:bg-slate-100",
                          )}
                        >
                          <item.icon size={14} />
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/60 p-5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          {/* Page title row */}
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-base font-black text-slate-900">
                                {activeTab === "aventureiro"
                                  ? "Ministério Aventureiros"
                                  : activeTab === "desbravador"
                                    ? "Gestão de Classes"
                                    : "Cantinho da IA ✨"}
                              </h5>
                              <p
                                className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest",
                                  activeTab === "aventureiro"
                                    ? "text-orange-500"
                                    : activeTab === "total"
                                      ? "text-yellow-600"
                                      : "text-blue-500",
                                )}
                              >
                                {activeTab === "aventureiro"
                                  ? "Portal do Crescimento"
                                  : activeTab === "desbravador"
                                    ? "Classes Regulares e Avançadas"
                                    : "Plano Desbrava Total"}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                                activeTab === "aventureiro"
                                  ? "bg-orange-100 text-orange-700"
                                  : activeTab === "total"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-700",
                              )}
                            >
                              {activeTab === "total"
                                ? "IA Ativa"
                                : "+ Nova Inscrição"}
                            </div>
                          </div>

                          {/* TAB: Desbravador — class cards grid */}
                          {activeTab === "desbravador" && (
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                {
                                  name: "Amigo",
                                  age: "10 anos",
                                  color: "text-blue-500",
                                  bg: "bg-blue-500/10",
                                  count: 12,
                                  pct: 45,
                                },
                                {
                                  name: "Companheiro",
                                  age: "11 anos",
                                  color: "text-green-500",
                                  bg: "bg-green-500/10",
                                  count: 8,
                                  pct: 60,
                                },
                                {
                                  name: "Pesquisador",
                                  age: "12 anos",
                                  color: "text-amber-500",
                                  bg: "bg-amber-500/10",
                                  count: 7,
                                  pct: 72,
                                },
                                {
                                  name: "Pioneiro",
                                  age: "13 anos",
                                  color: "text-indigo-500",
                                  bg: "bg-indigo-500/10",
                                  count: 5,
                                  pct: 30,
                                },
                                {
                                  name: "Excursionista",
                                  age: "14 anos",
                                  color: "text-purple-500",
                                  bg: "bg-purple-500/10",
                                  count: 4,
                                  pct: 55,
                                },
                                {
                                  name: "Guia",
                                  age: "15 anos",
                                  color: "text-orange-500",
                                  bg: "bg-orange-500/10",
                                  count: 2,
                                  pct: 80,
                                },
                              ].map((cls, i) => (
                                <div
                                  key={i}
                                  className="bg-white border border-amber-50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group"
                                >
                                  <div
                                    className={cn(
                                      "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                                      cls.bg,
                                    )}
                                  >
                                    <Shield size={16} className={cls.color} />
                                  </div>
                                  <p className="font-black text-slate-900 text-xs mb-0.5">
                                    {cls.name}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    {cls.count} membros
                                  </p>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full",
                                        cls.color.replace("text-", "bg-"),
                                      )}
                                      style={{ width: `${cls.pct}%` }}
                                    />
                                  </div>
                                  <p
                                    className={cn(
                                      "text-[9px] font-black mt-1 text-right",
                                      cls.color,
                                    )}
                                  >
                                    {cls.pct}%
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* TAB: Aventureiro — specialty cards */}
                          {activeTab === "aventureiro" && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  {
                                    name: "Fichas de Atividades",
                                    badge: "12 fichas",
                                    color: "text-orange-600",
                                    bg: "bg-orange-50",
                                    border: "border-orange-100",
                                  },
                                  {
                                    name: "Manual do Conselheiro",
                                    badge: "Atualizado",
                                    color: "text-blue-600",
                                    bg: "bg-blue-50",
                                    border: "border-blue-100",
                                  },
                                  {
                                    name: "Especialidades Áudio",
                                    badge: "48 esp.",
                                    color: "text-purple-600",
                                    bg: "bg-purple-50",
                                    border: "border-purple-100",
                                  },
                                  {
                                    name: "Caderno de Requisitos",
                                    badge: "6 classes",
                                    color: "text-emerald-600",
                                    bg: "bg-emerald-50",
                                    border: "border-emerald-100",
                                  },
                                ].map((item, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "p-3.5 rounded-xl border",
                                      item.bg,
                                      item.border,
                                    )}
                                  >
                                    <p
                                      className={cn(
                                        "text-xs font-black mb-1",
                                        item.color,
                                      )}
                                    >
                                      {item.name}
                                    </p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                      {item.badge}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-white border border-amber-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div>
                                  <p className="text-xs font-black text-slate-900">
                                    Próxima Atividade
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    Natureza e Acampar · Sáb. 08h
                                  </p>
                                </div>
                                <div className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-[9px] font-black">
                                  Ver Fichas
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB: Total — AI chat interface */}
                          {activeTab === "total" && (
                            <div className="space-y-3">
                              <div className="bg-white border border-yellow-100 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
                                    <Bot size={14} className="text-slate-900" />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                    IA Desbrava · Cantinho
                                  </span>
                                  <span className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 font-medium">
                                    Olá, Líder! Me diga o tema da sua reunião e
                                    eu crio um roteiro completo agora. 📝
                                  </div>
                                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-slate-700 font-medium text-right">
                                    Cria um roteiro sobre Lealdade para
                                    Pioneiros
                                  </div>
                                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 font-medium">
                                    <p className="font-black text-slate-800 mb-1">
                                      ✅ Roteiro:{" "}
                                      <span className="text-yellow-700">
                                        Lealdade
                                      </span>{" "}
                                      · Classe Pioneiro
                                    </p>
                                    <p>
                                      1. Abertura com hino — 5min
                                      <br />
                                      2. Dinâmica de confiança — 10min
                                      <br />
                                      3. Lição: Ruthe e Noemi — 15min
                                      <br />
                                      4. Teste de especialidade gerado ✨
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <div className="flex-1 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3">
                                    <span className="text-xs text-slate-400">
                                      Digite para a IA...
                                    </span>
                                  </div>
                                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                                    <ArrowRight
                                      size={14}
                                      className="text-slate-900"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  {
                                    label: "Roteiros",
                                    val: "14",
                                    color:
                                      "text-yellow-700 bg-yellow-50 border-yellow-100",
                                  },
                                  {
                                    label: "Provas Geradas",
                                    val: "38",
                                    color:
                                      "text-blue-700 bg-blue-50 border-blue-100",
                                  },
                                  {
                                    label: "Horas Poupadas",
                                    val: "22h",
                                    color:
                                      "text-emerald-700 bg-emerald-50 border-emerald-100",
                                  },
                                ].map((s, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "border rounded-xl p-3 text-center",
                                      s.color,
                                    )}
                                  >
                                    <p className="font-black text-lg leading-none">
                                      {s.val}
                                    </p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5">
                                      {s.label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
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
              <motion.div
                key={i}
                onClick={() => setSelectedSolution(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "bg-white/5 border rounded-[2.5rem] p-10 transition-all cursor-pointer relative overflow-hidden group",
                  selectedSolution === i
                    ? "bg-white/[0.12] border-white/30 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] ring-2 ring-white/10"
                    : "border-white/10 hover:bg-white/[0.08]",
                )}
              >
                {/* Selection indicator animation */}
                {selectedSolution === i && (
                  <motion.div
                    layoutId="selection-glow"
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                      sol.color === "blue"
                        ? "bg-blue-600 shadow-blue-500/20"
                        : sol.color === "gold"
                          ? "bg-yellow-600 shadow-yellow-500/20"
                          : "bg-emerald-600 shadow-emerald-500/20",
                    )}
                  >
                    <sol.icon size={20} />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em] transition-colors",
                      selectedSolution === i ? "text-white" : "text-slate-300",
                    )}
                  >
                    {sol.role}
                  </span>
                </div>
                <h3 className="text-3xl font-bebas text-white mb-4 uppercase tracking-wider relative z-10">
                  {sol.title}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-8 leading-relaxed font-medium transition-colors relative z-10",
                    selectedSolution === i
                      ? "text-slate-100"
                      : "text-slate-300",
                  )}
                >
                  {sol.desc}
                </p>
                <div className="space-y-3 pt-6 border-t border-white/5 relative z-10">
                  {sol.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          selectedSolution === i ? "bg-white" : "bg-blue-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors",
                          selectedSolution === i
                            ? "text-white"
                            : "text-slate-200",
                        )}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Micro-animation Checkmark */}
                <AnimatePresence>
                  {selectedSolution === i && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 20 }}
                      className="absolute top-8 right-8 text-white/40"
                    >
                      <CheckCircle2 size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLASSES SECTION ─── */}
      <section className="py-24 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wider mb-4">
            Classes <span className="text-blue-500">Oficiais</span>
          </h2>
          <p className="text-slate-400 font-medium mb-16 text-base">
            Todos os materiais para facilitar a classe do seu desbravador.
          </p>
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
                <div className="space-y-6 mb-12">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5 hover:border-blue-500/30 transition-all">
                    <BookOpen size={40} className="text-blue-400 mb-4" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Manuais
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5 hover:border-yellow-500/30 transition-all">
                    <Trophy size={40} className="text-yellow-500 mb-4" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Especialidades
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5 hover:border-emerald-500/30 transition-all">
                    <Globe size={40} className="text-emerald-400 mb-4" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Certificados
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 border border-white/5 hover:border-red-500/30 transition-all">
                    <Compass size={40} className="text-red-500 mb-4" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Classes
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="relative">
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
                  <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                      <Zap size={40} className="text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-[0.2em]">
                      SGC Integrado
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Sincronização oficial em tempo real
                    </p>
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
                title: "INTELIGÊNCIA ARTIFICIAL",
                desc: "Consegue criar materiais da sua preferência com a inteligência artificial",
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
                  "relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full group",
                  plan.bgColor || "bg-white/5",
                  plan.borderColor || "border-white/10",
                  plan.popular
                    ? "shadow-2xl shadow-yellow-500/10 scale-105 z-10"
                    : "hover:border-white/20",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg z-20">
                    Recomendado
                  </div>
                )}

                <div className="mb-6 relative z-10">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl",
                      plan.gradient.replace("from-", "bg-"),
                    )}
                  >
                    {plan.name === "Aventureiro" ? (
                      <Heart size={24} className="text-white" />
                    ) : plan.name === "Desbravador" ? (
                      <Compass size={24} className="text-white" />
                    ) : (
                      <Zap size={24} className="text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1 relative z-10">
                  <span className="text-slate-400 font-bold text-sm">R$</span>
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-1">
                    Mensal
                  </span>
                </div>

                <div className="space-y-3.5 mb-10 border-t border-white/5 pt-8 flex-grow relative z-10">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-emerald-500" />
                      </div>
                      <span className="text-slate-300 text-[13px] font-medium leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.link}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] text-center transition-all active:scale-95 relative z-10",
                    plan.popular
                      ? "bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-xl shadow-yellow-500/20"
                      : "bg-white/10 hover:bg-white/20 text-white",
                  )}
                >
                  Escolher Plano
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
            QUERO O APLICATIVO
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
      text: "Olá! 👋 Sou o assistente com IA do Desbrava Total. Posso te ajudar a encontrar o plano ideal ou esclarecer dúvidas sobre o sistema. Por onde começamos?",
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
        "Olá! 👋 Sou o assistente com IA do Desbrava Total. Posso te ajudar a encontrar o plano ideal ou esclarecer dúvidas sobre o sistema. Por onde começamos?",
      options: [
        { label: "Ver Planos", action: "pricing", next: "pricing_node" },
        { label: "O que é a IA?", action: "ia", next: "ia_node" },
        {
          label: "Recursos do Sistema",
          action: "features",
          next: "features_node",
        },
      ],
    },
    pricing_node: {
      response:
        "Temos 3 planos! 🚀 Aventureiro (R$ 24,90) para clubes de crianças, Desbravador (R$ 25,90) para clubes de jovens, e o Desbrava Total (R$ 32,90) com IA ilimitada para criar roteiros e provas em segundos. Qual te interessa?",
      options: [
        {
          label: "Aventureiro",
          action: "info_aventureiro",
          next: "cta_aventureiro",
        },
        {
          label: "Desbravador",
          action: "info_desbravador",
          next: "cta_desbravador",
        },
        { label: "Desbrava Total ⭐", action: "info_total", next: "cta_total" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    cta_aventureiro: {
      response:
        "O plano Aventureiro é perfeito para o Ministério da Criança! Fichas lúdicas, manual do conselheiro e gestão de classes tudo em um app. Quer garantir o acesso agora?",
      options: [
        { label: "Quero este plano! 🎉", action: "go_pricing_aventureiro" },
        { label: "Chamar no WhatsApp", action: "whatsapp" },
        { label: "Ver outros planos", action: "back", next: "pricing_node" },
      ],
    },
    cta_desbravador: {
      response:
        "O plano Desbravador tem gestão completa de classes, banco de +200 especialidades e relatórios mensais automáticos! Quer garantir agora?",
      options: [
        { label: "Quero este plano! 🎉", action: "go_pricing_desbravador" },
        { label: "Chamar no WhatsApp", action: "whatsapp" },
        { label: "Ver outros planos", action: "back", next: "pricing_node" },
      ],
    },
    cta_total: {
      response:
        "O Desbrava Total é nossa joia da coroa! ⭐ Inclui IA que gera roteiros e provas em segundos, emissor de certificados, PWA offline para acampamentos, e TUDO dos outros planos. Quer começar agora?",
      options: [
        { label: "Quero o Total! 🚀", action: "go_pricing_total" },
        { label: "Chamar no WhatsApp", action: "whatsapp" },
        { label: "Ver outros planos", action: "back", next: "pricing_node" },
      ],
    },
    ia_node: {
      response:
        "🤖 Nossa IA é o coração do Desbrava Total! Ela usa modelos avançados treinados com os manuais da DSA para criar roteiros de reunião, provas de especialidades e planos de aula em segundos. Quer saber mais?",
      options: [
        {
          label: "Criar roteiros com IA",
          action: "ia_roteiros",
          next: "ia_roteiros_node",
        },
        { label: "Gerar provas", action: "ia_provas", next: "ia_provas_node" },
        { label: "Ver plano com IA", action: "back", next: "cta_total" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    ia_roteiros_node: {
      response:
        "📋 Com a IA, você digita o tema da reunião e ela gera um roteiro completo com abertura, atividades, mensagem espiritual e encerramento — tudo em menos de 30 segundos! Disponível no plano Desbrava Total.",
      options: [
        { label: "Quero experimentar!", action: "back", next: "cta_total" },
        { label: "Outras funções da IA", action: "back", next: "ia_node" },
        { label: "Voltar ao início", action: "back", next: "start" },
      ],
    },
    ia_provas_node: {
      response:
        "📝 O gerador de provas da IA cria questões baseadas nos requisitos oficiais de qualquer especialidade. Você escolhe a especialidade, a IA monta a prova! Recurso exclusivo do plano Desbrava Total.",
      options: [
        { label: "Quero este recurso!", action: "back", next: "cta_total" },
        { label: "Outras funções da IA", action: "back", next: "ia_node" },
        { label: "Voltar ao início", action: "back", next: "start" },
      ],
    },
    features_node: {
      response:
        "Além da IA, temos: PWA offline para acampamentos 🏕️, emissor de certificados, integração com SGC, gestão completa de classes e muito mais. O que te interessa?",
      options: [
        {
          label: "Funciona Offline?",
          action: "off_pwa",
          next: "pwa_node",
        },
        { label: "SGC Integração", action: "sgc", next: "sgc_node" },
        { label: "Certificados", action: "certs", next: "certs_node" },
        { label: "Voltar", action: "back", next: "start" },
      ],
    },
    pwa_node: {
      response:
        "🏕️ Sim! O Desbrava Total usa tecnologia PWA que permite usar o sistema SEM INTERNET. Perfeito para acampamentos em locais remotos. Os dados sincronizam automaticamente quando a conexão volta.",
      options: [
        { label: "Incrível! Ver planos", action: "back", next: "pricing_node" },
        { label: "Outros recursos", action: "back", next: "features_node" },
      ],
    },
    sgc_node: {
      response:
        "📤 A integração com o SGC permite exportar dados de presença, classes e especialidades no formato oficial. Poupa horas de trabalho burocrático toda semana!",
      options: [
        { label: "Ver planos", action: "back", next: "pricing_node" },
        { label: "Outros recursos", action: "back", next: "features_node" },
      ],
    },
    certs_node: {
      response:
        "🏆 O emissor de certificados gera documentos personalizados e prontos para impressão com apenas um clique. Cerimônias de entrega de insígnias nunca foram tão organizadas!",
      options: [
        { label: "Ver planos", action: "back", next: "pricing_node" },
        { label: "Outros recursos", action: "back", next: "features_node" },
      ],
    },
  };

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
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
            "Perfeito! Vou te direcionar agora para o nosso WhatsApp oficial. Um segundo... 📱";
          setTimeout(
            () => window.open("https://wa.me/556699762785", "_blank"),
            1500,
          );
        } else if (
          action === "go_pricing" ||
          action === "go_pricing_aventureiro" ||
          action === "go_pricing_desbravador" ||
          action === "go_pricing_total"
        ) {
          botResponse =
            "Perfeito! 🎉 Redirecionando você para a seção de planos agora!";
          setTimeout(() => scrollToPricing(), 1000);
        } else {
          botResponse =
            "Entendido! Nossa IA está aqui para ajudar. 🤖 Como posso te ajudar mais?";
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
          text: `🤖 Nossa IA analisou sua pergunta sobre "${userText}"! Para uma resposta personalizada, nossos consultores no WhatsApp têm acesso completo aos manuais da DSA e podem te ajudar agora.`,
          isBot: true,
        },
      ]);
      setCurrentNamespace("cta_total"); // Drive towards conversion
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
            className="absolute bottom-20 right-0 w-[320px] sm:w-[400px] bg-white border border-slate-200/60 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden mb-2 flex flex-col max-h-[80vh]"
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
              className="flex-1 max-h-[450px] overflow-y-auto p-6 space-y-5 bg-slate-50/50 custom-scrollbar scroll-smooth min-h-[100px]"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all",
                    msg.isBot
                      ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none ring-1 ring-slate-900/5 shadow-blue-500/5"
                      : "bg-blue-600 text-white ml-auto rounded-tr-none shadow-blue-600/20",
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
            <div className="p-5 border-t border-slate-100/50 bg-slate-50/30">
              {/* Quick Options */}
              <div className="flex flex-wrap gap-2 mb-4">
                {botBrain[currentNamespace]?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleAction(opt.action, opt.label, opt.next)
                    }
                    className="text-[11px] font-black tracking-[0.1em] uppercase px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all bg-white group active:scale-95 hover:shadow-md hover:-translate-y-0.5"
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
                  style={{ fontSize: "16px" }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-[#0A0D14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-12"
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
