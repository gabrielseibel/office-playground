"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Compass,
  ArrowRight,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import { HeroCanvas } from "@/components/illustrations/HeroCanvas";
import { FadeIn, ScaleIn } from "@/components/ui/template";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-label="Apresentação"
      className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <div className="absolute inset-0 -z-20 bg-grid opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
      {/*
        Blobs de fundo: estáticos de propósito. Eram animados com
        `animate-gradient` (troca a background-position em loop infinito),
        mas como o fundo aqui é uma cor sólida (não um gradiente), a animação
        não mudava nada visualmente — só ficava recalculando um blur enorme
        (480px) sem parar e pesando a página. Removida.
      */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute top-40 -right-20 h-[360px] w-[360px] rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[360px] w-[360px] rounded-full bg-emerald-400/30 blur-3xl" />
      </div>

      <HeroCanvas />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/60 px-4 py-1.5 text-xs font-medium text-foreground/80 shadow-soft backdrop-blur-md dark:bg-white/5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Um playground digital para descobrir o Office
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Aprenda{" "}
            <span className="text-gradient-word">Word</span>,{" "}
            <span className="text-gradient-excel">Excel</span> e{" "}
            <span className="text-gradient-ppt">PowerPoint</span>{" "}
            explorando e se divertindo.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            Toque, arraste, brinque. Sem login, sem cadastro, sem trilha chata —
            só laboratórios vivos, animações e desafios rápidos que ensinam
            enquanto você joga.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#aplicativos">
                <Compass className="h-5 w-5" />
                Explorar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/jogos">
                <Play className="h-5 w-5" />
                Começar
              </Link>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                <MousePointer2 className="h-3.5 w-3.5" />
              </span>
              100% interativo
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                ✓
              </span>
              Sem login
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300">
                ★
              </span>
              Feito com diversão
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-purple-600/10 text-purple-700 dark:bg-purple-400/15 dark:text-purple-300">
                ♥
              </span>
              Para todas as idades
            </span>
          </div>
        </FadeIn>
      </div>

      <ScaleIn delay={0.6}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="grid h-10 w-6 place-items-center rounded-full border border-foreground/15 bg-white/40 backdrop-blur-sm dark:bg-white/5">
            <div className="h-2 w-1 animate-pulse rounded-full bg-foreground/40" />
          </div>
        </motion.div>
      </ScaleIn>
    </section>
  );
}
