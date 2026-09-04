"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Sparkles, X, Check } from "lucide-react";
import { COMPARISONS } from "@/lib/data";
import { FadeIn } from "@/components/ui/template";
import { cn } from "@/lib/utils";

const COLORS = {
  word: { ring: "border-blue-300/40", bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-300" },
  excel: { ring: "border-emerald-300/40", bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300" },
  ppt: { ring: "border-orange-300/40", bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-300" },
} as const;

export function ComparisonSection() {
  const [index, setIndex] = React.useState(0);
  const item = COMPARISONS[index];
  const c = COLORS[item.app];

  return (
    <section
      id="comparacoes"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Comparações"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-50/40 to-transparent dark:via-purple-950/10" />
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/10 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">
              <Sparkles className="h-3 w-3" />
              Antes vs Depois
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Pequenas mudanças.{" "}
              <span className="gradient-text">Grandes diferenças.</span>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Veja como alguns ajustes rápidos transformam completamente o
              resultado.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {COMPARISONS.map((cmp, i) => (
              <button
                key={cmp.title}
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  i === index
                    ? `${COLORS[cmp.app].bg} ${COLORS[cmp.app].text}`
                    : "text-foreground/60 hover:bg-white/40 dark:hover:bg-white/5"
                )}
              >
                {cmp.title}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bad-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-3xl border border-dashed border-rose-300/60 bg-rose-500/5 p-6 dark:border-rose-500/30 dark:bg-rose-500/5"
              >
                <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-rose-500/15 text-rose-600">
                  <X className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-600/80">
                  Antes
                </span>
                <p className="mt-3 text-base font-medium text-foreground/85">
                  {item.bad}
                </p>
                <MockVisual app={item.app} variant="bad" />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`grid h-12 w-12 place-items-center rounded-full border ${c.ring} ${c.bg}`}
              >
                <ArrowDown className={`h-5 w-5 ${c.text}`} />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`good-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                className={`relative overflow-hidden rounded-3xl border ${c.ring} bg-gradient-to-br p-6`}
                style={{
                  backgroundImage: c.bg
                    ? undefined
                    : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                }}
              >
                <div
                  className={`absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full ${c.bg} ${c.text}`}
                >
                  <Check className="h-4 w-4" />
                </div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${c.text}`}
                >
                  Depois
                </span>
                <p className="mt-3 text-base font-medium text-foreground">
                  {item.good}
                </p>
                <MockVisual app={item.app} variant="good" />
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function MockVisual({
  app,
  variant,
}: {
  app: "word" | "excel" | "ppt";
  variant: "bad" | "good";
}) {
  const bad = variant === "bad";
  if (app === "word") {
    return (
      <div className="mt-6 space-y-2 rounded-xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        {bad ? (
          <>
            <div className="text-sm leading-tight">
              sem título.docx texto confuso sem paragrafos e sem estilo limpo
              com letras de todo tamanho
            </div>
          </>
        ) : (
          <>
            <h4 className="text-base font-bold">Relatório Anual</h4>
            <div className="h-1 w-12 rounded bg-blue-500" />
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">
              Um documento bem estruturado ajuda qualquer leitor a encontrar o
              que precisa em segundos.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-foreground/70">
              <li>• Introdução clara</li>
              <li>• Resultados principais</li>
            </ul>
          </>
        )}
      </div>
    );
  }
  if (app === "excel") {
    return (
      <div className="mt-6 rounded-xl border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {bad ? (
            <>
              <div className="rounded bg-rose-100 p-3 dark:bg-rose-500/10">
                aaa
              </div>
              <div className="rounded bg-orange-100 p-3 dark:bg-orange-500/10">
                bbb
              </div>
              <div className="rounded bg-yellow-100 p-3 dark:bg-yellow-500/10">
                ccc
              </div>
              <div className="rounded bg-green-100 p-3 dark:bg-green-500/10">
                999
              </div>
              <div className="rounded bg-cyan-100 p-3 dark:bg-cyan-500/10">
                1
              </div>
              <div className="rounded bg-pink-100 p-3 dark:bg-pink-500/10">
                teste
              </div>
            </>
          ) : (
            <>
              <div className="rounded bg-emerald-100 p-3 dark:bg-emerald-500/10">
                Jan
              </div>
              <div className="rounded bg-emerald-100 p-3 dark:bg-emerald-500/10">
                Fev
              </div>
              <div className="rounded bg-emerald-100 p-3 dark:bg-emerald-500/10">
                Mar
              </div>
              <div className="rounded bg-white p-3 dark:bg-white/5">R$ 1.2k</div>
              <div className="rounded bg-white p-3 dark:bg-white/5">R$ 1.8k</div>
              <div className="rounded bg-white p-3 dark:bg-white/5">R$ 2.1k</div>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg">
        {bad ? (
          <div className="grid h-full w-full place-items-center bg-orange-100 p-3 text-center text-xs text-orange-900 dark:bg-orange-500/20 dark:text-orange-200">
            texto texto texto texto texto texto texto texto texto texto texto
            texto texto texto texto texto
          </div>
        ) : (
          <div className="grid h-full w-full grid-cols-2 gap-2 bg-gradient-to-br from-amber-100 to-orange-200 p-3 dark:from-orange-500/30 dark:to-red-500/20">
            <div className="rounded bg-white/60 text-[10px] font-bold text-orange-900 grid place-items-center dark:bg-white/10 dark:text-orange-200">
              2x vendas
            </div>
            <div className="rounded bg-white/60 grid place-items-center dark:bg-white/10">
              <svg viewBox="0 0 32 32" className="h-8 w-8 text-orange-700">
                <path
                  fill="currentColor"
                  d="M16 2 L4 18 L13 18 L13 30 L19 30 L19 18 L28 18 Z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
