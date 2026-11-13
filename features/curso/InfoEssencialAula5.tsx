"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Scale,
  Gavel,
  ShieldAlert,
  ListOrdered,
  HardDrive,
  Headphones,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  Trophy,
  Maximize,
  Minimize,
  Users,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import {
  LICENCAS,
  PROGRAMAS,
  SITUACOES,
  INSTALADOR,
  CAMINHO_DESINSTALAR,
  COMPATIBILIDADE,
  CHAMADOS,
  VERDADE_OU_MITO_SOFTWARE,
  type Licenca,
  type Veredito,
} from "@/data/cursoInfoEssencialAula5";

type Aba = "licenca" | "pode" | "instalador" | "caminho" | "compat" | "chamados" | "vm";

const ABAS: {
  id: Aba;
  numero: number;
  titulo: string;
  formato: string;
  dupla: boolean;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "licenca", numero: 1, titulo: "Livre, grátis ou pago?", formato: "Sozinho", dupla: false, icon: Scale },
  { id: "pode", numero: 2, titulo: "Pode ou não pode?", formato: "Em dupla", dupla: true, icon: Gavel },
  { id: "instalador", numero: 3, titulo: "Instalador armadilha", formato: "Sozinho", dupla: false, icon: ShieldAlert },
  { id: "caminho", numero: 4, titulo: "Monte o caminho", formato: "Sozinho", dupla: false, icon: ListOrdered },
  { id: "compat", numero: 5, titulo: "Instala neste computador?", formato: "Sozinho", dupla: false, icon: HardDrive },
  { id: "chamados", numero: 6, titulo: "Chamados do Balanço Certo", formato: "Em dupla", dupla: true, icon: Headphones },
  { id: "vm", numero: 7, titulo: "Verdade ou mito", formato: "Sozinho ou turma toda", dupla: false, icon: HelpCircle },
];

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function Painel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass-strong rounded-3xl border p-5 shadow-soft-lg md:p-8", className)}>
      {children}
    </div>
  );
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

/* Quiz genérico: uma pergunta por vez, opções em botões, explicação depois */
type ItemQuiz = { pergunta: React.ReactNode; opcoes: { id: string; rotulo: string; detalhe?: string }[]; certa: string; explicacao: string };

function Quiz({ itens, categoria, instrucao }: { itens: ItemQuiz[]; categoria: string; instrucao: React.ReactNode }) {
  const [ordem, setOrdem] = React.useState(itens.map((_, i) => i));
  React.useEffect(() => setOrdem(embaralhar(itens.map((_, i) => i))), [itens]);
  const [pos, setPos] = React.useState(0);
  const [escolha, setEscolha] = React.useState<string | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const item = itens[ordem[pos]];

  function responder(id: string) {
    if (escolha) return;
    setEscolha(id);
    const ok = id === item.certa;
    if (ok) setAcertos((a) => a + 1);
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
        <span>{acertos} acertos</span>
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
                  {o.detalhe && <span className="mt-1 block text-xs text-muted-foreground">{o.detalhe}</span>}
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

/* 1. Livre, grátis ou pago? */
const ITENS_LICENCA: ItemQuiz[] = PROGRAMAS.map((p) => ({
  pergunta: (
    <span>
      {p.nome}
      <span className="mt-1 block text-base font-normal text-muted-foreground">{p.uso}</span>
    </span>
  ),
  opcoes: LICENCAS.map((l) => ({ id: l.id, rotulo: l.nome, detalhe: l.resumo })),
  certa: p.licenca as Licenca,
  explicacao: p.explicacao,
}));

/* 2. Pode ou não pode? */
const OPCOES_VEREDITO: { id: Veredito; rotulo: string }[] = [
  { id: "pode", rotulo: "Pode" },
  { id: "nao", rotulo: "Não pode" },
  { id: "depende", rotulo: "Depende" },
];
const ITENS_PODE: ItemQuiz[] = SITUACOES.map((s) => ({ pergunta: s.texto, opcoes: OPCOES_VEREDITO, certa: s.resposta, explicacao: s.explicacao }));

/* 5. Instala neste computador? */
const ITENS_COMPAT: ItemQuiz[] = COMPATIBILIDADE.map((c) => ({
  pergunta: (
    <span className="grid gap-3 text-base md:grid-cols-2 md:text-lg">
      <span className="rounded-xl bg-blue-600/10 p-3">
        <span className="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">O computador</span>
        {c.computador}
      </span>
      <span className="rounded-xl bg-orange-500/10 p-3">
        <span className="block text-xs font-bold uppercase tracking-wide text-orange-700 dark:text-orange-300">O programa</span>
        {c.programa}
      </span>
    </span>
  ),
  opcoes: [
    { id: "sim", rotulo: "Instala e funciona" },
    { id: "nao", rotulo: "Não instala" },
  ],
  certa: c.instala ? "sim" : "nao",
  explicacao: c.explicacao,
}));

/* 7. Verdade ou mito */
const ITENS_VM: ItemQuiz[] = VERDADE_OU_MITO_SOFTWARE.map((v) => ({
  pergunta: v.frase,
  opcoes: [
    { id: "v", rotulo: "Verdade" },
    { id: "m", rotulo: "Mito" },
  ],
  certa: v.verdade ? "v" : "m",
  explicacao: v.explicacao,
}));

/* 3. Instalador armadilha */
function InstaladorArmadilha() {
  const [passo, setPasso] = React.useState(0);
  const [aceitou, setAceitou] = React.useState(false);
  const [modo, setModo] = React.useState<"completa" | "personalizada" | null>(null);
  const [caixas, setCaixas] = React.useState<Record<string, boolean>>(() => {
    const ini: Record<string, boolean> = {};
    INSTALADOR.forEach((p) => {
      if (p.tipo === "caixas") p.caixas.forEach((c) => (ini[c.id] = c.marcada));
    });
    return ini;
  });
  const [instalado, setInstalado] = React.useState(false);
  const atual = INSTALADOR[passo];
  const todasCaixas = INSTALADOR.flatMap((p) => (p.tipo === "caixas" ? p.caixas : []));

  // Na instalação completa o usuário nem vê as caixas: tudo vai junto.
  const passosVisiveis = INSTALADOR.map((p, i) => ({ p, i })).filter(({ p }) => !(p.tipo === "caixas" && modo === "completa"));
  const idxVisivel = passosVisiveis.findIndex((v) => v.i === passo);

  function avancar() {
    const prox = passosVisiveis[idxVisivel + 1];
    if (prox) setPasso(prox.i);
  }
  function voltar() {
    const ant = passosVisiveis[idxVisivel - 1];
    if (ant) setPasso(ant.i);
  }
  const lixoInstalado = todasCaixas.filter((c) => c.lixo && (modo === "completa" || caixas[c.id]));

  function instalar() {
    setInstalado(true);
    recordAnswer({ app: "info", category: "instalador", correct: lixoInstalado.length === 0, timeMs: 0, points: lixoInstalado.length === 0 ? 40 : 10 });
  }
  function reiniciar() {
    setPasso(0);
    setAceitou(false);
    setModo(null);
    const ini: Record<string, boolean> = {};
    todasCaixas.forEach((c) => (ini[c.id] = c.marcada));
    setCaixas(ini);
    setInstalado(false);
  }

  if (instalado) {
    return (
      <div className="py-4">
        {lixoInstalado.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Instalação limpa.</p>
            <p className="mt-1">Só o leitor de PDF foi instalado. Você leu cada tela e desmarcou o que vinha de carona.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
            <p className="text-xl font-bold text-red-700 dark:text-red-300">O computador ganhou {lixoInstalado.length} programa(s) que ninguém pediu:</p>
            <ul className="mt-2 list-disc pl-5">
              {lixoInstalado.map((c) => (
                <li key={c.id}>{c.rotulo.replace(/^Instalar (também )?/, "")}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              {modo === "completa"
                ? "Na instalação completa as caixas nem aparecem: tudo vai junto. Escolha a personalizada."
                : "As caixas já vinham marcadas. O técnico desmarca tudo o que o cliente não pediu."}
            </p>
          </div>
        )}
        <div className="mt-5">
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> instalar de novo
          </BotaoSec>
        </div>
      </div>
    );
  }

  const podeAvancar = atual.tipo === "termos" ? aceitou : atual.tipo === "modo" ? modo !== null : true;

  return (
    <div>
      <Instrucao>
        Você vai instalar um leitor de PDF no computador da recepção. Leia cada tela com atenção, como faria no computador de
        verdade. No fim, veja o que acabou instalado.
      </Instrucao>
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-slate-400/60 bg-white text-slate-900 shadow-xl dark:bg-slate-100">
        <div className="flex items-center justify-between bg-slate-700 px-3 py-2 text-xs text-white">
          <span>Instalação do Leitor PDF Plus</span>
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-500" />
            <span className="h-3 w-3 rounded-sm bg-slate-500" />
            <span className="h-3 w-3 rounded-sm bg-red-500" />
          </span>
        </div>
        <div className="min-h-[260px] p-5">
          <p className="text-lg font-bold">{atual.titulo}</p>
          <p className="mt-2 text-sm text-slate-600">{atual.texto}</p>

          {atual.tipo === "termos" && (
            <div className="mt-4">
              <div className="h-24 overflow-y-auto rounded border border-slate-300 bg-slate-50 p-2 text-xs text-slate-600">
                CONTRATO DE LICENÇA DO USUÁRIO FINAL. Ao instalar, você concorda em usar o programa conforme estes termos. O programa é
                fornecido sem garantia. É permitido o uso pessoal e comercial. Não é permitido vender, alugar ou modificar o programa.
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={aceitou} onChange={(e) => setAceitou(e.target.checked)} />
                Li e aceito os termos do contrato
              </label>
            </div>
          )}

          {atual.tipo === "modo" && (
            <div className="mt-4 space-y-2">
              {(["completa", "personalizada"] as const).map((m) => (
                <label key={m} className={cn("flex cursor-pointer items-start gap-2 rounded border p-3 text-sm", modo === m ? "border-blue-600 bg-blue-50" : "border-slate-300")}>
                  <input type="radio" name="modo" checked={modo === m} onChange={() => setModo(m)} className="mt-0.5" />
                  <span>
                    <span className="font-semibold">{m === "completa" ? "Completa (recomendada)" : "Personalizada"}</span>
                    <span className="block text-xs text-slate-500">
                      {m === "completa" ? "Instala tudo com as opções padrão." : "Você escolhe os componentes e o local."}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {atual.tipo === "caixas" && (
            <div className="mt-4 space-y-2">
              {atual.caixas.map((c) => (
                <label key={c.id} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={caixas[c.id]}
                    disabled={c.id === "leitor"}
                    onChange={(e) => setCaixas((s) => ({ ...s, [c.id]: e.target.checked }))}
                    className="mt-0.5"
                  />
                  {c.rotulo}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <button onClick={voltar} disabled={idxVisivel <= 0} className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm disabled:opacity-40">
            Voltar
          </button>
          {atual.tipo === "fim" ? (
            <button onClick={instalar} className="rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
              Instalar
            </button>
          ) : (
            <button onClick={avancar} disabled={!podeAvancar} className="rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40">
              Avançar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* 4. Monte o caminho */
function MonteOCaminho() {
  const [ordem, setOrdem] = React.useState(CAMINHO_DESINSTALAR.map((_, i) => i));
  React.useEffect(() => setOrdem(embaralhar(CAMINHO_DESINSTALAR.map((_, i) => i))), []);
  const [escolhidos, setEscolhidos] = React.useState<number[]>([]);
  const [conferido, setConferido] = React.useState(false);
  const soltos = ordem.filter((i) => !escolhidos.includes(i));
  const acertos = escolhidos.filter((v, pos) => v === pos).length;

  function conferir() {
    setConferido(true);
    recordAnswer({ app: "info", category: "desinstalar", correct: acertos === CAMINHO_DESINSTALAR.length, timeMs: 0, points: acertos * 5 });
  }
  function reiniciar() {
    setOrdem(embaralhar(CAMINHO_DESINSTALAR.map((_, i) => i)));
    setEscolhidos([]);
    setConferido(false);
  }

  return (
    <div>
      <Instrucao>
        O Balanço Certo desistiu do Firefox. Clique nos passos na ordem certa para desinstalar o programa do jeito certo no
        Windows 11. Clicou errado? Toque no passo da lista numerada para devolver.
      </Instrucao>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Passos embaralhados</p>
          <div className="space-y-2">
            {soltos.map((i) => (
              <button
                key={i}
                onClick={() => !conferido && setEscolhidos((e) => [...e, i])}
                className="w-full rounded-xl border border-foreground/10 bg-white/60 px-4 py-3 text-left text-sm transition hover:border-blue-500 dark:bg-white/5"
              >
                {CAMINHO_DESINSTALAR[i]}
              </button>
            ))}
            {soltos.length === 0 && <p className="text-sm text-muted-foreground">Todos os passos foram usados.</p>}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Seu caminho</p>
          <ol className="space-y-2">
            {escolhidos.map((v, pos) => (
              <li key={v}>
                <button
                  onClick={() => !conferido && setEscolhidos((e) => e.filter((x) => x !== v))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm",
                    !conferido && "border-blue-500/40 bg-blue-500/5",
                    conferido && v === pos && "border-emerald-500 bg-emerald-500/10",
                    conferido && v !== pos && "border-red-500 bg-red-500/10"
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">{pos + 1}</span>
                  {CAMINHO_DESINSTALAR[v]}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!conferido ? (
          <BotaoPri onClick={conferir} disabled={soltos.length > 0}>
            conferir
          </BotaoPri>
        ) : (
          <>
            <span className="font-semibold">
              {acertos} de {CAMINHO_DESINSTALAR.length} na posição certa.
            </span>
            <BotaoSec onClick={reiniciar}>
              <RotateCcw className="h-4 w-4" /> de novo
            </BotaoSec>
          </>
        )}
      </div>
      {conferido && (
        <p className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
          Caminho certo: {CAMINHO_DESINSTALAR.map((p, i) => `${i + 1}. ${p}`).join("  ")}. Apagar a pasta do programa não é desinstalar:
          sobram atalhos, registros e serviços.
        </p>
      )}
    </div>
  );
}

/* 6. Chamados do Balanço Certo */
function Chamados() {
  const [pos, setPos] = React.useState(0);
  const [causa, setCausa] = React.useState<number | null>(null);
  const [solucao, setSolucao] = React.useState<number | null>(null);
  const [pontos, setPontos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const ch = CHAMADOS[pos];

  function escolherSolucao(i: number) {
    if (solucao !== null) return;
    setSolucao(i);
    const p = (causa === ch.causaCerta ? 1 : 0) + (i === ch.solucaoCerta ? 1 : 0);
    setPontos((x) => x + p);
    recordAnswer({ app: "info", category: "chamados", correct: p === 2, timeMs: 0, points: p * 10 });
  }
  function proximo() {
    if (pos + 1 >= CHAMADOS.length) setFim(true);
    else {
      setPos(pos + 1);
      setCausa(null);
      setSolucao(null);
    }
  }
  function reiniciar() {
    setPos(0);
    setCausa(null);
    setSolucao(null);
    setPontos(0);
    setFim(false);
  }
  if (fim) return <Placar acertos={pontos} total={CHAMADOS.length * 2} onReiniciar={reiniciar} />;

  const opcao = (texto: string, i: number, escolhida: number | null, certa: number, onClick: () => void, travado: boolean) => (
    <button
      key={i}
      onClick={onClick}
      disabled={travado}
      className={cn(
        "rounded-xl border px-4 py-3 text-left text-sm transition",
        escolhida === null && !travado && "border-foreground/10 bg-white/60 hover:border-blue-500 dark:bg-white/5",
        escolhida !== null && i === certa && "border-emerald-500 bg-emerald-500/10",
        escolhida === i && i !== certa && "border-red-500 bg-red-500/10",
        escolhida !== null && i !== certa && escolhida !== i && "opacity-60",
        travado && escolhida === null && "opacity-50"
      )}
    >
      {texto}
    </button>
  );

  return (
    <div>
      <Instrucao>
        Em dupla, no mesmo computador. Leiam o chamado, conversem e só cliquem quando os dois concordarem: primeiro a causa,
        depois o que o técnico faz. Cada chamado vale 2 pontos.
      </Instrucao>
      <div className="mb-3 flex justify-between text-sm text-muted-foreground">
        <span>
          Chamado {pos + 1} de {CHAMADOS.length}
        </span>
        <span>{pontos} pontos</span>
      </div>
      <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{ch.quem}</p>
        <p className="mt-1 text-lg md:text-xl">{ch.relato}</p>
      </div>
      <p className="mt-5 text-sm font-semibold">Qual é a causa?</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {ch.causas.map((t, i) => opcao(t, i, causa, ch.causaCerta, () => causa === null && setCausa(i), causa !== null))}
      </div>
      <p className="mt-5 text-sm font-semibold">O que o técnico faz?</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {ch.solucoes.map((t, i) => opcao(t, i, solucao, ch.solucaoCerta, () => causa !== null && escolherSolucao(i), causa === null || solucao !== null))}
      </div>
      <div className="mt-5 flex justify-end">
        <BotaoPri onClick={proximo} disabled={solucao === null}>
          {pos + 1 >= CHAMADOS.length ? "ver resultado" : "próximo chamado"} <ChevronRight className="h-4 w-4" />
        </BotaoPri>
      </div>
    </div>
  );
}

/* Página */
export function InfoEssencialAula5() {
  const [aba, setAba] = React.useState<Aba>("licenca");
  const [telaCheia, setTelaCheia] = React.useState(false);
  const painelRef = React.useRef<HTMLDivElement>(null);
  const atual = ABAS.find((a) => a.id === aba)!;

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
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 5. Instalar e desinstalar softwares</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Sete atividades para treinar licenças, instalação segura, compatibilidade e desinstalação. As marcadas em dupla são
              feitas com o colega no mesmo computador.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ABAS.map((a) => {
            const Icon = a.icon;
            const ativa = a.id === aba;
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                  ativa
                    ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                )}
              >
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold", ativa ? "bg-white/20" : "bg-blue-600/10 text-blue-700 dark:text-blue-300")}>
                  {a.numero}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{a.titulo}</span>
                  </span>
                  <span className={cn("flex items-center gap-1 text-xs", ativa ? "text-blue-100" : "text-muted-foreground")}>
                    {a.dupla ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {a.formato}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div ref={painelRef} className={cn("mt-6", telaCheia && "overflow-y-auto bg-background p-6 md:p-10")}>
          <Painel className={cn(telaCheia && "min-h-full")}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold md:text-2xl">
                {atual.numero}. {atual.titulo}
              </h2>
              <BotaoSec onClick={alternarTelaCheia}>
                {telaCheia ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="hidden sm:inline">{telaCheia ? "sair da tela cheia" : "tela cheia"}</span>
              </BotaoSec>
            </div>
            {aba === "licenca" && (
              <Quiz
                itens={ITENS_LICENCA}
                categoria="licencas"
                instrucao="Para cada programa, escolha o tipo de licença. Depois de responder, leia a explicação antes de passar para o próximo."
              />
            )}
            {aba === "pode" && (
              <Quiz
                itens={ITENS_PODE}
                categoria="legislacao"
                instrucao="Em dupla. Leiam a situação do escritório e conversem antes de clicar. Só cliquem quando os dois concordarem."
              />
            )}
            {aba === "instalador" && <InstaladorArmadilha />}
            {aba === "caminho" && <MonteOCaminho />}
            {aba === "compat" && (
              <Quiz
                itens={ITENS_COMPAT}
                categoria="compatibilidade"
                instrucao="Compare o computador com o que o programa pede. Ele instala e funciona nesse computador?"
              />
            )}
            {aba === "chamados" && <Chamados />}
            {aba === "vm" && (
              <Quiz
                itens={ITENS_VM}
                categoria="verdade-mito-software"
                instrucao="Sozinho, ou com a turma toda no telão: o professor lê a frase e todos respondem com o polegar antes de clicar."
              />
            )}
          </Painel>
        </div>
      </div>
    </div>
  );
}
