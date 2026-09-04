"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Plus,
  Sigma,
  TrendingUp,
  Lightbulb,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MiniChallenge } from "@/components/common/MiniChallenge";

type Cell = string | number;
type Row = Cell[];

const INITIAL_DATA: Row[] = [
  ["Produto", "Janeiro", "Fevereiro", "Março", "Total"],
  ["Cadernos", 120, 150, 180, "=SOMA(B2:D2)"],
  ["Canetas", 200, 220, 260, "=SOMA(B3:D3)"],
  ["Mochilas", 80, 95, 110, "=SOMA(B4:D4)"],
  ["Estojos", 60, 70, 80, "=SOMA(B5:D5)"],
  ["TOTAL", "=SOMA(B2:B5)", "=SOMA(C2:C5)", "=SOMA(D2:D5)", "=SOMA(E2:E5)"],
];

const STEPS = [
  "Adicione uma linha clicando no + acima da grade.",
  "Digite qualquer número nas células amarelas.",
  "Clique em SOMA, MÉDIA, MÁXIMO ou MÍNIMO para inserir a fórmula.",
  "Veja o gráfico atualizar em tempo real com base nos dados.",
];

const PALETTES = [
  { name: "Emerald", bar: "#22c55e", soft: "rgba(34,197,94,0.25)" },
  { name: "Ocean", bar: "#0ea5e9", soft: "rgba(14,165,233,0.25)" },
  { name: "Sunset", bar: "#f97316", soft: "rgba(249,115,22,0.25)" },
  { name: "Violet", bar: "#8b5cf6", soft: "rgba(139,92,246,0.25)" },
];

function evalCell(value: Cell, data: Row[], r: number, c: number): number | string {
  if (typeof value !== "string") return value;
  if (!value.startsWith("=")) return value;
  const range = value.slice(1).toUpperCase();

  if (range.startsWith("SOMA(")) {
    const sum = sumRange(range, data, r, c);
    return Number.isFinite(sum) ? sum : "#ERRO";
  }
  if (range.startsWith("MEDIA(") || range.startsWith("MÉDIA(")) {
    const arr = rangeValues(range, data, r, c);
    const nums = arr.filter((n) => typeof n === "number") as number[];
    return nums.length ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)) : 0;
  }
  if (range.startsWith("MAX(") || range.startsWith("MAXIMO(") || range.startsWith("MÁXIMO(")) {
    const arr = rangeValues(range, data, r, c);
    const nums = arr.filter((n) => typeof n === "number") as number[];
    return nums.length ? Math.max(...nums) : 0;
  }
  if (range.startsWith("MIN(") || range.startsWith("MINIMO(") || range.startsWith("MÍNIMO(")) {
    const arr = rangeValues(range, data, r, c);
    const nums = arr.filter((n) => typeof n === "number") as number[];
    return nums.length ? Math.min(...nums) : 0;
  }
  if (range.startsWith("CONT.SE(")) {
    const arr = rangeValues(range, data, r, c);
    const nums = arr.filter((n) => typeof n === "number" && n > 0) as number[];
    return nums.length;
  }
  return value;
}

function parseRange(expr: string) {
  const m = /([A-Z]+)(\d+):([A-Z]+)(\d+)/i.exec(expr);
  if (!m) return null;
  const [, colA, rowA, colB, rowB] = m;
  const cA = colA.toUpperCase().charCodeAt(0) - 65;
  const cB = colB.toUpperCase().charCodeAt(0) - 65;
  const rA = parseInt(rowA, 10) - 1;
  const rB = parseInt(rowB, 10) - 1;
  return { cA, rA, cB, rB };
}

function rangeValues(expr: string, data: Row[], r: number, c: number) {
  const range = parseRange(expr);
  if (!range) return [];
  const out: Cell[] = [];
  for (let i = range.rA; i <= range.rB; i++) {
    for (let j = range.cA; j <= range.cB; j++) {
      const cell = data[i]?.[j];
      if (cell === undefined) continue;
      const v = evalCell(cell, data, i, j);
      if (typeof v === "number") out.push(v);
    }
  }
  return out;
}

function sumRange(expr: string, data: Row[], r: number, c: number) {
  const arr = rangeValues(expr, data, r, c);
  return arr.filter((n) => typeof n === "number").reduce((a, b) => a + (b as number), 0);
}

export function ExcelLab() {
  const [data, setData] = React.useState<Row[]>(INITIAL_DATA);
  const [filter, setFilter] = React.useState<string | null>(null);
  const [palette, setPalette] = React.useState(0);
  const [chartType, setChartType] = React.useState<"bar" | "line" | "pie">("bar");
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(
      () => setTipIndex((i) => (i + 1) % STEPS.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  function update(r: number, c: number, value: string) {
    setData((prev) =>
      prev.map((row, i) =>
        i === r ? row.map((cell, j) => (j === c ? value : cell)) : row
      )
    );
  }

  function addRow() {
    setData((prev) => {
      const next = [...prev];
      const lastProduct = `Item ${prev.length - 4}`;
      next.splice(prev.length - 1, 0, [
        lastProduct,
        "",
        "",
        "",
        "=SOMA(B" + prev.length + ":D" + prev.length + ")",
      ]);
      return next;
    });
  }

  function applyFormula(formula: string) {
    setData((prev) =>
      prev.map((row, i) =>
        i === prev.length - 1
          ? row.map((cell, j) => (j === row.length - 1 ? formula : cell))
          : row
      )
    );
  }

  function reset() {
    setData(INITIAL_DATA);
    setFilter(null);
  }

  const evaluated: (string | number)[][] = data.map((row, r) =>
    row.map((cell, c) => evalCell(cell, data, r, c))
  );

  const totals = evaluated
    .slice(1, evaluated.length - 1)
    .map((r) => (typeof r[4] === "number" ? (r[4] as number) : 0));

  const productNames = data.slice(1, data.length - 1).map((r) => r[0]);
  const months = ["Janeiro", "Fevereiro", "Março"];
  const monthsData: { label: string; values: number[] }[] = [0, 1, 2].map(
    (m) => ({
      label: months[m],
      values: data
        .slice(1, data.length - 1)
        .map((r) => {
          const v = evalCell(r[m + 1], data, data.indexOf(r), m + 1);
          return typeof v === "number" ? v : 0;
        }),
    })
  );

  const totalGeral = totals.reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...totals, 1);

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[400px] rounded-full bg-emerald-400/20 blur-3xl" />

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
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" />
            Laboratório Excel
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Calcule, some e brinque com{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-700 bg-clip-text text-transparent">
              Excel
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Digite números, aplique fórmulas reais e veja gráficos ganharem
            vida com os seus dados.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-emerald-200/30 bg-white/70 p-3 shadow-soft-lg backdrop-blur-md dark:border-emerald-400/15 dark:bg-white/5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Barra de fórmulas
              </span>
              <span className="font-mono text-emerald-900/70 dark:text-emerald-200/80">
                =SOMA(E2:E5) → {formatNumber(totalGeral)}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white/80 dark:border-white/10 dark:bg-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-emerald-500/10 text-emerald-900 dark:text-emerald-100">
                    <th className="w-10 border-b border-r border-black/5 p-2 dark:border-white/10" />
                    {evaluated[0]?.map((h, i) => (
                      <th
                        key={i}
                        className="border-b border-r border-black/5 p-2 text-left font-semibold last:border-r-0 dark:border-white/10"
                      >
                        {h as string}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluated.map((row, r) => (
                    <tr
                      key={r}
                      className={cn(
                        r === evaluated.length - 1 &&
                          "bg-emerald-500/10 font-semibold text-emerald-900 dark:text-emerald-100",
                        filter && row[0] !== filter && r !== 0 && "opacity-30"
                      )}
                    >
                      <td className="border-b border-r border-black/5 bg-emerald-500/5 p-2 text-center text-[10px] font-semibold text-emerald-700 dark:border-white/10 dark:text-emerald-300">
                        {String.fromCharCode(65 + 0)}
                        {r + 1}
                      </td>
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className="border-b border-r border-black/5 p-0 last:border-r-0 dark:border-white/10"
                        >
                          {r === 0 ? (
                            <div className="px-2 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                              {cell as string}
                            </div>
                          ) : r === evaluated.length - 1 && c === 0 ? (
                            <div className="px-2 py-2 font-bold">{cell as string}</div>
                          ) : (
                            <CellInput
                              value={typeof cell === "number" ? String(cell) : (cell as string)}
                              numeric={c > 0 && r < evaluated.length - 1}
                              onChange={(v) => update(r, c, v)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <FormulaButton onClick={() => applyFormula(`=SOMA(E2:E${data.length - 1})`)}>
                  <Sigma className="h-3.5 w-3.5" /> SOMA
                </FormulaButton>
                <FormulaButton onClick={() => applyFormula(`=MEDIA(E2:E${data.length - 1})`)}>
                  <TrendingUp className="h-3.5 w-3.5" /> MÉDIA
                </FormulaButton>
                <FormulaButton onClick={() => applyFormula(`=MAX(E2:E${data.length - 1})`)}>
                  ↑ MÁXIMO
                </FormulaButton>
                <FormulaButton onClick={() => applyFormula(`=MIN(E2:E${data.length - 1})`)}>
                  ↓ MÍNIMO
                </FormulaButton>
                <FormulaButton onClick={() => applyFormula(`=CONT.SE(E2:E${data.length - 1})`)}>
                  ƒ CONT.SE
                </FormulaButton>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={addRow}
                  className="inline-flex items-center gap-1 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/20 dark:text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" /> linha
                </button>
                <select
                  value={filter ?? ""}
                  onChange={(e) => setFilter(e.target.value || null)}
                  className="rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-xs outline-none hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 dark:border-white/10 dark:bg-white/5"
                >
                  <option value="">Sem filtro</option>
                  {productNames.map((p) =>
                    typeof p === "string" ? (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ) : null
                  )}
                </select>
                <button
                  onClick={reset}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white/80 dark:border-white/10 dark:bg-white/5"
                  aria-label="Reiniciar"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-50/50 to-white p-4 dark:border-white/10 dark:from-emerald-400/5 dark:to-white/5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Gráfico de vendas por produto
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setChartType("bar")}
                      aria-label="Barras"
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-md",
                        chartType === "bar"
                          ? "bg-emerald-500 text-white"
                          : "text-emerald-700 hover:bg-white/40 dark:text-emerald-300 dark:hover:bg-white/5"
                      )}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setChartType("line")}
                      aria-label="Linhas"
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-md",
                        chartType === "line"
                          ? "bg-emerald-500 text-white"
                          : "text-emerald-700 hover:bg-white/40 dark:text-emerald-300 dark:hover:bg-white/5"
                      )}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setChartType("pie")}
                      aria-label="Pizza"
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-md",
                        chartType === "pie"
                          ? "bg-emerald-500 text-white"
                          : "text-emerald-700 hover:bg-white/40 dark:text-emerald-300 dark:hover:bg-white/5"
                      )}
                    >
                      <PieIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <Chart
                  type={chartType}
                  labels={productNames.map((p) => (typeof p === "string" ? p : ""))}
                  values={totals}
                  color={PALETTES[palette].bar}
                  soft={PALETTES[palette].soft}
                />
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Paleta
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PALETTES.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => setPalette(i)}
                      style={{ background: p.bar }}
                      className={cn(
                        "h-7 rounded-md text-[10px] font-bold text-white shadow-sm transition hover:scale-105",
                        i === palette && "ring-2 ring-emerald-500 ring-offset-2"
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Total geral
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatNumber(totalGeral)}
                </div>
              </div>
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
                Próximo passo
              </h3>
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {STEPS[tipIndex]}
              </motion.p>
            </div>

            <div className="space-y-2 rounded-2xl border border-emerald-300/40 bg-white/60 p-4 backdrop-blur-md dark:border-emerald-400/20 dark:bg-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Filtros
              </h3>
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                <select
                  value={filter ?? ""}
                  onChange={(e) => setFilter(e.target.value || null)}
                  className="flex-1 rounded-md border border-transparent bg-transparent text-xs outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                >
                  <option value="">Mostrar todos</option>
                  {productNames.map((p) =>
                    typeof p === "string" ? (
                      <option key={p} value={p}>
                        apenas {p}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
            </div>

            <MiniChallenge
              question="Qual função soma o intervalo A1:A10 no Excel?"
              options={["SOMA(A1:A10)", "SOMAR(A1:A10)", "TOTAL(A1:A10)", "ADD(A1:A10)"]}
              correctIndex={0}
              explanation="No Excel em português usamos SOMA(intervalo) — ex: =SOMA(A1:A10)."
              app="excel"
            />
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function CellInput({
  value,
  numeric,
  onChange,
}: {
  value: string;
  numeric?: boolean;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onChange(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
            onChange(draft);
          }
        }}
        className="block h-full w-full bg-yellow-100/80 px-2 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:bg-yellow-400/20"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        "block h-full w-full px-2 py-2 text-left text-xs",
        numeric && !isNaN(Number(value)) && "text-right tabular-nums"
      )}
    >
      {value}
    </button>
  );
}

function FormulaButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-emerald-300"
    >
      {children}
    </button>
  );
}

function Chart({
  type,
  labels,
  values,
  color,
  soft,
}: {
  type: "bar" | "line" | "pie";
  labels: string[];
  values: number[];
  color: string;
  soft: string;
}) {
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  let acc = 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type + color}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="h-56 w-full"
      >
        {type === "bar" && (
          <div className="flex h-full items-end justify-around gap-3 pb-2 pt-1">
            {values.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {formatNumber(v)}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                  style={{ background: color }}
                  className="w-full rounded-t-md shadow-md"
                />
                <span className="line-clamp-1 text-[10px] text-foreground/60">
                  {labels[i]}
                </span>
              </div>
            ))}
          </div>
        )}

        {type === "line" && (
          <svg viewBox="0 0 200 100" className="h-full w-full">
            <defs>
              <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const points = values.map((v, i) => ({
                x: labels.length > 1 ? (i / (labels.length - 1)) * 180 + 10 : 100,
                y: 90 - (v / max) * 70,
              }));
              const path = points
                .map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `L${p.x} ${p.y}`))
                .join(" ");
              const area = `${path} L${points[points.length - 1].x} 90 L${points[0].x} 90 Z`;
              return (
                <>
                  <motion.path
                    d={area}
                    fill="url(#lineFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  {points.map((p, i) => (
                    <motion.circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      fill={color}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                    />
                  ))}
                </>
              );
            })()}
          </svg>
        )}

        {type === "pie" && (
          <div className="flex h-full items-center justify-center gap-3">
            <svg viewBox="0 0 100 100" className="h-full">
              {(() => {
                const slices: { d: string; color: string }[] = [];
                values.forEach((v, i) => {
                  const start = (acc / total) * 360;
                  acc += v;
                  const end = (acc / total) * 360;
                  const r = 45;
                  const cx = 50;
                  const cy = 50;
                  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
                  const x1 = cx + r * Math.cos(rad(start));
                  const y1 = cy + r * Math.sin(rad(start));
                  const x2 = cx + r * Math.cos(rad(end));
                  const y2 = cy + r * Math.sin(rad(end));
                  const large = end - start > 180 ? 1 : 0;
                  slices.push({
                    d: `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
                    color: i === 0 ? color : shade(color, i * 22),
                  });
                });
                return slices.map((s, i) => (
                  <motion.path
                    key={i}
                    d={s.d}
                    fill={s.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{ transformOrigin: "50% 50%" }}
                  />
                ));
              })()}
            </svg>
            <div className="space-y-1 text-[10px]">
              {values.map((v, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: i === 0 ? color : shade(color, i * 22) }}
                  />
                  <span>
                    {labels[i]} · {formatNumber(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function shade(hex: string, percent: number) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) - percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) - percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) - percent));
  return `rgb(${r}, ${g}, ${b})`;
}
