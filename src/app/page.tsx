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
  ChevronRight,
  ChevronDown,
  Zap,
  Bot,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

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
    q: "O sistema salva os dados offline?",
    a: "Sim! Nossa tecnologia PWA permite carregar e sincronizar dados mesmo em locais sem sinal de internet, ideal para acampamentos.",
  },
  {
    q: "Posso exportar os dados para o SGC?",
    a: "Atualmente oferecemos exportação em planilhas compatíveis com o formato de importação em massa do sistema oficial.",
  },
  {
    q: "Existe limite de desbravadores por clube?",
    a: "Não! No plano Desbrava Total você pode cadastrar quantos membros desejar sem custo adicional.",
  },
  {
    q: "Dá para usar no celular e no computador?",
    a: "Com certeza. A interface é totalmente responsiva e funciona perfeitamente em qualquer dispositivo.",
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
    <div className="min-h-screen bg-white text-slate-900 font-inter selection:bg-primary/10 overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-3"
            : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bebas text-xl tracking-wide text-slate-900">
                DESBRAVA <span className="text-primary">TOTAL</span>
              </span>
              <span className="text-[8px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors px-4 py-2"
            >
              Acessar
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
            >
              Começar Agora
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-slate-600"
            aria-label="Menu"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 space-y-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileMenu(false)}
                    className="block py-3 text-base font-medium text-slate-600 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <hr className="border-slate-100 my-2" />
                <Link
                  href="/auth"
                  onClick={() => setMobileMenu(false)}
                  className="block py-3 text-base font-medium text-slate-600"
                >
                  Acessar
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setMobileMenu(false)}
                  className="block mt-2 text-center bg-slate-900 text-white font-semibold py-3 rounded-xl"
                >
                  Começar Agora
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 backdrop-blur-sm border border-slate-900/10 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Versão 5.0 — IA integrada
            </div>

            <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.9] text-slate-900 mb-8 uppercase">
              ESTÁ CANSADO DE <br />
              <span className="text-primary italic">PROCURAR MATERIAIS?</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-inter">
              A plataforma Desbrava Total une tecnologia e materiais oficiais
              para você focar no que importa:{" "}
              <span className="text-slate-900 font-bold">
                Salvar do Pecado e Guiar no Serviço.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
              <Link
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-primary/25"
              >
                Ver Planos
                <ChevronRight size={20} />
              </Link>
              <Link
                href="#funcionalidades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-900 font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-sm"
              >
                Explorar Ferramentas
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { label: "Classes Completas", value: "6" },
                { label: "Especialidades", value: "200+" },
                { label: "Material Oficial", value: "100%" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-xl shadow-slate-200/20"
                >
                  <p className="font-bebas text-7xl md:text-8xl text-[#FDB022] mb-4">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PLATFORM OFFERS ─── */}
      <section
        id="funcionalidades"
        className="py-24 md:py-32 px-5 md:px-8 bg-white border-t border-slate-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              Recursos Premium
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-wide text-slate-900 mb-6 uppercase">
              O QUE A PLATAFORMA <span className="text-[#FDB022]">OFERECE</span>
            </h2>
            <p className="text-lg text-slate-500 font-inter leading-relaxed">
              Tudo que você precisa para conduzir seu clube com excelência
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "TODAS as 6 classes",
                desc: "Conteúdo completo de Amigo a Guia com requisitos e materiais.",
                icon: Globe,
                color: "bg-blue-600",
              },
              {
                title: "+200 Especialidades",
                desc: "Materiais completos e organizados para todas as áreas.",
                icon: Monitor,
                color: "bg-purple-500",
              },
              {
                title: "Banco de Provas",
                desc: "Acesso total a provas e gabaritos oficiais DSA.",
                icon: BrainCircuit,
                color: "bg-green-500",
              },
              {
                title: "Dashboard Netflix",
                desc: "Interface moderna e intuitiva inspirada nos maiores sistemas.",
                icon: Zap,
                color: "bg-orange-500",
              },
              {
                title: "Certificados Automáticos",
                desc: "Gere certificados de conclusão com um único clique.",
                icon: CheckCircle2,
                color: "bg-primary",
              },
              {
                title: "Sistema de Gestão",
                desc: "Controle total de secretaria, membros e progresso do clube.",
                icon: Shield,
                color: "bg-slate-900",
              },
              {
                title: "Ferramentas Diretor",
                desc: "Recursos exclusivos para a gestão administrativa do clube.",
                icon: Shield,
                color: "bg-blue-900",
              },
              {
                title: "Ferramentas Líder",
                desc: "Materiais e controles para instrutores e líderes de classe.",
                icon: MessageCircle,
                color: "bg-blue-500",
              },
              {
                title: "Espaço Conselheiro",
                desc: "Acompanhamento direto da unidade e seus desbravadores.",
                icon: MessageCircle,
                color: "bg-indigo-500",
              },
              {
                title: "Gabaritos Oficiais",
                desc: "Respostas detalhadas para todas as provas e requisitos.",
                icon: Check,
                color: "bg-emerald-600",
              },
              {
                title: "Atualizações",
                desc: "Acesso garantido a todas as melhorias e novos materiais.",
                icon: ArrowRight,
                color: "bg-emerald-500",
              },
              {
                title: "Suporte Prioritário",
                desc: "Atendimento especializado para tirar todas as suas dúvidas.",
                icon: MessageCircle,
                color: "bg-red-500",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg",
                    feat.color,
                  )}
                >
                  <feat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-inter">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLASSES DOS DESBRAVADORES ─── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold mb-6 uppercase tracking-widest">
              6 Classes Disponíveis
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-wide text-slate-900 mb-6 uppercase">
              CLASSES DOS <span className="text-[#FDB022]">DESBRAVADORES</span>
            </h2>
            <p className="text-lg text-slate-500 font-inter leading-relaxed">
              Material completo para cada etapa da sua jornada
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                name: "Classe Amigo",
                desc: "Início da jornada desbravadora com fundamentos essenciais",
                color: "bg-[#2E90FA]",
                side: "left",
                specs: [
                  "Ordem Unida",
                  "Nós e Amarras",
                  "Primeiros Socorros Básico",
                  "Vida Cristã",
                  "Civismo",
                  "Natureza",
                ],
                checklist: [
                  "Material completo em PDF",
                  "Slides por especialidade",
                  "Provas oficiais",
                  "Gabaritos",
                  "Certificados digitais",
                ],
              },
              {
                name: "Classe Companheiro",
                desc: "Aprofundando conhecimentos e habilidades práticas",
                color: "bg-[#12B76A]",
                side: "right",
                specs: [
                  "Acampamento",
                  "Culinária",
                  "Excursionismo",
                  "Orientação",
                  "Arte de Contar Histórias",
                ],
                checklist: [
                  "Requisitos detalhados",
                  "Vídeos auxiliares",
                  "Fichas de acompanhamento",
                  "Sugestões de atividades",
                ],
              },
            ].map((cls, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col lg:flex-row items-stretch rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50",
                  cls.side === "right" && "lg:flex-row-reverse",
                )}
              >
                {/* Image/Color Side */}
                <div
                  className={cn(
                    "w-full lg:w-2/5 min-h-[300px] flex flex-center justify-center p-12 text-white relative",
                    cls.color,
                  )}
                >
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">
                      Classe
                    </span>
                    <h3 className="font-bebas text-5xl md:text-7xl uppercase tracking-wide">
                      {cls.name.replace("Classe ", "")}
                    </h3>
                  </div>
                </div>
                {/* Content Side */}
                <div className="flex-1 bg-white p-8 md:p-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold mb-4 uppercase tracking-widest">
                    Classe {i + 1} de 6
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">
                    {cls.name}
                  </h4>
                  <p className="text-slate-500 mb-8">{cls.desc}</p>

                  <div className="mb-8">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-4">
                      Especialidades Incluídas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cls.specs.map((spec, j) => (
                        <div
                          key={j}
                          className="px-4 py-2 rounded-full border border-slate-200 text-[11px] font-medium text-slate-600 bg-slate-50/50"
                        >
                          {spec}
                        </div>
                      ))}
                      <div className="px-4 py-2 rounded-full border border-orange-100 text-[11px] font-bold text-orange-500 bg-orange-50/50 italic">
                        E muito mais...
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                    {cls.checklist.map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                          <Check size={12} className="text-orange-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Link
                      href="#pricing"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
                    >
                      Ver planos
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── EXPERIENCE / TOOLS ─── */}
      <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-6 uppercase tracking-widest">
                Gestão Moderna
              </div>
              <h2 className="font-bebas text-5xl md:text-7xl tracking-wide text-slate-900 mb-8 uppercase leading-[0.95]">
                DASHBOARD ESTILO{" "}
                <span className="text-primary italic">NETFLIX</span>
              </h2>
              <p className="text-lg text-slate-500 font-inter mb-10 leading-relaxed">
                Nossa interface foi desenhada para ser intuitiva e rápida.
                Encontre tudo que precisa em segundos, com uma experiência
                visual premium.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  {
                    title: "Ferramentas para Diretor",
                    desc: "Visão 360º do clube e secretaria",
                  },
                  {
                    title: "Ferramentas para Líder",
                    desc: "Gestão de classes e acompanhamento",
                  },
                  {
                    title: "Ferramentas para Conselheiro",
                    desc: "Controle de frequência e tarefas",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="#pricing"
                className="inline-flex items-center gap-3 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
              >
                Começar agora o teste grátis
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <div className="bg-slate-900 rounded-[2.5rem] aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Dummy UI elements to represent Netflix style dashboard */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent p-8 flex flex-col justify-end">
                  <div className="w-2/3 h-4 bg-white/20 rounded-full mb-3" />
                  <div className="w-1/2 h-4 bg-white/10 rounded-full" />
                </div>
                <Zap
                  size={60}
                  className="text-primary animate-pulse"
                  fill="currentColor"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section id="pricing" className="py-24 md:py-32 px-5 md:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-widest">
              Planos e Investimento
            </p>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-wide text-slate-900 mb-6 uppercase">
              ESCOLHA O MELHOR PARA{" "}
              <span className="text-primary">SEU CLUBE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "bg-white rounded-[2.5rem] p-10 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200/50",
                  plan.popular &&
                    "border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/10",
                )}
              >
                <div className="mb-8">
                  <h3 className="font-bebas text-3xl text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-inter">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-2xl font-bold text-slate-900">R$</span>
                  <span className="font-bebas text-6xl text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 font-medium ml-2">/mês</span>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Check size={18} className="text-green-500" />
                      <span className="text-sm text-slate-600 font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.link}
                  className={cn(
                    "block w-full text-center py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg",
                    plan.popular
                      ? "bg-primary text-white hover:bg-red-700 shadow-primary/20"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10",
                  )}
                >
                  Escolher Plano
                </Link>
                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
                  Garantia de 7 dias • Pagamento Seguro
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-5">
          <h2 className="font-bebas text-4xl md:text-6xl text-white mb-8">
            PRONTO PARA REVOLUCIONAR O SEU CLUBE?
          </h2>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-3 bg-white text-primary font-bold px-12 py-6 rounded-2xl text-xl hover:bg-slate-50 transition-all shadow-2xl"
          >
            QUERO ACESSAR AGORA
            <ArrowRight size={24} />
          </Link>
          <p className="text-white/80 text-sm mt-6 font-medium">
            Junte-se a mais de 1.200 clubes em todo o Brasil.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl sm:text-6xl tracking-wide text-slate-900 uppercase">
              PERGUNTAS <span className="text-primary">FREQUENTES</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-slate-100 rounded-3xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-7 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "transition-transform",
                      openFaq === i && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50/50"
                    >
                      <p className="p-7 pt-0 text-slate-600 leading-relaxed">
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
              DESBRAVA <span className="text-primary">TOTAL</span>
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
                      ? "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
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
                    className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 hover:border-primary hover:text-primary transition-all bg-slate-50"
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
