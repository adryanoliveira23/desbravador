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
  deleteDoc,
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
  credits?: number;
  whatsapp?: string;
  createdAt?: string;
  ministry?: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [isCreating, setIsCreating] = useState(false);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editMinistry, setEditMinistry] = useState("");
  const [editCredits, setEditCredits] = useState(0);
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
        await deleteDoc(doc(db, "users", id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
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
    setEditPlan(user.plan || "free");
    setEditMinistry(user.ministry || "desbravador");
    setEditCredits(user.credits || 0);
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
        credits: Number(editCredits),
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
        plan: "free",
        credits: 10,
        ministry: "desbravador",
      });

      setShowModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      alert("Conta criada com sucesso!");
    } catch (error: unknown) {
      alert(
        "Erro ao criar conta: " +
          (error instanceof Error ? error.message : String(error)),
      );
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
                className="h-14 bg-white/5 border-white/10 text-white"
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
    <div className="min-h-screen bg-[#0c111d] text-white p-8 lg:p-12 overflow-x-hidden">
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
            <p className="text-white/40 font-medium">
              Monitoramento global e gestão de contas do Desbrava Total.
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="h-14 px-8 font-black uppercase tracking-widest gap-2"
          >
            <UserPlus size={20} /> Criar Nova Conta
          </Button>
        </div>

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
                  (u) => u.plan === "premium" || u.plan === "desbrava_total",
                )
                .length.toString(),
              icon: Crown,
              color: "text-amber-400",
              bg: "bg-amber-400/10",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="glass-card !p-8 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-black text-white">{stat.value}</h3>
              </div>
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </Card>
          ))}
        </div>

        {/* User Table */}
        <Card className="glass-card !p-0 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-black text-white px-2">
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
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-white/20"
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
                    Status / Créditos
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
                      className="hover:bg-white/[0.01] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="font-bold text-white text-md">
                          {u.fullName || u.clubName || "Usuário Sem Nome"}
                        </div>
                        <div className="text-xs text-white/40">
                          {u.clubName ? `${u.clubName} • ${u.email}` : u.email}
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
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            {u.ministry || "desbravador"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1.5">
                          <button
                            onClick={() =>
                              handleToggleStatus(u.id, u.status || "ativo")
                            }
                            className="flex items-center gap-2"
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
                                "text-[10px] font-bold uppercase tracking-widest",
                                u.status === "ativo"
                                  ? "text-green-500/60"
                                  : "text-red-500/60",
                              )}
                            >
                              {u.status || "ativo"}
                            </span>
                          </button>
                          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            {u.credits || 0} Créditos IA
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Editar Usuário"
                          >
                            <Settings size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={20} />
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
      </div>

      {/* Account Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card border-white/10 !p-10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-500"></div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                Nova <span className="text-primary italic">Conta</span>
              </h2>
              <p className="text-white/40 mb-8 text-sm font-medium">
                Informe os dados básicos para o registro inicial.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block pl-1">
                    Nome do Diretor
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Adryan dos Santos"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 text-white px-6 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block pl-1">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    placeholder="exemplo@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 text-white px-6 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block pl-1">
                    Senha Provisória
                  </label>
                  <Input
                    type="password"
                    placeholder="Min. 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 text-white px-6 font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block pl-1">
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="diretor" className="bg-[#0c111d]">
                        DIRETOR
                      </option>
                      <option value="admin" className="bg-[#0c111d]">
                        ADMIN
                      </option>
                      <option value="master_admin" className="bg-[#0c111d]">
                        MASTER
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block pl-1">
                      IA Créditos
                    </label>
                    <Input
                      type="number"
                      defaultValue="10"
                      className="h-14 bg-white/5 border-white/10 text-white px-6 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-14 text-white/40 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="flex-[2] h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    {isCreating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-white">
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
              className="relative w-full max-w-lg glass-card border-white/10 !p-10 rounded-[2.5rem] shadow-2xl z-50"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                Editar <span className="text-primary italic">Acesso</span>
              </h2>

              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                    Nome do Usuário
                  </label>
                  <Input
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 text-white px-4 font-bold"
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
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      <option value="free" className="bg-[#0c111d]">
                        FREE
                      </option>
                      <option value="desbrava_total" className="bg-[#0c111d]">
                        DESBRAVA TOTAL
                      </option>
                      <option value="premium" className="bg-[#0c111d]">
                        PREMIUM (Legacy)
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
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                    Créditos de IA Disponíveis
                  </label>
                  <Input
                    type="number"
                    value={editCredits}
                    onChange={(e) => setEditCredits(Number(e.target.value))}
                    className="h-12 bg-white/5 border-white/10 text-white px-4 font-bold"
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 h-14 text-white/40 hover:text-white"
                  >
                    Descartar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" />
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
