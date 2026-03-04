"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState("");
  const [clubName, setClubName] = useState("");
  const [ministry, setMinistry] = useState<"desbravador" | "aventureiro">(
    "desbravador",
  );
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enviar o e-mail.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Definir persistência antes de autenticar
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name,
          email,
          role: "diretor",
          clubName,
          ministry,
          plan: ministry === "aventureiro" ? "bom_aventureiro" : "desbravador",
          createdAt: new Date().toISOString(),
        });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao autenticar.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden selection:bg-red-500/30"
      style={{ background: "#020617" }}
    >
      {/* Background Topographical Pattern (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="topo"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 100 Q 50 50 100 100 T 200 100"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M0 150 Q 50 100 100 150 T 200 150"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M0 50 Q 50 0 100 50 T 200 50"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-20 relative overflow-hidden border-r border-white/5"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%)",
        }}
      >
        {/* Subtle Accent Glow */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, #D92D20 0%, transparent 50%)",
            filter: "blur(120px)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-4 z-10">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-white shadow-xl">
            <Shield size={22} className="text-[#D92D20]" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Desbrava<span className="text-[#D92D20]">Total</span>
          </span>
        </div>

        {/* Central Message */}
        <div className="z-10 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20] animated-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                Gestão de Excelência
              </p>
            </div>
            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
              Seu clube,
              <br />
              <span className="text-[#D92D20]">seu legado.</span>
            </h2>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-sm">
              A plataforma definitiva para líderes que buscam excelência no
              ministério.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-12 pt-8 border-t border-white/5">
            {[
              { value: "500+", label: "Clubes" },
              { value: "12k+", label: "Líderes" },
              { value: "98%", label: "Eficiência" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div className="z-10 flex items-center gap-2 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-white text-xs font-medium uppercase tracking-widest">
            Sistemas Operacionais
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
              <Shield size={18} className="text-[#D92D20]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Desbrava<span className="text-[#D92D20]">Total</span>
            </span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {isLogin ? "Bem-vindo" : "Criar sua conta"}
            </h1>
            <p className="text-slate-400 font-medium">
              {isLogin
                ? "Acesse o sistema do seu clube para continuar"
                : "Junte-se a centenas de clubes em todo o país"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Nome Completo
                    </label>
                    <div className="relative group">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#D92D20]"
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nome do Diretor"
                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-[#D92D20]/50 focus:bg-white/[0.08]"
                      />
                    </div>
                  </div>

                  {/* Club Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Nome do Clube
                    </label>
                    <div className="relative group">
                      <Shield
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#D92D20]"
                      />
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        required
                        placeholder="Ex: Luzeiros"
                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-[#D92D20]/50 focus:bg-white/[0.08]"
                      />
                    </div>
                  </div>

                  {/* Ministry Selection */}
                  <div className="space-y-2 text-center lg:text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Ministério
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMinistry("aventureiro")}
                        className={cn(
                          "h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          ministry === "aventureiro"
                            ? "bg-[#D92D20] text-white shadow-lg shadow-red-900/20"
                            : "bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5",
                        )}
                      >
                        Aventureiro
                      </button>
                      <button
                        type="button"
                        onClick={() => setMinistry("desbravador")}
                        className={cn(
                          "h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          ministry === "desbravador"
                            ? "bg-slate-200 text-slate-900"
                            : "bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5",
                        )}
                      >
                        Desbravador
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#D92D20]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="diretor@exemplo.com"
                  className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-[#D92D20]/50 focus:bg-white/[0.08]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#D92D20]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-[#D92D20]/50 focus:bg-white/[0.08]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#D92D20] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between py-1">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 group outline-none"
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      rememberMe
                        ? "bg-[#D92D20] border-[#D92D20]"
                        : "border-white/10 group-hover:border-white/20",
                    )}
                  >
                    {rememberMe && <Shield size={10} className="text-white" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                    Manter Acesso
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-[10px] font-bold text-[#D92D20] uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  Esqueci a senha
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#D92D20] hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-[0] disabled:bg-slate-800 disabled:text-slate-600 shadow-lg shadow-red-950/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Acessar Painel" : "Cadastrar Clube"}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              {isLogin
                ? "Sua igreja ainda não tem o sistema?"
                : "Já possui um cadastro ativo?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#D92D20] font-bold hover:underline transition-all ml-1"
              >
                {isLogin ? "Criar meu clube agora" : "Voltar ao acesso"}
              </button>
            </p>
          </div>

          {/* Password Reset Overlay */}
          <AnimatePresence>
            {showReset && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020617]/95 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm bg-[#0f172a] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#D92D20]" />

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Redefinir Senha
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Enviaremos um link de recuperação para o seu endereço de
                    e-mail institucional.
                  </p>

                  {resetSuccess ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-green-500 text-xs font-bold text-center">
                          E-mail enviado com sucesso! Verifique sua caixa de
                          entrada.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowReset(false);
                          setResetSuccess(false);
                        }}
                        className="w-full h-12 bg-white text-slate-900 font-bold rounded-xl"
                      >
                        Entendido
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:border-[#D92D20]/50"
                      />
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowReset(false)}
                          className="flex-1 h-12 border border-white/10 text-white font-bold rounded-xl text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={resetLoading}
                          className="flex-1 h-12 bg-[#D92D20] text-white font-bold rounded-xl text-sm flex items-center justify-center"
                        >
                          {resetLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            "Enviar Link"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
