"use client";

import * as React from "react";
import { Heart, BookOpen, Users, Sparkles, MousePointer2 } from "lucide-react";
import { FadeIn } from "@/components/ui/template";

const POINTS = [
  {
    icon: Heart,
    title: "Para todas as idades",
    description:
      "De crianças curiosas a avós aprendizes — se você consegue clicar, consegue aprender.",
  },
  {
    icon: MousePointer2,
    title: "Aprender fazendo",
    description:
      "Nada de leitura extensa. Mexa, arraste, brinque — e descubra o Office no toque.",
  },
  {
    icon: BookOpen,
    title: "Sem login nem cadastro",
    description:
      "Você chega e já começa a jogar. Sem criar conta — seu XP e suas conquistas ficam salvos neste navegador.",
  },
  {
    icon: Users,
    title: "Construído em comunidade",
    description:
      "Inspirado em produtos como Duolingo, Notion, Microsoft Fluent Design e Apple — feito para encantar.",
  },
];

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative isolate overflow-hidden py-24 md:py-32"
      aria-label="Sobre o projeto"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-blue-950/10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <FadeIn>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/10 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">
                <Sparkles className="h-3 w-3" />
                Sobre o playground
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Um parque de diversões para o{" "}
                <span className="gradient-text">Office</span>.
              </h2>
              <p className="mt-6 text-base text-muted-foreground md:text-lg">
                Imagine um lugar onde cada porta te leva para uma experiência:
                documentos que respondem aos seus cliques, planilhas que
                calculam enquanto você digita, slides que se montam como um
                LEGO. Esse lugar é o Office Playground.
              </p>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Aqui a ideia é simples: você aprende melhor quando está se
                divertindo. Por isso tudo é clicável, animado e interativo.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              {POINTS.map((p, i) => (
                <FadeIn key={p.title} delay={0.1 + i * 0.05}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-soft-lg dark:border-white/10 dark:bg-white/5">
                    <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500 via-emerald-500 to-orange-500 text-white shadow-lg shadow-blue-500/30">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-10 text-white shadow-soft-lg md:p-14">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-cyan-300 blur-3xl" />
            </div>
            <div className="relative grid items-center gap-8 md:grid-cols-[2fr_1fr]">
              <div>
                <h3 className="text-2xl font-bold md:text-4xl">
                  Pronto para começar?
                </h3>
                <p className="mt-3 max-w-xl text-base text-white/80 md:text-lg">
                  Escolha um aplicativo, abra o laboratório e brinque. Você vai
                  aprender mais em cinco minutos aqui do que em horas de tutoriais.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="#aplicativos"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                >
                  Explorar os laboratórios
                </a>
                <a
                  href="/jogos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Jogar agora
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
