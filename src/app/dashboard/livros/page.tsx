"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Download,
  FileText,
  BookOpen,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const books = [
  // Drive Links
  {
    id: 1,
    title: "Manual Administrativo",
    category: "Oficial",
    type: "PDF (Drive)",
    size: "Online",
    status: "Disponível",
    url: "https://drive.google.com/file/d/0B3k7Xq0zAZm3YTZJSlRtTWp6czg/view?resourcekey=0-UYG7rIYrd3EGH3NXbb8PQg",
  },
  {
    id: 2,
    title: "Manual de Especialidades",
    category: "Instrução",
    type: "PDF (Drive)",
    size: "Online",
    status: "Disponível",
    url: "https://drive.google.com/file/d/0B3k7Xq0zAZm3MlVmNDNHOXg3Zzg/view?resourcekey=0-kBloUhVqGUkhez_5HqXxkg",
  },
  {
    id: 3,
    title: "Guia de Civismo",
    category: "Classes",
    type: "PDF (Drive)",
    size: "Online",
    status: "Disponível",
    url: "https://drive.google.com/file/d/0B3k7Xq0zAZm3VTRTSnZBRFZ3R1U/view?resourcekey=0-Lbci8mZ1JqGSPm7e66KrEA",
  },
  {
    id: 4,
    title: "Manual do Aventureiro",
    category: "Aventureiros",
    type: "PDF (Drive)",
    size: "Online",
    status: "Disponível",
    url: "https://drive.google.com/file/d/0B3k7Xq0zAZm3VlVjQmtfTWp0SkU/view?resourcekey=0-hPk7u5W-7E2_pXhG7-gUHg",
  },
  {
    id: 5,
    title: "Manual do Desbravador",
    category: "Desbravadores",
    type: "PDF (Drive)",
    size: "Online",
    status: "Disponível",
    url: "https://drive.google.com/file/d/0B3k7Xq0zAZm3YVJpYnVvSmJ3Rjg/view?resourcekey=0-x_N8_t5z8zP-4t0Y7d6Gzg",
  },
  // Local files
  {
    id: 6,
    title: "Guia do Aventureiro (Manual Oficial)",
    category: "Liderança",
    type: "PDF",
    size: "2.1 MB",
    status: "Sistema",
    url: "/books/Guia do Aventureiro (Manual Oficial da Liderança de Aventureiros).pdf",
  },
  {
    id: 7,
    title: "História dos Desbravadores",
    category: "Tradição",
    type: "PDF",
    size: "167 KB",
    status: "Sistema",
    url: "/books/HISTÓRIA DOS DESBRAVADORES.pdf",
  },
  {
    id: 8,
    title: "O Lenço do Desbravador",
    category: "Simbolismo",
    type: "PDF",
    size: "56 KB",
    status: "Sistema",
    url: "/books/O Lenço do Desbravador.pdf",
  },
  {
    id: 9,
    title: "Ranking Desbravadores Final",
    category: "Oficial",
    type: "PDF",
    size: "1.9 MB",
    status: "Sistema",
    url: "/books/RANKING DESBRAVADORES FINAL web.pdf",
  },
];

export default function LivrosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 md:pb-8 border-b border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            Acervo <span className="text-primary italic">Digital</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm md:text-base">
            Biblioteca oficial de manuais, guias e literatura institucional.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Pesquisar no acervo..."
            className="w-full h-14 md:h-16 bg-white border border-slate-100 rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold placeholder:text-slate-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="bg-white border-slate-100 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all p-6 md:p-8 group relative overflow-hidden flex flex-col h-full rounded-[2rem]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
                <BookOpen size={32} />
              </div>
              <span
                className={cn(
                  "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border flex items-center gap-1.5",
                  book.status === "Sistema"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-green-50 text-green-600 border-green-100",
                )}
              >
                <CheckCircle2 size={12} /> {book.status}
              </span>
            </div>

            <div className="flex-1 relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight italic uppercase">
                {book.title}
              </h3>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Filter size={12} /> {book.category}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <FileText size={12} /> {book.type}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 mt-auto relative z-10">
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button className="w-full h-14 gap-3 font-black uppercase tracking-[0.1em] text-xs bg-slate-900 hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all">
                  <Download size={18} />{" "}
                  {book.status === "Sistema"
                    ? "Baixar Arquivo"
                    : "Acessar no Drive"}
                </Button>
              </a>
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase mt-3 tracking-widest">
                Tamanho aproximado: {book.size}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
