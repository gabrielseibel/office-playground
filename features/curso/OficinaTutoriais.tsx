"use client";

import * as React from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Download, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIRES, NORMA_A, NORMA_B, ORDEM_CROSS_GIG, CATS, testar, pontaPronta, type WireId } from "@/lib/cabos";
import { APOIO } from "@/lib/cabosApoio";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Caixa({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70", className)}>{children}</div>;
}
function Btn({ children, onClick, sec, disabled }: { children: React.ReactNode; onClick?: () => void; sec?: boolean; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn("rounded-xl px-4 py-2 text-sm font-bold transition disabled:opacity-40", sec ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "bg-blue-600 text-white hover:bg-blue-700")}>
      {children}
    </button>
  );
}
function Fio({ id, rot }: { id: WireId; rot?: string }) {
  const w = WIRES[id];
  return (
    <span className="relative inline-block h-9 w-5 rounded-full border-2 border-black/20 dark:border-white/30" title={w.nome} style={{ background: w.listrado ? `repeating-linear-gradient(135deg, #fff 0 5px, ${w.cor} 5px 10px)` : w.cor }}>
      {rot && <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">{rot}</span>}
    </span>
  );
}

/* ============ Tutorial 1: crimpagem animada ============ */
const PASSOS_CRIMP = [
  { t: "Cabo UTP novo", d: "Um cabo UTP tem 4 pares trançados dentro da capa. Corte a ponta com o alicate para ficar reta." },
  { t: "Decapar cerca de 30 mm", d: "Use o decapador de cabo UTP. Ele corta só a capa e não fere a isolação dos fios. Estilete e alicate de corte arranham os fios." },
  { t: "Separar e destrançar", d: "Abra os pares e destrance só o necessário, no máximo 13 mm. Destrançar demais aumenta a interferência." },
  { t: "Colocar na ordem T568B", d: "Branco-laranja, laranja, branco-verde, azul, branco-azul, verde, branco-marrom, marrom. O pino 1 fica à esquerda, com a trava do conector para baixo." },
  { t: "Aparar a ponta", d: "Alinhe os fios e corte deixando de 11 a 14 mm fora da capa. Assim o fio toca o fundo e a capa entra até a trava." },
  { t: "Inserir no conector RJ45", d: "Empurre até os fios tocarem o fundo. Confira pela frente: oito fios encostados no fundo e a capa dentro do conector." },
  { t: "Crimpar", d: "Aperte o alicate de uma vez, com firmeza. Fraca deixa fios sem contato. Forte demais racha o conector." },
  { t: "Testar", d: "Ligue as duas pontas no testador. As luzes acendem de 1 a 8 na mesma ordem. Repita a ponta B com a mesma ordem." },
];
const EMBARALHADO: WireId[] = ["Br", "G", "WBr", "O", "WO", "B", "WG", "WB"];

function CenaCrimpagem({ passo }: { passo: number }) {
  const J = passo === 0 ? 330 : 230;
  const fios: WireId[] = passo >= 3 ? NORMA_B : EMBARALHADO;
  const spread = passo >= 2;
  const fim = passo >= 4 ? 70 : 110;
  const tr = "transform 0.9s ease, opacity 0.6s ease";
  const conectorX = passo < 5 ? 200 : 0;
  return (
    <svg viewBox="0 0 640 250" className="w-full" role="img" aria-label={`Passo ${passo + 1}: ${PASSOS_CRIMP[passo].t}`}>
      <rect x={0} y={0} width={640} height={250} rx={16} className="fill-slate-100 dark:fill-slate-800" />
      <rect x={20} y={100} width={J - 20} height={50} rx={10} fill="#334155" style={{ transition: "width .8s ease" }} />
      <text x={30} y={130} fontSize={13} fill="#cbd5e1" fontWeight={700}>capa do cabo UTP</text>
      {Array.from({ length: 8 }).map((_, i) => {
        const id = fios[i];
        const w = WIRES[id];
        const y = spread ? 78 + i * 12 : 118 + i * 2;
        const x2 = J + fim;
        return (
          <g key={id} style={{ transform: `translateY(${y - 118 - i * 2 + i * 2}px)`, transition: tr, opacity: passo >= 1 ? 1 : 0 }}>
            <line x1={J - 4} y1={118 + (i - 3.5) * 0} x2={x2} y2={118} stroke={w.cor} strokeWidth={9} strokeLinecap="round" style={{ transition: "all .8s ease" }} />
            {w.listrado && <line x1={J - 4} y1={118} x2={x2} y2={118} stroke="#fff" strokeWidth={9} strokeDasharray="8 8" strokeLinecap="butt" style={{ transition: "all .8s ease" }} />}
            {passo >= 3 && <text x={x2 + 12} y={122} fontSize={11} fontWeight={800} className="fill-slate-700 dark:fill-slate-200">{i + 1}</text>}
          </g>
        );
      })}
      {passo === 1 && (
        <g>
          <line x1={J} y1={168} x2={J + 110} y2={168} stroke="#0ea5e9" strokeWidth={2} />
          <text x={J + 55} y={186} textAnchor="middle" fontSize={12} fontWeight={800} fill="#0ea5e9">cerca de 30 mm</text>
        </g>
      )}
      {passo === 2 && <text x={J + 10} y={205} fontSize={12} fontWeight={800} fill="#f59e0b">destrançar no máximo 13 mm</text>}
      {passo === 4 && (
        <g>
          <line x1={J + 70} y1={60} x2={J + 70} y2={190} stroke="#ef4444" strokeDasharray="5 4" strokeWidth={2} />
          <text x={J + 75} y={205} fontSize={12} fontWeight={800} fill="#ef4444">corte: 11 a 14 mm</text>
        </g>
      )}
      {passo >= 5 && (
        <g style={{ transform: `translateX(${conectorX}px)`, transition: "transform 1s ease" }}>
          <rect x={J - 30} y={62} width={150} height={112} rx={10} fill="#e2e8f0" fillOpacity={0.55} stroke="#94a3b8" strokeWidth={3} />
          <text x={J + 45} y={56} textAnchor="middle" fontSize={12} fontWeight={800} className="fill-slate-600 dark:fill-slate-200">conector RJ45</text>
        </g>
      )}
      {passo === 6 && (
        <g>
          <rect x={J - 30} y={30} width={150} height={26} rx={6} fill="#64748b" style={{ transform: "translateY(14px)", transition: "transform .5s ease" }} />
          <rect x={J - 30} y={176} width={150} height={26} rx={6} fill="#64748b" style={{ transform: "translateY(-14px)", transition: "transform .5s ease" }} />
          <text x={J + 45} y={235} textAnchor="middle" fontSize={12} fontWeight={800} fill="#22c55e">firme, uma vez só</text>
        </g>
      )}
      {passo === 7 && (
        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}><circle cx={150 + i * 50} cy={215} r={9} fill="#34d399" style={{ animation: `cl 0.4s ${i * 0.2}s both` }} /><text x={150 + i * 50} y={240} textAnchor="middle" fontSize={10} fontWeight={800} className="fill-slate-600 dark:fill-slate-300">{i + 1}</text></g>
          ))}
          <style>{`@keyframes cl{from{opacity:.1;transform:scale(.5)}to{opacity:1;transform:scale(1)}}`}</style>
        </g>
      )}
    </svg>
  );
}

function TutorialCrimpagem() {
  const [i, setI] = React.useState(0);
  const [auto, setAuto] = React.useState(false);
  React.useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % PASSOS_CRIMP.length), 3200);
    return () => window.clearInterval(id);
  }, [auto]);
  return (
    <Caixa>
      <h3 className="text-lg font-extrabold">Crimpando um cabo em 8 passos</h3>
      <CenaCrimpagem passo={i} />
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <div className="text-sm font-extrabold">Passo {i + 1} de {PASSOS_CRIMP.length}. {PASSOS_CRIMP[i].t}</div>
        <p className="mt-1 text-sm" aria-live="polite">{PASSOS_CRIMP[i].d}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Btn sec onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}><ChevronLeft className="inline h-4 w-4" />Anterior</Btn>
        <Btn onClick={() => setI((v) => Math.min(PASSOS_CRIMP.length - 1, v + 1))} disabled={i === PASSOS_CRIMP.length - 1}>Próximo<ChevronRight className="inline h-4 w-4" /></Btn>
        <Btn sec onClick={() => setAuto((a) => !a)}>{auto ? <><Pause className="mr-1 inline h-4 w-4" />Pausar</> : <><Play className="mr-1 inline h-4 w-4" />Tocar sozinho</>}</Btn>
        <div className="ml-auto flex gap-1">{PASSOS_CRIMP.map((_, k) => <button key={k} type="button" aria-label={`Ir ao passo ${k + 1}`} onClick={() => setI(k)} className={cn("h-2.5 w-2.5 rounded-full", k === i ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600")} />)}</div>
      </div>
    </Caixa>
  );
}

/* ============ Tutorial 2: pinos, normas e crossover ============ */
const TIPOS_FIO: { id: string; nome: string; a: WireId[]; b: WireId[]; nota: string }[] = [
  { id: "d", nome: "Direto (T568B nas duas pontas)", a: NORMA_B, b: NORMA_B, nota: "Cada pino liga no mesmo número do outro lado. Usado entre PC e switch, roteador e switch." },
  { id: "c", nome: "Crossover comum (T568A e T568B)", a: NORMA_A, b: NORMA_B, nota: "Cruza os pares 1-2 e 3-6. Serve para 10/100 Mbps entre equipamentos iguais sem auto-MDIX." },
  { id: "g", nome: "Crossover gigabit", a: NORMA_A, b: ORDEM_CROSS_GIG, nota: "Cruza os quatro pares. Necessário em 1 Gbps entre equipamentos iguais sem auto-MDIX." },
  { id: "x", nome: "Defeito: fios 1 e 2 trocados", a: NORMA_B, b: [NORMA_B[1], NORMA_B[0], ...NORMA_B.slice(2)] as WireId[], nota: "O testador mostra 1 para 2 e 2 para 1. Sem link." },
];
function TutorialPinos() {
  const [k, setK] = React.useState(0);
  const t = TIPOS_FIO[k];
  const r = testar({ a: pontaPronta(t.a), b: pontaPronta(t.b) });
  return (
    <Caixa>
      <h3 className="text-lg font-extrabold">Como os pinos se ligam</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {TIPOS_FIO.map((x, i) => (
          <button key={x.id} type="button" onClick={() => setK(i)} className={cn("rounded-xl border px-3 py-1.5 text-xs font-bold", i === k ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 dark:border-slate-700")}>{x.nome}</button>
        ))}
      </div>
      <svg viewBox="0 0 640 300" className="mt-3 w-full" role="img" aria-label={t.nome}>
        <rect x={0} y={0} width={640} height={300} rx={16} className="fill-slate-100 dark:fill-slate-800" />
        <text x={110} y={26} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-slate-600 dark:fill-slate-200">Ponta A</text>
        <text x={530} y={26} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-slate-600 dark:fill-slate-200">Ponta B</text>
        {Array.from({ length: 8 }).map((_, i) => {
          const y1 = 50 + i * 30;
          const j = r.mapa[i];
          const w = WIRES[t.a[i]];
          const y2 = j === null ? y1 : 50 + j * 30;
          return (
            <g key={i}>
              <circle cx={150} cy={y1} r={9} fill={w.cor} stroke="#475569" strokeWidth={1.5} />
              {w.listrado && <circle cx={150} cy={y1} r={4} fill="#fff" />}
              <text x={120} y={y1 + 4} fontSize={11} fontWeight={800} className="fill-slate-600 dark:fill-slate-200" textAnchor="end">{i + 1}</text>
              {j !== null && <path d={`M 160 ${y1} C 280 ${y1}, 360 ${y2}, 480 ${y2}`} stroke={w.cor} strokeWidth={4} fill="none" strokeLinecap="round" style={{ transition: "d .7s ease" }} />}
              {j !== null && w.listrado && <path d={`M 160 ${y1} C 280 ${y1}, 360 ${y2}, 480 ${y2}`} stroke="#fff" strokeWidth={4} strokeDasharray="7 7" fill="none" style={{ transition: "d .7s ease" }} />}
              <circle cx={490} cy={50 + i * 30} r={9} fill={WIRES[t.b[i]].cor} stroke="#475569" strokeWidth={1.5} />
              {WIRES[t.b[i]].listrado && <circle cx={490} cy={50 + i * 30} r={4} fill="#fff" />}
              <text x={520} y={54 + i * 30} fontSize={11} fontWeight={800} className="fill-slate-600 dark:fill-slate-200">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-sm font-bold">{t.nota}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Testador: {r.descricao}</p>
    </Caixa>
  );
}

/* ============ Tutorial 3: canal de 100 m ============ */
function TutorialCanal() {
  const [a, setA] = React.useState(5);
  const [b, setB] = React.useState(88);
  const [c, setC] = React.useState(3);
  const total = a + b + c;
  const ok = total <= 100;
  const pct = (v: number) => (v / Math.max(total, 100)) * 100;
  return (
    <Caixa>
      <h3 className="text-lg font-extrabold">O canal de 100 m</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">O canal vai do equipamento ativo até a estação. Ele soma o patch cord do rack, o cabo embutido na parede e o patch cord da estação. O total não pode passar de 100 m.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
        {([["Patch cord do rack", a, setA, 0.5, 20], ["Cabo embutido", b, setB, 10, 100], ["Patch cord da estação", c, setC, 0.5, 20]] as [string, number, (n: number) => void, number, number][]).map(([n, v, f, mi, ma]) => (
          <label key={n} className="font-bold">{n}: {v} m
            <input type="range" min={mi} max={ma} step={0.5} value={v} onChange={(e) => f(Number(e.target.value))} className="mt-1 w-full" />
          </label>
        ))}
      </div>
      <div className="mt-4 flex h-10 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-600" aria-label="Barra do canal">
        <div className="bg-sky-400" style={{ width: pct(a) + "%", transition: "width .3s" }} />
        <div className="bg-slate-400" style={{ width: pct(b) + "%", transition: "width .3s" }} />
        <div className="bg-violet-400" style={{ width: pct(c) + "%", transition: "width .3s" }} />
      </div>
      <div className="relative mt-1 h-4 text-[11px] font-bold text-slate-500"><span className="absolute" style={{ left: `${Math.min(100, (100 / Math.max(total, 100)) * 100)}%`, transform: "translateX(-50%)" }}>100 m</span></div>
      <div className={cn("mt-2 rounded-xl p-3 text-sm font-extrabold", ok ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200")}>
        Total do canal: {total.toFixed(1)} m. {ok ? "Dentro do limite." : "Passou de 100 m: o link não sobe. Use um switch intermediário ou fibra."}
      </div>
      <p className="mt-2 text-xs text-slate-500">Cat5e: 1 Gbps em 100 m. Cat6: 10 Gbps até cerca de 55 m. Cat6a: 10 Gbps em 100 m.</p>
    </Caixa>
  );
}

export function Tutoriais() {
  return (
    <div className="space-y-4">
      <TutorialCrimpagem />
      <TutorialPinos />
      <TutorialCanal />
    </div>
  );
}

/* ============ Materiais de apoio ============ */
const PASSO_A_PASSO = [
  { f: "Bancada de crimpagem", p: ["Decapar com o decapador, de 18 a 40 mm de capa (use cerca de 30 mm).", "Colocar os fios na ordem T568B sem consultar a tabela.", "Destrançar no máximo 13 mm.", "Deixar de 11 a 14 mm de fio fora da capa.", "Inserir até o fundo, com a capa dentro do conector.", "Crimpar na faixa verde, uma vez só.", "Repetir na ponta B e ler o testador."] },
  { f: "Diagnóstico", p: ["Observar as luzes e o mapa de pinos A para B.", "Escolher a causa e ler a explicação.", "Anotar quais defeitos o testador simples não mostra."] },
  { f: "Rede da clínica", p: ["Calcular o canal antes de ligar (rack + embutido + estação).", "Conferir se os dois equipamentos se cruzam sozinhos (auto-MDIX).", "Ligar o modem na WAN do roteador.", "Abrir o terminal: ipconfig, ping e tracert.", "Clicar nos cabos para testar antes de entregar a obra."] },
];

const DOCS = [
  { arq: "Passo_a_Passo_Oficina_de_Cabos.docx", nome: "Passo a passo da Oficina de Cabos", sub: "Atividades do aluno para imprimir" },
  { arq: "Atividades_Redes_Aula3.docx", nome: "Atividades da Aula 3", sub: "Cabeamento: escolha de cabos, equipamentos, receita do cabo" },
  { arq: "Guia_de_Apoio_Cabeamento.docx", nome: "Guia de apoio do cabeamento", sub: "Consulta rápida durante a bancada" },
];

export function Materiais() {
  const [feitos, setFeitos] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    try {
      const v = window.localStorage.getItem("op-cabos-passo-v1");
      if (v) setFeitos(JSON.parse(v));
    } catch { /* sem armazenamento */ }
  }, []);
  const alterna = (k: string) => {
    const n = { ...feitos, [k]: !feitos[k] };
    setFeitos(n);
    try { window.localStorage.setItem("op-cabos-passo-v1", JSON.stringify(n)); } catch { /* ignora */ }
  };
  return (
    <div className="space-y-4">
      <Caixa>
        <h3 className="mb-2 text-lg font-extrabold">Materiais para baixar</h3>
        <ul className="grid gap-2 sm:grid-cols-3">
          {DOCS.map((d) => (
            <li key={d.arq}>
              <a href={`${BASE}/materiais/${d.arq}`} download className="flex h-full items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <span><span className="block text-sm font-bold">{d.nome}</span><span className="block text-xs text-slate-500">{d.sub}</span><span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300"><Download className="h-3.5 w-3.5" />Word (.docx)</span></span>
              </a>
            </li>
          ))}
        </ul>
      </Caixa>

      <Caixa>
        <h3 className="mb-2 text-lg font-extrabold">Passo a passo para marcar</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {PASSO_A_PASSO.map((g) => (
            <div key={g.f}>
              <div className="mb-1 text-sm font-extrabold text-blue-700 dark:text-blue-300">{g.f}</div>
              <ul className="space-y-1">
                {g.p.map((x, i) => {
                  const k = g.f + i;
                  return (
                    <li key={k}>
                      <button type="button" onClick={() => alterna(k)} className="flex w-full items-start gap-2 rounded-lg p-1 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800" aria-pressed={Boolean(feitos[k])}>
                        <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border", feitos[k] ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-400")}>{feitos[k] && <Check className="h-3 w-3" />}</span>
                        <span className={feitos[k] ? "text-slate-500 line-through" : ""}>{x}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Caixa>

      <Caixa>
        <h3 className="mb-2 text-lg font-extrabold">Ordem dos fios</h3>
        {([["T568B (padrão da empresa)", NORMA_B], ["T568A", NORMA_A], ["Outra ponta do crossover gigabit", ORDEM_CROSS_GIG]] as [string, WireId[]][]).map(([n, o]) => (
          <div key={n} className="mb-5">
            <div className="mb-1 text-sm font-bold">{n}. Pinos de 1 a 8</div>
            <div className="flex gap-2 pb-4">{o.map((w, i) => <Fio key={i} id={w} rot={String(i + 1)} />)}</div>
          </div>
        ))}
        <p className="text-xs text-slate-500">Cabo direto: mesma norma nas duas pontas. Crossover comum: T568A de um lado e T568B do outro. Crossover gigabit: T568A de um lado e a ordem acima do outro.</p>
      </Caixa>

      <Caixa>
        <h3 className="mb-2 text-lg font-extrabold">Categorias e limites</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-300 dark:border-slate-600"><th className="py-1 pr-3">Categoria</th><th className="py-1 pr-3">Velocidade e distância</th></tr></thead>
            <tbody>{(Object.keys(CATS) as (keyof typeof CATS)[]).map((c) => <tr key={c} className="border-b border-slate-100 dark:border-slate-800"><td className="py-1 pr-3 font-bold">{CATS[c].nome}</td><td className="py-1">{CATS[c].nota}</td></tr>)}</tbody>
          </table>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Canal de até 100 m: patch cord do rack, cabo embutido e patch cord da estação somados.</li>
          <li>Equipamentos iguais (MDIX com MDIX ou MDI com MDI) sem auto-MDIX pedem crossover.</li>
          <li>Roteador entrega o IP (DHCP). IP 169.254.x.x indica que o aparelho não recebeu endereço.</li>
          <li>Dois caminhos entre os mesmos switches ou hubs formam laço e geram tempestade de broadcast.</li>
          <li>O testador simples não mostra par dividido nem capa fora do conector.</li>
        </ul>
      </Caixa>
    </div>
  );
}

/* ============ Vídeos (incorporados) ============ */
function idYoutube(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{11})/);
  return m ? m[1] : null;
}

export function Videos() {
  const [aberto, setAberto] = React.useState<string | null>(null);
  return (
    <div className="space-y-4">
      <Caixa>
        <p className="text-sm">Toque em um vídeo para assistir aqui mesmo. O player do YouTube só carrega depois do toque. Os vídeos são de autores externos ao curso.</p>
      </Caixa>
      {APOIO.map((g) => (
        <Caixa key={g.grupo}>
          <h3 className="mb-2 text-base font-extrabold">{g.grupo}</h3>
          <ul className="space-y-2">
            {g.itens.map((i) => {
              const id = idYoutube(i.url);
              const abre = aberto === i.url;
              return (
                <li key={i.url} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase", i.tipo === "video" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200")}>{i.tipo === "video" ? "Vídeo" : "Leitura"}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">{i.titulo}</div>
                      <div className="text-xs text-slate-500">{i.quando}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {id && <Btn onClick={() => setAberto(abre ? null : i.url)}>{abre ? "Fechar vídeo" : "Assistir aqui"}</Btn>}
                        <a href={i.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">{id ? "Abrir no YouTube" : "Abrir"}</a>
                      </div>
                    </div>
                  </div>
                  {id && abre && (
                    <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl">
                      <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={i.titulo} className="h-full w-full" allow="encrypted-media; picture-in-picture; fullscreen" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Caixa>
      ))}
    </div>
  );
}
