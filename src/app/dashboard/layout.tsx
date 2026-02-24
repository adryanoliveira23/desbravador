"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, Home, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const docRef = doc(db, "users", fbUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return "Dashboard";
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      <Sidebar role={userData?.role} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Professional Navbar */}
        <header className="h-20 px-8 flex items-center justify-between z-20 shrink-0 border-b border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Home size={12} className="text-slate-300" />
              <span>/</span>
              <span className="text-slate-500">{getBreadcrumb()}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Portal{" "}
              <span className="text-primary uppercase tracking-tighter">
                Desbravadores
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative group hidden lg:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Busca inteligente..."
                className="w-72 h-10 bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                <Settings size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 pl-4 cursor-pointer border-l border-slate-100 ml-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">
                  {userData?.fullName || "Carregando..."}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {userData?.role === "master_admin"
                    ? "Master Admin"
                    : "Diretor"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center p-[2px] shadow-sm border border-slate-200">
                <div className="w-full h-full bg-white rounded-full overflow-hidden relative">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${userData?.name || "U"}&background=D92D20&color=fff&bold=true`}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
