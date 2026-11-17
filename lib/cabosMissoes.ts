import { type Disp, type Ligacao, type Porta, type Avaliacao, type Cabo, NORMA_B, pontaPronta, ATIVOS, ORDEM_CROSS_GIG, NORMA_A } from "./cabos";

const P = (id: string, rot: string, o: Partial<Porta> = {}): Porta => ({ id, rot, mbps: 1000, classe: "MDI", auto: true, papel: "lan", ...o });

export interface Meta { texto: string; ok: (av: Avaliacao, d: Disp[], l: Ligacao[]) => boolean }
export interface Missao {
  id: string;
  titulo: string;
  nivel: number;
  historia: string;
  dica: string;
  escala: number;
  orcamento: number;
  disp: Disp[];
  ligacoes: Ligacao[];
  metas: Meta[];
  conceitos: string[];
}

function cabo(id: string, a: Parameters<typeof pontaPronta>, b: Parameters<typeof pontaPronta>, cat: Cabo["cat"] = "cat5e", m = 3, nome = "Cabo existente"): Cabo {
  return { id, nome, cat, comprimentoM: m, a: pontaPronta(...a), b: pontaPronta(...b), planejado: "direto", origem: "existente" };
}

const modem = (id = "modem", x = 60, y = 60, local?: string): Disp => ({ id, tipo: "modem", nome: "Modem da operadora", x, y, local, portas: [P(id + "-lan", "LAN", { classe: "MDIX" })] });
const roteador = (id = "rot", x = 260, y = 60, local?: string, nLan = 4): Disp => ({
  id, tipo: "roteador", nome: "Roteador Wi-Fi", x, y, local,
  portas: [P(id + "-wan", "WAN", { papel: "wan" }), ...Array.from({ length: nLan }, (_, i) => P(`${id}-l${i + 1}`, "LAN" + (i + 1), { classe: "MDIX" }))],
});
const sw = (id: string, nome: string, x: number, y: number, n = 5, extra: Partial<Porta> = {}, local?: string): Disp => ({
  id, tipo: "switch", nome, x, y, local, portas: Array.from({ length: n }, (_, i) => P(`${id}-p${i + 1}`, "P" + (i + 1), { classe: "MDIX", ...extra })),
});
const pc = (id: string, nome: string, x: number, y: number, extra: Partial<Porta> = {}, local?: string): Disp => ({ id, tipo: "pc", nome, x, y, local, portas: [P(id + "-nic", "NIC", extra)] });

const hostsOk = (av: Avaliacao, ids: string[]) => ids.every((i) => av.hosts[i]?.online);
const semInstavel = (av: Avaliacao) => av.links.every((l) => l.estado === "ok");

export const MISSOES: Missao[] = [
  {
    id: "m1", titulo: "O primeiro ponto", nivel: 1, escala: 0.03, orcamento: 70,
    historia: "Consultório novo. A operadora instalou o modem. Falta ligar o roteador e o computador da recepção para ter internet.",
    dica: "Modem LAN para a porta WAN do roteador. Depois uma porta LAN do roteador para o computador. Cabos diretos comuns.",
    conceitos: ["Cabo direto", "WAN x LAN", "DHCP"],
    disp: [modem("modem", 70, 190), roteador("rot", 330, 170), pc("pc1", "PC da recepção", 650, 190)],
    ligacoes: [],
    metas: [
      { texto: "Roteador ligado ao modem pela porta WAN", ok: (av) => av.internet },
      { texto: "PC da recepção com IP e rede funcionando", ok: (av) => hostsOk(av, ["pc1"]) },
    ],
  },
  {
    id: "m2", titulo: "A rede da recepção", nivel: 2, escala: 0.025, orcamento: 190,
    historia: "Recepção com 3 computadores e uma impressora. O roteador só tem 4 portas LAN, então um switch precisa entrar.",
    dica: "O roteador entrega o IP (DHCP). Um switch liga os equipamentos, mas não cria rede sozinho: precisa estar ligado ao roteador.",
    conceitos: ["Switch", "Topologia em estrela", "Escolha do comprimento"],
    disp: [
      modem("modem", 60, 50), roteador("rot", 300, 50), sw("sw", "Switch 8 portas", 300, 220, 8),
      pc("pc1", "PC 1", 90, 360), pc("pc2", "PC 2", 300, 385), pc("pc3", "PC 3", 510, 360),
      { id: "imp", tipo: "impressora", nome: "Impressora de rede", x: 690, y: 220, portas: [P("imp-nic", "NIC")] },
    ],
    ligacoes: [],
    metas: [
      { texto: "Internet funcionando", ok: (av) => av.internet },
      { texto: "Os 3 PCs e a impressora online", ok: (av) => hostsOk(av, ["pc1", "pc2", "pc3", "imp"]) },
      { texto: "Gastar no máximo R$ 190 em cabos", ok: (av) => av.custo <= 190 },
    ],
  },
  {
    id: "m3", titulo: "Cabeamento estruturado e a regra dos 100 m", nivel: 3, escala: 0.25, orcamento: 130,
    historia: "Um prédio comercial. O cabeamento horizontal já está embutido: 60 m até a sala 1 e 88 m até a sala 2. Você liga o rack aos patch cords e às estações.",
    dica: "O canal completo (patch cord do rack + cabo embutido + patch cord da estação) tem no máximo 100 m. Na sala 2 já gastaram 88 m.",
    conceitos: ["Patch panel", "Canal de 100 m", "Patch cord"],
    disp: [
      modem("modem", 40, 40, "rack"), roteador("rot", 190, 40, "rack"), sw("sw", "Switch do rack", 190, 190, 5, {}, "rack"),
      { id: "pp", tipo: "patch", nome: "Patch panel", x: 190, y: 330, local: "rack", portas: [
        P("pp-1", "01", { papel: "passiva", fixo: { para: "t1-p", comprimentoM: 60, cat: "cat5e" } }),
        P("pp-2", "02", { papel: "passiva", fixo: { para: "t2-p", comprimentoM: 88, cat: "cat5e" } }),
      ] },
      { id: "t1", tipo: "tomada", nome: "Tomada sala 1", x: 520, y: 140, local: "sala1", portas: [P("t1-p", "RJ45", { papel: "passiva", fixo: { para: "pp-1", comprimentoM: 60, cat: "cat5e" } })] },
      pc("pc1", "PC sala 1", 650, 140, {}, "sala1"),
      { id: "t2", tipo: "tomada", nome: "Tomada sala 2", x: 520, y: 340, local: "sala2", portas: [P("t2-p", "RJ45", { papel: "passiva", fixo: { para: "pp-2", comprimentoM: 88, cat: "cat5e" } })] },
      pc("pc2", "PC sala 2", 650, 340, {}, "sala2"),
    ],
    ligacoes: [],
    metas: [
      { texto: "Internet funcionando", ok: (av) => av.internet },
      { texto: "Os dois PCs online", ok: (av) => hostsOk(av, ["pc1", "pc2"]) },
      { texto: "Nenhum canal com problema (todos os links estáveis)", ok: (av) => semInstavel(av) && av.links.length >= 4 },
    ],
  },
  {
    id: "m4", titulo: "Dois andares, um servidor e muita distância", nivel: 4, escala: 0.2, orcamento: 900,
    historia: "O servidor do laboratório fica no andar de cima, longe do rack. A ligação direta passaria de 100 m. Existe um switch intermediário no corredor. A ligação entre os switches precisa de 10 Gbps para o backup noturno.",
    dica: "Nenhum cabo pode passar de 100 m. Quebre a distância usando o switch do corredor. Cat6 só faz 10 Gbps até cerca de 55 m. Mais que isso, só Cat6a.",
    conceitos: ["Limite de 100 m", "Cat6 x Cat6a", "Backbone"],
    disp: [
      modem("modem", 40, 40, "rack"), roteador("rot", 40, 170, "rack"),
      sw("sw1", "Switch do rack", 190, 170, 5, { mbps: 10000 }, "rack"),
      sw("sw2", "Switch do corredor", 540, 170, 5, { mbps: 10000 }, "lab"),
      { id: "srv", tipo: "servidor", nome: "Servidor do laboratório", x: 720, y: 90, local: "lab", portas: [P("srv-nic", "NIC", { mbps: 10000 })] },
      pc("pc1", "PC do laboratório", 720, 290, {}, "lab"),
    ],
    ligacoes: [],
    metas: [
      { texto: "Internet funcionando", ok: (av) => av.internet },
      { texto: "Servidor e PC online", ok: (av) => hostsOk(av, ["srv", "pc1"]) },
      { texto: "Ligação entre os dois switches a 10 Gbps", ok: (av, d) => av.links.some((l) => { const a = d.find((x) => x.portas.some((p) => p.id === l.a)); const b = d.find((x) => x.portas.some((p) => p.id === l.b)); return a && b && [a.id, b.id].sort().join() === "sw1,sw2" && l.mbps >= 10000 && l.estado === "ok"; }) },
    ],
  },
  {
    id: "m5", titulo: "Equipamento legado: hub, switch antigo e crossover", nivel: 5, escala: 0.03, orcamento: 280,
    historia: "Um laboratório ainda usa um switch antigo (sem auto-MDIX) e uma impressora de 100 Mbps. O hub fica na bancada. Ligar errado derruba tudo.",
    dica: "Dois equipamentos iguais (MDIX com MDIX) sem auto-MDIX pedem crossover. Faça na Bancada ou compre pronto (mais caro). Cuidado com laços: dois caminhos entre os mesmos equipamentos geram tempestade de broadcast.",
    conceitos: ["MDI / MDIX", "Crossover", "Hub x Switch", "Loop"],
    disp: [
      modem("modem", 50, 40), roteador("rot", 250, 40, undefined, 1),
      sw("swa", "Switch antigo (sem auto-MDIX)", 250, 200, 5, { auto: false, mbps: 100 }),
      { id: "hub", tipo: "hub", nome: "Hub 4 portas", x: 520, y: 200, portas: Array.from({ length: 4 }, (_, i) => P(`hub-p${i + 1}`, "P" + (i + 1), { classe: "MDIX", auto: false, mbps: 100 })) },
      { id: "imp", tipo: "impressora", nome: "Impressora antiga", x: 700, y: 330, portas: [P("imp-nic", "NIC", { auto: false, mbps: 100 })] },
      pc("pc1", "PC 1", 120, 350), pc("pc2", "PC 2", 340, 350), pc("pc3", "PC 3", 540, 350),
    ],
    ligacoes: [],
    metas: [
      { texto: "Internet funcionando", ok: (av) => av.internet },
      { texto: "Todos online: PCs e impressora", ok: (av) => hostsOk(av, ["pc1", "pc2", "pc3", "imp"]) },
      { texto: "Nenhuma tempestade de broadcast", ok: (av) => av.tempestades.length === 0 },
      { texto: "Hub e switch antigo no mesmo domínio (sem laço)", ok: (av, d) => { const a = av.hosts["imp"]; const b = av.hosts["pc1"]; return Boolean(a && b && a.dominio === b.dominio); } },
    ],
  },
  {
    id: "m6", titulo: "Emergência: a clínica ficou sem rede", nivel: 6, escala: 0.04, orcamento: 180,
    historia: "Segunda-feira, 7h50. O eletricista mexeu no rack no fim de semana. A rede está pela metade e o consultório abre às 8h. Quatro defeitos, de cabos a ligações erradas. Descubra pelo testador e pelo terminal.",
    dica: "Clique em um cabo da rede para testar e inspecionar. Nem todo defeito acende a luz do testador: procure também laço, crossover errado e ordem fora da norma.",
    conceitos: ["Diagnóstico", "Par dividido", "Loop", "Cabos defeituosos"],
    disp: [
      modem("modem", 50, 40), roteador("rot", 280, 40),
      sw("sw", "Switch do rack (sem auto-MDIX)", 280, 210, 6, { auto: false }),
      pc("pc1", "PC do consultório 1", 90, 370, { auto: false }), pc("pc2", "PC do consultório 2", 330, 380, { auto: false }), pc("pc3", "PC da recepção", 560, 370),
      { id: "imp", tipo: "impressora", nome: "Impressora", x: 700, y: 210, portas: [P("imp-nic", "NIC")] },
    ],
    ligacoes: [
      { id: "e1", a: "modem-lan", b: "rot-wan", cabo: cabo("e1", [NORMA_B], [NORMA_B], "cat5e", 1, "Modem → roteador") },
      { id: "e2", a: "rot-l1", b: "sw-p1", cabo: cabo("e2", [["WO", "WG", "O", "B", "WB", "G", "WBr", "Br"]], [["WO", "WG", "O", "B", "WB", "G", "WBr", "Br"]], "cat5e", 2, "Roteador → switch") },
      { id: "e3", a: "rot-l2", b: "sw-p2", cabo: cabo("e3", [NORMA_B], [NORMA_B], "cat5e", 2, "Roteador → switch (segundo cabo)") },
      { id: "e4", a: "sw-p3", b: "pc1-nic", cabo: { id: "e4", nome: "Switch → PC consultório 1", cat: "cat5e", comprimentoM: 6, a: pontaPronta(NORMA_B), b: pontaPronta(NORMA_B, { crimpagem: "fraca" }), planejado: "direto", origem: "existente" } },
      { id: "e5", a: "sw-p4", b: "pc2-nic", cabo: cabo("e5", [NORMA_A], [NORMA_B], "cat5e", 5, "Switch → PC consultório 2") },
      { id: "e6", a: "sw-p5", b: "pc3-nic", cabo: cabo("e6", [NORMA_B], [NORMA_B], "cat5e", 8, "Switch → PC recepção") },
      { id: "e7", a: "sw-p6", b: "imp-nic", cabo: cabo("e7", [NORMA_B], [NORMA_B], "cat5e", 8, "Switch → impressora") },
    ],
    metas: [
      { texto: "Internet funcionando", ok: (av) => av.internet },
      { texto: "Os 3 PCs e a impressora online", ok: (av) => hostsOk(av, ["pc1", "pc2", "pc3", "imp"]) },
      { texto: "Nenhuma tempestade de broadcast", ok: (av) => av.tempestades.length === 0 },
      { texto: "Todos os links estáveis, sem perda", ok: (av) => av.links.length >= 6 && semInstavel(av) },
    ],
  },
];

export function ehAtivo(d: Disp) {
  return ATIVOS.includes(d.tipo);
}
export { ORDEM_CROSS_GIG };
