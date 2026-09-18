"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Gamepad2, Dices, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import { XPPill } from "@/components/game/XPBar";
import { ActivityCard, type ActivityResult } from "@/components/game/ActivityCard";
import { QuizRunner } from "@/components/game/QuizRunner";
import { FormattingDetective } from "@/components/game/FormattingDetective";
import { CellHunt } from "@/components/game/CellHunt";
import { KeyboardBattle } from "@/components/game/KeyboardBattle";
import { SixtySeconds } from "@/components/game/SixtySeconds";
import { ExcelFillGame } from "@/components/game/ExcelFillGame";
import { LightningPresentation } from "@/components/game/LightningPresentation";
import { MemoryMatch } from "@/components/game/MemoryMatch";
import { activitiesFor, ACTIVITIES } from "@/data/activities";
import { WORD_MEMORY_PAIRS, EXCEL_MEMORY_PAIRS, PPT_MEMORY_PAIRS, MIXED_MEMORY_PAIRS } from "@/data/memoryPairs";
import {
  DragGame,
  MemoryGame,
  QuizGame,
  ShortcutGame,
  PlanGame,
  SlideOrderGame,
} from "./GamesHub";
import type { AppId, Difficulty } from "@/types/game";

type AppFilter = AppId | "all";
type DifficultyFilter = Difficulty | "todas";

interface GameDef {
  id: string;
  app: AppFilter;
  difficulty: Difficulty;
  title: string;
  description: string;
  emoji: string;
  color: string;
  render: () => React.ReactNode;
}

function SingleActivityGame({ activityId }: { activityId: string }) {
  const [round, setRound] = React.useState(0);
  const activity = ACTIVITIES.find((a) => a.id === activityId)!;
  const [done, setDone] = React.useState(false);

  function handleComplete(result: ActivityResult) {
    recordAnswer({
      app: activity.app,
      category: activity.category,
      correct: result.correct,
      timeMs: result.timeMs,
      points: activity.points,
    });
    setDone(true);
  }

  return (
    <div>
      <ActivityCard key={round} activity={activity} onComplete={handleComplete} />
      {done && (
        <button
          onClick={() => {
            setRound((r) => r + 1);
            setDone(false);
          }}
          className="mt-4 inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-3 w-3" /> tentar de novo
        </button>
      )}
    </div>
  );
}

const GAMES: GameDef[] = [
  // WORD
  {
    id: "detetive-formatacao",
    app: "word",
    difficulty: "dificil",
    title: "Detetive da Formatação",
    description: "Um documento bagunçado esconde 5 erros de formatação. Clique em todos!",
    emoji: "🔎",
    color: "from-blue-500 to-indigo-700",
    render: () => <FormattingDetective />,
  },
  {
    id: "organize-documento",
    app: "word",
    difficulty: "medio",
    title: "Organize o Documento",
    description: "Arraste as partes de um trabalho escolar até a ordem correta.",
    emoji: "📄",
    color: "from-blue-500 to-indigo-700",
    render: () => <SingleActivityGame activityId="w-org-6" />,
  },
  {
    id: "palavras-em-acao",
    app: "word",
    difficulty: "facil",
    title: "Palavras em Ação",
    description: "Formatação de textos: negrito, itálico, alinhamento e muito mais.",
    emoji: "⚡",
    color: "from-blue-500 to-indigo-700",
    render: () => <QuizRunner activities={activitiesFor("word", "todas").filter((a) => a.category === "formatacao")} />,
  },
  {
    id: "situacoes-word",
    app: "word",
    difficulty: "medio",
    title: "Situações do Word",
    description: "Currículo, convite, carta formal — quando usar cada formatação.",
    emoji: "🗂️",
    color: "from-blue-500 to-indigo-700",
    render: () => <QuizRunner activities={activitiesFor("word", "todas").filter((a) => a.category === "situacoes-reais")} />,
  },
  {
    id: "word-memory",
    app: "word",
    difficulty: "facil",
    title: "Word Memory",
    description: "Encontre os pares: NEGRITO ↔ Ctrl+B, COPIAR ↔ Ctrl+C e mais.",
    emoji: "🧠",
    color: "from-blue-500 to-indigo-700",
    render: () => <MemoryMatch pairs={WORD_MEMORY_PAIRS} app="word" />,
  },

  // EXCEL
  {
    id: "caca-celula",
    app: "excel",
    difficulty: "facil",
    title: "Caça à Célula",
    description: "Encontre a célula certa numa grade que cresce a cada rodada.",
    emoji: "🎯",
    color: "from-emerald-500 to-green-700",
    render: () => <CellHunt />,
  },
  {
    id: "formulas-em-acao",
    app: "excel",
    difficulty: "medio",
    title: "Fórmulas em Ação",
    description: "SOMA, MÉDIA, MÁXIMO, MÍNIMO e CONT.NÚM na prática.",
    emoji: "🧮",
    color: "from-emerald-500 to-green-700",
    render: () => <QuizRunner activities={activitiesFor("excel", "todas").filter((a) => a.category === "formulas")} />,
  },
  {
    id: "situacoes-excel",
    app: "excel",
    difficulty: "medio",
    title: "Situações do Excel",
    description: "Mesada, lojinha, estoque — matemática do dia a dia com o Excel.",
    emoji: "🏪",
    color: "from-emerald-500 to-green-700",
    render: () => <QuizRunner activities={activitiesFor("excel", "todas").filter((a) => a.category === "situacoes-reais")} />,
  },
  {
    id: "grafico-certo",
    app: "excel",
    difficulty: "facil",
    title: "Gráfico Certo",
    description: "Pizza, barras ou linhas? Escolha o gráfico ideal para cada situação.",
    emoji: "📈",
    color: "from-emerald-500 to-green-700",
    render: () => <QuizRunner activities={activitiesFor("excel", "todas").filter((a) => a.category === "graficos")} />,
  },
  {
    id: "mercado-excel",
    app: "excel",
    difficulty: "medio",
    title: "Mercado do Excel",
    description: "Calcule o total, o troco e a quantidade de uma compra de verdade.",
    emoji: "🛒",
    color: "from-emerald-500 to-green-700",
    render: () => <ExcelFillGame />,
  },
  {
    id: "excel-memory",
    app: "excel",
    difficulty: "facil",
    title: "Excel Memory",
    description: "Combine células, fórmulas e conceitos do Excel em pares.",
    emoji: "🧠",
    color: "from-emerald-500 to-green-700",
    render: () => <MemoryMatch pairs={EXCEL_MEMORY_PAIRS} app="excel" />,
  },
  {
    id: "monte-planilha",
    app: "excel",
    difficulty: "medio",
    title: "Monte a Planilha",
    description: "Faça as vendas crescerem mês a mês e descubra o total geral.",
    emoji: "📊",
    color: "from-emerald-500 to-green-700",
    render: () => <PlanGame />,
  },

  // POWERPOINT
  {
    id: "slide-perfeito",
    app: "ppt",
    difficulty: "facil",
    title: "Slide Perfeito",
    description: "Design, contraste, hierarquia — o que faz um slide funcionar.",
    emoji: "✨",
    color: "from-orange-500 to-red-600",
    render: () => <QuizRunner activities={activitiesFor("ppt", "todas").filter((a) => a.category === "design")} />,
  },
  {
    id: "monte-slide",
    app: "ppt",
    difficulty: "medio",
    title: "Monte o Slide",
    description: "Organize título, texto, imagem, ícone e rodapé na ordem certa.",
    emoji: "🧩",
    color: "from-orange-500 to-red-600",
    render: () => <SingleActivityGame activityId="p-org-1" />,
  },
  {
    id: "monte-apresentacao",
    app: "ppt",
    difficulty: "medio",
    title: "Monte a Apresentação",
    description: "Coloque os blocos de uma apresentação na ordem narrativa ideal.",
    emoji: "🪄",
    color: "from-orange-500 to-red-600",
    render: () => <SlideOrderGame />,
  },
  {
    id: "situacoes-ppt",
    app: "ppt",
    difficulty: "medio",
    title: "Situações do PowerPoint",
    description: "Seminário, projeto, portfólio — qual apresentação combina com cada um.",
    emoji: "🎤",
    color: "from-orange-500 to-red-600",
    render: () => <QuizRunner activities={activitiesFor("ppt", "todas").filter((a) => a.category === "apresentacoes")} />,
  },
  {
    id: "apresentacao-relampago",
    app: "ppt",
    difficulty: "dificil",
    title: "Apresentação Relâmpago",
    description: "60 segundos para montar uma mini apresentação e receber sua avaliação.",
    emoji: "⚡",
    color: "from-orange-500 to-red-600",
    render: () => <LightningPresentation />,
  },
  {
    id: "ppt-memory",
    app: "ppt",
    difficulty: "facil",
    title: "PowerPoint Memory",
    description: "Slide, transição, animação, layout, tema — encontre os pares.",
    emoji: "🧠",
    color: "from-orange-500 to-red-600",
    render: () => <MemoryMatch pairs={PPT_MEMORY_PAIRS} app="ppt" />,
  },

  // GERAL
  {
    id: "qual-programa",
    app: "geral",
    difficulty: "facil",
    title: "Qual Programa?",
    description: "Uma tarefa aparece — escolha Word, Excel ou PowerPoint.",
    emoji: "🤔",
    color: "from-purple-500 to-pink-600",
    render: () => <QuizRunner activities={activitiesFor("geral", "todas").filter((a) => a.category === "qual-programa")} />,
  },
  {
    id: "verdadeiro-falso",
    app: "geral",
    difficulty: "facil",
    title: "Verdadeiro ou Falso",
    description: "Afirmações rápidas sobre Word, Excel e PowerPoint.",
    emoji: "✅",
    color: "from-purple-500 to-pink-600",
    render: () => <QuizRunner activities={activitiesFor("geral", "todas").filter((a) => a.category === "verdadeiro-falso")} />,
  },
  {
    id: "batalha-atalhos",
    app: "geral",
    difficulty: "medio",
    title: "Batalha dos Atalhos",
    description: "Pressione a combinação correta no teclado antes que o tempo acabe.",
    emoji: "⌨️",
    color: "from-purple-500 to-pink-600",
    render: () => <KeyboardBattle />,
  },
  {
    id: "60-segundos",
    app: "geral",
    difficulty: "dificil",
    title: "Desafio dos 60 Segundos",
    description: "Responda o máximo possível em 1 minuto. Combos dão pontos extras.",
    emoji: "⏱️",
    color: "from-purple-500 to-pink-600",
    render: () => <SixtySeconds />,
  },
  {
    id: "memoria-informatica",
    app: "geral",
    difficulty: "medio",
    title: "Memória da Informática",
    description: "Ícones, atalhos e conceitos de Word, Excel e PowerPoint misturados.",
    emoji: "🧠",
    color: "from-purple-500 to-pink-600",
    render: () => <MemoryMatch pairs={MIXED_MEMORY_PAIRS} app="geral" />,
  },
  {
    id: "arrastar-soltar",
    app: "geral",
    difficulty: "facil",
    title: "Arrastar e Soltar",
    description: "Leve cada ferramenta até o aplicativo certo.",
    emoji: "🎯",
    color: "from-purple-500 to-pink-600",
    render: () => <DragGame />,
  },
  {
    id: "memoria-icones",
    app: "geral",
    difficulty: "facil",
    title: "Memória de Ícones",
    description: "O clássico jogo da memória com os ícones do Office.",
    emoji: "🃏",
    color: "from-purple-500 to-pink-600",
    render: () => <MemoryGame />,
  },
  {
    id: "quiz-relampago",
    app: "geral",
    difficulty: "medio",
    title: "Quiz Relâmpago",
    description: "10 perguntas rápidas para testar tudo que você aprendeu.",
    emoji: "⚡",
    color: "from-purple-500 to-pink-600",
    render: () => <QuizGame />,
  },
  {
    id: "caca-atalho-multipla",
    app: "geral",
    difficulty: "facil",
    title: "Caça ao Atalho",
    description: "Combine cada atalho de teclado com sua função.",
    emoji: "🔗",
    color: "from-purple-500 to-pink-600",
    render: () => <ShortcutGame />,
  },
];

const APP_TABS: { id: AppFilter; label: string; emoji: string }[] = [
  { id: "all", label: "Todos", emoji: "🎮" },
  { id: "word", label: "Word", emoji: "📝" },
  { id: "excel", label: "Excel", emoji: "📊" },
  { id: "ppt", label: "PowerPoint", emoji: "🎨" },
  { id: "geral", label: "Geral", emoji: "🌐" },
];

const DIFFICULTY_TABS: { id: DifficultyFilter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "facil", label: "🟢 Fácil" },
  { id: "medio", label: "🟡 Médio" },
  { id: "dificil", label: "🔴 Difícil" },
];

function isAppFilter(value: string | null): value is AppFilter {
  return value === "word" || value === "excel" || value === "ppt" || value === "geral";
}

export function Arcade() {
  const searchParams = useSearchParams();
  const initialApp = isAppFilter(searchParams.get("app")) ? (searchParams.get("app") as AppFilter) : "all";
  const [appFilter, setAppFilter] = React.useState<AppFilter>(initialApp);
  const [difficultyFilter, setDifficultyFilter] = React.useState<DifficultyFilter>("todas");
  const [active, setActive] = React.useState<string | null>(null);

  const filtered = GAMES.filter(
    (g) =>
      (appFilter === "all" || g.app === appFilter) &&
      (difficultyFilter === "todas" || g.difficulty === difficultyFilter)
  );

  const activeGame = GAMES.find((g) => g.id === active);

  function playRandom() {
    const source = filtered.length > 0 ? filtered : GAMES;
    const pick = source[Math.floor(Math.random() * source.length)];
    setActive(pick.id);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-50/60 via-background to-pink-50/40 dark:from-indigo-950/30 dark:via-background dark:to-pink-950/10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/#aplicativos"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> voltar
            </Link>
            <XPPill />
          </div>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-400/15 dark:text-purple-300">
            <Gamepad2 className="h-3 w-3" />
            🎮 Arcade
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Escolha um desafio e{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              mostre o que você sabe
            </span>
            !
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            {GAMES.length} minigames de Word, Excel, PowerPoint e Geral. Rápidos, divertidos e prontos para a sala de aula.
          </p>
        </motion.div>

        {!active && (
          <>
            <div className="mt-8 flex justify-center">
              <button
                onClick={playRandom}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/30 transition hover:scale-105"
              >
                <Dices className="h-6 w-6 transition group-hover:rotate-12" /> 🎲 JOGAR AGORA
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {APP_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAppFilter(tab.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    appFilter === tab.id
                      ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                      : "border-white/20 bg-white/50 text-foreground/70 hover:bg-white/80 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {DIFFICULTY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDifficultyFilter(tab.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    difficultyFilter === tab.id
                      ? "border-foreground/40 bg-foreground/10"
                      : "border-white/20 bg-white/40 text-foreground/60 hover:bg-white/70 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {!active ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 10) * 0.04, duration: 0.4 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setActive(g.id)}
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 text-left shadow-soft transition dark:border-white/10 dark:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl text-white shadow-lg",
                          g.color
                        )}
                      >
                        {g.emoji}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-foreground/70 dark:bg-white/10">
                        <span aria-hidden="true">
                          {g.difficulty === "facil" ? "🟢" : g.difficulty === "medio" ? "🟡" : "🔴"}
                        </span>
                        {g.difficulty === "facil" ? "Fácil" : g.difficulty === "medio" ? "Médio" : "Difícil"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{g.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                  </motion.button>
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-full text-center text-sm text-muted-foreground">
                    Nenhum jogo nesse filtro ainda — tente outra combinação.
                  </p>
                )}
              </motion.div>
            ) : (
              activeGame && (
                <motion.div
                  key={activeGame.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-soft-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-8"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {activeGame.emoji} {activeGame.title}
                    </h2>
                    <button
                      onClick={() => setActive(null)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/60 px-4 py-2 text-sm font-medium hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" /> Voltar ao Arcade
                    </button>
                  </div>
                  {activeGame.render()}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
