"use client";

import * as React from "react";
import { Flame, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress, xpProgress } from "@/lib/progress";
import { formatNumber } from "@/lib/utils";

export function XPPill({ className }: { className?: string }) {
  const { state, mounted } = useProgress();
  if (!mounted) return null;
  const { level, pct } = xpProgress(state.xp);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 text-xs font-semibold dark:border-white/10 dark:bg-white/5",
        className
      )}
      title={`Nível ${level} · ${formatNumber(state.xp)} XP`}
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-[10px] font-bold text-white">
        {level}
      </span>
      <span className="hidden sm:inline">{formatNumber(state.xp)} XP</span>
      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-foreground/10 sm:block">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${pct}%` }} />
      </div>
      {state.combo > 1 && (
        <span className="inline-flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
          <Flame className="h-3 w-3" /> x{state.combo}
        </span>
      )}
    </div>
  );
}

export function XPBar({ className }: { className?: string }) {
  const { state, mounted } = useProgress();
  if (!mounted) {
    return <div className={cn("h-24 animate-pulse rounded-2xl bg-foreground/5", className)} />;
  }
  const { level, pct, floor, ceil } = xpProgress(state.xp);

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-bold text-white shadow-lg">
            {level}
          </span>
          <div>
            <p className="text-sm font-semibold">Nível {level}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(state.xp)} XP · faltam {formatNumber(Math.max(0, ceil - state.xp))} para o próximo nível
            </p>
          </div>
        </div>
        {state.combo > 1 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-700 dark:text-orange-300">
            <Flame className="h-3.5 w-3.5" /> Combo x{state.combo}
          </span>
        )}
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{formatNumber(floor)} XP</span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" /> {state.achievements.length} conquistas
        </span>
        <span>{formatNumber(ceil)} XP</span>
      </div>
    </div>
  );
}
