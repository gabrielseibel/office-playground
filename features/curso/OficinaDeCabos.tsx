"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Cable, Wrench, Network, Maximize, Minimize, Star, RotateCcw, Check, X, TerminalSquare, Trash2, Eye, Play, FileText, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import {
  WIRES, NORMA_A, NORMA_B, ORDEM_CROSS_GIG, CATS, COMPRIMENTOS, precoCabo, normaDaOrdem,
  pontaVazia, pontaPronta, resultadoDecapagem, resultadoInsercao, textoInsercao, testar, inspecionar, enlaceDoCabo,
  avaliarRede, distanciaM, executarComando, ATIVOS,
  type WireId, type Ponta, type Cabo, type Cat, type TipoCabo, type Ferramenta, type Ligacao, type Disp, type Porta,
} from "@/lib/cabos";
import { MISSOES, type Missao } from "@/lib/cabosMissoes";
import { Tutoriais, Materiais, Videos } from "./OficinaTutoriais";

type Modo = "bancada" | "diagnostico" | "rede" | "tutoriais" | "materiais" | "apoio";
const MODOS: { id: Modo; titulo: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "bancada", titulo: "Bancada de crimpagem", sub: "Monte o cabo", icon: Wrench },
  { id: "diagnostico", titulo: "Diagnóstico", sub: "Leia o testador", icon: Eye },
  { id: "rede", titulo: "Rede da clínica", sub: "Missões", icon: Network },
  { id: "tutoriais", titulo: "Tutoriais animados", sub: "Veja como se faz", icon: Play },
  { id: "materiais", titulo: "Materiais", sub: "Baixar e consultar", icon: FileText },
  { id: "apoio", titulo: "Vídeos e leituras", sub: "Assistir aqui", icon: Video },
];

const ESTOQUE_KEY = "op-cabos-estoque-v1";
const PROGRESSO_KEY = "op-cabos-progresso-v1";

function lerLS<T>(k: string, padrao: T): T {
  try {
    const v = window.localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}
function gravarLS(k: string, v: unknown) {
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* sem armazenamento */
  }
}

function xp(correct: boolean, points: number, categoria: string, t0: number) {
  try {
    recordAnswer({ app: "info", category: categoria, correct, timeMs: Date.now() - t0, points });
  } catch {
    /* ignora */
  }
}

/* ===================== Peças visuais ===================== */
function Fio({ id, grande, selecionado, onClick, rotulo }: { id: WireId; grande?: boolean; selecionado?: boolean; onClick?: () => void; rotulo?: string }) {
  const w = WIRES[id];
  const alt = grande ? "h-24 w-9" : "h-10 w-5";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={w.nome}
      title={w.nome}
      className={cn("relative rounded-full border-2 transition", alt, selecionado ? "border-blue-500 ring-2 ring-blue-500 -translate-y-1" : "border-black/20 dark:border-white/30", onClick ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default")}
      style={{ background: w.listrado ? `repeating-linear-gradient(135deg, #fff 0 6px, ${w.cor} 6px 12px)` : w.cor }}
    >
      {rotulo && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 dark:text-slate-300">{rotulo}</span>}
    </button>
  );
}

function Leds({ leds, animar }: { leds: ("ok" | "aberto" | "pisca")[]; animar?: boolean }) {
  return (
    <div className="flex gap-2" aria-label="Luzes do testador">
      {leds.map((l, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span
            className={cn("h-5 w-5 rounded-full border border-black/30", l === "ok" && "bg-emerald-400 shadow-[0_0_10px_#34d399]", l === "aberto" && "bg-slate-300 dark:bg-slate-700", l === "pisca" && "bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse")}
            style={animar ? { animation: `ledIn 0.3s ${i * 0.22}s both` } : undefined}
          />
          <span className="text-[10px] font-bold text-slate-500">{i + 1}</span>
        </div>
      ))}
      <style>{`@keyframes ledIn{from{opacity:.15;transform:scale(.6)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function Caixa({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70", className)}>{children}</div>;
}
function Botao({ children, onClick, tipo = "pri", disabled, className }: { children: React.ReactNode; onClick?: () => void; tipo?: "pri" | "sec" | "perigo"; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40",
        tipo === "pri" && "bg-blue-600 text-white hover:bg-blue-700",
        tipo === "sec" && "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        tipo === "perigo" && "bg-rose-600 text-white hover:bg-rose-700",
        className,
      )}
    >
      {children}
    </button>
  );
}
function Estrelas({ n, max = 3 }: { n: number; max?: number }) {
  return (
    <span className="inline-flex" aria-label={`${n} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} className={cn("h-5 w-5", i < n ? "fill-amber-400 text-amber-500" : "text-slate-300 dark:text-slate-600")} />
      ))}
    </span>
  );
}

/* ===================== MODO 1: BANCADA ===================== */
interface Trabalho {
  id: string;
  titulo: string;
  cliente: string;
  tipo: TipoCabo;
  cat: Cat;
  m: number;
  alvoA: "A" | "B";
  alvoB: "A" | "B" | "GIG";
  pedido: string;
  reparo?: boolean;
}
const TRABALHOS: Trabalho[] = [
  { id: "t1", titulo: "Cabo direto para o PC", cliente: "Recepção", tipo: "direto", cat: "cat5e", m: 3, alvoA: "B", alvoB: "B", pedido: "Ligar o PC da recepção ao switch. Padrão da empresa: T568B nas duas pontas." },
  { id: "t2", titulo: "Cabo direto Cat6 para a impressora", cliente: "Administração", tipo: "direto", cat: "cat6", m: 5, alvoA: "B", alvoB: "B", pedido: "Cabo direto T568B nas duas pontas. Sem pressa, mas sem refazer." },
  { id: "t3", titulo: "Crossover para dois PCs antigos", cliente: "Laboratório", tipo: "crossover", cat: "cat5e", m: 2, alvoA: "A", alvoB: "B", pedido: "Ligar dois notebooks antigos direto, sem switch. Pontas em normas diferentes: T568A de um lado e T568B do outro (crossover 10/100)." },
  { id: "t4", titulo: "Crossover gigabit completo", cliente: "TI", tipo: "crossover-gig", cat: "cat6", m: 2, alvoA: "A", alvoB: "GIG", pedido: "Dois servidores sem auto-MDIX a 1 Gbps. Os quatro pares precisam ser cruzados: T568A de um lado e a ordem gigabit do outro." },
  { id: "t5", titulo: "Reparo: ponta B com mau contato", cliente: "Consultório 2", tipo: "direto", cat: "cat5e", m: 4, alvoA: "B", alvoB: "B", reparo: true, pedido: "O cabo do consultório pisca no testador. A ponta A está boa. Corte a ponta B e refaça sem trocar o cabo inteiro." },
];

function ordemAlvo(a: "A" | "B" | "GIG"): WireId[] {
  return a === "A" ? NORMA_A : a === "B" ? NORMA_B : ORDEM_CROSS_GIG;
}

type Passo = "diag" | "ferr" | "ordem" | "corte" | "insere" | "crimpa" | "pronto";
const PASSOS: { id: Passo; nome: string }[] = [
  { id: "ferr", nome: "1. Decapar" },
  { id: "ordem", nome: "2. Alinhar" },
  { id: "corte", nome: "3. Cortar" },
  { id: "insere", nome: "4. Inserir" },
  { id: "crimpa", nome: "5. Crimpar" },
];

function Bancada() {
  const [ti, setTi] = React.useState(0);
  const t = TRABALHOS[ti];
  const [lado, setLado] = React.useState<"A" | "B">("A");
  const [passo, setPasso] = React.useState<Passo>("ferr");
  const [a, setA] = React.useState<Ponta>(pontaVazia());
  const [b, setB] = React.useState<Ponta>(pontaVazia());
  const [msg, setMsg] = React.useState("");
  const [ferr, setFerr] = React.useState<Ferramenta | null>(null);
  const [dec, setDec] = React.useState(30);
  const [destr, setDestr] = React.useState(25);
  const [corte, setCorte] = React.useState(20);
  const [sel, setSel] = React.useState<number | null>(null);
  const [dica, setDica] = React.useState(false);
  const [refeitos, setRefeitos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const [estoque, setEstoque] = React.useState<Cabo[]>([]);
  const [guardado, setGuardado] = React.useState(false);
  const [agulha, setAgulha] = React.useState(0);
  const dirRef = React.useRef(1);
  const t0 = React.useRef(Date.now());

  React.useEffect(() => {
    setEstoque(lerLS<Cabo[]>(ESTOQUE_KEY, []));
  }, []);

  const iniciar = React.useCallback((i: number) => {
    const tr = TRABALHOS[i];
    setTi(i);
    setFim(false);
    setGuardado(false);
    setRefeitos(0);
    setDica(false);
    setMsg("");
    setSel(null);
    setFerr(null);
    setDec(30);
    setDestr(25);
    setCorte(20);
    t0.current = Date.now();
    if (tr.reparo) {
      setA(pontaPronta(NORMA_B));
      setB(pontaPronta(NORMA_B, { crimpagem: "fraca" }));
      setLado("B");
      setPasso("diag");
    } else {
      setA(pontaVazia());
      setB(pontaVazia());
      setLado("A");
      setPasso("ferr");
    }
  }, []);
  React.useEffect(() => iniciar(0), [iniciar]);

  const ponta = lado === "A" ? a : b;
  const setPonta = (fn: (p: Ponta) => Ponta) => (lado === "A" ? setA(fn) : setB(fn));

  React.useEffect(() => {
    if (passo !== "crimpa") return;
    const id = window.setInterval(() => {
      setAgulha((v) => {
        let n = v + dirRef.current * 2.4;
        if (n >= 100) { n = 100; dirRef.current = -1; }
        if (n <= 0) { n = 0; dirRef.current = 1; }
        return n;
      });
    }, 20);
    return () => window.clearInterval(id);
  }, [passo]);

  const refazerPonta = () => {
    setRefeitos((r) => r + 1);
    setPonta(() => pontaVazia());
    setPasso("ferr");
    setFerr(null);
    setMsg("Ponta cortada. Recomece a decapagem. Cada refação conta no seu desempenho.");
  };

  const decapar = () => {
    if (!ferr) return;
    const r = resultadoDecapagem(ferr, dec);
    setPonta((p) => ({ ...p, ferramenta: ferr, decapadoMm: dec, feridos: r.feridos }));
    setMsg(r.aviso);
    if (r.ok) setPasso("ordem");
  };
  const trocar = (i: number) => {
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    setPonta((p) => {
      const o = [...p.ordem];
      [o[sel], o[i]] = [o[i], o[sel]];
      return { ...p, ordem: o };
    });
    setSel(null);
  };
  const alinhar = () => {
    setPonta((p) => ({ ...p, destrancadoMm: destr }));
    const n = normaDaOrdem(ponta.ordem);
    setMsg(n ? `Alinhado na norma T568${n}.` : "A ordem não segue T568A nem T568B. Confira com a tabela de consulta.");
    setPasso("corte");
  };
  const cortar = () => {
    setPonta((p) => ({ ...p, cortadoMm: corte }));
    setPasso("insere");
    setMsg("");
  };
  const inserir = () => {
    const r = resultadoInsercao(corte);
    setPonta((p) => ({ ...p, insercao: r }));
    setMsg(textoInsercao(r));
    if (r === "nao-entra") {
      setPasso("corte");
    } else if (r === "curto") {
      setMsg(textoInsercao(r) + " Não dá para emendar fio cortado: é preciso recortar a ponta e refazer.");
    } else setPasso("crimpa");
  };
  const crimpar = () => {
    const c = agulha < 35 ? "fraca" : agulha <= 72 ? "ok" : "forte";
    setPonta((p) => ({ ...p, crimpagem: c }));
    setMsg(c === "ok" ? "Crimpagem firme. As garras do conector morderam a isolação de cada fio." : c === "fraca" ? "Crimpagem fraca. Alguns contatos podem não tocar o cobre." : "Crimpagem forte demais: o plástico do conector pode rachar.");
    if (lado === "A" && !t.reparo) {
      setLado("B");
      setPasso("ferr");
      setFerr(null);
      setSel(null);
    } else {
      setPasso("pronto");
      setFim(true);
      avaliarFinal(lado === "A" ? { ...a, crimpagem: c } : a, lado === "B" ? { ...b, crimpagem: c } : b);
    }
  };

  const cabo: Cabo = { id: "bancada-" + t.id, nome: t.titulo, cat: t.cat, comprimentoM: t.m, a, b, planejado: t.tipo, origem: "bancada" };
  const esperada = t.tipo === "direto" ? "direto" : t.tipo === "crossover" ? "crossover-fast" : "crossover-gig";
  const teste = React.useMemo(() => testar(cabo), [a, b]); // eslint-disable-line react-hooks/exhaustive-deps
  const insp = React.useMemo(() => inspecionar(cabo), [a, b]); // eslint-disable-line react-hooks/exhaustive-deps
  const funcional = teste.classe === esperada && teste.abertos.length === 0 && teste.piscando.length === 0;
  const estrelas = !funcional ? 0 : insp.problemas.length === 0 && !dica && refeitos === 0 ? 3 : insp.problemas.length <= 1 && refeitos <= 1 ? 2 : 1;

  function avaliarFinal(pa: Ponta, pb: Ponta) {
    const c: Cabo = { ...cabo, a: pa, b: pb };
    const tt = testar(c);
    const ii = inspecionar(c);
    const ok = tt.classe === esperada && tt.abertos.length === 0 && tt.piscando.length === 0;
    const est = !ok ? 0 : ii.problemas.length === 0 && !dica && refeitos === 0 ? 3 : ii.problemas.length <= 1 && refeitos <= 1 ? 2 : 1;
    xp(est >= 2, est * 12 + (ok ? 6 : 0), "cabeamento", t0.current);
    const prog = lerLS<Record<string, number>>(PROGRESSO_KEY, {});
    if ((prog[t.id] ?? 0) < est) {
      prog[t.id] = est;
      gravarLS(PROGRESSO_KEY, prog);
    }
  }

  const guardar = () => {
    const novo: Cabo = { ...cabo, id: "est-" + Date.now(), origem: "bancada" };
    const lista = [...estoque, novo].slice(-12);
    setEstoque(lista);
    gravarLS(ESTOQUE_KEY, lista);
    setGuardado(true);
  };

  const alvoA = ordemAlvo(t.alvoA);
  const alvoB = ordemAlvo(t.alvoB);
  const stepIdx = PASSOS.findIndex((p) => p.id === passo);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Caixa className="h-fit">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-500">Ordens de serviço</h3>
        <div className="space-y-2">
          {TRABALHOS.map((tr, i) => {
            const e = lerLS<Record<string, number>>(PROGRESSO_KEY, {})[tr.id] ?? 0;
            return (
              <button key={tr.id} type="button" onClick={() => iniciar(i)} className={cn("w-full rounded-xl border p-3 text-left text-sm transition", i === ti ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800")}>
                <div className="font-bold">{tr.titulo}</div>
                <div className="flex items-center justify-between text-xs text-slate-500"><span>{tr.cliente} · {CATS[tr.cat].nome} · {tr.m} m</span><Estrelas n={e} /></div>
              </button>
            );
          })}
        </div>
        {estoque.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">Estoque: <strong>{estoque.length}</strong> cabo(s) feito(s) por você. Eles aparecem na Rede da clínica.</p>
        )}
      </Caixa>

      <div className="space-y-4">
        <Caixa>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-extrabold">{t.titulo}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.pedido}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{CATS[t.cat].nome} · {t.m} m · ponta A: T568{t.alvoA} · ponta B: T568{t.alvoB === "GIG" ? " (gigabit)" : t.alvoB}</p>
            </div>
            <Botao tipo="sec" onClick={() => setDica((d) => !d)}>{dica ? "Fechar consulta" : "Consultar tabela (perde ⭐)"}</Botao>
          </div>
          {dica && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[["Ponta A", alvoA], ["Ponta B", alvoB]].map(([n, o]) => (
                <div key={n as string}>
                  <div className="mb-1 text-xs font-bold text-slate-500">{n as string}: pinos 1 a 8</div>
                  <div className="flex gap-1">{(o as WireId[]).map((w, i) => <Fio key={i} id={w} rotulo={String(i + 1)} />)}</div>
                </div>
              ))}
            </div>
          )}
        </Caixa>

        {!fim && passo !== "diag" && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", lado === "A" ? "bg-sky-600 text-white" : "bg-violet-600 text-white")}>Ponta {lado}</span>
              {PASSOS.map((p, i) => (
                <span key={p.id} className={cn("rounded-full px-3 py-1 text-xs font-bold", i === stepIdx ? "bg-blue-600 text-white" : i < stepIdx ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800")}>{p.nome}</span>
              ))}
            </div>
            <Caixa>
              {passo === "ferr" && (
                <div className="space-y-3">
                  <p className="font-bold">Escolha a ferramenta e quanto de capa retirar.</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {([["decapador", "Decapador de cabo UTP", "Lâmina regulável, não fere os fios"], ["alicate-corte", "Alicate de corte", "Rápido, mas arranha"], ["estilete", "Estilete", "Corta fácil, e a mão também"]] as [Ferramenta, string, string][]).map(([id, n, s]) => (
                      <button key={id} type="button" onClick={() => setFerr(id)} className={cn("rounded-xl border p-3 text-left text-sm", ferr === id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 dark:border-slate-700")}>
                        <div className="font-bold">{n}</div><div className="text-xs text-slate-500">{s}</div>
                      </button>
                    ))}
                  </div>
                  <label className="block text-sm font-bold">Capa retirada: {dec} mm
                    <input type="range" min={10} max={50} value={dec} onChange={(e) => setDec(Number(e.target.value))} className="mt-1 w-full" />
                  </label>
                  <div className="flex flex-wrap gap-2"><Botao onClick={decapar} disabled={!ferr}>Decapar</Botao>{ponta.ferramenta && ponta.feridos.length > 0 && <Botao tipo="perigo" onClick={refazerPonta}>Cortar a ponta e refazer</Botao>}</div>
                </div>
              )}
              {passo === "ordem" && (
                <div className="space-y-3">
                  <p className="font-bold">Clique em dois fios para trocar de lugar. O pino 1 é o da esquerda (com a trava para baixo).</p>
                  <div className="flex flex-wrap items-end justify-center gap-2 pb-6">
                    {ponta.ordem.map((w, i) => <Fio key={i} id={w} grande selecionado={sel === i} onClick={() => trocar(i)} rotulo={String(i + 1)} />)}
                  </div>
                  <label className="block text-sm font-bold">Destrançado: {destr} mm <span className="font-normal text-slate-500">(destrance só o necessário)</span>
                    <input type="range" min={5} max={40} value={destr} onChange={(e) => setDestr(Number(e.target.value))} className="mt-1 w-full" />
                  </label>
                  <Botao onClick={alinhar}>Alinhar e continuar</Botao>
                </div>
              )}
              {passo === "corte" && (
                <div className="space-y-3">
                  <p className="font-bold">Alinhe e apare a ponta dos fios com o alicate. Quanto de fio deve sobrar fora da capa?</p>
                  <label className="block text-sm font-bold">Fios expostos: {corte} mm
                    <input type="range" min={5} max={25} value={corte} onChange={(e) => setCorte(Number(e.target.value))} className="mt-1 w-full" />
                  </label>
                  <Botao onClick={cortar}>Cortar</Botao>
                </div>
              )}
              {passo === "insere" && (
                <div className="space-y-3">
                  <p className="font-bold">Insira os fios no conector RJ45. Eles devem tocar o fundo.</p>
                  <div className="flex items-center gap-2">{ponta.ordem.map((w, i) => <Fio key={i} id={w} />)}</div>
                  <div className="flex flex-wrap gap-2"><Botao onClick={inserir}>Inserir no RJ45</Botao>{ponta.insercao === "curto" && <Botao tipo="perigo" onClick={refazerPonta}>Cortar a ponta e refazer</Botao>}</div>
                </div>
              )}
              {passo === "crimpa" && (
                <div className="space-y-3">
                  <p className="font-bold">Posicione o conector no alicate e aperte no ponto certo.</p>
                  <div className="relative h-8 overflow-hidden rounded-full border border-slate-300 dark:border-slate-600">
                    <div className="absolute inset-y-0 left-0 w-[35%] bg-amber-200 dark:bg-amber-900/50" />
                    <div className="absolute inset-y-0 left-[35%] w-[37%] bg-emerald-300 dark:bg-emerald-700/60" />
                    <div className="absolute inset-y-0 left-[72%] right-0 bg-rose-300 dark:bg-rose-900/60" />
                    <div className="absolute inset-y-0 w-1.5 bg-slate-900 dark:bg-white" style={{ left: `${agulha}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">Fraca · Firme · Forte demais</p>
                  <Botao onClick={crimpar}>Crimpar</Botao>
                </div>
              )}
              {msg && <p role="status" className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">{msg}</p>}
            </Caixa>
          </>
        )}

        {passo === "diag" && (
          <Caixa>
            <p className="mb-2 font-bold">Teste o cabo antes de mexer.</p>
            <Leds leds={testar({ a, b }).leds} animar />
            <p className="mt-2 text-sm">{testar({ a, b }).descricao}</p>
            <Botao className="mt-3" tipo="perigo" onClick={() => { setB(pontaVazia()); setPasso("ferr"); setFerr(null); setMsg("Ponta B cortada. Refaça os passos."); }}>Cortar a ponta B e refazer</Botao>
          </Caixa>
        )}

        {fim && (
          <Caixa>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg font-extrabold">Testador de cabos</h4>
              <Estrelas n={estrelas} />
            </div>
            <Leds leds={teste.leds} animar />
            <p className="mt-3 text-sm">{teste.descricao}</p>
            <div className={cn("mt-3 rounded-xl p-3 text-sm font-bold", funcional ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200")}>
              {funcional ? "Cabo aprovado no testador." : "Reprovado. O cabo não é o que o cliente pediu ou tem defeito."}
            </div>
            {insp.problemas.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-extrabold">Inspeção visual do técnico</div>
                <ul className="mt-1 list-disc pl-5 text-sm">{insp.problemas.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
            )}
            {insp.problemas.length === 0 && funcional && <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">Inspeção visual limpa. Obra de profissional.</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {funcional && <Botao onClick={guardar} disabled={guardado}>{guardado ? "Guardado no estoque" : "Guardar no estoque"}</Botao>}
              <Botao tipo="sec" onClick={() => iniciar(ti)}><RotateCcw className="mr-1 inline h-4 w-4" />Refazer</Botao>
              {ti < TRABALHOS.length - 1 && <Botao tipo="sec" onClick={() => iniciar(ti + 1)}>Próxima ordem</Botao>}
            </div>
          </Caixa>
        )}
      </div>
    </div>
  );
}

/* ===================== MODO 2: DIAGNÓSTICO ===================== */
interface Caso {
  id: string;
  titulo: string;
  sintoma: string;
  cabo: Pick<Cabo, "a" | "b" | "cat" | "comprimentoM">;
  opcoes: string[];
  certa: number;
  porque: string;
}
const trocado = (o: WireId[], i: number, j: number) => {
  const x = [...o];
  [x[i], x[j]] = [x[j], x[i]];
  return x;
};
const CASOS: Caso[] = [
  { id: "c1", titulo: "Sem luz em alguns pinos", sintoma: "O PC do caixa não pega rede. No testador, só alguns pinos acendem.", cabo: { cat: "cat5e", comprimentoM: 3, a: pontaPronta(NORMA_B), b: pontaPronta(NORMA_B, { crimpagem: "fraca" }) }, opcoes: ["Crimpagem fraca em uma das pontas", "Cabo com mais de 100 m", "Ordem T568A numa ponta e T568B na outra", "Roteador sem DHCP"], certa: 0, porque: "Pinos sem luz mostram fio sem contato. Na crimpagem fraca as garras do conector não perfuraram a isolação de todos os fios." },
  { id: "c2", titulo: "Luzes acendem, mas fora de ordem", sintoma: "Todas as luzes acendem, mas 1 acende junto com 2 e 2 com 1. Não há link.", cabo: { cat: "cat5e", comprimentoM: 2, a: pontaPronta(NORMA_B), b: pontaPronta(trocado(NORMA_B, 0, 1)) }, opcoes: ["Dois fios trocados de lugar numa ponta", "Capa fora do conector", "Cabo muito curto", "Switch desligado"], certa: 0, porque: "O testador mostra a ligação pino a pino. Pino 1 do lado A chegando no 2 do lado B é troca de fios. Refazer a ponta na ordem da norma." },
  { id: "c3", titulo: "O testador passa, mas a rede é lenta", sintoma: "O testador simples acende 1 a 8 em ordem, mas a rede perde pacotes e cai para 100 Mbps. Ordem das cores: branco-laranja, branco-verde, laranja, azul, branco-azul, verde, branco-marrom, marrom nas duas pontas.", cabo: { cat: "cat5e", comprimentoM: 5, a: pontaPronta(["WO", "WG", "O", "B", "WB", "G", "WBr", "Br"]), b: pontaPronta(["WO", "WG", "O", "B", "WB", "G", "WBr", "Br"]) }, opcoes: ["Crimpagem forte", "Par dividido (split pair)", "Cabo crossover", "Cabo longo demais"], certa: 1, porque: "As duas pontas estão iguais, então o testador passa. Mas laranja e branco-laranja (um par trançado) foram separados. Sem par trançado, o ruído volta. Só a certificação ou a norma revela." },
  { id: "c4", titulo: "Cabo crossover onde precisa direto", sintoma: "PC com placa de 100 Mbps sem auto-MDIX ligado a um switch sem auto-MDIX. Sem link. O testador mostra 1→3, 2→6, 3→1, 6→2.", cabo: { cat: "cat5e", comprimentoM: 3, a: pontaPronta(NORMA_A), b: pontaPronta(NORMA_B) }, opcoes: ["Um dos fios está aberto", "O cabo é direto e deveria ser crossover", "O cabo é crossover, e PC com switch pede direto", "O conector está sem crimpar"], certa: 2, porque: "PC (MDI) com switch (MDIX) já se cruzam internamente: o cabo deve ser direto. Este foi feito com T568A numa ponta e T568B na outra." },
  { id: "c5", titulo: "Capa fora do conector", sintoma: "O cabo passa no testador, mas dois pontos de rede da sala perdem link quando alguém puxa o cabo.", cabo: { cat: "cat5e", comprimentoM: 3, a: pontaPronta(NORMA_B, { insercao: "capa-fora", cortadoMm: 17 }), b: pontaPronta(NORMA_B) }, opcoes: ["Falta crimpar a trava de alívio: a capa ficou fora do conector", "Falta atualizar o driver da placa", "Cat5e não funciona em 1 Gbps", "Switch com porta 10G"], certa: 0, porque: "A crimpagem prende a capa na trava de alívio. Com a capa fora, a tração vai direto nos fios. O testador não vê isso." },
  { id: "c6", titulo: "Conexão em 100 Mbps com cabo novo", sintoma: "Cabo novo Cat6 entre PC e switch gigabit, mas o link negocia 100 Mbps. Testador: luzes 4, 5, 7 e 8 não estão em ordem (4↔5 trocados).", cabo: { cat: "cat6", comprimentoM: 4, a: pontaPronta(NORMA_B), b: pontaPronta(trocado(NORMA_B, 3, 4)) }, opcoes: ["Os pares 4-5 e 7-8 não estão corretos: só os pares 1-2 e 3-6 funcionam, por isso 100 Mbps", "O PC não aceita gigabit", "O roteador está sem DHCP", "O cabo é longo demais"], certa: 0, porque: "100 Mbps usa só dois pares (pinos 1, 2, 3, 6). Gigabit usa os quatro. Um par ruim derruba a velocidade, sem derrubar o link." },
  { id: "c7", titulo: "O cabo longo do depósito", sintoma: "Cabo de 120 m entre o switch do prédio e o depósito. Nada acende no PC.", cabo: { cat: "cat5e", comprimentoM: 120, a: pontaPronta(NORMA_B), b: pontaPronta(NORMA_B) }, opcoes: ["Ordem de cores errada", "Passou do limite de 100 m do canal Ethernet", "Falta crimpar", "Cabo Cat6 deveria ser Cat7"], certa: 1, porque: "O canal Ethernet por par trançado tem limite de 100 m. O testador de continuidade não avisa: o sinal degrada e o link não sobe. Solução: switch intermediário ou fibra." },
  { id: "c8", titulo: "Conector rachado", sintoma: "Depois de reformar a ponta, o conector apresenta rachadura na lateral e a luz do pino 8 falha às vezes.", cabo: { cat: "cat5e", comprimentoM: 3, a: pontaPronta(NORMA_B, { crimpagem: "forte" }), b: pontaPronta(NORMA_B) }, opcoes: ["Crimpagem forte demais", "A norma T568B é a errada", "Cat5e não aceita RJ45", "Falta de hub"], certa: 0, porque: "Força demais racha o plástico e pode deformar os contatos. Crimpar no ponto firme, uma vez, sem repetir." },
];

function Diagnostico() {
  const [i, setI] = React.useState(0);
  const [resp, setResp] = React.useState<number | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [feitos, setFeitos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const t0 = React.useRef(Date.now());
  const c = CASOS[i];
  const t = testar(c.cabo);
  const e = enlaceDoCabo(c.cabo);

  const responder = (k: number) => {
    if (resp !== null) return;
    setResp(k);
    const ok = k === c.certa;
    setFeitos((f) => f + 1);
    if (ok) setAcertos((a) => a + 1);
    xp(ok, ok ? 10 : 0, "diagnostico-cabos", t0.current);
  };
  const proximo = () => {
    if (i + 1 >= CASOS.length) return setFim(true);
    setI(i + 1);
    setResp(null);
    t0.current = Date.now();
  };
  const reiniciar = () => {
    setI(0);
    setResp(null);
    setAcertos(0);
    setFeitos(0);
    setFim(false);
    t0.current = Date.now();
  };
  if (fim)
    return (
      <Caixa className="text-center">
        <h3 className="text-xl font-extrabold">Diagnóstico concluído</h3>
        <p className="my-2 text-3xl font-black">{acertos} de {CASOS.length}</p>
        <Botao onClick={reiniciar}>Jogar de novo</Botao>
      </Caixa>
    );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-bold text-slate-500"><span>Caso {i + 1} de {CASOS.length}</span><span>Acertos: {acertos}/{feitos}</span></div>
      <Caixa>
        <h3 className="text-lg font-extrabold">{c.titulo}</h3>
        <p className="mt-1 text-sm">{c.sintoma}</p>
        <p className="mt-1 text-xs text-slate-500">{CATS[c.cabo.cat].nome} · {c.cabo.comprimentoM} m</p>
      </Caixa>
      <Caixa>
        <div className="mb-2 text-sm font-extrabold">Testador de cabos</div>
        <Leds leds={t.leds} animar key={c.id} />
        <div className="mt-2 text-xs text-slate-500">Saída A → B: {t.mapa.map((m, k) => `${k + 1}→${m === null ? "–" : m + 1}`).join("  ")}</div>
        {c.id === "c3" && <div className="mt-3 flex gap-1">{c.cabo.a.ordem.map((w, k) => <Fio key={k} id={w} rotulo={String(k + 1)} />)}</div>}
      </Caixa>
      <Caixa>
        <p className="mb-2 font-bold">Qual é a causa?</p>
        <div className="grid gap-2">
          {c.opcoes.map((o, k) => (
            <button key={k} type="button" disabled={resp !== null} onClick={() => responder(k)} className={cn("rounded-xl border p-3 text-left text-sm font-medium transition", resp === null && "hover:bg-slate-50 dark:hover:bg-slate-800", resp !== null && k === c.certa && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30", resp === k && k !== c.certa && "border-rose-500 bg-rose-50 dark:bg-rose-900/30", "border-slate-200 dark:border-slate-700")}>
              {resp !== null && k === c.certa && <Check className="mr-1 inline h-4 w-4 text-emerald-600" />}
              {resp === k && k !== c.certa && <X className="mr-1 inline h-4 w-4 text-rose-600" />}
              {o}
            </button>
          ))}
        </div>
        {resp !== null && (
          <div className="mt-3 space-y-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
            <p>{c.porque}</p>
            <p className="text-xs text-slate-500">Efeito na rede: {e.estado === "sem-link" ? "sem link" : `${e.mbps} Mbps${e.estado === "instavel" ? ", instável" : ""}`}.</p>
            <Botao onClick={proximo}>{i + 1 >= CASOS.length ? "Ver resultado" : "Próximo caso"}</Botao>
          </div>
        )}
      </Caixa>
    </div>
  );
}

/* ===================== MODO 3: REDE ===================== */
const larg = (d: Disp) => Math.max(90, d.portas.length * 22 + 16);
const ALT = 50;
const COR_DISP: Record<string, string> = { pc: "#0ea5e9", impressora: "#a855f7", servidor: "#f97316", camera: "#14b8a6", switch: "#22c55e", hub: "#eab308", roteador: "#6366f1", modem: "#64748b", patch: "#78716c", tomada: "#94a3b8" };
const ROTULO_TIPO: Record<string, string> = { pc: "PC", impressora: "IMP", servidor: "SRV", camera: "CAM", switch: "SW", hub: "HUB", roteador: "RT", modem: "MODEM", patch: "PATCH", tomada: "RJ45" };

function posPorta(d: Disp, p: Porta) {
  const n = d.portas.length;
  const i = d.portas.findIndex((x) => x.id === p.id);
  const passo = larg(d) / (n + 1);
  return { x: d.x + passo * (i + 1), y: d.y + ALT };
}

function Rede() {
  const [mi, setMi] = React.useState(0);
  const missao: Missao = MISSOES[mi];
  const [ligs, setLigs] = React.useState<Ligacao[]>(missao.ligacoes);
  const [origem, setOrigem] = React.useState<string | null>(null);
  const [dest, setDest] = React.useState<string | null>(null);
  const [selLig, setSelLig] = React.useState<string | null>(null);
  const [estoque, setEstoque] = React.useState<Cabo[]>([]);
  const [cat, setCat] = React.useState<Cat>("cat5e");
  const [comp, setComp] = React.useState(3);
  const [cruzado, setCruzado] = React.useState(false);
  const [aviso, setAviso] = React.useState("");
  const [hostTerm, setHostTerm] = React.useState<string>("");
  const [entrada, setEntrada] = React.useState("");
  const [linhas, setLinhas] = React.useState<string[]>(["Digite help para ver os comandos."]);
  const [concluida, setConcluida] = React.useState<Record<string, number>>({});
  const [estrelas, setEstrelas] = React.useState<number | null>(null);
  const t0 = React.useRef(Date.now());

  React.useEffect(() => {
    setEstoque(lerLS<Cabo[]>(ESTOQUE_KEY, []));
    setConcluida(lerLS<Record<string, number>>("op-cabos-missoes-v1", {}));
  }, []);

  const escolher = (i: number) => {
    setMi(i);
    setLigs(MISSOES[i].ligacoes);
    setOrigem(null);
    setDest(null);
    setSelLig(null);
    setEstrelas(null);
    setAviso("");
    setLinhas(["Digite help para ver os comandos."]);
    setHostTerm("");
    t0.current = Date.now();
  };

  const av = React.useMemo(() => avaliarRede(missao.disp, ligs, missao.escala), [missao, ligs]);
  const metas = missao.metas.map((m) => m.ok(av, missao.disp, ligs));
  const todasOk = metas.every(Boolean);
  const custo = av.custo;
  const dispDe = (pid: string) => missao.disp.find((d) => d.portas.some((p) => p.id === pid))!;
  const portaDe = (pid: string) => dispDe(pid).portas.find((p) => p.id === pid)!;
  const ocupada = (pid: string) => ligs.some((l) => l.a === pid || l.b === pid);
  const hosts = missao.disp.filter((d) => ["pc", "impressora", "servidor", "camera"].includes(d.tipo) && d.tipo === "pc");

  React.useEffect(() => {
    if (!hostTerm && hosts[0]) setHostTerm(hosts[0].id);
  }, [hosts, hostTerm]);

  const clicarPorta = (pid: string) => {
    setAviso("");
    setSelLig(null);
    if (origem === null) {
      if (ocupada(pid)) return setAviso("Essa porta já está ocupada. Remova o cabo primeiro.");
      return setOrigem(pid);
    }
    if (origem === pid) return setOrigem(null);
    if (ocupada(pid)) return setAviso("Essa porta já está ocupada. Remova o cabo primeiro.");
    if (dispDe(origem).id === dispDe(pid).id) return setAviso("Escolha portas de equipamentos diferentes.");
    setDest(pid);
    const d = distanciaM(dispDe(origem), dispDe(pid), missao.escala);
    const minimo = COMPRIMENTOS.find((c) => c >= d * 1.1) ?? 100;
    setComp(minimo);
    setCruzado(false);
  };

  const distAtual = origem && dest ? distanciaM(dispDe(origem), dispDe(dest), missao.escala) : 0;

  const ligar = (cabo: Cabo) => {
    if (!origem || !dest) return;
    if (cabo.comprimentoM < distAtual) {
      setAviso(`Cabo curto: a distância é de cerca de ${distAtual.toFixed(1)} m e o cabo tem ${cabo.comprimentoM} m.`);
      return;
    }
    const nova: Ligacao = { id: "l" + Date.now() + Math.floor(Math.random() * 99), a: origem, b: dest, cabo };
    setLigs((l) => [...l, nova]);
    setOrigem(null);
    setDest(null);
    setAviso("");
  };
  const comprar = () => {
    const a = cruzado ? NORMA_A : NORMA_B;
    ligar({ id: "loja-" + Date.now(), nome: cruzado ? "Crossover pronto" : "Cabo direto comprado", cat, comprimentoM: comp, a: pontaPronta(a), b: pontaPronta(NORMA_B), planejado: cruzado ? "crossover" : "direto", origem: "loja", fator: cruzado ? 2.5 : 1 });
  };
  const usarEstoque = (c: Cabo) => {
    ligar({ ...c, id: "e" + c.id + Date.now(), origem: "bancada" });
  };

  const remover = (id: string) => {
    setLigs((l) => l.filter((x) => x.id !== id));
    setSelLig(null);
  };

  const concluir = () => {
    const est = custo <= missao.orcamento ? (custo <= missao.orcamento * 0.7 ? 3 : 2) : 1;
    setEstrelas(est);
    const novo = { ...concluida, [missao.id]: Math.max(concluida[missao.id] ?? 0, est) };
    setConcluida(novo);
    gravarLS("op-cabos-missoes-v1", novo);
    xp(true, 20 + est * 10 + missao.nivel * 5, "rede-clinica", t0.current);
  };

  const rodar = () => {
    const h = hostTerm;
    if (!h) return;
    const cmd = entrada.trim();
    if (!cmd) return;
    if (cmd.toLowerCase() === "cls") {
      setLinhas([]);
    } else {
      const out = executarComando(cmd, h, missao.disp, av);
      const nome = missao.disp.find((d) => d.id === h)!.nome;
      setLinhas((l) => [...l, `${nome}> ${cmd}`, ...out, ""]);
    }
    setEntrada("");
  };

  const sel = selLig ? ligs.find((l) => l.id === selLig) : undefined;
  const selTeste = sel ? testar(sel.cabo) : null;
  const selInsp = sel ? inspecionar(sel.cabo) : null;
  const selEnl = sel ? enlaceDoCabo(sel.cabo) : null;

  const linkDe = (l: Ligacao) => {
    const k = av.links.find((x) => x.cabosIds.includes(l.id));
    return k;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MISSOES.map((m, i) => (
          <button key={m.id} type="button" onClick={() => escolher(i)} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold", i === mi ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 dark:border-slate-700")}>
            <span>{i + 1}. {m.titulo.split(":")[0].slice(0, 28)}</span><Estrelas n={concluida[m.id] ?? 0} />
          </button>
        ))}
      </div>

      <Caixa>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <h3 className="text-lg font-extrabold">Missão {mi + 1}: {missao.titulo}</h3>
            <p className="mt-1 text-sm">{missao.historia}</p>
            <p className="mt-1 text-xs text-slate-500"><strong>Pista:</strong> {missao.dica}</p>
            <div className="mt-2 flex flex-wrap gap-1">{missao.conceitos.map((c) => <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold dark:bg-slate-800">{c}</span>)}</div>
          </div>
          <div className="text-right text-sm"><div className="font-bold">Orçamento: R$ {missao.orcamento}</div><div className={cn("font-extrabold", custo > missao.orcamento ? "text-rose-600" : "text-emerald-600")}>Gasto: R$ {custo.toFixed(2)}</div></div>
        </div>
      </Caixa>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Caixa className="overflow-x-auto p-2">
          <svg viewBox="0 0 800 440" className="min-w-[640px] w-full" role="img" aria-label="Mapa da rede">
            {missao.disp.filter((d) => d.tipo === "patch" || d.tipo === "tomada").flatMap((d) => d.portas.filter((p) => p.fixo && d.portas.indexOf(p) >= 0 && (d.tipo === "patch")).map((p) => {
              const alvo = missao.disp.find((x) => x.portas.some((q) => q.id === p.fixo!.para));
              if (!alvo) return null;
              const a = posPorta(d, p);
              const b = posPorta(alvo, alvo.portas.find((q) => q.id === p.fixo!.para)!);
              return <g key={p.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeDasharray="6 5" strokeWidth={2} /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} fontSize={11} textAnchor="middle" fill="#64748b">cabeamento embutido {p.fixo!.comprimentoM} m</text></g>;
            }))}
            {ligs.map((l) => {
              const da = dispDe(l.a);
              const db = dispDe(l.b);
              const pa = posPorta(da, portaDe(l.a));
              const pb = posPorta(db, portaDe(l.b));
              const lk = linkDe(l);
              const cor = !lk ? "#94a3b8" : lk.estado === "sem-link" ? "#ef4444" : lk.estado === "instavel" ? "#f59e0b" : lk.mbps >= 10000 ? "#8b5cf6" : "#22c55e";
              const tempestade = av.tempestades.length > 0 && lk && ["switch", "hub", "roteador"].includes(da.tipo) && ["switch", "hub", "roteador"].includes(db.tipo);
              return (
                <g key={l.id} onClick={() => { setSelLig(l.id); setOrigem(null); setDest(null); }} className="cursor-pointer">
                  <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="transparent" strokeWidth={14} />
                  <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={cor} strokeWidth={selLig === l.id ? 6 : 3.5} strokeLinecap="round" className={tempestade ? "animate-pulse" : ""} />
                  <text x={(pa.x + pb.x) / 2} y={(pa.y + pb.y) / 2 - 5} fontSize={10} textAnchor="middle" fill="#475569" stroke="white" strokeWidth={3} paintOrder="stroke">{l.cabo.comprimentoM} m</text>
                </g>
              );
            })}
            {missao.disp.map((d) => {
              const h = av.hosts[d.id];
              const ruim = h && !h.online && ocupada(d.portas[0].id);
              return (
                <g key={d.id}>
                  <rect x={d.x} y={d.y} width={larg(d)} height={ALT} rx={10} fill={COR_DISP[d.tipo]} opacity={0.92} stroke={h ? (h.online ? "#16a34a" : ruim ? "#dc2626" : "transparent") : "transparent"} strokeWidth={3} />
                  <text x={d.x + larg(d) / 2} y={d.y + 20} textAnchor="middle" fontSize={13} fontWeight={800} fill="white">{ROTULO_TIPO[d.tipo]}</text>
                  <text x={d.x + larg(d) / 2} y={d.y + 37} textAnchor="middle" fontSize={9} fill="white">{d.nome.length > 22 ? d.nome.slice(0, 21) + "…" : d.nome}</text>
                  {h?.ip && <text x={d.x + larg(d) / 2} y={d.y - 5} textAnchor="middle" fontSize={10} fill={h.apipa ? "#dc2626" : "#334155"} fontWeight={700}>{h.ip}</text>}
                  {d.portas.map((p) => {
                    const pos = posPorta(d, p);
                    const ocup = ocupada(p.id);
                    const ativa = origem === p.id || dest === p.id;
                    return (
                      <g key={p.id} onClick={() => clicarPorta(p.id)} className="cursor-pointer">
                        <circle cx={pos.x} cy={pos.y} r={11} fill="transparent" />
                        <circle cx={pos.x} cy={pos.y} r={6} fill={ativa ? "#2563eb" : ocup ? "#0f172a" : "#e2e8f0"} stroke={ativa ? "#1d4ed8" : "#475569"} strokeWidth={1.5} />
                        <text x={pos.x} y={pos.y + 17} fontSize={8} textAnchor="middle" fill="#475569">{p.rot}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex flex-wrap gap-3 px-2 text-[11px] text-slate-500">
            <span><i className="mr-1 inline-block h-2 w-5 rounded bg-emerald-500" />link ok</span>
            <span><i className="mr-1 inline-block h-2 w-5 rounded bg-violet-500" />10 Gbps</span>
            <span><i className="mr-1 inline-block h-2 w-5 rounded bg-amber-500" />instável</span>
            <span><i className="mr-1 inline-block h-2 w-5 rounded bg-rose-500" />sem link</span>
            <span>Clique em duas portas para ligar. Clique em um cabo para testar.</span>
          </div>
        </Caixa>

        <div className="space-y-3">
          <Caixa>
            <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-500">Metas</h4>
            <ul className="space-y-1.5 text-sm">
              {missao.metas.map((m, i) => (
                <li key={i} className="flex gap-2">{metas[i] ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}<span className={metas[i] ? "font-semibold" : ""}>{m.texto}</span></li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Botao onClick={concluir} disabled={!todasOk || estrelas !== null}>Entregar a obra</Botao>
              <Botao tipo="sec" onClick={() => escolher(mi)}><RotateCcw className="mr-1 inline h-4 w-4" />Reiniciar</Botao>
            </div>
            {estrelas !== null && (
              <div className="mt-3 rounded-xl bg-emerald-100 p-3 text-sm text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-extrabold">Obra entregue! <Estrelas n={estrelas} /></div>
                {mi + 1 < MISSOES.length && <Botao className="mt-2" onClick={() => escolher(mi + 1)}>Próxima missão</Botao>}
              </div>
            )}
          </Caixa>

          {origem && dest && (
            <Caixa>
              <h4 className="text-sm font-extrabold">Escolher o cabo</h4>
              <p className="text-xs text-slate-500">{dispDe(origem).nome} ({portaDe(origem).rot}) ↔ {dispDe(dest).nome} ({portaDe(dest).rot}). Distância estimada: {distAtual.toFixed(1)} m.</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <label className="font-bold">Categoria
                  <select value={cat} onChange={(e) => setCat(e.target.value as Cat)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-1.5 dark:border-slate-600 dark:bg-slate-800">
                    {(Object.keys(CATS) as Cat[]).map((c) => <option key={c} value={c}>{CATS[c].nome}</option>)}
                  </select>
                </label>
                <label className="font-bold">Comprimento
                  <select value={comp} onChange={(e) => setComp(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-1.5 dark:border-slate-600 dark:bg-slate-800">
                    {COMPRIMENTOS.map((c) => <option key={c} value={c}>{c} m</option>)}
                  </select>
                </label>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{CATS[cat].nota}</p>
              <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={cruzado} onChange={(e) => setCruzado(e.target.checked)} />Crossover pronto (2,5× o preço)</label>
              <div className="mt-2 flex gap-2">
                <Botao onClick={comprar}>Comprar R$ {(precoCabo(cat, comp) * (cruzado ? 2.5 : 1)).toFixed(2)}</Botao>
                <Botao tipo="sec" onClick={() => { setOrigem(null); setDest(null); }}>Cancelar</Botao>
              </div>
              {estoque.length > 0 && (
                <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
                  <div className="text-xs font-extrabold">Do seu estoque (sem custo)</div>
                  <div className="mt-1 space-y-1">
                    {estoque.map((c) => {
                      const tt = testar(c);
                      return <button key={c.id} type="button" onClick={() => usarEstoque(c)} className="w-full rounded-lg border border-slate-200 p-1.5 text-left text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">{c.nome} · {CATS[c.cat].nome} · {c.comprimentoM} m · {tt.classe}</button>;
                    })}
                  </div>
                </div>
              )}
            </Caixa>
          )}
          {origem && !dest && <Caixa><p className="text-sm">Porta de origem escolhida: <strong>{dispDe(origem).nome} ({portaDe(origem).rot})</strong>. Clique na porta de destino.</p><Botao tipo="sec" className="mt-2" onClick={() => setOrigem(null)}>Cancelar</Botao></Caixa>}
          {aviso && <p role="alert" className="rounded-xl bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">{aviso}</p>}

          {sel && selTeste && selInsp && selEnl && (
            <Caixa>
              <div className="flex items-start justify-between"><h4 className="text-sm font-extrabold">{sel.cabo.nome}</h4><button type="button" onClick={() => remover(sel.id)} className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30" aria-label="Remover cabo"><Trash2 className="h-4 w-4" /></button></div>
              <p className="text-xs text-slate-500">{CATS[sel.cabo.cat].nome} · {sel.cabo.comprimentoM} m</p>
              <div className="mt-2"><Leds leds={selTeste.leds} /></div>
              <p className="mt-2 text-xs">{selTeste.descricao}</p>
              <p className="mt-1 text-xs font-bold">Resultado: {selEnl.estado === "sem-link" ? "sem link" : `${selEnl.mbps} Mbps${selEnl.estado === "instavel" ? ", instável" : ""}`}</p>
              {selInsp.problemas.length > 0 && <ul className="mt-1 list-disc pl-4 text-xs text-amber-700 dark:text-amber-300">{selInsp.problemas.map((p, i) => <li key={i}>{p}</li>)}</ul>}
              {selInsp.paresDivididos && <p className="mt-1 text-xs font-bold text-amber-700">Atenção: o testador não mostra par dividido. Compare as cores com a norma.</p>}
              <div className="mt-2 flex gap-1 text-[10px]">{sel.cabo.a.ordem.map((w, i) => <Fio key={i} id={w} />)}<span className="mx-1 self-center">→</span>{sel.cabo.b.ordem.map((w, i) => <Fio key={"b" + i} id={w} />)}</div>
            </Caixa>
          )}
        </div>
      </div>

      <Caixa>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-500"><TerminalSquare className="h-4 w-4" />Terminal do técnico</h4>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <label className="font-bold">Computador:
            <select value={hostTerm} onChange={(e) => setHostTerm(e.target.value)} className="ml-2 rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800">
              {missao.disp.filter((d) => ["pc", "servidor"].includes(d.tipo)).map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </label>
        </div>
        <div className="max-h-52 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-100" aria-live="polite">
          {linhas.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l || " "}</div>)}
        </div>
        <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); rodar(); }}>
          <input value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="ipconfig, ping 8.8.8.8, tracert google.com" className="flex-1 rounded-xl border border-slate-300 bg-white p-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-800" aria-label="Comando" />
          <Botao>Executar</Botao>
        </form>
      </Caixa>
    </div>
  );
}

/* ===================== Página ===================== */
export function OficinaDeCabos() {
  const [modo, setModo] = React.useState<Modo>("bancada");
  const [fs, setFs] = React.useState(false);
  return (
    <div className={cn(fs ? "fixed inset-0 z-50 overflow-auto bg-white p-4 dark:bg-slate-950" : "mx-auto max-w-7xl px-4 pb-8 pt-24")}>
      <Link href="/informatica-essencial-uc3" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline dark:text-blue-300"><ChevronLeft className="h-4 w-4" />Voltar para UC3</Link>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"><Cable className="h-3.5 w-3.5" />Informática Essencial · UC3 · Aula 3</span>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Oficina de Cabos</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Crimpe, teste, diagnostique e monte a rede de uma clínica. Tudo o que a aula ensina, em forma de jogo.</p>
        </div>
        <Botao tipo="sec" onClick={() => setFs((f) => !f)}>{fs ? <Minimize className="mr-1 inline h-4 w-4" /> : <Maximize className="mr-1 inline h-4 w-4" />}{fs ? "Sair da tela cheia" : "Tela cheia"}</Botao>
      </header>
      <nav className="mb-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Modos">
        {MODOS.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.id} type="button" onClick={() => setModo(m.id)} className={cn("flex items-center gap-3 rounded-2xl border p-3 text-left transition", modo === m.id ? "border-blue-500 bg-blue-50 shadow dark:bg-blue-900/30" : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800")}>
              <Icon className="h-6 w-6 text-blue-600" /><div><div className="font-extrabold">{m.titulo}</div><div className="text-xs text-slate-500">{m.sub}</div></div>
            </button>
          );
        })}
      </nav>
      {modo === "bancada" && <Bancada />}
      {modo === "diagnostico" && <Diagnostico />}
      {modo === "rede" && <Rede />}
      {modo === "tutoriais" && <Tutoriais />}
      {modo === "materiais" && <Materiais />}
      {modo === "apoio" && <Videos />}
      <p className="mt-6 text-xs text-slate-500">Simulação didática. Valores de preço e distância são fictícios. Normas: ANSI/TIA-568 (T568A e T568B), canal de até 100 m.</p>
    </div>
  );
}
