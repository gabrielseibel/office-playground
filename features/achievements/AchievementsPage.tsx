"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import { XPBar } from "@/components/game/XPBar";
import { ACHIEVEMENTS } from "@/data/achievements";
import { ACTIVITIES } from "@/data/activities";

const TOTALS = {
  word: ACTIVITIES.filter((a) => a.app === "word").length,
  excel: ACTIVITIES.filter((a) => a.app === "excel").length,
  ppt: ACTIVITIES.filter((a) => a.app === "ppt").length,
  info: ACTIVITIES.filter((a) => a.app === "info").length,
};

export function AchievementsPage() {
  const { state, mounted, resetProgress } = useProgress();
  const [confirming, setConfirming] = React.useState(false);

  if (!mounted) return null;

  function handleReset() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    resetProgress();
    setConfirming(false);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-amber-50/50 via-background to-purple-50/30 dark:from-amber-950/10 dark:via-background dark:to-purple-950/10" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            <Trophy className="h-3 w-3" /> Suas conquistas
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">🏆 Minhas Conquistas</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Cada desafio concluído conta. Acompanhe seu XP, sua jornada por programa e os badges desbloqueados.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <XPBar />

          <div className="rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold">Sua jornada</h3>
            <div className="mt-3 space-y-3">
              <JourneyRow emoji="📝" label="Word" value={state.correctByApp.word} total={TOTALS.word} color="bg-blue-500" />
              <JourneyRow emoji="📊" label="Excel" value={state.correctByApp.excel} total={TOTALS.excel} color="bg-emerald-500" />
              <JourneyRow emoji="🎨" label="PowerPoint" value={state.correctByApp.ppt} total={TOTALS.ppt} color="bg-orange-500" />
              <JourneyRow emoji="💻" label="Informática" value={state.correctByApp.info} total={TOTALS.info} color="bg-teal-500" />
              <JourneyRow
                emoji="🏆"
                label="Desafio Mestre"
                value={state.masterChallenge ? 1 : 0}
                total={1}
                color="bg-amber-500"
                suffix={state.masterChallenge ? `${state.masterChallenge.overall}%` : undefined}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold">Mural de badges</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = state.achievements.includes(a.id);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 12) * 0.03 }}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-4 transition",
                    unlocked
                      ? "border-amber-400/50 bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:border-amber-400/20 dark:from-amber-400/10 dark:to-orange-400/5"
                      : "border-white/20 bg-white/40 opacity-70 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-full text-2xl",
                      unlocked ? "bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-md" : "bg-foreground/10 grayscale"
                    )}
                  >
                    {unlocked ? a.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        unlocked ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-foreground/5 text-muted-foreground"
                      )}
                    >
                      {unlocked ? "Desbloqueada" : "Bloqueada"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex justify-center pb-16">
          <button
            onClick={handleReset}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
              confirming
                ? "border-rose-500 bg-rose-500/10 text-rose-600"
                : "border-white/20 bg-white/60 text-muted-foreground hover:bg-white dark:border-white/10 dark:bg-white/5"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            {confirming ? "Clique de novo para confirmar — isso apaga TUDO" : "Zerar meu progresso"}
          </button>
        </div>
      </div>
    </div>
  );
}

function JourneyRow({
  emoji,
  label,
  value,
  total,
  color,
  suffix,
}: {
  emoji: string;
  label: string;
  value: number;
  total: number;
  color: string;
  suffix?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span>
          {emoji} {label}
        </span>
        <span className="text-muted-foreground">{suffix ?? `${value}/${total}`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
