"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Bot,
  Award,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Target,
  FileSpreadsheet,
  Star,
  ChevronDown,
  Globe,
  Check,
  Sparkles,
  Shield,
  Menu,
  X,
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
      "Gestão de Classes",
      "Materiais Base",
      "Suporte IA",
      "Certificados",
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
      "Especialidades Full",
      "Cantinho da IA",
      "Planejador",
      "Kits Prontos",
    ],
    gradient: "from-primary to-orange-500",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    popular: true,
    link: process.env.NEXT_PUBLIC_CAKTO_SO_DESBRAVADOR || "#",
  },
  {
    name: "Desbrava Total",
    price: "39,90",
    description: "Experiência completa",
    features: ["Tudo liberado", "IA Ilimitada", "Multi-Clubes", "Suporte VIP"],
    gradient: "from-orange-500 to-yellow-400",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    link: process.env.NEXT_PUBLIC_CAKTO_DESBRAVA_TOTAL || "#",
  },
];

const features = [
  {
    title: "IA Especialista DSA",
    desc: "Crie roteiros e planos de aula baseados 100% nos manuais oficiais da Divisão Sul-Americana.",
    icon: Bot,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Gestão de Classes Pro",
    desc: "Controle de requisitos individual com visão de progresso em tempo real para a diretoria.",
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Secretaria Automática",
    desc: "Certificados, atas e relatórios trimestrais gerados em PDF com apenas um clique.",
    icon: FileSpreadsheet,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Banco de Especialidades",
    desc: "Acesso a requisitos e materiais de ensino para todas as especialidades vigentes.",
    icon: Award,
    gradient: "from-orange-500 to-amber-500",
  },
];

const stats = [
  { label: "Clubes Ativos", value: "1.200+" },
  { label: "Metas Concluídas", value: "450k" },
  { label: "Minutos de IA", value: "85k+" },
  { label: "Satisfação", value: "99.9%" },
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
   COMPONENT
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
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-5 md:px-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Decorative gradient orbs */}
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-150px] w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/8 to-violet-500/8 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium mb-8 shadow-xl">
              <Sparkles size={14} className="text-amber-400" />
              Versão 2.4 — IA Integrada
            </div>

            {/* Title */}
            <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide leading-[0.95] text-slate-900 mb-6">
              ESTÁ CANSADO DE <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                PROCURAR MATÉRIAS?
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-inter">
              A plataforma Desbrava Total une tecnologia de ponta aos manuais
              oficiais para você focar no que importa:{" "}
              <span className="text-slate-900 font-semibold">
                Salvar do Pecado e Guiar no Serviço.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Ver Planos
                <ChevronRight size={20} />
              </Link>
              <Link
                href="#funcionalidades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-slate-50"
              >
                Explorar Ferramentas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-slate-100 bg-white py-10 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="font-bebas text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="funcionalidades" className="py-20 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="max-w-2xl mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
                Ferramentas
              </p>
              <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide text-slate-900 mb-5">
                TUDO QUE VOCÊ PRECISA,{" "}
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  NUM SÓ LUGAR.
                </span>
              </h2>
              <p className="text-base md:text-lg text-slate-500 font-inter leading-relaxed">
                Cada ferramenta foi desenhada para resolver as dores reais de um
                diretor. Gestão não precisa ser chata.
              </p>
            </motion.div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-7 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br text-white shadow-lg",
                    feat.gradient,
                  )}
                >
                  <feat.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-inter">
                  {feat.desc}
                </p>
                <ArrowRight
                  className="mt-4 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  size={18}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST / SEGURANÇA ─── */}
      <section className="py-20 md:py-32 px-5 md:px-8 bg-slate-950 text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
              Confiança
            </p>
            <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide mb-8 leading-[0.95]">
              SEGURANÇA E{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                OFICIALISMO.
              </span>
            </h2>
            <div className="space-y-5">
              {[
                "Sempre atualizado com o Manual Administrativo da DSA.",
                "Hospedagem segura com proteção de dados de menores.",
                "Sincronização opcional com o SGC oficial.",
                "Acesso offline para acampamentos e atividades de campo.",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-base text-slate-300 font-inter leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="font-bebas text-3xl md:text-4xl mb-3 tracking-wide">
                  PRESENTE EM 8 PAÍSES
                </h3>
                <p className="text-sm text-slate-400 font-inter leading-relaxed">
                  Nossa plataforma já é o padrão de excelência para regionais e
                  distritais em toda a América do Sul.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  {["🇧🇷", "🇦🇷", "🇨🇱", "🇵🇪", "🇨🇴"].map((flag, i) => (
                    <span key={i} className="text-2xl">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 md:py-32 px-5 md:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
              Planos
            </p>
            <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl tracking-wide text-slate-900 mb-4">
              INVESTIMENTO{" "}
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                MENSAL.
              </span>
            </h2>
            <p className="text-base text-slate-500 font-inter max-w-lg mx-auto">
              Custo-benefício imbatível para o seu clube. Cancele quando quiser.
            </p>
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={cn(
                  "relative bg-white rounded-2xl border transition-all duration-300",
                  plan.popular
                    ? "border-primary/30 shadow-2xl shadow-primary/10 md:scale-105 z-10"
                    : "border-slate-200 shadow-sm hover:shadow-lg hover:shadow-slate-200/50",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap">
                    ⭐ MAIS POPULAR
                  </div>
                )}

                <div className="p-7 md:p-8">
                  {/* Plan name */}
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    {plan.name}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-sm font-medium text-slate-400">
                      R$
                    </span>
                    <span className="font-bebas text-5xl md:text-6xl text-slate-900">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-7">
                    {plan.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 mb-6" />

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br",
                            plan.gradient,
                          )}
                        >
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-sm text-slate-600 font-inter">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block w-full text-center font-semibold py-3.5 rounded-xl transition-all text-sm",
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-red-600 hover:from-red-700 hover:to-red-700 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        : "bg-slate-900 hover:bg-slate-800 text-white",
                    )}
                  >
                    Assinar agora
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─── */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <MessageCircle size={32} className="text-white fill-current" />
              </div>
              <h2 className="font-bebas text-3xl sm:text-4xl md:text-6xl tracking-wide text-white mb-4">
                DÚVIDAS? <span className="text-green-400">FALE CONOSCO.</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base font-inter mb-8 max-w-md mx-auto leading-relaxed">
                Nosso suporte é humano e especialista no ministério dos clubes.
                Resposta rápida via WhatsApp.
              </p>
              <a
                href="https://wa.me/556699762785"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                WhatsApp Oficial
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 md:py-28 px-5 md:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
              Dúvidas
            </p>
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-slate-900">
              PERGUNTAS{" "}
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                FREQUENTES.
              </span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white border border-slate-200/80 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex justify-between items-center w-full text-left px-6 py-5 group"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-800 pr-4 group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-slate-400 transition-transform duration-300",
                      openFaq === i && "rotate-180 text-primary",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-slate-500 font-inter leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-white pt-16 pb-10 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Zap size={24} className="text-primary fill-current" />
                <span className="font-bebas text-2xl tracking-wide">
                  DESBRAVA <span className="text-primary">TOTAL</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 font-inter max-w-sm mb-6 leading-relaxed">
                A plataforma definitiva para quem leva o ministério de liderança
                a sério.
              </p>
              <div className="flex gap-2">
                {[Globe, MessageCircle, Star].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">
                Explorar
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Início", href: "#" },
                  { label: "Ferramentas", href: "#funcionalidades" },
                  { label: "Preços", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-inter"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">
                Suporte
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Central de Ajuda", href: "#" },
                  {
                    label: "WhatsApp Direto",
                    href: "https://wa.me/556699762785",
                  },
                  { label: "Termos de Uso", href: "#" },
                  { label: "Admin", href: "/admin" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-inter"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-slate-600">
              © 2024 — DESBRAVA TOTAL. Todos os direitos reservados.
            </p>
            <p className="text-xs text-slate-600">
              Feito com ❤️ pelo Ministério dos Clubes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
