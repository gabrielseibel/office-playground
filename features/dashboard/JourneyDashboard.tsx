"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Dices, Trophy, GraduationCap, Crown, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import { XPBar } from "@/components/game/XPBar";
import { ACTIVITIES } from "@/data/activities";

const TOTALS = {
  word: ACTIVITIES.filter((a) => a.app === "word").length,
  excel: ACTIVITIES.filter((a) => a.app === "excel").length,
  ppt: ACTIVITIES.filter((a) => a.app === "ppt").length,
};

const QUICK_LINKS = [
  { href: "/trilha", emoji: "🧭", label: "Trilha", icon: Compass, color: "from-slate-500 to-slate-700" },
  { href: "/jogos", emoji: "🎮", label: "Arcade", icon: Dices, color: "from-purple-500 to-pink-600" },
  { href: "/conquistas", emoji: "🏆", label: "Conquistas", icon: Trophy, color: "from-amber-500 to-orange-600" },
  { href: "/sala-de-aula", emoji: "🎓", label: "Sala de Aula", icon: GraduationCap, color: "from-indigo-500 to-blue-700" },
  { href: "/desafio-mestre", emoji: "👑", label: "Desafio Mestre", icon: Crown, color: "from-rose-500 to-amber-500" },
];

export function JourneyDashboard() {
  const { state, mounted } = useProgress();

  // Sem progresso ainda: não empurrar um dashboard vazio para quem acabou de chegar.
  if (!mounted || state.attempts === 0) return null;

  const apps: Array<"word" | "excel" | "ppt"> = ["word", "excel", "ppt"];
  const leastPracticed = apps.sort(
    (a, b) => state.correctByApp[a] / Math.max(1, TOTALS[a]) - state.correctByApp[b] / Math.max(1, TOTALS[b])
  )[0];

  return (
    <section className="relative isolate mx-auto max-w-7xl px-4 pt-8 md:px-6" aria-label="Sua jornada">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <XPBar />

        <div className="rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-semibold">Continuar aprendendo</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Recomendação: pratique mais {leastPracticed === "word" ? "Word 📝" : leastPracticed === "excel" ? "Excel 📊" : "PowerPoint 🎨"}.
          </p>
          <Link
            href={`/trilha?app=${leastPracticed}`}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:scale-105"
          >
            ▶ Continuar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-4 text-center backdrop-blur-md transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
          >
            <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-20 blur-xl", link.color)} />
            <div className={cn("mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-lg text-white", link.color)}>
              {link.emoji}
            </div>
            <span className="text-sm font-semibold">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
