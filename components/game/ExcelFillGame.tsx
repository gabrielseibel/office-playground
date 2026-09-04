"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, ShoppingCart, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";

interface Row {
  produto: string;
  emoji: string;
  quantidade: number;
  preco: number;
}

interface Scenario {
  title: string;
  budget: number;
  rows: Row[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "Mercado do Excel 🛒",
    budget: 100,
    rows: [
      { produto: "Maçã", emoji: "🍎", quantidade: 4, preco: 2 },
      { produto: "Pão", emoji: "🍞", quantidade: 3, preco: 5 },
      { produto: "Suco", emoji: "🧃", quantidade: 2, preco: 8 },
    ],
  },
  {
    title: "Planilha em Fuga 🏃",
    budget: 100,
    rows: [
      { produto: "Caneta", emoji: "🖊️", quantidade: 5, preco: 2 },
      { produto: "Caderno", emoji: "📓", quantidade: 2, preco: 15 },
      { produto: "Mochila", emoji: "🎒", quantidade: 1, preco: 40 },
    ],
  },
];

export function ExcelFillGame() {
  const [scenarioIndex, setScenarioIndex] = React.useState(0);
  const scenario = SCENARIOS[scenarioIndex];
  const [totals, setTotals] = React.useState<string[]>(scenario.rows.map(() => ""));
  const [grandTotal, setGrandTotal] = React.useState("");
  const [change, setChange] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const startRef = React.useRef(performance.now());

  const correctTotals = scenario.rows.map((r) => r.quantidade * r.preco);
  const correctGrandTotal = correctTotals.reduce((a, b) => a + b, 0);
  const correctChange = scenario.budget - correctGrandTotal;

  function verify() {
    const timeMs = performance.now() - startRef.current;
    const rowsOk = totals.every((t, i) => Number(t) === correctTotals[i]);
    const grandOk = Number(grandTotal) === correctGrandTotal;
    const changeOk = Number(change) === correctChange;
    const correct = rowsOk && grandOk && changeOk;
    setChecked(true);
    recordAnswer({
      app: "excel",
      category: "situacoes-reais",
      correct,
      timeMs,
      points: 180,
    });
  }

  function reset(next = (scenarioIndex + 1) % SCENARIOS.length) {
    setScenarioIndex(next);
    setTotals(SCENARIOS[next].rows.map(() => ""));
    setGrandTotal("");
    setChange("");
    setChecked(false);
    startRef.current = performance.now();
  }

  const allFilled = totals.every((t) => t !== "") && grandTotal !== "" && change !== "";

  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <ShoppingCart className="h-4 w-4 text-emerald-600" /> {scenario.title}
      </p>
      <p className="mb-4 text-xs text-muted-foreground">
        Você tem <strong>R$ {scenario.budget}</strong>. Calcule o total de cada produto (quantidade × preço), o total
        geral da compra e o troco.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-emerald-200/40 bg-white/80 dark:border-emerald-400/15 dark:bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-emerald-500/10 text-emerald-900 dark:text-emerald-100">
            <tr>
              <th className="border-b border-r border-black/5 p-3 text-left dark:border-white/10">Produto</th>
              <th className="border-b border-r border-black/5 p-3 dark:border-white/10">Quantidade</th>
              <th className="border-b border-r border-black/5 p-3 dark:border-white/10">Preço</th>
              <th className="border-b border-black/5 p-3 dark:border-white/10">Total</th>
            </tr>
          </thead>
          <tbody>
            {scenario.rows.map((r, i) => {
              const ok = checked && Number(totals[i]) === correctTotals[i];
              const bad = checked && Number(totals[i]) !== correctTotals[i];
              return (
                <tr key={r.produto}>
                  <td className="border-b border-r border-black/5 p-3 font-semibold dark:border-white/10">
                    {r.emoji} {r.produto}
                  </td>
                  <td className="border-b border-r border-black/5 p-3 text-center font-mono dark:border-white/10">{r.quantidade}</td>
                  <td className="border-b border-r border-black/5 p-3 text-center font-mono dark:border-white/10">R$ {r.preco}</td>
                  <td className="border-b border-black/5 p-3 dark:border-white/10">
                    <input
                      type="number"
                      value={totals[i]}
                      disabled={checked}
                      onChange={(e) => {
                        const next = [...totals];
                        next[i] = e.target.value;
                        setTotals(next);
                      }}
                      className={cn(
                        "w-24 rounded-lg border bg-white px-2 py-1 text-center font-mono outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:bg-black/20",
                        ok && "border-emerald-500",
                        bad && "border-rose-500"
                      )}
                      placeholder="R$"
                    />
                    {checked && (ok ? <Check className="ml-2 inline h-4 w-4 text-emerald-600" /> : <X className="ml-2 inline h-4 w-4 text-rose-600" />)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-white/5">
          Total geral da compra
          <input
            type="number"
            value={grandTotal}
            disabled={checked}
            onChange={(e) => setGrandTotal(e.target.value)}
            className={cn(
              "w-24 rounded-lg border bg-white px-2 py-1 text-center font-mono outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:bg-black/20",
              checked && (Number(grandTotal) === correctGrandTotal ? "border-emerald-500" : "border-rose-500")
            )}
            placeholder="R$"
          />
        </label>
        <label className="flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-white/5">
          Troco (de R$ {scenario.budget})
          <input
            type="number"
            value={change}
            disabled={checked}
            onChange={(e) => setChange(e.target.value)}
            className={cn(
              "w-24 rounded-lg border bg-white px-2 py-1 text-center font-mono outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:bg-black/20",
              checked && (Number(change) === correctChange ? "border-emerald-500" : "border-rose-500")
            )}
            placeholder="R$"
          />
        </label>
      </div>

      {!checked ? (
        <button
          onClick={verify}
          disabled={!allFilled}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verificar
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-50/60 p-4 dark:bg-emerald-400/10"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <Trophy className="h-4 w-4" /> Total: R$ {correctGrandTotal} · Troco: R$ {correctChange}
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Próxima loja
          </button>
        </motion.div>
      )}
    </div>
  );
}
