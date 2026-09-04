"use client";

import * as React from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { CURIOSITIES } from "@/lib/data";
import { FadeIn } from "@/components/ui/template";

export function CuriositiesSection() {
  return (
    <section
      id="curiosidades"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Curiosidades"
    >
      <div className="absolute inset-0 -z-10 bg-dot opacity-40" />
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-300">
              <Lightbulb className="h-3 w-3" />
              Você sabia?
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Pequenas histórias que{" "}
              <span className="gradient-text">encantam</span>.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Fatos rápidos e divertidos que deixam qualquer conversa mais
              interessante no cafezinho.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3">
          {CURIOSITIES.map((c, i) => (
            <FadeIn key={i} delay={(i % 6) * 0.05}>
              <article
                className="mb-5 break-inside-avoid rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-white/10 dark:bg-white/5"
                style={{
                  background: getCardGradient(c.app, i),
                }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  {c.app === "all" ? "Geral" : `Microsoft ${c.app}`}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/75">{c.text}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function getCardGradient(app: string, i: number) {
  const palettes = [
    "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.05))",
    "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.05))",
    "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(244,114,182,0.05))",
    "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.05))",
    "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(34,197,94,0.05))",
  ];
  const base =
    app === "word"
      ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.05))"
      : app === "excel"
      ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.05))"
      : app === "ppt"
      ? "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(244,114,182,0.05))"
      : palettes[i % palettes.length];
  return base;
}
