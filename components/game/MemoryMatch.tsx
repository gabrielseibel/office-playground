"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import type { AppId } from "@/types/game";

export interface MemoryPair {
  a: string;
  b: string;
}

interface Card {
  id: number;
  pairId: number;
  label: string;
  side: "a" | "b";
  flipped: boolean;
  matched: boolean;
}

function buildDeck(pairs: MemoryPair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach((pair, i) => {
    cards.push({ id: i * 2, pairId: i, label: pair.a, side: "a", flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, pairId: i, label: pair.b, side: "b", flipped: false, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoryMatch({ pairs, app }: { pairs: MemoryPair[]; app: AppId }) {
  const [cards, setCards] = React.useState<Card[]>(() => buildDeck(pairs));
  const [firstPick, setFirstPick] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [moves, setMoves] = React.useState(0);
  const startRef = React.useRef(performance.now());

  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const totalPairs = pairs.length;

  function reset() {
    setCards(buildDeck(pairs));
    setFirstPick(null);
    setMoves(0);
    startRef.current = performance.now();
  }

  function flip(id: number) {
    if (busy) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched || card.flipped) return;

    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(next);

    if (firstPick === null) {
      setFirstPick(id);
      return;
    }

    setBusy(true);
    setMoves((m) => m + 1);
    const first = next.find((c) => c.id === firstPick)!;
    const second = next.find((c) => c.id === id)!;
    const isMatch = first.pairId === second.pairId && first.side !== second.side;

    window.setTimeout(() => {
      if (isMatch) {
        setCards((cs) => cs.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c)));
        if (matchedPairs + 1 === totalPairs) {
          recordAnswer({ app, category: "interatividade", correct: true, timeMs: performance.now() - startRef.current, points: 200 });
        }
      } else {
        setCards((cs) => cs.map((c) => (c.flipped && !c.matched ? { ...c, flipped: false } : c)));
      }
      setFirstPick(null);
      setBusy(false);
    }, isMatch ? 500 : 850);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Trophy className="h-4 w-4 text-yellow-500" />
          {matchedPairs}/{totalPairs} pares · {moves} jogadas
        </span>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-3 w-3" /> reiniciar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            disabled={c.matched}
            className={cn(
              "relative flex aspect-[4/3] items-center justify-center rounded-2xl border p-2 text-center text-xs font-semibold shadow-sm transition sm:text-sm",
              c.matched
                ? "border-emerald-400/60 bg-emerald-100/60 dark:bg-emerald-400/10"
                : c.flipped
                ? "border-white/30 bg-white/90 dark:bg-white/10"
                : "border-white/20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-transparent",
              !c.matched && "hover:scale-105"
            )}
          >
            {c.flipped || c.matched ? <span>{c.label}</span> : <span className="text-2xl text-white">?</span>}
          </button>
        ))}
      </div>

      {matchedPairs === totalPairs && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-100/50 p-4 text-center text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
        >
          🎉 Parabéns! Você encontrou todos os pares em {moves} jogadas.
        </motion.div>
      )}
    </div>
  );
}
