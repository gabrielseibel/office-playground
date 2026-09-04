"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENT_EVENT, LEVELUP_EVENT } from "@/lib/progress";
import { ACHIEVEMENTS } from "@/data/achievements";

const CONFETTI_EMOJI = ["🎉", "✨", "⭐", "🎊", "💥"];

interface Popup {
  kind: "achievement" | "levelup";
  id: string;
  icon: string;
  name: string;
  description: string;
}

export function AchievementListener() {
  const [queue, setQueue] = React.useState<Popup[]>([]);
  const current = queue[0];

  React.useEffect(() => {
    function onAchievement(e: Event) {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      const achievement = ACHIEVEMENTS.find((a) => a.id === detail.id);
      if (!achievement) return;
      setQueue((q) => [
        ...q,
        {
          kind: "achievement",
          id: achievement.id,
          icon: achievement.icon,
          name: achievement.name,
          description: achievement.description,
        },
      ]);
    }
    function onLevelUp(e: Event) {
      const detail = (e as CustomEvent<{ level: number }>).detail;
      setQueue((q) => [
        ...q,
        {
          kind: "levelup",
          id: `level-${detail.level}`,
          icon: "🚀",
          name: `Nível ${detail.level}`,
          description: "Você subiu de nível! Continue praticando Word, Excel e PowerPoint.",
        },
      ]);
    }
    window.addEventListener(ACHIEVEMENT_EVENT, onAchievement);
    window.addEventListener(LEVELUP_EVENT, onLevelUp);
    return () => {
      window.removeEventListener(ACHIEVEMENT_EVENT, onAchievement);
      window.removeEventListener(LEVELUP_EVENT, onLevelUp);
    };
  }, []);

  function dismiss() {
    setQueue((q) => q.slice(1));
  }

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{
                  top: "-10%",
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  top: "110%",
                  rotate: Math.random() > 0.5 ? 360 : -360,
                  opacity: 0,
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  delay: Math.random() * 0.4,
                  ease: "easeIn",
                }}
              >
                {CONFETTI_EMOJI[i % CONFETTI_EMOJI.length]}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white p-8 text-center shadow-2xl dark:border-white/10 dark:bg-[#141420]"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-purple-600 dark:text-purple-300">
              {current.kind === "achievement" ? "Conquista desbloqueada!" : "Novo nível!"}
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-4xl shadow-lg"
            >
              {current.icon}
            </motion.div>
            <h3 className="mt-4 text-xl font-bold">{current.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{current.description}</p>
            {current.kind === "achievement" && (
              <p className="mt-2 text-sm font-semibold text-amber-600 dark:text-amber-400">+100 XP</p>
            )}
            <button
              onClick={dismiss}
              className="mt-6 w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
