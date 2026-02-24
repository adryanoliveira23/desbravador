"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Award, Search, Filter, Plus, ChevronRight } from "lucide-react";

const specializations = [
  {
    title: "Artes e Habilidades Manuais",
    count: 24,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Atividades Agrícolas",
    count: 12,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Ciência e Saúde",
    count: 18,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Natureza",
    count: 32,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Vida Prática",
    count: 15,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Atividades Missionárias",
    count: 10,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function SpecialtiesPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Especialidades{" "}
            <span className="text-primary italic">e Conquistas</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Gerencie e acompanhe a conclusão de especialidades do seu clube.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2 h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
            <Plus size={18} /> Adicionar Nova
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar especialidade..."
            icon={<Search size={18} />}
            className="bg-white border-amber-50 h-14 rounded-2xl"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 h-14 px-6 rounded-2xl border-amber-100 text-slate-600 font-bold"
        >
          <Filter size={18} /> Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specializations.map((spec, i) => (
          <Card
            key={i}
            className="bg-white border-amber-50 group hover:border-amber-200 transition-all shadow-lg hover:shadow-2xl shadow-amber-900/5 !p-8"
          >
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${spec.bg}`}>
                <Award className={spec.color} size={32} />
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">
                  {spec.count}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Disponíveis
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {spec.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Total de requisitos concluídos este mês:{" "}
                <span className="text-slate-900 font-bold">142</span>
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((x) => (
                  <div
                    key={x}
                    className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden shadow-sm"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?u=${x + i}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white bg-amber-50 flex items-center justify-center text-[10px] text-primary font-black shadow-sm">
                  +8
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 p-0 hover:bg-transparent text-primary font-black uppercase tracking-widest text-[10px]"
              >
                Detalhes <ChevronRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
