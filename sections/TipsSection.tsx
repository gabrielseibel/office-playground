"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Keyboard, Search, Filter } from "lucide-react";
import { SHORTCUTS } from "@/lib/data";
import { FadeIn } from "@/components/ui/template";
import { cn } from "@/lib/utils";
import type { AppId } from "@/types";

const FILTERS: { id: "all" | AppId; label: string; className: string }[] = [
  { id: "all", label: "Todos", className: "from-gray-500 to-gray-700" },
  { id: "word", label: "Word", className: "from-blue-500 to-blue-700" },
  { id: "excel", label: "Excel", className: "from-emerald-500 to-emerald-700" },
  {
    id: "ppt",
    label: "PowerPoint",
    className: "from-orange-500 to-orange-700",
  },
];

export function TipsSection() {
  const [filter, setFilter] = React.useState<"all" | AppId>("all");
  const [query, setQuery] = React.useState("");

  const shortcuts = SHORTCUTS.filter((s) => {
    const matchesFilter = filter === "all" || s.app === filter || s.app === "all";
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.keys.join("+").toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <section
      id="dicas"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Atalhos e dicas"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent dark:via-blue-950/20" />

      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-400/15 dark:text-purple-300">
              <Keyboard className="h-3 w-3" />
              Atalhos que viram superpoderes
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Domine o teclado, domine o Office.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Dezenas de combinações úteis — algumas parecem óbvias depois que
              você aprende.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar atalho… (ex: salvar, negrito, ctrl)"
                className="h-11 w-full rounded-xl border border-white/20 bg-white/60 pl-10 pr-4 text-sm text-foreground shadow-soft backdrop-blur-md transition placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="hidden h-4 w-4 text-muted-foreground sm:block" />
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition",
                    filter === f.id
                      ? `border-transparent bg-gradient-to-r ${f.className} text-white shadow`
                      : "border-white/20 bg-white/60 text-foreground/70 hover:bg-white dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.04}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {s.keys.map((k, idx) => (
                    <React.Fragment key={idx}>
                      <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-foreground/15 bg-gradient-to-b from-white to-gray-100 px-2 text-xs font-bold text-foreground shadow dark:from-white/10 dark:to-white/5 dark:text-foreground/90">
                        {k}
                      </kbd>
                      {idx < s.keys.length - 1 && (
                        <span className="text-xs text-muted-foreground">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.description}
                </p>
                {s.app !== "all" && (
                  <span
                    className={cn(
                      "absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      s.app === "word" &&
                        "bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
                      s.app === "excel" &&
                        "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
                      s.app === "ppt" &&
                        "bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300"
                    )}
                  >
                    {s.app}
                  </span>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {shortcuts.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Nenhum atalho encontrado. Tente outro termo.
          </p>
        )}
      </div>
    </section>
  );
}
