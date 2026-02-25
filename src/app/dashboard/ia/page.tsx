"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Bot,
  Sparkles,
  FileText,
  Calendar,
  Image as ImageIcon,
  Zap,
  Loader2,
  ChevronRight,
  Printer,
  X,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

async function callGenerateContent(prompt: string): Promise<string> {
  const res = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.result || data.error || "Erro desconhecido.";
}

async function callGenerateImage(prompt: string): Promise<string | null> {
  const res = await fetch("/api/ai/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.generationId || null;
}

async function callGetGeneratedImage(
  generationId: string,
): Promise<string | null> {
  const res = await fetch(`/api/ai/image-status?id=${generationId}`);
  const data = await res.json();
  return data.imageUrl || null;
}

const aiTools = [
  {
    id: "planner",
    title: "Planejador Mágico",
    desc: "Crie reuniões completas com objetivos, materiais e dinâmicas.",
    icon: Calendar,
    color: "bg-blue-50 text-blue-600",
    gradient: "from-blue-600 to-indigo-600",
    prompt:
      "Aja como um instrutor master de desbravadores. Crie um planejamento de reunião completo sobre [TEMA] para crianças de [IDADE] anos. Inclua: atividades, lista de materiais, dinâmica, objetivos, versículo do dia, horários e recomendações de segurança.",
  },
  {
    id: "kits",
    title: "Fábrica de Kits",
    desc: "Gere materiais pedagógicos, listas de compras e passos de atividades.",
    icon: Zap,
    color: "bg-orange-50 text-orange-600",
    gradient: "from-orange-600 to-red-600",
    prompt:
      "Crie um kit pedagógico completo para a especialidade/tema [TEMA]. Inclua lista de compras, passo a passo das atividades, frases de incentivo e sugestões de imagens para ilustrar.",
  },
  {
    id: "images",
    title: "Estúdio de Imagem",
    desc: "Crie caça-palavras, labirintos e atividades para colorir.",
    icon: ImageIcon,
    color: "bg-purple-50 text-purple-600",
    gradient: "from-purple-600 to-pink-600",
    prompt:
      "Descreva detalhadamente uma atividade visual de [TIPO] sobre o tema [TEMA] para ser gerada como imagem (colorir, labirinto, etc).",
  },
  {
    id: "certs",
    title: "Certificados Express",
    desc: "Gere textos ideais e personalizados para certificados e honras.",
    icon: Printer,
    color: "bg-green-50 text-green-600",
    gradient: "from-green-600 to-emerald-600",
    prompt:
      "Escreva um texto formal e inspirador para um certificado de conclusão da especialidade [TEMA] para o desbravador [NOME], citando a importância desta conquista.",
  },
  {
    id: "reports",
    title: "Corretor de Relatórios",
    desc: "Revise, resuma ou reescreva seus relatórios anuais e feedbacks.",
    icon: FileText,
    color: "bg-slate-50 text-slate-600",
    gradient: "from-slate-600 to-slate-900",
    prompt:
      "Revise e melhore o seguinte texto/relatório para torná-lo mais profissional e organizado: [TEXTO]",
  },
  {
    id: "quiz",
    title: "Quiz Builder",
    desc: "Crie quizzes e atividades interativas para testar o conhecimento dos Desbravadores.",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    gradient: "from-yellow-500 to-orange-500",
    prompt:
      "Crie um quiz divertido com 5 perguntas de múltipla escolha sobre [TEMA] para crianças de [IDADE] anos. Formato: numere cada pergunta, coloque 4 alternativas (a, b, c, d) e ao final uma seção GABARITO. Use linguagem simples e ânimo!",
  },
  {
    id: "helper",
    title: "Suporte Pedagógico",
    desc: "Chatbot especializado em classes, nós, versículos e comportamento de Desbravadores.",
    icon: Bot,
    color: "bg-primary/10 text-primary",
    gradient: "from-primary to-orange-500",
    prompt:
      "Você é um assistente especialista em Desbravadores (movimento juvenil Adventista). Responda de forma prática e inspiradora: [PERGUNTA]",
  },
];

export default function AIHelperPage() {
  const [activeTool, setActiveTool] = useState<(typeof aiTools)[number] | null>(
    null,
  );
  const [inputData, setInputData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const prompt = `Responda de forma prática e inspiradora à seguinte dúvida de um líder de Desbravadores: ${userMsg}`;
      const response = await callGenerateContent(prompt);
      setChatHistory((prev) => [...prev, { role: "ai", text: response }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Ocorreu um erro. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!activeTool || loading) return;

    setLoading(true);
    setResult("");
    setImageUrl(null);

    let finalPrompt = activeTool.prompt;

    // Substituir placeholders
    Object.keys(inputData).forEach((key) => {
      finalPrompt = finalPrompt.replace(
        `[${key.toUpperCase()}]`,
        inputData[key],
      );
    });

    if (activeTool.id === "images") {
      const generationId = await callGenerateImage(finalPrompt);
      if (generationId) {
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const url = await callGetGeneratedImage(generationId);
          if (url) {
            setImageUrl(url);
            setLoading(false);
            clearInterval(poll);
          } else if (attempts > 15) {
            setResult(
              "Erro: A geração da imagem demorou demais. Tente novamente.",
            );
            setLoading(false);
            clearInterval(poll);
          }
        }, 3000);
      } else {
        setResult("Erro ao iniciar geração de imagem.");
        setLoading(false);
      }
    } else {
      const output = await callGenerateContent(finalPrompt);
      setResult(output);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-4">
            <motion.span
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-primary to-orange-500 rounded-2xl text-white shadow-xl shadow-primary/20"
            >
              <Sparkles size={32} />
            </motion.span>
            Super <span className="text-primary italic">IA</span> do Clube
          </h1>
          <p className="text-slate-700 font-medium text-lg">
            Aumente a produtividade do seu clube com inteligência avançada.
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="px-6 py-3 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
            Créditos: Ilimitados (BETA)
          </div>
        </div>
      </div>

      {!activeTool ? (
        /* Tool Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ y: -5 }}
              onClick={() => {
                setActiveTool(tool);
                setResult("");
                setInputData({});
              }}
              className="group text-left"
            >
              <Card className="h-full bg-white border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300",
                    tool.color,
                  )}
                >
                  <tool.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors uppercase tracking-tighter">
                  {tool.title}
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
                  {tool.desc}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest pt-4 border-t border-slate-50">
                  Começar agora{" "}
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Card>
            </motion.button>
          ))}
        </div>
      ) : (
        /* Generator Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <button
              onClick={() => setActiveTool(null)}
              className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
            >
              <X size={16} /> Voltar para ferramentas
            </button>
            <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-900/5 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem]">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  activeTool.color,
                )}
              >
                <activeTool.icon size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                {activeTool.title}
              </h2>
              <p className="text-slate-700 font-medium mb-10">
                {activeTool.desc}
              </p>

              <div className="space-y-6">
                {activeTool.id === "planner" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                        Tema da Reunião
                      </label>
                      <Input
                        placeholder="Ex: Aves, Nós, Sobrevivência..."
                        value={inputData.tema || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, tema: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                        Idade do Público
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        value={inputData.idade || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, idade: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                  </>
                )}

                {activeTool.id === "kits" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                      Tema ou Especialidade
                    </label>
                    <Input
                      placeholder="Ex: Kit de Primeiros Socorros"
                      value={inputData.tema || ""}
                      onChange={(e) =>
                        setInputData({ ...inputData, tema: e.target.value })
                      }
                      className="h-14"
                    />
                  </div>
                )}

                {activeTool.id === "images" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Tipo de Atividade
                      </label>
                      <select
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold appearance-none cursor-pointer focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                        value={inputData.tipo || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, tipo: e.target.value })
                        }
                      >
                        <option value="">Selecione...</option>
                        <option value="Colorir">Colorir</option>
                        <option value="Labirinto">Labirinto</option>
                        <option value="Caça-Palavras">Caça-Palavras</option>
                        <option value="Conectar Pontos">Conectar Pontos</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Tema Visual
                      </label>
                      <Input
                        placeholder="Ex: Animais da Bíblia, Acampamento..."
                        value={inputData.tema || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, tema: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                  </>
                )}

                {activeTool.id === "certs" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Nome do Desbravador
                      </label>
                      <Input
                        placeholder="Ex: Lucas Silva"
                        value={inputData.nome || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, nome: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Especialidade/Honra
                      </label>
                      <Input
                        placeholder="Ex: Astronomia"
                        value={inputData.tema || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, tema: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                  </>
                )}

                {activeTool.id === "reports" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Seu relatório ou texto
                    </label>
                    <textarea
                      className="w-full min-h-[150px] bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                      value={inputData.texto || ""}
                      onChange={(e) =>
                        setInputData({ ...inputData, texto: e.target.value })
                      }
                      placeholder="Cole aqui o texto que deseja melhorar..."
                    />
                  </div>
                )}

                {activeTool.id === "quiz" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Tema do Quiz
                      </label>
                      <Input
                        placeholder="Ex: Animais da Bíblia, Nós e Amarras..."
                        value={inputData.tema || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, tema: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Faixa Etária
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 11"
                        value={inputData.idade || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, idade: e.target.value })
                        }
                        className="h-14"
                      />
                    </div>
                  </>
                )}

                {activeTool.id === "helper" && (
                  <div className="space-y-4">
                    <div className="h-[260px] overflow-y-auto space-y-3 bg-slate-50 rounded-3xl p-4 border border-slate-100">
                      {chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
                          <Bot size={36} className="text-slate-300" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Faça uma pergunta ao assistente
                          </p>
                        </div>
                      ) : (
                        chatHistory.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex gap-3 ${
                              msg.role === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm font-medium leading-relaxed ${
                                msg.role === "user"
                                  ? "bg-primary text-white rounded-br-none"
                                  : "bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        placeholder="Ex: Como ensinar nós para crianças?"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleChat();
                        }}
                      />
                      <Button
                        onClick={handleChat}
                        disabled={loading}
                        className="h-14 px-6 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Sparkles size={18} />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {activeTool.id !== "helper" && (
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={cn(
                      "w-full h-14 md:h-16 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all",
                      activeTool.gradient,
                    )}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Gerar com Inteligência"
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pl-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Resultado da Geração
              </h3>
              {result && (
                <button
                  onClick={() => window.print()}
                  className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-lg transition-all"
                >
                  <Printer size={14} /> Imprimir
                </button>
              )}
            </div>
            <Card className="flex-1 min-h-[500px] md:min-h-[600px] bg-slate-900 shadow-2xl shadow-slate-900/20 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>

              <div className="relative h-full overflow-y-auto custom-scrollbar pr-4 text-slate-300">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        Consultando o Oráculo
                      </p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Isso pode levar alguns segundos...
                      </p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="space-y-8 animate-in fade-in zoom-in duration-700">
                    <Image
                      src={imageUrl}
                      alt="IA Generated"
                      width={800}
                      height={800}
                      unoptimized
                      className="w-full rounded-[2rem] shadow-2xl border-4 border-white/10"
                    />
                    <div className="flex gap-4">
                      <Button className="flex-1 h-14 bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest gap-2">
                        <Download size={18} /> Baixar Atividade
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.print()}
                        className="flex-1 h-14 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest gap-2"
                      >
                        <Printer size={18} /> Imprimir
                      </Button>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex gap-3 mb-8">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                          Conteúdo Gerado
                        </p>
                        <p className="text-xs font-bold text-white uppercase italic">
                          Análise concluída com sucesso
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-lg leading-relaxed font-medium text-slate-100 whitespace-pre-wrap">
                        {result}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                    <Bot size={64} className="mb-6 text-slate-700" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">
                      Aguardando informações para processar...
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
