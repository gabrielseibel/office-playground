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
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniChallenge } from "@/components/common/MiniChallenge";
import {
  OfficeTitleBar,
  RibbonTabs,
  RibbonGroup,
  RibbonIconButton,
} from "@/components/office/OfficeChrome";

const WORD_COLOR = "#2B579A";
const RIBBON_TABS = [
  "Arquivo",
  "Página Inicial",
  "Inserir",
  "Design",
  "Layout",
  "Referências",
  "Revisão",
  "Exibir",
];

const FONTS = ["Inter", "Georgia", "Courier New", "Trebuchet MS", "Verdana"];

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
  "Use Ctrl+N para negrito rápido, Ctrl+I para itálico.",
  "Itens de lista com marcadores são ótimos para organizar tópicos.",
  "Centralize títulos e justifique parágrafos longos.",
  "Pressione Ctrl+Z se não gostar da mudança — o Word sempre deixa voltar.",
];

const INITIAL_TEXT =
  "Bem-vindo ao laboratório do Word. Selecione qualquer parte do texto e brinque com os botões da faixa de opções acima. Veja as mudanças acontecerem em tempo real.";

/**
 * Isolado num componente à parte de propósito: o intervalo de 5s troca só
 * este texto. Se ficasse dentro do WordLab, cada troca re-renderizaria o
 * documento inteiro (e a barra de ferramentas) sem necessidade.
 */
function TipRotator() {
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        Dica do momento
      </h3>
      <motion.p
        key={tipIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-sm leading-relaxed text-muted-foreground"
      >
        {TIPS[tipIndex]}
      </motion.p>
    </div>
  );
}

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

  function applyList(type: "none" | "bullet" | "number") {
    setListType((current) => {
      const next = current === type ? "none" : type;
      if (next !== "none") {
        setText((prev) => {
          const lines = prev.split("\n");
          return lines
            .map((line, i) => {
              if (!line.trim()) return line;
              if (next === "bullet") return `• ${line.replace(/^[•\-*]\s*/, "")}`;
              const stripped = line.replace(/^\d+\.\s*/, "");
              return `${i + 1}. ${stripped}`;
            })
            .join("\n");
        });
      }
      return next;
    });
  }

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-blue-50/40 via-background to-background pt-24 dark:from-blue-950/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
            Uma janela parecida com a de verdade: clique nos botões da faixa
            de opções e veja o texto reagir, exatamente como no programa
            original.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-soft-lg dark:border-white/10 dark:bg-[#1c1c22]"
          >
            <OfficeTitleBar color={WORD_COLOR} icon="W" fileName="Documento1 - Word" />
            <RibbonTabs color={WORD_COLOR} tabs={RIBBON_TABS} active="Página Inicial" />

            {/* Faixa de opções */}
            <div className="flex items-stretch gap-1 overflow-x-auto border-b border-black/10 bg-white px-2 py-2 dark:border-white/10 dark:bg-white/5">
              <RibbonGroup label="Fonte" className="min-w-[15rem]">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <select
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="h-6 flex-1 rounded border border-black/10 bg-white px-1 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/10"
                    >
                      {FONTS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <select
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="h-6 w-14 rounded border border-black/10 bg-white px-1 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/10"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <RibbonIconButton active={bold} onClick={() => setBold((b) => !b)} label="Negrito (Ctrl+N)">
                      <Bold className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <RibbonIconButton active={italic} onClick={() => setItalic((i) => !i)} label="Itálico (Ctrl+I)">
                      <Italic className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <RibbonIconButton active={underline} onClick={() => setUnderline((u) => !u)} label="Sublinhado (Ctrl+S)">
                      <Underline className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <RibbonIconButton active={!!highlight} onClick={() => setHighlight((h) => (h ? undefined : "#fde68a"))} label="Realce">
                      <Highlighter className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <div className="ml-1 flex items-center gap-1">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          aria-label={`Cor ${c}`}
                          style={{ background: c }}
                          className={cn(
                            "h-4 w-4 rounded-full border border-black/10 transition hover:scale-110",
                            color === c && "ring-2 ring-blue-500 ring-offset-1"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </RibbonGroup>

              <RibbonGroup label="Parágrafo">
                <RibbonIconButton active={align === "left"} onClick={() => setAlign("left")} label="Alinhar à esquerda">
                  <AlignLeft className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton active={align === "center"} onClick={() => setAlign("center")} label="Centralizar">
                  <AlignCenter className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton active={align === "right"} onClick={() => setAlign("right")} label="Alinhar à direita">
                  <AlignRight className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton active={align === "justify"} onClick={() => setAlign("justify")} label="Justificar">
                  <AlignJustify className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton active={listType === "bullet"} onClick={() => applyList("bullet")} label="Marcadores">
                  <List className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton active={listType === "number"} onClick={() => applyList("number")} label="Numeração">
                  <ListOrdered className="h-3.5 w-3.5" />
                </RibbonIconButton>
              </RibbonGroup>
            </div>

            {/* Área do documento — fundo cinza (mesa de trabalho) com a folha branca no centro, como no Word real */}
            <div className="max-h-[560px] overflow-y-auto bg-[#e9e9ec] px-4 py-8 dark:bg-black/30 sm:px-10">
              <div className="mx-auto max-w-2xl rounded-sm bg-white shadow-md dark:bg-[#232329]">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={cn(
                    "block min-h-[420px] w-full resize-none bg-transparent p-10 outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/40 md:min-h-[480px]",
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
                    backgroundColor: highlight,
                  }}
                />
              </div>
            </div>

            {/* Barra de status */}
            <div className="flex items-center justify-between border-t border-black/10 bg-[#f3f2f1] px-4 py-1.5 text-[11px] text-foreground/60 dark:border-white/10 dark:bg-white/5">
              <span>
                {text.length} caracteres · {text.split(/\s+/).filter(Boolean).length} palavras
              </span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <RefreshCw className="h-3 w-3" /> reiniciar
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4"
          >
            <TipRotator />

            <div className="rounded-2xl border border-blue-200/60 bg-blue-50/60 p-5 dark:border-blue-400/15 dark:bg-blue-400/5">
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
                  {[bold && "negrito", italic && "itálico", underline && "sublinhado"]
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
              </ul>
            </div>

            <MiniChallenge
              question="Qual atalho aplica negrito no texto selecionado?"
              options={["Ctrl + I", "Ctrl + B", "Ctrl + U", "Ctrl + N"]}
              correctIndex={3}
              explanation="No Word (Microsoft 365 em português), Ctrl + N ativa e desativa o negrito. Ctrl + B é o atalho de salvar."
              app="word"
            />
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
