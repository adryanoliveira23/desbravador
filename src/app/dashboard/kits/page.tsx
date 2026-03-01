"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Package,
  Plus,
  Tag,
  Trash2,
  Loader2,
  X,
  Sparkles,
  Zap,
  FileText,
  Printer,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Kit {
  id: string;
  name: string;
  category: string;
  status: string;
  items: number;
  alert?: boolean;
  imageUrl?: string;
  description?: string;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // User profile
  const [clubName, setClubName] = useState("");
  const [ministry, setMinistry] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Logística");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Customization State
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [config, setConfig] = useState({
    primaryColor: "#dc2626", // Default Red
    showImage: true,
    showHeader: true,
    showFooter: true,
  });

  useEffect(() => {
    const q = query(collection(db, "kits"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Kit, "id">),
      }));
      setKits(list);
      setLoading(false);
    });

    // Load user profile
    const authUnsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setClubName(data.clubName || "");
          setMinistry(
            data.ministry === "aventureiro" ? "Aventureiros" : "Desbravadores",
          );
        }
      }
    });

    return () => {
      unsubscribe();
      authUnsub();
    };
  }, []);

  const callGenerateImage = async (prompt: string) => {
    const res = await fetch("/api/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.generationId || null;
  };

  const callGetGeneratedImage = async (id: string) => {
    const res = await fetch(`/api/ai/image-status?id=${id}`);
    const data = await res.json();
    return data.imageUrl || null;
  };

  const handleGenerateAI = async () => {
    if (!name) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    setImageUrl(null);

    try {
      // 1. Iniciar Geração de Imagem em paralelo
      const imagePrompt = `Clean illustration of ${name} for Pathfinders, coloring book style, simple lines`;
      callGenerateImage(imagePrompt).then((genId) => {
        if (genId) {
          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            const url = await callGetGeneratedImage(genId);
            if (url) {
              setImageUrl(url);
              clearInterval(poll);
            } else if (attempts > 30) {
              clearInterval(poll);
            }
          }, 3000);
        }
      });

      // 2. Gerar Conteúdo de Texto
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Crie um kit completo para Desbravadores sobre o tema: ${name}. 
          Regras:
          1. Comece com um título chamativo.
          2. Liste os itens necessários usando marcadores (-).
          3. Dê uma explicação pedagógica curta.
          4. Adicione frases de incentivo.`,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setGeneratedContent(data.result);

        // Intelligent Category Detection
        const content = data.result.toLowerCase();
        if (
          content.includes("nós") ||
          content.includes("amarras") ||
          content.includes("pioneiria")
        ) {
          setCategory("Pioneiria");
        } else if (
          content.includes("primeiros socorros") ||
          content.includes("saúde") ||
          content.includes("higiene")
        ) {
          setCategory("Saúde");
        } else if (
          content.includes("bíblia") ||
          content.includes("espiritual") ||
          content.includes("versículo")
        ) {
          setCategory("Espiritual");
        } else if (
          content.includes("natureza") ||
          content.includes("animais") ||
          content.includes("plantas") ||
          content.includes("astronomia")
        ) {
          setCategory("Natureza");
        } else if (
          content.includes("acampamento") ||
          content.includes("fogo") ||
          content.includes("cozinha")
        ) {
          setCategory("Atividades ao Ar Livre");
        } else {
          setCategory("Geral");
        }
      }
    } catch (error) {
      console.error(error);
      setGeneratedContent("Erro ao gerar conteúdo via IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePDF = () => {
    const contentLines = generatedContent
      ? generatedContent
          .split("\n")
          .map((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
              const text = trimmed.replace(/^#+\s*/, "");
              return `<h2>${text}</h2>`;
            }
            if (trimmed.startsWith("# ")) {
              const text = trimmed.replace(/^#\s*/, "");
              return `<h1 class="main-title">${text}</h1>`;
            }
            if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
              const text = trimmed.replace(/^[-*]\s*/, "");
              // Bold text: **word** → <strong>word</strong>
              const formatted = text
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/_(.+?)_/g, "<em><u>$1</u></em>");
              return `<li>${formatted}</li>`;
            }
            if (trimmed === "") return "<br/>";
            // Normal paragraph
            const formatted = trimmed
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/_(.+?)_/g, "<u>$1</u>");
            return `<p>${formatted}</p>`;
          })
          .join("")
      : "<p>Sem conteúdo gerado.</p>";

    const imageHtml = imageUrl
      ? `<div style="text-align:center;margin:2rem 0;">
          <img src="${imageUrl}" alt="Ilustração do Kit" 
            style="max-width:100%;border-radius:1.5rem;border:2px solid #f1f5f9;box-shadow:0 4px 20px rgba(0,0,0,0.1);" />
        </div>`
      : "";

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8"/>
        <title>Kit de Atividades — ${name || "Desbravadores"}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', sans-serif;
            background: white;
            color: #1e293b;
            padding: 2.5cm 2.5cm 3cm;
            max-width: 900px;
            margin: 0 auto;
          }

          /* ── BORDER DECORATION ── */
          body::before {
            content: '';
            position: fixed;
            top: 12px; left: 12px; right: 12px; bottom: 12px;
            border: 3px solid ${config.primaryColor}20;
            border-radius: 12px;
            pointer-events: none;
            z-index: -1;
          }

          /* ── HEADER ── */
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 1.25rem;
            margin-bottom: 2rem;
          }
          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-badge {
            width: 56px; height: 56px;
            background: #dc2626;
            border-radius: 14px;
            color: white;
            font-size: 20px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: -1px;
          }
          .logo-text h1 {
            font-size: 20px;
            font-weight: 900;
            color: #dc2626;
            text-transform: uppercase;
            letter-spacing: -0.5px;
          }
          .logo-text p {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .header-right {
            text-align: right;
          }
          .header-right .kit-name {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
          }
          .header-right .kit-type {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          /* ── CONTENT ── */
          .content { line-height: 1.9; }
          .content .main-title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 1.5rem;
            text-decoration: underline;
            text-decoration-color: #dc2626;
            text-underline-offset: 6px;
          }
          .content h2 {
            font-size: 15px;
            font-weight: 900;
            color: #dc2626;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2.2rem 0 0.9rem;
            padding-left: 14px;
            border-left: 4px solid #dc2626;
          }
          .content p {
            font-size: 13px;
            color: #334155;
            margin-bottom: 0.9rem;
            text-align: justify;
          }
          .content li {
            font-size: 13px;
            color: #334155;
            margin-bottom: 0.5rem;
            padding-left: 1.6rem;
            position: relative;
            line-height: 1.7;
          }
          .content li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #dc2626;
            font-size: 12px;
            top: 2px;
          }
          .content strong { color: #0f172a; }
          .content u { text-decoration-color: #dc2626; text-decoration-thickness: 1.5px; }

          /* ── FOOTER ── */
          .footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .footer p {
            font-size: 9px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          /* ── DECORATIVE BADGE ── */
          .badge {
            display: inline-block;
            background: #fef2f2;
            color: #dc2626;
            border: 1.5px solid #fca5a5;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 4px 12px;
            margin-bottom: 1.5rem;
          }

          @media print {
            body::before { display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { padding: 1.8cm 2cm 2.5cm; }
          }
        </style>
      </head>
      <body>
        ${
          config.showHeader
            ? `
        <div class="header" style="border-bottom-color: ${config.primaryColor}">
          <div class="logo">
            <div class="logo-badge" style="background-color: ${config.primaryColor}">PB</div>
            <div class="logo-text">
              <h1 style="color: ${config.primaryColor}">${clubName || "Clube de Desbravadores"}</h1>
              <p>Ministério ${ministry || "Desbravadores"}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="kit-name">${name || "Kit de Atividades"}</div>
            <div class="kit-type">Material Pedagógico</div>
          </div>
        </div>
        `
            : ""
        }

        ${config.showImage ? imageHtml : ""}

        <div class="content">
          <style>
            .content h2 { border-left-color: ${config.primaryColor} !important; color: ${config.primaryColor} !important; }
            .content .main-title { text-decoration-color: ${config.primaryColor} !important; }
            .content li::before { color: ${config.primaryColor} !important; }
            .content u { text-decoration-color: ${config.primaryColor} !important; }
          </style>
          ${contentLines}
        </div>

        ${
          config.showFooter
            ? `
        <div class="footer">
          <p>${clubName || "Clube de Desbravadores"} — ${new Date().getFullYear()}</p>
          <p>Ministério ${ministry || "Desbravadores"}</p>
        </div>
        `
            : ""
        }

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=700");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleCreateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calcular número de itens baseado em linhas que começam com "-" ou números
    const itemLines = generatedContent
      ? generatedContent
          .split("\n")
          .filter((line) => /^[-*•\d+]/.test(line.trim()))
      : [];
    const itemCount = itemLines.length || 5; // Fallback se não detectar nada

    try {
      await addDoc(collection(db, "kits"), {
        name,
        category,
        status: "Completo",
        items: itemCount,
        description: generatedContent,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      });
      setShowModal(false);
      setName("");
      setGeneratedContent(null);
      setImageUrl(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKit = async (id: string) => {
    if (confirm("Deseja excluir este kit?")) {
      await deleteDoc(doc(db, "kits", id));
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Package size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
              Painel IA / Ferramentas
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">
              Portal{" "}
              <span className="text-primary uppercase tracking-tighter">
                Desbravadores
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <Plus size={20} />
          </button>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs uppercase">
              U
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">
                Diretor
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                Configurações
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ─── LEFT SIDE: CONFIG ─── */}
        <Card className="bg-white rounded-[3rem] p-12 border-none shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                FÁBRICA DE KITS
              </h2>
              <p className="text-slate-700 font-medium">
                Gere materiais pedagógicos, listas de compras e passos de
                atividades.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 block">
                Tema ou Especialidade
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Kit de Primeiros Socorros"
                className="h-16 bg-slate-50 border-none rounded-2xl px-6 text-lg font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating || !name}
              className="w-full h-16 md:h-20 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-lg md:text-xl uppercase tracking-widest rounded-2xl md:rounded-3xl shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Gerar"
              )}
            </Button>
          </div>
        </Card>

        {/* ─── RIGHT SIDE: RESULTS ─── */}
        <Card className="bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            {!generatedContent && !isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-600 mx-auto border border-slate-100 shadow-xl">
                  <Sparkles size={40} />
                </div>
                <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">
                  Aguardando sua ideia...
                </p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                  <Zap
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse"
                    size={32}
                  />
                </div>
                <div>
                  <p className="text-primary font-black uppercase text-sm tracking-widest mb-2">
                    Processando
                  </p>
                  <p className="text-slate-600 font-medium">
                    Consultando manuais oficiais da DSA...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full text-left overflow-y-auto custom-scrollbar pr-2"
              >
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none mb-1">
                        IA Concluída
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Conteúdo e Ilustração
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCustomizer(true)}
                      className="h-10 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-slate-50 transition-all"
                    >
                      <Printer size={14} /> Customizar e Imprimir
                    </button>
                    <Button
                      onClick={handleCreateKit}
                      disabled={isSubmitting}
                      className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Salvar Kit"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl"
                    >
                      <Image
                        src={imageUrl}
                        alt="Preview do Kit"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>
                  )}

                  <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="relative space-y-4">
                      {generatedContent?.split("\n").map((line, i) => (
                        <p
                          key={i}
                          className={cn(
                            "font-medium text-slate-600 leading-relaxed",
                            line.trim().startsWith("#")
                              ? "text-xl font-black text-slate-900 mt-6"
                              : line.trim().startsWith("-")
                                ? "pl-4 border-l-2 border-primary/20"
                                : "",
                          )}
                        >
                          {line.replace(/^#+\s*/, "").replace(/^-+\s*/, "• ")}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* HIDDEN PRINT AREA */}
                <div className="hidden print:block print-area">
                  <div className="print-border"></div>
                  <div className="print-header">
                    <div className="flex items-center gap-4">
                      <div className="print-logo bg-primary text-white p-2 rounded-xl flex items-center justify-center font-black">
                        PB
                      </div>
                      <div className="print-title">
                        <h1>Kit de Atividades</h1>
                        <p>Portal dos Desbravadores • 2026</p>
                      </div>
                    </div>
                  </div>

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Ilustração"
                      className="print-image"
                    />
                  )}

                  <div className="print-content">
                    {generatedContent?.split("\n").map((line, i) => {
                      if (line.trim().startsWith("#"))
                        return <h2 key={i}>{line.replace(/^#+\s*/, "")}</h2>;
                      return <p key={i}>{line.replace(/^-+\s*/, "• ")}</p>;
                    })}
                  </div>

                  <div className="print-footer">
                    Documento gerado por Inteligência Artificial para fins
                    pedagógicos. © Clube de Desbravadores - Ministério Jovem.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative gradients */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100/50 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
        </Card>
      </div>

      <div className="pt-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Meus <span className="text-primary italic">Kits Salvos</span>
          </h2>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Carregando inventário...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <Card
              key={kit.id}
              className="relative overflow-hidden group bg-white border-amber-50 hover:border-amber-200 transition-all shadow-lg hover:shadow-2xl shadow-amber-900/5 !p-8"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Package
                    size={28}
                    className="text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 ${
                      kit.alert
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {kit.status}
                  </span>
                  <button
                    onClick={() => handleDeleteKit(kit.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {kit.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-8 flex items-center gap-2">
                <Tag size={16} className="text-primary/60" /> {kit.category} •{" "}
                <span className="text-slate-900 font-bold">
                  {kit.items} itens
                </span>
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1 text-[10px] font-black uppercase h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl"
                >
                  Ver Itens
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-[10px] font-black uppercase h-11 border-blue-50 text-primary hover:bg-blue-50 rounded-xl"
                >
                  Editar
                </Button>
              </div>

              {kit.alert && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                  <div className="absolute top-[-25px] right-[-25px] w-12 h-12 bg-red-500/20 blur-xl"></div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Customizer Modal */}
      <Modal
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        title="Customizar Documento"
      >
        <div className="space-y-8">
          <p className="font-medium text-slate-500 text-sm">
            Escolha as cores e o que deseja incluir no seu documento antes de
            baixar.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cor Principal
              </label>
              <div className="flex flex-wrap gap-3">
                {["#dc2626", "#1e40af", "#166534", "#ea580c", "#6b21a8"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setConfig({ ...config, primaryColor: color })
                      }
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        config.primaryColor === color
                          ? "border-slate-900 scale-110 shadow-lg"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ),
                )}
                <div className="relative w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">
                    Incluir Imagem/Ilustração
                  </p>
                  <p className="text-xs text-slate-400">
                    Mostrar a imagem gerada pela IA.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig({ ...config, showImage: !config.showImage })
                  }
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    config.showImage ? "bg-primary" : "bg-slate-200",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      config.showImage ? "right-1" : "left-1",
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">
                    Mostrar Cabeçalho
                  </p>
                  <p className="text-xs text-slate-400">
                    Exibir logo e título do clube.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig({ ...config, showHeader: !config.showHeader })
                  }
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    config.showHeader ? "bg-primary" : "bg-slate-200",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      config.showHeader ? "right-1" : "left-1",
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">
                    Mostrar Rodapé
                  </p>
                  <p className="text-xs text-slate-400">
                    Exibir informações legais e ministério.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig({ ...config, showFooter: !config.showFooter })
                  }
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    config.showFooter ? "bg-primary" : "bg-slate-200",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      config.showFooter ? "right-1" : "left-1",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            onClick={() => {
              setShowCustomizer(false);
              setTimeout(() => handleSavePDF(), 300);
            }}
          >
            Confirmar e Baixar PDF
          </Button>
        </div>
      </Modal>

      {/* Modal Novo Kit */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white !p-10 rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Novo Kit de Materiais
              </h2>
              <form onSubmit={handleCreateKit} className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nome do Kit
                  </label>
                  <button
                    type="button"
                    onClick={() => window.open("/dashboard/ia", "_blank")}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Sparkles size={12} /> Sugerir com IA
                  </button>
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Kit de Primeiros Socorros"
                  required
                />
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="Logística">Logística</option>
                    <option value="Instrução">Instrução</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Cozinha">Cozinha</option>
                    <option value="Pioneiria">Pioneiria</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Espiritual">Espiritual</option>
                    <option value="Natureza">Natureza</option>
                    <option value="Atividades ao Ar Livre">
                      Atividades ao Ar Livre
                    </option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Criar Kit Manualmente"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
