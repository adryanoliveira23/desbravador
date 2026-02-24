"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, Download, Tag, Calendar, Zap } from "lucide-react";

const spreadsheets = [
  {
    id: 1,
    title: "Planilha de Controle Financeiro",
    category: "Secretaria",
    date: "Fev 2024",
    format: "XLSX",
  },
  {
    id: 2,
    title: "Lista de Presença Mensal",
    category: "Secretaria",
    date: "Jan 2024",
    format: "XLSX",
  },
  {
    id: 3,
    title: "Inventário de Patrimônio",
    category: "Logística",
    date: "Dez 2023",
    format: "XLSX",
  },
];

export default function PlanilhasPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Banco de <span className="text-primary italic">Planilhas</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Modelos prontos para facilitar a gestão do seu clube.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
            <Zap size={18} /> Sugerir Modelo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spreadsheets.map((sheet) => (
          <Card
            key={sheet.id}
            className="bg-white border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all p-8 group"
          >
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <FileSpreadsheet size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-4 h-14 line-clamp-2">
              {sheet.title}
            </h3>

            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Tag size={12} className="text-primary" /> {sheet.category}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar size={12} className="text-primary" /> {sheet.date}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 gap-2 font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            >
              <Download size={16} /> Baixar {sheet.format}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
