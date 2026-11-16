"use client";

import * as React from "react";
import { AlertTriangle, Check, Info, Lock, Power, RotateCcw, Usb, Wifi, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";

/* ============================================================
   Base: palco 1000x625 que escala, monitor com controles físicos
   ============================================================ */

const W = 1000;
const H = 625;
const FONTE_WIN = '"Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,sans-serif';
const FONTE_BIOS = '"Consolas","Lucida Console","Courier New",monospace';

const useLayoutSeguro = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const CSS = `
.simw-dot{position:absolute;inset:0;opacity:0;animation:simwd 2.4s cubic-bezier(.45,.05,.55,.95) infinite}
.simw-dot::after{content:"";position:absolute;left:calc(50% - 3px);top:0;width:6px;height:6px;border-radius:50%;background:currentColor}
@keyframes simwd{0%{transform:rotate(180deg);opacity:0}6%{opacity:1}55%{transform:rotate(540deg)}70%{transform:rotate(620deg);opacity:1}82%{transform:rotate(720deg);opacity:0}100%{transform:rotate(720deg);opacity:0}}
.simw-blink{animation:simwbl 1s steps(1) infinite}@keyframes simwbl{50%{opacity:0}}
`;

function Palco({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [k, setK] = React.useState(1);
  useLayoutSeguro(() => {
    const el = ref.current;
    if (!el) return;
    setK(el.clientWidth / W);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-black" style={{ height: H * k }}>
      <div className="absolute left-0 top-0 overflow-hidden" style={{ width: W, height: H, transform: `scale(${k})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

export type Tecla = "F2" | "F12" | "Esc" | "Up" | "Down" | "Left" | "Right" | "Enter" | "F5" | "F6" | "F10";
const MAPA: Record<string, Tecla> = {
  F2: "F2",
  F12: "F12",
  Escape: "Esc",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Enter: "Enter",
  F5: "F5",
  F6: "F6",
  F10: "F10",
  "+": "F6",
  "-": "F5",
};
const TECLAS_F = new Set<Tecla>(["F2", "F12", "F5", "F6", "F10"]);
const TECLADO_VIRTUAL: [string, Tecla][] = [
  ["Esc", "Esc"],
  ["F2", "F2"],
  ["F5", "F5"],
  ["F6", "F6"],
  ["F10", "F10"],
  ["F12", "F12"],
  ["↑", "Up"],
  ["↓", "Down"],
  ["←", "Left"],
  ["→", "Right"],
  ["Enter", "Enter"],
];

type Controles = { ligado: boolean; onPower: () => void; pendrive: boolean; onPendrive: () => void };

function Monitor({ children, onTecla, controles }: { children: React.ReactNode; onTecla?: (t: Tecla) => boolean; controles?: Controles }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const focar = () => ref.current?.focus({ preventScroll: true });

  function aoTeclar(e: React.KeyboardEvent) {
    const t = MAPA[e.key];
    if (!t || !onTecla) return;
    const alvo = e.target as HTMLElement;
    if (!TECLAS_F.has(t)) {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(alvo.tagName)) return;
      if (alvo.tagName === "BUTTON" && t === "Enter") return;
    }
    if (onTecla(t) || TECLAS_F.has(t)) e.preventDefault();
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      onKeyDown={aoTeclar}
      onMouseDown={(e) => {
        if (!(e.target as HTMLElement).closest("input,select,textarea,button")) focar();
      }}
      className="outline-none"
    >
      <style>{CSS}</style>
      <div className="rounded-[18px] bg-gradient-to-b from-[#2b2e34] to-[#15171b] p-[10px] pb-2 shadow-2xl ring-1 ring-black/60">
        <div className="overflow-hidden rounded-[5px] ring-1 ring-black">
          <Palco>{children}</Palco>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
          <span className="font-semibold tracking-[0.35em] text-slate-500">LUMEN</span>
          {controles && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  controles.onPendrive();
                  focar();
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2 py-1 transition",
                  controles.pendrive ? "border-sky-500/50 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" : "border-slate-600 text-slate-400 hover:bg-white/5"
                )}
              >
                <Usb className="h-3.5 w-3.5" />
                {controles.pendrive ? "pendrive conectado (clique para tirar)" : "porta USB vazia (clique para conectar)"}
              </button>
              <button
                onClick={() => {
                  controles.onPower();
                  focar();
                }}
                aria-label="Botão liga/desliga do notebook"
                className="flex items-center gap-1.5 rounded-md border border-slate-600 px-2 py-1 text-slate-300 transition hover:bg-white/5"
              >
                <span className={cn("h-2 w-2 rounded-full", controles.ligado ? "bg-emerald-400 shadow-[0_0_6px_1px] shadow-emerald-400/70" : "bg-slate-600")} />
                <Power className="h-3.5 w-3.5" /> liga/desliga
              </button>
            </div>
          )}
        </div>
      </div>
      {onTecla && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Teclado:</span>
          {TECLADO_VIRTUAL.map(([rot, t]) => (
            <button
              key={t}
              onClick={() => {
                onTecla(t);
                focar();
              }}
              className="min-w-[2.4rem] rounded-md border border-foreground/20 bg-white/70 px-2 py-1 font-mono text-xs font-semibold shadow-[0_2px_0_rgba(0,0,0,0.15)] transition active:translate-y-px dark:bg-white/10"
            >
              {rot}
            </button>
          ))}
          <span className="text-xs text-muted-foreground">ou clique na tela e use o teclado do computador.</span>
        </div>
      )}
    </div>
  );
}

function Bolinhas({ cor = "#fff", tam = 44 }: { cor?: string; tam?: number }) {
  return (
    <div className="relative" style={{ width: tam, height: tam, color: cor }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="simw-dot" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </div>
  );
}

function LogoWin11({ tam = 60 }: { tam?: number }) {
  const q = tam * 0.47;
  const g = tam - q * 2;
  return (
    <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} aria-hidden>
      <defs>
        <linearGradient id="lw11" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fd3ff" />
          <stop offset="1" stopColor="#1a73e8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={q} height={q} fill="url(#lw11)" />
      <rect x={q + g} y="0" width={q} height={q} fill="url(#lw11)" />
      <rect x="0" y={q + g} width={q} height={q} fill="url(#lw11)" />
      <rect x={q + g} y={q + g} width={q} height={q} fill="url(#lw11)" />
    </svg>
  );
}

function LogoWin10({ tam = 70 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 100 100" aria-hidden>
      <path d="M5 16 L44 10 L44 47 L5 47 Z M50 9 L95 2 L95 47 L50 47 Z M5 53 L44 53 L44 90 L5 84 Z M50 53 L95 53 L95 98 L50 91 Z" fill="#00a2ed" />
    </svg>
  );
}

/* Botão e campos no estilo das janelas clássicas do Windows */
function BtnWin({ children, onClick, disabled, primario }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; primario?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-[26px] min-w-[86px] border px-3 text-[12px] text-[#1b1b1b] transition",
        disabled ? "border-[#bfbfbf] bg-[#cccccc] text-[#838383]" : "border-[#adadad] bg-[#e1e1e1] hover:border-[#0078d7] hover:bg-[#e5f1fb]",
        primario && !disabled && "border-[#0078d7] ring-1 ring-inset ring-[#0078d7]"
      )}
    >
      {children}
    </button>
  );
}

const SELECT_WIN = "h-[23px] border border-[#7a7a7a] bg-white px-1 text-[12px] text-[#1b1b1b] outline-none focus:border-[#0078d7]";
const INPUT_WIN = "h-[23px] border border-[#7a7a7a] bg-white px-1.5 text-[12px] text-[#1b1b1b] outline-none focus:border-[#0078d7]";

function JanelaSetup({
  children,
  rodape,
  voltar,
  larg = 700,
  alt = 480,
  titulo = "Instalação do Windows",
}: {
  children: React.ReactNode;
  rodape?: React.ReactNode;
  voltar?: () => void;
  larg?: number;
  alt?: number;
  titulo?: string;
}) {
  return (
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 25% 15%, #4767e0 0%, #22309a 40%, #0a1150 100%)", fontFamily: FONTE_WIN }}>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col bg-white text-[#1b1b1b] shadow-[0_10px_50px_rgba(0,0,0,.55)]" style={{ width: larg, height: alt }}>
        <div className="flex h-[30px] shrink-0 items-center justify-between border-b border-[#e3e3e3] pl-2.5 text-[12px] text-[#333]">
          <span className="flex items-center gap-2">
            <LogoWin11 tam={13} /> {titulo}
          </span>
          <span className="grid h-[30px] w-[44px] place-items-center text-[13px] text-[#555]">✕</span>
        </div>
        {voltar && (
          <button onClick={voltar} aria-label="Voltar" className="absolute left-3 top-[38px] grid h-7 w-7 place-items-center rounded-full text-[18px] text-[#1f3fa0] hover:bg-[#e5f1fb]">
            ←
          </button>
        )}
        <div className="relative flex-1 overflow-hidden px-12 pt-6 text-[12px]">{children}</div>
        {rodape && <div className="flex shrink-0 items-center justify-end gap-2 px-6 pb-5">{rodape}</div>}
      </div>
    </div>
  );
}

function TituloSetup({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[17px] text-[#1f3fa0]">{children}</p>;
}

function DialogoWin({
  texto,
  icone = "aviso",
  onOk,
  onCancelar,
  okRotulo = "OK",
}: {
  texto: React.ReactNode;
  icone?: "aviso" | "erro" | "info";
  onOk: () => void;
  onCancelar?: () => void;
  okRotulo?: string;
}) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-black/10">
      <div className="w-[420px] border border-[#8d8d8d] bg-white shadow-[0_6px_24px_rgba(0,0,0,.35)]">
        <div className="flex h-[28px] items-center justify-between border-b border-[#e3e3e3] pl-2.5 text-[12px]">
          <span>Instalação do Windows</span>
          <span className="px-3 text-[#555]">✕</span>
        </div>
        <div className="flex gap-3 px-4 py-4 text-[12px] leading-relaxed">
          {icone === "aviso" && <AlertTriangle className="h-8 w-8 shrink-0 fill-[#fcd116] text-[#5c4a00]" />}
          {icone === "erro" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c42b1c] text-[16px] font-bold text-white">✕</span>}
          {icone === "info" && <Info className="h-8 w-8 shrink-0 fill-[#0067c0] text-white" />}
          <div>{texto}</div>
        </div>
        <div className="flex justify-end gap-2 bg-[#f0f0f0] px-4 py-2.5">
          <BtnWin primario onClick={onOk}>
            {okRotulo}
          </BtnWin>
          {onCancelar && <BtnWin onClick={onCancelar}>Cancelar</BtnWin>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Discos e partições: modelo + tela "Onde deseja instalar o Windows?"
   ============================================================ */

export type TipoParte = "sistema" | "msr" | "primaria" | "recuperacao" | "livre";
export type Parte = {
  id: string;
  tipo: TipoParte;
  tamMB: number;
  livreMB?: number;
  rotulo?: string;
  dados?: boolean;
  windowsAntigo?: boolean;
  backup?: boolean;
  nova?: boolean;
};
export type Disco = { n: number; usb?: boolean; nome: string; parts: Parte[] };

let seq = 0;
const novoId = () => `p${++seq}`;
const MIN_WIN11 = 64 * 1024;

const fmtMB = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(1).replace(".", ",")} GB` : `${mb.toFixed(1).replace(".", ",")} MB`);

function discoCliente(): Disco {
  return {
    n: 0,
    nome: "SSD do notebook",
    parts: [
      { id: novoId(), tipo: "sistema", tamMB: 100, livreMB: 68, rotulo: "" },
      { id: novoId(), tipo: "msr", tamMB: 16 },
      { id: novoId(), tipo: "primaria", tamMB: 122150, livreMB: 8396, rotulo: "Windows", windowsAntigo: true, dados: true },
      { id: novoId(), tipo: "primaria", tamMB: 121282, livreMB: 30551, rotulo: "Dados", dados: true },
      { id: novoId(), tipo: "recuperacao", tamMB: 650, livreMB: 104, rotulo: "Recuperação" },
    ],
  };
}
function discoBackupUsb(): Disco {
  return { n: 1, usb: true, nome: "HD externo USB", parts: [{ id: novoId(), tipo: "primaria", tamMB: 953867, livreMB: 702114, rotulo: "BACKUP ANA", dados: true, backup: true }] };
}
function discoNovo(): Disco {
  return { n: 0, nome: "SSD novo", parts: [{ id: novoId(), tipo: "livre", tamMB: 488386 }] };
}

function juntarLivres(parts: Parte[]): Parte[] {
  const out: Parte[] = [];
  for (const p of parts) {
    const u = out[out.length - 1];
    if (p.tipo === "livre" && u && u.tipo === "livre") out[out.length - 1] = { ...u, tamMB: u.tamMB + p.tamMB };
    else out.push(p);
  }
  return out;
}
const mudaDisco = (ds: Disco[], n: number, f: (d: Disco) => Disco) => ds.map((d) => (d.n === n ? f(d) : d));
const precisaSistema = (d: Disco) => !d.usb && !d.parts.some((p) => p.tipo === "sistema");

function opExcluir(ds: Disco[], n: number, id: string) {
  return mudaDisco(ds, n, (d) => ({ ...d, parts: juntarLivres(d.parts.map((p) => (p.id === id ? { id: p.id, tipo: "livre" as const, tamMB: p.tamMB } : p))) }));
}
function opFormatar(ds: Disco[], n: number, id: string) {
  return mudaDisco(ds, n, (d) => ({
    ...d,
    parts: d.parts.map((p) => (p.id === id ? { id: p.id, tipo: p.tipo, tamMB: p.tamMB, livreMB: Math.round(p.tamMB * 0.996), nova: true } : p)),
  }));
}
function opCriar(ds: Disco[], n: number, id: string, mb: number, comSistema: boolean): { ds: Disco[]; novaId: string | null } {
  let novaId: string | null = null;
  const res = mudaDisco(ds, n, (d) => ({
    ...d,
    parts: juntarLivres(
      d.parts.flatMap((p) => {
        if (p.id !== id) return [p];
        const usar = Math.min(Math.max(Math.round(mb), 0), p.tamMB);
        const sis = comSistema ? 116 : 0;
        if (usar <= sis + 1) return [p];
        const extra: Parte[] = comSistema
          ? [
              { id: novoId(), tipo: "sistema", tamMB: 100, livreMB: 73, nova: true },
              { id: novoId(), tipo: "msr", tamMB: 16, nova: true },
            ]
          : [];
        novaId = novoId();
        const prim: Parte = { id: novaId, tipo: "primaria", tamMB: usar - sis, livreMB: Math.round((usar - sis) * 0.996), nova: true };
        const resto = p.tamMB - usar;
        return [...extra, prim, ...(resto > 1 ? [{ id: novoId(), tipo: "livre" as const, tamMB: resto }] : [])];
      })
    ),
  }));
  return { ds: res, novaId };
}

/* Simula o que o instalador faz ao avançar: no espaço livre ele cria as partições sozinho. */
function aplicarInstalacao(ds: Disco[], n: number, id: string): { ds: Disco[]; alvoId: string } {
  const d = ds.find((x) => x.n === n)!;
  const p = d.parts.find((x) => x.id === id)!;
  if (p.tipo !== "livre") return { ds, alvoId: id };
  const r = opCriar(ds, n, id, p.tamMB, precisaSistema(d));
  return { ds: r.ds, alvoId: r.novaId ?? id };
}

function numeroParte(d: Disco, p: Parte) {
  return d.parts.filter((x) => x.tipo !== "livre").findIndex((x) => x.id === p.id) + 1;
}
function nomeParte(d: Disco, p: Parte) {
  if (p.tipo === "livre") return `Espaço Não Alocado na Unidade ${d.n}`;
  return `Unidade ${d.n} Partição ${numeroParte(d, p)}${p.rotulo ? `: ${p.rotulo}` : ""}`;
}
const TIPO_ROT: Record<TipoParte, string> = { sistema: "Sistema", msr: "MSR (Reservado)", primaria: "Primária", recuperacao: "Recuperação", livre: "" };

export type AvalDisco = {
  alvoMB: number;
  noUsb: boolean;
  windowsOld: boolean;
  emDados: boolean;
  sobras: string[];
  recAntiga: boolean;
  backupIntacto: boolean;
  outrasNovas: number[];
};

function avaliar(ds: Disco[], n: number, id: string): { aval: AvalDisco; ds: Disco[]; alvoId: string } {
  const antes = ds.find((x) => x.n === n)!.parts.find((x) => x.id === id)!;
  const r = aplicarInstalacao(ds, n, id);
  const d = r.ds.find((x) => x.n === n)!;
  const alvo = d.parts.find((x) => x.id === r.alvoId)!;
  const outras = d.parts.filter((x) => x.id !== alvo.id);
  return {
    ds: r.ds,
    alvoId: r.alvoId,
    aval: {
      alvoMB: alvo.tamMB,
      noUsb: Boolean(d.usb),
      windowsOld: Boolean(antes.windowsAntigo),
      emDados: Boolean(antes.dados && !antes.windowsAntigo),
      sobras: outras.filter((x) => x.dados || x.windowsAntigo).map((x) => nomeParte(d, x)),
      recAntiga: outras.some((x) => x.tipo === "recuperacao" && !x.nova),
      backupIntacto: r.ds.every((x) => !x.usb || x.parts.some((p) => p.backup && p.dados)),
      outrasNovas: outras.filter((x) => x.tipo === "primaria" && x.nova && !x.dados).map((x) => x.tamMB),
    },
  };
}

function IconeDisco({ cinza }: { cinza?: boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden className="shrink-0">
      <rect x="0.5" y="2.5" width="17" height="9" rx="1.5" fill={cinza ? "#d9d9d9" : "#c9d6e8"} stroke="#6b7a90" />
      <rect x="2.5" y="6" width="9" height="2" fill={cinza ? "#9a9a9a" : "#5b7fb8"} />
      <circle cx="14.5" cy="7" r="1" fill="#3fbf5f" />
    </svg>
  );
}

type Modal =
  | { k: "excluir"; n: number; id: string; especial: boolean }
  | { k: "formatar"; n: number; id: string }
  | { k: "sistema"; n: number; id: string; mb: number }
  | { k: "windowsold"; n: number; id: string }
  | { k: "driver" }
  | { k: "driver-pasta" }
  | { k: "driver-lista" }
  | { k: "driver-nenhum" }
  | null;

const PASTAS_DRIVER = ["D:\\Drivers\\Audio", "D:\\Drivers\\IRST", "D:\\Drivers\\Video", "D:\\Drivers\\WiFi"];

function TelaDisco({
  discos,
  setDiscos,
  ocultarDiscos,
  onDriverCarregado,
  onAvancar,
  onVoltar,
  onEvento,
}: {
  discos: Disco[];
  setDiscos: (f: (ds: Disco[]) => Disco[]) => void;
  ocultarDiscos?: boolean;
  onDriverCarregado?: () => void;
  onAvancar: (n: number, id: string) => void;
  onVoltar?: () => void;
  onEvento?: (txt: string) => void;
}) {
  const [sel, setSel] = React.useState<{ n: number; id: string } | null>(null);
  const [modal, setModal] = React.useState<Modal>(null);
  const [novo, setNovo] = React.useState<string | null>(null);
  const [erro, setErro] = React.useState<{ texto: string; detalhe: string } | null>(null);
  const [verDetalhe, setVerDetalhe] = React.useState(false);
  const [pasta, setPasta] = React.useState(PASTAS_DRIVER[0]);
  const [carregando, setCarregando] = React.useState(false);

  const visiveis = ocultarDiscos ? [] : discos;
  const atualD = sel ? visiveis.find((d) => d.n === sel.n) : undefined;
  const atual = atualD?.parts.find((p) => p.id === sel?.id);

  function selecionar(n: number, id: string) {
    setSel({ n, id });
    setNovo(null);
    setErro(null);
    setVerDetalhe(false);
  }

  function avancar() {
    if (!atual || !atualD) return;
    setVerDetalhe(false);
    const num = numeroParte(atualD, atual);
    if (atualD.usb) {
      setErro({ texto: "O Windows não pode ser instalado neste disco.", detalhe: "Não há suporte para a instalação do Windows em um dispositivo conectado à porta USB ou IEEE 1394." });
      onEvento?.("Tentou instalar o Windows no HD externo USB.");
      return;
    }
    if (atual.tipo === "sistema" || atual.tipo === "msr" || atual.tipo === "recuperacao") {
      setErro({ texto: `O Windows não pode ser instalado na unidade ${atualD.n} partição ${num}.`, detalhe: "Esta partição é de um tipo reservado para o sistema. Escolha uma partição Primária ou um espaço não alocado." });
      return;
    }
    const util = atual.tipo === "livre" ? atual.tamMB - (precisaSistema(atualD) ? 116 : 0) : atual.tamMB;
    if (util < MIN_WIN11) {
      setErro({
        texto: atual.tipo === "livre" ? `O Windows não pode ser instalado no espaço não alocado da unidade ${atualD.n}.` : `O Windows não pode ser instalado na unidade ${atualD.n} partição ${num}.`,
        detalhe: `O espaço é muito pequeno. O Windows 11 precisa de pelo menos 64 GB, e aqui há ${fmtMB(util)}.`,
      });
      return;
    }
    if (atual.windowsAntigo) {
      setModal({ k: "windowsold", n: atualD.n, id: atual.id });
      return;
    }
    onAvancar(atualD.n, atual.id);
  }

  function confirmar() {
    if (!modal) return;
    if (modal.k === "excluir") {
      const alvo = discos.find((d) => d.n === modal.n)?.parts.find((p) => p.id === modal.id);
      setDiscos((ds) => opExcluir(ds, modal.n, modal.id));
      onEvento?.(alvo?.backup ? "Excluiu a partição do HD externo com o backup da cliente." : `Excluiu ${alvo ? nomeParte(discos.find((d) => d.n === modal.n)!, alvo) : "uma partição"}.`);
      setSel(null);
    } else if (modal.k === "formatar") {
      const alvo = discos.find((d) => d.n === modal.n)?.parts.find((p) => p.id === modal.id);
      setDiscos((ds) => opFormatar(ds, modal.n, modal.id));
      onEvento?.(alvo?.backup ? "Formatou a partição do HD externo com o backup da cliente." : `Formatou ${alvo ? nomeParte(discos.find((d) => d.n === modal.n)!, alvo) : "uma partição"}.`);
    } else if (modal.k === "sistema") {
      const r = opCriar(discos, modal.n, modal.id, modal.mb, true);
      setDiscos(() => r.ds);
      onEvento?.(`Criou uma partição de ${fmtMB(modal.mb - 116)}. O Windows criou junto as partições Sistema e MSR.`);
      if (r.novaId) setSel({ n: modal.n, id: r.novaId });
      setNovo(null);
    } else if (modal.k === "windowsold") {
      onAvancar(modal.n, modal.id);
    }
    setModal(null);
  }

  function aplicarNovo() {
    if (!atual || !atualD || novo === null) return;
    const mb = parseInt(novo.replace(/\D/g, ""), 10);
    if (!mb) return;
    if (precisaSistema(atualD)) {
      setModal({ k: "sistema", n: atualD.n, id: atual.id, mb: Math.min(mb, atual.tamMB) });
      return;
    }
    const r = opCriar(discos, atualD.n, atual.id, mb, false);
    setDiscos(() => r.ds);
    onEvento?.(`Criou uma partição de ${fmtMB(Math.min(mb, atual.tamMB))}.`);
    if (r.novaId) setSel({ n: atualD.n, id: r.novaId });
    setNovo(null);
  }

  function escolherDriver() {
    setModal(null);
    if (!pasta.endsWith("IRST")) {
      setModal({ k: "driver-nenhum" });
      return;
    }
    setModal({ k: "driver-lista" });
  }

  const pode = {
    excluir: Boolean(atual && atual.tipo !== "livre"),
    formatar: Boolean(atual && atual.tipo === "primaria"),
    novo: Boolean(atual && atual.tipo === "livre"),
  };
  const Acao = ({ rot, on, ativo = true }: { rot: string; on: () => void; ativo?: boolean }) => (
    <button disabled={!ativo} onClick={on} className={cn("flex items-center gap-1 text-[12px]", ativo ? "text-[#0066cc] hover:underline" : "text-[#9a9a9a]")}>
      <span className={cn("inline-block h-3 w-3 rounded-[2px]", ativo ? "bg-[#6f9ad8]" : "bg-[#d0d0d0]")} />
      {rot}
    </button>
  );

  return (
    <JanelaSetup
      voltar={onVoltar}
      rodape={
        <>
          <div className="mr-auto max-w-[480px] text-[12px]">
            {erro && (
              <div>
                <p className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-px h-4 w-4 shrink-0 fill-[#fcd116] text-[#5c4a00]" />
                  <span>
                    {erro.texto}{" "}
                    <button onClick={() => setVerDetalhe((v) => !v)} className="text-[#0066cc] hover:underline">
                      ({verDetalhe ? "Ocultar detalhes" : "Mostrar detalhes"})
                    </button>
                  </span>
                </p>
                {verDetalhe && <p className="ml-6 mt-1 text-[#444]">{erro.detalhe}</p>}
              </div>
            )}
          </div>
          <BtnWin primario disabled={!atual || ocultarDiscos} onClick={avancar}>
            Avançar
          </BtnWin>
        </>
      }
    >
      <TituloSetup>Onde deseja instalar o Windows?</TituloSetup>
      <div className="h-[196px] overflow-y-auto border border-[#828790]">
        <table className="w-full text-left text-[12px]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[#e5e5e5] text-[#4d4d4d]">
              <th className="py-1 pl-2 font-normal">Nome</th>
              <th className="w-[96px] py-1 font-normal">Tamanho Total</th>
              <th className="w-[92px] py-1 font-normal">Espaço Livre</th>
              <th className="w-[108px] py-1 font-normal">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.flatMap((d) =>
              d.parts.map((p) => {
                const s = sel?.n === d.n && sel.id === p.id;
                const livre = p.tipo === "livre" ? p.tamMB : p.tipo === "msr" ? p.tamMB : p.livreMB ?? 0;
                return (
                  <tr
                    key={p.id}
                    onClick={() => selecionar(d.n, p.id)}
                    className={cn("cursor-default border border-transparent", s ? "border-[#99d1ff] bg-[#cce8ff]" : "hover:bg-[#e5f3ff]")}
                  >
                    <td className="py-[3px] pl-2">
                      <span className="flex items-center gap-2">
                        <IconeDisco cinza={p.tipo === "livre"} />
                        {nomeParte(d, p)}
                      </span>
                    </td>
                    <td className="py-[3px]">{fmtMB(p.tamMB)}</td>
                    <td className="py-[3px]">{fmtMB(livre)}</td>
                    <td className="py-[3px]">{TIPO_ROT[p.tipo]}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {ocultarDiscos && (
          <p className="flex items-start gap-1.5 p-3 text-[12px]">
            <AlertTriangle className="mt-px h-4 w-4 shrink-0 fill-[#fcd116] text-[#5c4a00]" />
            Não encontramos nenhuma unidade. Para obter um driver de armazenamento, clique em Carregar driver.
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-y-2">
        <Acao rot="Atualizar" on={() => setErro(null)} />
        <Acao rot="Excluir" ativo={pode.excluir} on={() => atual && atualD && setModal({ k: "excluir", n: atualD.n, id: atual.id, especial: atual.tipo !== "primaria" })} />
        <Acao rot="Formatar" ativo={pode.formatar} on={() => atual && atualD && setModal({ k: "formatar", n: atualD.n, id: atual.id })} />
        <Acao
          rot="Novo"
          ativo={pode.novo}
          on={() => {
            if (atual) setNovo(String(Math.floor(atual.tamMB)));
          }}
        />
        <Acao rot="Carregar driver" on={() => setModal({ k: "driver" })} />
        <Acao rot="Estender" ativo={false} on={() => {}} />
      </div>
      {novo !== null && pode.novo && (
        <div className="mt-3 flex items-center gap-2 text-[12px]">
          Tamanho:
          <input value={novo} onChange={(e) => setNovo(e.target.value)} inputMode="numeric" aria-label="Tamanho em MB" className={cn(INPUT_WIN, "w-[96px] text-right")} />
          MB
          <BtnWin onClick={aplicarNovo}>Aplicar</BtnWin>
          <BtnWin onClick={() => setNovo(null)}>Cancelar</BtnWin>
        </div>
      )}

      {modal?.k === "excluir" && (
        <DialogoWin
          texto={
            modal.especial
              ? "Esta partição pode conter arquivos de recuperação, arquivos do sistema ou software importante do fabricante do computador. Se você excluir esta partição, todos os dados armazenados nela serão perdidos."
              : "Se você excluir esta partição, todos os dados armazenados nela serão perdidos."
          }
          onOk={confirmar}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.k === "formatar" && <DialogoWin texto="Se você formatar esta partição, todos os dados armazenados nela serão perdidos." onOk={confirmar} onCancelar={() => setModal(null)} />}
      {modal?.k === "sistema" && (
        <DialogoWin icone="info" texto="Para garantir que todos os recursos do Windows funcionem corretamente, o Windows pode criar partições adicionais para arquivos do sistema." onOk={confirmar} onCancelar={() => setModal(null)} />
      )}
      {modal?.k === "windowsold" && (
        <DialogoWin
          icone="info"
          texto="A partição selecionada pode conter arquivos de uma instalação anterior do Windows. Se isso acontecer, esses arquivos e pastas serão movidos para uma pasta chamada Windows.old. Você poderá acessar as informações em Windows.old, mas não poderá usar sua versão anterior do Windows."
          onOk={confirmar}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.k === "driver" && (
        <DialogoWin
          icone="info"
          okRotulo="Procurar"
          texto="Para instalar o driver do dispositivo para a unidade, insira a mídia de instalação que contém os arquivos do driver e clique em Procurar."
          onOk={() => setModal({ k: "driver-pasta" })}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.k === "driver-pasta" && (
        <DialogoWin
          icone="info"
          texto={
            <div>
              <p className="mb-2">Procurar Pasta. Escolha a pasta com os drivers:</p>
              <div className="border border-[#828790] bg-white">
                <p className="px-2 py-0.5 text-[#555]">Este Computador › Pendrive de instalação (D:) › Drivers</p>
                {PASTAS_DRIVER.map((p) => (
                  <button key={p} onClick={() => setPasta(p)} className={cn("block w-full px-4 py-0.5 text-left", pasta === p ? "bg-[#cce8ff]" : "hover:bg-[#e5f3ff]")}>
                    📁 {p.split("\\").pop()}
                  </button>
                ))}
              </div>
            </div>
          }
          onOk={escolherDriver}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.k === "driver-nenhum" && (
        <DialogoWin icone="aviso" texto="Nenhum driver de dispositivo assinado foi encontrado. Verifique se a mídia de instalação contém os drivers corretos e clique em OK." onOk={() => setModal({ k: "driver-pasta" })} onCancelar={() => setModal(null)} />
      )}
      {modal?.k === "driver-lista" && (
        <DialogoWin
          icone="info"
          okRotulo={carregando ? "Carregando..." : "Avançar"}
          texto={
            <div>
              <p className="mb-2">Selecione o driver a ser instalado.</p>
              <div className="border border-[#99d1ff] bg-[#cce8ff] px-2 py-1">Intel RST VMD Controller 9A0B (D:\Drivers\IRST\iaStorVD.inf)</div>
              <label className="mt-2 flex items-center gap-1.5">
                <input type="checkbox" defaultChecked readOnly /> Ocultar drivers que não são compatíveis com este hardware
              </label>
            </div>
          }
          onOk={() => {
            if (carregando) return;
            setCarregando(true);
            setTimeout(() => {
              setCarregando(false);
              setModal(null);
              onEvento?.("Carregou o driver Intel RST VMD da pasta IRST do pendrive.");
              onDriverCarregado?.();
            }, 1400);
          }}
          onCancelar={() => setModal(null)}
        />
      )}
    </JanelaSetup>
  );
}

/* ============================================================
   Telas de firmware: inicialização, menu de boot, configuração UEFI
   ============================================================ */

type Dev = "ssd" | "usb" | "pxe";
const NOME_DEV: Record<Dev, string> = {
  ssd: "Windows Boot Manager (Samsung SSD 980 250GB)",
  usb: "UEFI: SanDisk Ultra USB 3.0 1.00, Partition 1",
  pxe: "UEFI: PXE IPv4 Intel(R) Ethernet Connection",
};

function useTeclas(reg: React.MutableRefObject<((t: Tecla) => boolean) | null>, fn: (t: Tecla) => boolean) {
  React.useEffect(() => {
    reg.current = fn;
    return () => {
      if (reg.current === fn) reg.current = null;
    };
  });
}
type RegTeclas = React.MutableRefObject<((t: Tecla) => boolean) | null>;

function TelaPost() {
  return (
    <div className="absolute inset-0 bg-black text-white" style={{ fontFamily: FONTE_WIN }}>
      <div className="absolute inset-x-0 top-[38%] text-center">
        <p className="text-[64px] font-extralight tracking-[0.45em]">LUMEN</p>
      </div>
      <p className="absolute bottom-6 left-8 text-[14px] text-slate-300" style={{ fontFamily: FONTE_BIOS }}>
        &lt;F2&gt; Setup &nbsp;&nbsp; &lt;F12&gt; Boot Menu
      </p>
    </div>
  );
}

function TelaBootMenu({ reg, pendrive, onBoot, onBios, onSair }: { reg: RegTeclas; pendrive: boolean; onBoot: (d: Dev) => void; onBios: () => void; onSair: () => void }) {
  const itens: { rot: string; acao: () => void; secao?: string }[] = [
    { rot: NOME_DEV.ssd, acao: () => onBoot("ssd"), secao: "UEFI BOOT:" },
    ...(pendrive ? [{ rot: NOME_DEV.usb, acao: () => onBoot("usb") }] : []),
    { rot: NOME_DEV.pxe, acao: () => onBoot("pxe") },
    { rot: "BIOS Setup", acao: onBios, secao: "OTHER OPTIONS:" },
  ];
  const [sel, setSel] = React.useState(0);
  useTeclas(reg, (t) => {
    if (t === "Up") setSel((s) => (s + itens.length - 1) % itens.length);
    else if (t === "Down") setSel((s) => (s + 1) % itens.length);
    else if (t === "Enter") itens[Math.min(sel, itens.length - 1)].acao();
    else if (t === "Esc") onSair();
    else return false;
    return true;
  });
  return (
    <div className="absolute inset-0 bg-[#00007c] p-10 text-[16px] text-white" style={{ fontFamily: FONTE_BIOS }}>
      <div className="mx-auto w-[640px] border-2 border-white/80 bg-[#0000a8]">
        <p className="bg-[#c0c0c0] py-1 text-center font-bold text-[#00007c]">Boot Menu</p>
        <div className="p-4 leading-7">
          <p className="text-[13px] text-sky-200">Boot mode is set to: UEFI; Secure Boot: ON</p>
          {itens.map((it, i) => (
            <React.Fragment key={it.rot}>
              {it.secao && <p className="mt-3 text-[14px] text-yellow-200">{it.secao}</p>}
              <button
                onClick={() => {
                  setSel(i);
                  it.acao();
                }}
                className={cn("block w-full px-3 text-left", i === sel ? "bg-white text-[#0000a8]" : "hover:bg-white/10")}
              >
                {it.rot}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-[13px] text-sky-200">↑ ↓ select &nbsp;·&nbsp; Enter boot &nbsp;·&nbsp; Esc exit (continue normal boot)</p>
    </div>
  );
}

function TelaPxe() {
  const [linhas, setLinhas] = React.useState(1);
  React.useEffect(() => {
    const t = setInterval(() => setLinhas((l) => Math.min(l + 1, 4)), 700);
    return () => clearInterval(t);
  }, []);
  const txt = ["Start PXE over IPv4.", "  Station IP address is not available...", "  >>Checking Media Presence......", "PXE-E16: No valid offer received."];
  return (
    <div className="absolute inset-0 bg-black p-8 text-[15px] leading-7 text-[#c0c0c0]" style={{ fontFamily: FONTE_BIOS }}>
      {txt.slice(0, linhas).map((l) => (
        <p key={l} className="whitespace-pre">
          {l}
        </p>
      ))}
      <span className="simw-blink">_</span>
    </div>
  );
}

type PopupBios = { k: "escolher"; slot: number; sel: number } | { k: "confirmar"; acao: "salvar" | "descartar" | "padrao"; sel: number } | null;
const ABAS_BIOS = ["Main", "Advanced", "Boot", "Security", "Save & Exit"];

function TelaBios({ reg, ordem, onSair }: { reg: RegTeclas; ordem: Dev[]; onSair: (nova: Dev[] | null) => void }) {
  const [aba, setAba] = React.useState(0);
  const [linha, setLinha] = React.useState(0);
  const [tmp, setTmp] = React.useState<Dev[]>(ordem);
  const [popup, setPopup] = React.useState<PopupBios>(null);
  const linhasAba = aba === 2 || aba === 4 ? 3 : 0;

  function mover(de: number, para: number) {
    if (para < 0 || para > 2) return;
    setTmp((o) => {
      const c = [...o];
      [c[de], c[para]] = [c[para], c[de]];
      return c;
    });
    setLinha(para);
  }
  function executar(acao: "salvar" | "descartar" | "padrao") {
    if (acao === "padrao") {
      setTmp(["ssd", "usb", "pxe"]);
      setPopup(null);
    } else onSair(acao === "salvar" ? tmp : null);
  }
  function enter() {
    if (aba === 2) setPopup({ k: "escolher", slot: linha, sel: ["ssd", "usb", "pxe"].indexOf(tmp[linha]) });
    if (aba === 4) setPopup({ k: "confirmar", acao: (["salvar", "descartar", "padrao"] as const)[linha], sel: 0 });
  }
  useTeclas(reg, (t) => {
    if (popup) {
      if (popup.k === "escolher") {
        if (t === "Up" || t === "Down") setPopup({ ...popup, sel: (popup.sel + (t === "Up" ? 2 : 1)) % 3 });
        else if (t === "Enter") {
          const dev = (["ssd", "usb", "pxe"] as Dev[])[popup.sel];
          mover(tmp.indexOf(dev), popup.slot);
          setPopup(null);
        } else if (t === "Esc") setPopup(null);
        else return false;
        return true;
      }
      if (t === "Left" || t === "Right") setPopup({ ...popup, sel: popup.sel === 0 ? 1 : 0 });
      else if (t === "Enter") {
        if (popup.sel === 0) executar(popup.acao);
        else setPopup(null);
      }
      else if (t === "Esc") setPopup(null);
      else return false;
      return true;
    }
    if (t === "Left") {
      setAba((a) => (a + 4) % 5);
      setLinha(0);
    } else if (t === "Right") {
      setAba((a) => (a + 1) % 5);
      setLinha(0);
    } else if (t === "Up" && linhasAba) setLinha((l) => (l + linhasAba - 1) % linhasAba);
    else if (t === "Down" && linhasAba) setLinha((l) => (l + 1) % linhasAba);
    else if (t === "Enter") enter();
    else if (t === "F6" && aba === 2) mover(linha, linha - 1);
    else if (t === "F5" && aba === 2) mover(linha, linha + 1);
    else if (t === "F10") setPopup({ k: "confirmar", acao: "salvar", sel: 0 });
    else if (t === "Esc") setPopup({ k: "confirmar", acao: "descartar", sel: 0 });
    else return false;
    return true;
  });

  const Info = ({ a, b }: { a: string; b: string }) => (
    <div className="flex">
      <span className="w-[300px] text-[#00007c]">{a}</span>
      <span className="text-black">{b}</span>
    </div>
  );
  const Linha = ({ i, a, b, onClick }: { i: number; a: string; b?: string; onClick: () => void }) => (
    <button
      onClick={() => {
        setLinha(i);
        onClick();
      }}
      className={cn("flex w-full text-left", linha === i ? "bg-[#00007c] text-white" : "text-[#00007c] hover:bg-[#00007c]/10")}
    >
      <span className="w-[300px]">{a}</span>
      {b && <span className={linha === i ? "text-white" : "text-black"}>{b}</span>}
    </button>
  );
  const ajuda = [
    "System information. Use the arrow keys to change tabs.",
    "Storage controller and processor features.",
    "Sets the system boot order. Select a Boot Option and press Enter to choose a device, or use F5/F6 to move it down/up.",
    "Secure Boot and TPM must stay Enabled for Windows 11.",
    "Save or discard your changes and restart.",
  ][aba];

  return (
    <div className="absolute inset-0 bg-[#c6c6c6] text-[15px] leading-7" style={{ fontFamily: FONTE_BIOS }}>
      <p className="bg-[#00007c] py-1 text-center text-white">Lumen UEFI Setup Utility · Version 1.08</p>
      <div className="flex bg-[#00007c] px-4 text-[#c6c6c6]">
        {ABAS_BIOS.map((n, i) => (
          <button
            key={n}
            onClick={() => {
              setAba(i);
              setLinha(0);
            }}
            className={cn("px-4", aba === i ? "bg-[#c6c6c6] text-[#00007c]" : "hover:text-white")}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex h-[548px]">
        <div className="flex-1 border-r-2 border-[#8a8a8a] p-5">
          {aba === 0 && (
            <>
              <Info a="BIOS Version" b="1.08" />
              <Info a="Processor Type" b="Intel(R) Core(TM) i5-1135G7 @ 2.40GHz" />
              <Info a="Total Memory" b="8192 MB" />
              <Info a="Storage" b="Samsung SSD 980 250GB" />
              <Info a="System Date" b="[Sat 11/14/2026]" />
              <Info a="System Time" b="[08:40:12]" />
            </>
          )}
          {aba === 1 && (
            <>
              <Info a="SATA Mode Selection" b="[AHCI]" />
              <Info a="Intel Virtualization Technology" b="[Enabled]" />
              <Info a="Wake on LAN" b="[Disabled]" />
            </>
          )}
          {aba === 2 && (
            <>
              <Info a="Boot Mode" b="[UEFI]" />
              <Info a="Fast Boot" b="[Disabled]" />
              <p className="mt-3 text-[#00007c]">Boot Option Priorities</p>
              {tmp.map((d, i) => (
                <Linha key={d + i} i={i} a={`Boot Option #${i + 1}`} b={`[${NOME_DEV[d].split(" (")[0].replace("UEFI: ", "")}]`} onClick={() => setPopup({ k: "escolher", slot: i, sel: ["ssd", "usb", "pxe"].indexOf(d) })} />
              ))}
            </>
          )}
          {aba === 3 && (
            <>
              <Info a="Secure Boot" b="[Enabled]" />
              <Info a="TPM 2.0 Device" b="[Enabled]" />
              <Info a="Administrator Password" b="[Not Installed]" />
            </>
          )}
          {aba === 4 && (
            <>
              <Linha i={0} a="Save Changes and Exit" onClick={() => setPopup({ k: "confirmar", acao: "salvar", sel: 0 })} />
              <Linha i={1} a="Discard Changes and Exit" onClick={() => setPopup({ k: "confirmar", acao: "descartar", sel: 0 })} />
              <Linha i={2} a="Restore Defaults" onClick={() => setPopup({ k: "confirmar", acao: "padrao", sel: 0 })} />
            </>
          )}
        </div>
        <div className="flex w-[300px] flex-col justify-between p-4 text-[13px] leading-6 text-[#00007c]">
          <p>{ajuda}</p>
          <div className="border-t-2 border-[#8a8a8a] pt-2 text-[12px] leading-5 text-black">
            <p>←→: Select Screen</p>
            <p>↑↓: Select Item</p>
            <p>Enter: Select</p>
            <p>F5/F6: Change Order</p>
            <p>F10: Save &amp; Exit</p>
            <p>ESC: Exit</p>
          </div>
        </div>
      </div>
      {popup && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-[440px] border-2 border-white bg-[#00007c] p-4 text-white shadow-[6px_6px_0_rgba(0,0,0,.4)]">
            {popup.k === "escolher" ? (
              <>
                <p className="mb-2 text-center">Boot Option #{popup.slot + 1}</p>
                {(["ssd", "usb", "pxe"] as Dev[]).map((d, i) => (
                  <button
                    key={d}
                    onClick={() => {
                      mover(tmp.indexOf(d), popup.slot);
                      setPopup(null);
                    }}
                    className={cn("block w-full px-2 text-left text-[13px]", popup.sel === i ? "bg-white text-[#00007c]" : "hover:bg-white/10")}
                  >
                    {NOME_DEV[d]}
                  </button>
                ))}
              </>
            ) : (
              <>
                <p className="text-center">
                  {popup.acao === "salvar" ? "Save configuration and exit?" : popup.acao === "descartar" ? "Quit without saving?" : "Load optimized defaults?"}
                </p>
                <div className="mt-3 flex justify-center gap-8">
                  {["Yes", "No"].map((r, i) => (
                    <button key={r} onClick={() => (i === 0 ? executar(popup.acao) : setPopup(null))} className={cn("px-4", popup.sel === i ? "bg-white text-[#00007c]" : "hover:bg-white/10")}>
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Simulador de instalação: o notebook inteiro
   ============================================================ */

type EstadoSSD = "win10" | "copiado" | "oobe1" | "oobe2" | "win11" | "corrompido";
type Tela =
  | "desligado"
  | "preto"
  | "post"
  | "bootmenu"
  | "bios"
  | "pxe"
  | "semboot"
  | "w10-carregando"
  | "w10-bloqueio"
  | "w10-login"
  | "w11-erro"
  | "setup-carregando"
  | "setup-idioma"
  | "setup-instalar"
  | "reparo"
  | "reparo-avancado"
  | "setup-iniciando"
  | "setup-chave"
  | "setup-edicao"
  | "setup-termos"
  | "setup-tipo"
  | "setup-compat"
  | "setup-disco"
  | "setup-copiando"
  | "setup-reiniciar"
  | "setup-erro-midia"
  | "w11-preparando"
  | "oobe-regiao"
  | "oobe-teclado"
  | "oobe-teclado2"
  | "oobe-rede"
  | "oobe-atualizacoes"
  | "oobe-nome"
  | "oobe-reiniciando"
  | "oobe-uso"
  | "oobe-trabalho"
  | "oobe-conta"
  | "oobe-senha"
  | "oobe-pin"
  | "oobe-privacidade"
  | "oobe-final"
  | "w11-desktop";

type Maq = {
  tela: Tela;
  ordem: Dev[];
  pendrive: boolean;
  ssd: EstadoSSD;
  discos: Disco[];
  pxeResto: Dev[];
  formato: string;
  teclado: string;
  edicao: string | null;
  tentouAtualizacao: boolean;
  aval: AvalDisco | null;
  alvo: { n: number; id: string } | null;
  rede: string | null;
  nome: string | null;
  tecladoOobe: string | null;
  bootsErrados: number;
  loops: number;
  errosMidia: number;
  corrompeu: boolean;
  tentouTrabalho: boolean;
  log: string[];
};

const OS = {
  numero: "2026-118",
  rede: "Souza_Contabil",
  senhaRede: "Souza@2026",
  nomePc: "RECEPCAO-01",
  email: "ana.souza@contabilsouza.example",
};
const TECLADOS = ["Português (Brasil ABNT)", "Português (Brasil ABNT2)", "Estados Unidos (Internacional)", "Estados Unidos", "Português (Portugal)"];
const FORMATOS = ["Português (Brasil)", "Português (Portugal)", "Inglês (Estados Unidos)", "Espanhol (México)"];
const EDICOES = [
  "Windows 11 Home",
  "Windows 11 Home N",
  "Windows 11 Home Single Language",
  "Windows 11 Education",
  "Windows 11 Education N",
  "Windows 11 Pro",
  "Windows 11 Pro N",
  "Windows 11 Pro Education",
  "Windows 11 Pro Education N",
  "Windows 11 Pro for Workstations",
  "Windows 11 Pro N for Workstations",
];
const REDES: { nome: string; protegida: boolean; sinal: number }[] = [
  { nome: "Souza_Contabil", protegida: true, sinal: 4 },
  { nome: "Souza_Contabil_Visitantes", protegida: false, sinal: 4 },
  { nome: "NET_2G_ANDRADE", protegida: true, sinal: 2 },
  { nome: "Wi-Fi Grátis Praça", protegida: false, sinal: 1 },
];
const PAISES = ["Argentina", "Bolívia", "Brasil", "Chile", "Colômbia", "Espanha", "Estados Unidos", "México", "Paraguai", "Portugal", "Uruguai"];

function maqInicial(): Maq {
  return {
    tela: "desligado",
    ordem: ["ssd", "usb", "pxe"],
    pendrive: true,
    ssd: "win10",
    discos: [discoCliente()],
    pxeResto: [],
    formato: FORMATOS[0],
    teclado: TECLADOS[0],
    edicao: null,
    tentouAtualizacao: false,
    aval: null,
    alvo: null,
    rede: null,
    nome: null,
    tecladoOobe: null,
    bootsErrados: 0,
    loops: 0,
    errosMidia: 0,
    corrompeu: false,
    tentouTrabalho: false,
    log: [],
  };
}

function iniciarDisp(x: Maq, d: Dev, resto: Dev[] = []): Partial<Maq> {
  if (d === "pxe") return { tela: "pxe", pxeResto: resto };
  if (d === "usb") {
    const loop = x.ssd !== "win10" && x.ssd !== "corrompido";
    return {
      tela: "setup-carregando",
      loops: x.loops + (loop ? 1 : 0),
      log: loop ? [...x.log, "O notebook iniciou de novo pelo pendrive e a instalação recomeçou do zero."] : x.log,
    };
  }
  switch (x.ssd) {
    case "win10":
      return { tela: "w10-carregando", bootsErrados: x.bootsErrados + 1, log: [...x.log, "O notebook iniciou pelo SSD e abriu o Windows 10 antigo, não o instalador."] };
    case "copiado":
      return { tela: "w11-preparando" };
    case "oobe1":
      return { tela: "oobe-regiao" };
    case "oobe2":
      return { tela: "oobe-uso" };
    case "win11":
      return { tela: "w11-desktop" };
    default:
      return { tela: "w11-erro" };
  }
}
function decidirBoot(x: Maq, lista: Dev[] = x.ordem): Partial<Maq> {
  for (let i = 0; i < lista.length; i++) {
    const d = lista[i];
    if (d === "usb" && !x.pendrive) continue;
    return iniciarDisp(x, d, lista.slice(i + 1));
  }
  return { tela: "semboot" };
}

function OobeTela({
  titulo,
  sub,
  children,
  botoes,
  icone,
}: {
  titulo: string;
  sub?: string;
  children?: React.ReactNode;
  botoes?: React.ReactNode;
  icone?: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: "linear-gradient(135deg,#eef3fb 0%,#dde7f6 55%,#e8eefb 100%)", fontFamily: FONTE_WIN }}>
      <div className="flex h-[500px] w-[880px] overflow-hidden rounded-[8px] bg-white text-[#1b1b1b] shadow-[0_8px_40px_rgba(30,60,120,.18)]">
        <div className="grid w-[330px] place-items-center bg-gradient-to-br from-[#e3edfb] to-[#c9dbf6]">
          <div className="grid h-[150px] w-[150px] place-items-center rounded-full bg-white/70 text-[#005fb8] shadow-inner">{icone ?? <LogoWin11 tam={70} />}</div>
        </div>
        <div className="flex flex-1 flex-col px-10 py-9">
          <p className="text-[26px] font-semibold leading-tight">{titulo}</p>
          {sub && <p className="mt-2 text-[14px] text-[#5a5a5a]">{sub}</p>}
          <div className="mt-5 flex-1 overflow-hidden text-[14px]">{children}</div>
          {botoes && <div className="flex justify-end gap-2">{botoes}</div>}
        </div>
      </div>
    </div>
  );
}
function BtnOobe({ children, onClick, disabled, sec }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; sec?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-[34px] min-w-[120px] rounded-[4px] px-5 text-[14px] transition",
        sec ? "border border-[#d1d1d1] bg-white text-[#1b1b1b] hover:bg-[#f5f5f5]" : "bg-[#005fb8] text-white hover:bg-[#0f6cbd]",
        disabled && "cursor-default opacity-40 hover:bg-[#005fb8]"
      )}
    >
      {children}
    </button>
  );
}
function ListaOobe({ itens, valor, onChange }: { itens: string[]; valor: string | null; onChange: (v: string) => void }) {
  return (
    <div className="h-[230px] overflow-y-auto rounded-[4px] border border-[#e1e1e1]">
      {itens.map((i) => (
        <button key={i} onClick={() => onChange(i)} className={cn("block w-full px-4 py-[7px] text-left", valor === i ? "bg-[#e5f1fb] font-semibold text-[#005fb8]" : "hover:bg-[#f5f5f5]")}>
          {i}
        </button>
      ))}
    </div>
  );
}

function ProgressoCopia({ onFim }: { onFim: () => void }) {
  const ETAPAS = ["Copiando arquivos do Windows", "Preparando arquivos para instalação", "Instalando recursos", "Instalando atualizações", "Concluindo"];
  const [p, setP] = React.useState(0);
  const fim = React.useRef(onFim);
  fim.current = onFim;
  React.useEffect(() => {
    const t = setInterval(() => setP((x) => Math.min(x + 1.6, 500)), 50);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    if (p >= 500) fim.current();
  }, [p]);
  const etapa = Math.min(4, Math.floor(p / 100));
  return (
    <JanelaSetup>
      <TituloSetup>Instalando o Windows</TituloSetup>
      <p className="mb-3">Status</p>
      <ul className="space-y-1.5">
        {ETAPAS.map((e, i) => (
          <li key={e} className={cn("flex items-center gap-2", i > etapa && "text-[#8a8a8a]")}>
            <span className="w-4">{i < etapa ? <Check className="h-4 w-4 text-[#107c10]" /> : i === etapa ? "›" : ""}</span>
            <span className={cn(i === etapa && "font-semibold")}>
              {e}
              {i === etapa && i <= 1 ? ` (${Math.floor(p % 100)}%)` : i === etapa ? "..." : ""}
            </span>
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-12 bottom-6">
        <div className="mb-1 flex justify-between text-[11px] text-[#555]">
          <span>1 Coletando informações</span>
          <span className="font-semibold text-[#1b1b1b]">2 Instalando o Windows</span>
        </div>
        <div className="h-[14px] border border-[#bcbcbc] bg-[#e6e6e6]">
          <div className="h-full bg-[#06b025]" style={{ width: `${20 + (p / 500) * 80}%` }} />
        </div>
      </div>
    </JanelaSetup>
  );
}

function ContagemReinicio({ onFim }: { onFim: () => void }) {
  const [s, setS] = React.useState(10);
  const fim = React.useRef(onFim);
  fim.current = onFim;
  React.useEffect(() => {
    const t = setInterval(() => setS((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    if (s <= 0) fim.current();
  }, [s]);
  return (
    <JanelaSetup rodape={<BtnWin onClick={() => fim.current()}>Reiniciar agora</BtnWin>}>
      <TituloSetup>O Windows precisa ser reiniciado para continuar</TituloSetup>
      <p>Reiniciando em {Math.max(s, 0)} segundos</p>
      <div className="mt-3 h-[14px] w-[360px] border border-[#bcbcbc] bg-[#e6e6e6]">
        <div className="h-full bg-[#06b025]" style={{ width: `${(10 - s) * 10}%` }} />
      </div>
    </JanelaSetup>
  );
}

function Preparando({ onFim }: { onFim: () => void }) {
  const [p, setP] = React.useState(0);
  const fim = React.useRef(onFim);
  fim.current = onFim;
  React.useEffect(() => {
    const t = setInterval(() => setP((x) => x + 2), 80);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    if (p >= 130) fim.current();
  }, [p]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-black text-white" style={{ fontFamily: FONTE_WIN }}>
      <LogoWin11 tam={90} />
      <Bolinhas />
      <p className="text-[18px]">{p < 100 ? `Preparando dispositivos ${p}%` : "Preparando"}</p>
    </div>
  );
}

type ItemRel = { ok: boolean | "aviso"; titulo: string; texto: string };

function relatorioInstalacao(m: Maq): ItemRel[] {
  const a = m.aval;
  const itens: ItemRel[] = [];
  itens.push(
    m.bootsErrados === 0
      ? { ok: true, titulo: "Boot pelo pendrive", texto: "O notebook iniciou pelo instalador sem abrir o Windows antigo." }
      : { ok: "aviso", titulo: "Boot pelo pendrive", texto: `O Windows 10 antigo abriu ${m.bootsErrados} ${m.bootsErrados === 1 ? "vez" : "vezes"}. Use o menu de boot (F12) logo ao ligar.` }
  );
  const abnt2 = m.teclado.includes("ABNT2") && (m.tecladoOobe ?? m.teclado).includes("ABNT2");
  itens.push(
    abnt2
      ? { ok: true, titulo: "Teclado ABNT2", texto: "O Ç, os acentos e a tecla /? vão funcionar no notebook da cliente." }
      : { ok: false, titulo: "Teclado ABNT2", texto: `Ficou "${m.tecladoOobe ?? m.teclado}". O notebook é ABNT2: com outro layout, teclas como Ç, acentos e a barra saem trocadas.` }
  );
  itens.push(
    m.edicao === "Windows 11 Pro"
      ? { ok: true, titulo: "Edição certa", texto: "Windows 11 Pro, a mesma da licença digital. Ativou sozinho com a internet." }
      : { ok: false, titulo: "Edição certa", texto: `Foi instalado o ${m.edicao ?? "?"}. A licença é do Pro, então o Windows não ativa e mostra a marca d'água "Ativar o Windows".` }
  );
  if (m.tentouAtualizacao) itens.push({ ok: "aviso", titulo: "Tipo de instalação", texto: "Tentou a Atualização. Quem inicia pelo pendrive faz a Personalizada, que é a instalação limpa." });
  if (a) {
    const limpo = !a.windowsOld && !a.emDados && a.sobras.length === 0;
    itens.push(
      limpo
        ? { ok: true, titulo: "Disco limpo", texto: `O Windows ficou numa partição de ${fmtMB(a.alvoMB)}, sem restos do sistema antigo.` }
        : {
            ok: false,
            titulo: "Disco limpo",
            texto: [
              a.windowsOld ? "Instalou por cima do Windows antigo: ficou a pasta Windows.old ocupando espaço." : "",
              a.emDados ? "Instalou dentro da partição de dados antiga, sem formatar." : "",
              a.sobras.length ? `Sobraram partições antigas: ${a.sobras.join(", ")}.` : "",
            ]
              .filter(Boolean)
              .join(" "),
          }
    );
    if (a.recAntiga) itens.push({ ok: "aviso", titulo: "Partição de recuperação antiga", texto: "A recuperação do Windows 10 ficou no disco. Ela ocupa espaço e atrapalha aumentar o C: depois. O Windows 11 cria a dele." });
  }
  itens.push(
    m.loops === 0 && m.errosMidia === 0 && !m.corrompeu
      ? { ok: true, titulo: "Instalação sem interrupções", texto: "Nada de pendrive arrancado, desligamento no meio ou instalação recomeçando." }
      : {
          ok: "aviso",
          titulo: "Instalação sem interrupções",
          texto: [
            m.loops ? `A instalação recomeçou do zero ${m.loops} ${m.loops === 1 ? "vez" : "vezes"}: o pendrive estava antes do SSD na ordem de boot. Depois da cópia, tire o pendrive ou deixe o SSD em primeiro.` : "",
            m.errosMidia ? "O pendrive foi tirado com o instalador aberto." : "",
            m.corrompeu ? "O notebook foi desligado durante a cópia e o Windows ficou corrompido." : "",
          ]
            .filter(Boolean)
            .join(" "),
        }
  );
  itens.push(
    m.rede === OS.rede
      ? { ok: true, titulo: "Rede do escritório", texto: `Conectado à ${OS.rede}, a rede protegida da cliente.` }
      : { ok: false, titulo: "Rede do escritório", texto: `Conectou na rede "${m.rede ?? "nenhuma"}". O computador da recepção deve usar a ${OS.rede}.` }
  );
  itens.push(
    (m.nome ?? "").toUpperCase() === OS.nomePc
      ? { ok: true, titulo: "Nome do computador", texto: `${OS.nomePc}, como pedido na ordem de serviço.` }
      : { ok: false, titulo: "Nome do computador", texto: `Ficou "${m.nome ?? "nome automático"}". A ordem de serviço pedia ${OS.nomePc}.` }
  );
  if (m.tentouTrabalho) itens.push({ ok: "aviso", titulo: "Tipo de configuração", texto: "Tentou configurar para trabalho ou escola. O escritório não tem conta corporativa: o certo é uso pessoal com a conta Microsoft da Ana." });
  return itens;
}

function Relatorio({ itens, onDeNovo }: { itens: ItemRel[]; onDeNovo: () => void }) {
  const falhas = itens.filter((i) => i.ok === false).length;
  return (
    <div className="mt-5 rounded-2xl border border-foreground/10 bg-white/60 p-5 dark:bg-white/5">
      <p className="text-lg font-bold">{falhas === 0 ? "Serviço entregue. Relatório do técnico" : `Relatório do técnico: ${falhas} ${falhas === 1 ? "ponto precisa" : "pontos precisam"} de correção`}</p>
      <ul className="mt-3 space-y-2">
        {itens.map((i) => (
          <li key={i.titulo} className={cn("flex gap-3 rounded-xl border p-3 text-sm", i.ok === true ? "border-emerald-500/50 bg-emerald-500/5" : i.ok === "aviso" ? "border-amber-500/60 bg-amber-500/5" : "border-red-500/60 bg-red-500/5")}>
            {i.ok === true ? <Check className="h-5 w-5 shrink-0 text-emerald-600" /> : i.ok === "aviso" ? <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" /> : <X className="h-5 w-5 shrink-0 text-red-600" />}
            <span>
              <span className="font-semibold">{i.titulo}.</span> {i.texto}
            </span>
          </li>
        ))}
      </ul>
      <button onClick={onDeNovo} className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 bg-white/70 px-3 py-2 text-sm font-medium hover:bg-white dark:bg-white/10">
        <RotateCcw className="h-4 w-4" /> fazer o serviço de novo
      </button>
    </div>
  );
}

function OrdemServico({ children, titulo }: { children: React.ReactNode; titulo: string }) {
  return (
    <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-50/80 p-4 text-sm text-[#3d2f00] dark:bg-amber-500/10 dark:text-amber-100">
      <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">{titulo}</p>
      {children}
    </div>
  );
}

export function SimInstalacao() {
  const [m, setM] = React.useState<Maq>(maqInicial);
  const mRef = React.useRef(m);
  mRef.current = m;
  const filho: RegTeclas = React.useRef(null);
  const registrado = React.useRef(false);
  const up = React.useCallback((f: (x: Maq) => Partial<Maq>) => setM((x) => ({ ...x, ...f(x) })), []);
  const anotar = (txt: string) => up((x) => ({ log: [...x.log, txt] }));

  React.useEffect(() => {
    const at = (ms: number, f: (x: Maq) => Partial<Maq>) => {
      const id = setTimeout(() => up(f), ms);
      return () => clearTimeout(id);
    };
    switch (m.tela) {
      case "preto":
        return at(800, () => ({ tela: "post" }));
      case "post":
        return at(6000, (x) => decidirBoot(x));
      case "pxe":
        return at(3600, (x) => decidirBoot(x, x.pxeResto));
      case "w10-carregando":
        return at(2600, () => ({ tela: "w10-bloqueio" }));
      case "setup-carregando":
        return at(2600, () => ({ tela: "setup-idioma" }));
      case "setup-iniciando":
        return at(1800, () => ({ tela: "setup-chave" }));
      case "oobe-atualizacoes":
        return at(2800, () => ({ tela: "oobe-nome" }));
      case "oobe-reiniciando":
        return at(2600, () => ({ tela: "preto", ssd: "oobe2" }));
      case "oobe-final":
        return at(3400, () => ({ tela: "w11-desktop", ssd: "win11" }));
    }
  }, [m.tela, up]);

  React.useEffect(() => {
    if (m.tela !== "w11-desktop" || registrado.current) return;
    registrado.current = true;
    relatorioInstalacao(m).forEach((i) =>
      recordAnswer({ app: "info", category: "uc2a2-sim-instalacao", correct: i.ok !== false, timeMs: 0, points: i.ok === true ? 10 : 0 })
    );
  }, [m]);

  function power() {
    up((x) => {
      if (x.tela === "desligado") return { tela: "post" };
      if (x.tela === "setup-copiando")
        return { tela: "desligado", ssd: "corrompido", corrompeu: true, log: [...x.log, "O notebook foi desligado no meio da cópia dos arquivos. O Windows ficou pela metade no SSD."] };
      return { tela: "desligado", log: [...x.log, "O notebook foi desligado pelo botão."] };
    });
  }
  function pendrive() {
    up((x) => {
      if (!x.pendrive) return { pendrive: true, log: [...x.log, "Pendrive conectado."] };
      const emSetup = x.tela.startsWith("setup-") && x.tela !== "setup-reiniciar" && x.tela !== "setup-erro-midia";
      if (emSetup)
        return {
          pendrive: false,
          tela: "setup-erro-midia",
          errosMidia: x.errosMidia + 1,
          ssd: x.tela === "setup-copiando" ? "corrompido" : x.ssd,
          corrompeu: x.corrompeu || x.tela === "setup-copiando",
          log: [...x.log, "O pendrive foi tirado com o instalador aberto."],
        };
      return { pendrive: false, log: [...x.log, "Pendrive removido."] };
    });
  }
  const reboot = () => up(() => ({ tela: "preto" }));

  function tecla(t: Tecla): boolean {
    if (filho.current && filho.current(t)) return true;
    const x = mRef.current;
    if (x.tela === "post") {
      if (t === "F12") up(() => ({ tela: "bootmenu" }));
      else if (t === "F2") up(() => ({ tela: "bios" }));
      else return false;
      return true;
    }
    if (x.tela === "w11-erro") {
      if (t === "Enter") reboot();
      else if (t === "Esc") up(() => ({ tela: "bios" }));
      else return false;
      return true;
    }
    if (x.tela === "semboot" && t === "Enter") {
      reboot();
      return true;
    }
    if (x.tela === "w10-bloqueio" && t === "Enter") {
      up(() => ({ tela: "w10-login" }));
      return true;
    }
    return false;
  }

  function reiniciarTudo() {
    registrado.current = false;
    setM(maqInicial());
  }

  const tela = renderTela();

  function renderTela(): React.ReactNode {
    const x = m;
    switch (x.tela) {
      case "desligado":
        return (
          <div className="absolute inset-0 grid place-items-center bg-black">
            <p className="text-[13px] text-slate-600" style={{ fontFamily: FONTE_WIN }}>
              Notebook desligado. Aperte o botão liga/desliga abaixo da tela.
            </p>
          </div>
        );
      case "preto":
        return <div className="absolute inset-0 bg-black" />;
      case "post":
        return <TelaPost />;
      case "bootmenu":
        return (
          <TelaBootMenu
            reg={filho}
            pendrive={x.pendrive}
            onBoot={(d) => up((y) => iniciarDisp(y, d, y.ordem.filter((o) => o !== d)))}
            onBios={() => up(() => ({ tela: "bios" }))}
            onSair={() => up((y) => decidirBoot(y))}
          />
        );
      case "bios":
        return (
          <TelaBios
            reg={filho}
            ordem={x.ordem}
            onSair={(nova) =>
              up((y) => ({
                tela: "preto",
                ordem: nova ?? y.ordem,
                log: nova && nova.join() !== y.ordem.join() ? [...y.log, `Ordem de boot salva: 1º ${NOME_DEV[nova[0]].split(" (")[0]}.`] : y.log,
              }))
            }
          />
        );
      case "pxe":
        return <TelaPxe />;
      case "semboot":
        return (
          <div className="absolute inset-0 bg-black p-8 text-[15px] text-[#c0c0c0]" style={{ fontFamily: FONTE_BIOS }}>
            No bootable device found. Press Enter to restart.
          </div>
        );
      case "w10-carregando":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-24 bg-black">
            <LogoWin10 tam={110} />
            <Bolinhas />
          </div>
        );
      case "w10-bloqueio":
        return (
          <button
            onClick={() => up(() => ({ tela: "w10-login" }))}
            className="absolute inset-0 text-left text-white"
            style={{ background: "linear-gradient(160deg,#2c4f7c 0%,#5d7fa8 40%,#c99a6b 75%,#3b3a52 100%)", fontFamily: FONTE_WIN }}
          >
            <span className="absolute bottom-24 left-12">
              <span className="block text-[92px] font-extralight leading-none">08:41</span>
              <span className="mt-2 block text-[30px] font-light">sábado, 14 de novembro</span>
            </span>
          </button>
        );
      case "w10-login":
        return <TelaW10Login onReiniciar={reboot} onDesligar={() => up(() => ({ tela: "desligado" }))} />;
      case "w11-erro":
        return (
          <div className="absolute inset-0 bg-[#0078d7] p-16 text-white" style={{ fontFamily: FONTE_WIN }}>
            <p className="text-[34px] font-light">Recuperação</p>
            <p className="mt-3 text-[17px]">Seu computador precisa ser reparado</p>
            <p className="mt-6 max-w-[700px] text-[14px] leading-relaxed">
              Não foi possível carregar o sistema operacional porque um arquivo necessário está ausente ou contém erros.
              <br />
              Arquivo: \Windows\system32\winload.efi
              <br />
              Código de erro: 0xc000000f
            </p>
            <p className="mt-6 text-[14px]">Será necessário usar a mídia de instalação para reinstalar o Windows.</p>
            <p className="absolute bottom-12 left-16 text-[14px]">Pressione Enter para tentar novamente · Esc para as configurações de firmware UEFI</p>
          </div>
        );
      case "setup-carregando":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-24 bg-black">
            <LogoWin11 tam={100} />
            <Bolinhas />
          </div>
        );
      case "setup-idioma":
        return (
          <JanelaSetup rodape={<BtnWin primario onClick={() => up((y) => ({ tela: "setup-instalar", log: [...y.log, `Instalador: teclado "${y.teclado}".`] }))}>Avançar</BtnWin>}>
            <div className="mb-6 mt-4 flex items-center justify-center gap-4">
              <LogoWin11 tam={46} />
              <span className="text-[30px] font-light text-[#1f3fa0]">Windows 11</span>
            </div>
            <div className="mx-auto grid w-[520px] grid-cols-[230px_1fr] items-center gap-x-3 gap-y-4">
              <span className="text-right">
                Idioma a <u>i</u>nstalar:
              </span>
              <select className={SELECT_WIN} defaultValue="pt">
                <option value="pt">Português (Brasil)</option>
              </select>
              <span className="text-right">
                <u>F</u>ormato de hora e moeda:
              </span>
              <select className={SELECT_WIN} value={x.formato} onChange={(e) => up(() => ({ formato: e.target.value }))}>
                {FORMATOS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              <span className="text-right">
                <u>T</u>eclado ou método de entrada:
              </span>
              <select className={SELECT_WIN} value={x.teclado} onChange={(e) => up(() => ({ teclado: e.target.value }))}>
                {TECLADOS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <p className="mt-8 text-center text-[12px] text-[#444]">Insira seu idioma e outras preferências e clique em &quot;Avançar&quot; para continuar.</p>
          </JanelaSetup>
        );
      case "setup-instalar":
        return (
          <JanelaSetup>
            <div className="mt-6 flex items-center justify-center gap-4">
              <LogoWin11 tam={52} />
              <span className="text-[34px] font-light text-[#1f3fa0]">Windows 11</span>
            </div>
            <div className="mt-16 flex justify-center">
              <button onClick={() => up(() => ({ tela: "setup-iniciando" }))} className="h-[46px] min-w-[200px] border border-[#0078d7] bg-[#e1e1e1] text-[18px] hover:bg-[#e5f1fb]">
                Instalar agora
              </button>
            </div>
            <button
              onClick={() => up((y) => ({ tela: "reparo", log: [...y.log, "Abriu Reparar o computador em vez de Instalar agora."] }))}
              className="absolute bottom-4 left-6 text-[12px] text-[#0066cc] hover:underline"
            >
              Reparar o computador
            </button>
          </JanelaSetup>
        );
      case "reparo":
      case "reparo-avancado":
        return (
          <TelaReparo
            avancado={x.tela === "reparo-avancado"}
            onContinuar={() => up((y) => decidirBoot(y))}
            onAvancado={() => up(() => ({ tela: "reparo-avancado" }))}
            onVoltar={() => up((y) => ({ tela: y.tela === "reparo-avancado" ? "reparo" : "setup-instalar" }))}
            onUefi={() => up(() => ({ tela: "bios" }))}
            onDesligar={() => up(() => ({ tela: "desligado" }))}
          />
        );
      case "setup-iniciando":
        return (
          <JanelaSetup>
            <div className="mt-6 flex items-center justify-center gap-4">
              <LogoWin11 tam={52} />
              <span className="text-[34px] font-light text-[#1f3fa0]">Windows 11</span>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4 text-[16px] text-[#1f3fa0]">
              <Bolinhas cor="#1f3fa0" tam={36} />A instalação está sendo iniciada
            </div>
          </JanelaSetup>
        );
      case "setup-chave":
        return <TelaChave onVoltar={() => up(() => ({ tela: "setup-instalar" }))} onSemChave={() => up(() => ({ tela: "setup-edicao" }))} onErro={() => anotar("Digitou uma chave do produto que não funcionou.")} />;
      case "setup-edicao":
        return (
          <TelaEdicao
            onVoltar={() => up(() => ({ tela: "setup-chave" }))}
            onAvancar={(ed) => up((y) => ({ tela: "setup-termos", edicao: ed, log: [...y.log, `Escolheu a edição ${ed}.`] }))}
          />
        );
      case "setup-termos":
        return <TelaTermos onVoltar={() => up(() => ({ tela: "setup-edicao" }))} onAvancar={() => up(() => ({ tela: "setup-tipo" }))} />;
      case "setup-tipo":
        return (
          <JanelaSetup voltar={() => up(() => ({ tela: "setup-termos" }))}>
            <TituloSetup>Que tipo de instalação você deseja?</TituloSetup>
            <button
              onClick={() => up((y) => ({ tela: "setup-compat", tentouAtualizacao: true, log: [...y.log, "Escolheu Atualização."] }))}
              className="block w-full p-3 text-left hover:bg-[#e5f1fb]"
            >
              <span className="block text-[15px] text-[#1f3fa0]">
                <b>Atualização:</b> instalar o Windows e manter arquivos, configurações e aplicativos
              </span>
              <span className="mt-1 block text-[12px] text-[#444]">Os arquivos, as configurações e os aplicativos são movidos para o Windows com esta opção. Essa opção só fica disponível quando uma versão compatível do Windows já está em execução no computador.</span>
            </button>
            <button onClick={() => up((y) => ({ tela: "setup-disco", log: [...y.log, "Escolheu Personalizada."] }))} className="mt-3 block w-full p-3 text-left hover:bg-[#e5f1fb]">
              <span className="block text-[15px] text-[#1f3fa0]">
                <b>Personalizada:</b> instalar apenas o Windows (avançado)
              </span>
              <span className="mt-1 block text-[12px] text-[#444]">Os arquivos, as configurações e os aplicativos não são movidos para o Windows com esta opção. Se você quiser alterar partições e unidades, inicie o computador usando o disco de instalação.</span>
            </button>
          </JanelaSetup>
        );
      case "setup-compat":
        return (
          <JanelaSetup voltar={() => up(() => ({ tela: "setup-tipo" }))} rodape={<BtnWin primario onClick={() => up(() => ({ tela: "setup-tipo" }))}>Fechar</BtnWin>}>
            <TituloSetup>Relatório de compatibilidade</TituloSetup>
            <div className="h-[260px] overflow-y-auto border border-[#828790] p-3 leading-relaxed">
              <p className="font-semibold">A opção de atualização não está disponível se você iniciar o computador usando a mídia de instalação do Windows.</p>
              <p className="mt-2">Se o Windows já estiver instalado, remova a mídia de instalação, reinicie o computador e inicie a atualização a partir do Windows.</p>
              <p className="mt-2">Para fazer uma instalação limpa, volte e selecione Personalizada.</p>
            </div>
          </JanelaSetup>
        );
      case "setup-disco":
        return (
          <TelaDisco
            discos={x.discos}
            setDiscos={(f) => up((y) => ({ discos: f(y.discos) }))}
            onVoltar={() => up(() => ({ tela: "setup-tipo" }))}
            onEvento={anotar}
            onAvancar={(n, id) => {
              const r = avaliar(x.discos, n, id);
              up((y) => ({ tela: "setup-copiando", discos: r.ds, aval: r.aval, alvo: { n, id: r.alvoId }, log: [...y.log, `Começou a instalar em uma partição de ${fmtMB(r.aval.alvoMB)}.`] }));
            }}
          />
        );
      case "setup-copiando":
        return (
          <ProgressoCopia
            onFim={() =>
              up((y) => ({
                tela: "setup-reiniciar",
                ssd: "copiado",
                discos: y.alvo
                  ? mudaDisco(y.discos, y.alvo.n, (d) => ({ ...d, parts: d.parts.map((p) => (p.id === y.alvo!.id ? { ...p, windowsAntigo: true, dados: true, rotulo: undefined, livreMB: Math.round(p.tamMB * 0.88) } : p)) }))
                  : y.discos,
              }))
            }
          />
        );
      case "setup-reiniciar":
        return <ContagemReinicio onFim={reboot} />;
      case "setup-erro-midia":
        return (
          <JanelaSetup rodape={<BtnWin primario onClick={reboot}>OK</BtnWin>}>
            <div className="mt-6 flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#c42b1c] text-[18px] font-bold text-white">✕</span>
              <div className="leading-relaxed">
                <p>O Windows não pode instalar os arquivos necessários. Verifique se todos os arquivos necessários para a instalação estão disponíveis e reinicie a instalação.</p>
                <p className="mt-2">Código de erro: 0x8007025D</p>
              </div>
            </div>
          </JanelaSetup>
        );
      case "w11-preparando":
        return <Preparando onFim={() => up(() => ({ tela: "oobe-regiao", ssd: "oobe1" }))} />;
      case "oobe-regiao":
        return <OobeRegiao onSim={() => up(() => ({ tela: "oobe-teclado" }))} />;
      case "oobe-teclado":
        return (
          <OobeTeclado
            inicial={x.teclado}
            onSim={(k) => up((y) => ({ tela: "oobe-teclado2", tecladoOobe: k, log: [...y.log, `Primeiro uso: teclado "${k}".`] }))}
          />
        );
      case "oobe-teclado2":
        return (
          <OobeTela
            titulo="Deseja adicionar um segundo layout de teclado?"
            botoes={
              <>
                <BtnOobe sec onClick={() => up(() => ({ tela: "oobe-rede" }))}>
                  Adicionar layout
                </BtnOobe>
                <BtnOobe onClick={() => up(() => ({ tela: "oobe-rede" }))}>Ignorar</BtnOobe>
              </>
            }
          />
        );
      case "oobe-rede":
        return <OobeRede onConectado={(r) => up((y) => ({ tela: "oobe-atualizacoes", rede: r, log: [...y.log, `Conectou na rede ${r}.`] }))} onEvento={anotar} />;
      case "oobe-atualizacoes":
        return (
          <OobeTela titulo="Verificando se há atualizações." sub="Isso pode levar alguns minutos.">
            <div className="mt-10 flex justify-center">
              <Bolinhas cor="#005fb8" />
            </div>
          </OobeTela>
        );
      case "oobe-nome":
        return <OobeNome onAvancar={(n) => up((y) => ({ tela: "oobe-reiniciando", nome: n, log: [...y.log, n ? `Nome do computador: ${n}.` : "Pulou o nome do computador."] }))} />;
      case "oobe-reiniciando":
        return (
          <OobeTela titulo="Este dispositivo será reiniciado em breve" sub="Seu dispositivo vai reiniciar para aplicar o novo nome.">
            <div className="mt-10 flex justify-center">
              <Bolinhas cor="#005fb8" />
            </div>
          </OobeTela>
        );
      case "oobe-uso":
        return (
          <OobeTela titulo="Como você gostaria de configurar este dispositivo?">
            <div className="space-y-3">
              <button onClick={() => up(() => ({ tela: "oobe-conta" }))} className="block w-full rounded-[6px] border border-[#e1e1e1] p-4 text-left hover:border-[#005fb8] hover:bg-[#f5f9ff]">
                <span className="block font-semibold">Configurar para uso pessoal</span>
                <span className="text-[13px] text-[#5a5a5a]">Entraremos com uma conta da Microsoft e você terá controle total sobre este dispositivo.</span>
              </button>
              <button
                onClick={() => up((y) => ({ tela: "oobe-trabalho", tentouTrabalho: true, log: [...y.log, "Escolheu configurar para trabalho ou escola."] }))}
                className="block w-full rounded-[6px] border border-[#e1e1e1] p-4 text-left hover:border-[#005fb8] hover:bg-[#f5f9ff]"
              >
                <span className="block font-semibold">Configurar para trabalho ou escola</span>
                <span className="text-[13px] text-[#5a5a5a]">Você terá acesso aos recursos da organização, como email, rede, aplicativos e serviços. A organização terá controle total sobre este dispositivo.</span>
              </button>
            </div>
          </OobeTela>
        );
      case "oobe-trabalho":
        return <OobeTrabalho onVoltar={() => up(() => ({ tela: "oobe-uso" }))} />;
      case "oobe-conta":
        return <OobeConta onAvancar={() => up(() => ({ tela: "oobe-senha" }))} />;
      case "oobe-senha":
        return <OobeCliente titulo="Digite a senha" acao="Chamar a Ana para digitar a senha" campo="Senha" onPronto={() => up((y) => ({ tela: "oobe-pin", log: [...y.log, "A Ana digitou a senha da conta."] }))} />;
      case "oobe-pin":
        return <OobeCliente titulo="Criar um PIN" sub="Um PIN é um jeito rápido e seguro de entrar neste dispositivo." acao="Chamar a Ana para criar o PIN" campo="Novo PIN" onPronto={() => up((y) => ({ tela: "oobe-privacidade", log: [...y.log, "A Ana criou o PIN."] }))} />;
      case "oobe-privacidade":
        return <OobePrivacidade onAceitar={() => up(() => ({ tela: "oobe-final" }))} />;
      case "oobe-final":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#0a1a3a] text-white" style={{ fontFamily: FONTE_WIN }}>
            <p className="text-[34px] font-light">Aguarde...</p>
            <Bolinhas />
            <p className="text-[15px] text-slate-300">Não desligue o computador.</p>
          </div>
        );
      case "w11-desktop":
        return <TelaDesktop ativado={x.edicao === "Windows 11 Pro"} rede={x.rede} />;
    }
  }

  return (
    <div>
      <OrdemServico titulo={`Ordem de serviço nº ${OS.numero}`}>
        <p>
          <b>Cliente:</b> Ana Souza, Souza Contabilidade (Xanxerê). <b>Equipamento:</b> notebook Lumen L14 da recepção, SSD de 256 GB, teclado ABNT2 (tem a tecla Ç e a tecla /? ao lado do Shift direito).
        </p>
        <p className="mt-1">
          <b>Situação:</b> Windows 10 lento. O backup dos arquivos já foi feito no HD externo, conferido e desconectado. Licença digital do <b>Windows 11 Pro</b>. O pendrive de instalação já está criado e conectado.
        </p>
        <p className="mt-1">
          <b>Pedido:</b> instalação limpa do Windows 11 Pro, sem restos do sistema antigo.
        </p>
        <p className="mt-1">
          <b>Dados:</b> Wi-Fi <span className="font-mono">{OS.rede}</span>, senha <span className="font-mono">{OS.senhaRede}</span>. Nome do computador <span className="font-mono">{OS.nomePc}</span>. Conta Microsoft da cliente <span className="font-mono">{OS.email}</span> (senha e PIN: a própria cliente digita). Neste notebook, <b>F12</b> abre o menu de boot e <b>F2</b> a configuração da UEFI, logo ao ligar.
        </p>
      </OrdemServico>
      <Monitor onTecla={tecla} controles={{ ligado: m.tela !== "desligado", onPower: power, pendrive: m.pendrive, onPendrive: pendrive }}>
        <React.Fragment key={m.tela}>{tela}</React.Fragment>
      </Monitor>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <details className="min-w-0 flex-1 rounded-xl border border-foreground/10 bg-white/40 p-3 text-sm dark:bg-white/5">
          <summary className="cursor-pointer font-semibold">O que aconteceu até agora ({m.log.length})</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
            {m.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </details>
        <button onClick={reiniciarTudo} className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 bg-white/70 px-3 py-2 text-sm font-medium hover:bg-white dark:bg-white/10">
          <RotateCcw className="h-4 w-4" /> recomeçar do zero
        </button>
      </div>
      {m.tela === "w11-desktop" && <Relatorio itens={relatorioInstalacao(m)} onDeNovo={reiniciarTudo} />}
    </div>
  );
}

/* ---------- Telas auxiliares do simulador de instalação ---------- */

function TelaW10Login({ onReiniciar, onDesligar }: { onReiniciar: () => void; onDesligar: () => void }) {
  const [menu, setMenu] = React.useState(false);
  return (
    <div className="absolute inset-0 text-white" style={{ background: "linear-gradient(160deg,#1f3a5c 0%,#3f5f86 45%,#6a5a64 100%)", fontFamily: FONTE_WIN }}>
      <div className="absolute inset-x-0 top-[22%] flex flex-col items-center">
        <div className="grid h-[150px] w-[150px] place-items-center rounded-full bg-white/25 text-[64px] font-light">A</div>
        <p className="mt-5 text-[32px] font-light">Ana Souza</p>
        <input disabled placeholder="Senha" className="mt-6 h-[34px] w-[290px] border-2 border-white/60 bg-white/80 px-2 text-[14px] text-black placeholder:text-[#555]" />
        <p className="mt-6 max-w-[460px] text-center text-[13px] text-white/80">Este é o Windows 10 antigo do SSD. O instalador não abriu.</p>
      </div>
      <div className="absolute bottom-8 right-10">
        <button onClick={() => setMenu((v) => !v)} aria-label="Ligar/desligar" className="grid h-10 w-10 place-items-center rounded hover:bg-white/15">
          <Power className="h-6 w-6" />
        </button>
        {menu && (
          <div className="absolute bottom-12 right-0 w-[180px] bg-[#2b2b2b] py-1 text-[14px] shadow-xl">
            <button className="block w-full px-4 py-2 text-left hover:bg-white/10" onClick={onDesligar}>
              Desligar
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-white/10" onClick={onReiniciar}>
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TelaReparo({
  avancado,
  onContinuar,
  onAvancado,
  onVoltar,
  onUefi,
  onDesligar,
}: {
  avancado: boolean;
  onContinuar: () => void;
  onAvancado: () => void;
  onVoltar: () => void;
  onUefi: () => void;
  onDesligar: () => void;
}) {
  const [nota, setNota] = React.useState<string | null>(null);
  const Bloco = ({ t, s, on }: { t: string; s: string; on: () => void }) => (
    <button onClick={on} className="flex w-[300px] items-start gap-3 p-3 text-left hover:bg-white/15">
      <span className="mt-1 h-8 w-8 shrink-0 rounded bg-white/20" />
      <span>
        <span className="block text-[17px]">{t}</span>
        <span className="block text-[13px] text-white/80">{s}</span>
      </span>
    </button>
  );
  return (
    <div className="absolute inset-0 bg-[#0067b8] p-14 text-white" style={{ fontFamily: FONTE_WIN }}>
      <button onClick={onVoltar} className="mb-2 flex items-center gap-3 text-[30px] font-light hover:opacity-80">
        ← {avancado ? "Opções avançadas" : "Escolha uma opção"}
      </button>
      {!avancado ? (
        <div className="mt-8 space-y-2">
          <Bloco t="Continuar" s="Sair e continuar com o Windows 10" on={onContinuar} />
          <Bloco t="Solução de problemas" s="Redefinir o computador ou ver opções avançadas" on={onAvancado} />
          <Bloco t="Desligar o computador" s="" on={onDesligar} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-2">
          {[
            ["Reparo de Inicialização", "Corrigir problemas que impedem o Windows de carregar"],
            ["Prompt de Comando", "Usar o Prompt de Comando para solução de problemas avançada"],
            ["Desinstalar Atualizações", "Remover atualizações de qualidade ou de recursos"],
            ["Restauração do Sistema", "Usar um ponto de restauração registrado no computador"],
          ].map(([t, s]) => (
            <Bloco key={t} t={t} s={s} on={() => setNota("Essas ferramentas consertam um Windows que já existe. Para instalar do zero, volte e escolha Instalar agora.")} />
          ))}
          <Bloco t="Configurações de Firmware UEFI" s="Alterar configurações do firmware UEFI do computador" on={onUefi} />
        </div>
      )}
      {nota && <p className="mt-6 max-w-[620px] bg-black/25 p-3 text-[14px]">{nota}</p>}
    </div>
  );
}

function TelaChave({ onVoltar, onSemChave, onErro }: { onVoltar: () => void; onSemChave: () => void; onErro: () => void }) {
  const [chave, setChave] = React.useState("");
  const [erro, setErro] = React.useState(false);
  return (
    <JanelaSetup
      voltar={onVoltar}
      rodape={
        <>
          <button onClick={onSemChave} className="mr-auto pl-6 text-[12px] text-[#0066cc] hover:underline">
            Não tenho a chave do produto
          </button>
          <BtnWin
            primario
            disabled={chave.trim().length < 5}
            onClick={() => {
              setErro(true);
              onErro();
            }}
          >
            Avançar
          </BtnWin>
        </>
      }
    >
      <TituloSetup>Ativar o Windows</TituloSetup>
      <p className="leading-relaxed">
        Se esta for a primeira vez que você instala o Windows neste computador (ou se estiver instalando uma edição diferente), insira uma chave do produto válida. A chave do produto deve estar no email de confirmação que você recebeu depois de comprar uma cópia digital do Windows ou em uma etiqueta dentro da caixa.
      </p>
      <p className="mt-3 leading-relaxed">Se você estiver reinstalando o Windows, selecione Não tenho a chave do produto. A cópia do Windows será ativada automaticamente mais tarde.</p>
      <input
        value={chave}
        onChange={(e) => {
          setChave(e.target.value.toUpperCase());
          setErro(false);
        }}
        placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
        className={cn(INPUT_WIN, "mt-5 w-[330px] font-mono")}
        aria-label="Chave do produto"
      />
      {erro && <p className="mt-2 text-[#c42b1c]">A chave do produto não parece estar funcionando. Verifique-a e tente novamente ou tente uma chave diferente.</p>}
    </JanelaSetup>
  );
}

function TelaEdicao({ onVoltar, onAvancar }: { onVoltar: () => void; onAvancar: (ed: string) => void }) {
  const [sel, setSel] = React.useState(0);
  return (
    <JanelaSetup voltar={onVoltar} rodape={<BtnWin primario onClick={() => onAvancar(EDICOES[sel])}>Avançar</BtnWin>}>
      <TituloSetup>Selecione o sistema operacional que você deseja instalar</TituloSetup>
      <div className="h-[260px] overflow-y-auto border border-[#828790]">
        <table className="w-full text-left text-[12px]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[#e5e5e5] text-[#4d4d4d]">
              <th className="py-1 pl-2 font-normal">Sistema operacional</th>
              <th className="py-1 font-normal">Arquitetura</th>
              <th className="py-1 font-normal">Data de modificação</th>
            </tr>
          </thead>
          <tbody>
            {EDICOES.map((e, i) => (
              <tr key={e} onClick={() => setSel(i)} className={cn("cursor-default border border-transparent", sel === i ? "border-[#99d1ff] bg-[#cce8ff]" : "hover:bg-[#e5f3ff]")}>
                <td className="py-[3px] pl-2">{e}</td>
                <td>x64</td>
                <td>05/11/2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-[#444]">Descrição: {EDICOES[sel]}</p>
    </JanelaSetup>
  );
}

function TelaTermos({ onVoltar, onAvancar }: { onVoltar: () => void; onAvancar: () => void }) {
  const [ok, setOk] = React.useState(false);
  return (
    <JanelaSetup
      voltar={onVoltar}
      rodape={
        <BtnWin primario disabled={!ok} onClick={onAvancar}>
          Avançar
        </BtnWin>
      }
    >
      <TituloSetup>Avisos aplicáveis e termos de licença</TituloSetup>
      <div className="h-[250px] overflow-y-auto border border-[#828790] p-3 leading-relaxed">
        <p className="font-semibold">TERMOS DE LICENÇA DE SOFTWARE DA MICROSOFT. SISTEMA OPERACIONAL WINDOWS</p>
        <p className="mt-2">(Resumo para a simulação.) Estes termos são o contrato entre você e a Microsoft para o uso do Windows. Eles explicam como o software pode ser usado, quantos dispositivos a licença cobre, como funciona a ativação e quais dados o sistema envia.</p>
        <p className="mt-2">A licença vale para um dispositivo. A ativação confirma que a cópia é original e está ligada ao hardware. Usar chaves de outras pessoas ou de sites desconhecidos não é permitido.</p>
        <p className="mt-2">Ao marcar a caixa abaixo, você declara que leu e aceita os termos. Sem aceitar, a instalação não continua.</p>
      </div>
      <label className="mt-4 flex items-center gap-2">
        <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        Aceito os termos de licença (Aceite os termos para continuar)
      </label>
    </JanelaSetup>
  );
}

function OobeRegiao({ onSim }: { onSim: () => void }) {
  const [v, setV] = React.useState<string | null>("Brasil");
  return (
    <OobeTela titulo="Este é o país ou região correto?" botoes={<BtnOobe disabled={!v} onClick={onSim}>Sim</BtnOobe>}>
      <ListaOobe itens={PAISES} valor={v} onChange={setV} />
    </OobeTela>
  );
}

function OobeTeclado({ inicial, onSim }: { inicial: string; onSim: (k: string) => void }) {
  const [v, setV] = React.useState<string | null>(inicial);
  return (
    <OobeTela titulo="Este é o layout de teclado ou método de entrada correto?" sub="Se você também usa outro layout de teclado, poderá adicioná-lo em seguida." botoes={<BtnOobe disabled={!v} onClick={() => v && onSim(v)}>Sim</BtnOobe>}>
      <ListaOobe itens={TECLADOS} valor={v} onChange={setV} />
    </OobeTela>
  );
}

function OobeRede({ onConectado, onEvento }: { onConectado: (r: string) => void; onEvento: (t: string) => void }) {
  const [aberta, setAberta] = React.useState<string | null>(null);
  const [pedindo, setPedindo] = React.useState(false);
  const [senha, setSenha] = React.useState("");
  const [erro, setErro] = React.useState(false);
  const [verificando, setVerificando] = React.useState(false);
  const [conectada, setConectada] = React.useState<string | null>(null);

  function conectar(r: (typeof REDES)[number]) {
    if (r.protegida && !pedindo) {
      setPedindo(true);
      return;
    }
    if (r.protegida) {
      const certa = r.nome === OS.rede && senha === OS.senhaRede;
      if (!certa) {
        setErro(true);
        onEvento(`Senha errada para a rede ${r.nome}.`);
        return;
      }
    }
    setVerificando(true);
    setTimeout(() => {
      setVerificando(false);
      setConectada(r.nome);
      setPedindo(false);
    }, 1500);
  }

  return (
    <OobeTela titulo="Vamos conectar você a uma rede" sub="Você precisará de uma conexão com a Internet para continuar configurando seu dispositivo." icone={<Wifi className="h-16 w-16" />} botoes={<BtnOobe disabled={!conectada} onClick={() => conectada && onConectado(conectada)}>Avançar</BtnOobe>}>
      <div className="h-[260px] overflow-y-auto">
        {REDES.map((r) => {
          const ab = aberta === r.nome;
          const con = conectada === r.nome;
          return (
            <div key={r.nome} className={cn("rounded-[4px] px-3 py-2", ab ? "bg-[#f3f6fb]" : "hover:bg-[#f7f7f7]")}>
              <button
                onClick={() => {
                  setAberta(r.nome);
                  setPedindo(false);
                  setSenha("");
                  setErro(false);
                }}
                className="flex w-full items-center gap-3 text-left"
              >
                <Wifi className="h-5 w-5" style={{ opacity: 0.35 + r.sinal * 0.16 }} />
                <span className="flex-1">
                  <span className="block">{r.nome}</span>
                  <span className="text-[12px] text-[#5a5a5a]">{con ? "Conectado, protegida" : r.protegida ? "Protegida" : "Aberta"}</span>
                </span>
                {r.protegida && <Lock className="h-3.5 w-3.5 text-[#5a5a5a]" />}
              </button>
              {ab && !con && (
                <div className="mt-2 pl-8">
                  {pedindo && (
                    <div className="mb-2">
                      <p className="text-[13px]">Insira a chave de segurança de rede</p>
                      <input type="password" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(false); }} className="mt-1 h-[32px] w-[260px] rounded-[4px] border border-[#8a8a8a] px-2 text-[14px]" aria-label="Chave de segurança de rede" />
                      {erro && <p className="mt-1 text-[12px] text-[#c42b1c]">A chave de segurança de rede não está correta. Tente novamente.</p>}
                    </div>
                  )}
                  {!r.protegida && <p className="mb-2 text-[12px] text-[#5a5a5a]">Outras pessoas podem ver as informações enviadas por esta rede.</p>}
                  <BtnOobe sec onClick={() => conectar(r)} disabled={verificando}>
                    {verificando ? "Verificando..." : pedindo ? "Avançar" : "Conectar"}
                  </BtnOobe>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </OobeTela>
  );
}

function OobeNome({ onAvancar }: { onAvancar: (n: string | null) => void }) {
  const [n, setN] = React.useState("");
  const [erro, setErro] = React.useState(false);
  const valido = (s: string) => /^[A-Za-z0-9-]{1,15}$/.test(s) && !/^\d+$/.test(s);
  return (
    <OobeTela
      titulo="Vamos dar um nome ao seu dispositivo"
      sub="Escolha um nome que ajude a identificar este dispositivo quando você o vir em outros dispositivos."
      botoes={
        <>
          <BtnOobe sec onClick={() => onAvancar(null)}>
            Pular por enquanto
          </BtnOobe>
          <BtnOobe
            disabled={!n}
            onClick={() => {
              if (!valido(n)) setErro(true);
              else onAvancar(n);
            }}
          >
            Avançar
          </BtnOobe>
        </>
      }
    >
      <input
        value={n}
        onChange={(e) => {
          setN(e.target.value);
          setErro(false);
        }}
        placeholder="Nome do dispositivo"
        className="h-[34px] w-[320px] rounded-[4px] border border-[#8a8a8a] px-2 text-[14px]"
        aria-label="Nome do dispositivo"
      />
      {erro && <p className="mt-2 max-w-[400px] text-[13px] text-[#c42b1c]">O nome do dispositivo pode ter até 15 caracteres: letras, números e hifens. Não use espaços nem outros símbolos, e não use só números.</p>}
    </OobeTela>
  );
}

function OobeTrabalho({ onVoltar }: { onVoltar: () => void }) {
  const [e, setE] = React.useState("");
  const [erro, setErro] = React.useState(false);
  return (
    <OobeTela
      titulo="Entrar com a conta corporativa ou de estudante"
      botoes={
        <>
          <BtnOobe sec onClick={onVoltar}>
            Voltar
          </BtnOobe>
          <BtnOobe disabled={!e} onClick={() => setErro(true)}>
            Avançar
          </BtnOobe>
        </>
      }
    >
      <input value={e} onChange={(x) => { setE(x.target.value); setErro(false); }} placeholder="alguem@exemplo.com" className="h-[34px] w-[340px] rounded-[4px] border border-[#8a8a8a] px-2 text-[14px]" aria-label="Email corporativo" />
      {erro && <p className="mt-2 max-w-[420px] text-[13px] text-[#c42b1c]">Não encontramos uma conta corporativa ou de estudante com esse endereço. Verifique o email ou volte e escolha outra opção.</p>}
    </OobeTela>
  );
}

function OobeConta({ onAvancar }: { onAvancar: () => void }) {
  const [e, setE] = React.useState("");
  const [erro, setErro] = React.useState(false);
  return (
    <OobeTela
      titulo="Vamos adicionar sua conta da Microsoft"
      sub="Entre com a conta Microsoft da cliente para manter configurações e arquivos sincronizados."
      botoes={
        <BtnOobe
          disabled={!e}
          onClick={() => {
            if (e.trim().toLowerCase() === OS.email) onAvancar();
            else setErro(true);
          }}
        >
          Avançar
        </BtnOobe>
      }
    >
      <input value={e} onChange={(x) => { setE(x.target.value); setErro(false); }} placeholder="Email, telefone ou Skype" className="h-[34px] w-[340px] rounded-[4px] border border-[#8a8a8a] px-2 text-[14px]" aria-label="Email da conta Microsoft" />
      {erro && <p className="mt-2 max-w-[420px] text-[13px] text-[#c42b1c]">Essa conta da Microsoft não existe. Confira o endereço na ordem de serviço.</p>}
    </OobeTela>
  );
}

function OobeCliente({ titulo, sub, acao, campo, onPronto }: { titulo: string; sub?: string; acao: string; campo: string; onPronto: () => void }) {
  const [feito, setFeito] = React.useState(false);
  return (
    <OobeTela titulo={titulo} sub={sub} icone={<Lock className="h-14 w-14" />} botoes={<BtnOobe disabled={!feito} onClick={onPronto}>Avançar</BtnOobe>}>
      <input readOnly value={feito ? "••••••••" : ""} placeholder={campo} className="h-[34px] w-[300px] rounded-[4px] border border-[#8a8a8a] bg-[#fafafa] px-2 text-[14px]" aria-label={campo} />
      <p className="mt-3 max-w-[420px] text-[13px] text-[#5a5a5a]">Senha e PIN são pessoais. O técnico não digita e não anota: vira o notebook para a cliente.</p>
      <button onClick={() => setFeito(true)} disabled={feito} className="mt-3 rounded-[4px] border border-[#005fb8] px-3 py-1.5 text-[13px] text-[#005fb8] hover:bg-[#f5f9ff] disabled:opacity-50">
        {feito ? "A Ana digitou" : acao}
      </button>
    </OobeTela>
  );
}

function OobePrivacidade({ onAceitar }: { onAceitar: () => void }) {
  const ITENS = ["Localização", "Encontrar meu dispositivo", "Dados de diagnóstico opcionais", "Escrita à tinta e digitação", "Experiências personalizadas", "Anúncios e ID de anúncio"];
  const [on, setOn] = React.useState<boolean[]>(ITENS.map(() => true));
  return (
    <OobeTela titulo="Escolha as configurações de privacidade do seu dispositivo" botoes={<BtnOobe onClick={onAceitar}>Aceitar</BtnOobe>}>
      <div className="h-[280px] space-y-2 overflow-y-auto pr-2">
        {ITENS.map((t, i) => (
          <label key={t} className="flex items-center justify-between border-b border-[#eee] pb-2">
            <span>{t}</span>
            <button
              onClick={() => setOn((o) => o.map((v, k) => (k === i ? !v : v)))}
              className={cn("relative h-[20px] w-[40px] rounded-full border transition", on[i] ? "border-[#005fb8] bg-[#005fb8]" : "border-[#8a8a8a] bg-white")}
              aria-label={t}
            >
              <span className={cn("absolute top-[3px] h-[12px] w-[12px] rounded-full transition", on[i] ? "left-[23px] bg-white" : "left-[3px] bg-[#5a5a5a]")} />
            </button>
          </label>
        ))}
      </div>
    </OobeTela>
  );
}

function TelaDesktop({ ativado, rede }: { ativado: boolean; rede: string | null }) {
  return (
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 120%, #8fc3ff 0%, #2f6fd6 35%, #0b2f7a 70%, #071a45 100%)", fontFamily: FONTE_WIN }}>
      <div className="absolute left-6 top-6 flex flex-col items-center gap-1 text-[12px] text-white">
        <span className="grid h-10 w-10 place-items-center rounded bg-white/20">🗑️</span>
        Lixeira
      </div>
      {!ativado && (
        <div className="absolute bottom-20 right-10 text-white/70">
          <p className="text-[22px]">Ativar o Windows</p>
          <p className="text-[14px]">Acesse Configurações para ativar o Windows.</p>
        </div>
      )}
      <div className="absolute right-6 top-6 w-[300px] rounded-[8px] bg-white/90 p-4 text-[13px] text-[#1b1b1b] shadow-xl">
        <p className="font-semibold">Configurações › Sistema › Ativação</p>
        <p className={cn("mt-2", ativado ? "text-[#107c10]" : "text-[#c42b1c]")}>{ativado ? "O Windows está ativado com uma licença digital vinculada à sua conta da Microsoft." : "O Windows não está ativado. A chave do produto deste dispositivo é de outra edição."}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[48px] items-center justify-center gap-2 bg-white/75 backdrop-blur">
        <span className="grid h-9 w-9 place-items-center rounded hover:bg-white/60">
          <LogoWin11 tam={22} />
        </span>
        {["🔍", "📁", "🌐", "🛍️"].map((i) => (
          <span key={i} className="grid h-9 w-9 place-items-center rounded text-[18px] hover:bg-white/60">
            {i}
          </span>
        ))}
        <span className="absolute right-4 flex items-center gap-3 text-[12px] text-[#1b1b1b]">
          {rede ? <Wifi className="h-4 w-4" /> : <span className="text-[11px]">sem internet</span>}
          <span className="text-right leading-tight">
            10:27
            <br />
            14/11/2026
          </span>
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Simulador de formatação: missões na tela de partições
   ============================================================ */

type Missao = {
  id: string;
  titulo: string;
  pedido: React.ReactNode;
  discos: () => Disco[];
  driver?: boolean;
  avaliar: (a: AvalDisco) => ItemRel[];
};

const okLimpo = (a: AvalDisco): ItemRel[] => [
  a.sobras.length === 0 && !a.windowsOld && !a.emDados
    ? { ok: true, titulo: "Sem restos do sistema antigo", texto: "As partições antigas foram apagadas antes da instalação." }
    : {
        ok: false,
        titulo: "Sem restos do sistema antigo",
        texto: [a.windowsOld ? "O Windows iria por cima do antigo e criaria a pasta Windows.old." : "", a.emDados ? "O Windows iria para a partição de dados antiga, sem formatar." : "", a.sobras.length ? `Sobraram: ${a.sobras.join(", ")}.` : ""].filter(Boolean).join(" "),
      },
  ...(a.recAntiga ? [{ ok: "aviso" as const, titulo: "Recuperação antiga", texto: "A partição de recuperação do Windows 10 ficou. Apague também: o Windows 11 cria a dele." }] : []),
];

const MISSOES: Missao[] = [
  {
    id: "inteiro",
    titulo: "1. Disco inteiro",
    pedido: "Instalação limpa no SSD de 256 GB. A cliente quer o disco inteiro para o Windows, num C: só. O backup já está feito e o HD externo foi desconectado.",
    discos: () => [discoCliente()],
    avaliar: (a) => [
      ...okLimpo(a),
      a.alvoMB >= 220 * 1024
        ? { ok: true, titulo: "Disco inteiro para o Windows", texto: `O C: ficou com ${fmtMB(a.alvoMB)}.` }
        : { ok: false, titulo: "Disco inteiro para o Windows", texto: `O C: ficou com ${fmtMB(a.alvoMB)}. Apague todas as partições, escolha o espaço não alocado inteiro e avance.` },
    ],
  },
  {
    id: "cd",
    titulo: "2. C: e D:",
    pedido: (
      <>
        A cliente quer separar: <b>C: com 150 GB</b> para o Windows e os programas e <b>D: com o resto</b> para os arquivos. O instalador pede o tamanho em MB: 1 GB = 1024 MB, então 150 GB = 153600 MB. O backup já está feito.
      </>
    ),
    discos: () => [discoCliente()],
    avaliar: (a) => [
      ...okLimpo(a),
      a.alvoMB >= 140 * 1024 && a.alvoMB <= 160 * 1024
        ? { ok: true, titulo: "C: com cerca de 150 GB", texto: `O C: ficou com ${fmtMB(a.alvoMB)}.` }
        : { ok: false, titulo: "C: com cerca de 150 GB", texto: `O C: ficou com ${fmtMB(a.alvoMB)}. Crie a partição com 153600 MB e instale nela.` },
      a.outrasNovas.some((x) => x >= 60 * 1024)
        ? { ok: true, titulo: "D: para os arquivos", texto: `Há uma partição nova de ${fmtMB(Math.max(...a.outrasNovas))} para o D:.` }
        : { ok: false, titulo: "D: para os arquivos", texto: "Faltou criar a segunda partição com o espaço que sobrou. Selecione o espaço não alocado, clique em Novo e Aplicar." },
    ],
  },
  {
    id: "externo",
    titulo: "3. HD externo conectado",
    pedido: "Mesmo serviço da missão 1, mas o HD externo com o backup da cliente ficou conectado no notebook. Ele aparece na lista como Unidade 1. Instale no SSD sem encostar no backup.",
    discos: () => [discoCliente(), discoBackupUsb()],
    avaliar: (a) => [
      a.backupIntacto ? { ok: true, titulo: "Backup intacto", texto: "A Unidade 1, com o backup, não foi tocada." } : { ok: false, titulo: "Backup intacto", texto: "A partição do HD externo foi apagada ou formatada. O backup da cliente se perdeu. Confira sempre o número da unidade antes de excluir." },
      ...okLimpo(a),
      a.alvoMB >= 220 * 1024 ? { ok: true, titulo: "Disco inteiro no SSD", texto: `O C: ficou com ${fmtMB(a.alvoMB)} na Unidade 0.` } : { ok: false, titulo: "Disco inteiro no SSD", texto: `O C: ficou com ${fmtMB(a.alvoMB)}. Use o SSD inteiro.` },
    ],
  },
  {
    id: "driver",
    titulo: "4. O SSD não aparece",
    pedido: "Notebook novo de outro cliente, SSD de 512 GB vazio. Ao chegar na tela de partições, a lista está vazia. A ficha técnica diz: controlador Intel VMD. Os drivers estão no pendrive, na pasta Drivers.",
    discos: () => [discoNovo()],
    driver: true,
    avaliar: (a) => [
      { ok: true, titulo: "Driver de armazenamento", texto: "O driver Intel RST VMD foi carregado e o SSD apareceu." },
      a.alvoMB >= 400 * 1024 ? { ok: true, titulo: "Instalação no SSD", texto: `O Windows vai para ${fmtMB(a.alvoMB)}, o SSD inteiro.` } : { ok: "aviso", titulo: "Instalação no SSD", texto: `O C: ficou com ${fmtMB(a.alvoMB)}. Num disco novo, o normal é usar o espaço inteiro.` },
    ],
  },
];

export function SimParticoes() {
  const [mi, setMi] = React.useState(0);
  const missao = MISSOES[mi];
  const [discos, setDiscos] = React.useState<Disco[]>(() => missao.discos());
  const [driver, setDriver] = React.useState(false);
  const [res, setRes] = React.useState<ItemRel[] | null>(null);
  const [chave, setChave] = React.useState(0);
  const [log, setLog] = React.useState<string[]>([]);

  function iniciar(i: number) {
    setMi(i);
    setDiscos(MISSOES[i].discos());
    setDriver(false);
    setRes(null);
    setLog([]);
    setChave((k) => k + 1);
  }
  function avancar(n: number, id: string) {
    const r = avaliar(discos, n, id);
    const itens = missao.avaliar(r.aval);
    setRes(itens);
    itens.forEach((i) => recordAnswer({ app: "info", category: "uc2a2-sim-particoes", correct: i.ok !== false, timeMs: 0, points: i.ok === true ? 10 : 0 }));
  }
  const falhas = res?.filter((i) => i.ok === false).length ?? 0;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {MISSOES.map((x, i) => (
          <button
            key={x.id}
            onClick={() => iniciar(i)}
            className={cn("rounded-xl border px-3 py-2 text-sm font-semibold transition", i === mi ? "border-blue-500 bg-blue-600 text-white" : "border-foreground/10 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10")}
          >
            {x.titulo}
          </button>
        ))}
      </div>
      <OrdemServico titulo={`Missão ${missao.titulo}`}>
        <p>{missao.pedido}</p>
      </OrdemServico>
      <Monitor>
        {res ? (
          <JanelaSetup rodape={<BtnWin onClick={() => iniciar(mi)}>Tentar de novo</BtnWin>}>
            <TituloSetup>{falhas === 0 ? "Pronto para instalar" : "Pare e confira antes de instalar"}</TituloSetup>
            <p className="leading-relaxed">A partir daqui o instalador copiaria os arquivos para a partição escolhida. Veja abaixo da tela como ficou o disco.</p>
          </JanelaSetup>
        ) : (
          <TelaDisco
            key={chave}
            discos={discos}
            setDiscos={(f) => setDiscos((d) => f(d))}
            ocultarDiscos={missao.driver && !driver}
            onDriverCarregado={() => setDriver(true)}
            onAvancar={avancar}
            onEvento={(t) => setLog((l) => [...l, t])}
          />
        )}
      </Monitor>
      {log.length > 0 && (
        <details className="mt-3 rounded-xl border border-foreground/10 bg-white/40 p-3 text-sm dark:bg-white/5">
          <summary className="cursor-pointer font-semibold">O que você fez ({log.length})</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </details>
      )}
      {res && (
        <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/60 p-5 dark:bg-white/5">
          <p className="text-lg font-bold">{falhas === 0 ? "Missão cumprida" : "Ainda não ficou certo"}</p>
          <ul className="mt-3 space-y-2">
            {res.map((i) => (
              <li key={i.titulo} className={cn("flex gap-3 rounded-xl border p-3 text-sm", i.ok === true ? "border-emerald-500/50 bg-emerald-500/5" : i.ok === "aviso" ? "border-amber-500/60 bg-amber-500/5" : "border-red-500/60 bg-red-500/5")}>
                {i.ok === true ? <Check className="h-5 w-5 shrink-0 text-emerald-600" /> : i.ok === "aviso" ? <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" /> : <X className="h-5 w-5 shrink-0 text-red-600" />}
                <span>
                  <span className="font-semibold">{i.titulo}.</span> {i.texto}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => iniciar(mi)} className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 bg-white/70 px-3 py-2 text-sm font-medium hover:bg-white dark:bg-white/10">
              <RotateCcw className="h-4 w-4" /> tentar de novo
            </button>
            {mi < MISSOES.length - 1 && (
              <button onClick={() => iniciar(mi + 1)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                próxima missão
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
