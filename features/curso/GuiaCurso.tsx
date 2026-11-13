"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Cpu, Network, PlayCircle, FlaskConical } from "lucide-react";

type Aula = { href: string; titulo: string; turma: string; resumo: string; tipo?: "aula" | "lab" };

const GUIAS = {
  uc2: {
    selo: "Informática Essencial. UC2",
    titulo: "Instalar e configurar sistemas operacionais, softwares e periféricos",
    texto: "Animações e atividades interativas das aulas da UC2. Cada aula tem a sua página, com vídeos curtos e jogos para fazer sozinho, em dupla ou com a turma toda.",
    icone: Cpu,
    aulas: [
      {
        href: "/curso-informatica-essencial-uc2-aula-1",
        titulo: "Aula 1. Hardware, sistema e requisitos",
        turma: "Xanxerê 2026.25.103",
        resumo: "Camadas do computador, o que o sistema operacional faz, requisitos do Windows 11 e cronograma de instalação.",
      },
      {
        href: "/curso-informatica-essencial-aula-5",
        titulo: "Aula 5. Instalar e desinstalar softwares",
        turma: "Lajeado 2026.25.60",
        resumo: "Licenças, instalação segura, compatibilidade e desinstalação, em sete atividades.",
      },
    ] as Aula[],
  },
  uc3: {
    selo: "Informática Essencial. UC3",
    titulo: "Utilizar e reparar redes locais de computadores",
    texto: "Animações, atividades e o laboratório de redes da UC3. Comece pela aula e use o laboratório para praticar.",
    icone: Network,
    aulas: [
      {
        href: "/curso-informatica-essencial-redes-aula-2",
        titulo: "Redes, Aula 2. Segurança de redes",
        turma: "Lajeado 2026.25.60",
        resumo: "Ameaças, golpes, firewall, senhas, criptografia, VPN e logs, em seis animações e sete atividades.",
      },
      {
        href: "/laboratorio-de-redes",
        titulo: "Laboratório de Redes",
        turma: "Simulador da UC3",
        resumo: "Simulador para praticar tudo da UC3.",
        tipo: "lab",
      },
    ] as Aula[],
  },
};

export function GuiaCurso({ uc }: { uc: "uc2" | "uc3" }) {
  const g = GUIAS[uc];
  const Icone = g.icone;
  const outra = uc === "uc2" ? { href: "/informatica-essencial-uc3", rotulo: "Ir para a guia UC3" } : { href: "/informatica-essencial-uc2", rotulo: "Ir para a guia UC2" };
  return (
    <div className="relative isolate min-h-screen overflow-hidden pb-20 pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-background to-blue-50/40 dark:from-slate-950/40 dark:via-background dark:to-blue-950/10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/#inicio" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <Icone className="h-3.5 w-3.5" /> {g.selo}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{g.titulo}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{g.texto}</p>
          </div>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {g.aulas.map((a) => (
            <Link key={a.href} href={a.href} className="glass-strong group rounded-3xl border p-6 shadow-soft-lg transition hover:-translate-y-0.5 hover:border-blue-500">
              <span className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                {a.tipo === "lab" ? <FlaskConical className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />} {a.turma}
              </span>
              <p className="mt-2 text-xl font-bold">{a.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground">{a.resumo}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
                abrir <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href={outra.href} className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-300">
            {outra.rotulo}
          </Link>
        </div>
      </div>
    </div>
  );
}
