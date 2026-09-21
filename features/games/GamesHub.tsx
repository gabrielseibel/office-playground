"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Gamepad2,
  MousePointer2,
  Brain,
  Keyboard,
  Trophy,
  RotateCcw,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type GameId =
  | "menu"
  | "drag"
  | "memory"
  | "quiz"
  | "matchShortcut"
  | "assemblePlan"
  | "organizeSlide";

const GAMES: { id: GameId; label: string; description: string; emoji: string; color: string }[] = [
  {
    id: "drag",
    label: "Arrastar e soltar",
    description: "Leve cada ferramenta até o aplicativo certo (Word, Excel ou PowerPoint).",
    emoji: "🎯",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "memory",
    label: "Memória de ícones",
    description: "Encontre os pares de ícones do Office virando cartas.",
    emoji: "🧠",
    color: "from-emerald-500 to-green-700",
  },
  {
    id: "quiz",
    label: "Quiz relâmpago",
    description: "10 perguntas rápidas para testar tudo que você aprendeu.",
    emoji: "⚡",
    color: "from-orange-500 to-rose-600",
  },
  {
    id: "matchShortcut",
    label: "Caça aos atalhos",
    description: "Combine o atalho de teclado com sua função.",
    emoji: "⌨️",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "assemblePlan",
    label: "Monte a planilha",
    description: "Organize linhas e colunas para criar uma planilha profissional.",
    emoji: "📊",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "organizeSlide",
    label: "Organize o slide",
    description: "Arraste os blocos para a ordem ideal de uma apresentação.",
    emoji: "🪄",
    color: "from-amber-500 to-orange-700",
  },
];

export function GamesHub() {
  const [active, setActive] = React.useState<GameId>("menu");

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
          <Link
            href="/#aplicativos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-400/15 dark:text-purple-300">
            <Gamepad2 className="h-3 w-3" />
            Mini jogos educativos
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Aprender virou{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              brincadeira
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Seis mini jogos interativos. Escolha um, brinque e descubra tudo
            sobre o Office sem perceber.
          </p>
        </motion.div>

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {active === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {GAMES.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setActive(g.id)}
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 text-left shadow-soft transition dark:border-white/10 dark:bg-white/10"
                  >
                    <div
                      className={cn(
                        "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-25 blur-2xl transition-opacity group-hover:opacity-50",
                        g.color
                      )}
                    />
                    <div
                      className={cn(
                        "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl text-white shadow-lg",
                        g.color
                      )}
                    >
                      {g.emoji}
                    </div>
                    <h3 className="text-lg font-semibold">{g.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {g.description}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {active === "drag" && (
              <GameShell key="drag" title="Arrastar e soltar" onExit={() => setActive("menu")}>
                <DragGame />
              </GameShell>
            )}
            {active === "memory" && (
              <GameShell key="memory" title="Memória de ícones" onExit={() => setActive("menu")}>
                <MemoryGame />
              </GameShell>
            )}
            {active === "quiz" && (
              <GameShell key="quiz" title="Quiz relâmpago" onExit={() => setActive("menu")}>
                <QuizGame />
              </GameShell>
            )}
            {active === "matchShortcut" && (
              <GameShell key="matchShortcut" title="Caça aos atalhos" onExit={() => setActive("menu")}>
                <ShortcutGame />
              </GameShell>
            )}
            {active === "assemblePlan" && (
              <GameShell key="assemblePlan" title="Monte a planilha" onExit={() => setActive("menu")}>
                <PlanGame />
              </GameShell>
            )}
            {active === "organizeSlide" && (
              <GameShell key="organizeSlide" title="Organize o slide" onExit={() => setActive("menu")}>
                <SlideOrderGame />
              </GameShell>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function GameShell({
  title,
  children,
  onExit,
}: {
  title: string;
  children: React.ReactNode;
  onExit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-soft-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/60 px-4 py-2 text-sm font-medium hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar ao menu
        </button>
      </div>
      {children}
    </motion.div>
  );
}

/* ------------------------------- Drag game ------------------------------- */

interface Tool {
  id: string;
  name: string;
  emoji: string;
  correct: "word" | "excel" | "ppt";
}

const TOOLS: Tool[] = [
  { id: "t1", name: "Negrito", emoji: "𝐁", correct: "word" },
  { id: "t2", name: "Margem", emoji: "📏", correct: "word" },
  { id: "t3", name: "SOMA", emoji: "Σ", correct: "excel" },
  { id: "t4", name: "MÉDIA", emoji: "µ", correct: "excel" },
  { id: "t5", name: "Filtro", emoji: "🔎", correct: "excel" },
  { id: "t6", name: "Transição", emoji: "🎞️", correct: "ppt" },
  { id: "t7", name: "Slide", emoji: "▢", correct: "ppt" },
  { id: "t8", name: "Animação", emoji: "✨", correct: "ppt" },
];

export function DragGame() {
  const [order, setOrder] = React.useState(
    [...TOOLS].sort(() => Math.random() - 0.5)
  );
  const [bins, setBins] = React.useState<Record<string, Tool[]>>({
    word: [],
    excel: [],
    ppt: [],
  });
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string>("");

  function placeInBin(bin: "word" | "excel" | "ppt") {
    if (!dragged) return;
    const tool = order.find((t) => t.id === dragged);
    if (!tool) return;
    const correct = tool.correct === bin;
    setFeedback(
      correct
        ? `✅ ${tool.name} vai mesmo em ${bin.toUpperCase()}!`
        : `❌ ${tool.name} não é do ${bin.toUpperCase()} — tente outra caixa.`
    );
    setBins((b) => ({ ...b, [bin]: [...b[bin], tool] }));
    setOrder((o) => o.filter((t) => t.id !== dragged));
    setDragged(null);
    if (order.length === 1)
      setTimeout(() => setFeedback("🎉 Você distribuiu todas as ferramentas!"), 200);
  }

  function reset() {
    setOrder([...TOOLS].sort(() => Math.random() - 0.5));
    setBins({ word: [], excel: [], ppt: [] });
    setFeedback("");
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Arraste cada ferramenta até o aplicativo certo. Toque/clique no item e
        escolha a caixa de destino.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-dashed border-foreground/15 bg-white/40 p-3 dark:bg-white/5">
        {order.map((tool) => (
          <button
            key={tool.id}
            draggable
            onDragStart={() => setDragged(tool.id)}
            onClick={() => setDragged(tool.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm font-medium shadow-sm transition dark:border-white/10 dark:bg-white/10",
              dragged === tool.id && "ring-2 ring-purple-500 ring-offset-2"
            )}
          >
            <span className="text-base">{tool.emoji}</span>
            {tool.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {(["word", "excel", "ppt"] as const).map((b) => (
          <button
            key={b}
            onClick={() => placeInBin(b)}
            disabled={!dragged}
            className={cn(
              "min-h-[160px] rounded-2xl border-2 border-dashed p-4 text-left transition disabled:opacity-50",
              b === "word" && "border-blue-300 bg-blue-50/50 dark:bg-blue-400/5",
              b === "excel" && "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-400/5",
              b === "ppt" && "border-orange-300 bg-orange-50/50 dark:bg-orange-400/5"
            )}
          >
            <div className="text-sm font-bold uppercase tracking-wide text-foreground/80">
              {b === "word" ? "Word" : b === "excel" ? "Excel" : "PowerPoint"}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {bins[b].map((t) => (
                <span
                  key={t.id}
                  className="rounded-md bg-white px-2 py-1 text-xs shadow-sm dark:bg-white/10"
                >
                  {t.emoji} {t.name}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-white/60 px-4 py-2 text-sm shadow-sm dark:bg-white/10"
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-3 w-3" /> reiniciar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Memory game ------------------------------ */

const MEMORY_ICONS = ["📄", "📊", "📽️", "✏️", "Σ", "🎨"];
const MEMORY_COLORS = ["text-blue-600", "text-emerald-600", "text-orange-600", "text-purple-600", "text-rose-600", "text-cyan-600"];

export function MemoryGame() {
  const [cards, setCards] = React.useState<
    { id: number; emoji: string; flipped: boolean; matched: boolean; color: string }[]
  >([]);
  const [firstPick, setFirstPick] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [moves, setMoves] = React.useState(0);

  React.useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    const pairs = MEMORY_ICONS.map((e, i) => ({
      emoji: e,
      color: MEMORY_COLORS[i],
    }));
    const doubled = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: i, flipped: false, matched: false }));
    setCards(doubled);
    setFirstPick(null);
    setMoves(0);
  }

  function flip(id: number) {
    if (busy) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched || card.flipped) return;
    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(next);
    if (firstPick === null) {
      setFirstPick(id);
      return;
    }
    setBusy(true);
    const first = next.find((c) => c.id === firstPick);
    const second = next.find((c) => c.id === id);
    if (first && second && first.emoji === second.emoji) {
      setTimeout(() => {
        setCards((cs) =>
          cs.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
          )
        );
        setFirstPick(null);
        setBusy(false);
      }, 600);
    } else {
      setTimeout(() => {
        setCards((cs) => cs.map((c) => (c.flipped && !c.matched ? { ...c, flipped: false } : c)));
        setFirstPick(null);
        setBusy(false);
      }, 900);
    }
    setMoves((m) => m + 1);
  }

  const matched = cards.filter((c) => c.matched).length / 2;
  const totalPairs = MEMORY_ICONS.length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Trophy className="h-4 w-4 text-yellow-500" />
          {matched}/{totalPairs} pares · {moves} jogadas
        </span>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-3 w-3" /> reiniciar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            disabled={c.matched}
            className={cn(
              "relative aspect-square rounded-2xl border text-3xl font-bold shadow-sm transition",
              c.matched
                ? "border-emerald-400/60 bg-emerald-100/60 dark:bg-emerald-400/10"
                : c.flipped
                ? "border-white/30 bg-white/80 dark:bg-white/10"
                : "border-white/20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-transparent",
              !c.matched && "hover:scale-105"
            )}
          >
            {c.flipped || c.matched ? (
              <span className={c.color}>{c.emoji}</span>
            ) : (
              <span className="text-white">?</span>
            )}
          </button>
        ))}
      </div>

      {matched === totalPairs && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-100/50 p-4 text-center text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
        >
          🎉 Parabéns! Você completou em {moves} jogadas.
        </motion.div>
      )}
    </div>
  );
}

/* --------------------------------- Quiz --------------------------------- */

const QUIZ = [
  {
    q: "Qual programa usamos para criar planilhas?",
    a: ["Word", "Excel", "PowerPoint"],
    correct: 1,
  },
  {
    q: "Qual atalho copia algo?",
    a: ["Ctrl + X", "Ctrl + V", "Ctrl + C"],
    correct: 2,
  },
  {
    q: "Para criar slides, usamos:",
    a: ["Word", "Excel", "PowerPoint"],
    correct: 2,
  },
  {
    q: "Qual função soma células no Excel?",
    a: ["SOMA()", "TOTAL()", "ADD()"],
    correct: 0,
  },
  {
    q: "O botão B no Word ativa:",
    a: ["Sublinhado", "Negrito", "Itálico"],
    correct: 1,
  },
  {
    q: "Qual tecla inicia uma apresentação?",
    a: ["F1", "F5", "F12"],
    correct: 1,
  },
  {
    q: "Qual painel sugere layouts automáticos no PowerPoint?",
    a: ["Animações", "Designer", "Transições"],
    correct: 1,
  },
  {
    q: "Qual recurso do Word cria o sumário automático?",
    a: ["Controle de alterações", "Estilos de título", "Marcadores"],
    correct: 1,
  },
  {
    q: "No Excel, Ctrl + Z serve para:",
    a: ["Desfazer", "Refazer", "Salvar"],
    correct: 0,
  },
  {
    q: "Qual destes NÃO é do Microsoft Office?",
    a: ["Word", "Pages", "Excel"],
    correct: 1,
  },
];

export function QuizGame() {
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [reveal, setReveal] = React.useState(false);
  const [done, setDone] = React.useState(false);

  function pick(i: number) {
    if (reveal) return;
    setPicked(i);
    setReveal(true);
    if (i === QUIZ[index].correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= QUIZ.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setReveal(false);
    setPicked(null);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setReveal(false);
    setPicked(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-3 text-2xl font-bold">
          Você fez {score}/{QUIZ.length} pontos!
        </h3>
        <p className="mt-2 text-muted-foreground">
          {score >= 8 ? "Excelente! Você manda bem no Office." : "Continue brincando — você aprende a cada partida!"}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Jogar de novo
        </button>
      </div>
    );
  }

  const q = QUIZ[index];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-semibold">
          Questão {index + 1} de {QUIZ.length}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-purple-700 dark:text-purple-300">
          <Trophy className="h-3 w-3 text-yellow-500" /> {score}
        </span>
      </div>

      <h3 className="text-xl font-semibold">{q.q}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {q.a.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={reveal}
            className={cn(
              "rounded-2xl border p-4 text-sm font-medium transition disabled:cursor-not-allowed",
              "border-white/20 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
              reveal && i === q.correct && "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
              reveal && picked === i && i !== q.correct && "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      {reveal && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm">
            {picked === q.correct ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <X className="h-4 w-4 text-rose-600" />
            )}
            <strong>{picked === q.correct ? "Acertou!" : "Quase!"}</strong>
          </div>
          <button
            onClick={next}
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Shortcut matching --------------------------- */

const SHORTCUT_PAIRS = [
  { keys: ["Ctrl", "C"], desc: "Copiar" },
  { keys: ["Ctrl", "V"], desc: "Colar" },
  { keys: ["Ctrl", "Z"], desc: "Desfazer" },
  { keys: ["Ctrl", "N"], desc: "Negrito no Word" },
  { keys: ["Ctrl", "B"], desc: "Salvar no Word" },
];

export function ShortcutGame() {
  const [pairs] = React.useState(SHORTCUT_PAIRS);
  const [used, setUsed] = React.useState<Record<string, string>>({});
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"playing" | "won">("playing");

  function connect(desc: string) {
    if (!hovered) return;
    const correct = pairs.find((p) => p.desc === desc);
    if (correct && correct.keys.join("+") === hovered) {
      setUsed((u) => ({ ...u, [hovered]: desc }));
      setHovered(null);
      if (Object.keys({ ...used, [hovered]: desc }).length === pairs.length) {
        setStatus("won");
      }
    } else {
      setHovered(null);
    }
  }

  const keys = pairs.map((p) => p.keys.join("+")).sort(() => Math.random() - 0.5);
  const descs = pairs.map((p) => p.desc).sort(() => Math.random() - 0.5);

  return (
    <div>
      {status === "won" ? (
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-2xl font-bold">Tudo certo!</h3>
          <p className="mt-1 text-muted-foreground">Você ligou todos os atalhos às suas funções.</p>
          <button
            onClick={() => {
              setUsed({});
              setStatus("playing");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <RotateCcw className="h-4 w-4" /> De novo
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Atalhos
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {keys.map((k) => (
                <button
                  key={k}
                  disabled={!!used[k]}
                  onMouseEnter={() => !used[k] && setHovered(k)}
                  onClick={() => !used[k] && setHovered(k)}
                  className={cn(
                    "flex h-10 items-center gap-1 rounded-xl border px-3 shadow-sm transition",
                    used[k]
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700 opacity-60 dark:bg-emerald-400/10"
                      : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5",
                    hovered === k && !used[k] && "ring-2 ring-purple-500"
                  )}
                >
                  {k.split("+").map((part, i, arr) => (
                    <React.Fragment key={i}>
                      <kbd className="rounded border border-foreground/10 bg-white px-1.5 py-0.5 text-xs font-bold dark:bg-white/10">
                        {part}
                      </kbd>
                      {i < arr.length - 1 && <span className="text-xs text-muted-foreground">+</span>}
                    </React.Fragment>
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Funções
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {descs.map((d) => {
                const matched = Object.values(used).includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => connect(d)}
                    disabled={matched}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-medium transition",
                      matched
                        ? "border-emerald-300 bg-emerald-100 text-emerald-700 opacity-60 dark:bg-emerald-400/10"
                        : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Plan game ------------------------------- */

interface PlanRow {
  id: number;
  produto: string;
  jan: number;
  fev: number;
  mar: number;
}

export function PlanGame() {
  const [rows, setRows] = React.useState<PlanRow[]>([
    { id: 1, produto: "Cadernos", jan: 12, fev: 15, mar: 18 },
    { id: 2, produto: "Canetas", jan: 20, fev: 22, mar: 26 },
    { id: 3, produto: "Mochilas", jan: 8, fev: 9, mar: 11 },
    { id: 4, produto: "Estojos", jan: 6, fev: 7, mar: 8 },
  ]);
  const [feedback, setFeedback] = React.useState("");

  function totalRow(r: PlanRow) {
    return r.jan + r.fev + r.mar;
  }

  function verify() {
    let ok = true;
    let hint = "";
    for (const r of rows) {
      const sorted = [r.jan, r.fev, r.mar];
      const isMonotone = sorted[0] <= sorted[1] && sorted[1] <= sorted[2];
      if (!isMonotone) {
        ok = false;
        hint = `Algo em "${r.produto}" não cresce com o tempo.`;
        break;
      }
    }
    if (ok) {
      const total = rows.reduce((acc, r) => acc + totalRow(r), 0);
      setFeedback(
        `🎉 Planilha organizada! Total geral: ${total}. Vendas crescentes trimestre a trimestre.`
      );
    } else {
      setFeedback(`❌ Ainda não. ${hint}`);
    }
  }

  function grow(rowId: number, key: keyof PlanRow) {
    setRows((rs) =>
      rs.map((r) =>
        r.id === rowId && typeof r[key] === "number"
          ? { ...r, [key]: (r[key] as number) + 1 }
          : r
      )
    );
  }

  function reset() {
    setRows([
      { id: 1, produto: "Cadernos", jan: 12, fev: 15, mar: 18 },
      { id: 2, produto: "Canetas", jan: 20, fev: 22, mar: 26 },
      { id: 3, produto: "Mochilas", jan: 8, fev: 9, mar: 11 },
      { id: 4, produto: "Estojos", jan: 6, fev: 7, mar: 8 },
    ]);
    setFeedback("");
  }

  function isValid(r: PlanRow) {
    return r.jan <= r.fev && r.fev <= r.mar;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Use os botões <kbd className="rounded border bg-white px-1 text-xs">+</kbd> para fazer com que cada produto tenha um crescimento mês a mês (Janeiro ≤ Fevereiro ≤ Março).
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-200/40 bg-white/80 dark:border-emerald-400/15 dark:bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-emerald-500/10 text-emerald-900 dark:text-emerald-100">
            <tr>
              <th className="border-b border-r border-black/5 p-3 text-left dark:border-white/10">Produto</th>
              <th className="border-b border-r border-black/5 p-3 dark:border-white/10">Janeiro</th>
              <th className="border-b border-r border-black/5 p-3 dark:border-white/10">Fevereiro</th>
              <th className="border-b border-r border-black/5 p-3 dark:border-white/10">Março</th>
              <th className="border-b border-black/5 p-3 dark:border-white/10">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={cn(!isValid(r) && "bg-rose-50 dark:bg-rose-500/5")}>
                <td className="border-b border-r border-black/5 p-3 font-semibold dark:border-white/10">{r.produto}</td>
                {(["jan", "fev", "mar"] as const).map((m) => (
                  <td key={m} className="border-b border-r border-black/5 p-3 dark:border-white/10">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono tabular-nums">{r[m]}</span>
                      <button
                        onClick={() => grow(r.id, m)}
                        className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300"
                      >
                        +
                      </button>
                    </div>
                  </td>
                ))}
                <td className="border-b border-black/5 p-3 text-center font-bold text-emerald-700 dark:text-emerald-300 dark:border-white/10">
                  {totalRow(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">{feedback}</p>
        <div className="flex gap-2">
          <button
            onClick={verify}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            Verificar
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
          >
            <RotateCcw className="h-3 w-3" /> reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Slide order game ---------------------------- */

const SLIDE_ORDER = [
  "Boas-vindas",
  "Contexto",
  "Problema",
  "Solução",
  "Estatística",
  "Próximos passos",
  "Obrigado",
];
const SLIDE_DESCRIPTIONS: Record<string, string> = {
  "Boas-vindas": "Comece com um slide que cumprimente a plateia.",
  "Contexto": "Mostre o cenário atual.",
  "Problema": "Apresente o problema que será resolvido.",
  "Solução": "Explique sua solução.",
  "Estatística": "Apoie com dados concretos.",
  "Próximos passos": "Liste ações e prazos.",
  "Obrigado": "Encerre agradecendo e abrindo para perguntas.",
};

export function SlideOrderGame() {
  const correctOrder = SLIDE_ORDER;
  const [order, setOrder] = React.useState<string[]>([...SLIDE_ORDER].reverse());
  const [feedback, setFeedback] = React.useState("");

  function move(idx: number, dir: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function check() {
    const isCorrect = order.every((v, i) => v === correctOrder[i]);
    setFeedback(
      isCorrect
        ? "🎉 Sequência perfeita! Sua apresentação tem começo, meio e fim."
        : "❌ Ainda fora de ordem — pense no arco narrativo."
    );
  }

  function reset() {
    setOrder([...SLIDE_ORDER].reverse());
    setFeedback("");
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Reordene os slides para criar uma apresentação com narrativa: do
        cumprimento ao fechamento. Use as setas.
      </p>

      <ol className="mt-6 space-y-2">
        {order.map((item, i) => (
          <li
            key={item}
            className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-purple-500/15 text-sm font-bold text-purple-700 dark:text-purple-300">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold">{item}</div>
                <div className="text-xs text-muted-foreground">
                  {SLIDE_DESCRIPTIONS[item]}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white disabled:opacity-30 dark:border-white/10 dark:bg-white/5"
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white disabled:opacity-30 dark:border-white/10 dark:bg-white/5"
                aria-label="Mover para baixo"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">{feedback}</p>
        <div className="flex gap-2">
          <button
            onClick={check}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
          >
            Conferir
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
          >
            <RotateCcw className="h-3 w-3" /> reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
