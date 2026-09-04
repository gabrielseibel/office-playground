"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, RotateCcw, Trophy, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";

interface ErrorSpan {
  id: string;
  text: string;
  label: string;
  style: React.CSSProperties;
}

interface Doc {
  title: string;
  intro: string;
  errors: ErrorSpan[];
  okWords: string[];
}

const DOCS: Doc[] = [
  {
    title: "Trabalho de Ciências",
    intro: "Documento sobre o Sistema Solar — encontre os 5 erros de formatação.",
    errors: [
      { id: "titulo", text: "Trabalho de Ciências", label: "Título sem negrito", style: { fontWeight: 400, fontSize: 22 } },
      { id: "desalinhado", text: "O Sistema Solar é formado por oito planetas que giram ao redor do Sol.", label: "Texto desalinhado", style: { display: "block", textAlign: "right" } },
      { id: "fonte", text: "planetas", label: "Fonte diferente do restante do texto", style: { fontFamily: "cursive" } },
      { id: "tamanho", text: "Terra", label: "Tamanho de fonte incorreto", style: { fontSize: 34, lineHeight: 1 } },
      { id: "sublinhado", text: "azul", label: "Palavra sublinhada sem motivo", style: { textDecoration: "underline" } },
    ],
    okWords: [
      "A Terra é o terceiro planeta a partir do Sol.",
      "Marte é conhecido como o planeta vermelho.",
      "Júpiter é o maior planeta do sistema solar.",
      "A atmosfera da",
      "é composta principalmente por nitrogênio e oxigênio.",
    ],
  },
  {
    title: "Trabalho de História",
    intro: "Documento sobre o Brasil Colonial — encontre os 5 erros de formatação.",
    errors: [
      { id: "titulo", text: "Trabalho de História", label: "Título sem negrito", style: { fontWeight: 400, fontSize: 22 } },
      { id: "desalinhado", text: "Este trabalho apresenta informações sobre a história do Brasil.", label: "Texto desalinhado", style: { display: "block", textAlign: "right" } },
      { id: "fonte", text: "colonização", label: "Fonte diferente do restante do texto", style: { fontFamily: "cursive" } },
      { id: "tamanho", text: "1500", label: "Tamanho de fonte incorreto", style: { fontSize: 34, lineHeight: 1 } },
      { id: "sublinhado", text: "Portugal", label: "Palavra sublinhada sem motivo", style: { textDecoration: "underline" } },
    ],
    okWords: [
      "O período de",
      "no Brasil começou oficialmente em",
      "com a chegada dos portugueses.",
      "colonizou o território explorando o pau-brasil e, depois, o açúcar.",
      "A economia era baseada no trabalho escravo.",
    ],
  },
];

export function FormattingDetective() {
  const [docIndex, setDocIndex] = React.useState(0);
  const [found, setFound] = React.useState<Set<string>>(new Set());
  const [wrongClicks, setWrongClicks] = React.useState(0);
  const [startedAt, setStartedAt] = React.useState(() => performance.now());
  const [elapsed, setElapsed] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const doc = DOCS[docIndex];

  React.useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => setElapsed((performance.now() - startedAt) / 1000), 250);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);

  function reset(nextDoc = (docIndex + 1) % DOCS.length) {
    setDocIndex(nextDoc);
    setFound(new Set());
    setWrongClicks(0);
    setStartedAt(performance.now());
    setElapsed(0);
    setFinished(false);
  }

  function clickError(id: string) {
    if (finished || found.has(id)) return;
    const next = new Set(found);
    next.add(id);
    setFound(next);
    if (next.size === doc.errors.length) {
      const timeMs = performance.now() - startedAt;
      setFinished(true);
      const accuracy = doc.errors.length / (doc.errors.length + wrongClicks);
      const points = Math.round(600 * accuracy - Math.min(200, elapsed * 3));
      recordAnswer({
        app: "word",
        category: "interatividade",
        correct: true,
        timeMs,
        points: Math.max(150, points),
      });
    }
  }

  function clickOk() {
    if (finished) return;
    setWrongClicks((w) => w + 1);
  }

  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <Search className="h-4 w-4 text-blue-600" /> {doc.intro}
      </p>
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {found.size}/{doc.errors.length} erros encontrados · {wrongClicks} cliques errados
        </span>
        <span className="inline-flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" /> {elapsed.toFixed(1)}s
        </span>
      </div>

      <div className="rounded-2xl border border-blue-200/40 bg-white p-6 leading-relaxed shadow-sm dark:border-blue-400/15 dark:bg-white/5">
        <p>
          <ErrorWord found={found.has("titulo")} onClick={() => clickError("titulo")} error={doc.errors[0]} />
        </p>
        <p className="mt-3">
          <ErrorWord found={found.has("desalinhado")} onClick={() => clickError("desalinhado")} error={doc.errors[1]} />
        </p>
        <p className="mt-3">
          {doc.okWords[0]}{" "}
          <ErrorWord found={found.has("fonte")} onClick={() => clickError("fonte")} error={doc.errors[2]} inline />
          . {doc.okWords[1]}
        </p>
        <p className="mt-3">
          {doc.okWords[2]}{" "}
          <ErrorWord found={found.has("tamanho")} onClick={() => clickError("tamanho")} error={doc.errors[3]} inline />
          , {doc.okWords[3]}
        </p>
        <p className="mt-3">
          {doc.okWords[4]}{" "}
          <button onClick={clickOk} className="rounded px-0.5 hover:bg-rose-500/10">
            O céu é
          </button>{" "}
          <ErrorWord found={found.has("sublinhado")} onClick={() => clickError("sublinhado")} error={doc.errors[4]} inline />.
        </p>
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-50/60 p-6 text-center dark:bg-emerald-400/10"
        >
          <Trophy className="h-8 w-8 text-yellow-500" />
          <p className="font-semibold text-emerald-700 dark:text-emerald-300">
            Todos os erros encontrados em {elapsed.toFixed(1)}s, com {wrongClicks} cliques errados!
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" /> Novo documento
          </button>
        </motion.div>
      ) : (
        <button
          onClick={() => reset(docIndex)}
          className="mt-4 inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-3 w-3" /> reiniciar
        </button>
      )}
    </div>
  );
}

function ErrorWord({
  error,
  found,
  onClick,
  inline,
}: {
  error: ErrorSpan;
  found: boolean;
  onClick: () => void;
  inline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={found ? error.label : "Clique se achar que isso está errado"}
      style={error.style}
      className={cn(
        "rounded px-0.5 transition",
        inline ? "" : "block w-full",
        found
          ? "bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500 dark:text-emerald-300"
          : "hover:bg-rose-500/10"
      )}
    >
      {error.text}
      {found && <span className="ml-1 text-[10px] font-bold uppercase text-emerald-600">✓ {error.label}</span>}
    </button>
  );
}
