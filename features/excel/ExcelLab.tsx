"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import {
  OfficeTitleBar,
  RibbonTabs,
  RibbonGroup,
  RibbonIconButton,
} from "@/components/office/OfficeChrome";

const EXCEL_COLOR = "#217346";
const RIBBON_TABS = [
  "Arquivo",
  "Página Inicial",
  "Inserir",
  "Fórmulas",
  "Dados",
  "Revisão",
  "Exibir",
];

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

function columnLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function evalCell(value: Cell, data: Row[], r: number, c: number): number | string {
  if (typeof value !== "string") return value;
  if (!value.startsWith("=")) return value;
  const range = value.slice(1).toUpperCase();

  if (range.startsWith("SOMA(")) {
    const sum = sumRange(range, data);
    return Number.isFinite(sum) ? sum : "#ERRO";
  }
  if (range.startsWith("MEDIA(") || range.startsWith("MÉDIA(")) {
    const nums = rangeValues(range, data);
    return nums.length ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)) : 0;
  }
  if (range.startsWith("MAX(") || range.startsWith("MAXIMO(") || range.startsWith("MÁXIMO(")) {
    const nums = rangeValues(range, data);
    return nums.length ? Math.max(...nums) : 0;
  }
  if (range.startsWith("MIN(") || range.startsWith("MINIMO(") || range.startsWith("MÍNIMO(")) {
    const nums = rangeValues(range, data);
    return nums.length ? Math.min(...nums) : 0;
  }
  if (range.startsWith("CONT.SE(")) {
    const nums = rangeValues(range, data).filter((n) => n > 0);
    return nums.length;
  }
  return value;
}

function parseRange(expr: string) {
  const m = /([A-Z]+)(\d+):([A-Z]+)(\d+)/i.exec(expr);
  if (!m) return null;
  const [, colA, rowA, colB, rowB] = m;
  return {
    cA: colA.toUpperCase().charCodeAt(0) - 65,
    cB: colB.toUpperCase().charCodeAt(0) - 65,
    rA: parseInt(rowA, 10) - 1,
    rB: parseInt(rowB, 10) - 1,
  };
}

function rangeValues(expr: string, data: Row[]) {
  const range = parseRange(expr);
  if (!range) return [] as number[];
  const out: number[] = [];
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

function sumRange(expr: string, data: Row[]) {
  return rangeValues(expr, data).reduce((a, b) => a + b, 0);
}

/** Isolado para que a troca de dica a cada 5s não re-renderize a planilha inteira. */
function TipRotator() {
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % STEPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        Próximo passo
      </h3>
      <motion.p
        key={tipIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-sm leading-relaxed text-muted-foreground"
      >
        {STEPS[tipIndex]}
      </motion.p>
    </div>
  );
}

export function ExcelLab() {
  const [data, setData] = React.useState<Row[]>(INITIAL_DATA);
  const [filter, setFilter] = React.useState<string | null>(null);
  const [palette, setPalette] = React.useState(0);
  const [chartType, setChartType] = React.useState<"bar" | "line" | "pie">("bar");

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

  const evaluated = React.useMemo<(string | number)[][]>(
    () => data.map((row, r) => row.map((cell, c) => evalCell(cell, data, r, c))),
    [data]
  );

  const totals = React.useMemo(
    () =>
      evaluated
        .slice(1, evaluated.length - 1)
        .map((r) => (typeof r[4] === "number" ? (r[4] as number) : 0)),
    [evaluated]
  );

  const productNames = React.useMemo(
    () => data.slice(1, data.length - 1).map((r) => r[0]),
    [data]
  );

  const totalGeral = React.useMemo(() => totals.reduce((a, b) => a + b, 0), [totals]);

  const columnCount = INITIAL_DATA[0].length;

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background pt-24 dark:from-emerald-950/10">
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
            Colunas com letras, linhas com números — uma planilha de verdade,
            com fórmulas reais e um gráfico que reage ao que você digita.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-soft-lg dark:border-white/10 dark:bg-[#1c1c22]"
          >
            <OfficeTitleBar color={EXCEL_COLOR} icon="X" fileName="Pasta1 - Excel" />
            <RibbonTabs color={EXCEL_COLOR} tabs={RIBBON_TABS} active="Página Inicial" />

            <div className="flex items-stretch gap-1 overflow-x-auto border-b border-black/10 bg-white px-2 py-2 dark:border-white/10 dark:bg-white/5">
              <RibbonGroup label="Biblioteca de funções">
                <div className="flex flex-wrap items-center gap-1">
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
              </RibbonGroup>

              <RibbonGroup label="Células">
                <RibbonIconButton onClick={addRow} label="Inserir linha">
                  <Plus className="h-3.5 w-3.5" />
                </RibbonIconButton>
              </RibbonGroup>

              <RibbonGroup label="Edição">
                <select
                  value={filter ?? ""}
                  onChange={(e) => setFilter(e.target.value || null)}
                  className="h-7 rounded border border-black/10 bg-white px-1.5 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-white/10 dark:bg-white/10"
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
                <RibbonIconButton onClick={reset} label="Reiniciar planilha">
                  <RefreshCw className="h-3.5 w-3.5" />
                </RibbonIconButton>
              </RibbonGroup>
            </div>

            {/* Barra de fórmulas */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white px-3 py-1.5 text-xs dark:border-white/10 dark:bg-white/5">
              <span className="rounded border border-black/10 px-2 py-0.5 font-mono text-[11px] text-foreground/70 dark:border-white/10">
                E{evaluated.length}
              </span>
              <span className="italic text-foreground/40">ƒx</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-300">
                =SOMA(E2:E{evaluated.length - 1}) → {formatNumber(totalGeral)}
              </span>
            </div>

            {/* Planilha, com cabeçalho de colunas (A, B, C…) e linhas numeradas */}
            <div className="overflow-x-auto bg-[#f3f2f1] p-3 dark:bg-black/20">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="w-10 border border-black/10 bg-[#e6e6e6] dark:border-white/10 dark:bg-white/10" />
                    {Array.from({ length: columnCount }).map((_, c) => (
                      <th
                        key={c}
                        className="border border-black/10 bg-[#e6e6e6] p-1.5 text-center font-semibold text-foreground/60 dark:border-white/10 dark:bg-white/10"
                      >
                        {columnLetter(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluated.map((row, r) => (
                    <tr
                      key={r}
                      className={cn(
                        r === evaluated.length - 1 && "bg-emerald-500/10 font-semibold",
                        filter && row[0] !== filter && r !== 0 && "opacity-30"
                      )}
                    >
                      <td className="border border-black/10 bg-[#e6e6e6] p-1.5 text-center font-semibold text-foreground/60 dark:border-white/10 dark:bg-white/10">
                        {r + 1}
                      </td>
                      {row.map((cell, c) => (
                        <td key={c} className="border border-black/10 bg-white p-0 dark:border-white/10 dark:bg-transparent">
                          {r === 0 ? (
                            <div className="px-2 py-2 text-xs font-semibold">{cell as string}</div>
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

            <div className="grid gap-4 border-t border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_auto]">
              <div className="rounded-lg border border-black/5 bg-[#fafafa] p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Gráfico de vendas por produto
                  </span>
                  <div className="flex items-center gap-1">
                    <RibbonIconButton active={chartType === "bar"} onClick={() => setChartType("bar")} label="Barras">
                      <BarChart3 className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <RibbonIconButton active={chartType === "line"} onClick={() => setChartType("line")} label="Linhas">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                    <RibbonIconButton active={chartType === "pie"} onClick={() => setChartType("pie")} label="Pizza">
                      <PieIcon className="h-3.5 w-3.5" />
                    </RibbonIconButton>
                  </div>
                </div>

                <Chart
                  type={chartType}
                  labels={productNames.map((p) => (typeof p === "string" ? p : ""))}
                  values={totals}
                  color={PALETTES[palette].bar}
                />
              </div>

              <div className="rounded-lg border border-black/5 bg-[#fafafa] p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Paleta</div>
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
                <div className="mt-3 text-xs text-muted-foreground">Total geral</div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatNumber(totalGeral)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4"
          >
            <TipRotator />

            <div className="space-y-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/5">
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
        className="block h-full w-full bg-yellow-100 px-2 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:bg-yellow-400/20"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        "block h-full w-full px-2 py-2 text-left text-xs hover:bg-emerald-500/5",
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
      className="inline-flex items-center gap-1 rounded border border-black/10 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 shadow-sm hover:bg-emerald-500/10 dark:border-white/10 dark:bg-white/10 dark:text-emerald-300"
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
}: {
  type: "bar" | "line" | "pie";
  labels: string[];
  values: number[];
  color: string;
}) {
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  let acc = 0;

  return (
    <div key={type + color} className="h-56 w-full">
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
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ background: color }}
                className="w-full rounded-t-sm"
              />
              <span className="line-clamp-1 text-[10px] text-foreground/60">{labels[i]}</span>
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
                <path d={area} fill="url(#lineFill)" />
                <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
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
              return slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />);
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
    </div>
  );
}

function shade(hex: string, percent: number) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) - percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) - percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) - percent));
  return `rgb(${r}, ${g}, ${b})`;
}
