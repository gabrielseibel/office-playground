"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlayCircle,
  MailWarning,
  Bug,
  Shield,
  KeyRound,
  Lock,
  ScrollText,
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
  GOLPES,
  AMEACAS,
  AMEACAS_OPCOES,
  DEFESAS,
  DEFESA_OPCOES,
  LOGS,
  VERDADE_OU_MITO,
  SENHAS_COMUNS,
  DESAFIOS_CESAR,
} from "@/data/cursoInfoEssencialRedesAula2";

type Aba = "videos" | "golpe" | "ameaca" | "defesa" | "senha" | "cesar" | "log" | "vm";

const ABAS: { id: Aba; titulo: string; formato: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "videos", titulo: "Animações", formato: "Assistir e responder", icon: PlayCircle },
  { id: "golpe", titulo: "Golpe ou legítima?", formato: "Sozinho", icon: MailWarning },
  { id: "ameaca", titulo: "Qual ameaça é essa?", formato: "Sozinho", icon: Bug },
  { id: "defesa", titulo: "Escolha a defesa", formato: "Em dupla", icon: Shield },
  { id: "senha", titulo: "Laboratório de senhas", formato: "Sozinho", icon: KeyRound },
  { id: "cesar", titulo: "Decifre o segredo", formato: "Em dupla", icon: Lock },
  { id: "log", titulo: "Leia o log", formato: "Em dupla", icon: ScrollText },
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
              src={`${BASE}/animacoes/redes-aula-2/${v.arquivo}`}
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

const ITENS_GOLPE: ItemQuiz[] = GOLPES.map((g) => ({
  pergunta: g.texto,
  opcoes: [
    { id: "golpe", rotulo: "Golpe" },
    { id: "ok", rotulo: "Legítima" },
  ],
  certa: g.golpe ? "golpe" : "ok",
  explicacao: g.explicacao,
}));
const ITENS_AMEACA: ItemQuiz[] = AMEACAS.map((a) => ({ pergunta: a.texto, opcoes: AMEACAS_OPCOES, certa: a.certa, explicacao: a.explicacao }));
const ITENS_DEFESA: ItemQuiz[] = DEFESAS.map((a) => ({ pergunta: a.texto, opcoes: DEFESA_OPCOES, certa: a.certa, explicacao: a.explicacao }));
const ITENS_LOG: ItemQuiz[] = LOGS.map((l) => ({
  pergunta: (
    <span>
      {l.enunciado}
      <span className="mt-3 block overflow-x-auto rounded-xl bg-[#0a0f18] p-3 font-mono text-xs font-normal leading-relaxed text-slate-200 sm:text-sm">
        {l.linhas.map((x, i) => (
          <span key={i} className="block whitespace-pre">
            {x}
          </span>
        ))}
      </span>
    </span>
  ),
  opcoes: l.opcoes,
  certa: l.certa,
  explicacao: l.explicacao,
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

/* Laboratório de senhas */
function avaliarSenha(s: string) {
  const comuns = SENHAS_COMUNS.some((c) => s.toLowerCase().includes(c));
  const regras = [
    { id: "tam", texto: "pelo menos 12 caracteres", ok: s.length >= 12 },
    { id: "min", texto: "letra minúscula", ok: /[a-z]/.test(s) },
    { id: "mai", texto: "letra maiúscula", ok: /[A-Z]/.test(s) },
    { id: "num", texto: "número", ok: /[0-9]/.test(s) },
    { id: "sim", texto: "símbolo ou espaço", ok: /[^a-zA-Z0-9]/.test(s) },
    { id: "com", texto: "não contém senha comum nem o nome da clínica", ok: s.length > 0 && !comuns },
  ];
  let alfabeto = 0;
  if (/[a-z]/.test(s)) alfabeto += 26;
  if (/[A-Z]/.test(s)) alfabeto += 26;
  if (/[0-9]/.test(s)) alfabeto += 10;
  if (/[^a-zA-Z0-9]/.test(s)) alfabeto += 33;
  const bits = s.length * Math.log2(Math.max(alfabeto, 1));
  const tentativasPorSeg = 1e10;
  const seg = comuns ? 0.001 : Math.pow(2, bits) / tentativasPorSeg;
  return { regras, bits, seg, comuns };
}
function tempoLegivel(seg: number): string {
  if (seg < 1) return "menos de 1 segundo";
  if (seg < 60) return `${Math.round(seg)} segundos`;
  if (seg < 3600) return `${Math.round(seg / 60)} minutos`;
  if (seg < 86400) return `${Math.round(seg / 3600)} horas`;
  if (seg < 86400 * 365) return `${Math.round(seg / 86400)} dias`;
  const anos = seg / (86400 * 365);
  if (anos < 1e3) return `${Math.round(anos)} anos`;
  if (anos < 1e6) return `${Math.round(anos / 1e3)} mil anos`;
  if (anos < 1e9) return `${Math.round(anos / 1e6)} milhões de anos`;
  return "bilhões de anos";
}

function LaboratorioSenhas() {
  const [senha, setSenha] = React.useState("");
  const [mostrar, setMostrar] = React.useState(true);
  const [registrado, setRegistrado] = React.useState(false);
  const { regras, seg, comuns } = avaliarSenha(senha);
  const passou = regras.filter((r) => r.ok).length;
  const forte = passou === regras.length;
  const nivel = senha.length === 0 ? 0 : comuns ? 1 : Math.min(4, 1 + Math.floor(passou / 2));
  const rotulos = ["Digite algo", "Muito fraca", "Fraca", "Razoável", "Forte"];
  const cores = ["bg-foreground/10", "bg-red-500", "bg-orange-500", "bg-amber-400", "bg-emerald-500"];

  React.useEffect(() => {
    if (forte && !registrado) {
      setRegistrado(true);
      recordAnswer({ app: "info", category: "redes-senhas", correct: true, timeMs: 0, points: 20 });
    }
  }, [forte, registrado]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Instrucao>
          Desafio: crie uma senha que cumpra todas as regras ao lado. Esta é só uma simulação e nada digitado aqui sai do seu navegador. Não use uma senha que você usa de verdade.
        </Instrucao>
        <div className="flex items-center gap-2">
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type={mostrar ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder="invente uma senha de teste"
            className="w-full rounded-xl border border-foreground/20 bg-white/70 px-3 py-3 font-mono text-lg dark:bg-white/10"
            aria-label="Senha de teste"
          />
          <BotaoSec onClick={() => setMostrar(!mostrar)}>{mostrar ? "ocultar" : "mostrar"}</BotaoSec>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={cn("h-3 rounded-full transition-colors", n <= nivel ? cores[nivel] : "bg-foreground/10")} />
          ))}
        </div>
        <p className="mt-2 font-semibold">{rotulos[nivel]}</p>
        {senha && (
          <p className="mt-1 text-sm text-muted-foreground">
            Um atacante testando 10 bilhões de combinações por segundo levaria cerca de <strong>{tempoLegivel(seg)}</strong>.
          </p>
        )}
        {forte && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl border border-emerald-500 bg-emerald-500/10 p-4">
            <p className="font-semibold">Todas as regras cumpridas.</p>
            <p className="mt-1 text-sm text-muted-foreground">Agora a pergunta da dupla: você consegue lembrar dessa senha sem anotar? Uma frase de quatro palavras costuma ser mais fácil e tão forte quanto.</p>
          </motion.div>
        )}
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Regras ({passou} de {regras.length})</p>
        <ul className="space-y-2">
          {regras.map((r) => (
            <li key={r.id} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm", r.ok ? "border-emerald-500 bg-emerald-500/10" : "border-foreground/10 bg-white/50 dark:bg-white/5")}>
              <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs", r.ok ? "bg-emerald-500 text-white" : "bg-foreground/10")}>{r.ok ? <Check className="h-3 w-3" /> : ""}</span>
              {r.texto}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-blue-600/10 p-3 text-sm text-blue-800 dark:text-blue-200">
          Teste também: troque a sua senha por <span className="font-mono">clinica123</span> e veja o que acontece. Depois tente a frase <span className="font-mono">Cafe com 2 paes de queijo</span>.
        </p>
      </div>
    </div>
  );
}

/* Cifra de César */
const ALFA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function cesar(texto: string, n: number) {
  return texto
    .toUpperCase()
    .split("")
    .map((c) => {
      const i = ALFA.indexOf(c);
      return i < 0 ? c : ALFA[(((i + n) % 26) + 26) % 26];
    })
    .join("");
}

function CifraCesar() {
  const [modo, setModo] = React.useState<"oficina" | "desafio">("oficina");
  const [desloc, setDesloc] = React.useState(3);
  const [texto, setTexto] = React.useState("SIGILO");
  const [pos, setPos] = React.useState(0);
  const [resp, setResp] = React.useState("");
  const [res, setRes] = React.useState<"ok" | "erro" | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [fim, setFim] = React.useState(false);
  const [dica, setDica] = React.useState(false);
  const d = DESAFIOS_CESAR[pos];

  function conferir() {
    const ok = resp.trim().toUpperCase() === d.original;
    setRes(ok ? "ok" : "erro");
    if (ok) setAcertos((a) => a + 1);
    recordAnswer({ app: "info", category: "redes-cripto", correct: ok, timeMs: 0, points: ok ? 10 : 0 });
  }
  function proximo() {
    if (pos + 1 >= DESAFIOS_CESAR.length) setFim(true);
    else {
      setPos(pos + 1);
      setResp("");
      setRes(null);
      setDica(false);
    }
  }
  function reiniciar() {
    setPos(0);
    setResp("");
    setRes(null);
    setAcertos(0);
    setFim(false);
    setDica(false);
  }

  return (
    <div>
      <div className="mb-5 flex gap-2">
        <button onClick={() => setModo("oficina")} className={cn("rounded-xl border px-4 py-2 text-sm font-semibold", modo === "oficina" ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 dark:bg-white/5")}>
          Oficina de cifras
        </button>
        <button onClick={() => setModo("desafio")} className={cn("rounded-xl border px-4 py-2 text-sm font-semibold", modo === "desafio" ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 dark:bg-white/5")}>
          Mensagens secretas
        </button>
      </div>

      {modo === "oficina" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Instrucao>A cifra de César troca cada letra por outra que está algumas posições à frente no alfabeto. Escreva uma mensagem, mude a chave e veja a mensagem cifrada.</Instrucao>
            <label className="text-sm font-semibold">Mensagem original</label>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} spellCheck={false} className="mb-4 mt-1 w-full rounded-xl border border-foreground/20 bg-white/70 px-3 py-2 font-mono text-lg uppercase dark:bg-white/10" />
            <label className="text-sm font-semibold">Chave (deslocamento): {desloc}</label>
            <input type="range" min={1} max={25} value={desloc} onChange={(e) => setDesloc(Number(e.target.value))} className="mb-4 w-full" />
            <p className="text-sm font-semibold">Mensagem cifrada</p>
            <div className="mt-1 break-all rounded-xl bg-amber-500/15 p-3 font-mono text-2xl font-bold tracking-wider">{cesar(texto, desloc) || "\u00a0"}</div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Tabela da chave {desloc}</p>
            <div className="overflow-x-auto rounded-2xl border border-foreground/10 bg-white/50 p-3 dark:bg-white/5">
              <div className="grid grid-cols-13 gap-1 font-mono text-sm" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
                {ALFA.split("").map((c) => (
                  <div key={c} className="rounded-md bg-blue-600/10 py-1 text-center">
                    <div className="font-bold">{c}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-300">{cesar(c, desloc)}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 rounded-xl bg-blue-600/10 p-3 text-sm text-blue-800 dark:text-blue-200">
              Para pensar: com 25 chaves possíveis, quanto tempo leva para quebrar essa cifra? E por que a criptografia moderna precisa de chaves muito maiores?
            </p>
          </div>
        </div>
      )}

      {modo === "desafio" &&
        (fim ? (
          <Placar acertos={acertos} total={DESAFIOS_CESAR.length} onReiniciar={reiniciar} />
        ) : (
          <div className="mx-auto max-w-xl">
            <Instrucao>
              Mensagem {pos + 1} de {DESAFIOS_CESAR.length}. Cada letra foi deslocada {d.deslocamento} posições para a frente. Descubra a palavra original. Use a oficina se precisar de ajuda.
            </Instrucao>
            <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 text-center font-mono text-3xl font-bold tracking-widest dark:bg-white/5">{d.cifrada}</div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <input value={resp} onChange={(e) => setResp(e.target.value)} disabled={res !== null} placeholder="palavra original" className="w-56 rounded-xl border border-foreground/20 bg-white/70 px-3 py-2 text-lg uppercase dark:bg-white/10" />
              <BotaoPri onClick={conferir} disabled={resp.trim() === "" || res !== null}>
                conferir
              </BotaoPri>
            </div>
            {!res && (
              <div className="mt-3 text-center">
                <button onClick={() => setDica(true)} className="text-sm text-blue-700 underline dark:text-blue-300">
                  preciso de uma dica
                </button>
                {dica && <p className="mt-1 text-sm text-muted-foreground">{d.dica}</p>}
              </div>
            )}
            {res && (
              <div className={cn("mt-4 rounded-2xl border p-4", res === "ok" ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10")}>
                <p className="font-semibold">{res === "ok" ? "Certo." : "Não foi dessa vez."}</p>
                <p className="mt-1 text-muted-foreground">A resposta era {d.original}.</p>
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <BotaoPri onClick={proximo} disabled={res === null}>
                {pos + 1 >= DESAFIOS_CESAR.length ? "ver resultado" : "próxima"} <ChevronRight className="h-4 w-4" />
              </BotaoPri>
            </div>
          </div>
        ))}
    </div>
  );
}

/* Página */
export function InfoEssencialRedesAula2() {
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
          <Link href="/informatica-essencial-uc3" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Curso Informática Essencial. UC3
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Aula 2. Segurança de redes</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Seis animações curtas e sete atividades para aprender ameaças, golpes, firewall, senhas, criptografia, VPN e logs. Comece pelas animações e depois jogue as atividades.
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
            {aba === "golpe" && <Quiz itens={ITENS_GOLPE} categoria="redes-golpes" instrucao="Leia a situação e decida: golpe ou comunicação legítima? Procure urgência, pedido de dados, endereço estranho e arquivos inesperados." />}
            {aba === "ameaca" && <Quiz itens={ITENS_AMEACA} categoria="redes-ameacas" instrucao="Identifique o tipo de malware descrito em cada situação. Acerte em sequência para acender a chama." />}
            {aba === "defesa" && <Quiz itens={ITENS_DEFESA} categoria="redes-defesas" instrucao="Em dupla. Discutam qual ferramenta resolve cada problema e só cliquem quando os dois concordarem." />}
            {aba === "senha" && <LaboratorioSenhas />}
            {aba === "cesar" && <CifraCesar />}
            {aba === "log" && <Quiz itens={ITENS_LOG} categoria="redes-logs" instrucao="Em dupla. Leiam as linhas do registro como detetives: hora, usuário, origem e resultado. Procurem o padrão antes de responder." />}
            {aba === "vm" && <Quiz itens={ITENS_VM} categoria="redes-verdade-mito" instrucao="Com a turma toda no telão: o professor lê a frase e todos respondem com o polegar antes de clicar." />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
