"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, Home, Settings, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface UserData {
  fullName?: string;
  name?: string;
  role?: string;
  clubName?: string;
  [key: string]: unknown;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar role={userData?.role} />
      </div>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72"
            >
              <Sidebar role={userData?.role} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Navbar */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between z-20 shrink-0 border-b border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Home size={12} className="text-slate-300" />
                <span>/</span>
                <span className="text-slate-500">{getBreadcrumb()}</span>
              </div>
              <h2 className="text-base md:text-xl font-bold text-slate-800 tracking-tight">
                Portal{" "}
                <span className="text-primary uppercase tracking-tighter">
                  Desbravadores
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Search - Desktop only */}
            <div className="relative group hidden xl:block">
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
              <button className="hidden sm:block p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                <Settings size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 cursor-pointer border-l border-slate-100 md:ml-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">
                  {userData?.fullName || "Carregando..."}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {userData?.role === "master_admin"
                    ? "Master Admin"
                    : "Diretor"}
                </span>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center p-[2px] shadow-sm border border-slate-200 shrink-0">
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
        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
