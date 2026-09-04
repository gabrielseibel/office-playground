"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  app?: string;
  /** Chamado uma vez, logo após a primeira resposta, com o resultado. */
  onAnswer?: (correct: boolean) => void;
}

export function MiniChallenge({
  question,
  options,
  correctIndex,
  explanation,
  app,
  onAnswer,
}: Props) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [reveal, setReveal] = React.useState(false);

  function pick(i: number) {
    if (reveal) return;
    setSelected(i);
    setReveal(true);
    onAnswer?.(i === correctIndex);
  }

  function reset() {
    setSelected(null);
    setReveal(false);
  }

  const correct = selected === correctIndex;

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          <Zap className="h-3 w-3" />
          desafio rápido{app ? ` · ${app}` : ""}
        </span>
        {reveal && (
          <button
            onClick={reset}
            className="rounded-md p-1 text-muted-foreground hover:bg-white/40 dark:hover:bg-white/5"
            aria-label="Reiniciar"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h4 className="mt-3 text-sm font-semibold leading-snug">{question}</h4>

      <div className="mt-4 grid gap-2">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={reveal}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition disabled:cursor-not-allowed",
                "border-white/20 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                reveal &&
                  isCorrect &&
                  "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                reveal &&
                  isSelected &&
                  !isCorrect &&
                  "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
              )}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-foreground/15 bg-background text-[10px] font-bold text-foreground/70">
                {reveal && isCorrect ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : reveal && isSelected && !isCorrect ? (
                  <X className="h-3 w-3 text-rose-600" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-3 rounded-xl border p-3 text-xs leading-relaxed",
              correct
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            <strong>{correct ? "✅ Correto!" : "❌ Tente novamente"}</strong>{" "}
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
