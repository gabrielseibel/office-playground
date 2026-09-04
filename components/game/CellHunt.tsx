"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";

function columnLabel(index: number) {
  let n = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

const ROUNDS = [
  { rows: 4, cols: 4 },
  { rows: 5, cols: 5 },
  { rows: 6, cols: 6 },
  { rows: 6, cols: 8 },
  { rows: 8, cols: 8 },
  { rows: 8, cols: 10 },
  { rows: 10, cols: 10 },
  { rows: 10, cols: 12 },
];

function randomTarget(rows: number, cols: number) {
  const r = Math.floor(Math.random() * rows) + 1;
  const c = Math.floor(Math.random() * cols);
  return `${columnLabel(c)}${r}`;
}

export function CellHunt() {
  const [round, setRound] = React.useState(0);
  const [target, setTarget] = React.useState(() => randomTarget(ROUNDS[0].rows, ROUNDS[0].cols));
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [feedback, setFeedback] = React.useState<"idle" | "correct" | "wrong">("idle");
  const [done, setDone] = React.useState(false);
  const startRef = React.useRef(performance.now());

  const config = ROUNDS[round];

  function pick(label: string) {
    if (feedback !== "idle") return;
    const correct = label === target;
    const timeMs = performance.now() - startRef.current;
    setFeedback(correct ? "correct" : "wrong");
    recordAnswer({
      app: "excel",
      category: "celulas",
      correct,
      timeMs,
      points: 80 + round * 15,
    });
    if (correct) {
      setScore((s) => s + 100 + round * 20);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    window.setTimeout(() => {
      if (round + 1 >= ROUNDS.length) {
        setDone(true);
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setTarget(randomTarget(ROUNDS[nextRound].rows, ROUNDS[nextRound].cols));
        startRef.current = performance.now();
      }
      setFeedback("idle");
    }, 700);
  }

  function reset() {
    setRound(0);
    setTarget(randomTarget(ROUNDS[0].rows, ROUNDS[0].cols));
    setScore(0);
    setStreak(0);
    setFeedback("idle");
    setDone(false);
    startRef.current = performance.now();
  }

  if (done) {
    return (
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-3 text-2xl font-bold">Você caçou todas as células!</h3>
        <p className="mt-2 text-muted-foreground">{score} XP conquistados nesta rodada.</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Target className="h-4 w-4 text-emerald-600" />
          Encontre a célula <kbd className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-emerald-700 dark:text-emerald-300">{target}</kbd>
        </span>
        <span className="text-xs text-muted-foreground">
          Rodada {round + 1}/{ROUNDS.length} · {score} XP {streak > 1 ? `· sequência x${streak}` : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-emerald-200/40 bg-white/80 p-3 dark:border-emerald-400/15 dark:bg-white/5">
        <div
          className="inline-grid gap-1"
          style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(2.25rem, 1fr))` }}
        >
          {Array.from({ length: config.rows }).map((_, r) =>
            Array.from({ length: config.cols }).map((__, c) => {
              const label = `${columnLabel(c)}${r + 1}`;
              const isTarget = label === target;
              return (
                <button
                  key={label}
                  onClick={() => pick(label)}
                  className={cn(
                    "aspect-square min-w-9 rounded-md border font-mono text-[10px] transition",
                    "border-foreground/10 bg-white/70 hover:bg-emerald-100 dark:bg-white/5 dark:hover:bg-emerald-400/10",
                    feedback !== "idle" && isTarget && "border-emerald-500 bg-emerald-500/30",
                    feedback === "wrong" && !isTarget && "opacity-70"
                  )}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-3 text-sm font-semibold",
              feedback === "correct" ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {feedback === "correct" ? `✅ Isso mesmo, ${target}!` : `❌ Essa não era ${target}.`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
