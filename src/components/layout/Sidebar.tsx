"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  FileSpreadsheet,
  Calendar,
  Settings,
  ShieldCheck,
  Zap,
  Package,
  LogOut,
  Library,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  premium?: boolean;
  secret?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
      {
        icon: Sparkles,
        label: "Cantinho da IA",
        href: "/dashboard/ia",
        premium: true,
      },
      { icon: Zap, label: "Classes", href: "/dashboard/classes" },
      {
        icon: Award,
        label: "Especialidades",
        href: "/dashboard/especialidades",
      },
    ],
  },
  {
    title: "GESTÃO",
    items: [
      { icon: Package, label: "Kits de Recursos", href: "/dashboard/kits" },
      {
        icon: Calendar,
        label: "Planejador Anual",
        href: "/dashboard/planejador",
      },
      {
        icon: ShieldCheck,
        label: "Certificados",
        href: "/dashboard/certificados",
      },
    ],
  },
  {
    title: "RECURSOS",
    items: [
      { icon: Library, label: "Livros e Manuais", href: "/dashboard/livros" },
      {
        icon: FileSpreadsheet,
        label: "Banco de Planilhas",
        href: "/dashboard/planilhas",
      },
      { icon: BookOpen, label: "Biblioteca", href: "/dashboard/biblioteca" },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      {
        icon: Settings,
        label: "Configurações",
        href: "/dashboard/configuracoes",
      },
      { icon: Users, label: "Console Admin", href: "/admin", secret: true },
    ],
  },
];

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut(auth);
  };

  const filteredSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.secret || role === "master_admin",
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 min-h-screen flex flex-col z-30 transition-all duration-300 overflow-hidden shrink-0 shadow-sm">
      {/* Brand Logo */}
      <div className="p-6 pb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center p-2 shadow-lg shadow-primary/20"
          >
            <Zap size={20} className="text-white fill-current" />
          </motion.div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight leading-none block">
              Desbravador
            </span>
            <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
              Portal de Gestão
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pt-6">
        {filteredSections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    <item.icon
                      size={18}
                      className={cn(
                        "transition-all duration-200",
                        isActive ? "text-white" : "group-hover:text-slate-900",
                      )}
                    />
                    <span className="text-sm font-bold tracking-tight">
                      {item.label}
                    </span>

                    {item.premium && !isActive && (
                      <span className="ml-auto text-[8px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        IA
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-white/20 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 mt-auto">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all group flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {role === "master_admin" ? "M" : "D"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {role === "master_admin" ? "Master Admin" : "Diretor"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Configurações
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-slate-400 hover:text-red-500 transition-all p-1.5"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
