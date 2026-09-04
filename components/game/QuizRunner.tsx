"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, ArrowRight, Zap } from "lucide-react";
import { recordAnswer } from "@/lib/progress";
import { ActivityCard } from "./ActivityCard";
import type { Activity } from "@/types/game";
import { shuffled } from "@/data/activities";

interface QuizRunnerProps {
  activities: Activity[];
  /** How many questions per round (default: all, capped at 8). */
  length?: number;
  /** Auto-advance delay after an answer, ms. */
  advanceDelay?: number;
}

export function QuizRunner({ activities, length = 8, advanceDelay = 1800 }: QuizRunnerProps) {
  const [pool, setPool] = React.useState<Activity[]>(() =>
    shuffled(activities).slice(0, Math.min(length, activities.length))
  );
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [waiting, setWaiting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const current = pool[index];

  function handleComplete(result: { correct: boolean; timeMs: number }) {
    if (!current) return;
    setWaiting(true);
    recordAnswer({
      app: current.app,
      category: current.category,
      correct: result.correct,
      timeMs: result.timeMs,
      points: current.points,
      isShortcut: current.type === "shortcut",
    });
    if (result.correct) {
      setScore((s) => s + current.points);
      setCorrectCount((c) => c + 1);
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
    }
    window.setTimeout(() => {
      setWaiting(false);
      if (index + 1 >= pool.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, advanceDelay);
  }

  function playAgain() {
    setPool(shuffled(activities).slice(0, Math.min(length, activities.length)));
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    setCombo(0);
    setDone(false);
    setWaiting(false);
  }

  if (pool.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma atividade encontrada para este filtro. Tente outra combinação de programa e dificuldade.
      </p>
    );
  }

  if (done) {
    const stars = Math.max(1, Math.round((correctCount / pool.length) * 5));
    return (
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-3 text-2xl font-bold">
          Você acertou {correctCount}/{pool.length}!
        </h3>
        <p className="mt-1 text-lg">{"⭐".repeat(stars)}{"☆".repeat(5 - stars)}</p>
        <p className="mt-2 text-muted-foreground">
          +{score} XP conquistados{combo >= 3 ? ` · combo máximo x${combo}` : ""}
        </p>
        <button
          onClick={playAgain}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-muted-foreground">
          Questão {index + 1} de {pool.length}
        </span>
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
              <Zap className="h-3.5 w-3.5" /> combo x{combo}
            </span>
          )}
          <span className="inline-flex items-center gap-1 font-mono text-purple-700 dark:text-purple-300">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" /> {score} XP
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <ActivityCard activity={current} onComplete={handleComplete} />
        </motion.div>
      </AnimatePresence>

      {waiting && index + 1 < pool.length && (
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            Próxima pergunta <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      )}
    </div>
  );
}

export function difficultyDot(d: string) {
  return d === "facil" ? "🟢" : d === "medio" ? "🟡" : "🔴";
}
