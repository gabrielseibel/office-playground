"use client";

import * as React from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Check, X, Keyboard, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types/game";

export interface ActivityResult {
  correct: boolean;
  timeMs: number;
}

interface ActivityCardProps {
  activity: Activity;
  onComplete: (result: ActivityResult) => void;
  big?: boolean;
  /** Skip rendering the built-in explanation panel (caller handles reveal/next itself). */
  hideExplanation?: boolean;
}

const APP_LABEL: Record<string, string> = {
  word: "Word",
  excel: "Excel",
  ppt: "PowerPoint",
  geral: "Geral",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  facil: "🟢 Fácil",
  medio: "🟡 Médio",
  dificil: "🔴 Difícil",
};

function columnLabel(index: number) {
  // 0 -> A, 1 -> B ... 25 -> Z, 26 -> AA ...
  let n = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

const MODIFIERS = ["ctrl", "shift", "alt"] as const;
const VIRTUAL_KEYS = ["A", "B", "C", "I", "N", "P", "S", "U", "V", "X", "Y", "Z", "F5"];

export function ActivityCard({ activity, onComplete, big, hideExplanation }: ActivityCardProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [boolAnswer, setBoolAnswer] = React.useState<boolean | null>(null);
  const [chartAnswer, setChartAnswer] = React.useState<string | null>(null);
  const [cellAnswer, setCellAnswer] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<string[]>([]);
  const [answered, setAnswered] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);
  const [pressedWrong, setPressedWrong] = React.useState(false);
  const [virtualMods, setVirtualMods] = React.useState<Set<string>>(new Set());
  const [showVirtualKeyboard, setShowVirtualKeyboard] = React.useState(false);
  const startRef = React.useRef(performance.now());

  React.useEffect(() => {
    startRef.current = performance.now();
    setSelected(null);
    setBoolAnswer(null);
    setChartAnswer(null);
    setCellAnswer(null);
    setAnswered(false);
    setCorrect(false);
    setPressedWrong(false);
    setVirtualMods(new Set());
    if (activity.type === "order" && activity.items) {
      setOrder([...activity.items].sort(() => Math.random() - 0.5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id]);

  function finish(isCorrect: boolean) {
    if (answered) return;
    setAnswered(true);
    setCorrect(isCorrect);
    const timeMs = performance.now() - startRef.current;
    onComplete({ correct: isCorrect, timeMs });
  }

  function pickMcq(i: number) {
    if (answered) return;
    setSelected(i);
    finish(i === activity.correctIndex);
  }

  function pickBool(v: boolean) {
    if (answered) return;
    setBoolAnswer(v);
    finish(v === activity.correctBool);
  }

  function pickChart(id: string) {
    if (answered) return;
    setChartAnswer(id);
    finish(id === activity.correctChartId);
  }

  function pickCell(label: string) {
    if (answered) return;
    setCellAnswer(label);
    finish(label === activity.targetLabel);
  }

  function checkOrder() {
    if (answered || !activity.items) return;
    finish(order.every((v, i) => v === activity.items![i]));
  }

  const evaluateCombo = React.useCallback(
    (combo: Set<string>) => {
      if (answered || !activity.keys) return;
      const expected = new Set(activity.keys.map((k) => k.toLowerCase()));
      const same =
        expected.size === combo.size && [...expected].every((k) => combo.has(k));
      if (same) {
        finish(true);
      } else {
        setPressedWrong(true);
        window.setTimeout(() => setPressedWrong(false), 500);
        finish(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activity.keys, answered]
  );

  React.useEffect(() => {
    if (activity.type !== "shortcut") return;
    function onKeyDown(e: KeyboardEvent) {
      if (["Control", "Shift", "Alt", "Meta", "Tab"].includes(e.key)) return;
      if (answered) return;
      e.preventDefault();
      const combo = new Set<string>();
      if (e.ctrlKey || e.metaKey) combo.add("ctrl");
      if (e.shiftKey) combo.add("shift");
      if (e.altKey) combo.add("alt");
      combo.add(e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase());
      evaluateCombo(combo);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, answered, evaluateCombo]);

  function toggleVirtualMod(mod: string) {
    setVirtualMods((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  }

  function pressVirtualKey(key: string) {
    const combo = new Set(virtualMods);
    combo.add(key.toLowerCase());
    evaluateCombo(combo);
  }

  const showResult = answered && !hideExplanation;

  return (
    <div>
      {activity.context && (
        <div
          className={cn(
            "mb-4 rounded-2xl border border-dashed border-foreground/15 bg-white/50 p-4 font-mono text-sm dark:bg-white/5",
            big && "p-6 text-lg"
          )}
        >
          {activity.context}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">{APP_LABEL[activity.app]}</span>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">{DIFFICULTY_LABEL[activity.difficulty]}</span>
      </div>

      <h3 className={cn("mt-3 font-semibold leading-snug", big ? "text-3xl md:text-4xl" : "text-xl")}>
        {activity.prompt}
      </h3>

      {/* MCQ */}
      {activity.type === "mcq" && activity.options && (
        <div className={cn("mt-6 grid gap-3", big ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          {activity.options.map((opt, i) => {
            const isCorrect = i === activity.correctIndex;
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => pickMcq(i)}
                disabled={answered}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 text-left font-medium transition disabled:cursor-not-allowed",
                  big ? "text-lg md:text-xl" : "text-sm",
                  "border-white/20 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                  answered && isCorrect && "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  answered && isSelected && !isCorrect && "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                )}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-foreground/15 bg-background text-xs font-bold text-foreground/70">
                  {answered && isCorrect ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : answered && isSelected && !isCorrect ? (
                    <X className="h-4 w-4 text-rose-600" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* True / False */}
      {activity.type === "true-false" && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[true, false].map((v) => {
            const isCorrect = v === activity.correctBool;
            const isSelected = boolAnswer === v;
            return (
              <button
                key={String(v)}
                onClick={() => pickBool(v)}
                disabled={answered}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 font-bold transition disabled:cursor-not-allowed",
                  big ? "text-2xl" : "text-lg",
                  v
                    ? "border-emerald-300/60 bg-emerald-50/60 hover:bg-emerald-100/60 dark:bg-emerald-400/5"
                    : "border-rose-300/60 bg-rose-50/60 hover:bg-rose-100/60 dark:bg-rose-400/5",
                  answered && isCorrect && "ring-2 ring-emerald-500",
                  answered && isSelected && !isCorrect && "ring-2 ring-rose-500 opacity-60"
                )}
              >
                <span className="text-3xl">{v ? "✅" : "❌"}</span>
                {v ? "VERDADEIRO" : "FALSO"}
              </button>
            );
          })}
        </div>
      )}

      {/* Shortcut */}
      {activity.type === "shortcut" && (
        <div className="mt-6">
          <motion.div
            animate={pressedWrong ? { x: [0, -8, 8, -8, 0] } : {}}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center",
              answered
                ? correct
                  ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-400/10"
                  : "border-rose-400 bg-rose-50/60 dark:bg-rose-400/10"
                : "border-purple-300 bg-purple-50/40 dark:border-purple-400/30 dark:bg-purple-400/5"
            )}
          >
            <Keyboard className={cn("text-purple-500", big ? "h-14 w-14" : "h-10 w-10")} />
            <p className={cn("font-semibold", big ? "text-xl" : "text-sm")}>
              {answered
                ? correct
                  ? "Combinação correta! 🎉"
                  : "Combinação incorreta."
                : "Pressione a combinação correta no teclado!"}
            </p>
            {!answered && (
              <button
                onClick={() => setShowVirtualKeyboard((s) => !s)}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Sem teclado por perto? Toque nas teclas
              </button>
            )}
          </motion.div>

          {showVirtualKeyboard && !answered && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {MODIFIERS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleVirtualMod(m)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-bold uppercase",
                    virtualMods.has(m)
                      ? "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300"
                      : "border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  {m}
                </button>
              ))}
              <span className="text-muted-foreground">+</span>
              {VIRTUAL_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => pressVirtualKey(k)}
                  className="rounded-lg border border-white/20 bg-white/60 px-3 py-2 text-xs font-bold dark:border-white/10 dark:bg-white/5"
                >
                  {k}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order (drag to reorder) */}
      {activity.type === "order" && (
        <div className="mt-6">
          <p className="mb-3 text-xs text-muted-foreground">Arraste os itens para reordenar.</p>
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={setOrder}
            className="space-y-2"
          >
            {order.map((item) => (
              <Reorder.Item
                key={item}
                value={item}
                className={cn(
                  "flex cursor-grab items-center gap-3 rounded-xl border border-white/20 bg-white/70 p-3 shadow-sm active:cursor-grabbing dark:border-white/10 dark:bg-white/5",
                  big && "p-4 text-lg"
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">{item}</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {!answered && (
            <button
              onClick={checkOrder}
              className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
            >
              Conferir ordem
            </button>
          )}
        </div>
      )}

      {/* Click target (spreadsheet cell hunt) */}
      {activity.type === "click-target" && activity.gridRows && activity.gridCols && (() => {
        const rows = activity.gridRows;
        const cols = activity.gridCols;
        return (
        <div className="mt-6 overflow-x-auto">
          <div
            className="inline-grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.25rem, 1fr))` }}
          >
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((__, c) => {
                const label = `${columnLabel(c)}${r + 1}`;
                const isTarget = label === activity.targetLabel;
                const isPicked = cellAnswer === label;
                return (
                  <button
                    key={label}
                    onClick={() => pickCell(label)}
                    disabled={answered}
                    className={cn(
                      "aspect-square min-w-9 rounded-md border text-[10px] font-mono transition disabled:cursor-not-allowed",
                      "border-foreground/10 bg-white/70 hover:bg-emerald-100 dark:bg-white/5 dark:hover:bg-emerald-400/10",
                      answered && isTarget && "border-emerald-500 bg-emerald-500/25",
                      answered && isPicked && !isTarget && "border-rose-500 bg-rose-500/25"
                    )}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>
        );
      })()}

      {/* Chart choice */}
      {activity.type === "chart-choice" && activity.chartOptions && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {activity.chartOptions.map((opt) => {
            const isCorrect = opt.id === activity.correctChartId;
            const isSelected = chartAnswer === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => pickChart(opt.id)}
                disabled={answered}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-6 font-semibold transition disabled:cursor-not-allowed",
                  "border-white/20 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5",
                  answered && isCorrect && "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  answered && isSelected && !isCorrect && "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                )}
              >
                <span className="text-4xl">{opt.emoji}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-6 rounded-2xl border p-4 leading-relaxed",
              big ? "text-lg" : "text-sm",
              correct
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            <strong>{correct ? "✅ Muito bem!" : "❌ Quase lá!"}</strong> {activity.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
