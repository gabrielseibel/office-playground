/* Motor de simulação de cabeamento: pontas, cabos, testador, enlaces e rede. Sem dependências de interface. */

export type WireId = "WO" | "O" | "WG" | "B" | "WB" | "G" | "WBr" | "Br";

export const WIRES: Record<WireId, { nome: string; cor: string; listrado: boolean }> = {
  WO: { nome: "branco-laranja", cor: "#f59e0b", listrado: true },
  O: { nome: "laranja", cor: "#f59e0b", listrado: false },
  WG: { nome: "branco-verde", cor: "#22a04b", listrado: true },
  B: { nome: "azul", cor: "#2563eb", listrado: false },
  WB: { nome: "branco-azul", cor: "#2563eb", listrado: true },
  G: { nome: "verde", cor: "#22a04b", listrado: false },
  WBr: { nome: "branco-marrom", cor: "#8b5a2b", listrado: true },
  Br: { nome: "marrom", cor: "#8b5a2b", listrado: false },
};

export const NORMA_B: WireId[] = ["WO", "O", "WG", "B", "WB", "G", "WBr", "Br"];
export const NORMA_A: WireId[] = ["WG", "G", "WO", "B", "WB", "O", "WBr", "Br"];
/** Ordem da outra ponta de um crossover gigabit, partindo da T568A */
export const ORDEM_CROSS_GIG: WireId[] = ["WO", "O", "WG", "WBr", "Br", "G", "B", "WB"];

export type Cat = "cat5e" | "cat6" | "cat6a";
export const CATS: Record<Cat, { nome: string; maxGbps: number; precoM: number; nota: string }> = {
  cat5e: { nome: "Cat5e", maxGbps: 1, precoM: 1.8, nota: "1 Gbps em até 100 m" },
  cat6: { nome: "Cat6", maxGbps: 10, precoM: 3.2, nota: "1 Gbps em 100 m, 10 Gbps até cerca de 55 m" },
  cat6a: { nome: "Cat6a", maxGbps: 10, precoM: 6.5, nota: "10 Gbps em 100 m" },
};
export const COMPRIMENTOS = [0.5, 1, 2, 3, 5, 10, 15, 20, 30, 50, 80, 100];

export function precoCabo(cat: Cat, m: number): number {
  return Math.round((6 + m * CATS[cat].precoM) * 100) / 100;
}

export function normaDaOrdem(o: WireId[]): "A" | "B" | null {
  if (o.every((w, i) => w === NORMA_B[i])) return "B";
  if (o.every((w, i) => w === NORMA_A[i])) return "A";
  return null;
}

/* ============ Pontas ============ */
export type Ferramenta = "decapador" | "alicate-corte" | "estilete";
export type Insercao = "nao" | "ok" | "limite" | "capa-fora" | "curto" | "nao-entra";
export type Crimpagem = "nao" | "fraca" | "ok" | "forte";

export interface Ponta {
  ferramenta: Ferramenta | null;
  decapadoMm: number | null;
  feridos: WireId[];
  destrancado: boolean;
  ordem: WireId[];
  cortadoMm: number | null;
  insercao: Insercao;
  crimpagem: Crimpagem;
  destrancadoMm?: number;
}

export function pontaVazia(): Ponta {
  return { ferramenta: null, decapadoMm: null, feridos: [], destrancado: false, ordem: ["Br", "G", "WBr", "O", "WO", "B", "WG", "WB"], cortadoMm: null, insercao: "nao", crimpagem: "nao" };
}

export function pontaPronta(ordem: WireId[], extra: Partial<Ponta> = {}): Ponta {
  return { ferramenta: "decapador", decapadoMm: 30, feridos: [], destrancado: true, ordem: [...ordem], cortadoMm: 12, insercao: "ok", crimpagem: "ok", ...extra };
}

export function resultadoDecapagem(ferr: Ferramenta, mm: number): { feridos: WireId[]; aviso: string; ok: boolean } {
  const feridos: WireId[] = ferr === "decapador" ? [] : ferr === "alicate-corte" ? ["G", "Br"] : ["B"];
  const partes: string[] = [];
  if (ferr === "alicate-corte") partes.push("O alicate de corte arranhou a isolação de dois fios.");
  if (ferr === "estilete") partes.push("O estilete feriu a isolação de um fio. Além do risco de se cortar.");
  if (mm < 18) partes.push("Capa retirada de menos: não sobra fio para destrançar e alinhar.");
  else if (mm > 40) partes.push("Capa retirada demais: os pares ficam soltos e o cabo perde proteção.");
  const ok = ferr === "decapador" && mm >= 18 && mm <= 40;
  if (ok) partes.push("Decapagem limpa, com a isolação dos fios intacta.");
  return { feridos, aviso: partes.join(" "), ok };
}

export function resultadoInsercao(cortadoMm: number): Insercao {
  if (cortadoMm < 9) return "curto";
  if (cortadoMm <= 10) return "limite";
  if (cortadoMm <= 14) return "ok";
  if (cortadoMm <= 19) return "capa-fora";
  return "nao-entra";
}

export function textoInsercao(i: Insercao): string {
  switch (i) {
    case "ok": return "Fios no fundo e a capa entrou até a trava. Boa inserção.";
    case "limite": return "Os fios encostaram no fundo, mas a capa ficou longe da trava. A ponta fica frágil.";
    case "capa-fora": return "A capa ficou do lado de fora do conector. Passa no testador, mas puxões soltam os fios.";
    case "curto": return "Os fios ficaram curtos e não alcançaram os contatos.";
    case "nao-entra": return "Os fios estão longos demais e não entram. Corte de novo.";
    default: return "";
  }
}

/** Pinos (0 a 7) abertos por crimpagem fraca */
const PINOS_ABERTOS_FRACA = [1, 4, 6];

export type EstadoPino = "ok" | "aberto" | "pisca";

export function estadoPinos(p: Ponta): EstadoPino[] {
  const e: EstadoPino[] = [];
  for (let i = 0; i < 8; i++) {
    let s: EstadoPino = "ok";
    if (p.insercao === "curto" || p.insercao === "nao" || p.insercao === "nao-entra") s = "aberto";
    else if (p.crimpagem === "nao") s = "aberto";
    else if (p.crimpagem === "fraca" && PINOS_ABERTOS_FRACA.includes(i)) s = "aberto";
    else if (p.feridos.includes(p.ordem[i])) s = "pisca";
    e.push(s);
  }
  return e;
}

/* ============ Cabo ============ */
export type TipoCabo = "direto" | "crossover" | "crossover-gig";

export interface Cabo {
  id: string;
  nome: string;
  cat: Cat;
  comprimentoM: number;
  a: Ponta;
  b: Ponta;
  planejado: TipoCabo;
  origem: "bancada" | "loja" | "existente";
  fator?: number;
}

export type ClasseCabo = "direto" | "crossover-fast" | "crossover-gig" | "misto" | "defeito";

export interface Teste {
  leds: EstadoPino[];
  mapa: (number | null)[];
  classe: ClasseCabo;
  abertos: number[];
  piscando: number[];
  descricao: string;
}

export function testar(c: Pick<Cabo, "a" | "b">): Teste {
  const ea = estadoPinos(c.a);
  const eb = estadoPinos(c.b);
  const mapa: (number | null)[] = [];
  const leds: EstadoPino[] = [];
  const abertos: number[] = [];
  const piscando: number[] = [];
  for (let i = 0; i < 8; i++) {
    const w = c.a.ordem[i];
    const j = c.b.ordem.indexOf(w);
    if (ea[i] === "aberto" || eb[j] === "aberto") {
      mapa.push(null);
      leds.push("aberto");
      abertos.push(i);
    } else {
      mapa.push(j);
      const pisca = ea[i] === "pisca" || eb[j] === "pisca";
      leds.push(pisca ? "pisca" : "ok");
      if (pisca) piscando.push(i);
    }
  }
  const classe = classificar(mapa);
  const descricao = descreverTeste(mapa, classe, abertos, piscando);
  return { leds, mapa, classe, abertos, piscando, descricao };
}

function classificar(m: (number | null)[]): ClasseCabo {
  const p10 = [0, 1, 2, 5];
  const p45 = [3, 4, 6, 7];
  if (p10.some((i) => m[i] === null)) return "defeito";
  const d10 = m[0] === 0 && m[1] === 1 && m[2] === 2 && m[5] === 5;
  const c10 = m[0] === 2 && m[1] === 5 && m[2] === 0 && m[5] === 1;
  if (!d10 && !c10) return "defeito";
  if (p45.some((i) => m[i] === null)) return d10 ? "misto" : "misto";
  const d45 = m[3] === 3 && m[4] === 4 && m[6] === 6 && m[7] === 7;
  const c45 = m[3] === 6 && m[4] === 7 && m[6] === 3 && m[7] === 4;
  if (d10 && d45) return "direto";
  if (c10 && d45) return "crossover-fast";
  if (c10 && c45) return "crossover-gig";
  return "misto";
}

function descreverTeste(m: (number | null)[], classe: ClasseCabo, abertos: number[], piscando: number[]): string {
  const partes: string[] = [];
  if (abertos.length) partes.push("Sem luz nos pinos " + abertos.map((i) => i + 1).join(", ") + ": fio sem contato.");
  if (piscando.length) partes.push("Luz piscando nos pinos " + piscando.map((i) => i + 1).join(", ") + ": mau contato.");
  const trocados: string[] = [];
  m.forEach((j, i) => {
    if (j !== null && j !== i) trocados.push(`${i + 1}→${j + 1}`);
  });
  if (classe === "direto") partes.push("As luzes acendem de 1 a 8 na mesma ordem: cabo direto.");
  else if (classe === "crossover-fast") partes.push("Pares 1-2 e 3-6 cruzados: crossover para 10/100 Mbps. Os pares 4-5 e 7-8 seguem retos.");
  else if (classe === "crossover-gig") partes.push("Os quatro pares estão cruzados: crossover gigabit completo.");
  else if (trocados.length) partes.push("Ligações cruzadas: " + trocados.join(", ") + ".");
  return partes.join(" ");
}

export interface Inspecao {
  normaA: "A" | "B" | null;
  normaB: "A" | "B" | null;
  paresDivididos: boolean;
  problemas: string[];
}

/** O que o testador simples NÃO mostra, mas o técnico percebe */
export function inspecionar(c: Pick<Cabo, "a" | "b">): Inspecao {
  const normaA = normaDaOrdem(c.a.ordem);
  const normaB = normaDaOrdem(c.b.ordem);
  const t = testar(c);
  const problemas: string[] = [];
  const retoOuCruz = t.classe === "direto" || t.classe === "crossover-fast" || t.classe === "crossover-gig";
  const paresDivididos = retoOuCruz && (normaA === null || normaB === null) && t.classe === "direto";
  if (paresDivididos) problemas.push("Ordem fora da norma nas duas pontas: o testador passa, mas os fios de um mesmo par ficaram separados (par dividido). A rede fica lenta e perde pacotes.");
  for (const [rot, p] of [["A", c.a], ["B", c.b]] as const) {
    if ((p.destrancadoMm ?? 0) > 16) problemas.push(`Ponta ${rot}: fios destrançados demais (${p.destrancadoMm} mm). O máximo ideal é 13 mm. Aumenta a interferência entre pares.`);
    if (p.insercao === "capa-fora") problemas.push(`Ponta ${rot}: capa fora do conector. Frágil.`);
    if (p.insercao === "limite") problemas.push(`Ponta ${rot}: capa longe da trava. Frágil.`);
    if (p.crimpagem === "forte") problemas.push(`Ponta ${rot}: conector rachado por crimpagem forte demais.`);
    if (p.feridos.length) problemas.push(`Ponta ${rot}: isolação ferida na decapagem.`);
  }
  return { normaA, normaB, paresDivididos, problemas };
}

/* ============ Enlace de um cabo (desempenho) ============ */
export type EstadoEnlace = "ok" | "instavel" | "sem-link";
export interface Enlace {
  estado: EstadoEnlace;
  mbps: number;
  tipo: "reto" | "cruzado" | "invalido";
  motivos: string[];
  perda: number;
}

export function mbpsPorCategoria(cat: Cat, metros: number): number {
  if (metros > 100) return 0;
  if (cat === "cat5e") return 1000;
  if (cat === "cat6") return metros <= 55 ? 10000 : 1000;
  return 10000;
}

export function enlaceDoCabo(c: Pick<Cabo, "a" | "b" | "cat" | "comprimentoM">): Enlace {
  const t = testar(c);
  const insp = inspecionar(c);
  const motivos: string[] = [];
  if (c.comprimentoM > 100) return { estado: "sem-link", mbps: 0, tipo: "invalido", motivos: ["Cabo com mais de 100 m: o sinal não chega."], perda: 100 };
  if (t.classe === "defeito") {
    return { estado: "sem-link", mbps: 0, tipo: "invalido", motivos: [t.abertos.length ? "Fio aberto nos pinos 1, 2, 3 ou 6." : "Fios fora de ordem nos pares usados pela rede.", t.descricao], perda: 100 };
  }
  let mbps = mbpsPorCategoria(c.cat, c.comprimentoM);
  const tipo = t.classe === "direto" ? "reto" : t.classe === "misto" ? "reto" : "cruzado";
  if (t.classe === "misto") {
    mbps = Math.min(mbps, 100);
    motivos.push("Pares 4-5 e 7-8 com defeito ou fora de ordem: a conexão cai para 100 Mbps.");
  }
  if (t.classe === "crossover-fast") {
    mbps = Math.min(mbps, 100);
    motivos.push("Crossover só dos pares 1-2 e 3-6: funciona em 100 Mbps. Em 1 Gbps seria preciso cruzar os quatro pares.");
  }
  let perda = 0;
  let estado: EstadoEnlace = "ok";
  if ((c.a.destrancadoMm ?? 0) > 16 || (c.b.destrancadoMm ?? 0) > 16) {
    mbps = Math.min(mbps, 100);
    motivos.push("Destrançado demais: interferência entre pares (diafonia), a conexão cai para 100 Mbps.");
  }
  if (t.piscando.length) {
    estado = "instavel";
    perda = 40;
    motivos.push("Mau contato: o link cai e volta.");
  }
  if (insp.paresDivididos) {
    estado = "instavel";
    perda = Math.max(perda, 25);
    mbps = Math.min(mbps, 100);
    motivos.push("Par dividido: conexão lenta e com perda de pacotes.");
  }
  return { estado, mbps, tipo, motivos, perda };
}

/* ============ Rede ============ */
export type TipoDisp = "pc" | "impressora" | "servidor" | "camera" | "switch" | "hub" | "roteador" | "modem" | "patch" | "tomada";
export const ATIVOS: TipoDisp[] = ["pc", "impressora", "servidor", "camera", "switch", "hub", "roteador", "modem"];

export interface Porta {
  id: string;
  rot: string;
  mbps: number;
  classe: "MDI" | "MDIX";
  auto: boolean;
  papel: "lan" | "wan" | "passiva";
  /** porta de um dispositivo passivo ligada por cabeamento fixo a outra porta */
  fixo?: { para: string; comprimentoM: number; cat: Cat };
}

export interface Disp {
  id: string;
  tipo: TipoDisp;
  nome: string;
  x: number;
  y: number;
  andar?: number;
  local?: string;
  portas: Porta[];
  nota?: string;
}

export interface Ligacao {
  id: string;
  a: string;
  b: string;
  cabo: Cabo;
}

export interface LinkAtivo {
  a: string; // porta ativa
  b: string; // porta ativa
  estado: EstadoEnlace;
  mbps: number;
  perda: number;
  cabosIds: string[];
  comprimentoTotal: number;
  motivos: string[];
}

export interface Host {
  dispId: string;
  portaId: string | null;
  link: LinkAtivo | null;
  ip: string | null;
  gateway: string | null;
  apipa: boolean;
  dominio: number;
  tempestade: boolean;
  online: boolean;
}

export interface Avaliacao {
  links: LinkAtivo[];
  hosts: Record<string, Host>;
  internet: boolean;
  dominioRoteador: number | null;
  tempestades: number[];
  hubNoCaminho: Record<string, boolean>;
  custo: number;
  avisos: string[];
}

function donoDaPorta(discos: Disp[], portaId: string): Disp | undefined {
  return discos.find((d) => d.portas.some((p) => p.id === portaId));
}
function portaPorId(discos: Disp[], id: string): Porta | undefined {
  for (const d of discos) {
    const p = d.portas.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

export function distanciaM(a: Disp, b: Disp, escala: number): number {
  if (a.local && a.local === b.local) return Math.hypot(a.x - b.x, a.y - b.y) * 0.03;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = ((a.andar ?? 0) - (b.andar ?? 0)) * 4 / Math.max(escala, 0.0001);
  return Math.hypot(dx, dy, dz) * escala;
}

/** Percorre uma porta ativa até a próxima porta ativa, atravessando tomadas e patch panels */
function seguir(discos: Disp[], ligs: Ligacao[], inicio: string): { fim: string; cabos: Cabo[]; ids: string[] } | null {
  const cabos: Cabo[] = [];
  const ids: string[] = [];
  let atual = inicio;
  const visitadas = new Set<string>();
  for (let guarda = 0; guarda < 12; guarda++) {
    const lig = ligs.find((l) => (l.a === atual || l.b === atual) && !visitadas.has(l.id));
    if (!lig) return null;
    visitadas.add(lig.id);
    cabos.push(lig.cabo);
    ids.push(lig.id);
    const prox = lig.a === atual ? lig.b : lig.a;
    const d = donoDaPorta(discos, prox);
    if (!d) return null;
    if (ATIVOS.includes(d.tipo)) return { fim: prox, cabos, ids };
    const p = portaPorId(discos, prox);
    if (!p?.fixo) return null;
    // atravessa o cabeamento fixo
    cabos.push({
      id: "fixo-" + prox, nome: "Cabeamento horizontal", cat: p.fixo.cat, comprimentoM: p.fixo.comprimentoM,
      a: pontaPronta(NORMA_B), b: pontaPronta(NORMA_B), planejado: "direto", origem: "existente",
    });
    atual = p.fixo.para;
    const d2 = donoDaPorta(discos, atual);
    if (d2 && ATIVOS.includes(d2.tipo)) return { fim: atual, cabos, ids };
  }
  return null;
}

export function avaliarRede(discos: Disp[], ligs: Ligacao[], escala: number): Avaliacao {
  const avisos: string[] = [];
  const links: LinkAtivo[] = [];
  const vistos = new Set<string>();
  const portasAtivas = discos.filter((d) => ATIVOS.includes(d.tipo)).flatMap((d) => d.portas.map((p) => p.id));
  for (const pid of portasAtivas) {
    const s = seguir(discos, ligs, pid);
    if (!s || s.fim === pid) continue;
    const key = [pid, s.fim].sort().join("|");
    if (vistos.has(key)) continue;
    vistos.add(key);
    // a próxima porta precisa também chegar aqui
    const volta = seguir(discos, ligs, s.fim);
    if (!volta || volta.fim !== pid) continue;
    const total = s.cabos.reduce((a, c) => a + c.comprimentoM, 0);
    const pa = portaPorId(discos, pid)!;
    const pb = portaPorId(discos, s.fim)!;
    const motivos: string[] = [];
    let estado: EstadoEnlace = "ok";
    let perda = 0;
    let mbps = Math.min(pa.mbps, pb.mbps);
    let cruzamentos = 0;
    let semLink = false;
    let capacidadeCabos = 10000;
    for (const c of s.cabos) {
      const e = enlaceDoCabo(c);
      if (e.estado === "sem-link") {
        semLink = true;
        motivos.push(...e.motivos);
      } else {
        if (e.estado === "instavel") estado = "instavel";
        perda = Math.max(perda, e.perda);
        capacidadeCabos = Math.min(capacidadeCabos, e.mbps, mbpsPorCategoria(c.cat, total <= 55 ? Math.min(c.comprimentoM, 55) : 100));
        if (e.tipo === "cruzado") cruzamentos += 1;
        motivos.push(...e.motivos);
      }
    }
    if (total > 100) {
      semLink = true;
      motivos.push(`O canal soma ${total.toFixed(1)} m. O limite é 100 m (90 m de cabeamento fixo e até 10 m de cabos de ligação).`);
    }
    // limite de 10 Gbps por comprimento total para cat6
    if (!semLink && s.cabos.some((c) => c.cat === "cat6") && total > 55) capacidadeCabos = Math.min(capacidadeCabos, 1000);
    if (!semLink) mbps = Math.min(mbps, capacidadeCabos);
    // MDI / MDIX
    const algumAuto = pa.auto || pb.auto;
    const cruzado = cruzamentos % 2 === 1;
    if (!semLink && !algumAuto) {
      const mesma = pa.classe === pb.classe;
      if (mesma && !cruzado) {
        semLink = true;
        motivos.push("Os dois equipamentos são do mesmo tipo e não ajustam sozinhos: é preciso cabo crossover.");
      } else if (!mesma && cruzado) {
        semLink = true;
        motivos.push("Equipamentos de tipos diferentes pedem cabo direto. Esse cabo é crossover.");
      }
      mbps = Math.min(mbps, 100);
    }
    if (semLink) {
      links.push({ a: pid, b: s.fim, estado: "sem-link", mbps: 0, perda: 100, cabosIds: s.ids, comprimentoTotal: total, motivos });
    } else {
      links.push({ a: pid, b: s.fim, estado, mbps, perda, cabosIds: s.ids, comprimentoTotal: total, motivos });
    }
  }

  // portas ativas sem cabo na outra ponta ainda: sem link (não entram em `links`)
  const ativos = discos.filter((d) => ATIVOS.includes(d.tipo));
  const dispDaPorta = (pid: string) => donoDaPorta(discos, pid)!;

  // domínios de camada 2 (switch, hub, roteador LAN)
  const idx: Record<string, number> = {};
  ativos.forEach((d, i) => (idx[d.id] = i));
  const pai = ativos.map((_, i) => i);
  const achar = (i: number): number => (pai[i] === i ? i : (pai[i] = achar(pai[i])));
  const juntar = (a: number, b: number) => {
    pai[achar(a)] = achar(b);
  };
  const arestasL2: [string, string][] = [];
  for (const l of links) {
    if (l.estado === "sem-link") continue;
    const pa = portaPorId(discos, l.a)!;
    const pb = portaPorId(discos, l.b)!;
    if (pa.papel === "wan" || pb.papel === "wan") continue;
    const da = dispDaPorta(l.a);
    const db = dispDaPorta(l.b);
    juntar(idx[da.id], idx[db.id]);
    arestasL2.push([da.id, db.id]);
  }
  // tempestade: ciclo entre equipamentos de camada 2
  const tempestades = new Set<number>();
  const porDom: Record<number, { nos: Set<string>; arestas: number }> = {};
  for (const d of ativos) {
    const r = achar(idx[d.id]);
    (porDom[r] ??= { nos: new Set(), arestas: 0 }).nos.add(d.id);
  }
  for (const [a, b] of arestasL2) {
    const r = achar(idx[a]);
    porDom[r].arestas += 1;
    void b;
  }
  for (const k of Object.keys(porDom)) {
    const dom = porDom[Number(k)];
    if (dom.arestas > dom.nos.size - 1) tempestades.add(Number(k));
  }

  const roteador = ativos.find((d) => d.tipo === "roteador");
  const dominioRoteador = roteador ? achar(idx[roteador.id]) : null;
  // internet
  let internet = false;
  if (roteador) {
    const wan = roteador.portas.find((p) => p.papel === "wan");
    const lw = links.find((l) => (l.a === wan?.id || l.b === wan?.id) && l.estado !== "sem-link");
    if (lw) {
      const outra = lw.a === wan?.id ? lw.b : lw.a;
      const d = dispDaPorta(outra);
      const po = portaPorId(discos, outra);
      if (d.tipo === "modem" && po?.papel === "lan") internet = true;
    }
  }

  const hosts: Record<string, Host> = {};
  const hubNoCaminho: Record<string, boolean> = {};
  let contadorIp = 10;
  for (const d of ativos) {
    if (!["pc", "impressora", "servidor", "camera"].includes(d.tipo)) continue;
    const porta = d.portas[0];
    const link = links.find((l) => l.a === porta.id || l.b === porta.id) ?? null;
    const dom = achar(idx[d.id]);
    const tempestade = tempestades.has(dom);
    const temLink = Boolean(link && link.estado !== "sem-link");
    let ip: string | null = null;
    let gw: string | null = null;
    let apipa = false;
    if (temLink) {
      if (roteador && dom === dominioRoteador && !tempestade) {
        ip = "192.168.1." + contadorIp++;
        gw = "192.168.1.1";
      } else {
        apipa = true;
        ip = "169.254." + (20 + (idx[d.id] % 200)) + "." + (10 + ((idx[d.id] * 7) % 200));
      }
    }
    // hub no domínio
    hubNoCaminho[d.id] = ativos.some((x) => x.tipo === "hub" && achar(idx[x.id]) === dom);
    hosts[d.id] = { dispId: d.id, portaId: porta.id, link: link, ip, gateway: gw, apipa, dominio: dom, tempestade, online: temLink && !tempestade && !apipa };
  }

  const custo = ligs.reduce((a, l) => (l.cabo.origem === "loja" ? a + precoCabo(l.cabo.cat, l.cabo.comprimentoM) * (l.cabo.fator ?? 1) : a), 0);
  void escala;
  return { links, hosts, internet, dominioRoteador, tempestades: [...tempestades], hubNoCaminho, custo, avisos };
}

/* ============ Terminal ============ */
export function executarComando(entrada: string, hostId: string, discos: Disp[], av: Avaliacao): string[] {
  const txt = entrada.trim();
  const [cmd, ...resto] = txt.split(/\s+/);
  const h = av.hosts[hostId];
  const d = discos.find((x) => x.id === hostId)!;
  const c = (cmd || "").toLowerCase();
  if (!c) return [];
  if (c === "help" || c === "ajuda") return ["Comandos: ipconfig, ipconfig /renew, ping <ip ou nome>, tracert <ip ou nome>, cls"];
  const nomes: Record<string, string> = {};
  for (const x of discos) {
    const hh = av.hosts[x.id];
    if (hh?.ip) nomes[x.nome.toLowerCase()] = hh.ip;
  }
  if (c === "ipconfig") {
    const renovar = resto[0]?.toLowerCase() === "/renew";
    const L: string[] = [];
    if (renovar) L.push("Renovando a configuração de IP...");
    L.push("Configuração de IP do Windows", "", "Adaptador Ethernet Ethernet:", "");
    if (!h?.link || h.link.estado === "sem-link") {
      L.push("   Estado da mídia. . . . . . . . . . . . : Mídia desconectada", "   Sufixo DNS específico de conexão. . . . :");
      if (h?.link?.estado === "sem-link") L.push("   (A luz de link não acende. Confira o cabo.)");
    } else {
      L.push("   Sufixo DNS específico de conexão. . . . : clinica.local");
      if (h.apipa) L.push(`   Endereço IPv4 de Autoconfiguração . . . : ${h.ip}`, "   Máscara de Sub-rede . . . . . . . . . . : 255.255.0.0", "   Gateway Padrão. . . . . . . . . . . . . :");
      else if (h.tempestade) L.push("   Endereço IPv4. . . . . . . . . . . . . : (aguardando o servidor DHCP)", "   Dica: a rede está sobrecarregada.");
      else L.push(`   Endereço IPv4. . . . . . . . . . . . . : ${h.ip}`, "   Máscara de Sub-rede . . . . . . . . . . : 255.255.255.0", `   Gateway Padrão. . . . . . . . . . . . . : ${h.gateway}`);
      L.push(`   Velocidade do link . . . . . . . . . . . : ${h.link.mbps >= 1000 ? h.link.mbps / 1000 + " Gbps" : h.link.mbps + " Mbps"}`);
    }
    return L;
  }
  if (c === "ping" || c === "tracert") {
    const alvoTxt = resto[0];
    if (!alvoTxt) return ["Uso: " + c + " <endereço>"];
    const alvoLower = alvoTxt.toLowerCase();
    const externo = ["8.8.8.8", "1.1.1.1", "google.com", "www.google.com", "senac.br"].includes(alvoLower);
    const ipAlvo = externo ? (/^\d/.test(alvoLower) ? alvoLower : "142.250.219.46") : nomes[alvoLower] ?? alvoLower;
    const alvoHost = externo ? null : Object.values(av.hosts).find((x) => x.ip === ipAlvo);
    const L: string[] = [];
    if (!h?.link || h.link.estado === "sem-link") return [`Disparando contra ${alvoTxt}:`, "Falha geral. Cabo de rede desconectado ou sem link."];
    if (h.tempestade) return [`Disparando contra ${alvoTxt}:`, "Esgotado o tempo limite do pedido.", "Esgotado o tempo limite do pedido.", "Esgotado o tempo limite do pedido.", "Esgotado o tempo limite do pedido."];
    if (!h.ip) return ["Falha geral."];
    let alcanca = false;
    let motivo = "Host de destino inacessível.";
    let ipOrigemOk = !h.apipa;
    if (externo) {
      alcanca = av.internet && ipOrigemOk && Boolean(h.gateway);
      if (!ipOrigemOk) motivo = "Falha geral: sem gateway. Seu IP é de autoconfiguração (169.254...).";
      else if (!av.internet) motivo = "Esgotado o tempo limite do pedido. (O roteador não tem internet.)";
    } else if (alvoHost) {
      const origemOk = h.dominio === alvoHost.dominio && alvoHost.link && alvoHost.link.estado !== "sem-link" && !alvoHost.tempestade;
      alcanca = Boolean(origemOk) && (!h.apipa || alvoHost.apipa);
      if (!origemOk) motivo = "Host de destino inacessível.";
    } else if (ipAlvo === "192.168.1.1") alcanca = !h.apipa;
    if (c === "ping") {
      L.push(`Disparando contra ${alvoTxt} com 32 bytes de dados:`);
      const perda = Math.max(h.link.perda, alvoHost?.link?.perda ?? 0);
      let recebidos = 0;
      for (let i = 0; i < 4; i++) {
        const perdeu = !alcanca || (perda > 0 && (i * 100) / 4 < perda * 0.9 && i % 2 === 1);
        if (perdeu) L.push(alcanca ? "Esgotado o tempo limite do pedido." : motivo);
        else {
          recebidos += 1;
          const t = externo ? 18 + i * 3 : h.link.mbps >= 1000 ? 1 : 2 + i;
          L.push(`Resposta de ${ipAlvo}: bytes=32 tempo=${t}ms TTL=${externo ? 117 : 64}`);
        }
      }
      L.push("", `Estatísticas do Ping para ${ipAlvo}:`, `    Pacotes: Enviados = 4, Recebidos = ${recebidos}, Perdidos = ${4 - recebidos} (${Math.round(((4 - recebidos) / 4) * 100)}% de perda)`);
    } else {
      L.push(`Rastreando a rota para ${alvoTxt}`, "");
      if (!alcanca) L.push("  1     *        *        *     Esgotado o tempo limite do pedido.");
      else {
        L.push("  1    <1 ms    <1 ms    <1 ms  192.168.1.1");
        if (externo) L.push("  2     8 ms     9 ms     8 ms  179.0.0.1", `  3    18 ms    17 ms    18 ms  ${ipAlvo}`);
        else L.push(`  2    <1 ms    <1 ms    <1 ms  ${ipAlvo}`);
      }
    }
    void d;
    return L;
  }
  return [`'${cmd}' não é reconhecido como um comando interno. Digite help.`];
}
