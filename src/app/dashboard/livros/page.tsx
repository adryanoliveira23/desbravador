"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Library,
  Search,
  Download,
  FileText,
  BookOpen,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const books = [
  {
    id: 1,
    title: "Manual Administrativo",
    category: "Oficial",
    type: "PDF",
    size: "4.2 MB",
    status: "Disponível",
  },
  {
    id: 2,
    title: "Manual de Especialidades 2024",
    category: "Instrução",
    type: "PDF",
    size: "12.8 MB",
    status: "Disponível",
  },
  {
    id: 3,
    title: "Guia de Civismo",
    category: "Classes",
    type: "PDF",
    size: "1.5 MB",
    status: "Disponível",
  },
];

export default function LivrosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Livros e <span className="text-primary italic">Manuais</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Acesse a literatura oficial e guias de instrução.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar manuais..."
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card
            key={book.id}
            className="bg-white border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all p-8 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 bg-green-50 text-green-600 rounded-xl uppercase tracking-widest border border-green-100 flex items-center gap-2">
                <CheckCircle2 size={12} /> {book.status}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Filter size={14} /> {book.category}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <FileText size={14} /> {book.type} • {book.size}
              </div>
            </div>

            <Button className="w-full h-12 gap-2 font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800">
              <Download size={16} /> Download
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
