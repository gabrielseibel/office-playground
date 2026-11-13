"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Network,
  Cable,
  Settings2,
  TerminalSquare,
  Check,
  X,
  RotateCcw,
  Trophy,
  Maximize,
  Minimize,
  Monitor,
  Printer,
  Server,
  Share2,
  Radio,
  Router,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recordAnswer } from "@/lib/progress";
import {
  CENARIOS_MONTADOR,
  NOME_DISPOSITIVO,
  CENARIOS_IP,
  TERMINAL2,
  type TipoDispositivo,
} from "@/data/laboratorioRedes";

type Aba = "montador" | "ip" | "terminal";

const ABAS: { id: Aba; titulo: string; formato: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "montador", titulo: "Montador de rede", formato: "Sozinho ou dupla", icon: Cable },
  { id: "ip", titulo: "Configurador de IP", formato: "Sozinho", icon: Settings2 },
  { id: "terminal", titulo: "Terminal do técnico", formato: "Em dupla", icon: TerminalSquare },
];

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
        {acertos === total ? "Tudo certo. Mandou bem." : acertos >= total / 2 ? "Bom resultado. Revise as que errou." : "Vale tentar de novo."}
      </p>
      <div className="mt-5">
        <BotaoSec onClick={onReiniciar}>
          <RotateCcw className="h-4 w-4" /> jogar de novo
        </BotaoSec>
      </div>
    </div>
  );
}

const ICONE: Record<TipoDispositivo, React.ComponentType<{ className?: string }>> = {
  pc: Monitor,
  impressora: Printer,
  servidor: Server,
  switch: Share2,
  hub: Radio,
  roteador: Router,
};

/* Módulo 2: Montador de rede */
function chave(a: string, b: string) {
  return [a, b].sort().join("~");
}

function MontadorDeRede() {
  const [cenarioIdx, setCenarioIdx] = React.useState(0);
  const cenario = CENARIOS_MONTADOR[cenarioIdx];
  const [ligacoes, setLigacoes] = React.useState<[string, string][]>([]);
  const [selecionado, setSelecionado] = React.useState<string | null>(null);
  const [conferido, setConferido] = React.useState(false);
  const [pacote, setPacote] = React.useState<{ ativos: string[]; alvo: string } | null>(null);
  const [envioDe, setEnvioDe] = React.useState<string | null>(null);

  const corretas = React.useMemo(() => new Set(cenario.ligacoesCorretas.map(([a, b]) => chave(a, b))), [cenario]);
  const atuais = new Set(ligacoes.map(([a, b]) => chave(a, b)));
  const exato = corretas.size === atuais.size && [...corretas].every((k) => atuais.has(k));
  const central = cenario.dispositivos.find((d) => d.id === cenario.central)!;

  function clicarDispositivo(id: string) {
    if (conferido || pacote) return;
    if (!selecionado) {
      setSelecionado(id);
      return;
    }
    if (selecionado === id) {
      setSelecionado(null);
      return;
    }
    const k = chave(selecionado, id);
    const existe = ligacoes.some(([a, b]) => chave(a, b) === k);
    if (existe) setLigacoes(ligacoes.filter(([a, b]) => chave(a, b) !== k));
    else setLigacoes([...ligacoes, [selecionado, id]]);
    setSelecionado(null);
  }

  function conferir() {
    setConferido(true);
    recordAnswer({ app: "info", category: "redes-montador", correct: exato, timeMs: 0, points: exato ? 40 : 10 });
  }

  function reiniciar(novoIdx?: number) {
    setCenarioIdx(novoIdx ?? (cenarioIdx + 1) % CENARIOS_MONTADOR.length);
    setLigacoes([]);
    setSelecionado(null);
    setConferido(false);
    setPacote(null);
    setEnvioDe(null);
  }

  function ligadoAoCentral(id: string) {
    return ligacoes.some(([a, b]) => (a === id && b === cenario.central) || (b === id && a === cenario.central));
  }

  async function enviarPacote(deId: string, paraId: string) {
    if (!exato || deId === paraId) return;
    setEnvioDe(null);
    setPacote({ ativos: [deId, cenario.central], alvo: paraId });
    await new Promise((r) => setTimeout(r, 650));
    if (central.tipo === "hub") {
      const todos = cenario.dispositivos.filter((d) => d.id !== cenario.central && d.id !== deId && ligadoAoCentral(d.id)).map((d) => d.id);
      setPacote({ ativos: [deId, cenario.central, ...todos], alvo: paraId });
    } else {
      setPacote({ ativos: [deId, cenario.central, paraId], alvo: paraId });
    }
    await new Promise((r) => setTimeout(r, 1300));
    setPacote(null);
  }

  return (
    <div>
      <Instrucao>
        <strong>{cenario.empresa}.</strong> {cenario.descricao} Clique em um aparelho e depois no outro para ligar (ou desligar) um
        cabo entre eles.
      </Instrucao>

      <div className="relative mx-auto aspect-[16/10] w-full max-w-3xl rounded-2xl border border-foreground/10 bg-white/50 dark:bg-white/5">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {ligacoes.map(([a, b], i) => {
            const da = cenario.dispositivos.find((d) => d.id === a)!;
            const db = cenario.dispositivos.find((d) => d.id === b)!;
            const ativa = pacote?.ativos.includes(a) && pacote?.ativos.includes(b);
            return (
              <line
                key={i}
                x1={da.x}
                y1={da.y}
                x2={db.x}
                y2={db.y}
                stroke={ativa ? "#2563eb" : "#94a3b8"}
                strokeWidth={ativa ? 1.4 : 0.8}
              />
            );
          })}
        </svg>
        {cenario.dispositivos.map((d) => {
          const Icon = ICONE[d.tipo];
          const sel = selecionado === d.id;
          const noPacote = pacote?.ativos.includes(d.id);
          const ehAlvo = pacote?.alvo === d.id;
          return (
            <button
              key={d.id}
              onClick={() => (envioDe !== null ? enviarPacote(envioDe, d.id) : clicarDispositivo(d.id))}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition",
                sel ? "border-blue-500 bg-blue-600 text-white shadow-lg" : "border-foreground/15 bg-white/90 hover:border-blue-400 dark:bg-[#141420]",
                noPacote && !ehAlvo && "ring-2 ring-amber-400",
                ehAlvo && "ring-2 ring-emerald-500"
              )}
            >
              <Icon className={cn("h-5 w-5", sel ? "text-white" : "text-blue-700 dark:text-blue-300")} />
              <span className="text-[10px] font-semibold leading-tight">{d.nome}</span>
            </button>
          );
        })}
      </div>

      {conferido && (
        <div className={cn("mt-4 rounded-2xl border p-4", exato ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10")}>
          <p className="font-semibold">
            {exato
              ? `Rede montada certinha. O aparelho central é ${central.tipo === "hub" ? "um hub" : "um switch"}.`
              : "Ainda falta ou tem cabo sobrando. Veja o esquema e ajuste."}
          </p>
          {exato && (
            <p className="mt-2 text-sm text-muted-foreground">
              Agora clique em "enviar pacote", escolha quem envia e depois quem recebe, para ver como {central.tipo === "hub" ? "o hub espalha" : "o switch entrega"} a mensagem.
            </p>
          )}
        </div>
      )}

      {pacote && (
        <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
          {central.tipo === "hub" && pacote.ativos.length > 2
            ? "O hub manda o pacote para todas as portas. Cada aparelho recebe e descarta, menos o destino real."
            : "O pacote segue direto para a porta certa."}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <BotaoSec onClick={() => reiniciar()}>
            <RotateCcw className="h-4 w-4" /> outro cenário
          </BotaoSec>
          {exato && !envioDe && (
            <BotaoSec onClick={() => setEnvioDe(cenario.dispositivos.find((d) => d.tipo === "pc")!.id)} disabled={Boolean(pacote)}>
              <Send className="h-4 w-4" /> enviar pacote
            </BotaoSec>
          )}
          {envioDe && <span className="self-center text-sm text-muted-foreground">Clique no aparelho que vai receber o pacote.</span>}
        </div>
        {!conferido && (
          <BotaoPri onClick={conferir} disabled={ligacoes.length === 0}>
            conferir
          </BotaoPri>
        )}
      </div>
    </div>
  );
}

/* Módulo 3: Configurador de IP */
function parseIP(ip: string): number[] | null {
  const partes = ip.trim().split(".");
  if (partes.length !== 4) return null;
  if (!partes.every((p) => /^\d{1,3}$/.test(p))) return null;
  const nums = partes.map((p) => Number(p));
  if (nums.some((n) => n < 0 || n > 255)) return null;
  return nums;
}

function mesmaRede(ipA: number[], ipB: number[], mascara: number[]) {
  return ipA.every((v, i) => (v & mascara[i]) === (ipB[i] & mascara[i]));
}

function ConfiguradorDeIP() {
  const [idx, setIdx] = React.useState(0);
  const cen = CENARIOS_IP[idx];
  const [modo, setModo] = React.useState<"dhcp" | "manual" | null>(null);
  const [ip, setIp] = React.useState("");
  const [mascara, setMascara] = React.useState("");
  const [gateway, setGateway] = React.useState("");
  const [dns, setDns] = React.useState("");
  const [resultado, setResultado] = React.useState<{ ok: boolean; mensagens: string[] } | null>(null);
  const [acertos, setAcertos] = React.useState(0);
  const [fim, setFim] = React.useState(false);

  function testar() {
    const msgs: string[] = [];
    let ok = true;
    if (modo === "dhcp") {
      if (cen.dhcpDisponivel) {
        msgs.push(`Endereço obtido automaticamente na rede ${cen.redeBase}.0, com gateway ${cen.gateway}.`);
        msgs.push("O computador fala com a rede e com a internet.");
      } else {
        ok = false;
        msgs.push("Não existe servidor DHCP nesta rede ainda. Configure manualmente.");
      }
    } else {
      const ipN = parseIP(ip);
      const maskN = parseIP(mascara);
      const gwN = parseIP(gateway);
      if (!ipN || !maskN || !gwN || !dns.trim()) {
        ok = false;
        msgs.push("Preencha IP, máscara, gateway e DNS, cada um com quatro números de 0 a 255.");
      } else {
        const redeEsperada = parseIP(`${cen.redeBase}.0`)!;
        if (mascara !== cen.mascara) {
          ok = false;
          msgs.push(`A máscara deveria ser ${cen.mascara}.`);
        } else if (!mesmaRede(ipN, redeEsperada, maskN)) {
          ok = false;
          msgs.push(`Esse IP não está na rede ${cen.redeBase}.0.`);
        } else if (cen.ipsEmUso.includes(ip)) {
          ok = false;
          msgs.push("Esse IP já está em uso por outro computador. Escolha outro.");
        } else if (ip === cen.gateway) {
          ok = false;
          msgs.push("Esse IP já é do roteador (gateway). Escolha outro.");
        } else if (gateway !== cen.gateway) {
          ok = false;
          msgs.push(`O gateway deveria ser ${cen.gateway}, o endereço do roteador.`);
        } else if (dns.trim() !== cen.dns) {
          ok = false;
          msgs.push(`O DNS deveria ser ${cen.dns} para a internet funcionar pelo nome.`);
        } else {
          msgs.push("O computador fala com a rede e com a internet.");
        }
      }
    }
    setResultado({ ok, mensagens: msgs });
    if (ok) setAcertos((a) => a + 1);
    recordAnswer({ app: "info", category: "redes-ip", correct: ok, timeMs: 0, points: ok ? 20 : 5 });
  }

  function limpar() {
    setModo(null);
    setIp("");
    setMascara("");
    setGateway("");
    setDns("");
    setResultado(null);
  }

  function proximo() {
    if (idx + 1 >= CENARIOS_IP.length) setFim(true);
    else {
      setIdx(idx + 1);
      limpar();
    }
  }
  function reiniciar() {
    setIdx(0);
    limpar();
    setAcertos(0);
    setFim(false);
  }

  if (fim) return <Placar acertos={acertos} total={CENARIOS_IP.length} onReiniciar={reiniciar} />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Instrucao>
          Desafio {idx + 1} de {CENARIOS_IP.length}. <strong>{cen.empresa}.</strong> {cen.descricao}
        </Instrucao>
        <div className="rounded-2xl border border-foreground/10 bg-white/50 p-5 dark:bg-white/5">
          <p className="mb-3 text-sm font-bold">Propriedades de Protocolo IP versão 4 (TCP/IPv4)</p>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="modo" checked={modo === "dhcp"} onChange={() => setModo("dhcp")} />
              Obter um endereço IP automaticamente
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="modo" checked={modo === "manual"} onChange={() => setModo("manual")} />
              Usar o seguinte endereço IP:
            </label>
          </div>
          <div className={cn("mt-3 space-y-2 pl-6", modo !== "manual" && "opacity-40")}>
            <Campo label="Endereço IP" value={ip} onChange={setIp} disabled={modo !== "manual"} placeholder="192.168.0.0" />
            <Campo label="Máscara de sub-rede" value={mascara} onChange={setMascara} disabled={modo !== "manual"} placeholder="255.255.255.0" />
            <Campo label="Gateway padrão" value={gateway} onChange={setGateway} disabled={modo !== "manual"} placeholder="192.168.0.1" />
            <Campo label="Servidor DNS" value={dns} onChange={setDns} disabled={modo !== "manual"} placeholder="8.8.8.8" />
          </div>
          <div className="mt-4 flex justify-end">
            <BotaoPri onClick={testar} disabled={!modo || Boolean(resultado)}>
              testar conexão
            </BotaoPri>
          </div>
        </div>
      </div>
      <div>
        {resultado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("rounded-2xl border p-4", resultado.ok ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10")}
          >
            <p className="font-semibold">{resultado.ok ? "Conectado." : "Não conectou."}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {resultado.mensagens.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <BotaoPri onClick={proximo}>
                {idx + 1 >= CENARIOS_IP.length ? "ver resultado" : "próximo"} <ChevronRight className="h-4 w-4" />
              </BotaoPri>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        inputMode="decimal"
        className="w-40 rounded-lg border border-foreground/20 bg-white/70 px-2 py-1 font-mono text-sm disabled:opacity-50 dark:bg-white/10"
      />
    </label>
  );
}

/* Módulo 4: Terminal do técnico */
function TerminalTecnico() {
  const [linhas, setLinhas] = React.useState<{ txt: string; cor?: string }[]>([
    { txt: "Digite um comando e aperte Enter. Para ajuda, digite help.", cor: "text-slate-400" },
  ]);
  const [entrada, setEntrada] = React.useState("");
  const [feitas, setFeitas] = React.useState<string[]>([]);
  const [resposta, setResposta] = React.useState<string | null>(null);
  const fundo = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    fundo.current?.scrollTo({ top: fundo.current.scrollHeight });
  }, [linhas]);

  function marcar(id: string) {
    if (feitas.includes(id)) return;
    recordAnswer({ app: "info", category: "redes-terminal2", correct: true, timeMs: 0, points: 10 });
    setFeitas((f) => (f.includes(id) ? f : [...f, id]));
  }

  function executar(cmd: string) {
    const novas: { txt: string; cor?: string }[] = [{ txt: `C:\\Users\\tecnico> ${cmd}`, cor: "text-white" }];
    const c = cmd.trim().toLowerCase();
    if (c === "ipconfig") {
      TERMINAL2.ipconfig.forEach((t) => novas.push({ txt: t }));
      marcar("ipconfig");
    } else if (c === "cls") {
      setLinhas([]);
      return;
    } else if (c === "help") {
      novas.push({ txt: "Comandos: ipconfig, ping <endereço>, tracert <endereço>, nslookup <nome>, arp -a, cls", cor: "text-slate-400" });
    } else if (c.startsWith("ping ")) {
      const alvo = c.slice(5).trim();
      const nome = TERMINAL2.nomes[alvo];
      const ip = nome ?? alvo;
      const quem = TERMINAL2.responde[ip];
      novas.push({ txt: nome ? `Disparando ${alvo} [${nome}] com 32 bytes de dados:` : `Disparando ${alvo} com 32 bytes de dados:` });
      if (quem || nome) {
        for (let i = 0; i < 4; i++) novas.push({ txt: `Resposta de ${ip}: bytes=32 tempo<1ms`, cor: "text-emerald-400" });
        novas.push({ txt: "Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda)" });
        if (ip === "192.168.20.1") marcar("ping-roteador");
      } else {
        for (let i = 0; i < 4; i++) novas.push({ txt: "Esgotado o tempo limite do pedido.", cor: "text-red-400" });
        novas.push({ txt: "Pacotes: Enviados = 4, Recebidos = 0, Perdidos = 4 (100% de perda)" });
        if (ip === "192.168.20.30") marcar("ping-impressora");
      }
    } else if (c.startsWith("nslookup ")) {
      const alvo = c.slice(9).trim();
      const ip = TERMINAL2.nomes[alvo];
      if (ip) {
        novas.push({ txt: "Servidor:  resolvedor.local" });
        novas.push({ txt: "Address:  192.168.20.1" });
        novas.push({ txt: "" });
        novas.push({ txt: "Resposta não autoritativa:" });
        novas.push({ txt: `Nome:    ${alvo}` });
        novas.push({ txt: `Address:  ${ip}` });
        marcar("nslookup");
      } else {
        novas.push({ txt: `Não é possível encontrar ${alvo}: servidor não encontrou o domínio.`, cor: "text-red-400" });
      }
    } else if (c.startsWith("tracert ")) {
      const alvo = c.slice(8).trim();
      const nome = TERMINAL2.nomes[alvo];
      novas.push({ txt: `Rastreando a rota para ${alvo}${nome ? ` [${nome}]` : ""} com no máximo 30 saltos:` });
      TERMINAL2.rotaInternet.forEach((hop, i) => novas.push({ txt: `  ${i + 1}    <1 ms    <1 ms    <1 ms  ${hop}` }));
      novas.push({ txt: "Rastreamento concluído." });
      marcar("tracert");
    } else if (c === "arp -a" || c === "arp") {
      novas.push({ txt: "Interface: 192.168.20.10 --- 0x1" });
      novas.push({ txt: "  Endereço IP           Endereço físico      Tipo" });
      Object.entries(TERMINAL2.mac).forEach(([ipAddr, mac]) => novas.push({ txt: `  ${ipAddr.padEnd(21)} ${mac}      dinâmico` }));
      marcar("arp");
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

  const tudo = feitas.length === TERMINAL2.missoes.length;
  const diag = TERMINAL2.diagnostico;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div>
        <Instrucao>
          Em dupla. Este é o computador da Papelaria Ipê. Cumpram as missões ao lado digitando os comandos de verdade. Um digita,
          o outro confere.
        </Instrucao>
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
            <span className="text-slate-400">C:\Users\tecnico&gt;</span>
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
          {TERMINAL2.missoes.map((m) => {
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
                      recordAnswer({ app: "info", category: "redes-terminal2", correct: o.id === diag.certa, timeMs: 0, points: o.id === diag.certa ? 20 : 0 });
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

/* Página */
export function LaboratorioRedes() {
  const [aba, setAba] = React.useState<Aba>("montador");
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
              <Network className="h-3.5 w-3.5" /> Curso Informática Essencial. UC3
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Laboratório de Redes</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Monte a topologia, configure o IP e use o terminal do técnico, do jeito que se faz no computador de verdade.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-2 sm:grid-cols-3">
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
            {aba === "montador" && <MontadorDeRede />}
            {aba === "ip" && <ConfiguradorDeIP />}
            {aba === "terminal" && <TerminalTecnico />}
          </Painel>
        </div>
      </div>
    </div>
  );
}
