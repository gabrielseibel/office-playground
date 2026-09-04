"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Compass,
  FileText,
  Sheet,
  Presentation,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniChallenge } from "@/components/common/MiniChallenge";
import { useProgress } from "@/lib/progress";
import { lessonsForApp, LESSON_TOTALS, type LessonApp } from "@/data/lessons";

const APP_META: Record<
  LessonApp,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    text: string;
    chip: string;
    ring: string;
    labPath: string;
  }
> = {
  word: {
    name: "Word",
    icon: FileText,
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    text: "text-blue-700 dark:text-blue-300",
    chip: "bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
    ring: "ring-blue-500",
    labPath: "/word",
  },
  excel: {
    name: "Excel",
    icon: Sheet,
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    ring: "ring-emerald-500",
    labPath: "/excel",
  },
  ppt: {
    name: "PowerPoint",
    icon: Presentation,
    gradient: "from-orange-500 via-red-500 to-amber-600",
    text: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
    ring: "ring-orange-500",
    labPath: "/powerpoint",
  },
};

const APP_ORDER: LessonApp[] = ["word", "excel", "ppt"];

function isLessonApp(value: string | null): value is LessonApp {
  return value === "word" || value === "excel" || value === "ppt";
}

export function TrilhaPage() {
  const { state, mounted, completeLesson } = useProgress();
  const searchParams = useSearchParams();
  const requestedApp = searchParams.get("app");
  const [active, setActive] = React.useState<LessonApp>(
    isLessonApp(requestedApp) ? requestedApp : "word"
  );
  const [openLesson, setOpenLesson] = React.useState<string | null>(null);

  const lessons = lessonsForApp(active);
  const completedIds = new Set(state.completedLessons);
  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const total = LESSON_TOTALS[active];
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const meta = APP_META[active];
  const Icon = meta.icon;

  // Abre automaticamente a primeira lição não concluída ao trocar de app.
  React.useEffect(() => {
    if (!mounted) return;
    const next = lessons.find((l) => !completedIds.has(l.id));
    setOpenLesson(next?.id ?? lessons[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mounted]);

  function handleComplete(lessonId: string, index: number) {
    completeLesson(lessonId);
    const nextLesson = lessons[index + 1];
    if (nextLesson) {
      setTimeout(() => setOpenLesson(nextLesson.id), 400);
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-background to-indigo-50/30 dark:from-slate-950/40 dark:via-background dark:to-indigo-950/10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            href="/#inicio"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300">
            <Compass className="h-3 w-3" />
            Trilha de aprendizagem
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Do zero até{" "}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-orange-600 bg-clip-text text-transparent">
              dominar o Office
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Um passo de cada vez: leia a mini aula, responda o desafio e siga
            para o próximo. Sem pular etapas, sem enrolação.
          </p>
        </motion.div>

        {/* Seletor de app */}
        <div className="mx-auto mt-8 flex max-w-md items-center gap-1 rounded-2xl border border-white/20 bg-white/60 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          {APP_ORDER.map((app) => {
            const m = APP_META[app];
            const AppIcon = m.icon;
            const isActive = app === active;
            const done = lessonsForApp(app).filter((l) => completedIds.has(l.id)).length;
            return (
              <button
                key={app}
                onClick={() => setActive(app)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? cn("bg-gradient-to-r text-white shadow-md", m.gradient)
                    : "text-foreground/60 hover:bg-white/50 dark:hover:bg-white/5"
                )}
              >
                <AppIcon className="h-4 w-4" />
                {m.name}
                {mounted && (
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 text-[10px] font-bold",
                      isActive ? "bg-white/25" : "bg-foreground/10"
                    )}
                  >
                    {done}/{LESSON_TOTALS[app]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progresso do app selecionado */}
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/60 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <Icon className={cn("h-4 w-4", meta.text)} />
              Trilha do {meta.name}
            </span>
            <span className="text-muted-foreground">
              {completedCount}/{total} lições · {pct}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-foreground/10">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", meta.gradient)}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className={cn("mt-3 text-xs font-semibold", meta.text)}>
              🎉 Trilha concluída! Bora praticar no{" "}
              <Link href={meta.labPath} className="underline underline-offset-2">
                Laboratório
              </Link>{" "}
              ou no{" "}
              <Link href="/jogos" className="underline underline-offset-2">
                Arcade
              </Link>
              .
            </p>
          )}
        </div>

        {/* Roteiro de lições */}
        <ol className="relative mt-8 space-y-3 pb-16">
          {lessons.map((lesson, index) => {
            const done = completedIds.has(lesson.id);
            const isOpen = openLesson === lesson.id;
            const prevDone = index === 0 || completedIds.has(lessons[index - 1].id);
            return (
              <li key={lesson.id} className="relative">
                {index < lessons.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[19px] top-11 h-[calc(100%-4px)] w-0.5",
                      done ? cn("bg-gradient-to-b", meta.gradient) : "bg-foreground/10"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl border transition",
                    isOpen
                      ? "border-white/30 bg-white/90 shadow-soft-lg backdrop-blur-md dark:border-white/15 dark:bg-white/10"
                      : "border-white/20 bg-white/70 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  <button
                    onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-bold shadow-sm",
                        done
                          ? cn("bg-gradient-to-br text-white", meta.gradient)
                          : prevDone
                          ? "border-2 border-dashed border-foreground/25 text-foreground/60"
                          : "border-2 border-dashed border-foreground/10 text-foreground/50"
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : lesson.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {index + 1}. {lesson.title}
                      </span>
                      {!isOpen && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {lesson.summary}
                        </span>
                      )}
                    </span>
                    {!prevDone && !done && (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                    )}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 px-4 pb-5 pt-1 md:px-5">
                          <p className="text-sm leading-relaxed text-foreground/80">
                            {lesson.summary}
                          </p>
                          <ul className="space-y-1.5">
                            {lesson.points.map((point, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-foreground/70"
                              >
                                <span
                                  className={cn(
                                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br",
                                    meta.gradient
                                  )}
                                />
                                {point}
                              </li>
                            ))}
                          </ul>

                          <MiniChallenge
                            key={lesson.id}
                            question={lesson.practice.question}
                            options={lesson.practice.options}
                            correctIndex={lesson.practice.correctIndex}
                            explanation={lesson.practice.explanation}
                            app={meta.name}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <Link
                              href={meta.labPath}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                              Praticar no Laboratório <ArrowRight className="h-3 w-3" />
                            </Link>
                            {done ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold",
                                  meta.chip
                                )}
                              >
                                <Check className="h-3.5 w-3.5" /> Lição concluída
                              </span>
                            ) : (
                              <button
                                onClick={() => handleComplete(lesson.id, index)}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2 text-xs font-semibold text-white shadow hover:scale-105",
                                  meta.gradient
                                )}
                              >
                                Concluir lição · +30 XP <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
