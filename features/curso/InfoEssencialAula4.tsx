"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Search,
  Cable,
  HelpCircle,
  Check,
  X,
  Eye,
  RotateCcw,
  Timer,
  Plus,
  Trophy,
  Maximize,
  Minimize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import { MemoryMatch } from "@/components/game/MemoryMatch";
import {
  COLUNAS,
  PERIFERICOS,
  CORRIDA,
  CONEXOES,
  VERDADE_OU_MITO,
  type DriverColuna,
} from "@/data/cursoInfoEssencialAula4";

type Aba = "driver" | "corrida" | "conexao" | "vm";

const ABAS: {
  id: Aba;
  numero: number;
  titulo: string;
  formato: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "driver", numero: 1, titulo: "Quem precisa de driver?", formato: "Abertura. Grupos de 4", icon: Layers },
  { id: "corrida", numero: 2, titulo: "Corrida do Gerenciador", formato: "Individual. Telão do professor", icon: Search },
  { id: "conexao", numero: 3, titulo: "Conexão certa", formato: "Duplas. Jogo da memória", icon: Cable },
  { id: "vm", numero: 4, titulo: "Verdade ou mito dos drivers", formato: "Fechamento. Turma toda", icon: HelpCircle },
];

const COR_COLUNA: Record<DriverColuna, { borda: string; fundo: string; texto: string; chip: string }> = {
  A: {
    borda: "border-blue-500/50",
    fundo: "bg-blue-500/5 dark:bg-blue-400/10",
    texto: "text-blue-700 dark:text-blue-300",
    chip: "bg-blue-600 text-white",
  },
  B: {
    borda: "border-orange-500/50",
    fundo: "bg-orange-500/5 dark:bg-orange-400/10",
    texto: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-500 text-white",
  },
  C: {
    borda: "border-slate-500/50",
    fundo: "bg-slate-500/5 dark:bg-slate-400/10",
    texto: "text-slate-700 dark:text-slate-300",
    chip: "bg-slate-600 text-white",
  },
};

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function Painel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass-strong rounded-3xl border p-5 shadow-soft-lg md:p-8", className)}>
      {children}
    </div>
  );
}

function BotaoSec({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function BotaoPri({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Quem precisa de driver?                                          */
/* ------------------------------------------------------------------ */

function QuemPrecisaDeDriver() {
  // Embaralha só no navegador: no HTML gerado no build as cartas ficam na
  // ordem original, senão a ordem do servidor e a do navegador não batem.
  const [ordem, setOrdem] = React.useState(PERIFERICOS);
  React.useEffect(() => setOrdem(embaralhar(PERIFERICOS)), []);
  const [onde, setOnde] = React.useState<Record<string, DriverColuna>>({});
  const [selecionada, setSelecionada] = React.useState<string | null>(null);
  const [conferido, setConferido] = React.useState(false);
  const [arrastando, setArrastando] = React.useState<DriverColuna | null>(null);

  const soltas = ordem.filter((p) => !onde[p.id]);
  const acertos = PERIFERICOS.filter((p) => onde[p.id] === p.coluna).length;
  const todasColocadas = soltas.length === 0;

  function colocar(id: string, coluna: DriverColuna) {
    if (conferido) return;
    setOnde((o) => ({ ...o, [id]: coluna }));
    setSelecionada(null);
  }

  function tirar(id: string) {
    if (conferido) return;
    setOnde((o) => {
      const n = { ...o };
      delete n[id];
      return n;
    });
  }

  function conferir() {
    setConferido(true);
    recordAnswer({
      app: "info",
      category: "drivers",
      correct: acertos >= 12,
      timeMs: 0,
      points: acertos * 10,
    });
  }

  function reiniciar() {
    setOrdem(embaralhar(PERIFERICOS));
    setOnde({});
    setSelecionada(null);
    setConferido(false);
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground md:text-base">
        Toque em uma carta e depois na coluna certa, ou arraste a carta até a coluna. O grupo
        discute antes de colocar. Para tirar uma carta da coluna, toque nela.
      </p>

      <div className="mb-6 min-h-[64px] rounded-2xl border border-dashed border-foreground/15 p-3">
        {soltas.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">
            Todas as cartas estão nas colunas.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {soltas.map((p) => (
              <button
                key={p.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", p.id);
                  setSelecionada(p.id);
                }}
                onClick={() => setSelecionada((s) => (s === p.id ? null : p.id))}
                className={cn(
                  "cursor-grab rounded-xl border bg-white/90 px-3 py-2 text-sm font-semibold shadow-sm transition active:cursor-grabbing dark:bg-white/10",
                  selecionada === p.id
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "border-white/30 hover:-translate-y-0.5"
                )}
              >
                {p.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUNAS.map((col) => {
          const cor = COR_COLUNA[col.id];
          const cartas = ordem.filter((p) => onde[p.id] === col.id);
          return (
            <div
              key={col.id}
              onClick={() => selecionada && colocar(selecionada, col.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setArrastando(col.id);
              }}
              onDragLeave={() => setArrastando(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) colocar(id, col.id);
                setArrastando(null);
              }}
              className={cn(
                "min-h-[220px] rounded-2xl border-2 p-3 transition",
                cor.borda,
                cor.fundo,
                (selecionada || arrastando === col.id) && !conferido && "cursor-pointer ring-2 ring-offset-2 ring-offset-background",
                arrastando === col.id && "scale-[1.01]"
              )}
            >
              <div className="mb-3 flex items-start gap-2">
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold", cor.chip)}>
                  {col.id}
                </span>
                <div>
                  <p className={cn("font-semibold leading-tight", cor.texto)}>{col.titulo}</p>
                  <p className="text-xs text-muted-foreground">{col.descricao}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {cartas.map((p) => {
                  const certo = p.coluna === col.id;
                  return (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        tirar(p.id);
                      }}
                      className={cn(
                        "rounded-xl border bg-white/90 px-3 py-2 text-left text-sm font-semibold shadow-sm dark:bg-white/10",
                        conferido
                          ? certo
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-400/10"
                            : "border-red-500 bg-red-50 dark:bg-red-400/10"
                          : "border-white/30"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        {p.nome}
                        {conferido &&
                          (certo ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <span className="shrink-0 text-xs font-bold text-red-600">vai em {p.coluna}</span>
                          ))}
                      </span>
                      {conferido && (
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">{p.porque}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {conferido ? (
          <p className="text-lg font-semibold">
            {acertos} de {PERIFERICOS.length} certas. Discutam as cartas em vermelho.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {PERIFERICOS.length - soltas.length} de {PERIFERICOS.length} cartas colocadas
          </p>
        )}
        <div className="flex gap-2">
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> recomeçar
          </BotaoSec>
          {!conferido && (
            <BotaoPri onClick={conferir} disabled={!todasColocadas}>
              <Check className="h-4 w-4" /> conferir
            </BotaoPri>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Corrida do Gerenciador (telão)                                   */
/* ------------------------------------------------------------------ */

function CorridaDoGerenciador() {
  const [rodada, setRodada] = React.useState(0);
  const [mostrar, setMostrar] = React.useState(false);
  const [inicio, setInicio] = React.useState<number | null>(null);
  const [agora, setAgora] = React.useState(0);
  const [nomes, setNomes] = React.useState<string[]>([]);
  const [pontos, setPontos] = React.useState<Record<string, number>>({});
  const [novo, setNovo] = React.useState("");

  React.useEffect(() => {
    if (inicio === null) return;
    const t = window.setInterval(() => setAgora(Date.now()), 200);
    return () => window.clearInterval(t);
  }, [inicio]);

  const segundos = inicio === null ? 0 : Math.max(0, Math.floor((agora - inicio) / 1000));
  const atual = CORRIDA[rodada];

  function irPara(n: number) {
    setRodada(n);
    setMostrar(false);
    setInicio(null);
  }

  function valendo() {
    setInicio(Date.now());
    setAgora(Date.now());
    setMostrar(false);
  }

  function adicionar() {
    const nome = novo.trim();
    if (!nome || nomes.includes(nome)) return;
    setNomes((n) => [...n, nome]);
    setNovo("");
  }

  const ranking = [...nomes].sort((a, b) => (pontos[b] ?? 0) - (pontos[a] ?? 0));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="mb-4 text-sm text-muted-foreground md:text-base">
          A corrida acontece no Gerenciador de Dispositivos de cada computador. Esta tela é o
          telão: mostra o que procurar, conta o tempo e guarda o placar. Todos fecham o
          Gerenciador entre uma rodada e outra.
        </p>
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-xl md:p-10">
          <div className="flex items-center justify-between text-sm text-blue-100">
            <span className="font-semibold uppercase tracking-wider">
              Rodada {rodada + 1} de {CORRIDA.length}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-lg">
              <Timer className="h-4 w-4" /> {segundos}s
            </span>
          </div>
          <p className="mt-6 text-sm uppercase tracking-wider text-orange-300">Procure</p>
          <p className="mt-1 text-3xl font-bold leading-tight md:text-5xl">{atual.procurar}</p>
          <AnimatePresence>
            {mostrar && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-2xl bg-white/10 p-4"
              >
                <p className="text-xs uppercase tracking-wider text-blue-200">Onde fica</p>
                <p className="mt-1 text-xl font-semibold md:text-2xl">{atual.ondeFica}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <BotaoSec onClick={() => irPara(Math.max(0, rodada - 1))} disabled={rodada === 0}>
            <ChevronLeft className="h-4 w-4" /> anterior
          </BotaoSec>
          <BotaoPri onClick={valendo}>
            <Timer className="h-4 w-4" /> valendo
          </BotaoPri>
          <BotaoSec onClick={() => setMostrar((m) => !m)}>
            <Eye className="h-4 w-4" /> {mostrar ? "esconder" : "mostrar onde fica"}
          </BotaoSec>
          <BotaoSec
            onClick={() => irPara(Math.min(CORRIDA.length - 1, rodada + 1))}
            disabled={rodada === CORRIDA.length - 1}
          >
            próxima <ChevronRight className="h-4 w-4" />
          </BotaoSec>
        </div>
      </div>

      <div className="rounded-3xl border bg-white/60 p-4 dark:bg-white/5">
        <p className="mb-1 flex items-center gap-1.5 font-semibold">
          <Trophy className="h-4 w-4 text-yellow-500" /> Placar
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Os três primeiros a mostrar a tela marcam 3, 2 e 1 ponto.
        </p>
        <div className="mb-3 flex gap-2">
          <input
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionar()}
            placeholder="Nome do aluno"
            className="min-w-0 flex-1 rounded-xl border bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10"
          />
          <button
            onClick={adicionar}
            aria-label="Adicionar aluno"
            className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {ranking.length === 0 ? (
          <p className="text-sm text-muted-foreground">Adicione os alunos para marcar pontos.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {ranking.map((nome) => (
              <li key={nome} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 dark:bg-white/5">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{nome}</span>
                <span className="w-8 text-right font-mono font-bold">{pontos[nome] ?? 0}</span>
                {[3, 2, 1].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPontos((p) => ({ ...p, [nome]: (p[nome] ?? 0) + v }))}
                    className="rounded-lg bg-blue-600/10 px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-600/20 dark:text-blue-300"
                  >
                    +{v}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        )}
        {ranking.length > 0 && (
          <button
            onClick={() => setPontos({})}
            className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            zerar placar
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Conexão certa                                                    */
/* ------------------------------------------------------------------ */

function ConexaoCerta() {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground md:text-base">
        Virem duas cartas por vez. O par vale quando o periférico combina com a conexão.
      </p>
      <p className="mb-5 rounded-xl bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-800 dark:text-orange-200">
        Regra da dupla: a cada par formado, digam em voz alta por que combina. Errou a explicação,
        o par não conta.
      </p>
      <MemoryMatch pairs={CONEXOES} app="info" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Verdade ou mito                                                  */
/* ------------------------------------------------------------------ */

function VerdadeOuMito() {
  const [i, setI] = React.useState(0);
  const [resposta, setResposta] = React.useState<boolean | null>(null);
  const [revelado, setRevelado] = React.useState(false);
  const [acertos, setAcertos] = React.useState(0);
  const [respondidas, setRespondidas] = React.useState(0);
  const item = VERDADE_OU_MITO[i];
  const fim = i === VERDADE_OU_MITO.length - 1 && revelado;

  function responder(v: boolean) {
    if (revelado) return;
    setResposta(v);
    setRevelado(true);
    setRespondidas((r) => r + 1);
    const certo = v === item.verdade;
    if (certo) setAcertos((a) => a + 1);
    recordAnswer({ app: "info", category: "drivers", correct: certo, timeMs: 0, points: 10 });
  }

  function proxima() {
    setI((n) => Math.min(VERDADE_OU_MITO.length - 1, n + 1));
    setResposta(null);
    setRevelado(false);
  }

  function reiniciar() {
    setI(0);
    setResposta(null);
    setRevelado(false);
    setAcertos(0);
    setRespondidas(0);
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground md:text-base">
        Projete a frase, conte até três e a turma levanta a plaquinha V ou M. Depois clique em
        revelar. Para jogar sozinho, clique direto em Verdade ou Mito.
      </p>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold">
          Frase {i + 1} de {VERDADE_OU_MITO.length}
        </span>
        {respondidas > 0 && (
          <span className="text-muted-foreground">
            {acertos} de {respondidas} certas
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-3xl border bg-white/80 p-6 text-center shadow-sm dark:bg-white/5 md:p-10"
        >
          <p className="text-2xl font-bold leading-snug md:text-4xl">{item.frase}</p>

          {revelado && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xl font-bold text-white",
                  item.verdade ? "bg-emerald-600" : "bg-red-600"
                )}
              >
                {item.verdade ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                {item.verdade ? "Verdade" : "Mito"}
              </span>
              {resposta !== null && (
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {resposta === item.verdade ? "Você acertou." : "Não foi dessa vez."}
                </p>
              )}
              <p className="mx-auto mt-3 max-w-2xl text-lg">{item.explicacao}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!revelado ? (
          <>
            <BotaoPri onClick={() => responder(true)} className="bg-emerald-600 px-8 text-lg shadow-emerald-600/25 hover:bg-emerald-700">
              Verdade
            </BotaoPri>
            <BotaoPri onClick={() => responder(false)} className="bg-red-600 px-8 text-lg shadow-red-600/25 hover:bg-red-700">
              Mito
            </BotaoPri>
            <BotaoSec onClick={() => setRevelado(true)}>
              <Eye className="h-4 w-4" /> revelar
            </BotaoSec>
          </>
        ) : fim ? (
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> jogar de novo
          </BotaoSec>
        ) : (
          <BotaoPri onClick={proxima}>
            próxima frase <ChevronRight className="h-4 w-4" />
          </BotaoPri>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function InfoEssencialAula4() {
  const [aba, setAba] = React.useState<Aba>("driver");
  const [telaCheia, setTelaCheia] = React.useState(false);
  const painelRef = React.useRef<HTMLDivElement>(null);
  const atual = ABAS.find((a) => a.id === aba)!;

  React.useEffect(() => {
    const onChange = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function alternarTelaCheia() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await painelRef.current?.requestFullscreen();
    } catch {
      /* navegador sem suporte: segue na janela normal */
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden pb-20 pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-background to-blue-50/40 dark:from-slate-950/40 dark:via-background dark:to-blue-950/10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/#inicio"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                <Cpu className="h-3.5 w-3.5" /> Curso Informática Essencial. UC2
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                Aula 4. Drivers e periféricos
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                As quatro dinâmicas da aula de 09/10. Cada uma tem a versão impressa como plano B, se
                faltar internet no laboratório.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {ABAS.map((a) => {
            const Icon = a.icon;
            const ativa = a.id === aba;
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={cn(
                  "flex min-w-[200px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                  ativa
                    ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                    ativa ? "bg-white/20" : "bg-blue-600/10 text-blue-700 dark:text-blue-300"
                  )}
                >
                  {a.numero}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{a.titulo}</span>
                  </span>
                  <span className={cn("block text-xs", ativa ? "text-blue-100" : "text-muted-foreground")}>
                    {a.formato}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div ref={painelRef} className={cn("mt-6", telaCheia && "overflow-y-auto bg-background p-6 md:p-10")}>
          <Painel className={cn(telaCheia && "min-h-full")}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold md:text-2xl">
                {atual.numero}. {atual.titulo}
              </h2>
              <BotaoSec onClick={alternarTelaCheia}>
                {telaCheia ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="hidden sm:inline">{telaCheia ? "sair da tela cheia" : "tela cheia"}</span>
              </BotaoSec>
            </div>
            {aba === "driver" && <QuemPrecisaDeDriver />}
            {aba === "corrida" && <CorridaDoGerenciador />}
            {aba === "conexao" && <ConexaoCerta />}
            {aba === "vm" && <VerdadeOuMito />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
