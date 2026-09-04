"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Check, X, Zap } from "lucide-react";
import { CHALLENGES } from "@/lib/data";
import { FadeIn } from "@/components/ui/template";
import { cn } from "@/lib/utils";

type State = "idle" | "correct" | "wrong";

interface CardState {
  state: State;
  selected: number | null;
}

const COLORS = {
  word: { ring: "from-blue-500 to-indigo-600" },
  excel: { ring: "from-emerald-500 to-green-700" },
  ppt: { ring: "from-orange-500 to-red-600" },
  all: { ring: "from-purple-500 to-pink-600" },
} as const;

export function ChallengeSection() {
  const [index, setIndex] = React.useState(0);
  const [card, setCard] = React.useState<CardState>({
    state: "idle",
    selected: null,
  });
  const question = CHALLENGES[index];

  function pick(i: number) {
    if (card.state !== "idle") return;
    setCard({
      state: i === question.correctIndex ? "correct" : "wrong",
      selected: i,
    });
  }

  function next() {
    setCard({ state: "idle", selected: null });
    setIndex((i) => (i + 1) % CHALLENGES.length);
  }

  function reset() {
    setCard({ state: "idle", selected: null });
  }

  return (
    <section
      id="desafios"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Mini desafios"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent dark:via-emerald-950/10" />
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
              <Zap className="h-3 w-3" />
              Mini desafios
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Responda, descubra,{" "}
              <span className="gradient-text">avance</span>.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Perguntas rápidas para testar o que você acabou de aprender.
              Sem pontos, sem ranking — só para confirmar a aprendizagem.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mt-12 overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-6 backdrop-blur-md shadow-soft-lg dark:border-white/10 dark:bg-white/5 md:p-8"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                COLORS[question.app].ring
              }`}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Desafio {index + 1} de {CHALLENGES.length}
              </span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-white/40 dark:hover:bg-white/5"
              >
                <RotateCcw className="h-3 w-3" /> reiniciar
              </button>
            </div>

            <h3 className="mt-4 text-xl font-semibold leading-snug md:text-2xl">
              {question.question}
            </h3>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {question.options.map((opt, i) => {
                const correct = question.correctIndex === i;
                const selected = card.selected === i;
                const showResult = card.state !== "idle";

                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={card.state !== "idle"}
                    aria-pressed={selected}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition disabled:cursor-not-allowed",
                      "border-white/20 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                      showResult &&
                        correct &&
                        "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                      showResult &&
                        selected &&
                        !correct &&
                        "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold",
                        showResult && correct
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : showResult && selected && !correct
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-foreground/20 bg-white text-foreground/70 dark:bg-white/10"
                      )}
                    >
                      {showResult && correct ? (
                        <Check className="h-4 w-4" />
                      ) : showResult && selected && !correct ? (
                        <X className="h-4 w-4" />
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
              {card.state !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm",
                    card.state === "correct"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200"
                  )}
                >
                  {card.state === "correct" ? (
                    <Check className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <X className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <strong>
                      {card.state === "correct"
                        ? "Correto!"
                        : "Quase lá!"}
                    </strong>
                    <p className="mt-1 leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                  <button
                    onClick={next}
                    className="ml-auto shrink-0 rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                  >
                    Próximo →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
