"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Plus,
  Maximize,
  Minimize,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { activitiesFor, shuffled } from "@/data/activities";
import type { Activity, AppId, Difficulty } from "@/types/game";

type ClassroomApp = AppId | "misto";

const APP_OPTIONS: { id: ClassroomApp; label: string; emoji: string }[] = [
  { id: "word", label: "Word", emoji: "📝" },
  { id: "excel", label: "Excel", emoji: "📊" },
  { id: "ppt", label: "PowerPoint", emoji: "🎨" },
  { id: "misto", label: "Misto", emoji: "🌐" },
];

const DIFFICULTY_OPTIONS: { id: Difficulty; label: string }[] = [
  { id: "facil", label: "🟢 Fácil" },
  { id: "medio", label: "🟡 Médio" },
  { id: "dificil", label: "🔴 Difícil" },
];

export function ClassroomMode() {
  const [app, setApp] = React.useState<ClassroomApp | null>(null);
  const [difficulty, setDifficulty] = React.useState<Difficulty | null>(null);
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [projector, setProjector] = React.useState(false);
  const [deck, setDeck] = React.useState<Activity[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function buildDeckFor(a: ClassroomApp, d: Difficulty) {
    const items = activitiesFor(a === "misto" ? "all" : a, d).filter((act) =>
      ["mcq", "true-false", "chart-choice"].includes(act.type)
    );
    return shuffled(items).slice(0, 20);
  }

  function start() {
    if (!app || !difficulty) return;
    setDeck(buildDeckFor(app, difficulty));
    setIndex(0);
    setRevealed(false);
    setPoints(0);
    setStarted(true);
  }

  function restart() {
    if (!app || !difficulty) return;
    setDeck(buildDeckFor(app, difficulty));
    setIndex(0);
    setRevealed(false);
  }

  function next() {
    setRevealed(false);
    setIndex((i) => Math.min(deck.length - 1, i + 1));
  }

  function prev() {
    setRevealed(false);
    setIndex((i) => Math.max(0, i - 1));
  }

  async function toggleProjector() {
    const next = !projector;
    setProjector(next);
    try {
      if (next && containerRef.current && !document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else if (!next && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen pode falhar (ex.: iframe sem permissão) — modo grande continua funcionando.
    }
  }

  function exitClassroom() {
    setStarted(false);
    setApp(null);
    setDifficulty(null);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setProjector(false);
  }

  if (!started) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-background to-indigo-50/40 dark:from-slate-950/40 dark:via-background dark:to-indigo-950/20" />
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300">
            <GraduationCap className="h-3 w-3" /> Modo Professor
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">🎓 Sala de Aula</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
            Projete no telão, escolha o programa e a dificuldade, e conduza os desafios com a turma toda.
          </p>

          <div className="mt-10 rounded-3xl border border-white/20 bg-white/70 p-8 text-left shadow-soft-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-muted-foreground">1. Escolha o programa</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {APP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setApp(opt.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-center font-semibold transition",
                    app === opt.id
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                      : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  <div className="text-2xl">{opt.emoji}</div>
                  <div className="mt-1 text-sm">{opt.label}</div>
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold text-muted-foreground">2. Escolha a dificuldade</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-center font-semibold transition",
                    difficulty === opt.id
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                      : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={start}
              disabled={!app || !difficulty}
              className="mt-8 w-full rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Iniciar atividades →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = deck[index];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate flex min-h-screen flex-col bg-background",
        projector && "bg-slate-950 text-white"
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "flex items-center justify-between px-6 py-4 text-sm font-semibold",
          projector ? "bg-slate-900 text-white" : "border-b border-black/5 bg-white/60 dark:border-white/10 dark:bg-white/5"
        )}
      >
        <span className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> Sala de Aula
        </span>
        <span>
          Atividade {index + 1}/{deck.length}
        </span>
        <span className="flex items-center gap-3">
          ⭐ {points} pontos
          <button
            onClick={toggleProjector}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs",
              projector ? "bg-white/10 hover:bg-white/20" : "bg-foreground/5 hover:bg-foreground/10"
            )}
          >
            {projector ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            {projector ? "Sair do projetor" : "📺 Otimizar para projetor"}
          </button>
          <button
            onClick={exitClassroom}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs",
              projector ? "bg-white/10 hover:bg-white/20" : "bg-foreground/5 hover:bg-foreground/10"
            )}
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </span>
      </div>

      {/* Main question area */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        {!current ? (
          <p className={cn("text-center text-lg", projector && "text-white")}>
            Sem atividades para essa combinação de filtros.
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl text-center"
            >
              {current.context && (
                <div
                  className={cn(
                    "mx-auto mb-6 max-w-2xl rounded-2xl border border-dashed p-5 font-mono",
                    projector ? "border-white/20 bg-white/5" : "border-foreground/15 bg-white/50 dark:bg-white/5"
                  )}
                >
                  {current.context}
                </div>
              )}
              <h2 className={cn("text-3xl font-bold leading-snug md:text-5xl", projector && "text-white")}>
                {current.prompt}
              </h2>

              <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
                {current.type === "true-false" &&
                  [true, false].map((v) => {
                    const isCorrect = v === current.correctBool;
                    return (
                      <div
                        key={String(v)}
                        className={cn(
                          "rounded-3xl border-2 p-8 text-2xl font-bold md:text-3xl",
                          revealed && isCorrect
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
                            : projector
                            ? "border-white/15 bg-white/5"
                            : "border-foreground/10 bg-white/60 dark:bg-white/5"
                        )}
                      >
                        {v ? "✅ VERDADEIRO" : "❌ FALSO"}
                      </div>
                    );
                  })}

                {current.type === "mcq" &&
                  current.options?.map((opt, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-3xl border-2 p-6 text-left text-xl font-semibold md:text-2xl",
                        revealed && i === current.correctIndex
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
                          : projector
                          ? "border-white/15 bg-white/5"
                          : "border-foreground/10 bg-white/60 dark:bg-white/5"
                      )}
                    >
                      <span className="mr-2 opacity-60">{String.fromCharCode(65 + i)})</span> {opt}
                    </div>
                  ))}

                {current.type === "chart-choice" &&
                  current.chartOptions?.map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "rounded-3xl border-2 p-8 text-2xl font-bold",
                        revealed && opt.id === current.correctChartId
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
                          : projector
                          ? "border-white/15 bg-white/5"
                          : "border-foreground/10 bg-white/60 dark:bg-white/5"
                      )}
                    >
                      <div className="text-4xl">{opt.emoji}</div>
                      <div className="mt-2">{opt.label}</div>
                    </div>
                  ))}
              </div>

              {revealed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "mx-auto mt-8 max-w-2xl rounded-2xl p-4 text-lg",
                    projector ? "bg-white/10" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  🎉 {current.explanation}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom control bar */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-3 px-6 py-5",
          projector ? "bg-slate-900" : "border-t border-black/5 bg-white/60 dark:border-white/10 dark:bg-white/5"
        )}
      >
        <ControlButton onClick={prev} disabled={index === 0} projector={projector}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </ControlButton>
        <ControlButton onClick={() => setRevealed((r) => !r)} projector={projector} highlight>
          <Eye className="h-4 w-4" /> {revealed ? "Ocultar resposta" : "Revelar resposta"}
        </ControlButton>
        <ControlButton onClick={next} disabled={index + 1 >= deck.length} projector={projector}>
          Próxima <ChevronRight className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => setPoints((p) => p + 1)} projector={projector}>
          <Plus className="h-4 w-4" /> Adicionar ponto
        </ControlButton>
        <ControlButton onClick={restart} projector={projector}>
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  disabled,
  projector,
  highlight,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  projector: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-30",
        highlight
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : projector
          ? "bg-white/10 text-white hover:bg-white/20"
          : "border border-white/20 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}
