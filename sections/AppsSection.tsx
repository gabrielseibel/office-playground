"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Sheet,
  Presentation,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { APPS } from "@/lib/data";
import { FadeIn, ScaleIn } from "@/components/ui/template";
import type { AppId } from "@/types";

const ICONS = { word: FileText, excel: Sheet, ppt: Presentation } as const;
const SLUGS = { word: "/word", excel: "/excel", ppt: "/powerpoint" } as const;

const ACCENTS: Record<AppId, { ring: string; text: string; chip: string }> = {
  word: {
    ring: "shadow-[0_30px_60px_-20px_rgba(43,87,154,0.5)]",
    text: "text-blue-700 dark:text-blue-300",
    chip: "bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  },
  excel: {
    ring: "shadow-[0_30px_60px_-20px_rgba(33,115,70,0.5)]",
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  ppt: {
    ring: "shadow-[0_30px_60px_-20px_rgba(210,71,38,0.5)]",
    text: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
  },
};

export function AppsSection() {
  return (
    <section
      id="aplicativos"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Aplicativos"
    >
      <div className="absolute inset-0 -z-10 bg-dot opacity-50" />
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <Sparkles className="h-3 w-3" />
              Três mundos para descobrir
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Escolha por onde quer{" "}
              <span className="gradient-text">começar</span>.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Cada cartão é uma porta de entrada para um laboratório completo,
              cheio de botões, animações e brincadeiras para aprender fazendo.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {APPS.map((app, i) => {
            const accent = ACCENTS[app.id];
            const Icon = ICONS[app.id];
            return (
              <FadeIn key={app.id} delay={i * 0.1}>
                <Link
                  href={SLUGS[app.id]}
                  className="group block focus-ring rounded-3xl"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`relative h-full overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-8 backdrop-blur-md transition-all duration-500 hover:border-transparent dark:border-white/10 dark:bg-white/5 ${accent.ring}`}
                  >
                    <div
                      aria-hidden
                      className={`absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${app.gradient} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40`}
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <motion.div
                          whileHover={{ rotate: 8, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${app.gradient} text-white shadow-xl`}
                        >
                          <Icon className="h-7 w-7" />
                        </motion.div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${accent.chip}`}
                        >
                          Microsoft {app.name}
                        </span>
                      </div>

                      <h3 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">
                        {app.name}
                      </h3>
                      <p className={`mt-1 text-sm font-medium ${accent.text}`}>
                        {app.tagline}
                      </p>
                      <p className="mt-4 text-sm text-muted-foreground md:text-base">
                        {app.description}
                      </p>

                      <ScaleIn delay={0.1 * i}>
                        <AppMini app={app.id} />
                      </ScaleIn>

                      <motion.div
                        className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold ${accent.text}`}
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        Entrar no laboratório
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AppMini({ app }: { app: AppId }) {
  if (app === "word")
    return (
      <div className="mt-6 rounded-xl border border-blue-200/50 bg-blue-50/40 p-4 dark:border-blue-400/20 dark:bg-blue-400/5">
        <div className="space-y-2 text-xs">
          <div className="font-serif text-base font-semibold text-foreground">
            Meu documento
          </div>
          <div className="h-1 w-3/4 rounded bg-blue-300/60" />
          <div className="h-1 w-2/3 rounded bg-blue-300/60" />
          <div className="h-1 w-1/2 rounded bg-blue-300/60" />
        </div>
      </div>
    );

  if (app === "excel")
    return (
      <div className="mt-6 grid grid-cols-4 gap-1 rounded-xl border border-emerald-200/50 bg-emerald-50/40 p-2 dark:border-emerald-400/20 dark:bg-emerald-400/5">
        {[
          "A1",
          "12",
          "34",
          "23",
          "B1",
          "45",
          "22",
          "67",
          "C1",
          "33",
          "89",
          "21",
          "Σ",
          "90",
          "145",
          "111",
        ].map((c, i) => (
          <div
            key={i}
            className={`grid h-6 place-items-center rounded text-[10px] font-medium ${
              c === "Σ"
                ? "bg-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-white/60 text-foreground/70 dark:bg-white/5"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    );

  return (
    <div className="mt-6 space-y-2 rounded-xl border border-orange-200/50 bg-orange-50/40 p-3 dark:border-orange-400/20 dark:bg-orange-400/5">
      <div className="aspect-[16/9] rounded-md bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-500/40 dark:to-orange-700/40" />
      <div className="h-1 w-2/3 rounded bg-orange-300/60" />
    </div>
  );
}
