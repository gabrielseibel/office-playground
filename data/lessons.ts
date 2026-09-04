export type LessonApp = "word" | "excel" | "ppt";

export interface LessonPractice {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  app: LessonApp;
  order: number;
  emoji: string;
  title: string;
  /** Mini aula: 1-2 frases explicando o conceito antes do aluno praticar. */
  summary: string;
  /** Pontos-chave em formato de checklist rápido. */
  points: string[];
  practice: LessonPractice;
}

/**
 * Trilha de Aprendizagem — sequência pensada para quem nunca abriu o
 * programa: cada passo assume só o anterior, começando pelo "para que
 * serve" e terminando em uma tarefa do dia a dia (currículo, planilha de
 * gastos, apresentação escolar). A ordem segue a progressão clássica de
 * cursos introdutórios de Office: conceito → ação básica → formatação →
 * organização → produto final.
 */
export const LESSONS: Lesson[] = [
  // ---------------------------------------------------------------- WORD --
  {
    id: "word-1",
    app: "word",
    order: 1,
    emoji: "📄",
    title: "O que é o Word?",
    summary:
      "O Word é o programa que você abre sempre que precisa escrever e organizar um texto: um bilhete, uma lista, um trabalho escolar ou um currículo.",
    points: [
      "Serve para criar e editar documentos com texto.",
      "Um documento é o arquivo que guarda o que você escreveu.",
      "Você usa o Word sempre que precisa escrever algo organizado para imprimir, enviar ou guardar.",
    ],
    practice: {
      question: "Você precisa escrever um comunicado para a turma. Qual programa usar?",
      options: ["Word", "Excel", "PowerPoint"],
      correctIndex: 0,
      explanation:
        "Comunicados, cartas e listas são texto corrido — a especialidade do Word.",
    },
  },
  {
    id: "word-2",
    app: "word",
    order: 2,
    emoji: "🆕",
    title: "Criando seu primeiro documento",
    summary:
      "Um documento novo começa em branco: você abre o Word, escolhe 'Documento em branco', digita um título e o conteúdo abaixo dele.",
    points: [
      "Abra o Word e escolha 'Documento em branco'.",
      "Digite primeiro o título, depois o texto.",
      "Releia e confira o título antes de salvar.",
    ],
    practice: {
      question: "Depois de abrir o Word, qual é o próximo passo para começar a escrever?",
      options: [
        "Clicar em 'Documento em branco'",
        "Clicar em 'Imprimir'",
        "Fechar o programa",
      ],
      correctIndex: 0,
      explanation:
        "'Documento em branco' abre uma página vazia pronta para você digitar.",
    },
  },
  {
    id: "word-3",
    app: "word",
    order: 3,
    emoji: "⌨️",
    title: "Digitando e organizando o texto",
    summary:
      "Enter pula para uma linha nova, Backspace apaga o que está antes do cursor, e separar o texto em parágrafos curtos facilita a leitura.",
    points: [
      "Enter cria um novo parágrafo.",
      "Backspace apaga caractere por caractere.",
      "Textos organizados em parágrafos curtos são mais fáceis de ler.",
    ],
    practice: {
      question: "Qual tecla você usa para começar um novo parágrafo no meio do texto?",
      options: ["Enter", "Backspace", "Shift"],
      correctIndex: 0,
      explanation: "Enter fecha o parágrafo atual e abre uma linha nova.",
    },
  },
  {
    id: "word-4",
    app: "word",
    order: 4,
    emoji: "🅱️",
    title: "Negrito, itálico e sublinhado",
    summary:
      "Os três botões mais usados da formatação: B deixa o texto em negrito para destacar, I inclina em itálico, e U sublinha com uma linha embaixo.",
    points: [
      "Negrito (Ctrl+B) dá destaque.",
      "Itálico (Ctrl+I) inclina o texto — bom para títulos de obras.",
      "Sublinhado (Ctrl+U) deve ser usado com moderação.",
    ],
    practice: {
      question: "Qual atalho deixa o texto selecionado em negrito?",
      options: ["Ctrl + B", "Ctrl + I", "Ctrl + U"],
      correctIndex: 0,
      explanation: "Ctrl+B vem de 'Bold', negrito em inglês.",
    },
  },
  {
    id: "word-5",
    app: "word",
    order: 5,
    emoji: "🎨",
    title: "Fonte, tamanho, cor e alinhamento",
    summary:
      "Além de negrito/itálico/sublinhado, você pode trocar a fonte, aumentar o tamanho das letras, mudar a cor do texto e escolher o alinhamento (esquerda, centralizado, direita ou justificado).",
    points: [
      "Títulos costumam ficar melhores centralizados e maiores.",
      "Cor deve destacar, não substituir a explicação.",
      "Alinhamento justificado deixa as margens retas nos dois lados.",
    ],
    practice: {
      question: "Qual botão deixa um título bem no meio da página?",
      options: ["Centralizar", "Justificar", "Alinhar à direita"],
      correctIndex: 0,
      explanation: "Centralizar posiciona o texto igualmente distante das duas margens.",
    },
  },
  {
    id: "word-6",
    app: "word",
    order: 6,
    emoji: "🏷️",
    title: "Títulos e subtítulos",
    summary:
      "O título mostra o assunto principal do documento; os subtítulos separam as partes do conteúdo. Essa hierarquia ajuda quem lê a encontrar informação rápido.",
    points: [
      "Um documento organizado tem só um título principal.",
      "Subtítulos dividem o conteúdo em blocos menores.",
      "Use poucas palavras nos títulos — eles são um resumo, não uma frase completa.",
    ],
    practice: {
      question: "Para que serve um subtítulo dentro de um documento?",
      options: [
        "Separar e organizar partes do conteúdo",
        "Substituir o título principal",
        "Enfeitar a página sem função",
      ],
      correctIndex: 0,
      explanation: "Subtítulos quebram o texto em seções menores e mais fáceis de acompanhar.",
    },
  },
  {
    id: "word-7",
    app: "word",
    order: 7,
    emoji: "🖼️",
    title: "Inserindo imagens",
    summary:
      "Uma imagem bem escolhida ilustra a ideia do texto. No Word, você clica em Inserir → Imagem, escolhe o arquivo e ajusta o tamanho pelas alças nos cantos.",
    points: [
      "Vá em Inserir → Imagem para adicionar uma figura.",
      "Arraste os cantos para redimensionar sem distorcer.",
      "Use poucas imagens, sempre relacionadas ao tema.",
    ],
    practice: {
      question: "Onde fica a opção para adicionar uma imagem ao documento?",
      options: ["No menu Inserir", "No menu Revisão", "No menu Exibir"],
      correctIndex: 0,
      explanation: "O menu Inserir reúne imagens, tabelas, formas e outros elementos.",
    },
  },
  {
    id: "word-8",
    app: "word",
    order: 8,
    emoji: "💾",
    title: "Salvando o documento",
    summary:
      "Salvar guarda o arquivo no computador com um nome fácil de lembrar, para você não perder o trabalho e conseguir abri-lo de novo depois.",
    points: [
      "Escolha um nome claro, como 'Trabalho de Ciências'.",
      "Salve com frequência enquanto escreve.",
      "Confira a pasta onde o arquivo foi salvo.",
    ],
    practice: {
      question: "Por que é importante salvar o documento com um nome claro?",
      options: [
        "Para encontrar o arquivo facilmente depois",
        "Para deixar o texto em negrito",
        "Para inserir uma imagem",
      ],
      correctIndex: 0,
      explanation: "Um nome descritivo evita perder tempo procurando o arquivo certo.",
    },
  },
  {
    id: "word-9",
    app: "word",
    order: 9,
    emoji: "🖨️",
    title: "Imprimindo com segurança",
    summary:
      "Antes de imprimir, vale conferir a visualização, a orientação da folha e a quantidade de cópias — assim você evita desperdiçar papel com erros.",
    points: [
      "Sempre confira a visualização antes de imprimir.",
      "Verifique a orientação: retrato ou paisagem.",
      "Confirme a impressora e o número de cópias.",
    ],
    practice: {
      question: "Qual é o primeiro cuidado antes de clicar em 'Imprimir'?",
      options: [
        "Conferir a visualização do documento",
        "Apagar todo o texto",
        "Trocar a fonte para itálico",
      ],
      correctIndex: 0,
      explanation: "A visualização mostra exatamente como a folha vai sair da impressora.",
    },
  },
  {
    id: "word-10",
    app: "word",
    order: 10,
    emoji: "📋",
    title: "Currículo, listas e avisos",
    summary:
      "Com o que você já aprendeu dá para montar documentos reais: um currículo simples (nome, contato, objetivo, estudos) ou uma lista de tarefas com marcadores.",
    points: [
      "Um currículo precisa de nome, contato, objetivo e experiências.",
      "Listas com marcadores organizam tarefas e recados.",
      "Textos curtos e diretos facilitam a leitura de quem recebe.",
    ],
    practice: {
      question: "O que não pode faltar em um currículo simples?",
      options: [
        "Nome e forma de contato",
        "Uma imagem decorativa grande",
        "Um poema de abertura",
      ],
      correctIndex: 0,
      explanation:
        "Nome, contato, objetivo, estudos e experiências são as informações essenciais.",
    },
  },

  // --------------------------------------------------------------- EXCEL --
  {
    id: "excel-1",
    app: "excel",
    order: 1,
    emoji: "📊",
    title: "O que é o Excel?",
    summary:
      "O Excel organiza informações em tabelas e faz contas automaticamente — ótimo para listas de compras, controle de gastos e qualquer coisa com números.",
    points: [
      "Serve para organizar dados em tabelas.",
      "Faz cálculos automáticos com fórmulas.",
      "Ajuda a comparar valores e enxergar totais rapidamente.",
    ],
    practice: {
      question: "Você quer somar automaticamente os gastos do mês. Qual programa usar?",
      options: ["Excel", "Word", "PowerPoint"],
      correctIndex: 0,
      explanation: "O Excel calcula totais automaticamente a partir dos valores digitados.",
    },
  },
  {
    id: "excel-2",
    app: "excel",
    order: 2,
    emoji: "🔲",
    title: "Linhas, colunas e células",
    summary:
      "Uma planilha é uma grade: linhas numeradas (1, 2, 3...) na horizontal e colunas com letras (A, B, C...) na vertical. Uma célula é o encontro entre uma linha e uma coluna — por exemplo, B3.",
    points: [
      "Linhas são identificadas por números.",
      "Colunas são identificadas por letras.",
      "Uma célula tem um endereço, como B3 (coluna B, linha 3).",
    ],
    practice: {
      question: "O que é a célula B3?",
      options: [
        "O encontro da coluna B com a linha 3",
        "O nome de uma planilha inteira",
        "Um tipo de gráfico",
      ],
      correctIndex: 0,
      explanation: "Toda célula é identificada pela letra da coluna seguida do número da linha.",
    },
  },
  {
    id: "excel-3",
    app: "excel",
    order: 3,
    emoji: "⌨️",
    title: "Digitando dados em uma célula",
    summary:
      "Para preencher uma planilha: clique na célula certa, digite o conteúdo (texto, número ou data) e pressione Enter para confirmar e ir para a célula de baixo.",
    points: [
      "Clique na célula antes de digitar.",
      "Pressione Enter para confirmar o valor.",
      "Cada célula deve guardar só uma informação.",
    ],
    practice: {
      question: "O que acontece ao pressionar Enter depois de digitar em uma célula?",
      options: [
        "O valor é confirmado e a seleção desce para a célula abaixo",
        "A planilha é apagada",
        "Um gráfico é criado automaticamente",
      ],
      correctIndex: 0,
      explanation: "Enter confirma o conteúdo digitado e move a seleção para baixo.",
    },
  },
  {
    id: "excel-4",
    app: "excel",
    order: 4,
    emoji: "➕",
    title: "Somando valores com =SOMA()",
    summary:
      "Em vez de somar na calculadora, use a fórmula =SOMA(intervalo) — por exemplo, =SOMA(B2:B5) soma tudo de B2 até B5 automaticamente.",
    points: [
      "Toda fórmula começa com o sinal de igual (=).",
      "=SOMA(A1:A3) soma os valores de A1 até A3.",
      "Se você mudar um número, o total se atualiza sozinho.",
    ],
    practice: {
      question: "Qual fórmula soma os valores das células A1 até A3?",
      options: ["=SOMA(A1:A3)", "=MÉDIA(A1:A3)", "=A1+A1+A1"],
      correctIndex: 0,
      explanation: "=SOMA(A1:A3) soma todos os valores dentro desse intervalo.",
    },
  },
  {
    id: "excel-5",
    app: "excel",
    order: 5,
    emoji: "📐",
    title: "Média, maior e menor valor",
    summary:
      "Além de somar, o Excel calcula a média com =MÉDIA(), o maior valor com =MÁXIMO() e o menor com =MÍNIMO() — úteis para comparar notas, vendas ou preços.",
    points: [
      "=MÉDIA(intervalo) calcula o valor médio.",
      "=MÁXIMO(intervalo) retorna o maior número.",
      "=MÍNIMO(intervalo) retorna o menor número.",
    ],
    practice: {
      question: "Qual função mostra o maior valor dentro de um intervalo de células?",
      options: ["=MÁXIMO()", "=MÍNIMO()", "=MÉDIA()"],
      correctIndex: 0,
      explanation: "=MÁXIMO() percorre o intervalo e devolve o maior número encontrado.",
    },
  },
  {
    id: "excel-6",
    app: "excel",
    order: 6,
    emoji: "✖️",
    title: "As quatro operações básicas",
    summary:
      "Fórmulas simples também fazem contas diretas entre células: =B2+B3 soma, =B2-B3 subtrai, =B2*B3 multiplica e =B2/B3 divide.",
    points: [
      "+ soma, - subtrai, * multiplica e / divide.",
      "A fórmula sempre faz referência a células, não só a números fixos.",
      "Multiplicação é útil para calcular 'quantidade × preço'.",
    ],
    practice: {
      question: "Para calcular o total de 'quantidade × preço unitário', qual operação usar?",
      options: ["Multiplicação (*)", "Subtração (-)", "Divisão (/)"],
      correctIndex: 0,
      explanation: "Multiplicar quantidade por preço unitário dá o valor total do item.",
    },
  },
  {
    id: "excel-7",
    app: "excel",
    order: 7,
    emoji: "🧱",
    title: "Formatando uma tabela",
    summary:
      "Negrito no título, cor de preenchimento no cabeçalho e bordas separando as células deixam a planilha muito mais fácil de ler.",
    points: [
      "Destaque a linha de título com negrito e cor.",
      "Bordas separam visualmente cada célula.",
      "Evite exagerar em cores — poucas e bem usadas bastam.",
    ],
    practice: {
      question: "O que ajuda mais a deixar uma tabela fácil de ler rapidamente?",
      options: [
        "Título em destaque e bordas organizando as células",
        "Usar uma cor diferente em cada célula",
        "Deixar todas as colunas bem estreitas",
      ],
      correctIndex: 0,
      explanation: "Destaque no título e bordas guiam o olho do leitor pela tabela.",
    },
  },
  {
    id: "excel-8",
    app: "excel",
    order: 8,
    emoji: "↔️",
    title: "Ajustando colunas e bordas",
    summary:
      "Quando o texto de uma célula não cabe, arraste a borda da coluna para alargá-la. Combinado com bordas em 'Todas as bordas', a planilha fica organizada e legível.",
    points: [
      "Arraste a borda do cabeçalho da coluna para redimensionar.",
      "Colunas largas evitam texto cortado.",
      "'Todas as bordas' separa cada célula com uma linha fina.",
    ],
    practice: {
      question: "O texto de uma célula está cortado. O que fazer?",
      options: [
        "Aumentar a largura da coluna",
        "Diminuir o tamanho da fonte para 6",
        "Apagar o conteúdo da célula",
      ],
      correctIndex: 0,
      explanation: "Alargar a coluna mostra o conteúdo completo sem cortar o texto.",
    },
  },
  {
    id: "excel-9",
    app: "excel",
    order: 9,
    emoji: "💰",
    title: "Montando um controle de gastos",
    summary:
      "Uma planilha de gastos precisa de colunas como Data, Descrição, Categoria e Valor, terminando em uma linha de Total calculada com =SOMA().",
    points: [
      "Uma linha por gasto, nunca misture duas informações numa célula.",
      "Categorize (alimentação, transporte, lazer...) para entender para onde o dinheiro vai.",
      "Use =SOMA() na última linha para o total geral.",
    ],
    practice: {
      question: "Em uma planilha de controle de gastos, o que a coluna 'Categoria' ajuda a fazer?",
      options: [
        "Agrupar os gastos por tipo (mercado, transporte, lazer...)",
        "Substituir a coluna de valores",
        "Formatar o texto em negrito",
      ],
      correctIndex: 0,
      explanation: "Categorizar mostra rapidamente onde o dinheiro está sendo mais gasto.",
    },
  },
  {
    id: "excel-10",
    app: "excel",
    order: 10,
    emoji: "🔤",
    title: "Organizando e ordenando dados",
    summary:
      "Dados soltos são difíceis de usar. Coloque um título claro em cada coluna, um dado por célula e use 'Classificar de A a Z' (ou Z a A) para ordenar nomes, preços ou datas.",
    points: [
      "Mantenha um tipo de dado por coluna.",
      "Evite linhas em branco no meio da tabela.",
      "Classificar em ordem crescente ou decrescente facilita encontrar informações.",
    ],
    practice: {
      question: "Você quer ver os produtos do mais barato para o mais caro. O que fazer?",
      options: [
        "Classificar a coluna de preço de A a Z (crescente)",
        "Apagar a coluna de preço",
        "Colorir todas as células de vermelho",
      ],
      correctIndex: 0,
      explanation: "Classificar em ordem crescente organiza do menor para o maior valor.",
    },
  },
  {
    id: "excel-11",
    app: "excel",
    order: 11,
    emoji: "📈",
    title: "Criando gráficos simples",
    summary:
      "Gráficos transformam números em imagens fáceis de entender: colunas comparam valores, barras comparam muitos itens, e pizza mostra a participação de cada parte no total.",
    points: [
      "Selecione os dados antes de inserir o gráfico.",
      "Colunas/barras comparam categorias; pizza mostra proporção do total.",
      "Um bom gráfico tem título e é simples de ler.",
    ],
    practice: {
      question: "Qual gráfico é mais indicado para mostrar a fatia de cada gasto no total do mês?",
      options: ["Gráfico de pizza", "Gráfico de linhas", "Nenhum gráfico"],
      correctIndex: 0,
      explanation: "O gráfico de pizza mostra bem como cada parte contribui para o total.",
    },
  },
  {
    id: "excel-12",
    app: "excel",
    order: 12,
    emoji: "💾",
    title: "Salvando e imprimindo a planilha",
    summary:
      "Assim como no Word, salve a planilha com um nome claro. Antes de imprimir, confira a visualização — planilhas largas podem precisar de orientação paisagem.",
    points: [
      "Salve com um nome descritivo, como 'Controle de Gastos - Maio'.",
      "Confira a visualização antes de imprimir.",
      "Planilhas largas costumam imprimir melhor na orientação paisagem.",
    ],
    practice: {
      question: "Uma planilha muito larga vai ser impressa. Qual orientação de página escolher?",
      options: ["Paisagem", "Retrato", "Não faz diferença"],
      correctIndex: 0,
      explanation: "Paisagem dá mais espaço horizontal, evitando cortar colunas na impressão.",
    },
  },

  // ----------------------------------------------------------------- PPT --
  {
    id: "ppt-1",
    app: "ppt",
    order: 1,
    emoji: "🎤",
    title: "O que é o PowerPoint?",
    summary:
      "O PowerPoint cria apresentações em slides — ótimo para mostrar um trabalho, um projeto ou uma ideia para uma plateia, combinando texto, imagens e cores.",
    points: [
      "Serve para montar apresentações com slides.",
      "Cada slide mostra uma ideia principal por vez.",
      "É a ferramenta certa quando você vai falar para um público.",
    ],
    practice: {
      question: "Você vai apresentar um projeto para a turma. Qual programa usar?",
      options: ["PowerPoint", "Excel", "Word"],
      correctIndex: 0,
      explanation: "Apresentações com slides são a especialidade do PowerPoint.",
    },
  },
  {
    id: "ppt-2",
    app: "ppt",
    order: 2,
    emoji: "🗂️",
    title: "O que é um slide?",
    summary:
      "Um slide é uma 'página' da apresentação. Ele pode ter título, caixa de texto, imagem e um número indicando a posição na sequência.",
    points: [
      "Uma apresentação é feita de vários slides.",
      "Cada slide costuma ter um título e um conteúdo.",
      "As miniaturas na lateral mostram todos os slides de uma vez.",
    ],
    practice: {
      question: "O que é um slide dentro de uma apresentação?",
      options: [
        "Uma página/tela da apresentação",
        "Um tipo de fórmula",
        "O nome do arquivo salvo",
      ],
      correctIndex: 0,
      explanation: "Cada slide é uma tela independente que aparece na sua vez durante a exibição.",
    },
  },
  {
    id: "ppt-3",
    app: "ppt",
    order: 3,
    emoji: "🆕",
    title: "Criando sua primeira apresentação",
    summary:
      "Comece com uma apresentação em branco, clique na caixa de título para digitar o tema e use 'Novo Slide' sempre que precisar de mais uma página.",
    points: [
      "Abra uma apresentação em branco para começar do zero.",
      "Digite o título antes do conteúdo.",
      "Use 'Novo Slide' para adicionar páginas.",
    ],
    practice: {
      question: "Como adicionar mais uma página à apresentação?",
      options: ["Clicando em 'Novo Slide'", "Apertando Ctrl+P", "Fechando o programa"],
      correctIndex: 0,
      explanation: "'Novo Slide' insere uma página extra logo após a atual.",
    },
  },
  {
    id: "ppt-4",
    app: "ppt",
    order: 4,
    emoji: "📝",
    title: "Título e texto no slide",
    summary:
      "Um bom slide tem um título claro e poucos tópicos curtos abaixo dele — frases longas cansam quem está assistindo.",
    points: [
      "Uma ideia principal por slide.",
      "Prefira tópicos curtos a parágrafos inteiros.",
      "Destaque só o que realmente importa.",
    ],
    practice: {
      question: "Qual desses slides costuma comunicar melhor para uma plateia?",
      options: [
        "Poucos tópicos curtos e diretos",
        "Um parágrafo inteiro de texto corrido",
        "Nenhum texto, só decoração",
      ],
      correctIndex: 0,
      explanation: "Tópicos curtos são lidos rápido e ajudam quem apresenta a falar por cima deles.",
    },
  },
  {
    id: "ppt-5",
    app: "ppt",
    order: 5,
    emoji: "🖼️",
    title: "Inserindo imagens",
    summary:
      "Imagens tornam a mensagem mais visual. Insira pela guia Inserir → Imagem e posicione sem cobrir o título ou o texto.",
    points: [
      "Imagens ilustram e reforçam a ideia do slide.",
      "Não deixe a imagem cobrir texto importante.",
      "Prefira poucas imagens, bem escolhidas.",
    ],
    practice: {
      question: "Ao inserir uma imagem, o que é importante verificar?",
      options: [
        "Se ela não está cobrindo o título ou o texto",
        "Se ela é a maior possível na tela",
        "Se ela tem uma cor diferente das outras",
      ],
      correctIndex: 0,
      explanation: "A imagem deve apoiar a mensagem, não esconder outras informações do slide.",
    },
  },
  {
    id: "ppt-6",
    app: "ppt",
    order: 6,
    emoji: "🧩",
    title: "Layout e ordem dos slides",
    summary:
      "Layouts prontos organizam onde ficam título, texto e imagem em cada slide. Já a ordem dos slides (arrastando as miniaturas) define a sequência da história contada.",
    points: [
      "Escolha um layout pronto em vez de montar do zero.",
      "Arraste as miniaturas para reordenar os slides.",
      "Uma boa ordem tem começo, meio e fim.",
    ],
    practice: {
      question: "Como você muda a ordem dos slides em uma apresentação?",
      options: [
        "Arrastando as miniaturas no painel lateral",
        "Mudando a cor de fundo",
        "Editando o texto do título",
      ],
      correctIndex: 0,
      explanation: "As miniaturas laterais podem ser arrastadas para reorganizar a sequência.",
    },
  },
  {
    id: "ppt-7",
    app: "ppt",
    order: 7,
    emoji: "🎨",
    title: "Escolhendo um tema",
    summary:
      "Um tema aplica cores, fontes e estilo a toda a apresentação de uma vez, deixando tudo combinando e com aparência mais profissional.",
    points: [
      "Temas mantêm cores e fontes consistentes em todos os slides.",
      "Poucas cores bem escolhidas comunicam melhor que muitas.",
      "Fontes legíveis são mais importantes que fontes 'bonitinhas'.",
    ],
    practice: {
      question: "Qual é a vantagem de aplicar um tema pronto à apresentação?",
      options: [
        "Deixa cores e fontes combinando em todos os slides",
        "Apaga o conteúdo dos slides",
        "Aumenta o número de slides automaticamente",
      ],
      correctIndex: 0,
      explanation: "O tema aplica um visual consistente sem precisar formatar slide por slide.",
    },
  },
  {
    id: "ppt-8",
    app: "ppt",
    order: 8,
    emoji: "🎞️",
    title: "Transições entre slides",
    summary:
      "Transições são o efeito ao passar de um slide para o outro. Usadas com moderação, deixam a apresentação mais fluida sem distrair a plateia.",
    points: [
      "Transições suaves ajudam mais do que efeitos chamativos.",
      "Use o mesmo tipo de transição em toda a apresentação.",
      "O objetivo é ajudar a mensagem, nunca competir com ela.",
    ],
    practice: {
      question: "Como devem ser as transições em uma apresentação profissional?",
      options: [
        "Suaves e usadas com moderação",
        "Diferentes e chamativas em cada slide",
        "Nunca devem ser usadas",
      ],
      correctIndex: 0,
      explanation: "Transições discretas mantêm o foco no conteúdo, não no efeito visual.",
    },
  },
  {
    id: "ppt-9",
    app: "ppt",
    order: 9,
    emoji: "⭐",
    title: "Formas e ícones",
    summary:
      "Setas, círculos e ícones ajudam a destacar informações e organizar ideias visualmente — mas em excesso, poluem o slide em vez de esclarecer.",
    points: [
      "Setas indicam direção ou sequência.",
      "Ícones representam uma ideia rapidamente, sem texto.",
      "Combine formas e ícones com o tema da apresentação.",
    ],
    practice: {
      question: "Qual o maior risco ao usar formas e ícones em um slide?",
      options: [
        "Exagerar e poluir o slide",
        "Deixar o slide sem nenhuma cor",
        "Usar apenas uma forma",
      ],
      correctIndex: 0,
      explanation: "Formas e ícones devem esclarecer a mensagem, não competir por atenção.",
    },
  },
  {
    id: "ppt-10",
    app: "ppt",
    order: 10,
    emoji: "🖥️",
    title: "Apresentando em tela cheia",
    summary:
      "Pressione F5 para exibir a apresentação em tela cheia desde o primeiro slide, use as setas ou o clique para avançar e Esc para encerrar.",
    points: [
      "F5 inicia a apresentação do começo.",
      "Setas ou clique do mouse avançam os slides.",
      "Esc encerra a exibição a qualquer momento.",
    ],
    practice: {
      question: "Qual tecla inicia a apresentação de slides desde o começo?",
      options: ["F5", "F2", "Ctrl+Z"],
      correctIndex: 0,
      explanation: "F5 coloca a apresentação em tela cheia a partir do primeiro slide.",
    },
  },
];

export function lessonsForApp(app: LessonApp) {
  return LESSONS.filter((l) => l.app === app).sort((a, b) => a.order - b.order);
}

export const LESSON_TOTALS: Record<LessonApp, number> = {
  word: LESSONS.filter((l) => l.app === "word").length,
  excel: LESSONS.filter((l) => l.app === "excel").length,
  ppt: LESSONS.filter((l) => l.app === "ppt").length,
};
