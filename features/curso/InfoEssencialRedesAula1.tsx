"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Network,
  PlayCircle,
  Radar,
  Layers,
  Search,
  Gauge,
  TerminalSquare,
  Brain,
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
  TIPOS_REDE,
  CAMADAS,
  DETETIVE,
  DESAFIOS_DOWNLOAD,
  TERMINAL,
  PARES_MEMORIA,
  VERDADE_OU_MITO,
} from "@/data/cursoInfoEssencialRedesAula1";

type Aba = "videos" | "tipos" | "camadas" | "detetive" | "download" | "terminal" | "memoria" | "vm";

const ABAS: { id: Aba; titulo: string; formato: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "videos", titulo: "Animações", formato: "Assistir e responder", icon: PlayCircle },
  { id: "tipos", titulo: "Que rede é essa?", formato: "Sozinho", icon: Radar },
  { id: "camadas", titulo: "Monte as camadas", formato: "Sozinho", icon: Layers },
  { id: "detetive", titulo: "Detetive de IP", formato: "Em dupla", icon: Search },
  { id: "download", titulo: "Quanto demora o download?", formato: "Sozinho", icon: Gauge },
  { id: "terminal", titulo: "Terminal do técnico", formato: "Em dupla", icon: TerminalSquare },
  { id: "memoria", titulo: "Memória das siglas", formato: "Sozinho ou dupla", icon: Brain },
  { id: "vm", titulo: "Verdade ou mito", formato: "Turma toda", icon: HelpCircle },
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

const ITENS_TIPOS: ItemQuiz[] = TIPOS_REDE.map((t) => ({
  pergunta: t.texto,
  opcoes: [
    { id: "PAN", rotulo: "PAN", detalhe: "pessoal" },
    { id: "LAN", rotulo: "LAN", detalhe: "local" },
    { id: "MAN", rotulo: "MAN", detalhe: "metropolitana" },
    { id: "WAN", rotulo: "WAN", detalhe: "longa distância" },
  ],
  certa: t.resposta,
  explicacao: t.explicacao,
}));

const ITENS_DETETIVE: ItemQuiz[] = DETETIVE.map((r) => ({
  pergunta: (
    <span>
      {r.enunciado}
      <span className="mt-2 block text-sm font-normal text-muted-foreground">Rede da clínica: 192.168.10.0, máscara 255.255.255.0, gateway 192.168.10.1.</span>
    </span>
  ),
  opcoes: r.maquinas.map((m, i) => ({ id: String(i), rotulo: m.nome, detalhe: `IP: ${m.ip}\nMáscara: ${m.mascara}\nGateway: ${m.gateway}` })),
  certa: String(r.culpada),
  explicacao: r.explicacao,
}));

const ITENS_VM: ItemQuiz[] = VERDADE_OU_MITO.map((v) => ({
  pergunta: v.texto,
  opcoes: [
    { id: "v", rotulo: "Verdade" },
    { id: "m", rotulo: "Mito" },
  ],
  certa: v.verdade ? "v" : "m",
  explicacao: v.explicacao,
}));

/* Animações */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Animacoes() {
  const [i, setI] = React.useState(0);
  const v = VIDEOS[i];
  return (
    <div>
      <Instrucao>Assista, pause quando quiser e responda a pergunta embaixo com o colega antes de passar para a próxima animação.</Instrucao>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-black shadow-soft-lg" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              key={v.arquivo}
              src={`${BASE}/animacoes/redes-aula-1/${v.arquivo}`}
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

/* Monte as camadas: clique nas cartas na ordem em que a mensagem desce */
function MonteCamadas() {
  const [baralho, setBaralho] = React.useState(() => CAMADAS.map((c) => c.id));
  React.useEffect(() => setBaralho(embaralhar(CAMADAS.map((c) => c.id))), []);
  const [escolhidas, setEscolhidas] = React.useState<string[]>([]);
  const [conferido, setConferido] = React.useState(false);
  const acertou = (id: string, i: number) => CAMADAS[i]?.id === id;
  const todasCertas = escolhidas.length === CAMADAS.length && escolhidas.every((id, i) => acertou(id, i));

  function conferir() {
    setConferido(true);
    escolhidas.forEach((id, i) => recordAnswer({ app: "info", category: "redes-camadas", correct: acertou(id, i), timeMs: 0, points: acertou(id, i) ? 10 : 0 }));
  }
  function reiniciar() {
    setBaralho(embaralhar(CAMADAS.map((c) => c.id)));
    setEscolhidas([]);
    setConferido(false);
  }
  const por = (id: string) => CAMADAS.find((c) => c.id === id)!;

  return (
    <div>
      <Instrucao>
        Um arquivo sai do computador da recepção rumo ao servidor da clínica. Clique nas camadas na ordem em que a mensagem desce, da primeira à última. Clique em uma já colocada para tirar.
      </Instrucao>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Camadas embaralhadas</p>
          <div className="space-y-2">
            {baralho.map((id) => {
              const usada = escolhidas.includes(id);
              return (
                <button
                  key={id}
                  disabled={usada || conferido}
                  onClick={() => setEscolhidas([...escolhidas, id])}
                  className={cn("w-full rounded-2xl border px-4 py-3 text-left transition", usada ? "border-foreground/5 opacity-30" : "border-foreground/10 bg-white/60 hover:border-blue-500 hover:bg-white dark:bg-white/5")}
                >
                  <span className="block font-semibold">{por(id).nome}</span>
                  <span className="block text-xs text-muted-foreground">{por(id).faz}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Ordem de descida</p>
          <div className="space-y-2">
            {CAMADAS.map((_, i) => {
              const id = escolhidas[i];
              const ok = conferido && id && acertou(id, i);
              const erro = conferido && id && !acertou(id, i);
              return (
                <button
                  key={i}
                  disabled={!id || conferido}
                  onClick={() => setEscolhidas(escolhidas.filter((_, k) => k !== i))}
                  className={cn(
                    "flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 text-left",
                    !id && "border-foreground/15",
                    id && !conferido && "border-blue-500 bg-blue-600/10",
                    ok && "border-emerald-500 bg-emerald-500/10",
                    erro && "border-red-500 bg-red-500/10"
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600/10 text-sm font-bold text-blue-700 dark:text-blue-300">{i + 1}</span>
                  <span className="font-semibold">{id ? por(id).nome : "clique em uma camada"}</span>
                  {ok && <Check className="ml-auto h-5 w-5 text-emerald-600" />}
                  {erro && <X className="ml-auto h-5 w-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {conferido && (
        <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="font-semibold">{todasCertas ? "Ordem perfeita." : "Quase. Veja a ordem correta:"}</p>
          <ol className="mt-1 list-decimal pl-5 text-muted-foreground">
            {CAMADAS.map((c) => (
              <li key={c.id}>
                {c.nome}: {c.faz}
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <BotaoSec onClick={reiniciar}>
          <RotateCcw className="h-4 w-4" /> embaralhar de novo
        </BotaoSec>
        <BotaoPri onClick={conferir} disabled={escolhidas.length < CAMADAS.length || conferido}>
          conferir
        </BotaoPri>
      </div>
    </div>
  );
}

/* Calculadora de download */
function CalculadoraDownload() {
  const [mbps, setMbps] = React.useState(100);
  const [mb, setMb] = React.useState(200);
  const [pos, setPos] = React.useState(0);
  const [resp, setResp] = React.useState("");
  const [res, setRes] = React.useState<"ok" | "erro" | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const mbs = mbps / 8;
  const seg = mb / mbs;
  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const d = DESAFIOS_DOWNLOAD[pos];

  function conferir() {
    const n = parseFloat(resp.replace(",", "."));
    const ok = Math.abs(n - d.segundos) < 0.5;
    setRes(ok ? "ok" : "erro");
    if (ok) setAcertos((a) => a + 1);
    recordAnswer({ app: "info", category: "redes-velocidade", correct: ok, timeMs: 0, points: ok ? 10 : 0 });
  }
  function proximo() {
    if (pos + 1 >= DESAFIOS_DOWNLOAD.length) setFim(true);
    else {
      setPos(pos + 1);
      setResp("");
      setRes(null);
    }
  }
  function reiniciar() {
    setPos(0);
    setResp("");
    setRes(null);
    setAcertos(0);
    setFim(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
        <p className="font-bold">Laboratório</p>
        <p className="mb-4 text-sm text-muted-foreground">Mexa nos controles e veja o tempo mudar.</p>
        <label className="text-sm font-semibold">Velocidade do plano: {mbps} Mbps</label>
        <input type="range" min={10} max={1000} step={10} value={mbps} onChange={(e) => setMbps(Number(e.target.value))} className="mb-4 w-full" />
        <label className="text-sm font-semibold">Tamanho do arquivo: {mb} MB</label>
        <input type="range" min={1} max={2000} step={1} value={mb} onChange={(e) => setMb(Number(e.target.value))} className="mb-4 w-full" />
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-purple-500/15 p-3">
            <p className="text-xs text-muted-foreground">Mbps ÷ 8</p>
            <p className="text-lg font-bold">{fmt(mbs)} MB/s</p>
          </div>
          <div className="rounded-xl bg-blue-500/15 p-3">
            <p className="text-xs text-muted-foreground">arquivo</p>
            <p className="text-lg font-bold">{mb} MB</p>
          </div>
          <div className="rounded-xl bg-emerald-500/15 p-3">
            <p className="text-xs text-muted-foreground">tempo</p>
            <p className="text-lg font-bold">{fmt(seg)} s</p>
          </div>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-foreground/10">
          <motion.div className="h-full bg-emerald-500" animate={{ width: `${Math.min(100, 100 / Math.max(1, seg / 5))}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">A barra enche mais quanto menor o tempo.</p>
      </div>
      <div>
        {fim ? (
          <Placar acertos={acertos} total={DESAFIOS_DOWNLOAD.length} onReiniciar={reiniciar} />
        ) : (
          <div>
            <Instrucao>Desafio {pos + 1} de {DESAFIOS_DOWNLOAD.length}. Divida por 8, depois divida o arquivo pela velocidade em MB/s. Resposta em segundos.</Instrucao>
            <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 text-lg font-semibold dark:bg-white/5">{d.enunciado}</div>
            <div className="mt-4 flex items-center gap-2">
              <input
                value={resp}
                onChange={(e) => setResp(e.target.value)}
                disabled={res !== null}
                inputMode="decimal"
                placeholder="segundos"
                className="w-40 rounded-xl border border-foreground/20 bg-white/70 px-3 py-2 text-lg dark:bg-white/10"
              />
              <BotaoPri onClick={conferir} disabled={resp.trim() === "" || res !== null}>
                conferir
              </BotaoPri>
            </div>
            {res && (
              <div className={cn("mt-4 rounded-2xl border p-4", res === "ok" ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10")}>
                <p className="font-semibold">{res === "ok" ? "Certo." : "Não foi dessa vez."}</p>
                <p className="mt-1 text-muted-foreground">
                  {d.mbps} Mbps ÷ 8 = {fmt(d.mbps / 8)} MB/s. {d.mb} MB ÷ {fmt(d.mbps / 8)} MB/s = {d.segundos} s.
                </p>
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <BotaoPri onClick={proximo} disabled={res === null}>
                {pos + 1 >= DESAFIOS_DOWNLOAD.length ? "ver resultado" : "próximo"} <ChevronRight className="h-4 w-4" />
              </BotaoPri>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Terminal simulado */
function TerminalTecnico() {
  const [linhas, setLinhas] = React.useState<{ txt: string; cor?: string }[]>([{ txt: "Digite um comando e aperte Enter. Para ajuda, digite help.", cor: "text-slate-400" }]);
  const [entrada, setEntrada] = React.useState("");
  const [feitas, setFeitas] = React.useState<string[]>([]);
  const [resposta, setResposta] = React.useState<string | null>(null);
  const fundo = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    fundo.current?.scrollTo({ top: fundo.current.scrollHeight });
  }, [linhas]);

  function marcar(id: string) {
    if (feitas.includes(id)) return;
    recordAnswer({ app: "info", category: "redes-terminal", correct: true, timeMs: 0, points: 10 });
    setFeitas((f) => (f.includes(id) ? f : [...f, id]));
  }
  function executar(cmd: string) {
    const novas: { txt: string; cor?: string }[] = [{ txt: `C:\\Users\\aluno> ${cmd}`, cor: "text-white" }];
    const c = cmd.trim().toLowerCase();
    if (c === "ipconfig") {
      TERMINAL.ipconfig.forEach((t) => novas.push({ txt: t }));
      marcar("ipconfig");
    } else if (c === "cls") {
      setLinhas([]);
      return;
    } else if (c === "help") {
      novas.push({ txt: "Comandos: ipconfig, ping <endereço>, cls", cor: "text-slate-400" });
    } else if (c.startsWith("ping ")) {
      const alvo = c.slice(5).trim();
      const nome = TERMINAL.nomes[alvo];
      const ip = nome ?? alvo;
      const quem = TERMINAL.responde[ip];
      novas.push({ txt: nome ? `Disparando ${alvo} [${nome}] com 32 bytes de dados:` : `Disparando ${alvo} com 32 bytes de dados:` });
      if (quem || nome) {
        for (let i = 0; i < 4; i++) novas.push({ txt: `Resposta de ${ip}: bytes=32 tempo<1ms`, cor: "text-emerald-400" });
        novas.push({ txt: "Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda)" });
        if (ip === "192.168.10.1") marcar("gateway");
        if (ip === "192.168.10.10") marcar("servidor");
        if (nome) marcar("nome");
      } else {
        for (let i = 0; i < 4; i++) novas.push({ txt: "Esgotado o tempo limite do pedido.", cor: "text-red-400" });
        novas.push({ txt: "Pacotes: Enviados = 4, Recebidos = 0, Perdidos = 4 (100% de perda)" });
        if (ip === "192.168.10.20") marcar("impressora");
      }
    } else if (c !== "") {
      novas.push({ txt: `'${cmd}' não é reconhecido como um comando. Digite help.`, cor: "text-red-400" });
    }
    setLinhas((l) => [...l, ...novas]);
  }
  function enviar(e: React.FormEvent) {
    e.preventDefault();
    executar(entrada);
    setEntrada("");
  }
  const tudo = feitas.length === TERMINAL.missoes.length;
  const diag = TERMINAL.diagnostico;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div>
        <Instrucao>Em dupla. Este é o computador da recepção da Clínica Bem Viver. Cumpram as missões ao lado, digitando os comandos de verdade. Um digita, o outro confere.</Instrucao>
        <div className="overflow-hidden rounded-2xl border border-foreground/20 bg-[#0a0f18] shadow-soft-lg">
          <div className="bg-[#1b2a40] px-4 py-2 text-xs font-semibold text-slate-200">Prompt de Comando</div>
          <div ref={fundo} className="h-80 overflow-y-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
            {linhas.map((l, i) => (
              <div key={i} className={cn("whitespace-pre-wrap", l.cor)}>
                {l.txt || "\u00a0"}
              </div>
            ))}
          </div>
          <form onSubmit={enviar} className="flex items-center gap-2 border-t border-white/10 px-4 py-2 font-mono text-sm text-white">
            <span className="text-slate-400">C:\Users\aluno&gt;</span>
            <input
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              className="flex-1 bg-transparent outline-none"
              aria-label="Comando"
            />
          </form>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Missões</p>
        <ul className="space-y-2">
          {TERMINAL.missoes.map((m) => {
            const ok = feitas.includes(m.id);
            return (
              <li key={m.id} className={cn("flex items-start gap-2 rounded-xl border px-3 py-2 text-sm", ok ? "border-emerald-500 bg-emerald-500/10" : "border-foreground/10 bg-white/50 dark:bg-white/5")}>
                <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs", ok ? "bg-emerald-500 text-white" : "bg-foreground/10")}>{ok ? <Check className="h-3 w-3" /> : ""}</span>
                {m.texto}
              </li>
            );
          })}
        </ul>
        {tudo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
            <p className="text-sm font-semibold">{diag.pergunta}</p>
            <div className="mt-3 space-y-2">
              {diag.opcoes.map((o) => {
                const certa = resposta && o.id === diag.certa;
                const errada = resposta === o.id && o.id !== diag.certa;
                return (
                  <button
                    key={o.id}
                    disabled={Boolean(resposta)}
                    onClick={() => {
                      setResposta(o.id);
                      recordAnswer({ app: "info", category: "redes-terminal", correct: o.id === diag.certa, timeMs: 0, points: o.id === diag.certa ? 20 : 0 });
                    }}
                    className={cn("w-full rounded-xl border px-3 py-2 text-left text-sm transition", !resposta && "border-foreground/10 bg-white/60 hover:border-blue-500 dark:bg-white/5", certa && "border-emerald-500 bg-emerald-500/10", errada && "border-red-500 bg-red-500/10", resposta && !certa && !errada && "opacity-60")}
                  >
                    {o.rotulo}
                  </button>
                );
              })}
            </div>
            {resposta && <p className="mt-3 text-sm text-muted-foreground">{diag.explicacao}</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* Memória das siglas */
type Carta = { id: number; par: number; texto: string; sigla: boolean };

function criarCartas(): Carta[] {
  const lista: Carta[] = [];
  PARES_MEMORIA.forEach((p, i) => {
    lista.push({ id: i * 2, par: i, texto: p.sigla, sigla: true });
    lista.push({ id: i * 2 + 1, par: i, texto: p.significado, sigla: false });
  });
  return embaralhar(lista);
}

function Memoria() {
  const [cartas, setCartas] = React.useState<Carta[]>(() => criarCartas());
  React.useEffect(() => setCartas(criarCartas()), []);
  const [viradas, setViradas] = React.useState<number[]>([]);
  const [achadas, setAchadas] = React.useState<number[]>([]);
  const [jogadas, setJogadas] = React.useState(0);
  const trava = React.useRef(false);
  const fim = achadas.length === PARES_MEMORIA.length;

  function virar(c: Carta) {
    if (trava.current || viradas.includes(c.id) || achadas.includes(c.par)) return;
    const novas = [...viradas, c.id];
    setViradas(novas);
    if (novas.length === 2) {
      setJogadas((j) => j + 1);
      const [a, b] = novas.map((id) => cartas.find((x) => x.id === id)!);
      const ok = a.par === b.par;
      trava.current = true;
      setTimeout(() => {
        if (ok) {
          setAchadas((s) => [...s, a.par]);
          recordAnswer({ app: "info", category: "redes-memoria", correct: true, timeMs: 0, points: 10 });
        }
        setViradas([]);
        trava.current = false;
      }, ok ? 500 : 1000);
    }
  }
  function reiniciar() {
    setCartas(criarCartas());
    setViradas([]);
    setAchadas([]);
    setJogadas(0);
  }

  return (
    <div>
      <Instrucao>Encontre os pares: a sigla e o que ela significa. Menos jogadas é melhor. Sozinho ou em dupla, alternando a vez.</Instrucao>
      <div className="mb-3 flex justify-between text-sm text-muted-foreground">
        <span>{achadas.length} de {PARES_MEMORIA.length} pares</span>
        <span>{jogadas} jogadas</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cartas.map((c) => {
          const aberta = viradas.includes(c.id) || achadas.includes(c.par);
          const feita = achadas.includes(c.par);
          return (
            <button
              key={c.id}
              onClick={() => virar(c)}
              aria-label={aberta ? c.texto : "carta virada"}
              className={cn(
                "grid h-24 place-items-center rounded-2xl border px-2 text-center font-semibold transition",
                aberta ? (feita ? "border-emerald-500 bg-emerald-500/15" : "border-blue-500 bg-blue-600/10") : "border-foreground/10 bg-blue-600 text-white/80 hover:bg-blue-700",
                aberta && c.sigla ? "text-xl font-bold" : aberta ? "text-sm" : ""
              )}
            >
              {aberta ? c.texto : "?"}
            </button>
          );
        })}
      </div>
      {fim && (
        <div className="mt-4 text-center">
          <Trophy className="mx-auto h-10 w-10 text-amber-500" />
          <p className="mt-2 text-lg font-bold">Terminou em {jogadas} jogadas.</p>
          <div className="mt-3">
            <BotaoSec onClick={reiniciar}>
              <RotateCcw className="h-4 w-4" /> jogar de novo
            </BotaoSec>
          </div>
        </div>
      )}
      {!fim && (
        <div className="mt-4 flex justify-end">
          <BotaoSec onClick={reiniciar}>
            <RotateCcw className="h-4 w-4" /> reiniciar
          </BotaoSec>
        </div>
      )}
    </div>
  );
}

/* Página */
export function InfoEssencialRedesAula1() {
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
          <Link href="/#inicio" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <Network className="h-3.5 w-3.5" /> Curso Informática Essencial. UC3
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 1. Redes locais e arquiteturas de rede</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Sete animações curtas e sete atividades para aprender tipos de rede, topologias, camadas, endereços e velocidade. Comece pelas animações e depois jogue as atividades.
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
            {aba === "tipos" && <Quiz itens={ITENS_TIPOS} categoria="redes-tipos" instrucao="Leia a situação e escolha o tipo de rede. Acerte em sequência para acender a chama." />}
            {aba === "camadas" && <MonteCamadas />}
            {aba === "detetive" && <Quiz itens={ITENS_DETETIVE} categoria="redes-ip" instrucao="Em dupla. Olhem as configurações das quatro máquinas, discutam e só cliquem quando os dois concordarem no culpado." />}
            {aba === "download" && <CalculadoraDownload />}
            {aba === "terminal" && <TerminalTecnico />}
            {aba === "memoria" && <Memoria />}
            {aba === "vm" && <Quiz itens={ITENS_VM} categoria="redes-verdade-mito" instrucao="Com a turma toda no telão: o professor lê a frase e todos respondem com o polegar antes de clicar." />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
