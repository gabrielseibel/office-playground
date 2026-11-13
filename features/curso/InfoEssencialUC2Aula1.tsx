"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  PlayCircle,
  Layers,
  Settings2,
  ClipboardCheck,
  SlidersHorizontal,
  ListOrdered,
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
  VIDEOS,
  CATEGORIAS,
  QUEM_E_QUEM,
  FUNCOES,
  SO_FUNCOES,
  SISTEMAS,
  EQUIPAMENTOS,
  VEREDITOS,
  FICHAS,
  REQUISITOS,
  ETAPAS,
  ORDEM_CERTA,
  MITOS,
} from "@/data/cursoInfoEssencialUC2Aula1";

type Aba = "videos" | "quem" | "so" | "pode" | "calc" | "ordem" | "mito";

const ABAS: { id: Aba; titulo: string; formato: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "videos", titulo: "Animações", formato: "Assistir e responder", icon: PlayCircle },
  { id: "quem", titulo: "Quem é quem", formato: "Sozinho", icon: Layers },
  { id: "so", titulo: "O que o sistema faz", formato: "Em dupla", icon: Settings2 },
  { id: "pode", titulo: "Pode ou não pode?", formato: "Em dupla", icon: ClipboardCheck },
  { id: "calc", titulo: "Monte a ficha", formato: "Sozinho", icon: SlidersHorizontal },
  { id: "ordem", titulo: "Ordem da instalação", formato: "Em dupla", icon: ListOrdered },
  { id: "mito", titulo: "Verdade ou mito", formato: "Turma toda", icon: HelpCircle },
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

/* Animações */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Animacoes() {
  const [i, setI] = React.useState(0);
  const v = VIDEOS[i];
  return (
    <div>
      <Instrucao>Assista, pause quando quiser e responda a pergunta embaixo com o colega antes de passar para a próxima animação. Use o botão de tela cheia do painel para projetar.</Instrucao>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-black shadow-soft-lg" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              key={v.arquivo}
              src={`${BASE}/animacoes/uc2-aula-1/${v.arquivo}`}
              title={v.titulo}
              className="h-full w-full"
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
            />
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
            <BotaoPri onClick={() => setI(Math.min(VIDEOS.length - 1, i + 1))} disabled={i === VIDEOS.length - 1}>
              próxima <ChevronRight className="h-4 w-4" />
            </BotaoPri>
          </div>
        </div>
        <ol className="space-y-2">
          {VIDEOS.map((x, k) => (
            <li key={x.arquivo}>
              <button
                onClick={() => setI(k)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition",
                  k === i ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
                )}
              >
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


const ITENS_QUEM: ItemQuiz[] = QUEM_E_QUEM.map((q) => ({ pergunta: q.texto, opcoes: CATEGORIAS, certa: q.certa, explicacao: q.explicacao }));
const ITENS_SO: ItemQuiz[] = [
  ...SO_FUNCOES.map((q) => ({
    pergunta: q.texto,
    opcoes: FUNCOES,
    certa: q.certa,
    explicacao: "O sistema operacional cuida de quatro trabalhos: processos, memória, dispositivos e arquivos. Aqui o trabalho é: " + q.certa.toLowerCase() + ".",
  })),
  ...EQUIPAMENTOS.map((q) => ({
    pergunta: <span>Qual sistema operacional é o mais provável em: {q.texto}?</span>,
    opcoes: SISTEMAS,
    certa: q.certa,
    explicacao: "O mais provável é " + q.certa + ".",
  })),
];
const ITENS_PODE: ItemQuiz[] = FICHAS.map((f) => ({
  pergunta: (
    <span>
      {f.nome}
      <span className="mt-3 block rounded-xl bg-[#0a0f18] p-3 font-mono text-xs font-normal leading-relaxed text-slate-200 sm:text-sm">
        <span className="block">Processador: {f.proc}</span>
        <span className="block">RAM: {f.ram}</span>
        <span className="block">Armazenamento: {f.disco}</span>
        <span className="block">Firmware: {f.fw}</span>
        <span className="block">TPM: {f.tpm}</span>
      </span>
    </span>
  ),
  opcoes: VEREDITOS,
  certa: f.certa,
  explicacao: f.explicacao,
}));
const ITENS_MITO: ItemQuiz[] = MITOS.map((v) => ({
  pergunta: v.texto,
  opcoes: [
    { id: "v", rotulo: "Verdade" },
    { id: "m", rotulo: "Mito" },
  ],
  certa: v.verdade ? "v" : "m",
  explicacao: v.explicacao,
}));

/* Monte a ficha: calculadora de requisitos */
const OPC_PROC = [
  { rotulo: "Intel Core de 4ª geração (ou mais antigo)", ok: false },
  { rotulo: "Intel Core de 7ª geração", ok: false },
  { rotulo: "Intel Core de 8ª geração ou mais novo", ok: true },
  { rotulo: "AMD Ryzen 1000 ou mais antigo", ok: false },
  { rotulo: "AMD Ryzen 2000 ou mais novo", ok: true },
  { rotulo: "Pentium Dual-Core antigo", ok: false },
];
const OPC_RAM = [2, 4, 8, 16];
const OPC_DISCO = [32, 64, 120, 240, 500];
const OPC_FW = [
  { rotulo: "BIOS antiga, sem UEFI", nivel: "duro" },
  { rotulo: "UEFI com Inicialização Segura desativada", nivel: "bios" },
  { rotulo: "UEFI com Inicialização Segura ativa", nivel: "ok" },
];
const OPC_TPM = [
  { rotulo: "Sem TPM", nivel: "duro" },
  { rotulo: "TPM 2.0 desativado na BIOS", nivel: "bios" },
  { rotulo: "TPM 2.0 ativo", nivel: "ok" },
];

function Seletor({ rotulo, valor, onChange, children }: { rotulo: string; valor: number; onChange: (v: number) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{rotulo}</span>
      <select
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-foreground/10 bg-white/70 px-3 py-2.5 text-sm dark:bg-white/5"
      >
        {children}
      </select>
    </label>
  );
}

function MonteFicha() {
  const [p, setP] = React.useState(0);
  const [r, setR] = React.useState(0);
  const [d, setD] = React.useState(0);
  const [f, setF] = React.useState(0);
  const [t, setT] = React.useState(0);
  const duros: string[] = [];
  const upgrades: string[] = [];
  const ajustes: string[] = [];
  if (!OPC_PROC[p].ok) duros.push("Processador fora da lista da Microsoft");
  if (OPC_RAM[r] < 4) upgrades.push("RAM abaixo de 4 GB");
  if (OPC_DISCO[d] < 64) upgrades.push("Armazenamento abaixo de 64 GB");
  if (OPC_FW[f].nivel === "duro") duros.push("Sem UEFI");
  if (OPC_FW[f].nivel === "bios") ajustes.push("Ativar a Inicialização Segura na BIOS");
  if (OPC_TPM[t].nivel === "duro") duros.push("Sem TPM");
  if (OPC_TPM[t].nivel === "bios") ajustes.push("Ativar o TPM 2.0 na BIOS");
  let veredito = "Pode";
  let cor = "border-emerald-500 bg-emerald-500/10";
  if (duros.length) {
    veredito = "Não pode";
    cor = "border-red-500 bg-red-500/10";
  } else if (upgrades.length) {
    veredito = "Pode com upgrade";
    cor = "border-amber-500 bg-amber-500/10";
  } else if (ajustes.length) {
    veredito = "Pode, ajustando a BIOS";
    cor = "border-sky-500 bg-sky-500/10";
  }
  const motivos = [...duros, ...upgrades, ...ajustes];
  return (
    <div>
      <Instrucao>Monte a ficha técnica de um computador e veja o veredito para o Windows 11. Teste combinações: o que acontece se só a RAM falhar? E se só o processador falhar?</Instrucao>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Seletor rotulo="Processador" valor={p} onChange={setP}>
          {OPC_PROC.map((o, i) => (
            <option key={o.rotulo} value={i}>
              {o.rotulo}
            </option>
          ))}
        </Seletor>
        <Seletor rotulo="Memória RAM" valor={r} onChange={setR}>
          {OPC_RAM.map((o, i) => (
            <option key={o} value={i}>
              {o} GB
            </option>
          ))}
        </Seletor>
        <Seletor rotulo="Armazenamento" valor={d} onChange={setD}>
          {OPC_DISCO.map((o, i) => (
            <option key={o} value={i}>
              {o} GB
            </option>
          ))}
        </Seletor>
        <Seletor rotulo="Firmware" valor={f} onChange={setF}>
          {OPC_FW.map((o, i) => (
            <option key={o.rotulo} value={i}>
              {o.rotulo}
            </option>
          ))}
        </Seletor>
        <Seletor rotulo="TPM" valor={t} onChange={setT}>
          {OPC_TPM.map((o, i) => (
            <option key={o.rotulo} value={i}>
              {o.rotulo}
            </option>
          ))}
        </Seletor>
      </div>
      <div className={cn("mt-6 rounded-2xl border-2 p-5", cor)}>
        <p className="text-2xl font-bold">{veredito}</p>
        {motivos.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            {motivos.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted-foreground">Todos os requisitos atendidos.</p>
        )}
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-blue-600/10">
            <tr>
              <th className="px-3 py-2">Requisito do Windows 11</th>
              <th className="px-3 py-2">O mínimo</th>
            </tr>
          </thead>
          <tbody>
            {REQUISITOS.map((q) => (
              <tr key={q[0]} className="border-t border-foreground/10">
                <td className="px-3 py-2 font-semibold">{q[0]}</td>
                <td className="px-3 py-2 text-muted-foreground">{q[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Ordem da instalação */
function OrdemInstalacao() {
  const [fila, setFila] = React.useState(() => ETAPAS.map((e) => e.id));
  React.useEffect(() => setFila(embaralhar(ETAPAS.map((e) => e.id))), []);
  const [feitas, setFeitas] = React.useState<string[]>([]);
  const [erros, setErros] = React.useState(0);
  const [aviso, setAviso] = React.useState<string | null>(null);
  const fim = feitas.length === ORDEM_CERTA.length;
  const texto = (id: string) => ETAPAS.find((e) => e.id === id)!.texto;

  function escolher(id: string) {
    if (id === ORDEM_CERTA[feitas.length]) {
      setFeitas([...feitas, id]);
      setAviso(null);
      recordAnswer({ app: "info", category: "uc2-ordem-instalacao", correct: true, timeMs: 0, points: 10 });
    } else {
      setErros((e) => e + 1);
      setAviso("Ainda não. Pense no que precisa estar pronto antes dessa etapa.");
      recordAnswer({ app: "info", category: "uc2-ordem-instalacao", correct: false, timeMs: 0, points: 0 });
    }
  }
  function reiniciar() {
    setFila(embaralhar(ETAPAS.map((e) => e.id)));
    setFeitas([]);
    setErros(0);
    setAviso(null);
  }
  return (
    <div>
      <Instrucao>Clique nas etapas na ordem em que acontecem em uma instalação do Windows. Se errar, o jogo avisa e você tenta de novo.</Instrucao>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Etapas</p>
          <div className="space-y-2">
            {fila.map((id) => {
              const feita = feitas.includes(id);
              return (
                <button
                  key={id}
                  disabled={feita || fim}
                  onClick={() => escolher(id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                    feita ? "border-foreground/10 opacity-40" : "border-foreground/10 bg-white/60 hover:border-blue-500 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
                  )}
                >
                  {texto(id)}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Sua sequência</p>
          <ol className="space-y-2">
            {feitas.map((id, i) => (
              <li key={id} className="flex items-start gap-3 rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-emerald-600 text-xs font-bold text-white">{i + 1}</span>
                {texto(id)}
              </li>
            ))}
          </ol>
          {aviso && <p className="mt-3 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm">{aviso}</p>}
          {fim && (
            <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="font-semibold">Sequência completa com {erros} {erros === 1 ? "erro" : "erros"}.</p>
              <p className="mt-1 text-sm text-muted-foreground">Conferir requisitos e licença vem primeiro, e o backup antes de qualquer mudança na máquina.</p>
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

export function InfoEssencialUC2Aula1() {
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
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 1. Hardware, sistema e requisitos</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Seis animações curtas e seis atividades para entender as camadas do computador, o que o sistema operacional faz, os requisitos do Windows 11 e como planejar uma instalação. Comece pelas animações.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ABAS.map((a, k) => {
            const Icon = a.icon;
            const ativa = a.id === aba;
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                  ativa ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "border-white/20 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                )}
              >
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
              <h2 className="text-xl font-bold md:text-2xl">
                {numero}. {atual.titulo}
              </h2>
              <BotaoSec onClick={alternarTelaCheia}>
                {telaCheia ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="hidden sm:inline">{telaCheia ? "sair da tela cheia" : "tela cheia"}</span>
              </BotaoSec>
            </div>
            {aba === "videos" && <Animacoes />}
            {aba === "quem" && <Quiz itens={ITENS_QUEM} categoria="uc2-quem-e-quem" instrucao="Cada item vai para uma gaveta: hardware, sistema operacional, aplicativo, firmware ou driver. Leia com calma e escolha." />}
            {aba === "so" && <Quiz itens={ITENS_SO} categoria="uc2-sistema-operacional" instrucao="Em dupla. Decidam juntos qual dos quatro trabalhos do sistema explica a situação, ou qual sistema roda no equipamento, e só cliquem quando os dois concordarem." />}
            {aba === "pode" && <Quiz itens={ITENS_PODE} categoria="uc2-pode-ou-nao" instrucao="Em dupla. Confira cada requisito da ficha: processador, RAM, armazenamento, firmware e TPM. Depois escolham o veredito." />}
            {aba === "calc" && <MonteFicha />}
            {aba === "ordem" && <OrdemInstalacao />}
            {aba === "mito" && <Quiz itens={ITENS_MITO} categoria="uc2-verdade-mito" instrucao="Com a turma toda no telão: o professor lê a frase e todos respondem com o polegar antes de clicar." />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
