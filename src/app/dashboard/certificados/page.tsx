"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Award, Download, Eye, Search, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const initialCertificates = [
  {
    id: "1",
    member: "Adryan S.",
    type: "Especialidade",
    title: "Astronomia",
    date: "22/02/2026",
    status: "Pronto",
  },
  {
    id: "2",
    member: "Gabriel M.",
    type: "Classe Regular",
    title: "Amigo",
    date: "20/02/2026",
    status: "Enviado",
  },
  {
    id: "3",
    member: "Juliana R.",
    type: "Investidura",
    title: "Guia",
    date: "15/02/2026",
    status: "Pronto",
  },
];

export default function CertificatesPage() {
  const [certs, setCerts] = React.useState(initialCertificates);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedCert, setSelectedCert] = React.useState(
    initialCertificates[0],
  );

  const [searchTerm, setSearchTerm] = React.useState("");
  const [newMember, setNewMember] = React.useState("");
  const [newType, setNewType] = React.useState("Especialidade");
  const [newTitle, setNewTitle] = React.useState("");
  const newDate = new Date().toLocaleDateString("pt-BR");

  const filteredCerts = React.useMemo(() => {
    return certs.filter(
      (cert) =>
        cert.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [certs, searchTerm]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = {
      id: Math.random().toString(36).substr(2, 9),
      member: newMember,
      type: newType,
      title: newTitle,
      date: newDate,
      status: "Pronto" as const,
    };
    setCerts([newCert, ...certs]);
    setSelectedCert(newCert);
    setShowAddModal(false);
    setNewMember("");
    setNewTitle("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Gerador de <span className="text-primary italic">Certificados</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            Emita documentos oficiais de especialidades e classes com design
            profissional em segundos.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 h-12 px-6 font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-slate-900 text-xs rounded-2xl hover:scale-105 transition-all"
        >
          <Award size={16} /> Novo Certificado
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Preview Area */}
        <div className="lg:col-span-3 space-y-6 sticky top-8">
          <Card className="flex flex-col items-center justify-center p-6 md:p-16 overflow-hidden relative min-h-[450px] border-none bg-white shadow-2xl shadow-slate-900/10 rounded-[3rem]">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div
              id="certificate-preview"
              className="p-8 w-full max-w-[500px] aspect-[1.41] bg-white text-slate-900 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-between text-center relative overflow-hidden group border border-slate-100"
            >
              {/* Elegant Borders */}
              <div className="absolute inset-4 border-[3px] border-primary/10 rounded-lg pointer-events-none" />
              <div className="absolute inset-6 border border-slate-100 rounded-md pointer-events-none" />
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg pointer-events-none" />

              <div className="relative z-10 mt-6">
                <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 shadow-inner">
                  <Award size={24} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-[0.2em] text-slate-800 italic">
                  Certificado de <span className="text-primary">Conclusão</span>
                </h2>
              </div>

              <div className="relative z-10 my-4 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
                  Certificamos para os devidos fins que
                </p>
                <div className="relative inline-block px-4">
                  <p className="text-xl md:text-2xl font-black uppercase italic text-slate-900 tracking-tight leading-none">
                    {selectedCert.member || "NOME DO DESBRAVADOR"}
                  </p>
                  <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>
                <div className="pt-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                    concluiu com êxito os requisitos de
                  </p>
                  <p className="text-sm font-black text-primary uppercase italic tracking-widest flex items-center justify-center gap-2">
                    <span className="w-4 h-px bg-primary/20" />
                    {selectedCert.type || "Especialidade"} de{" "}
                    {selectedCert.title || "TÍTULO"}
                    <span className="w-4 h-px bg-primary/20" />
                  </p>
                </div>
              </div>

              <div className="relative z-10 mb-6 w-full px-10 flex justify-between items-end">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-20 h-px bg-slate-200" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    Diretor
                  </span>
                </div>
                <div className="text-[9px] font-black italic text-slate-400 py-1 px-3 bg-slate-50 rounded-full border border-slate-100">
                  {selectedCert.date}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-20 h-px bg-slate-200" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    Instrutor
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 w-full max-w-[500px]">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex-1 h-11 rounded-2xl border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[9px] bg-white hover:bg-slate-50 transition-all gap-2"
              >
                <Eye size={14} /> Pré-visualizar
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 h-11 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] transition-all gap-2"
              >
                <Download size={14} /> Baixar PDF
              </Button>
            </div>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-none shadow-2xl shadow-slate-900/5 rounded-[2.5rem] p-0 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                Emissões <span className="text-primary italic">Recentes</span>
              </h3>
              <div className="relative group">
                <Search
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                />
                <input
                  className="bg-white border border-slate-100 rounded-2xl pl-10 pr-4 py-2 text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm w-full sm:w-48"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={cn(
                      "p-5 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer border-l-4 border-transparent",
                      selectedCert.id === cert.id
                        ? "bg-slate-50/80 border-primary"
                        : "hover:border-slate-200",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner",
                          selectedCert.id === cert.id
                            ? "bg-primary text-white scale-110"
                            : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                        )}
                      >
                        <User size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-slate-900 uppercase italic">
                          {cert.member}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          {cert.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border transition-all",
                          cert.status === "Pronto"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-blue-50 text-blue-600 border-blue-100",
                        )}
                      >
                        {cert.status}
                      </span>
                      <ChevronRight
                        size={14}
                        className={cn(
                          "transition-all",
                          selectedCert.id === cert.id
                            ? "text-primary translate-x-1"
                            : "text-slate-200 group-hover:text-slate-400",
                        )}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <Search size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nenhum resultado
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50/20 border-t border-slate-50">
              <Button
                variant="ghost"
                className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary rounded-xl"
              >
                Ver Histórico Completo
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Novo Certificado Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <Card className="relative w-full max-w-md bg-white !p-10 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
              Novo Certificado
            </h2>
            <p className="text-sm font-medium text-slate-600 mb-6">
              Preencha os dados do membro para gerar o certificado.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Nome do Membro
                </label>
                <input
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Tipo
                </label>
                <select
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Especialidade">Especialidade</option>
                  <option value="Classe Regular">Classe Regular</option>
                  <option value="Investidura">Investidura</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Título
                </label>
                <input
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Astronomia, Amigo..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
              >
                Gerar Certificado
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
