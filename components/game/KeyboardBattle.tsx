"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import { ACTIVITIES, shuffled } from "@/data/activities";

const ROUND_MS = 6000;
const SHORTCUT_ACTIVITIES = ACTIVITIES.filter((a) => a.type === "shortcut");

export function KeyboardBattle() {
  const [pool] = React.useState(() => shuffled(SHORTCUT_ACTIVITIES).slice(0, 10));
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(ROUND_MS);
  const [feedback, setFeedback] = React.useState<"idle" | "correct" | "wrong">("idle");
  const [done, setDone] = React.useState(false);
  const startRef = React.useRef(performance.now());
  const current = pool[index];

  React.useEffect(() => {
    if (done || feedback !== "idle") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          resolveRound(false);
          return ROUND_MS;
        }
        return t - 100;
      });
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, feedback, done]);

  React.useEffect(() => {
    if (!current) return;
    function onKeyDown(e: KeyboardEvent) {
      if (["Control", "Shift", "Alt", "Meta", "Tab"].includes(e.key)) return;
      if (feedback !== "idle" || done) return;
      e.preventDefault();
      const combo = new Set<string>();
      if (e.ctrlKey || e.metaKey) combo.add("ctrl");
      if (e.shiftKey) combo.add("shift");
      if (e.altKey) combo.add("alt");
      combo.add(e.key.toLowerCase());
      const expected = new Set((current.keys ?? []).map((k) => k.toLowerCase()));
      const match = expected.size === combo.size && [...expected].every((k) => combo.has(k));
      resolveRound(match);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, feedback, done]);

  function resolveRound(correct: boolean) {
    if (feedback !== "idle") return;
    setFeedback(correct ? "correct" : "wrong");
    const timeMs = performance.now() - startRef.current;
    recordAnswer({
      app: "geral",
      category: "atalhos",
      correct,
      timeMs,
      points: 130,
      isShortcut: true,
    });
    if (correct) {
      setScore((s) => s + 130);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    window.setTimeout(() => {
      if (index + 1 >= pool.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setTimeLeft(ROUND_MS);
        startRef.current = performance.now();
      }
      setFeedback("idle");
    }, 900);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(ROUND_MS);
    setFeedback("idle");
    setDone(false);
    startRef.current = performance.now();
  }

  if (pool.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum atalho cadastrado.</p>;
  }

  if (done) {
    return (
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-3 text-2xl font-bold">Batalha vencida!</h3>
        <p className="mt-2 text-muted-foreground">{score} XP conquistados usando o teclado de verdade.</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Lutar de novo
        </button>
      </div>
    );
  }

  const pct = (timeLeft / ROUND_MS) * 100;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Rodada {index + 1}/{pool.length} {streak > 1 ? `· sequência x${streak}` : ""}
        </span>
        <span className="font-mono">{score} XP</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          className={cn("h-full rounded-full", pct > 30 ? "bg-purple-500" : "bg-rose-500")}
          animate={{ width: `${pct}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      <div
        className={cn(
          "mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center",
          feedback === "correct"
            ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-400/10"
            : feedback === "wrong"
            ? "border-rose-400 bg-rose-50/60 dark:bg-rose-400/10"
            : "border-purple-300 bg-purple-50/40 dark:border-purple-400/30 dark:bg-purple-400/5"
        )}
      >
        <Keyboard className="h-12 w-12 text-purple-500" />
        <p className="text-lg font-semibold">{current.prompt}</p>
        <p className="text-xs text-muted-foreground">Pressione a combinação correta o mais rápido possível!</p>
      </div>

      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-4 text-center text-sm font-semibold",
              feedback === "correct" ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {feedback === "correct"
              ? "✅ Rápido e certeiro!"
              : `❌ A combinação era ${(current.keys ?? []).join(" + ").toUpperCase()}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
