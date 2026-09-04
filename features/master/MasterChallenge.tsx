"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Lock, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import { recordAnswer, recordMasterChallenge } from "@/lib/progress";
import { ActivityCard, type ActivityResult } from "@/components/game/ActivityCard";
import { ACTIVITIES } from "@/data/activities";
import type { AppId } from "@/types/game";

const STEP_IDS = [
  "w-sit-1",
  "w-fmt-6",
  "w-org-6",
  "e-form-6",
  "e-graf-1",
  "e-sit-2",
  "p-fund-5",
  "p-org-1",
  "p-sit-1",
];

const STEPS = STEP_IDS.map((id) => ACTIVITIES.find((a) => a.id === id)!);

type Tally = Record<AppId, { correct: number; total: number }>;

function emptyTally(): Tally {
  return {
    word: { correct: 0, total: 0 },
    excel: { correct: 0, total: 0 },
    ppt: { correct: 0, total: 0 },
    geral: { correct: 0, total: 0 },
  };
}

function levelName(overall: number) {
  if (overall >= 90) return "👑 Lenda da Informática";
  if (overall >= 75) return "🏆 Especialista em Informática";
  if (overall >= 50) return "🚀 Aprendiz Avançado";
  return "🌱 Em treinamento";
}

export function MasterChallenge() {
  const { state, mounted } = useProgress();
  const [phase, setPhase] = React.useState<"intro" | "playing" | "result">("intro");
  const [index, setIndex] = React.useState(0);
  const [waiting, setWaiting] = React.useState(false);
  const [tally, setTally] = React.useState<Tally>(emptyTally());
  const [xpEarned, setXpEarned] = React.useState(0);

  if (!mounted) return null;

  const unlocked = state.correctByApp.word >= 1 && state.correctByApp.excel >= 1 && state.correctByApp.ppt >= 1;

  if (!unlocked) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden pt-24">
        <div className="mx-auto max-w-xl px-4 text-center md:px-6">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold md:text-4xl">Desafio Mestre bloqueado</h1>
          <p className="mt-3 text-muted-foreground">
            Para desbloquear, complete pelo menos uma atividade de <strong>Word</strong>, <strong>Excel</strong> e{" "}
            <strong>PowerPoint</strong> no Arcade.
          </p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3 text-sm">
            <Progress label="Word" done={state.correctByApp.word >= 1} />
            <Progress label="Excel" done={state.correctByApp.excel >= 1} />
            <Progress label="PowerPoint" done={state.correctByApp.ppt >= 1} />
          </div>
          <Link
            href="/jogos"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
          >
            Ir para o Arcade <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  function start() {
    setTally(emptyTally());
    setIndex(0);
    setXpEarned(0);
    setPhase("playing");
  }

  function handleComplete(result: ActivityResult) {
    const activity = STEPS[index];
    setWaiting(true);
    recordAnswer({ app: activity.app, category: activity.category, correct: result.correct, timeMs: result.timeMs, points: activity.points });
    setTally((t) => ({
      ...t,
      [activity.app]: {
        correct: t[activity.app].correct + (result.correct ? 1 : 0),
        total: t[activity.app].total + 1,
      },
    }));
    if (result.correct) setXpEarned((x) => x + activity.points);

    window.setTimeout(() => {
      setWaiting(false);
      if (index + 1 >= STEPS.length) {
        finish();
      } else {
        setIndex((i) => i + 1);
      }
    }, 1600);
  }

  function finish() {
    setTally((t) => {
      const pct = (app: AppId) => (t[app].total > 0 ? Math.round((t[app].correct / t[app].total) * 100) : 0);
      recordMasterChallenge({ word: pct("word"), excel: pct("excel"), ppt: pct("ppt") });
      return t;
    });
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <div className="relative isolate min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-amber-50/60 via-background to-purple-50/40 dark:from-amber-950/10 dark:via-background dark:to-purple-950/20" />
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <Crown className="mx-auto h-14 w-14 text-amber-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">🏆 Desafio Mestre</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
            Uma missão só, misturando Word, Excel e PowerPoint. Ao final, você recebe uma avaliação completa do seu
            domínio em informática.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            <IntroCard emoji="📝" title="Word" text="Situações reais, formatação e organização de documentos." />
            <IntroCard emoji="📊" title="Excel" text="Fórmulas, gráficos e problemas do dia a dia." />
            <IntroCard emoji="🎨" title="PowerPoint" text="Atalhos, organização de slides e boas práticas." />
          </div>
          <button
            onClick={start}
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105"
          >
            Começar o Desafio Mestre <Sparkles className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    const current = STEPS[index];
    return (
      <div className="relative isolate min-h-screen overflow-hidden pt-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Etapa {index + 1} de {STEPS.length} · {appLabel(current.app)}
            </span>
            <span>{xpEarned} XP conquistados</span>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all"
              style={{ width: `${((index + (waiting ? 1 : 0)) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-soft-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <ActivityCard activity={current} onComplete={handleComplete} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // result
  const overall = Math.round(
    (pct(tally, "word") + pct(tally, "excel") + pct(tally, "ppt")) / 3
  );
  const weakestApps: Array<"word" | "excel" | "ppt"> = ["word", "excel", "ppt"];
  const weakest = weakestApps.sort((a, b) => pct(tally, a) - pct(tally, b))[0];

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        <Trophy className="mx-auto h-14 w-14 text-yellow-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">🎉 Você dominou o desafio!</h1>
        <p className="mt-2 text-muted-foreground">{levelName(overall)}</p>

        <div className="mt-8 space-y-4 text-left">
          <ResultBar emoji="📝" label="Word" value={pct(tally, "word")} color="bg-blue-500" />
          <ResultBar emoji="📊" label="Excel" value={pct(tally, "excel")} color="bg-emerald-500" />
          <ResultBar emoji="🎨" label="PowerPoint" value={pct(tally, "ppt")} color="bg-orange-500" />
        </div>

        <div className="mt-6 rounded-2xl border border-white/20 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-2xl font-bold">Nota geral: {overall}%</p>
          <p className="mt-1 text-sm text-muted-foreground">+{xpEarned} XP conquistados nesta rodada.</p>
        </div>

        {overall < 100 && (
          <p className="mt-4 text-sm text-muted-foreground">
            {pct(tally, weakest) < 100
              ? `Vale praticar um pouco mais de ${appLabel(weakest)}.`
              : "Mandou bem em tudo — continue praticando para não perder o ritmo!"}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/jogos?app=${weakest}`}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
          >
            Treinar meus pontos fracos <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/60 px-5 py-2.5 text-sm font-semibold hover:bg-white dark:border-white/10 dark:bg-white/5"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

function pct(tally: Tally, app: AppId) {
  return tally[app].total > 0 ? Math.round((tally[app].correct / tally[app].total) * 100) : 0;
}

function appLabel(app: AppId) {
  return app === "word" ? "Word" : app === "excel" ? "Excel" : app === "ppt" ? "PowerPoint" : "Geral";
}

function IntroCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-2xl">{emoji}</div>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

function Progress({ label, done }: { label: string; done: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        done ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-white/20 bg-white/50 dark:border-white/10 dark:bg-white/5"
      )}
    >
      <p className="font-semibold">{label}</p>
      <p className="text-xs">{done ? "✅ Concluído" : "Pendente"}</p>
    </div>
  );
}

function ResultBar({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-semibold">
        <span>
          {emoji} {label}
        </span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-foreground/10">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
