"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  Search,
  UserPlus,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Settings,
  Crown,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Mail,
  User,
  Key,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface AdminUser {
  id: string;
  fullName?: string;
  clubName?: string;
  email?: string;
  plan?: string;
  status?: string;
  role?: string;
  whatsapp?: string;
  createdAt?: string;
  ministry?: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "analytics">("users");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Creation State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [newRole, setNewRole] = useState("diretor");
  const [newPlan, setNewPlan] = useState("bom_aventureiro");
  const [newMinistry, setNewMinistry] = useState("desbravador");
  const [isCreating, setIsCreating] = useState(false);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editMinistry, setEditMinistry] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const uList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as AdminUser[];
        setUsers(uList);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Adiel&Adryan2026@!") {
      setIsAuthenticated(true);
    } else {
      alert("Senha administrativa incorreta!");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (
      confirm(
        "Tem certeza que deseja excluir este usuário? Esta ação é irreversível no banco de dados.",
      )
    ) {
      try {
        const res = await fetch("/api/admin/delete-user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: id }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao deletar usuário.");
        }
        alert("Usuário excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert(
          "Erro ao deletar: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "suspenso" : "ativo";
    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName || "");
    setEditPlan(user.plan || "bom_aventureiro");
    setEditMinistry(user.ministry || "desbravador");
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        fullName: editFullName,
        plan: editPlan,
        ministry: editMinistry,
      });
      setShowEditModal(false);
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: newName,
        email: newEmail,
        role: newRole,
        status: "ativo",
        createdAt: new Date().toISOString(),
        plan: newPlan,
        ministry: newMinistry,
      });

      setShowModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      alert("Conta criada com sucesso!");
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;

      // Usuário existe no Auth mas foi removido do Firestore — recupera o documento
      if (code === "auth/email-already-in-use") {
        const confirm_ = confirm(
          `O e-mail "${newEmail}" já existe no sistema mas sem perfil ativo.\n\nDeseja restaurar a conta com os dados preenchidos?`,
        );
        if (confirm_) {
          try {
            const res = await fetch("/api/admin/recover-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: newEmail,
                fullName: newName,
                role: newRole,
                plan: newPlan,
                ministry: newMinistry,
              }),
            });
            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error);
            }
            setShowModal(false);
            setNewName("");
            setNewEmail("");
            setNewPassword("");
            alert(
              "Conta restaurada com sucesso! O usuário já pode acessar o sistema.",
            );
          } catch (recoverErr) {
            alert(
              "Erro ao restaurar conta: " +
                (recoverErr instanceof Error
                  ? recoverErr.message
                  : String(recoverErr)),
            );
          }
        }
      } else {
        alert(
          "Erro ao criar conta: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0c111d] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="w-full max-w-md glass-card border-white/10 !p-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                <Lock size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tight">
              Acesso Restrito
            </h1>
            <p className="text-white/40 text-center mb-8 text-sm font-medium">
              Digite a senha mestra para acessar o Desbrava Total Admin.
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha de Administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 !bg-white/5 !border-white/10 !text-white !placeholder-white/20"
              />
              <Button
                type="submit"
                className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                Acessar Console
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0c111d] text-white p-8 lg:p-12 overflow-x-hidden italic">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-primary rounded-xl text-white shadow-lg">
                <ShieldAlert size={20} />
              </span>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Console <span className="text-primary italic">Admin.</span>
              </h1>
            </div>
            <p className="text-white/40 font-medium italic">
              Gestão estratégica e análise de retenção Desbrava Total.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 p-1 rounded-2xl flex border border-white/10">
              <button
                onClick={() => setActiveTab("users")}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                  activeTab === "users"
                    ? "bg-primary text-white shadow-lg"
                    : "text-white/40 hover:text-white",
                )}
              >
                <Users size={16} /> Usuários
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                  activeTab === "analytics"
                    ? "bg-primary text-white shadow-lg"
                    : "text-white/40 hover:text-white",
                )}
              >
                <BarChart3 size={16} /> Analytics
              </button>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="h-14 px-8 font-black uppercase tracking-widest gap-2 bg-gradient-to-r from-primary to-orange-600 border-none shadow-xl shadow-primary/20"
            >
              <UserPlus size={20} /> Novo Usuário
            </Button>
          </div>
        </div>

        {activeTab === "users" ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Total de Clubes",
                  value: users.length.toString(),
                  icon: Users,
                  color: "text-blue-400",
                  bg: "bg-blue-400/10",
                },
                {
                  label: "Usuários Ativos",
                  value: users
                    .filter((u) => u.status === "ativo")
                    .length.toString(),
                  icon: Zap,
                  color: "text-green-400",
                  bg: "bg-green-400/10",
                },
                {
                  label: "Total Premium",
                  value: users
                    .filter(
                      (u) =>
                        u.plan === "premium" || u.plan === "desbrava_total",
                    )
                    .length.toString(),
                  icon: Crown,
                  color: "text-amber-400",
                  bg: "bg-amber-400/10",
                },
              ].map((stat, i) => (
                <Card
                  key={i}
                  className="glass-card !p-8 flex items-center justify-between border-white/5"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
                      {stat.label}
                    </p>
                    <h3 className="text-4xl font-black text-white">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={cn("p-4 rounded-2xl", stat.bg)}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                </Card>
              ))}
            </div>

            {/* User Table */}
            <Card className="glass-card !p-0 overflow-hidden border-white/5">
              <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-black text-white px-2 uppercase tracking-tight italic">
                  Monitoramento de Usuários
                </h3>
                <div className="relative w-full max-w-md">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar clube ou diretor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold placeholder:text-white/20 text-white"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">
                        Clube / Diretor
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">
                        Plano / Ministério
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">
                        Status
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="premium-table">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <Loader2
                            className="animate-spin mx-auto text-primary"
                            size={32}
                          />
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest"
                        >
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, i) => (
                        <tr
                          key={i}
                          className="hover:bg-white/[0.01] transition-colors group border-b border-white/5 last:border-0"
                        >
                          <td className="px-8 py-5">
                            <div className="font-bold text-white text-md">
                              {u.fullName || u.clubName || "Usuário Sem Nome"}
                            </div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                              {u.clubName
                                ? `${u.clubName} • ${u.email}`
                                : u.email}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col gap-1.5">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                                  u.plan === "premium" ||
                                    u.plan === "desbrava_total"
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-white/5 border-white/10 text-white/40",
                                )}
                              >
                                {u.plan === "desbrava_total"
                                  ? "DESBRAVA TOTAL"
                                  : u.plan?.toUpperCase() || "FREE"}
                              </span>
                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest italic">
                                {u.ministry || "desbravador"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button
                              onClick={() =>
                                handleToggleStatus(u.id, u.status || "ativo")
                              }
                              className="flex items-center gap-2 group/status"
                            >
                              {u.status === "ativo" ? (
                                <CheckCircle2
                                  size={14}
                                  className="text-green-500"
                                />
                              ) : (
                                <XCircle size={14} className="text-red-500" />
                              )}
                              <span
                                className={cn(
                                  "text-[10px] font-black uppercase tracking-widest transition-all",
                                  u.status === "ativo"
                                    ? "text-green-500/60 group-hover/status:text-green-500"
                                    : "text-red-500/60 group-hover/status:text-red-500",
                                )}
                              >
                                {u.status || "ativo"}
                              </span>
                            </button>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditClick(u)}
                                className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                title="Editar Usuário"
                              >
                                <Settings size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Retention Overview */}
            <div className="md:col-span-8 space-y-8">
              <Card className="glass-card border-white/5 !p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
                    <Activity size={20} className="text-primary" /> Fluxo de
                    Retenção
                  </h3>
                  <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                      +12.5% este mês
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "Dashboard Principal",
                      retention: 92,
                      status: "high",
                      desc: "Ponto de maior engajamento diário.",
                    },
                    {
                      label: "Cantinho da IA",
                      retention: 78,
                      status: "high",
                      desc: "Uso recorrente para criação de materiais.",
                    },
                    {
                      label: "Especialidades",
                      retention: 65,
                      status: "medium",
                      desc: "Consultas frequentes nos finais de semana.",
                    },
                    {
                      label: "Planejador Anual",
                      retention: 34,
                      status: "low",
                      desc: "Baixa taxa de retorno após a primeira configuração.",
                    },
                    {
                      label: "Kits e Patrimônio",
                      retention: 15,
                      status: "low",
                      desc: "Uso esporádico. Requer incentivos visuais.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex gap-4 items-center">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                            item.retention > 70
                              ? "bg-green-500/10 text-green-500"
                              : item.retention > 30
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500",
                          )}
                        >
                          {item.retention > 70 ? (
                            <TrendingUp size={20} />
                          ) : (
                            <TrendingDown size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-white text-sm uppercase italic">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-white/40 font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white italic">
                          {item.retention}%
                        </p>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                          RETENÇÃO
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Side Stats */}
            <div className="md:col-span-4 space-y-6">
              <Card className="bg-primary !p-8 border-none rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-4">
                  Insight Estratégico
                </h4>
                <p className="text-lg font-bold text-white leading-tight mb-8">
                  Usuários que utilizam a <span className="italic">IA</span> nos
                  primeiros 3 dias têm retenção 3x maior.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl shadow-xl">
                  Gerar Relatório Completo
                </Button>
              </Card>

              <Card className="glass-card border-white/5 !p-8">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">
                  Dispositivos de Acesso
                </h4>
                <div className="space-y-5">
                  {[
                    { label: "Mobile", value: 68, color: "bg-primary" },
                    { label: "Desktop", value: 28, color: "bg-blue-500" },
                    { label: "Tablet", value: 4, color: "bg-slate-500" },
                  ].map((device) => (
                    <div key={device.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-white/60 italic">
                        <span>{device.label}</span>
                        <span>{device.value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.value}%` }}
                          className={cn("h-full rounded-full", device.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Account Creation Modal - REDESIGNED */}
      <AnimatePresence mode="wait">
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              {/* Left Accent */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />

              <div className="flex h-full">
                {/* Content Side */}
                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                        Nova <span className="text-primary italic">Conta</span>
                      </h2>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                        Registro de Acesso Administrativo
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-8">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                          <User size={12} /> Nome Completo
                        </label>
                        <Input
                          placeholder="Ex: Adryan Santos"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="h-12 !bg-white/5 !border-white/10 !text-white px-4 font-bold !placeholder-white/20 italic rounded-xl focus:!border-primary/50 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Mail size={12} /> E-mail Institucional
                        </label>
                        <Input
                          type="email"
                          placeholder="diretoria@clube.com"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="h-12 !bg-white/5 !border-white/10 !text-white px-4 font-bold !placeholder-white/20 italic rounded-xl focus:!border-primary/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Key size={12} /> Senha
                      </label>
                      <Input
                        type="password"
                        placeholder="Mínimo de 8 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 !bg-white/5 !border-white/10 !text-white px-4 font-bold !placeholder-white/20 italic rounded-xl focus:!border-primary/50 transition-all"
                        required
                      />
                    </div>

                    {/* Meta Data Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                          Nível de Acesso
                        </label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer italic"
                        >
                          <option value="diretor" className="bg-[#0f172a]">
                            DIRETOR
                          </option>
                          <option value="admin" className="bg-[#0f172a]">
                            ADMIN
                          </option>
                          <option value="master_admin" className="bg-[#0f172a]">
                            MASTER
                          </option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                          Círculo Ministerial
                        </label>
                        <select
                          value={newMinistry}
                          onChange={(e) => setNewMinistry(e.target.value)}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer italic"
                        >
                          <option value="desbravador" className="bg-[#0f172a]">
                            DESBRAVADOR
                          </option>
                          <option value="aventureiro" className="bg-[#0f172a]">
                            AVENTUREIRO
                          </option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                          Assinatura Inicial
                        </label>
                        <select
                          value={newPlan}
                          onChange={(e) => setNewPlan(e.target.value)}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer italic"
                        >
                          <option
                            value="bom_aventureiro"
                            className="bg-[#0f172a]"
                          >
                            BOM AVENTUREIRO
                          </option>
                          <option value="desbravador" className="bg-[#0f172a]">
                            DESBRAVADOR
                          </option>
                          <option
                            value="desbrava_total"
                            className="bg-[#0f172a]"
                          >
                            DESBRAVA TOTAL
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                      >
                        Descartar Registro
                      </button>
                      <Button
                        type="submit"
                        disabled={isCreating}
                        className="h-14 px-10 bg-white text-slate-900 hover:bg-slate-100 font-extrabold uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-2xl transition-all active:scale-95"
                      >
                        {isCreating ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            Finalizar Criação <ArrowRight size={18} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-white">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card border-white/10 !p-10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight italic">
                Editar <span className="text-primary italic">Acesso</span>
              </h2>

              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                    Nome do Diretor
                  </label>
                  <Input
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="h-12 !bg-white/5 !border-white/10 !text-white px-4 font-bold !placeholder-white/20 italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                      Plano
                    </label>
                    <select
                      value={editPlan}
                      onChange={(e) => setEditPlan(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none italic"
                    >
                      <option value="bom_aventureiro" className="bg-[#0c111d]">
                        BOM AVENTUREIRO
                      </option>
                      <option value="desbravador" className="bg-[#0c111d]">
                        DESBRAVADOR
                      </option>
                      <option value="desbrava_total" className="bg-[#0c111d]">
                        DESBRAVA TOTAL
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                      Ministério
                    </label>
                    <select
                      value={editMinistry}
                      onChange={(e) => setEditMinistry(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none italic"
                    >
                      <option value="desbravador" className="bg-[#0c111d]">
                        DESBRAVADOR
                      </option>
                      <option value="aventureiro" className="bg-[#0c111d]">
                        AVENTUREIRO
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 h-14 text-white/40 hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl"
                  >
                    Descartar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Salvar Mudanças"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
