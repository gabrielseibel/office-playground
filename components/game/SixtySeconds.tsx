"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Timer, Trophy, RotateCcw, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import { ACTIVITIES, shuffled } from "@/data/activities";
import { ActivityCard } from "./ActivityCard";

const DURATION = 60;
// Fast-paced types only — no drag/keyboard rounds here, the clock is ruthless.
const POOL = ACTIVITIES.filter((a) => a.type === "mcq" || a.type === "true-false");

export function SixtySeconds() {
  const [queue, setQueue] = React.useState(() => shuffled(POOL));
  const [cursor, setCursor] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(DURATION);
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [bestCombo, setBestCombo] = React.useState(0);
  const [answeredCount, setAnsweredCount] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [comboFlash, setComboFlash] = React.useState<string | null>(null);

  const current = queue[cursor % queue.length];

  React.useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setDone(true);
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, secondsLeft]);

  function start() {
    setQueue(shuffled(POOL));
    setCursor(0);
    setSecondsLeft(DURATION);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setAnsweredCount(0);
    setDone(false);
    setRunning(true);
  }

  function handleComplete(result: { correct: boolean; timeMs: number }) {
    if (!running) return;
    recordAnswer({
      app: current.app,
      category: current.category,
      correct: result.correct,
      timeMs: result.timeMs,
      points: current.points,
    });
    setAnsweredCount((c) => c + 1);
    if (result.correct) {
      setScore((s) => s + current.points);
      setCombo((c) => {
        const next = c + 1;
        setBestCombo((b) => Math.max(b, next));
        if (next % 10 === 0) {
          setScore((s) => s + 300);
          flashCombo("🔥 Combo x10! +300");
        } else if (next % 5 === 0) {
          setScore((s) => s + 100);
          flashCombo("🔥 Combo x5! +100");
        } else if (next % 3 === 0) {
          setScore((s) => s + 50);
          flashCombo("🔥 Combo x3! +50");
        }
        return next;
      });
    } else {
      setCombo(0);
    }
    window.setTimeout(() => {
      setCursor((c) => c + 1);
    }, 350);
  }

  function flashCombo(text: string) {
    setComboFlash(text);
    window.setTimeout(() => setComboFlash(null), 900);
  }

  if (!running && !done) {
    return (
      <div className="text-center">
        <Timer className="mx-auto h-12 w-12 text-orange-500" />
        <h3 className="mt-3 text-2xl font-bold">Quantas você acerta em 60 segundos?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Perguntas rápidas de Word, Excel e PowerPoint. Combos de 3, 5 e 10 acertos seguidos dão pontos bônus.
        </p>
        <button
          onClick={start}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-105"
        >
          Começar ⏱️
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-3 text-2xl font-bold">Tempo esgotado!</h3>
        <p className="mt-2 text-muted-foreground">
          {answeredCount} respostas · {score} XP · melhor combo x{bestCombo}
        </p>
        <button
          onClick={start}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
            secondsLeft <= 10 ? "bg-rose-500/15 text-rose-600" : "bg-orange-500/10 text-orange-600"
          )}
        >
          <Timer className="h-4 w-4" /> {secondsLeft}s
        </span>
        <span className="text-xs text-muted-foreground">{score} XP · {answeredCount} respondidas</span>
        {combo > 1 && (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600">
            <Flame className="h-4 w-4" /> x{combo}
          </span>
        )}
      </div>

      {comboFlash && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-3 rounded-xl bg-orange-500/15 px-3 py-2 text-center text-sm font-bold text-orange-700 dark:text-orange-300"
        >
          {comboFlash}
        </motion.div>
      )}

      {current && <ActivityCard activity={current} onComplete={handleComplete} hideExplanation />}
    </div>
  );
}
