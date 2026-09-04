"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Highlighter,
  Palette,
  Type,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniChallenge } from "@/components/common/MiniChallenge";

const FONTS = [
  "Inter",
  "Georgia",
  "Courier New",
  "Trebuchet MS",
  "Verdana",
];

const COLORS = [
  "#1f2937",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

const SIZES = [14, 16, 18, 22, 28, 36, 48, 64];

const TIPS = [
  "Selecione o texto antes de aplicar qualquer formatação!",
  "Use Ctrl+B para negrito rápido, Ctrl+I para itálico.",
  "Itens de lista com marcadores são ótimos para organizar tópicos.",
  "Centralize títulos e justifique parágrafos longos.",
  "Pressione Ctrl+Z se não gostar da mudança — o Word sempre deixa voltar.",
];

const INITIAL_TEXT =
  "Bem-vindo ao laboratório do Word. Selecione qualquer parte do texto e brinque com os botões da barra acima. Veja as mudanças acontecerem em tempo real.";

export function WordLab() {
  const [text, setText] = React.useState(INITIAL_TEXT);
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [underline, setUnderline] = React.useState(false);
  const [align, setAlign] = React.useState<"left" | "center" | "right" | "justify">(
    "left"
  );
  const [font, setFont] = React.useState(FONTS[0]);
  const [size, setSize] = React.useState(20);
  const [color, setColor] = React.useState("#1f2937");
  const [highlight, setHighlight] = React.useState<string | undefined>();
  const [listType, setListType] = React.useState<"none" | "bullet" | "number">(
    "none"
  );
  const [tipIndex, setTipIndex] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const t = setInterval(
      () => setTipIndex((i) => (i + 1) % TIPS.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  function reset() {
    setBold(false);
    setItalic(false);
    setUnderline(false);
    setAlign("left");
    setFont(FONTS[0]);
    setSize(20);
    setColor("#1f2937");
    setHighlight(undefined);
    setListType("none");
    setText(INITIAL_TEXT);
  }

  function applyList() {
    const lines = text.split("\n");
    const updated = lines
      .map((line, i) => {
        if (!line.trim()) return line;
        if (listType === "bullet") return `• ${line.replace(/^[•\-*]\s*/, "")}`;
        if (listType === "number") {
          const stripped = line.replace(/^\d+\.\s*/, "");
          return `${i + 1}. ${stripped}`;
        }
        return line;
      })
      .join("\n");
    setText(updated);
  }

  React.useEffect(() => {
    if (listType !== "none") applyList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listType]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-50/50 via-background to-indigo-50/30 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link
            href="/#aplicativos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
            <Sparkles className="h-3 w-3" />
            Laboratório Word
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Brinque com o{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Microsoft Word
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Clique nos botões, mude cores e veja o texto reagir. Cada botão
            representa um recurso real do editor.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-blue-200/30 bg-white/70 shadow-soft-lg backdrop-blur-md dark:border-blue-400/15 dark:bg-white/5"
          >
            {/* Ribbon */}
            <div className="space-y-3 rounded-t-3xl border-b border-black/5 bg-gradient-to-b from-white/80 to-white/40 p-3 dark:border-white/10 dark:from-white/5 dark:to-white/0">
              <div className="flex flex-wrap items-center gap-1">
                <ToolbarButton
                  active={bold}
                  onClick={() => setBold((b) => !b)}
                  label="Negrito (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={italic}
                  onClick={() => setItalic((i) => !i)}
                  label="Itálico (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={underline}
                  onClick={() => setUnderline((u) => !u)}
                  label="Sublinhado (Ctrl+U)"
                >
                  <Underline className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarGroup>
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="rounded-md border border-transparent bg-transparent text-xs outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                  >
                    {FONTS.map((f) => (
                      <option
                        key={f}
                        value={f}
                        className="bg-background text-foreground"
                      >
                        {f}
                      </option>
                    ))}
                  </select>
                </ToolbarGroup>

                <ToolbarGroup>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="rounded-md border border-transparent bg-transparent text-xs outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                  >
                    {SIZES.map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-background text-foreground"
                      >
                        {s}px
                      </option>
                    ))}
                  </select>
                </ToolbarGroup>

                <Divider />

                <ToolbarButton
                  active={align === "left"}
                  onClick={() => setAlign("left")}
                  label="Esquerda"
                >
                  <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={align === "center"}
                  onClick={() => setAlign("center")}
                  label="Centralizar"
                >
                  <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={align === "right"}
                  onClick={() => setAlign("right")}
                  label="Direita"
                >
                  <AlignRight className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={align === "justify"}
                  onClick={() => setAlign("justify")}
                  label="Justificar"
                >
                  <AlignJustify className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarButton
                  active={listType === "bullet"}
                  onClick={() =>
                    setListType((t) => (t === "bullet" ? "none" : "bullet"))
                  }
                  label="Marcadores"
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  active={listType === "number"}
                  onClick={() =>
                    setListType((t) => (t === "number" ? "none" : "number"))
                  }
                  label="Numeração"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarGroup>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        aria-label={`Cor ${c}`}
                        style={{ background: c }}
                        className={cn(
                          "h-5 w-5 rounded-full border border-foreground/10 transition hover:scale-110",
                          color === c && "ring-2 ring-blue-500 ring-offset-2"
                        )}
                      />
                    ))}
                  </div>
                </ToolbarGroup>

                <ToolbarButton
                  active={!!highlight}
                  onClick={() =>
                    setHighlight((h) => (h ? undefined : "#fde68a"))
                  }
                  label="Realce"
                >
                  <Highlighter className="h-4 w-4 text-yellow-500" />
                </ToolbarButton>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={cn(
                "block min-h-[420px] w-full resize-none bg-transparent p-8 outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/40 md:min-h-[520px]",
                align === "left" && "text-left",
                align === "center" && "text-center",
                align === "right" && "text-right",
                align === "justify" && "text-justify"
              )}
              style={{
                fontFamily: font,
                fontSize: size,
                color: color,
                fontWeight: bold ? 700 : 400,
                fontStyle: italic ? "italic" : "normal",
                textDecoration: underline ? "underline" : "none",
                background: highlight ? `linear-gradient(120deg, ${highlight} 0%, ${highlight} 40%, transparent 60%, transparent 100%)` : undefined,
                backgroundClip: highlight ? "text" : undefined,
                WebkitBackgroundClip: highlight ? "text" : undefined,
                WebkitTextFillColor: highlight ? "#0f172a" : undefined,
              }}
            />

            <div className="flex items-center justify-between rounded-b-3xl border-t border-black/5 bg-white/40 px-4 py-2 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/5">
              <span>{text.length} caracteres · {text.split(/\s+/).filter(Boolean).length} palavras</span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/40 dark:hover:bg-white/5"
              >
                <RefreshCw className="h-3 w-3" /> reiniciar
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Dica do momento
              </h3>
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {TIPS[tipIndex]}
              </motion.p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-5 backdrop-blur-md">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Você está aplicando
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/75">
                <li>
                  <strong>Fonte:</strong> {font}
                </li>
                <li>
                  <strong>Tamanho:</strong> {size}px
                </li>
                <li>
                  <strong>Estilos:</strong>{" "}
                  {[
                    bold && "negrito",
                    italic && "itálico",
                    underline && "sublinhado",
                  ]
                    .filter(Boolean)
                    .join(", ") || "nenhum"}
                </li>
                <li className="flex items-center gap-2">
                  <strong>Cor:</strong>
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-foreground/20"
                    style={{ background: color }}
                  />
                  {color}
                </li>
                <li>
                  <strong>Alinhamento:</strong>{" "}
                  {align === "left"
                    ? "à esquerda"
                    : align === "center"
                    ? "centralizado"
                    : align === "right"
                    ? "à direita"
                    : "justificado"}
                </li>
                <li>
                  <strong>Lista:</strong>{" "}
                  {listType === "none"
                    ? "nenhuma"
                    : listType === "bullet"
                    ? "marcadores"
                    : "numerada"}
                </li>
              </ul>
            </div>

            <MiniChallenge
              question="Qual atalho aplica negrito no texto selecionado?"
              options={["Ctrl + I", "Ctrl + B", "Ctrl + U", "Ctrl + N"]}
              correctIndex={1}
              explanation="Ctrl + B (de 'Bold') ativa e desativa o negrito instantaneamente."
              app="word"
            />
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={!!active}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-foreground/70 transition active:scale-95",
        active
          ? "border-blue-300 bg-blue-500/15 text-blue-700 shadow-inner dark:bg-blue-400/15 dark:text-blue-200"
          : "border-transparent hover:bg-white/40 hover:text-foreground dark:hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg px-2 hover:bg-white/40 dark:hover:bg-white/5">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-foreground/10" />;
}
