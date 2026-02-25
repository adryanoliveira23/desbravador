"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Save,
  Loader2,
  Crown,
  Shield,
  MapPin,
  Tent,
  Smile,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";

interface UserSettingsData {
  fullName?: string;
  clubName?: string;
  ministry?: string;
  plan?: string;
  id?: string;
  email?: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserSettingsData | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [clubName, setClubName] = useState("");
  const [ministry, setMinistry] = useState("desbravador");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFullName(data.fullName || "");
          setClubName(data.clubName || "");
          setMinistry(data.ministry || "desbravador");
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          fullName,
          clubName,
          ministry,
          updatedAt: new Date().toISOString(),
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Sincronizando seu perfil...
        </p>
      </div>
    );
  }

  const isPremium =
    userData?.plan === "premium" || userData?.plan === "desbrava_total";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          Minhas{" "}
          <span className="text-primary italic font-serif">Configurações</span>
        </h1>
        <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em]">
          Gerencie sua conta e preferências do portal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-8 bg-white border-slate-100 shadow-2xl shadow-slate-900/5 !p-8 md:!p-12 rounded-[2.5rem] md:rounded-[3.5rem]">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <User size={12} className="text-primary" /> Nome Completo
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="h-14 border-slate-200 focus:border-primary text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Tent size={12} className="text-primary" /> Nome do Clube
                </label>
                <Input
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Ex: Guerreiros do Delta"
                  className="h-14 border-slate-200 focus:border-primary text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Smile size={12} className="text-primary" /> Ministério
                  Principal
                </label>
                <select
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                >
                  <option value="desbravador">
                    DESBRAVADORES (10-15 anos)
                  </option>
                  <option value="aventureiro">AVENTUREIROS (6-9 anos)</option>
                </select>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 px-1">
                  * Isso altera as cores e o conteúdo do seu painel.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "w-full h-14 font-black uppercase tracking-widest shadow-2xl transition-all rounded-2xl md:rounded-3xl",
                  success
                    ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
                    : "shadow-primary/20",
                )}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : success ? (
                  "Perfil Atualizado!"
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} /> Salvar Alterações
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Plan / Info Card */}
        <div className="md:col-span-4 space-y-6">
          <Card className="bg-slate-900 text-white !p-8 border-none overflow-hidden relative rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
                  <Crown
                    className={cn(
                      isPremium ? "text-amber-400" : "text-slate-400",
                    )}
                    size={24}
                  />
                </div>
                {isPremium && (
                  <span className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg shadow-primary/20">
                    Premium Ativo
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">
                  Plano Atual
                </p>
                <h3 className="text-2xl font-black italic tracking-tighter">
                  {isPremium ? "Desbrava Total" : "Plano Gratuito"}
                </h3>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-[11px] font-bold text-white/60">
                  <Shield size={14} className="text-primary" />
                  ID:{" "}
                  <span className="text-white/30 truncate">
                    {userData?.id?.slice(0, 12)}...
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-white/60">
                  <MapPin size={14} className="text-primary" />
                  {userData?.email}
                </div>
              </div>

              {!isPremium && (
                <Button className="w-full bg-white text-slate-900 hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[10px] h-10 mt-4">
                  Fazer Upgrade
                </Button>
              )}
            </div>
          </Card>

          <Card className="bg-white border-slate-100 !p-6 rounded-[2rem] shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Suporte Técnico
            </h4>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                Precisa de ajuda com sua conta? Nossa equipe está pronta para
                auxiliar.
              </p>
              <Button
                variant="outline"
                className="w-full text-xs font-black uppercase tracking-widest border-slate-100 text-slate-600 hover:bg-slate-50"
              >
                Central de Ajuda
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
