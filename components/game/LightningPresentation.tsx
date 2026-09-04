"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Star, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";

interface Option<T extends string> {
  id: T;
  label: string;
  quality: number; // 1-3, used to compute the final rating
}

const THEMES = ["Animais", "Esportes", "O espaço", "Alimentação saudável"];

const TITLES: Option<string>[] = [
  { id: "t1", label: "Um resumo completo e curioso", quality: 3 },
  { id: "t2", label: "Título genérico e sem graça", quality: 1 },
  { id: "t3", label: "Uma pergunta que desperta curiosidade", quality: 3 },
];

const IMAGES: Option<string>[] = [
  { id: "i1", label: "🖼️ Imagem nítida e relacionada ao tema", quality: 3 },
  { id: "i2", label: "🌀 Imagem pixelada e sem relação", quality: 1 },
  { id: "i3", label: "🎨 Ilustração simples e clara", quality: 2 },
];

const LAYOUTS: Option<string>[] = [
  { id: "l1", label: "Título grande + 1 imagem + poucos tópicos", quality: 3 },
  { id: "l2", label: "Texto corrido ocupando o slide inteiro", quality: 1 },
  { id: "l3", label: "Título + lista curta de bullets", quality: 2 },
];

const TEXTS: Option<string>[] = [
  { id: "x1", label: "3 frases curtas e diretas", quality: 3 },
  { id: "x2", label: "Um parágrafo grande e detalhado", quality: 1 },
  { id: "x3", label: "Uma frase de efeito", quality: 2 },
];

const STEPS = [
  { key: "title", label: "Escolha o título", options: TITLES },
  { key: "image", label: "Escolha a imagem", options: IMAGES },
  { key: "layout", label: "Escolha o layout", options: LAYOUTS },
  { key: "text", label: "Escolha o texto", options: TEXTS },
] as const;

const DURATION = 60;

export function LightningPresentation() {
  const [theme] = React.useState(() => THEMES[Math.floor(Math.random() * THEMES.length)]);
  const [step, setStep] = React.useState(0);
  const [choices, setChoices] = React.useState<Record<string, Option<string>>>({});
  const [secondsLeft, setSecondsLeft] = React.useState(DURATION);
  const [finished, setFinished] = React.useState(false);
  const startRef = React.useRef(performance.now());

  React.useEffect(() => {
    if (finished) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, finished]);

  function choose(option: Option<string>) {
    const key = STEPS[step].key;
    const next = { ...choices, [key]: option };
    setChoices(next);
    if (step + 1 >= STEPS.length) {
      finish(next);
    } else {
      setStep((s) => s + 1);
    }
  }

  function finish(finalChoices: Record<string, Option<string>> = choices) {
    setFinished(true);
    const values = STEPS.map((s) => finalChoices[s.key]?.quality ?? 1);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const points = Math.round(120 + avg * 60);
    recordAnswer({
      app: "ppt",
      category: "apresentacoes",
      correct: avg >= 2,
      timeMs: performance.now() - startRef.current,
      points,
    });
  }

  function reset() {
    window.location.reload();
  }

  if (finished) {
    const values = STEPS.map((s) => choices[s.key]?.quality ?? 1);
    const design = Math.min(5, Math.max(1, Math.round(((values[1] ?? 1) + (values[2] ?? 1)) / 2) + 1));
    const organizacao = Math.min(5, Math.max(1, (values[2] ?? 1) + 2));
    const clareza = Math.min(5, Math.max(1, (values[3] ?? 1) + 2));

    return (
      <div className="text-center">
        <p className="text-sm font-semibold text-orange-600">🏆 Sua apresentação sobre &ldquo;{theme}&rdquo; está pronta!</p>
        <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-orange-200/50 bg-white p-6 text-left shadow-lg dark:border-orange-400/20 dark:bg-white/5">
          <h4 className="text-lg font-bold">{theme}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{choices.title?.label}</p>
          <div className="mt-3 rounded-xl bg-orange-50 p-3 text-xs dark:bg-orange-400/10">
            {choices.image?.label} · {choices.layout?.label}
          </div>
          <p className="mt-2 text-xs">{choices.text?.label}</p>
        </div>

        <div className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
          <StarRow label="Design" value={design} />
          <StarRow label="Organização" value={organizacao} />
          <StarRow label="Clareza" value={clareza} />
        </div>

        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Montar outra apresentação
        </button>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Tema: <strong className="text-foreground">{theme}</strong> · Passo {step + 1}/{STEPS.length}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold",
            secondsLeft <= 10 ? "bg-rose-500/15 text-rose-600" : "bg-orange-500/10 text-orange-600"
          )}
        >
          <Timer className="h-3.5 w-3.5" /> {secondsLeft}s
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <h3 className="text-lg font-semibold">{current.label}</h3>
          <div className="mt-4 grid gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => choose(opt)}
                className="rounded-xl border border-white/20 bg-white/60 p-3 text-left text-sm font-medium transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2">
      <span>{label}</span>
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-4 w-4", i < value ? "fill-yellow-400 text-yellow-400" : "text-foreground/50")} />
        ))}
      </span>
    </div>
  );
}
