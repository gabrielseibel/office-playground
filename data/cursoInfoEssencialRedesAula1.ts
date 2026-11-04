// Curso Informática Essencial. UC3, Aula 1 de Redes (Lajeado 2026.25.60).
// Redes locais e arquiteturas de rede: tipos, topologias, camadas, endereços e velocidade.

export type Video = { arquivo: string; titulo: string; resumo: string; duracao: string; pergunta: string };

export const VIDEOS: Video[] = [
  { arquivo: "01-chamado-da-clinica.html", titulo: "O chamado da Clínica Bem Viver", resumo: "A recepção não imprime e o sistema não abre. Por que as máquinas precisam estar em rede?", duracao: "41 s", pergunta: "O que o computador da recepção perde quando sai da rede?" },
  { arquivo: "02-tipos-de-rede.html", titulo: "Tipos de rede: PAN, LAN, MAN e WAN", resumo: "Os quatro anéis de alcance, do fone bluetooth até a internet.", duracao: "42 s", pergunta: "A rede da clínica é de qual tipo?" },
  { arquivo: "03-topologias.html", titulo: "Topologias: barramento, anel, estrela e malha", resumo: "O que acontece com cada rede quando um cabo ou um aparelho falha.", duracao: "1 min 30 s", pergunta: "Por que a estrela é a mais usada hoje?" },
  { arquivo: "04-camadas-da-mensagem.html", titulo: "As camadas da mensagem", resumo: "Aplicação, transporte, internet e acesso à rede: o caminho de um arquivo até o servidor.", duracao: "1 min 2 s", pergunta: "O que o TCP faz que o UDP não faz?" },
  { arquivo: "05-enderecos-na-rede.html", titulo: "Endereços: IP, máscara, gateway e DNS", resumo: "Como o computador ganha um IP, com quem ele fala direto e quem traduz nomes em números.", duracao: "1 min 16 s", pergunta: "Qual parte do IP 192.168.10.100 identifica a rede?" },
  { arquivo: "06-bits-bytes-velocidade.html", titulo: "Bits, bytes e velocidade", resumo: "Por que 100 Mbps viram 12,5 MB/s e quanto tempo leva um download.", duracao: "1 min 5 s", pergunta: "Quanto tempo leva para baixar 200 MB a 100 Mbps?" },
  { arquivo: "07-terminal-ipconfig-ping.html", titulo: "Terminal: ipconfig e ping", resumo: "Os dois comandos do técnico e a escada do diagnóstico.", duracao: "1 min 14 s", pergunta: "Qual é o primeiro ping que o técnico dá?" },
];

/* Atividade 1: que tipo de rede? */
export type TipoRede = "PAN" | "LAN" | "MAN" | "WAN";
export const TIPOS_REDE: { texto: string; resposta: TipoRede; explicacao: string }[] = [
  { texto: "O celular enviando música para o fone de ouvido por bluetooth.", resposta: "PAN", explicacao: "Rede pessoal. Alcança poucos metros, em volta de uma pessoa." },
  { texto: "Os 5 computadores, a impressora e o servidor da Clínica Bem Viver ligados ao mesmo roteador.", resposta: "LAN", explicacao: "Rede local. Fica dentro de um prédio, com um único dono." },
  { texto: "A prefeitura ligando a secretaria de saúde, a escola e a biblioteca da cidade pela mesma rede.", resposta: "MAN", explicacao: "Rede metropolitana. Liga vários prédios de uma cidade." },
  { texto: "Você abrindo um site hospedado em outro país.", resposta: "WAN", explicacao: "Rede de longa distância. A maior de todas é a internet." },
  { texto: "O Wi-Fi da sala de aula que conecta os notebooks da turma.", resposta: "LAN", explicacao: "Wi-Fi dentro de uma sala ou prédio também é rede local." },
  { texto: "O smartwatch mostrando no pulso as notificações do celular.", resposta: "PAN", explicacao: "Dois aparelhos pessoais, bem próximos, formam uma rede pessoal." },
  { texto: "Um banco ligando as agências de várias cidades e estados.", resposta: "WAN", explicacao: "Cobre uma área muito grande, então é uma rede de longa distância." },
  { texto: "Uma universidade ligando os prédios do seu campus com fibra óptica.", resposta: "MAN", explicacao: "Liga vários prédios em uma área do tamanho de uma cidade ou campus." },
];

/* Atividade 2: camadas na ordem em que a mensagem desce */
export const CAMADAS: { id: string; nome: string; faz: string }[] = [
  { id: "app", nome: "Aplicação", faz: "O programa que você usa, como o navegador e o e-mail, entrega o pedido." },
  { id: "trans", nome: "Transporte", faz: "O TCP divide em pedaços, numera e confere se tudo chegou." },
  { id: "net", nome: "Internet", faz: "O IP coloca o endereço de destino e o roteador escolhe o caminho." },
  { id: "acesso", nome: "Acesso à rede", faz: "A placa de rede transforma tudo em sinal e entrega ao cabo." },
];

/* Atividade 3: detetive de IP. Rede da clínica: 192.168.10.0, máscara 255.255.255.0, gateway 192.168.10.1 */
export type Maquina = { nome: string; ip: string; mascara: string; gateway: string };
export type RodadaDetetive = { enunciado: string; maquinas: Maquina[]; culpada: number; explicacao: string };
const M = "255.255.255.0";
const G = "192.168.10.1";
export const DETETIVE: RodadaDetetive[] = [
  {
    enunciado: "Um computador não consegue falar com os outros. Qual deles está em outra rede?",
    maquinas: [
      { nome: "Recepção", ip: "192.168.10.100", mascara: M, gateway: G },
      { nome: "Consultório 1", ip: "192.168.10.101", mascara: M, gateway: G },
      { nome: "Consultório 2", ip: "192.168.1.102", mascara: M, gateway: G },
      { nome: "Financeiro", ip: "192.168.10.103", mascara: M, gateway: G },
    ],
    culpada: 2,
    explicacao: "O IP 192.168.1.102 começa com 192.168.1, e a rede da clínica é 192.168.10. Os três primeiros números precisam ser iguais.",
  },
  {
    enunciado: "Dois computadores brigam e a rede fica caindo. Quem está com problema?",
    maquinas: [
      { nome: "Recepção", ip: "192.168.10.100", mascara: M, gateway: G },
      { nome: "Consultório 1", ip: "192.168.10.101", mascara: M, gateway: G },
      { nome: "Consultório 2", ip: "192.168.10.101", mascara: M, gateway: G },
      { nome: "Financeiro", ip: "192.168.10.103", mascara: M, gateway: G },
    ],
    culpada: 2,
    explicacao: "Dois computadores com o mesmo IP, o 192.168.10.101, causam conflito. Cada computador precisa de um IP só dele. O DHCP evita isso.",
  },
  {
    enunciado: "Todos falam entre si, mas só um não acessa a internet. Qual?",
    maquinas: [
      { nome: "Recepção", ip: "192.168.10.100", mascara: M, gateway: G },
      { nome: "Consultório 1", ip: "192.168.10.101", mascara: M, gateway: "192.168.10.50" },
      { nome: "Consultório 2", ip: "192.168.10.102", mascara: M, gateway: G },
      { nome: "Financeiro", ip: "192.168.10.103", mascara: M, gateway: G },
    ],
    culpada: 1,
    explicacao: "O gateway deste computador é 192.168.10.50, mas a porta de saída é o roteador, 192.168.10.1. Sem o gateway certo, ele não sai da rede.",
  },
  {
    enunciado: "Um computador enxerga só uma parte da rede. A configuração dele tem algo errado. Qual?",
    maquinas: [
      { nome: "Recepção", ip: "192.168.10.100", mascara: M, gateway: G },
      { nome: "Consultório 1", ip: "192.168.10.101", mascara: M, gateway: G },
      { nome: "Consultório 2", ip: "192.168.10.102", mascara: M, gateway: G },
      { nome: "Financeiro", ip: "192.168.10.103", mascara: "255.255.255.252", gateway: G },
    ],
    culpada: 3,
    explicacao: "A máscara 255.255.255.252 encolhe a rede a pouquíssimos endereços. O padrão da clínica é 255.255.255.0.",
  },
  {
    enunciado: "Este IP não pode ser usado por um computador. Qual está errado?",
    maquinas: [
      { nome: "Recepção", ip: "192.168.10.100", mascara: M, gateway: G },
      { nome: "Consultório 1", ip: "192.168.10.1", mascara: M, gateway: G },
      { nome: "Consultório 2", ip: "192.168.10.102", mascara: M, gateway: G },
      { nome: "Financeiro", ip: "192.168.10.103", mascara: M, gateway: G },
    ],
    culpada: 1,
    explicacao: "O 192.168.10.1 já é do roteador, o gateway da rede. Nenhum computador pode ficar com ele.",
  },
];

/* Atividade 4: calculadora de download */
export const DESAFIOS_DOWNLOAD: { enunciado: string; mbps: number; mb: number; segundos: number }[] = [
  { enunciado: "Um PDF de 200 MB em uma conexão de 100 Mbps.", mbps: 100, mb: 200, segundos: 16 },
  { enunciado: "Um vídeo de 500 MB em uma conexão de 200 Mbps.", mbps: 200, mb: 500, segundos: 20 },
  { enunciado: "Uma foto de 4 MB em uma conexão de 8 Mbps.", mbps: 8, mb: 4, segundos: 4 },
  { enunciado: "Um programa de 1 GB (1000 MB) em uma conexão de 1000 Mbps (1 Gbps).", mbps: 1000, mb: 1000, segundos: 8 },
  { enunciado: "O backup de 300 MB da clínica em uma conexão de 50 Mbps.", mbps: 50, mb: 300, segundos: 48 },
];

/* Atividade 5: terminal simulado. Rede da clínica, o computador é a recepção */
export const TERMINAL = {
  ipconfig: [
    "Configuração de IP do Windows",
    "",
    "Adaptador Ethernet:",
    "   Endereço IPv4 . . . . . . : 192.168.10.100",
    "   Máscara de Sub-rede . . . : 255.255.255.0",
    "   Gateway Padrão  . . . . . : 192.168.10.1",
  ],
  responde: { "192.168.10.1": "o roteador", "192.168.10.10": "o servidor", "127.0.0.1": "a própria placa", "192.168.10.100": "este computador" } as Record<string, string>,
  nomes: { "www.senac.br": "203.0.113.25" } as Record<string, string>,
  missoes: [
    { id: "ipconfig", texto: "Descubra o IP, a máscara e o gateway deste computador (ipconfig)" },
    { id: "gateway", texto: "Teste se o roteador responde (ping 192.168.10.1)" },
    { id: "servidor", texto: "Teste se o servidor da clínica responde (ping 192.168.10.10)" },
    { id: "impressora", texto: "Teste a impressora (ping 192.168.10.20)" },
    { id: "nome", texto: "Teste a internet pelo nome (ping www.senac.br)" },
  ],
  diagnostico: {
    pergunta: "A impressora, 192.168.10.20, não respondeu, mas o roteador e o servidor sim. Qual é a causa mais provável?",
    opcoes: [
      { id: "a", rotulo: "O cabo ou a energia da impressora" },
      { id: "b", rotulo: "A placa de rede do computador da recepção" },
      { id: "c", rotulo: "A internet da clínica caiu" },
    ],
    certa: "a",
    explicacao: "O computador chega ao roteador e ao servidor, então a placa e a rede estão boas. O problema está só no caminho até a impressora: cabo solto, energia ou IP.",
  },
};

/* Atividade 6: jogo da memória, sigla com significado */
export const PARES_MEMORIA: { sigla: string; significado: string }[] = [
  { sigla: "PAN", significado: "Rede pessoal" },
  { sigla: "LAN", significado: "Rede local" },
  { sigla: "MAN", significado: "Rede metropolitana" },
  { sigla: "WAN", significado: "Rede de longa distância" },
  { sigla: "DHCP", significado: "Entrega o IP automático" },
  { sigla: "DNS", significado: "Traduz nome em número" },
  { sigla: "TCP", significado: "Confere se tudo chegou" },
  { sigla: "Gateway", significado: "Porta de saída da rede" },
];

/* Atividade 7: verdade ou mito */
export const VERDADE_OU_MITO: { texto: string; verdade: boolean; explicacao: string }[] = [
  { texto: "Na topologia em estrela, se um cabo de um computador falha, só aquele computador sai da rede.", verdade: true, explicacao: "Cada computador tem o seu cabo até o centro. Um cabo ruim derruba só ele." },
  { texto: "100 Mbps significam 100 megabytes por segundo de download.", verdade: false, explicacao: "Mbps é megabits. Divida por 8: 100 Mbps são 12,5 MB/s." },
  { texto: "Dois computadores na mesma rede podem usar o mesmo IP, sem problema.", verdade: false, explicacao: "IP repetido gera conflito. Cada aparelho precisa de um endereço só dele." },
  { texto: "O DNS transforma o nome de um site em um número de IP.", verdade: true, explicacao: "É a lista telefônica da internet." },
  { texto: "O roteador também é o gateway da rede local.", verdade: true, explicacao: "Ele é a porta de saída para fora da rede." },
  { texto: "O UDP confere se todos os pedaços chegaram, como o TCP.", verdade: false, explicacao: "O UDP é mais rápido, mas não confere. Por isso serve para vídeo e chamada ao vivo." },
  { texto: "Um byte tem 8 bits.", verdade: true, explicacao: "Oito bits formam um byte, que guarda uma letra." },
  { texto: "A internet é uma LAN.", verdade: false, explicacao: "A internet é a maior WAN do mundo." },
];
