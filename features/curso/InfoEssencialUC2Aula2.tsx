"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  MonitorPlay,
  PlayCircle,
  BookOpen,
  Printer,
  HardDrive,
  Usb,
  Stethoscope,
  Database,
  PieChart,
  ClipboardCheck,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  Trophy,
  Maximize,
  Minimize,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import {
  TELAS,
  J1,
  J2,
  FS_SITS,
  FS_TABELA,
  ETAPAS_PEN,
  ORDEM_PEN_CERTA,
  PEN_PERG,
  PARTS_AUTO,
  MITOS_A3,
  PASSOS_INSTALADOR,
  VIDEOS_A3,
  CHECK_FISCAL,
  GPT_MBR,
  MISSOES_BIOS,
} from "@/data/cursoInfoEssencialUC2Aula2";


function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function Painel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass-strong rounded-3xl border p-5 shadow-soft-lg md:p-8", className)}>{children}</div>;
}

function BotaoSec({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm font-medium transition hover:bg-white disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function BotaoPri({ children, onClick, disabled, className }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

function Instrucao({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-sm text-muted-foreground md:text-base">{children}</p>;
}

function Placar({ acertos, total, onReiniciar }: { acertos: number; total: number; onReiniciar: () => void }) {
  return (
    <div className="py-6 text-center">
      <Trophy className="mx-auto h-12 w-12 text-amber-500" />
      <p className="mt-3 text-2xl font-bold">
        {acertos} de {total}
      </p>
      <p className="mt-1 text-muted-foreground">
        {acertos === total ? "Tudo certo. Mandou bem." : acertos >= total / 2 ? "Bom resultado. Revise as que errou." : "Vale jogar de novo e ler as explicações."}
      </p>
      <div className="mt-5">
        <BotaoSec onClick={onReiniciar}>
          <RotateCcw className="h-4 w-4" /> jogar de novo
        </BotaoSec>
      </div>
    </div>
  );
}

/* Quiz genérico com sequência de acertos */
type ItemQuiz = { pergunta: React.ReactNode; opcoes: { id: string; rotulo: string; detalhe?: string }[]; certa: string; explicacao: string };

function Quiz({ itens, categoria, instrucao }: { itens: ItemQuiz[]; categoria: string; instrucao: React.ReactNode }) {
  const [ordem, setOrdem] = React.useState(itens.map((_, i) => i));
  React.useEffect(() => setOrdem(embaralhar(itens.map((_, i) => i))), [itens]);
  const [pos, setPos] = React.useState(0);
  const [escolha, setEscolha] = React.useState<string | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [sequencia, setSequencia] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const item = itens[ordem[pos]];

  function responder(id: string) {
    if (escolha) return;
    setEscolha(id);
    const ok = id === item.certa;
    setAcertos((a) => a + (ok ? 1 : 0));
    setSequencia((s) => (ok ? s + 1 : 0));
    recordAnswer({ app: "info", category: categoria, correct: ok, timeMs: 0, points: ok ? 10 : 0 });
  }
  function proxima() {
    if (pos + 1 >= itens.length) setFim(true);
    else {
      setPos(pos + 1);
      setEscolha(null);
    }
  }
  function reiniciar() {
    setOrdem(embaralhar(itens.map((_, i) => i)));
    setPos(0);
    setEscolha(null);
    setAcertos(0);
    setSequencia(0);
    setFim(false);
  }

  if (fim) return <Placar acertos={acertos} total={itens.length} onReiniciar={reiniciar} />;

  return (
    <div>
      <Instrucao>{instrucao}</Instrucao>
      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {pos + 1} de {itens.length}
        </span>
        <span className="flex items-center gap-3">
          {sequencia >= 2 && (
            <span className="inline-flex items-center gap-1 font-semibold text-orange-500">
              <Flame className="h-4 w-4" /> {sequencia} seguidas
            </span>
          )}
          <span>{acertos} acertos</span>
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={pos} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 text-lg font-semibold md:text-2xl dark:bg-white/5">{item.pergunta}</div>
          <div className={cn("mt-4 grid gap-3", item.opcoes.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : item.opcoes.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
            {item.opcoes.map((o) => {
              const certa = escolha && o.id === item.certa;
              const errada = escolha === o.id && o.id !== item.certa;
              return (
                <button
                  key={o.id}
                  onClick={() => responder(o.id)}
                  disabled={Boolean(escolha)}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left transition",
                    !escolha && "border-foreground/10 bg-white/60 hover:border-blue-500 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
                    certa && "border-emerald-500 bg-emerald-500/10",
                    errada && "border-red-500 bg-red-500/10",
                    escolha && !certa && !errada && "border-foreground/10 opacity-60"
                  )}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {certa && <Check className="h-4 w-4 text-emerald-600" />}
                    {errada && <X className="h-4 w-4 text-red-600" />}
                    {o.rotulo}
                  </span>
                  {o.detalhe && <span className="mt-1 block whitespace-pre-line font-mono text-xs text-muted-foreground">{o.detalhe}</span>}
                </button>
              );
            })}
          </div>
          {escolha && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="font-semibold">{escolha === item.certa ? "Certo." : "Não foi dessa vez."}</p>
              <p className="mt-1 text-muted-foreground">{item.explicacao}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex justify-end">
        <BotaoPri onClick={proxima} disabled={!escolha}>
          {pos + 1 >= itens.length ? "ver resultado" : "próxima"} <ChevronRight className="h-4 w-4" />
        </BotaoPri>
      </div>
    </div>
  );
}
/* ---------- Simulador de disco (formatação e partições) ---------- */
type Cenario = "A" | "B";
type Item = { id: string; kind: "part" | "livre"; nome: string; tam: number; fs?: string; dados: boolean; formatado: boolean };
type Disco = { id: 0 | 1; rotulo: string; itens: Item[] };

const fmtTam = (gb: number) => (gb < 1 ? `${Math.round(gb * 1000)} MB` : `${gb.toFixed(1).replace(".", ",")} GB`);

function discosIniciais(c: Cenario): Disco[] {
  const d0: Disco = {
    id: 0,
    rotulo: "Disco 0. SSD 238,5 GB (computador do cliente)",
    itens: [
      { id: "efi", kind: "part", nome: "Sistema", tam: 0.1, fs: "FAT32", dados: false, formatado: true },
      { id: "msr", kind: "part", nome: "Reservado", tam: 0.016, fs: "", dados: false, formatado: true },
      { id: "win", kind: "part", nome: "Windows antigo (C:)", tam: 120, fs: "NTFS", dados: true, formatado: false },
      { id: "dat", kind: "part", nome: c === "B" ? "Fotos e contratos do cliente (D:)" : "Dados antigos (D:)", tam: 117.78, fs: "NTFS", dados: true, formatado: false },
      { id: "rec", kind: "part", nome: "Recuperação", tam: 0.6, fs: "NTFS", dados: false, formatado: true },
    ],
  };
  if (c === "B") return [d0];
  const d1: Disco = {
    id: 1,
    rotulo: "Disco 1. HD externo 931,5 GB (backup do cliente)",
    itens: [{ id: "bk", kind: "part", nome: "Backup do cliente (E:)", tam: 931.5, fs: "NTFS", dados: true, formatado: false }],
  };
  return [d0, d1];
}

function juntarLivres(itens: Item[]): Item[] {
  const out: Item[] = [];
  for (const it of itens) {
    const ult = out[out.length - 1];
    if (it.kind === "livre" && ult && ult.kind === "livre") ult.tam += it.tam;
    else out.push({ ...it });
  }
  return out;
}

type Msg = { tipo: "erro" | "ok" | "info"; texto: string } | null;
type Resultado = { tipo: "ok" | "cancelou" | "perdeu"; texto: string } | null;

function DiscoSim({
  cenario,
  onFim,
  categoria,
}: {
  cenario: Cenario;
  onFim?: (r: { tipo: "ok" | "cancelou" | "perdeu"; erros: number }) => void;
  categoria: string;
}) {
  const [discos, setDiscos] = React.useState<Disco[]>(() => discosIniciais(cenario));
  const [sel, setSel] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<Msg>(null);
  const [erros, setErros] = React.useState(0);
  const [res, setRes] = React.useState<Resultado>(null);
  const [tamNovo, setTamNovo] = React.useState("100");

  React.useEffect(() => {
    setDiscos(discosIniciais(cenario));
    setSel(null);
    setMsg(null);
    setErros(0);
    setRes(null);
  }, [cenario]);

  const achar = (id: string | null): { d: Disco; it: Item } | null => {
    if (!id) return null;
    for (const d of discos) {
      const it = d.itens.find((i) => i.id === id);
      if (it) return { d, it };
    }
    return null;
  };
  const atual = achar(sel);

  function falhar(texto: string) {
    setErros((e) => e + 1);
    setMsg({ tipo: "erro", texto });
    recordAnswer({ app: "info", category: categoria, correct: false, timeMs: 0, points: 0 });
  }
  function acertar(texto: string) {
    setMsg({ tipo: "ok", texto });
    recordAnswer({ app: "info", category: categoria, correct: true, timeMs: 0, points: 10 });
  }
  function terminar(r: NonNullable<Resultado>) {
    setRes(r);
    onFim?.({ tipo: r.tipo, erros });
  }
  function reiniciar() {
    setDiscos(discosIniciais(cenario));
    setSel(null);
    setMsg(null);
    setErros(0);
    setRes(null);
  }

  function excluir() {
    if (!atual) return setMsg({ tipo: "info", texto: "Clique em uma partição da lista antes." });
    const { d, it } = atual;
    if (it.kind === "livre") return setMsg({ tipo: "info", texto: "Espaço não alocado não tem o que excluir." });
    if (d.id === 1) {
      setErros((e) => e + 1);
      return terminar({ tipo: "perdeu", texto: "Você excluiu a partição do backup. O backup do cliente foi apagado e não volta mais. Antes de excluir, confira em qual disco você está." });
    }
    if (cenario === "B" && it.dados) {
      setErros((e) => e + 1);
      return terminar({ tipo: "perdeu", texto: "Essa partição guardava arquivos do cliente e não existe backup. Excluir apaga tudo e não volta. O certo era cancelar a instalação e fazer o backup antes." });
    }
    setDiscos((ds) =>
      ds.map((x) => (x.id !== d.id ? x : { ...x, itens: juntarLivres(x.itens.map((i) => (i.id === it.id ? { ...i, kind: "livre" as const, nome: "Espaço não alocado", fs: undefined, dados: false, formatado: false } : i))) }))
    );
    setSel(null);
    acertar("Partição excluída. O espaço virou não alocado.");
  }

  function novo() {
    if (!atual || atual.it.kind !== "livre") return setMsg({ tipo: "info", texto: "Para criar uma partição, clique antes em Espaço não alocado." });
    const { d, it } = atual;
    if (d.id === 1) return falhar("Esse disco guarda o backup. Não mexa nele.");
    const t = parseFloat(tamNovo.replace(",", "."));
    if (!t || t <= 0) return setMsg({ tipo: "info", texto: "Digite o tamanho em GB." });
    if (t > it.tam + 0.001) return setMsg({ tipo: "erro", texto: `Só existem ${fmtTam(it.tam)} livres aqui.` });
    const novoItem: Item = { id: "n" + Date.now(), kind: "part", nome: "Nova partição", tam: t, fs: "NTFS", dados: false, formatado: false };
    const resto = it.tam - t;
    setDiscos((ds) =>
      ds.map((x) =>
        x.id !== d.id
          ? x
          : {
              ...x,
              itens: x.itens.flatMap((i) => (i.id !== it.id ? [i] : resto > 0.05 ? [novoItem, { ...it, tam: resto }] : [novoItem])),
            }
      )
    );
    setSel(novoItem.id);
    setMsg({ tipo: "ok", texto: `Partição de ${fmtTam(t)} criada.` });
  }

  function formatar() {
    if (!atual || atual.it.kind !== "part") return setMsg({ tipo: "info", texto: "Clique em uma partição para formatar." });
    const { d, it } = atual;
    if (d.id === 1) {
      setErros((e) => e + 1);
      return terminar({ tipo: "perdeu", texto: "Você formatou o disco do backup. Formatar apaga tudo. Antes de formatar, confira o disco." });
    }
    if (cenario === "B" && it.dados) {
      setErros((e) => e + 1);
      return terminar({ tipo: "perdeu", texto: "Formatar apaga tudo da partição e o cliente não tem backup. O certo era cancelar e fazer o backup primeiro." });
    }
    setDiscos((ds) => ds.map((x) => (x.id !== d.id ? x : { ...x, itens: x.itens.map((i) => (i.id === it.id ? { ...i, formatado: true, dados: false, fs: "NTFS" } : i)) })));
    acertar("Formatada em NTFS. A partição está limpa.");
  }

  function avancar() {
    if (!atual) return setMsg({ tipo: "info", texto: "Escolha onde instalar o Windows." });
    const { d, it } = atual;
    if (d.id === 1) return falhar("Esse é o disco do backup. O Windows vai no SSD do computador.");
    if (it.kind === "part" && it.tam < 64) return falhar(`Essa partição tem ${fmtTam(it.tam)}. O Windows 11 pede 64 GB ou mais.`);
    if (it.kind === "livre" && it.tam < 64) return falhar(`Só ${fmtTam(it.tam)} livres. O Windows 11 pede 64 GB ou mais.`);
    if (it.kind === "part" && it.dados && !it.formatado) return falhar("Essa partição ainda tem o Windows ou os arquivos antigos. Exclua ou formate antes, para a instalação ficar limpa.");
    terminar({ tipo: "ok", texto: it.kind === "livre" ? "O instalador cria as partições do sistema sozinho no espaço não alocado e instala o Windows." : "O Windows será instalado na partição limpa." });
  }

  function cancelar() {
    if (cenario === "B") terminar({ tipo: "cancelou", texto: "Boa decisão. Sem backup, nada de excluir. Cancele, volte ao Windows antigo, copie as fotos e contratos para o HD externo e só depois recomece." });
    else falhar("O backup já está no HD externo, então não precisa cancelar. Continue e escolha onde instalar.");
  }

  if (res) {
    const bom = res.tipo !== "perdeu";
    return (
      <div className={cn("rounded-2xl border p-5", bom ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10")}>
        <p className="flex items-center gap-2 text-lg font-bold">
          {bom ? <Check className="h-5 w-5 text-emerald-600" /> : <X className="h-5 w-5 text-red-600" />}
          {res.tipo === "ok" ? "Disco pronto" : res.tipo === "cancelou" ? "Cancelou na hora certa" : "Dados perdidos"}
        </p>
        <p className="mt-2 text-sm md:text-base">{res.texto}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {erros} {erros === 1 ? "erro" : "erros"} nesta tentativa.
        </p>
        <div className="mt-4">
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> tentar de novo
          </BotaoSec>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-soft-lg">
        <div className="border-b border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold">Instalação do Windows 11. Onde você deseja instalar o Windows?</div>
        <div className="space-y-4 p-4">
          {discos.map((d) => {
            const total = d.itens.reduce((s, i) => s + i.tam, 0);
            return (
              <div key={d.id}>
                <p className="mb-2 text-xs font-semibold text-slate-300">{d.rotulo}</p>
                <div className="mb-2 flex h-7 overflow-hidden rounded-md border border-slate-600">
                  {d.itens.map((i) => (
                    <div
                      key={i.id}
                      title={i.nome}
                      onClick={() => setSel(i.id)}
                      className={cn("cursor-pointer border-r border-slate-900 transition", i.kind === "livre" ? "bg-slate-600" : i.dados ? "bg-blue-500" : "bg-sky-300", sel === i.id && "ring-2 ring-inset ring-amber-300")}
                      style={{ width: `${Math.max((i.tam / total) * 100, 2.5)}%` }}
                    />
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-xs md:text-sm">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="py-1 pr-2 font-medium">Nome</th>
                        <th className="py-1 pr-2 font-medium">Tamanho</th>
                        <th className="py-1 pr-2 font-medium">Sistema de arquivos</th>
                        <th className="py-1 font-medium">Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.itens.map((i) => (
                        <tr key={i.id} onClick={() => setSel(i.id)} className={cn("cursor-pointer border-t border-slate-700 hover:bg-slate-800", sel === i.id && "bg-blue-700/60 hover:bg-blue-700/60")}>
                          <td className="py-1.5 pr-2">{i.nome}</td>
                          <td className="py-1.5 pr-2">{fmtTam(i.tam)}</td>
                          <td className="py-1.5 pr-2">{i.kind === "livre" ? "" : i.fs || "Sem sistema"}</td>
                          <td className="py-1.5">{i.kind === "livre" ? "Não alocado" : i.formatado ? "Limpa" : i.dados ? "Tem arquivos" : "Sistema"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 bg-slate-800 px-4 py-3">
          <button onClick={excluir} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">Excluir</button>
          <button onClick={formatar} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">Formatar</button>
          <span className="flex items-center gap-1">
            <input value={tamNovo} onChange={(e) => setTamNovo(e.target.value)} inputMode="decimal" aria-label="Tamanho em GB" className="w-16 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm" />
            <span className="text-xs text-slate-300">GB</span>
            <button onClick={novo} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">Novo</button>
          </span>
          <span className="ml-auto flex gap-2">
            <button onClick={cancelar} className="rounded-lg border border-slate-500 px-3 py-1.5 text-sm hover:bg-slate-700">Cancelar instalação</button>
            <button onClick={avancar} className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold hover:bg-blue-500">Avançar</button>
          </span>
        </div>
      </div>
      <div className="mt-3 min-h-[3rem]">
        {msg && (
          <p className={cn("rounded-xl border p-3 text-sm", msg.tipo === "erro" && "border-red-500 bg-red-500/10", msg.tipo === "ok" && "border-emerald-500 bg-emerald-500/10", msg.tipo === "info" && "border-blue-500/40 bg-blue-500/5")}>{msg.texto}</p>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Erros nesta tentativa: {erros}. Barra azul escura: partição com arquivos. Azul claro: partição de sistema ou limpa. Cinza: espaço não alocado.</p>
    </div>
  );
}

function SeletorCenario({ valor, onChange }: { valor: Cenario | null; onChange: (c: Cenario) => void }) {
  const opts: { id: Cenario; titulo: string; texto: string }[] = [
    { id: "A", titulo: "Cenário A. Backup feito", texto: "O cliente já copiou tudo para o HD externo (Disco 1). Faça a instalação limpa no SSD." },
    { id: "B", titulo: "Cenário B. Sem backup", texto: "Fotos e contratos estão só no SSD (D:). Ninguém fez cópia. Decida o que fazer." },
  ];
  return (
    <div className="mb-4 grid gap-2 sm:grid-cols-2">
      {opts.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={cn("rounded-2xl border px-4 py-3 text-left transition", valor === o.id ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10")}>
          <span className="block text-sm font-semibold">{o.titulo}</span>
          <span className={cn("block text-xs", valor === o.id ? "text-blue-100" : "text-muted-foreground")}>{o.texto}</span>
        </button>
      ))}
    </div>
  );
}

function SimuladorFormatacao() {
  const [cen, setCen] = React.useState<Cenario>("A");
  return (
    <div>
      <Instrucao>
        Em dupla. Leiam o cenário, combinem o plano e só então cliquem. Excluir e formatar apagam tudo, então confiram sempre o disco e se existe backup. O Windows 11 precisa de 64 GB ou mais.
      </Instrucao>
      <SeletorCenario valor={cen} onChange={setCen} />
      <DiscoSim cenario={cen} categoria="uc2a3-formatacao" />
      <details className="mt-5 rounded-2xl border border-foreground/10 bg-white/40 p-4 text-sm dark:bg-white/5">
        <summary className="cursor-pointer font-semibold">O que o instalador cria sozinho no espaço não alocado</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead className="text-muted-foreground">
              <tr><th className="py-1 pr-3 font-medium">Partição</th><th className="py-1 pr-3 font-medium">Tamanho</th><th className="py-1 pr-3 font-medium">Formato</th><th className="py-1 font-medium">Para quê</th></tr>
            </thead>
            <tbody>
              {PARTS_AUTO.map((p) => (
                <tr key={p.nome} className="border-t border-foreground/10"><td className="py-1.5 pr-3">{p.nome}</td><td className="py-1.5 pr-3">{p.tamanho}</td><td className="py-1.5 pr-3">{p.fs}</td><td className="py-1.5">{p.paraque}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/* ---------- Simulador de instalação do Windows 11 ---------- */
type Op = { r: string; ok?: boolean; dica?: string; boa?: string };
type PassoEscolha = { tipo: "escolha"; fase: number; titulo: string; texto?: string; estilo: "boot" | "win"; opcoes: Op[] };
type PassoEspecial = { tipo: "disco" | "copia"; fase: number };
type Passo = PassoEscolha | PassoEspecial;

const PASSOS: Passo[] = [
  {
    tipo: "escolha", fase: 0, estilo: "boot", titulo: "Menu de boot (F12)",
    texto: "Você ligou o notebook com o pendrive de instalação no USB e apertou F12. Qual dispositivo escolher?",
    opcoes: [
      { r: "UEFI: Pendrive USB (Windows 11)", ok: true, boa: "Certo. O computador vai iniciar pelo pendrive." },
      { r: "Windows Boot Manager (SSD)", dica: "Esse é o Windows antigo. O computador ligaria como sempre, sem abrir o instalador." },
      { r: "Rede PXE IPv4", dica: "Boot pela rede serve para empresas com servidor de instalação. Aqui o instalador está no pendrive." },
      { r: "Configuração da UEFI", dica: "Entrar na configuração ajuda a mudar a ordem de boot, mas o menu de boot já resolve direto." },
    ],
  },
  {
    tipo: "escolha", fase: 1, estilo: "win", titulo: "Idioma a instalar", texto: "Instalação do Windows 11. O cliente é de Xanxerê.",
    opcoes: [
      { r: "Português (Brasil)", ok: true },
      { r: "English (United States)", dica: "O sistema ficaria em inglês. O cliente fala português." },
      { r: "Español (España)", dica: "O cliente fala português do Brasil." },
    ],
  },
  {
    tipo: "escolha", fase: 1, estilo: "win", titulo: "Formato de hora e moeda", texto: "O cliente emite nota em reais.",
    opcoes: [
      { r: "Português (Brasil)", ok: true },
      { r: "Inglês (Estados Unidos)", dica: "Isso muda data, hora e moeda. O Real ficaria fora do padrão." },
    ],
  },
  {
    tipo: "escolha", fase: 1, estilo: "win", titulo: "Método de entrada de teclado", texto: "O teclado do notebook tem a tecla do ç.",
    opcoes: [
      { r: "Português (Brasil ABNT2)", ok: true },
      { r: "Inglês (Estados Unidos)", dica: "Com esse teclado as teclas ç, acentos e a barra ficam trocadas." },
      { r: "Português (Portugal)", dica: "O layout de Portugal é outro. O brasileiro é o ABNT2." },
    ],
  },
  {
    tipo: "escolha", fase: 2, estilo: "win", titulo: "Windows 11", texto: "A tela mostra um botão grande no meio e um link pequeno no canto.",
    opcoes: [
      { r: "Instalar agora", ok: true },
      { r: "Reparar o computador", dica: "Esse link abre ferramentas de recuperação. Aqui a ideia é instalar do zero." },
    ],
  },
  {
    tipo: "escolha", fase: 3, estilo: "win", titulo: "Ativar o Windows", texto: "O notebook já teve o Windows 11 Pro ativado antes e tem licença digital.",
    opcoes: [
      { r: "Não tenho a chave do produto", ok: true, boa: "Certo. Com internet, a licença digital costuma ativar sozinha depois." },
      { r: "Digitar uma chave que apareceu em um site", dica: "Chaves de sites desconhecidos são pirataria e podem não funcionar. Use a licença do cliente." },
    ],
  },
  {
    tipo: "escolha", fase: 4, estilo: "win", titulo: "Selecione o sistema operacional", texto: "A licença digital deste notebook é do Windows 11 Pro.",
    opcoes: [
      { r: "Windows 11 Pro", ok: true },
      { r: "Windows 11 Home", dica: "A licença é Pro. Instalar outra edição faz a ativação automática falhar." },
    ],
  },
  {
    tipo: "escolha", fase: 5, estilo: "win", titulo: "Termos de licença aplicáveis", texto: "Leia, marque a caixa e avance.",
    opcoes: [
      { r: "Marcar \"Aceito os termos de licença\" e avançar", ok: true },
      { r: "Fechar sem aceitar", dica: "Sem aceitar os termos o instalador não continua." },
    ],
  },
  {
    tipo: "escolha", fase: 6, estilo: "win", titulo: "Que tipo de instalação você deseja?", texto: "Objetivo: instalação limpa, sem restos do sistema antigo.",
    opcoes: [
      { r: "Personalizada: instalar apenas o Windows (avançado)", ok: true },
      { r: "Atualização: instalar o Windows e manter arquivos, configurações e aplicativos", dica: "Essa opção mantém o sistema antigo e seus problemas. Para formatar e começar do zero, use a Personalizada." },
    ],
  },
  { tipo: "disco", fase: 7 },
  { tipo: "copia", fase: 8 },
  {
    tipo: "escolha", fase: 9, estilo: "win", titulo: "Primeiro uso. Região", texto: "O computador já está no Windows novo. Qual é o seu país ou região?",
    opcoes: [
      { r: "Brasil", ok: true },
      { r: "Estados Unidos", dica: "A região define moeda, idioma e serviços da loja." },
    ],
  },
  {
    tipo: "escolha", fase: 9, estilo: "win", titulo: "Primeiro uso. Rede", texto: "O escritório do cliente tem Wi-Fi.",
    opcoes: [
      { r: "Conectar à rede Wi-Fi do cliente", ok: true, boa: "Certo. Com internet, a licença ativa sozinha e o Windows baixa as atualizações." },
      { r: "Pular a rede e ativar depois", dica: "Sem internet a licença digital não ativa sozinha e as atualizações não chegam. Conecte, se der." },
    ],
  },
  {
    tipo: "escolha", fase: 9, estilo: "win", titulo: "Primeiro uso. Quem vai usar o computador?", texto: "Defina o nome do usuário e a senha.",
    opcoes: [
      { r: "Usuário com o nome do cliente e senha forte", ok: true },
      { r: "Usuário \"admin\" com a senha 123", dica: "Senha fraca e usuário genérico deixam o computador do cliente vulnerável." },
    ],
  },
];

function InstaladorSim() {
  const [cen, setCen] = React.useState<Cenario | null>(null);
  const [i, setI] = React.useState(0);
  const [erros, setErros] = React.useState(0);
  const [dica, setDica] = React.useState<string | null>(null);
  const [boa, setBoa] = React.useState<string | null>(null);
  const [fim, setFim] = React.useState<null | "ok" | "cancelou">(null);
  const [prog, setProg] = React.useState(0);
  const passo = PASSOS[i] ?? PASSOS[PASSOS.length - 1];

  React.useEffect(() => {
    if (i >= PASSOS.length) setFim("ok");
  }, [i]);

  React.useEffect(() => {
    if (passo.tipo !== "copia" || i >= PASSOS.length || cen === null) return;
    setProg(0);
    const t = setInterval(() => setProg((p) => (p >= 100 ? 100 : p + 4)), 120);
    return () => clearInterval(t);
  }, [i, cen, passo.tipo]);

  function reiniciar() {
    setCen(null);
    setI(0);
    setErros(0);
    setDica(null);
    setBoa(null);
    setFim(null);
  }
  function proximo() {
    setDica(null);
    setBoa(null);
    setI((x) => x + 1);
  }
  function escolher(o: Op) {
    if (o.ok) {
      recordAnswer({ app: "info", category: "uc2a3-instalador", correct: true, timeMs: 0, points: 10 });
      setDica(null);
      if (o.boa) {
        setBoa(o.boa);
        setTimeout(proximo, 1400);
      } else proximo();
    } else {
      setErros((e) => e + 1);
      setDica(o.dica ?? "Essa não é a melhor escolha agora.");
      recordAnswer({ app: "info", category: "uc2a3-instalador", correct: false, timeMs: 0, points: 0 });
    }
  }

  if (cen === null)
    return (
      <div>
        <Instrucao>Em dupla. Uma pessoa conduz o mouse e a outra confere o roteiro. Escolham o cenário e façam a instalação do começo ao fim. Cada escolha errada mostra uma dica e conta como erro.</Instrucao>
        <SeletorCenario valor={null} onChange={(c) => setCen(c)} />
        <p className="text-sm text-muted-foreground">Clique em um cenário para começar.</p>
      </div>
    );

  if (fim) {
    const total = erros;
    return (
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
        <Trophy className="h-10 w-10 text-amber-500" />
        <p className="mt-2 text-xl font-bold">{fim === "ok" ? "Windows 11 instalado" : "Instalação cancelada na hora certa"}</p>
        <p className="mt-1 text-muted-foreground">
          {total} {total === 1 ? "erro" : "erros"} no total.{" "}
          {total === 0 ? "Sem nenhum erro. Pode instalar de verdade." : total <= 3 ? "Bom resultado. Revise as dicas que apareceram." : "Jogue de novo e leia as dicas com calma."}
        </p>
        <details className="mt-4 rounded-xl border border-foreground/10 bg-white/50 p-3 text-sm dark:bg-white/5">
          <summary className="cursor-pointer font-semibold">Colinha das telas do instalador</summary>
          <ul className="mt-2 space-y-1.5">
            {TELAS.map((t) => (
              <li key={t.tela}>
                <span className="font-semibold">{t.tela}.</span> {t.escolha} <span className="text-muted-foreground">({t.porque})</span>
              </li>
            ))}
          </ul>
        </details>
        <div className="mt-4">
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> instalar de novo
          </BotaoSec>
        </div>
      </div>
    );
  }

  const fase = passo.fase;
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PASSOS_INSTALADOR.map((n, k) => (
          <span key={n} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", k === fase ? "bg-blue-600 text-white" : k < fase ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-foreground/5 text-muted-foreground")}>
            {k + 1}. {n}
          </span>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{erros} {erros === 1 ? "erro" : "erros"}</span>
      </div>

      {passo.tipo === "disco" && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {cen === "A" ? "O backup está no HD externo. Deixe o SSD limpo e avance." : "Fotos e contratos do cliente estão no SSD e não existe backup. Pense antes de clicar."}
          </p>
          <DiscoSim
            key={cen}
            cenario={cen}
            categoria="uc2a3-instalador-disco"
            onFim={(r) => {
              setErros((e) => e + r.erros);
              if (r.tipo === "ok") proximo();
              else if (r.tipo === "cancelou") setFim("cancelou");
            }}
          />
        </div>
      )}

      {passo.tipo === "copia" && (
        <div className="overflow-hidden rounded-2xl border border-blue-900 bg-gradient-to-b from-blue-700 to-blue-900 p-6 text-white">
          {prog < 100 ? (
            <>
              <p className="text-lg font-semibold">Instalando o Windows 11</p>
              <p className="mt-1 text-sm text-blue-100">Copiando arquivos, instalando recursos e atualizações. O computador vai reiniciar sozinho.</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-white transition-all" style={{ width: `${prog}%` }} />
              </div>
              <p className="mt-2 text-sm">{prog}%</p>
            </>
          ) : (
            <>
              <p className="rounded-lg bg-black/60 p-3 font-mono text-sm">Press any key to boot from CD or DVD... (Pressione qualquer tecla para inicializar do CD ou DVD)</p>
              <p className="mt-4 text-sm text-blue-100">O computador reiniciou e mostra a mensagem acima por alguns segundos. O que você faz?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  { r: "Não toco em nada", ok: true, boa: "Certo. O computador segue a instalação pelo disco." },
                  { r: "Aperto uma tecla", dica: "Apertar reinicia o instalador pelo pendrive e a instalação recomeça." },
                  { r: "Tiro o pendrive e desligo da tomada", dica: "Desligar no meio da instalação pode corromper o sistema." },
                ].map((o) => (
                  <button key={o.r} onClick={() => escolher(o)} className="rounded-xl border border-white/30 bg-white/10 px-3 py-3 text-left text-sm font-medium hover:bg-white/20">
                    {o.r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {passo.tipo === "escolha" && (
        <div className={cn("overflow-hidden rounded-2xl border", passo.estilo === "boot" ? "border-slate-700 bg-black text-white" : "border-blue-900 bg-gradient-to-b from-blue-700 to-blue-900 text-white")}>
          <div className="p-5 md:p-7">
            <p className={cn("text-lg font-semibold md:text-xl", passo.estilo === "boot" && "font-mono")}>{passo.titulo}</p>
            {passo.texto && <p className="mt-1 text-sm text-blue-100/90">{passo.texto}</p>}
            <div className="mt-4 grid gap-2">
              {passo.opcoes.map((o) => (
                <button
                  key={o.r}
                  onClick={() => escolher(o)}
                  disabled={Boolean(boa)}
                  className={cn("rounded-xl border px-4 py-3 text-left text-sm font-medium transition", passo.estilo === "boot" ? "border-slate-600 font-mono hover:bg-slate-800" : "border-white/30 bg-white/10 hover:bg-white/20")}
                >
                  {o.r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 min-h-[3rem]">
        {dica && (
          <p className="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm">
            <span className="font-semibold">Erro.</span> {dica}
          </p>
        )}
        {boa && (
          <p className="rounded-xl border border-emerald-500 bg-emerald-500/10 p-3 text-sm">
            <span className="font-semibold">Certo.</span> {boa}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Pendrive bootável ---------- */
function PendriveOrdem() {
  const [fila, setFila] = React.useState(() => ETAPAS_PEN.map((e) => e.id));
  React.useEffect(() => setFila(embaralhar(ETAPAS_PEN.map((e) => e.id))), []);
  const [feitas, setFeitas] = React.useState<string[]>([]);
  const [erros, setErros] = React.useState(0);
  const [aviso, setAviso] = React.useState<string | null>(null);
  const fim = feitas.length === ORDEM_PEN_CERTA.length;
  const texto = (id: string) => ETAPAS_PEN.find((e) => e.id === id)!.texto;
  function escolher(id: string) {
    if (id === ORDEM_PEN_CERTA[feitas.length]) {
      setFeitas([...feitas, id]);
      setAviso(null);
      recordAnswer({ app: "info", category: "uc2a3-pendrive", correct: true, timeMs: 0, points: 10 });
    } else {
      setErros((e) => e + 1);
      setAviso("Ainda não. Pense no que precisa existir antes dessa etapa.");
      recordAnswer({ app: "info", category: "uc2a3-pendrive", correct: false, timeMs: 0, points: 0 });
    }
  }
  function reiniciar() {
    setFila(embaralhar(ETAPAS_PEN.map((e) => e.id)));
    setFeitas([]);
    setErros(0);
    setAviso(null);
  }
  return (
    <div>
      <Instrucao>Em dupla. Clique nas etapas na ordem certa para criar o pendrive de instalação do Windows 11. Se errar, o jogo avisa.</Instrucao>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Etapas</p>
          <div className="space-y-2">
            {fila.map((id) => {
              const feita = feitas.includes(id);
              return (
                <button key={id} disabled={feita || fim} onClick={() => escolher(id)} className={cn("w-full rounded-xl border px-4 py-3 text-left text-sm transition", feita ? "border-foreground/10 opacity-40" : "border-foreground/10 bg-white/60 hover:border-blue-500 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10")}>
                  {texto(id)}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Sua sequência</p>
          <ol className="space-y-2">
            {feitas.map((id, k) => (
              <li key={id} className="flex items-start gap-3 rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-emerald-600 text-xs font-bold text-white">{k + 1}</span>
                {texto(id)}
              </li>
            ))}
          </ol>
          {aviso && <p className="mt-3 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm">{aviso}</p>}
          {fim && (
            <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="font-semibold">Pendrive pronto com {erros} {erros === 1 ? "erro" : "erros"}.</p>
              <p className="mt-1 text-sm text-muted-foreground">Responda com sua dupla. Clique para ver a resposta.</p>
              <div className="mt-3 space-y-2">
                {PEN_PERG.map((p) => (
                  <details key={p.pergunta} className="rounded-xl border border-foreground/10 bg-white/50 p-3 text-sm dark:bg-white/5">
                    <summary className="cursor-pointer font-semibold">{p.pergunta}</summary>
                    <p className="mt-2 text-muted-foreground">{p.resposta}</p>
                  </details>
                ))}
              </div>
              <div className="mt-3">
                <BotaoSec onClick={reiniciar}>
                  <RotateCcw className="h-4 w-4" /> jogar de novo
                </BotaoSec>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Planeje o disco ---------- */
function PlanejeDisco() {
  const TOTAL = 256;
  const [c, setC] = React.useState(120);
  const d = TOTAL - c;
  let veredito: { tipo: "erro" | "ok" | "info"; texto: string };
  if (c < 64) veredito = { tipo: "erro", texto: "O Windows 11 não instala com menos de 64 GB." };
  else if (c < 100) veredito = { tipo: "info", texto: "Instala, mas o C: fica apertado. Com atualizações e programas, enche rápido." };
  else if (d < 30) veredito = { tipo: "info", texto: "O C: está folgado, mas sobra pouco para o D:. Os arquivos do cliente podem não caber." };
  else veredito = { tipo: "ok", texto: "Boa divisão. O C: comporta Windows e programas, e o D: guarda os arquivos do cliente." };
  return (
    <div>
      <Instrucao>Em dupla. O SSD tem 256 GB. O cliente quer um C: para o Windows e os programas e um D: para os arquivos. Decidam juntos e movam o controle.</Instrucao>
      <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <div className="flex h-12 overflow-hidden rounded-xl border border-foreground/20 text-sm font-semibold text-white">
          <div className="grid place-items-center bg-blue-600 transition-all" style={{ width: `${(c / TOTAL) * 100}%` }}>C: {c} GB</div>
          <div className="grid place-items-center bg-emerald-600 transition-all" style={{ width: `${(d / TOTAL) * 100}%` }}>{d > 12 ? `D: ${d} GB` : ""}</div>
        </div>
        <input type="range" min={20} max={240} value={c} onChange={(e) => setC(parseInt(e.target.value, 10))} aria-label="Tamanho do C:" className="mt-4 w-full" />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>20 GB</span><span>240 GB</span></div>
        <p className={cn("mt-4 rounded-xl border p-3 text-sm", veredito.tipo === "erro" && "border-red-500 bg-red-500/10", veredito.tipo === "ok" && "border-emerald-500 bg-emerald-500/10", veredito.tipo === "info" && "border-amber-500 bg-amber-500/10")}>{veredito.texto}</p>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Dica para a dupla: justifiquem a escolha em uma frase usando os números de C: e D:.</p>
    </div>
  );
}


/* ---------- Animações ---------- */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Animacoes() {
  const [i, setI] = React.useState(0);
  const v = VIDEOS_A3[i];
  return (
    <div>
      <Instrucao>Assista, pause quando quiser e responda a pergunta embaixo com o colega antes de passar para a próxima animação. Use o botão de tela cheia do painel para projetar.</Instrucao>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-black shadow-soft-lg" style={{ aspectRatio: "16 / 9" }}>
            <iframe key={v.arquivo} src={`${BASE}/animacoes/uc2-aula-2/${v.arquivo}`} title={v.titulo} className="h-full w-full" allow="fullscreen" allowFullScreen loading="lazy" />
          </div>
          <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/50 p-4 dark:bg-white/5">
            <p className="text-lg font-bold">{v.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{v.resumo}</p>
            <p className="mt-3 rounded-xl bg-blue-600/10 p-3 text-sm font-semibold text-blue-800 dark:text-blue-200">Para conversar: {v.pergunta}</p>
          </div>
          <div className="mt-4 flex justify-between">
            <BotaoSec onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
              <ChevronLeft className="h-4 w-4" /> anterior
            </BotaoSec>
            <BotaoPri onClick={() => setI(Math.min(VIDEOS_A3.length - 1, i + 1))} disabled={i === VIDEOS_A3.length - 1}>
              próxima <ChevronRight className="h-4 w-4" />
            </BotaoPri>
          </div>
        </div>
        <ol className="space-y-2">
          {VIDEOS_A3.map((x, k) => (
            <li key={x.arquivo}>
              <button onClick={() => setI(k)} className={cn("flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition", k === i ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10")}>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold", k === i ? "bg-white/20" : "bg-blue-600/10 text-blue-700 dark:text-blue-300")}>{k + 1}</span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug">{x.titulo}</span>
                  <span className={cn("text-xs", k === i ? "text-blue-100" : "text-muted-foreground")}>{x.duracao}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------- Materiais de apoio ---------- */
function Apoio() {
  const [marcados, setMarcados] = React.useState<number[]>([]);
  const alternar = (k: number) => setMarcados((m) => (m.includes(k) ? m.filter((x) => x !== k) : [...m, k]));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Instrucao>Consulte durante os simuladores e na bancada. Cada bloco resume o que a turma viu na aula.</Instrucao>
        <BotaoSec onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> imprimir
        </BotaoSec>
      </div>

      <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <h3 className="text-lg font-bold">Checklist do técnico</h3>
        <p className="mb-3 text-sm text-muted-foreground">Marque cada item antes de seguir. {marcados.length} de {CHECK_FISCAL.length} conferidos.</p>
        <ul className="space-y-2">
          {CHECK_FISCAL.map((c, k) => (
            <li key={c}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-foreground/10 bg-white/60 px-3 py-2 text-sm dark:bg-white/5">
                <input type="checkbox" checked={marcados.includes(k)} onChange={() => alternar(k)} className="mt-0.5 h-4 w-4" />
                <span className={cn(marcados.includes(k) && "text-muted-foreground line-through")}>{c.replace(/^A pessoa /, "Você ")}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <h3 className="text-lg font-bold">Colinha das telas do instalador</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-1 pr-3 font-medium">Tela</th><th className="py-1 pr-3 font-medium">O que escolher</th><th className="py-1 font-medium">Por quê</th></tr>
            </thead>
            <tbody>
              {TELAS.map((t) => (
                <tr key={t.tela} className="border-t border-foreground/10 align-top"><td className="py-2 pr-3 font-semibold">{t.tela}</td><td className="py-2 pr-3">{t.escolha}</td><td className="py-2 text-muted-foreground">{t.porque}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
          <h3 className="text-lg font-bold">GPT ou MBR</h3>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="text-muted-foreground"><tr><th className="py-1 pr-3 font-medium"></th><th className="py-1 pr-3 font-medium">GPT</th><th className="py-1 font-medium">MBR</th></tr></thead>
            <tbody>
              {GPT_MBR.map((r) => (
                <tr key={r[0]} className="border-t border-foreground/10"><td className="py-2 pr-3 font-semibold">{r[0]}</td><td className="py-2 pr-3">{r[1]}</td><td className="py-2">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
          <h3 className="text-lg font-bold">Sistemas de arquivos</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {FS_TABELA.map((f) => (
              <li key={f.sistema}><span className="font-semibold">{f.sistema}.</span> {f.onde}. <span className="text-muted-foreground">{f.carac}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <h3 className="text-lg font-bold">Missões na BIOS de treino</h3>
        <p className="mb-3 text-sm text-muted-foreground">Abra o simulador geekprank.com/bios em dupla e cumpra as missões.</p>
        <ul className="space-y-2 text-sm">
          {MISSOES_BIOS.map((m) => (
            <li key={m.missao}><span className="font-semibold">{m.missao}.</span> {m.texto}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-white/50 p-5 text-sm dark:bg-white/5">
        <h3 className="text-lg font-bold">Onde baixar o Windows</h3>
        <p className="mt-2">Somente no site oficial da Microsoft:{" "}
          <a href="https://www.microsoft.com/software-download/windows11" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline dark:text-blue-300">microsoft.com/software-download/windows11</a>.
        </p>
        <p className="mt-1 text-muted-foreground">Cópias de outros sites podem trazer vírus e ferem a licença.</p>
      </section>
    </div>
  );
}

/* ---------- Quizzes ---------- */
const LETRAS = ["a", "b", "c", "d"];
const ITENS_J1: ItemQuiz[] = J1.map((j) => ({
  pergunta: (
    <span>
      <span className="block text-sm font-medium text-blue-600 dark:text-blue-300">Tela: {j.tela}</span>
      {j.situacao}
    </span>
  ),
  opcoes: j.opcoes.map((o, k) => ({ id: LETRAS[k], rotulo: o })),
  certa: LETRAS[j.certa],
  explicacao: j.porque,
}));
const ITENS_J2: ItemQuiz[] = J2.map((j) => ({
  pergunta: <span><span className="block text-sm font-medium text-blue-600 dark:text-blue-300">O que está acontecendo?</span>{j.sintoma}</span>,
  opcoes: j.opcoes.map((o, k) => ({ id: LETRAS[k], rotulo: o })),
  certa: LETRAS[j.certa],
  explicacao: j.explicacao,
}));
const FS_OPCOES = ["NTFS", "FAT32", "exFAT", "ext4"].map((s) => ({ id: s, rotulo: s }));
const ITENS_FS: ItemQuiz[] = FS_SITS.map((s) => ({ pergunta: s.texto, opcoes: FS_OPCOES, certa: s.certa, explicacao: s.porque }));
const ITENS_MITO: ItemQuiz[] = MITOS_A3.map((m) => ({
  pergunta: m.texto,
  opcoes: [{ id: "v", rotulo: "Verdade" }, { id: "m", rotulo: "Mito" }],
  certa: m.verdade ? "v" : "m",
  explicacao: m.explicacao,
}));

type Aba = "videos" | "inst" | "fmt" | "pen" | "j1" | "j2" | "fs" | "plano" | "mito" | "apoio";
const ABAS: { id: Aba; titulo: string; formato: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "videos", titulo: "Animações", formato: "Assistir e responder", icon: PlayCircle },
  { id: "inst", titulo: "Simulador de instalação", formato: "Em dupla", icon: MonitorPlay },
  { id: "fmt", titulo: "Simulador de formatação", formato: "Em dupla", icon: HardDrive },
  { id: "pen", titulo: "Pendrive bootável", formato: "Em dupla", icon: Usb },
  { id: "j1", titulo: "Instalador sem erro", formato: "Sozinho", icon: ClipboardCheck },
  { id: "j2", titulo: "Diagnóstico de boot", formato: "Em dupla", icon: Stethoscope },
  { id: "fs", titulo: "Que sistema de arquivos?", formato: "Sozinho", icon: Database },
  { id: "plano", titulo: "Planeje o disco", formato: "Em dupla", icon: PieChart },
  { id: "mito", titulo: "Verdade ou mito", formato: "Turma toda", icon: HelpCircle },
  { id: "apoio", titulo: "Materiais de apoio", formato: "Consulta e impressão", icon: BookOpen },
];

export function InfoEssencialUC2Aula2() {
  const [aba, setAba] = React.useState<Aba>("videos");
  const [telaCheia, setTelaCheia] = React.useState(false);
  const painelRef = React.useRef<HTMLDivElement>(null);
  const atual = ABAS.find((a) => a.id === aba)!;
  const numero = ABAS.findIndex((a) => a.id === aba) + 1;

  React.useEffect(() => {
    const onChange = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function alternarTelaCheia() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await painelRef.current?.requestFullscreen();
    } catch {
      /* navegador sem suporte: segue na janela normal */
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden pb-20 pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-background to-blue-50/40 dark:from-slate-950/40 dark:via-background dark:to-blue-950/10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/informatica-essencial-uc2" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <Cpu className="h-3.5 w-3.5" /> Curso Informática Essencial. UC2
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 2. Sábado de instalação</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Cinco animações, dois simuladores, seis atividades e materiais de apoio para criar o pendrive de instalação, cuidar do disco e das partições, passar pelas telas do instalador do Windows 11 e diagnosticar problemas de boot. Comece pelas animações.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ABAS.map((a, k) => {
            const Icon = a.icon;
            const ativa = a.id === aba;
            return (
              <button key={a.id} onClick={() => setAba(a.id)} className={cn("flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition", ativa ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10")}>
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold", ativa ? "bg-white/20" : "bg-blue-600/10 text-blue-700 dark:text-blue-300")}>{k + 1}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{a.titulo}</span>
                  </span>
                  <span className={cn("block text-xs", ativa ? "text-blue-100" : "text-muted-foreground")}>{a.formato}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div ref={painelRef} className={cn("mt-6", telaCheia && "overflow-y-auto bg-background p-6 md:p-10")}>
          <Painel className={cn(telaCheia && "min-h-full")}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold md:text-2xl">{numero}. {atual.titulo}</h2>
              <BotaoSec onClick={alternarTelaCheia}>
                {telaCheia ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="hidden sm:inline">{telaCheia ? "sair da tela cheia" : "tela cheia"}</span>
              </BotaoSec>
            </div>
            {aba === "videos" && <Animacoes />}
            {aba === "inst" && <InstaladorSim />}
            {aba === "fmt" && <SimuladorFormatacao />}
            {aba === "pen" && <PendriveOrdem />}
            {aba === "j1" && <Quiz itens={ITENS_J1} categoria="uc2a3-telas" instrucao="Cada rodada mostra uma tela do instalador e uma situação. Escolha a opção certa sem chutar." />}
            {aba === "j2" && <Quiz itens={ITENS_J2} categoria="uc2a3-boot" instrucao="Em dupla. O computador não inicia pelo pendrive ou não instala. Discutam a causa mais provável antes de clicar." />}
            {aba === "fs" && (
              <div>
                <details className="mb-4 rounded-2xl border border-foreground/10 bg-white/40 p-4 text-sm dark:bg-white/5">
                  <summary className="cursor-pointer font-semibold">Ver a tabela de sistemas de arquivos</summary>
                  <ul className="mt-2 space-y-1">
                    {FS_TABELA.map((f) => (
                      <li key={f.sistema}><span className="font-semibold">{f.sistema}.</span> {f.onde}. {f.carac}</li>
                    ))}
                  </ul>
                </details>
                <Quiz itens={ITENS_FS} categoria="uc2a3-sistema-arquivos" instrucao="Para cada situação, escolha o sistema de arquivos mais adequado. Tente sem abrir a tabela." />
              </div>
            )}
            {aba === "plano" && <PlanejeDisco />}
            {aba === "apoio" && <Apoio />}
            {aba === "mito" && <Quiz itens={ITENS_MITO} categoria="uc2a3-verdade-mito" instrucao="Com a turma toda no telão: o professor lê a frase e todos respondem com o polegar antes de clicar." />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
