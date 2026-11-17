export interface ItemApoio { titulo: string; url: string; tipo: "video" | "texto"; quando: string }
export interface GrupoApoio { grupo: string; itens: ItemApoio[] }

const yt = (id: string) => "https://www.youtube.com/watch?v=" + id;

export const APOIO: GrupoApoio[] = [
  {
    grupo: "Antes de crimpar: categorias e cabos",
    itens: [
      { titulo: "Tipos de Cabo Ethernet (Cidadão na Rede, NIC.br)", url: "https://cidadaonarede.nic.br/pt/videos/tipos-de-cabo-ethernet", tipo: "video", quando: "Abertura. Cat5e, Cat6 e Cat6a em linguagem simples." },
      { titulo: "Qual a diferença: Cabo de rede CAT5, CAT5e e CAT6", url: yt("dFMqNSOvhzo"), tipo: "video", quando: "Reforço sobre as categorias, depois da Atividade 1." },
      { titulo: "TUDO SOBRE CABOS DE REDE: cat.5e, cat.6, cat.6a e cat.8", url: yt("erW9ajMjxKs"), tipo: "video", quando: "Para quem terminar antes. Inclui Cat6a e Cat8." },
      { titulo: "Canaltech. Qual a diferença entre cabos de rede Cat5, Cat5e e Cat6", url: "https://canaltech.com.br/produtos/qual-a-diferenca-cabo-rede-cat5-cat5e-cat6-195080/", tipo: "texto", quando: "Leitura de apoio." },
    ],
  },
  {
    grupo: "Crimpar o cabo, passo a passo",
    itens: [
      { titulo: "Como Crimpar Cabo de Rede RJ45. Passo a Passo Fácil e Rápido", url: yt("nkYo3PLMhCo"), tipo: "video", quando: "Antes da Bancada de crimpagem, para ver o procedimento inteiro." },
      { titulo: "Como Montar um Cabo de Rede RJ-45 Passo a Passo", url: yt("ElRvvgRI_MQ"), tipo: "video", quando: "Segunda opção, caso o primeiro não abra." },
      { titulo: "Crimpar cabo de rede com conector RJ45 (igual fábrica)", url: yt("OT_5EjDfD6M"), tipo: "video", quando: "Acabamento: capa dentro do conector e crimpagem firme." },
      { titulo: "Como Crimpar Cabo de Rede Padrão B", url: yt("RyydXUkE02Q"), tipo: "video", quando: "Ordem T568B, usada nas ordens de serviço 1 e 2." },
      { titulo: "Como crimpar cabo de rede RJ45 (T568A)", url: yt("Er9A7yC6bBo"), tipo: "video", quando: "Ordem T568A, usada no crossover." },
      { titulo: "Canaltech. Como crimpar um cabo de rede Ethernet", url: "https://canaltech.com.br/hardware/como-crimpar-um-cabo-de-rede-ethernet-206646/", tipo: "texto", quando: "Passo a passo escrito. Use decapador, não estilete." },
    ],
  },
  {
    grupo: "Crossover e teste do cabo",
    itens: [
      { titulo: "Como crimpar cabo de rede crossover?", url: yt("wfUV_9A1OPY"), tipo: "video", quando: "Ordens de serviço 3 e 4." },
      { titulo: "Como Crimpar Cabo de Rede Cat 5e e Testar", url: yt("P6r9M59tjoY"), tipo: "video", quando: "Mostra o testador acendendo os pinos." },
      { titulo: "Cabeamento Aula 3. Testar Cabo UTP T568A (LANtester)", url: yt("fFALn3Mtk0A"), tipo: "video", quando: "Modo Diagnóstico: como ler as luzes do testador." },
    ],
  },
  {
    grupo: "Cabeamento estruturado e o limite de 100 m",
    itens: [
      { titulo: "CABEAMENTO ESTRUTURADO: o que é? Qual a sua importância?", url: yt("sI8K4tiAQd0"), tipo: "video", quando: "Antes da Missão 3." },
      { titulo: "Aula 3. Cabeamento Estruturado / Função do Patch Panel", url: yt("JtXfYKdvGN4"), tipo: "video", quando: "Missão 3: patch panel, tomada e patch cord." },
      { titulo: "Cabos UTP com mais de 100 metros em cabeamento estruturado. Pode?", url: yt("O9nWfyiLHIM"), tipo: "video", quando: "Missões 3 e 4: o limite do canal." },
      { titulo: "Patch Panel. Pra que serve e como crimpar", url: yt("VIGPH7ydgcw"), tipo: "video", quando: "Para a equipe que quiser ir além." },
    ],
  },
];
