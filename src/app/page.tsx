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
    description: "Ideal para novos clubes",
    features: [
      "Materiais completos",
      "Acesso vitalício",
      "Atualizações futuras incluídas",
      "Suporte prioritário",
      "Garantia 7 dias",
      "Pagamento 100% seguro",
    ],
    gradient: "from-blue-500 to-cyan-400",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    link: process.env.NEXT_PUBLIC_CAKTO_BOM_AVENTUREIRO || "#",
  },
  {
    name: "Só Desbravador",
    price: "25,90",
    description: "O favorito dos diretores",
    features: [
      "Especialidades (+200)",
      "Materiais de apoio",
      "Acesso vitalício",
      "Dashboard estilo Netflix",
      "Gabaritos oficiais",
      "Garantia 7 dias",
    ],
    gradient: "from-primary to-orange-500",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    link: process.env.NEXT_PUBLIC_CAKTO_SO_DESBRAVADOR || "#",
  },
  {
    name: "Desbrava Total",
    price: "32,90",
    description: "Experiência completa e ilimitada",
    features: [
      "TODAS as 6 classes completas",
      "TODAS as especialidades (+200)",
      "Materiais completos",
      "Banco completo de provas",
      "Gabaritos oficiais",
      "Certificados automáticos",
      "Sistema completo de gestão",
      "Ferramentas Diretor/Líder",
      "Atualizações inclusas",
      "Suporte prioritário",
    ],
    gradient: "from-orange-500 to-yellow-400",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
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
   MAIN COMPONENT
   ============================================================ */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-16 -left-20 w-16 h-16 bg-[#1A1F2B] rounded-2xl flex items-center justify-center p-3 border border-white/5 shadow-2xl rotate-[-12deg]"
              >
                <Compass className="text-yellow-500" size={32} />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-12 -right-20 w-14 h-14 bg-[#1A1F2B] rounded-2xl flex items-center justify-center p-3 border border-white/5 shadow-2xl rotate-[12deg]"
              >
                <Tent className="text-blue-500" size={28} />
              </motion.div>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-4">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Plataforma oficial para desbravadores
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[92px] font-bebas tracking-wide leading-[0.9] text-white mb-10 uppercase">
              Gerencie seu Clube <br />
              <span className="text-yellow-500">com excelência.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              A plataforma Desbrava Total une tecnologia e materiais oficiais
              para você focar no que realmente importa:{" "}
              <span className="text-white font-bold">
                Salvar do Pecado e Guiar no Serviço.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-28">
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl text-xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
              >
                Crie uma conta gratuita
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW ─── */}
      <section className="py-24 bg-[#0A0D14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="relative group">
            {/* Glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-yellow-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-[#0D111A] border border-white/10 rounded-[2.5rem] shadow-2xl p-4 md:p-8 overflow-hidden">
              {/* Fake Browser Top Bar */}
              <div className="flex items-center gap-2 mb-6 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 flex-1 h-8 bg-white/5 rounded-lg border border-white/5 flex items-center px-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  portal.desbravatotal.com.br
                </div>
              </div>

              {/* Mock Dashboard Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* Sidebar Mock */}
                <div className="hidden md:block col-span-3 space-y-4">
                  <div className="h-12 w-full bg-blue-600/10 rounded-xl border border-blue-500/20" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-full bg-white/5 rounded-xl transition-all hover:bg-white/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Main Content Mock */}
                <div className="col-span-12 md:col-span-9 space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-white/5 rounded-2xl border border-white/10 p-4 space-y-2"
                      >
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg" />
                        <div className="h-4 w-3/4 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                  {/* Center Content */}
                  <div className="h-80 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 p-8">
                    <div className="flex justify-between items-start mb-12">
                      <div className="space-y-4 w-full">
                        <div className="h-8 w-1/3 bg-white/10 rounded-xl" />
                        <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="h-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
                      <div className="h-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse delay-75" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Badge */}
              <div className="absolute bottom-12 right-12 flex flex-col items-end gap-3 z-20">
                <div className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/40 text-sm uppercase tracking-widest flex items-center gap-3">
                  <Zap size={18} fill="currentColor" />
                  Interface 100% Responsiva
                </div>
                <div className="bg-yellow-500 text-slate-900 font-black px-6 py-3 rounded-2xl shadow-xl shadow-yellow-500/40 text-sm uppercase tracking-widest">
                  Materiais Oficiais DSA
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="font-bebas text-4xl md:text-5xl text-white mb-4 uppercase">
              UMA EXPERIÊNCIA <span className="text-blue-500">DIGITAL</span>{" "}
              COMPLETA
            </h3>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Desenvolvido por quem vive o clube, para quem lidera o clube. Uma
              interface moderna que reflete a seriedade e o brilho do
              ministério.
            </p>
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
                  "bg-[#111622] rounded-[3rem] p-10 border border-white/5 transition-all hover:scale-[1.02] relative overflow-hidden",
                  plan.popular && "border-blue-500/30 bg-[#161C2C]",
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                    Mais Popular
                  </div>
                )}
                <div className="mb-10">
                  <h3 className="text-3xl font-bebas text-white mb-2 tracking-widest uppercase">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-2xl font-black text-white">R$</span>
                  <span className="text-7xl font-black text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 font-bold ml-2">/mês</span>
                </div>

                <div className="space-y-5 mb-12">
                  {plan.features.slice(0, 6).map((feat, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Check size={14} className="text-blue-500" />
                      </div>
                      <span className="text-sm text-slate-300 font-bold">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.link}
                  className={cn(
                    "block w-full text-center py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all",
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10",
                  )}
                >
                  Selecionar
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
  const [messages, setMessages] = useState([
    {
      text: "Olá! Sou o assistente do Desbrava Total. Como posso ajudar você hoje?",
      isBot: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const options = [
    { label: "Ver Planos", action: "pricing" },
    { label: "Dúvidas sobre IA", action: "ia" },
    { label: "Falar no WhatsApp", action: "whatsapp" },
  ];

  const handleAction = (action: string, label: string) => {
    setMessages((prev) => [...prev, { text: label, isBot: false }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (action === "pricing") {
        setMessages((prev) => [
          ...prev,
          {
            text: "Temos 3 planos ideais para o seu clube. O Plano Desbrava Total está com uma oferta especial de R$ 32,90/mês! Deseja ver os detalhes?",
            isBot: true,
          },
        ]);
      } else if (action === "ia") {
        setMessages((prev) => [
          ...prev,
          {
            text: "Nossa IA é baseada nos manuais oficiais da DSA. Ela ajuda a criar roteiros, classes e especialidades em segundos.",
            isBot: true,
          },
        ]);
      } else if (action === "whatsapp") {
        setMessages((prev) => [
          ...prev,
          {
            text: "Perfeito! Vou te direcionar agora para o nosso WhatsApp oficial. Um segundo...",
            isBot: true,
          },
        ]);
        setTimeout(() => {
          window.open("https://wa.me/556699762785", "_blank");
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[320px] sm:w-[380px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Suporte Desbrava</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online agora
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="h-[350px] overflow-y-auto p-5 space-y-4 bg-slate-50/50 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.isBot
                      ? "bg-white border border-slate-100 text-slate-900 rounded-tl-none shadow-sm"
                      : "bg-primary text-white ml-auto rounded-tr-none shadow-md",
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none w-16 shadow-sm flex gap-1 justify-center">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Footer / Options */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {options.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action, opt.label)}
                    className="text-xs font-bold px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-yellow-500 hover:text-yellow-600 transition-all bg-slate-50 shadow-sm"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <a
                href="https://wa.me/556699762785"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={18} />
                Chamar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300",
          isOpen ? "bg-slate-900 rotate-90" : "bg-primary shadow-primary/30",
        )}
      >
        {isOpen ? (
          <X className="text-white" size={28} />
        ) : (
          <Bot className="text-white" size={28} />
        )}
      </motion.button>
    </div>
  );
}
