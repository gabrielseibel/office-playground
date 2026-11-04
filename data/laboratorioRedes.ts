// Laboratório de Redes. UC3, Fase 1: motor de simulação, montador de rede,
// configurador de IP e terminal do técnico.

/* Módulo: Montador de rede */
export type TipoDispositivo = "pc" | "impressora" | "servidor" | "switch" | "hub" | "roteador";

export type Dispositivo = { id: string; tipo: TipoDispositivo; nome: string; x: number; y: number };

export type CenarioMontador = {
  id: string;
  empresa: string;
  descricao: string;
  dispositivos: Dispositivo[];
  central: string;
  ligacoesCorretas: [string, string][];
};

export const CENARIOS_MONTADOR: CenarioMontador[] = [
  {
    id: "ipe-switch",
    empresa: "Papelaria Ipê",
    descricao:
      "A papelaria comprou um switch novo. Ligue os três computadores e a impressora ao switch, e o switch ao roteador.",
    dispositivos: [
      { id: "pc1", tipo: "pc", nome: "Caixa", x: 14, y: 18 },
      { id: "pc2", tipo: "pc", nome: "Balcão", x: 50, y: 14 },
      { id: "pc3", tipo: "pc", nome: "Depósito", x: 86, y: 18 },
      { id: "imp", tipo: "impressora", nome: "Impressora", x: 14, y: 72 },
      { id: "sw", tipo: "switch", nome: "Switch", x: 50, y: 50 },
      { id: "rot", tipo: "roteador", nome: "Roteador", x: 86, y: 72 },
    ],
    central: "sw",
    ligacoesCorretas: [
      ["pc1", "sw"],
      ["pc2", "sw"],
      ["pc3", "sw"],
      ["imp", "sw"],
      ["sw", "rot"],
    ],
  },
  {
    id: "clinica-hub",
    empresa: "Clínica Bem Viver",
    descricao:
      "A clínica comprou um hub antigo por engano, mas ele ainda liga a rede. Ligue a recepção, os dois consultórios e o servidor ao hub, e o hub ao roteador.",
    dispositivos: [
      { id: "rec", tipo: "pc", nome: "Recepção", x: 14, y: 18 },
      { id: "c1", tipo: "pc", nome: "Consultório 1", x: 50, y: 14 },
      { id: "c2", tipo: "pc", nome: "Consultório 2", x: 86, y: 18 },
      { id: "srv", tipo: "servidor", nome: "Servidor", x: 14, y: 72 },
      { id: "hb", tipo: "hub", nome: "Hub", x: 50, y: 50 },
      { id: "rot2", tipo: "roteador", nome: "Roteador", x: 86, y: 72 },
    ],
    central: "hb",
    ligacoesCorretas: [
      ["rec", "hb"],
      ["c1", "hb"],
      ["c2", "hb"],
      ["srv", "hb"],
      ["hb", "rot2"],
    ],
  },
];

export const NOME_DISPOSITIVO: Record<TipoDispositivo, string> = {
  pc: "Computador",
  impressora: "Impressora",
  servidor: "Servidor",
  switch: "Switch",
  hub: "Hub",
  roteador: "Roteador",
};

/* Módulo: Configurador de IP */
export type CenarioIP = {
  id: string;
  empresa: string;
  computador: string;
  descricao: string;
  redeBase: string;
  mascara: string;
  gateway: string;
  dns: string;
  dhcpDisponivel: boolean;
  ipsEmUso: string[];
};

export const CENARIOS_IP: CenarioIP[] = [
  {
    id: "ipe-caixa",
    empresa: "Papelaria Ipê",
    computador: "Caixa",
    descricao:
      "O computador do caixa é novo. A rede da papelaria é 192.168.20.0, máscara 255.255.255.0, gateway 192.168.20.1, DNS 8.8.8.8. Não há servidor DHCP ainda: configure manualmente com um IP livre.",
    redeBase: "192.168.20",
    mascara: "255.255.255.0",
    gateway: "192.168.20.1",
    dns: "8.8.8.8",
    dhcpDisponivel: false,
    ipsEmUso: ["192.168.20.10", "192.168.20.11"],
  },
  {
    id: "clinica-recepcao",
    empresa: "Clínica Bem Viver",
    computador: "Recepção",
    descricao:
      "A clínica instalou um roteador com DHCP ligado. A rede é 192.168.10.0, máscara 255.255.255.0, gateway 192.168.10.1, DNS 192.168.10.1. Deixe o computador obter o endereço automaticamente.",
    redeBase: "192.168.10",
    mascara: "255.255.255.0",
    gateway: "192.168.10.1",
    dns: "192.168.10.1",
    dhcpDisponivel: true,
    ipsEmUso: ["192.168.10.100"],
  },
  {
    id: "ipe-deposito",
    empresa: "Papelaria Ipê",
    computador: "Depósito",
    descricao:
      "Mais um computador na papelaria, mesma rede: 192.168.20.0, máscara 255.255.255.0, gateway 192.168.20.1, DNS 8.8.8.8. Ainda sem DHCP: escolha um IP livre, diferente dos já usados.",
    redeBase: "192.168.20",
    mascara: "255.255.255.0",
    gateway: "192.168.20.1",
    dns: "8.8.8.8",
    dhcpDisponivel: false,
    ipsEmUso: ["192.168.20.10", "192.168.20.11", "192.168.20.12"],
  },
];

/* Módulo: Terminal do técnico (missões mais avançadas que a Aula 1) */
export const TERMINAL2 = {
  ipconfig: [
    "Configuração de IP do Windows",
    "",
    "Adaptador Ethernet:",
    "   Endereço IPv4 . . . . . . : 192.168.20.10",
    "   Máscara de Sub-rede . . . : 255.255.255.0",
    "   Gateway Padrão  . . . . . : 192.168.20.1",
  ],
  responde: {
    "192.168.20.1": "o roteador",
    "192.168.20.20": "o switch (gerenciável)",
    "192.168.20.10": "este computador",
    "127.0.0.1": "a própria placa",
  } as Record<string, string>,
  nomes: { "www.senac.br": "203.0.113.25", "servidorarquivos.ipe.local": "192.168.20.20" } as Record<string, string>,
  mac: {
    "192.168.20.1": "AA-11-22-33-44-01",
    "192.168.20.10": "BB-11-22-33-44-10",
    "192.168.20.20": "CC-11-22-33-44-20",
  } as Record<string, string>,
  rotaInternet: ["192.168.20.1", "203.0.113.1", "203.0.113.25"],
  missoes: [
    { id: "ipconfig", texto: "Descubra o IP deste computador (ipconfig)" },
    { id: "ping-roteador", texto: "Teste o roteador (ping 192.168.20.1)" },
    { id: "nslookup", texto: "Descubra o IP do site da escola (nslookup www.senac.br)" },
    { id: "tracert", texto: "Veja o caminho até a internet (tracert www.senac.br)" },
    { id: "arp", texto: "Veja os endereços MAC conhecidos (arp -a)" },
    { id: "ping-impressora", texto: "Tente falar com a impressora, que está desligada (ping 192.168.20.30)" },
  ],
  diagnostico: {
    pergunta:
      "A impressora, 192.168.20.30, não respondeu a nenhum comando, mas o resto da rede funciona. O que você faria primeiro?",
    opcoes: [
      { id: "a", rotulo: "Verificar se a impressora está ligada e com o cabo conectado" },
      { id: "b", rotulo: "Reinstalar o sistema operacional do computador" },
      { id: "c", rotulo: "Trocar o roteador da papelaria" },
    ],
    certa: "a",
    explicacao:
      "O resto da rede responde normalmente, então o problema é só na impressora: energia, cabo ou a porta do switch onde ela está ligada.",
  },
};
