import type {
  AppMeta,
  Challenge,
  ComparisonItem,
  Curiosity,
  Shortcut,
} from "@/types";

export const APPS: AppMeta[] = [
  {
    id: "word",
    name: "Word",
    tagline: "O poder das palavras",
    description:
      "Crie documentos incríveis, formate textos com estilo e dê vida às suas ideias com o processador de texto mais usado do mundo.",
    color: "#2B579A",
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    icon: "FileText",
  },
  {
    id: "excel",
    name: "Excel",
    tagline: "Números que contam histórias",
    description:
      "Transforme dados em decisões. Construa planilhas poderosas, gráficos fantásticos e domine a arte de organizar o mundo.",
    color: "#217346",
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    icon: "Sheet",
  },
  {
    id: "ppt",
    name: "PowerPoint",
    tagline: "Ideias que ganham o palco",
    description:
      "Crie apresentações memoráveis com slides lindos, animações suaves e layouts que prendem a atenção do começo ao fim.",
    color: "#D24726",
    gradient: "from-orange-500 via-red-500 to-amber-600",
    icon: "Presentation",
  },
];

export const SHORTCUTS: Shortcut[] = [
  {
    keys: ["Ctrl", "B"],
    app: "word",
    title: "Negrito",
    description: "Transforma o texto selecionado em negrito, dando mais destaque.",
  },
  {
    keys: ["Ctrl", "I"],
    app: "word",
    title: "Itálico",
    description:
      "Coloca o texto em itálico — ótimo para títulos de livros, termos estrangeiros ou ênfase suave.",
  },
  {
    keys: ["Ctrl", "U"],
    app: "word",
    title: "Sublinhado",
    description:
      "Adiciona uma linha sob o texto. Use com moderação para não poluir o documento.",
  },
  {
    keys: ["Ctrl", "C"],
    app: "all",
    title: "Copiar",
    description:
      "Copia o texto, célula ou objeto selecionado para a área de transferência.",
  },
  {
    keys: ["Ctrl", "V"],
    app: "all",
    title: "Colar",
    description:
      "Cola o que foi copiado por último. Funciona até entre programas diferentes!",
  },
  {
    keys: ["Ctrl", "X"],
    app: "all",
    title: "Recortar",
    description:
      "Recorta o que está selecionado — copia e apaga ao mesmo tempo.",
  },
  {
    keys: ["Ctrl", "Z"],
    app: "all",
    title: "Desfazer",
    description:
      "Desfaz a última ação. Pressione várias vezes para voltar vários passos.",
  },
  {
    keys: ["Ctrl", "Y"],
    app: "all",
    title: "Refazer",
    description:
      "Refaz algo que você desfez por engano. Salva o dia constantemente.",
  },
  {
    keys: ["Ctrl", "S"],
    app: "all",
    title: "Salvar",
    description:
      "Salva o arquivo. Faça isso com frequência — todo bom editor salva a cada minuto.",
  },
  {
    keys: ["Ctrl", "N"],
    app: "all",
    title: "Novo",
    description:
      "Cria um novo documento, planilha ou apresentação em branco.",
  },
  {
    keys: ["Ctrl", "P"],
    app: "all",
    title: "Imprimir",
    description:
      "Abre a janela de impressão. Combine com Ctrl+P para visualizar antes.",
  },
  {
    keys: ["Ctrl", "F"],
    app: "all",
    title: "Localizar",
    description:
      "Abre o campo de busca. Encontre qualquer palavra em segundos.",
  },
  {
    keys: ["F5"],
    app: "ppt",
    title: "Iniciar apresentação",
    description:
      "Coloca a apresentação em tela cheia a partir do primeiro slide.",
  },
  {
    keys: ["F2"],
    app: "excel",
    title: "Editar célula",
    description:
      "Entra no modo de edição da célula selecionada para alterar a fórmula.",
  },
  {
    keys: ["Ctrl", ";"],
    app: "excel",
    title: "Data atual",
    description:
      "Insere a data de hoje automaticamente em uma célula.",
  },
  {
    keys: ["Ctrl", "1"],
    app: "excel",
    title: "Formatar células",
    description:
      "Abre a janela de formatação — mude números, fontes, bordas e cores.",
  },
];

export const CURIOSITIES: Curiosity[] = [
  {
    app: "word",
    title: "O Word tem mais de 50 estilos rápidos",
    text: "Você pode aplicar combinações prontas de fonte, tamanho e cor com apenas um clique em Galeria de Estilos.",
  },
  {
    app: "word",
    title: "Sumários automáticos",
    text: "O Word cria o sumário de documentos inteiros a partir dos estilos de título — atualizar leva um segundo.",
  },
  {
    app: "word",
    title: "Controle de alterações",
    text: "Ative 'Controlar Alterações' e veja cada edição feita em cores diferentes. Perfeito para revisar textos em grupo.",
  },
  {
    app: "excel",
    title: "O Excel fala a sua língua",
    text: "Use PROCV, ÍNDICE, CORRESP, SES, SOMASES e mais de 400 funções. Tudo para transformar dados em decisões.",
  },
  {
    app: "excel",
    title: "Gráficos em 1 clique",
    text: "Selecione os dados e pressione Alt+F1 (Windows) para criar um gráfico rapidamente na planilha.",
  },
  {
    app: "excel",
    title: "Tabelas dinâmicas",
    text: "Com uma Tabela Dinâmica, resumir milhares de linhas em segundos é possível — sem escrever uma fórmula sequer.",
  },
  {
    app: "ppt",
    title: "Gravador de apresentações",
    text: "Você pode gravar a si mesmo narrando os slides e adicionar anotações à mão, como se fosse um quadro.",
  },
  {
    app: "ppt",
    title: "Transições cinematográficas",
    text: "Mais de 50 transições diferentes deixam suas apresentações com cara de filme.",
  },
  {
    app: "ppt",
    title: "Designer de layout",
    text: "O painel Designer sugere layouts automáticos a partir do conteúdo do slide — basta clicar para aplicar.",
  },
  {
    app: "all",
    title: "Você sabia?",
    text: "Pressionar Ctrl+Shift+End no Word ou Excel seleciona tudo até o final do documento — truque clássico de produtividade.",
  },
  {
    app: "all",
    title: "Truque do Office",
    text: "Pressione F1 em qualquer lugar do Office para abrir a ajuda contextual sobre o botão que você clicou por último.",
  },
  {
    app: "all",
    title: "Copiar formatação",
    text: "Use o pincel de formatação (clique duas vezes para aplicar várias vezes) para copiar estilos sem repetir cliques.",
  },
];

export const COMPARISONS: ComparisonItem[] = [
  {
    title: "Documento",
    app: "word",
    bad: "Texto corrido, sem parágrafos, com espaçamento confuso.",
    good: "Títulos claros, listas, ênfase visual e cabeçalho profissional.",
  },
  {
    title: "Planilha",
    app: "excel",
    bad: "Dados soltos, cores gritantes, sem formatação e nenhum gráfico.",
    good: "Tabela organizada, células formatadas, gráfico explicativo e linha de totais.",
  },
  {
    title: "Slide",
    app: "ppt",
    bad: "Parede de texto, sem imagens, animação exagerada e cores cansativas.",
    good: "Pouco texto, uma ideia por slide, ícones e transições suaves.",
  },
];

export const CHALLENGES: Challenge[] = [
  {
    question: "Qual atalho deixa o texto em negrito no Word?",
    options: ["Ctrl + I", "Ctrl + B", "Ctrl + N", "Ctrl + U"],
    correctIndex: 1,
    explanation:
      "Ctrl + B (de 'Bold', negrito em inglês) aplica e remove o negrito rapidamente.",
    app: "word",
  },
  {
    question: "Qual função soma um intervalo de células no Excel?",
    options: ["SOMA", "MEDIA", "MAX", "CONT"],
    correctIndex: 0,
    explanation:
      "=SOMA(A1:A10) soma todos os valores do intervalo A1 até A10.",
    app: "excel",
  },
  {
    question: "Qual tecla inicia uma apresentação de slides?",
    options: ["F1", "F5", "F12", "Esc"],
    correctIndex: 1,
    explanation:
      "Pressione F5 para exibir a apresentação a partir do primeiro slide.",
    app: "ppt",
  },
  {
    question: "O que acontece ao pressionar Ctrl + Z?",
    options: [
      "Salva o arquivo",
      "Abre um novo documento",
      "Desfaz a última ação",
      "Imprime o documento",
    ],
    correctIndex: 2,
    explanation:
      "Ctrl + Z é o famoso 'desfazer' — ideal para corrigir enganos.",
    app: "all",
  },
  {
    question: "Qual ferramenta centraliza o texto no Word?",
    options: [
      "Botão 'Esquerda'",
      "Botão 'Centralizar'",
      "Botão 'Justificar'",
      "Botão 'Direita'",
    ],
    correctIndex: 1,
    explanation:
      "O botão Centralizar alinha o texto no meio da página, ideal para títulos.",
    app: "word",
  },
  {
    question: "Qual função mostra o maior valor de um intervalo?",
    options: ["MIN", "SOMA", "MAX", "MEDIA"],
    correctIndex: 2,
    explanation:
      "=MAX(A1:A10) retorna o maior valor entre as células A1 e A10.",
    app: "excel",
  },
  {
    question: "Qual painel sugere layouts automáticos no PowerPoint?",
    options: ["Animações", "Designer", "Transições", "Estrutura"],
    correctIndex: 1,
    explanation:
      "O Designer sugere layouts e ideias de design com base no conteúdo do slide.",
    app: "ppt",
  },
  {
    question: "Qual atalho copia o texto selecionado?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + A"],
    correctIndex: 0,
    explanation:
      "Ctrl + C copia, Ctrl + V cola e Ctrl + X recorta. Três mosqueteiros!",
    app: "all",
  },
];

export const NAV_ITEMS = [
  { label: "Início", href: "#inicio" },
  { label: "Word", href: "#aplicativos" },
  { label: "Excel", href: "#aplicativos" },
  { label: "PowerPoint", href: "#aplicativos" },
  { label: "Jogos", href: "/jogos" },
  { label: "Dicas", href: "#dicas" },
  { label: "Sobre", href: "#sobre" },
];
