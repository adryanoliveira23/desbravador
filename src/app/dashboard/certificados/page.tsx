"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Award, Download, Eye, Send, Search, User } from "lucide-react";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Gerador de <span className="text-primary italic">Certificados</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Emita e gerencie certificados de especialidades, classes e
            investiduras.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-slate-900"
        >
          <Award size={18} /> Novo Certificado
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <Card className="flex flex-col items-center justify-center p-12 overflow-hidden relative min-h-[500px] border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[3rem]">
          <div
            id="certificate-preview"
            className="p-8 w-full max-w-[500px] aspect-[1.41] bg-white text-slate-900 rounded-lg shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
          >
            {/* Decorative Borders */}
            <div className="absolute inset-2 border-4 border-primary/20 rounded-md" />
            <div className="absolute inset-4 border border-navy-200 rounded-sm" />

            <div className="mt-8">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold uppercase tracking-widest text-navy-800">
                Certificado de Conclusão
              </h2>
            </div>

            <div className="my-6">
              <p className="text-sm italic text-navy-500">
                Certificamos para os devidos fins que
              </p>
              <p className="text-2xl font-bold border-b-2 border-navy-100 px-8 py-2 inline-block uppercase">
                {selectedCert.member || "NOME DO DESBRAVADOR"}
              </p>
              <p className="text-sm mt-4 text-navy-600">
                concluiu com êxito todos os requisitos da{" "}
                {selectedCert.type || "especialidade"} de
              </p>
              <p className="text-xl font-bold text-primary mt-1 uppercase">
                {selectedCert.title || "TÍTULO"}
              </p>
            </div>

            <div className="mb-8 w-full px-12 flex justify-between items-end">
              <div className="text-[10px] border-t border-navy-300 pt-1 w-24">
                Assinatura Diretor
              </div>
              <div className="text-[10px] font-bold">{selectedCert.date}</div>
              <div className="text-[10px] border-t border-navy-300 pt-1 w-24">
                Assinatura Instrutor
              </div>
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 h-12 px-6 rounded-xl border-amber-200 text-slate-600 font-bold bg-white shadow-sm"
            >
              <Eye size={16} /> Imprimir
            </Button>
            <Button
              onClick={handlePrint}
              className="gap-2 h-12 px-6 rounded-xl shadow-lg shadow-primary/10 bg-primary hover:bg-red-700"
            >
              <Download size={16} /> Baixar PDF
            </Button>
          </div>
        </Card>

        {/* History Table */}
        <Card className="bg-white border-amber-50 shadow-2xl shadow-amber-900/5 rounded-[2.5rem] p-0 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
              Emissões Recentes
            </h3>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="bg-white border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                placeholder="Buscar certificado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={cn(
                  "p-6 flex items-center justify-between hover:bg-amber-50/50 transition-colors group cursor-pointer",
                  selectedCert.id === cert.id ? "bg-amber-50/70" : "",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shadow-inner">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                      {cert.member}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {cert.type} • {cert.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${cert.status === "Pronto" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                  >
                    {cert.status}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2.5 h-auto text-slate-300 hover:text-primary hover:bg-white rounded-xl shadow-none hover:shadow-md transition-all"
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2.5 h-auto text-slate-300 hover:text-primary hover:bg-white rounded-xl shadow-none hover:shadow-md transition-all"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50/50">
            <Button
              variant="ghost"
              className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary"
            >
              Ver Histórico Completo
            </Button>
          </div>
        </Card>
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
