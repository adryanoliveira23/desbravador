"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
  X,
  Upload,
  Paperclip,
  Download,
  Printer,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // User Profile State
  const [clubName, setClubName] = useState("");
  const [ministry, setMinistry] = useState("");

  const config = {
    primaryColor: "#b91c1c", // Default Red
    showImage: true,
    showHeader: true,
    showFooter: true,
  };

  useEffect(() => {
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
    return () => authUnsub();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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

    if (activeTool.id === "images" || activeTool.id === "kits") {
      const isKit = activeTool.id === "kits";
      // Se for kit, o prompt original já pede sugestões de imagens.
      // Vamos tentar gerar uma imagem baseada no tema do kit se o usuário quiser.
      const imagePrompt = isKit
        ? `Educational activity for Pathfinders about ${inputData.tema}, coloring book style`
        : finalPrompt;

      const generationId = await callGenerateImage(imagePrompt);
      if (generationId) {
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const url = await callGetGeneratedImage(generationId);
          if (url) {
            setImageUrl(url);
            if (!isKit) setLoading(false); // No kit, a gente deixa o texto carregar também
            clearInterval(poll);
          } else if (attempts > 30) {
            if (!isKit) {
              setResult(
                "Erro: A geração da imagem demorou demais. Tente novamente.",
              );
              setLoading(false);
            }
            clearInterval(poll);
          }
        }, 3000);
      } else if (!isKit) {
        setResult("Erro ao iniciar geração de imagem.");
        setLoading(false);
      }

      if (isKit) {
        const output = await callGenerateContent(finalPrompt);
        setResult(output);
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
              <Card
                className={cn(
                  "h-full bg-white border-slate-100 hover:border-primary/30 shadow-md hover:shadow-2xl transition-all p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden border-b-4",
                  tool.color.replace("bg-", "border-b-").split(" ")[1],
                )}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, currentColor, transparent)`,
                  }}
                ></div>
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

                {activeTool.id === "reports" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Seu relatório ou texto
                      </label>
                      <textarea
                        className="w-full min-h-[150px] bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none placeholder:text-slate-300"
                        value={inputData.texto || ""}
                        onChange={(e) =>
                          setInputData({ ...inputData, texto: e.target.value })
                        }
                        placeholder="Cole aqui o texto que deseja melhorar..."
                      />
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        Upload de Documento (Opcional)
                      </label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-[2rem] p-8 text-center transition-all cursor-pointer hover:bg-slate-50",
                          selectedFile
                            ? "border-primary bg-primary/5"
                            : "border-slate-100",
                        )}
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-primary text-white rounded-full">
                              <Paperclip size={20} />
                            </div>
                            <p className="text-xs font-black text-slate-900 uppercase truncate max-w-full">
                              {selectedFile.name}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                              }}
                              className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                              <Upload size={24} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-slate-900 uppercase">
                                Clique para enviar
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">
                                JPG, PNG ou PDF até 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
                    {loading ? <Loader2 className="animate-spin" /> : "Gerar"}
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
              {(result || imageUrl) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-lg transition-all"
                  >
                    <Download size={14} /> Baixar em PDF
                  </button>
                </div>
              )}
            </div>
            <Card className="flex-1 min-h-[500px] md:min-h-[600px] bg-slate-900 shadow-2xl shadow-slate-900/20 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>

              <div className="relative h-full overflow-y-auto custom-scrollbar pr-4 text-slate-300">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                      <Sparkles
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse"
                        size={24}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        Gerando com Inteligência
                      </p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        Aguarde a finalização do processo...
                      </p>
                    </div>
                  </div>
                ) : result || imageUrl ? (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary shadow-lg">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                          Resultado Final
                        </p>
                        <p className="text-sm font-bold text-white uppercase italic">
                          Documento processado com sucesso
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {imageUrl && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl group"
                        >
                          <Image
                            src={imageUrl}
                            alt="IA Generated"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <p className="text-white text-xs font-bold uppercase tracking-widest">
                              Sugerido para: {inputData.tema || "Seu projeto"}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {result && (
                        <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-strong:text-secondary prose-code:text-secondary prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded prose-ul:border-l prose-ul:border-white/5 prose-ul:pl-6 prose-li:mb-2 text-slate-300">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {result}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* HIDDEN PRINT AREA */}
                    <div className="hidden print:block print-area">
                      <div
                        className="print-border"
                        style={{ borderColor: config.primaryColor + "20" }}
                      ></div>
                      {config.showHeader && (
                        <div
                          className="print-header"
                          style={{ borderBottomColor: config.primaryColor }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="print-logo text-white p-2 rounded-xl flex items-center justify-center font-black"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              PB
                            </div>
                            <div className="print-title">
                              <h1 style={{ color: config.primaryColor }}>
                                {clubName || "Portal dos Desbravadores"}
                              </h1>
                              <p>
                                Ministério {ministry || "Jovem"} •{" "}
                                {activeTool.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {imageUrl && config.showImage && (
                        <Image
                          src={imageUrl}
                          alt="Ilustração"
                          width={800}
                          height={600}
                          unoptimized
                          className="print-image"
                        />
                      )}

                      <div className="print-content">
                        <style>{`
                          .print-content h2 { border-left-color: ${config.primaryColor} !important; }
                        `}</style>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {result}
                        </ReactMarkdown>
                      </div>

                      {config.showFooter && (
                        <div className="print-footer">
                          Este documento foi gerado via Inteligência Artificial
                          no Portal dos Desbravadores. Ministério{" "}
                          {ministry || "Jovem"}.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-700 shadow-inner">
                      <Bot size={56} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
                        Sistema em Espera
                      </p>
                      <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">
                        Selecione uma ferramenta para começar
                      </p>
                    </div>
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
