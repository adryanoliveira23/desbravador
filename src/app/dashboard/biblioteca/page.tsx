"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Eye, FileSpreadsheet, Book } from "lucide-react";
import { cn } from "@/lib/utils";

const documents = [
  {
    title: "Manual Administrativo 2024",
    type: "PDF",
    size: "4.2 MB",
    category: "Oficial",
  },
  {
    title: "Guia de Uniformes",
    type: "PDF",
    size: "2.8 MB",
    category: "Oficial",
  },
  {
    title: "Planilha de Frequência",
    type: "XLSX",
    size: "1.2 MB",
    category: "Planilhas",
  },
  {
    title: "Relatório Mensal Trimestre",
    type: "DOCX",
    size: "850 KB",
    category: "Modelos",
  },
  {
    title: "Livro do Ano 2024",
    type: "EPUB",
    size: "12.5 MB",
    category: "Biblioteca",
  },
  {
    title: "Apostila Especialidade Astronomia",
    type: "PDF",
    size: "5.1 MB",
    category: "Material Apoio",
  },
];

export default function LibraryPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Biblioteca <span className="text-primary italic">& Planilhas</span>
        </h1>
        <p className="text-slate-600 font-medium">
          Acesse materiais oficiais, modelos de relatórios e documentos do
          clube.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-2">
          <Card className="!p-6 border-slate-100 shadow-xl shadow-slate-900/5 rounded-3xl sticky top-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-6">
              Categorias
            </h3>
            <div className="space-y-1">
              {[
                "Todos Arquivos",
                "Documentos Oficiais",
                "Planilhas de Apoio",
                "Livros & Apostilas",
                "Modelos Úteis",
              ].map((cat, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    i === 0
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>
        </aside>

        <main className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc, i) => (
            <Card
              key={i}
              className="flex flex-col justify-between group border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 !p-8 rounded-[2.5rem] bg-white"
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={cn(
                      "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 duration-300",
                      doc.type === "PDF"
                        ? "bg-red-50 text-red-500 shadow-red-500/5"
                        : doc.type === "XLSX"
                          ? "bg-green-50 text-green-500 shadow-green-500/5"
                          : doc.type === "DOCX"
                            ? "bg-blue-50 text-blue-500 shadow-blue-500/5"
                            : "bg-purple-50 text-purple-500 shadow-purple-500/5",
                    )}
                  >
                    {doc.type === "PDF" && <FileText size={32} />}
                    {doc.type === "XLSX" && <FileSpreadsheet size={32} />}
                    {doc.type === "DOCX" && <Book size={32} />}
                    {doc.type === "EPUB" && <Book size={32} />}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                      {doc.size}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight italic">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        doc.type === "PDF"
                          ? "bg-red-500"
                          : doc.type === "XLSX"
                            ? "bg-green-500"
                            : "bg-blue-500",
                      )}
                    ></span>
                    {doc.category} • {doc.type}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                >
                  <Eye size={16} /> Ver
                </Button>
                <Button className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
                  <Download size={16} /> Baixar
                </Button>
              </div>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}
