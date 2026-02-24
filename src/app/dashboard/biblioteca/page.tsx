"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Eye, FileSpreadsheet, Book } from "lucide-react";

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
        <h1 className="text-3xl font-bold text-white mb-2">
          Biblioteca & Planilhas
        </h1>
        <p className="text-navy-400">
          Acesse materiais oficiais, modelos de relatórios e documentos do
          clube.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 space-y-2 !p-4">
          <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest px-2 mb-4">
            Categorias
          </h3>
          {[
            "Todos Arquivos",
            "Documentos Oficiais",
            "Planilhas de Apoio",
            "Livros & Apostilas",
            "Modelos Úteis",
          ].map((cat, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${i === 0 ? "bg-primary text-white" : "text-navy-300 hover:bg-white/5"}`}
            >
              {cat}
            </button>
          ))}
        </Card>

        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {documents.map((doc, i) => (
            <Card key={i} className="flex flex-col justify-between group">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors`}
                >
                  {doc.type === "PDF" && (
                    <FileText size={24} className="text-red-400" />
                  )}
                  {doc.type === "XLSX" && (
                    <FileSpreadsheet size={24} className="text-green-400" />
                  )}
                  {doc.type === "DOCX" && (
                    <Book size={24} className="text-blue-400" />
                  )}
                  {doc.type === "EPUB" && (
                    <Book size={24} className="text-purple-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-navy-500 mt-1">
                    {doc.category} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  className="flex-1 gap-2 text-[10px]"
                >
                  <Eye size={14} /> Pré-visualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-[10px]"
                >
                  <Download size={14} /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
