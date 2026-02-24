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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    color: "bg-blue-600",
    textColor: "text-blue-600",
    link: process.env.NEXT_PUBLIC_CAKTO_BOM_AVENTUREIRO || "#",
  },
  {
    name: "Só Desbravador",
    price: "25,90",
    description: "O favorito dos diretores",
    features: ["Especialidades Full", "Cantinho da IA", "Planejador", "Kits"],
    color: "bg-primary",
    textColor: "text-primary",
    popular: true,
    link: process.env.NEXT_PUBLIC_CAKTO_SO_DESBRAVADOR || "#",
  },
  {
    name: "Desbrava Total",
    price: "39,90",
    description: "Experiência completa",
    features: ["Tudo liberado", "IA Ilimitada", "Multi-Clubes", "Suporte VIP"],
    color: "bg-orange-500",
    textColor: "text-orange-500",
    link: process.env.NEXT_PUBLIC_CAKTO_DESBRAVA_TOTAL || "#",
  },
];

const features = [
  {
    title: "IA Especialista DSA",
    desc: "Crie roteiros e planos de aula baseados 100% nos manuais oficiais da Divisão Sul-Americana.",
    icon: Bot,
    color: "primary",
  },
  {
    title: "Gestão de Classes Pro",
    desc: "Controle de requisitos individual com visão de progresso em tempo real para a diretoria.",
    icon: Target,
    color: "blue",
  },
  {
    title: "Secretaria Automática",
    desc: "Certificados, atas e relatórios trimestrais gerados em PDF com apenas um clique.",
    icon: FileSpreadsheet,
    color: "green",
  },
  {
    title: "Banco de Especialidades",
    desc: "Acesso a requisitos e materiais de ensino para todas as especialidades vigentes.",
    icon: Award,
    color: "orange",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/10 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 p-6 px-4 md:px-12",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm"
            : "bg-transparent py-6",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-ex-bold text-xl tracking-tighter leading-none text-slate-900">
                DESBRAVA <span className="text-primary italic">TOTAL</span>
              </span>
              <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">
                Elite Management System
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {["Ferramentas", "Funcionalidades", "Preços", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-primary font-bold"
              >
                Acessar
              </Button>
            </Link>
            <Link href="#pricing">
              <Button className="shadow-lg shadow-primary/20 h-11 px-8 font-black uppercase tracking-wider hidden sm:flex">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 md:px-12 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -mr-40 -mt-40 -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full -ml-40 -mb-40 -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-2xl">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
              Lançamento: Versão 2.4 com IA Integrada
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-slate-900 uppercase">
              Está cansado de <br />{" "}
              <span className="text-primary italic">procurar matérias?</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed italic">
              A plataforma Desbrava Total une tecnologia de ponta aos manuais
              oficiais para você focar no que importa:{" "}
              <span className="text-slate-900 font-bold border-b-2 border-primary/20">
                Salvar do Pecado e Guiar no Serviço.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="#pricing">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg gap-4 font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(217,45,32,0.2)] hover:scale-105 transition-transform"
                >
                  Ver Planos <ChevronRight size={24} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clubes Ativos", value: "1.200+" },
            { label: "Metas Concluídas", value: "450k" },
            { label: "Minutos de IA", value: "85k+" },
            { label: "Satisfação", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-5xl font-black text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-6">
                A MÁQUINA DE <br />{" "}
                <span className="text-primary italic">RESULTADOS.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Cada ferramenta foi desenhada para resolver as dores reais de um
                diretor. Gestão não precisa ser chata.
              </p>
            </div>
            <Button
              variant="outline"
              className="h-14 px-8 border-2 border-slate-200"
            >
              Ver Todas as Features
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <Card
                key={i}
                className="group !p-0 bg-white border-2 border-slate-100 hover:border-primary transition-all duration-500 overflow-hidden shadow-sm"
              >
                <div className="p-10">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-slate-50 group-hover:scale-110 transition-transform",
                    )}
                  >
                    <feat.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    {feat.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium mb-8 italic text-sm">
                    {feat.desc}
                  </p>
                  <ArrowRight
                    className="text-slate-200 group-hover:text-primary transition-colors"
                    size={24}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - "Por que o Desbrava Total?" */}
      <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic leading-[0.9]">
              SEGURANÇA E <br />{" "}
              <span className="text-primary italic underline decoration-white/10 underline-offset-8">
                OFICIALISMO.
              </span>
            </h2>
            <div className="space-y-8">
              {[
                "Sempre atualizado com o Manual Administrativo da DSA.",
                "Hospedagem segura com proteção de dados de menores.",
                "Sincronização opcional com o SGC oficial.",
                "Acesso offline para acampamentos e atividades de campo.",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="text-primary shrink-0" size={24} />
                  <p className="text-lg text-slate-300 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg aspect-square bg-gradient-to-br from-primary to-orange-500 rounded-[3rem] p-[2px] shadow-3xl shadow-primary/20">
            <div className="w-full h-full bg-slate-900 rounded-[2.8rem] flex items-center justify-center p-12 text-center">
              <div>
                <Globe
                  size={80}
                  className="text-primary mb-8 mx-auto animate-pulse"
                />
                <h3 className="text-2xl font-black mb-4 italic">
                  Presente em 8 Países
                </h3>
                <p className="text-slate-400 font-medium">
                  Nossa plataforma já é o padrão de excelência para regionais e
                  distritais em toda a América do Sul.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="preços" className="py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase text-slate-900 italic leading-none">
              Investimento <span className="text-primary italic">Mensal.</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-black uppercase tracking-[0.3em] text-xs">
              Custo-benefício imbatível para o seu clube.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={cn(
                  "flex flex-col w-full !p-12 transition-all duration-500 bg-white border-2 relative",
                  plan.popular
                    ? "border-primary shadow-[0_30px_60px_rgba(217,45,32,0.15)] scale-105 z-10"
                    : "border-slate-200",
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] shadow-xl">
                    MAIS COMPLETO
                  </div>
                )}
                <div className="mb-12">
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-sm inline-block px-4 py-1.5 rounded-lg text-white",
                      plan.color,
                    )}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                      R$ {plan.price}
                    </span>
                    <span className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">
                      /mês
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-6 font-black uppercase italic tracking-widest">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-6 mb-16 flex-1 pt-8 border-t border-slate-50">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                          plan.color,
                        )}
                      >
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-sm text-slate-600 font-bold italic">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className={cn(
                      "w-full h-20 text-lg font-black uppercase tracking-widest transform transition-all active:scale-95",
                      plan.popular
                        ? "bg-primary hover:bg-red-700 shadow-xl shadow-primary/30"
                        : "bg-slate-900 hover:bg-black text-white",
                    )}
                  >
                    Assinar agora
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Ultra Focus */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-slate-50 border-4 border-slate-100 !p-16 md:!p-24 text-center relative rounded-[4rem]">
            <div className="absolute top-10 left-10 text-slate-100 -rotate-12">
              <Star size={120} />
            </div>
            <div className="absolute bottom-10 right-10 text-slate-100 rotate-12">
              <Zap size={120} />
            </div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-3xl animate-float">
                <MessageCircle size={48} className="text-white fill-current" />
              </div>
              <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic text-slate-900 leading-[0.9]">
                Dúvidas? <br />{" "}
                <span className="text-green-600 italic">Fale conosco.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-bold mb-16 max-w-lg mx-auto uppercase tracking-tighter italic leading-relaxed">
                NOSSO SUPORTE É HUMANO E ESPECIALISTA NO MINISTÉRIO DOS CLUBES.
              </p>
              <a
                href="https://wa.me/556699762785"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 h-24 px-16 text-2xl gap-6 font-black uppercase tracking-[0.1em] shadow-2xl shadow-green-500/30 rounded-full group"
                >
                  WhatsApp Oficial{" "}
                  <ArrowRight
                    size={32}
                    className="group-hover:translate-x-4 transition-transform"
                  />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-32 px-6 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-slate-900 italic">
              Perguntas <span className="text-primary italic">Frequentes.</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
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
            ].map((item, i) => (
              <motion.div
                initial={false}
                key={i}
                className="border-b-2 border-slate-200 pb-6"
              >
                <button className="flex justify-between items-center w-full text-left group">
                  <span className="text-xl font-black text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={24}
                    className="text-slate-300 group-hover:text-primary"
                  />
                </button>
                <p className="mt-4 text-slate-500 font-medium leading-relaxed italic">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Elite */}
      <footer className="py-24 bg-slate-900 text-white px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24 text-center md:text-left">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                <Zap size={32} className="text-primary fill-current" />
                <span className="font-ex-bold text-4xl tracking-tighter uppercase leading-none">
                  DESBRAVA <span className="text-primary italic">TOTAL</span>
                </span>
              </div>
              <p className="text-slate-400 text-lg max-w-sm mb-10 font-bold uppercase tracking-tighter italic mx-auto md:mx-0">
                A plataforma definitiva para quem leva o ministério de liderança
                a sério.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button
                  variant="ghost"
                  className="w-12 h-12 p-0 bg-white/5 hover:bg-primary transition-colors"
                >
                  <Globe size={20} />
                </Button>
                <Button
                  variant="ghost"
                  className="w-12 h-12 p-0 bg-white/5 hover:bg-primary transition-colors"
                >
                  <MessageCircle size={20} />
                </Button>
                <Button
                  variant="ghost"
                  className="w-12 h-12 p-0 bg-white/5 hover:bg-primary transition-colors"
                >
                  <Star size={20} />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-10">
                Explorar
              </h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-widest italic">
                {["Início", "Ferramentas", "Funcionalidades", "Preços"].map(
                  (l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        {l}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-10">
                Suporte
              </h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-widest italic">
                {[
                  "Central de Ajuda",
                  "WhatsApp Direto",
                  "Termos de Uso",
                  "Admin",
                ].map((l) => (
                  <li key={l}>
                    <Link
                      href={l === "Admin" ? "/admin" : "#"}
                      className="hover:text-primary transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
              © 2024 — DESBRAVA TOTAL. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                Feito com paixão pelo Ministério dos Clubes
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
