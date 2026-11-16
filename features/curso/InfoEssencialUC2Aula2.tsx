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
  VIDEOS_A3,
  CHECK_FISCAL,
  GPT_MBR,
  MISSOES_BIOS,
} from "@/data/cursoInfoEssencialUC2Aula2";
import { SimInstalacao, SimParticoes } from "@/features/curso/simuladores/SimWindows";


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
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 2. Formatar e Instalar Windows</h1>
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
            {aba === "inst" && (
              <div>
                <Instrucao>
                  Em dupla: uma pessoa opera o notebook e a outra lê a ordem de serviço. Ligue o notebook e faça o serviço do começo ao fim, como na bancada. O simulador não avisa os erros na hora: ele age como um computador de verdade e, no fim, mostra o relatório do técnico.
                </Instrucao>
                <SimInstalacao />
              </div>
            )}
            {aba === "fmt" && (
              <div>
                <Instrucao>
                  Em dupla. Esta é a tela de partições do instalador do Windows 11, com as mesmas mensagens do computador. Em todas as missões o backup já está feito. Excluir e formatar apagam tudo, então confiram sempre a unidade antes de clicar.
                </Instrucao>
                <SimParticoes />
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
            )}
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
