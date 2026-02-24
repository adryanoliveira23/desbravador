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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState("");
  const [clubName, setClubName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
      className="min-h-screen flex overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a0505 0%, #0f0a0a 40%, #0a0a1a 100%)",
        }}
      >
        {/* Glow circles */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "rgba(217,45,32,0.25)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "rgba(100,30,200,0.12)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-4 z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #D92D20, #ff6b35)" }}
          >
            <Shield size={22} className="text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Desbrava<span style={{ color: "#D92D20" }}>Total</span>
          </span>
        </div>

        {/* Central Message */}
        <div className="z-10 space-y-8">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.3em] mb-6"
              style={{ color: "#D92D20" }}
            >
              Gestão de Excelência
            </p>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Seu clube,
              <br />
              <span style={{ color: "#D92D20" }}>seu legado.</span>
            </h2>
            <p className="text-white/50 font-medium text-lg leading-relaxed max-w-md">
              Centralize planejamento, classes, kits e inteligência artificial
              em uma única plataforma feita para líderes de Desbravadores.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "500+", label: "Clubes" },
              { value: "12k+", label: "Desbravadores" },
              { value: "98%", label: "Satisfação" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <p className="text-white/30 text-sm font-medium">
            Plataforma disponível 24/7
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Mobile glow */}
        <div
          className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full blur-[100px] pointer-events-none lg:hidden"
          style={{ background: "rgba(217,45,32,0.15)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] z-10"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #D92D20, #ff6b35)",
              }}
            >
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              Desbrava<span style={{ color: "#D92D20" }}>Total</span>
            </span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-3 leading-tight">
              {isLogin ? "Bem-vindo\nde volta" : "Criar sua\nconta"}
            </h1>
            <p className="text-white/40 font-medium">
              {isLogin
                ? "Acesse o painel do seu clube"
                : "Comece a gerenciar seu clube agora"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Name */}
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Seu nome completo"
                        className="w-full h-14 pl-11 pr-4 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none transition-all border focus:border-red-500/60"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>
                  </div>

                  {/* Club Name */}
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                      Nome do Clube
                    </label>
                    <div className="relative">
                      <Shield
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        required
                        placeholder="Ex: Luzeiros do Vale"
                        className="w-full h-14 pl-11 pr-4 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full h-14 pl-11 pr-4 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-14 pl-11 pr-12 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-4 rounded-2xl border text-sm font-bold"
                style={{
                  background: "rgba(217,45,32,0.1)",
                  border: "1px solid rgba(217,45,32,0.2)",
                  color: "#ff6b6b",
                }}
              >
                {error}
              </div>
            )}

            {/* Remember Me — só exibe no login */}
            {isLogin && (
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0"
                  style={{
                    background: rememberMe
                      ? "#D92D20"
                      : "rgba(255,255,255,0.05)",
                    border: rememberMe
                      ? "1px solid #D92D20"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Lembrar-me neste dispositivo
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{
                background: loading
                  ? "rgba(217,45,32,0.5)"
                  : "linear-gradient(135deg, #D92D20, #ff4d1c)",
                boxShadow: "0 8px 32px rgba(217,45,32,0.35)",
              }}
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  {isLogin ? "Entrar" : "Criar Conta"}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-8 text-white/30 text-sm font-medium">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="font-black transition-colors hover:text-white ml-1"
              style={{ color: "#D92D20" }}
            >
              {isLogin ? "Cadastre seu clube" : "Acesse agora"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
