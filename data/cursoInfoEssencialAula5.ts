// Curso Informática Essencial. UC2, Aula 5 (Lajeado 2026.25.60, 23/10/2026).
// Instalar e desinstalar softwares: licenças, instalação segura, desinstalação e atualização.

export type Licenca = "livre" | "gratuito" | "teste" | "pago";

export const LICENCAS: { id: Licenca; nome: string; resumo: string }[] = [
  { id: "livre", nome: "Livre", resumo: "Gratuito e de código aberto" },
  { id: "gratuito", nome: "Gratuito", resumo: "Não paga, código fechado" },
  { id: "teste", nome: "Teste", resumo: "Funciona um tempo, depois pede compra" },
  { id: "pago", nome: "Pago", resumo: "Compra ou assinatura" },
];

export const PROGRAMAS: { nome: string; uso: string; licenca: Licenca; explicacao: string }[] = [
  { nome: "7-Zip", uso: "Compactador de arquivos", licenca: "livre", explicacao: "Código aberto (licença LGPL). Pode instalar em quantos computadores quiser, inclusive em empresa." },
  { nome: "VLC", uso: "Reprodutor de áudio e vídeo", licenca: "livre", explicacao: "Código aberto (licença GPL)." },
  { nome: "LibreOffice", uso: "Pacote de escritório", licenca: "livre", explicacao: "Código aberto (licença MPL). Alternativa livre ao Microsoft 365." },
  { nome: "Firefox", uso: "Navegador", licenca: "livre", explicacao: "Código aberto (licença MPL), mantido pela Fundação Mozilla." },
  { nome: "Adobe Acrobat Reader", uso: "Leitor de PDF", licenca: "gratuito", explicacao: "Freeware: não paga, mas o código é fechado e a Adobe define as regras." },
  { nome: "Google Chrome", uso: "Navegador", licenca: "gratuito", explicacao: "Freeware: grátis, de código fechado." },
  { nome: "WinRAR", uso: "Compactador de arquivos", licenca: "teste", explicacao: "Shareware: 40 dias de teste; depois a licença pede compra." },
  { nome: "Microsoft 365", uso: "Pacote de escritório", licenca: "pago", explicacao: "Proprietário, por assinatura mensal ou anual." },
  { nome: "Windows 11", uso: "Sistema operacional", licenca: "pago", explicacao: "Proprietário. A licença vem com o computador (OEM) ou é comprada à parte." },
  { nome: "SumatraPDF", uso: "Leitor de PDF", licenca: "livre", explicacao: "Código aberto (licença GPL), leve e sem propaganda." },
];

export type Veredito = "pode" | "nao" | "depende";

export const SITUACOES: { texto: string; resposta: Veredito; explicacao: string }[] = [
  { texto: "Instalar no escritório um Office crackeado, baixado de um site de downloads.", resposta: "nao", explicacao: "É pirataria. A Lei 9.609/1998, a Lei do Software, prevê detenção de 6 meses a 2 anos ou multa, além de indenização ao fabricante." },
  { texto: "Instalar o 7-Zip nos 10 computadores do Balanço Certo.", resposta: "pode", explicacao: "A licença livre permite instalar em quantos computadores quiser, inclusive em empresa." },
  { texto: "Continuar usando o WinRAR depois dos 40 dias de teste, sem comprar.", resposta: "nao", explicacao: "A licença de teste pede a compra. O certo é comprar ou trocar por um compactador livre, como o 7-Zip." },
  { texto: "Passar o instalador do Chrome para um colega pelo pendrive.", resposta: "pode", explicacao: "O Chrome é gratuito. O mais seguro, ainda assim, é baixar do site oficial." },
  { texto: "Tirar o Windows de um computador velho da empresa e ativar em outro novo.", resposta: "depende", explicacao: "Licença OEM fica presa ao computador em que veio. Licença de varejo, comprada à parte, pode ser transferida." },
  { texto: "Usar no escritório um programa grátis cuja licença diz: somente para uso pessoal.", resposta: "nao", explicacao: "Gratuito não é livre para tudo. Uso em empresa precisa da versão comercial." },
  { texto: "Baixar o LibreOffice e instalar no computador da recepção.", resposta: "pode", explicacao: "Software livre pode ser usado em empresa sem pagar." },
  { texto: "Copiar a pasta de um programa pago de um computador para outro, sem comprar outra licença.", resposta: "nao", explicacao: "Cada instalação de programa pago precisa da sua licença." },
];

// Simulador de instalador com armadilhas
export type PassoInstalador =
  | { tipo: "info"; titulo: string; texto: string }
  | { tipo: "termos"; titulo: string; texto: string }
  | { tipo: "modo"; titulo: string; texto: string }
  | { tipo: "caixas"; titulo: string; texto: string; caixas: { id: string; rotulo: string; marcada: boolean; lixo: boolean }[] }
  | { tipo: "fim"; titulo: string; texto: string };

export const INSTALADOR: PassoInstalador[] = [
  { tipo: "info", titulo: "Bem-vindo ao instalador do Leitor PDF Plus 6.2", texto: "Este assistente vai instalar o Leitor PDF Plus no seu computador. Feche os outros programas antes de continuar." },
  { tipo: "termos", titulo: "Contrato de licença", texto: "O Leitor PDF Plus é gratuito para uso pessoal e comercial. É proibido vender ou modificar o programa. Para continuar, aceite os termos." },
  { tipo: "modo", titulo: "Tipo de instalação", texto: "Escolha como quer instalar." },
  {
    tipo: "caixas",
    titulo: "Componentes",
    texto: "Escolha o que será instalado.",
    caixas: [
      { id: "leitor", rotulo: "Leitor PDF Plus (obrigatório)", marcada: true, lixo: false },
      { id: "atalho", rotulo: "Criar atalho na Área de Trabalho", marcada: true, lixo: false },
      { id: "barra", rotulo: "Instalar também a Barra de Pesquisa Turbo no navegador", marcada: true, lixo: true },
      { id: "inicial", rotulo: "Tornar a Busca Turbo a página inicial do navegador", marcada: true, lixo: true },
    ],
  },
  {
    tipo: "caixas",
    titulo: "Ofertas especiais",
    texto: "Nossos parceiros têm programas que podem interessar a você.",
    caixas: [
      { id: "otimizador", rotulo: "Instalar PC Otimizador Max (teste grátis de 7 dias)", marcada: true, lixo: true },
      { id: "antivirus", rotulo: "Instalar Antivírus Super Shield (teste grátis)", marcada: true, lixo: true },
    ],
  },
  { tipo: "fim", titulo: "Pronto para instalar", texto: "Clique em Instalar para concluir." },
];

// Monte o caminho: desinstalar no Windows 11
export const CAMINHO_DESINSTALAR = [
  "Abrir o menu Iniciar e entrar em Configurações",
  "Clicar em Aplicativos",
  "Clicar em Aplicativos instalados",
  "Achar o programa na lista",
  "Clicar nos três pontinhos ao lado dele",
  "Clicar em Desinstalar e seguir o desinstalador",
  "Conferir no menu Iniciar se o programa sumiu",
];

// Instala ou não instala? (requisitos e compatibilidade)
export const COMPATIBILIDADE: {
  computador: string;
  programa: string;
  instala: boolean;
  explicacao: string;
}[] = [
  { computador: "Windows 11 de 64 bits, 8 GB de RAM, 120 GB livres", programa: "7-Zip 64 bits. Pede Windows 10 ou 11, 64 bits", instala: true, explicacao: "O sistema é de 64 bits e atende ao requisito." },
  { computador: "Windows 10 de 32 bits, 4 GB de RAM", programa: "Programa de notas fiscais. Pede Windows 10 ou 11, 64 bits", instala: false, explicacao: "Programa de 64 bits não roda em Windows de 32 bits." },
  { computador: "Windows 11 de 64 bits, 4 GB de RAM, 15 GB livres", programa: "Editor de vídeo. Pede 16 GB de RAM e 20 GB livres", instala: false, explicacao: "Falta memória RAM e falta espaço em disco." },
  { computador: "Windows 11 de 64 bits, 8 GB de RAM", programa: "SumatraPDF 32 bits. Pede Windows 7 ou mais novo", instala: true, explicacao: "Programa de 32 bits costuma rodar em Windows de 64 bits." },
  { computador: "macOS 14, computador Apple", programa: "WinRAR para Windows (arquivo .exe)", instala: false, explicacao: "Arquivo .exe é para Windows. No Mac, é preciso a versão para macOS." },
  { computador: "Ubuntu Linux 24.04", programa: "LibreOffice para Linux (pacote .deb)", instala: true, explicacao: "O LibreOffice é multiplataforma e tem versão para Linux." },
];

// Chamados do Balanço Certo (dupla)
export const CHAMADOS: {
  quem: string;
  relato: string;
  causas: string[];
  causaCerta: number;
  solucoes: string[];
  solucaoCerta: number;
}[] = [
  {
    quem: "Rosana, recepção",
    relato: "O WinRAR começou a mostrar todo dia: seu período de teste acabou, compre a licença.",
    causas: ["Vírus no computador", "A licença de teste venceu", "Falta atualizar o Windows"],
    causaCerta: 1,
    solucoes: ["Ignorar a mensagem para sempre", "Comprar a licença ou trocar pelo 7-Zip, que é livre", "Formatar o computador"],
    solucaoCerta: 1,
  },
  {
    quem: "Marcos, contador",
    relato: "Instalei um leitor de PDF e agora o navegador abre numa página de pesquisa estranha.",
    causas: ["O instalador trouxe um programa de carona", "A internet caiu", "O leitor de PDF está desatualizado"],
    causaCerta: 0,
    solucoes: ["Desinstalar a barra extra em Aplicativos instalados e voltar a página inicial", "Trocar de navegador", "Apagar a pasta Downloads"],
    solucaoCerta: 0,
  },
  {
    quem: "Carla, financeiro",
    relato: "Apaguei a pasta do programa antigo de notas, mas o atalho continua no menu Iniciar e dá erro.",
    causas: ["O programa foi apagado, não desinstalado", "O menu Iniciar está com defeito", "Faltou reiniciar o roteador"],
    causaCerta: 0,
    solucoes: ["Reinstalar o Windows", "Desinstalar pelo caminho certo ou pelo desinstalador do fabricante e apagar o atalho", "Esconder o atalho"],
    solucaoCerta: 1,
  },
  {
    quem: "Jair, arquivo",
    relato: "O programa novo não instala: diz que não é compatível com este computador.",
    causas: ["O mouse está com problema", "Programa de 64 bits num Windows de 32 bits", "O antivírus está desligado"],
    causaCerta: 1,
    solucoes: ["Conferir em Sistema, Sobre, o tipo de sistema e baixar a versão certa", "Instalar de novo até funcionar", "Desligar o antivírus"],
    solucaoCerta: 0,
  },
  {
    quem: "Dona Elza, sócia",
    relato: "Um amigo me passou um pendrive com o Office ativado de graça. Posso instalar em todos os computadores?",
    causas: ["É uma promoção da Microsoft", "É software pirata", "É um software livre"],
    causaCerta: 1,
    solucoes: ["Instalar só em um computador", "Não instalar; oferecer Microsoft 365 com licença ou o LibreOffice", "Instalar e não contar para ninguém"],
    solucaoCerta: 1,
  },
];

export const VERDADE_OU_MITO_SOFTWARE: { frase: string; verdade: boolean; explicacao: string }[] = [
  { frase: "Programa gratuito pode ser usado em qualquer empresa.", verdade: false, explicacao: "Depende da licença. Alguns são grátis só para uso pessoal." },
  { frase: "Apagar a pasta do programa em Arquivos de Programas é o jeito certo de desinstalar.", verdade: false, explicacao: "Sobram registros, atalhos e serviços. Desinstale por Configurações, Aplicativos." },
  { frase: "Software livre pode ser instalado em vários computadores sem pagar.", verdade: true, explicacao: "É uma das liberdades da licença livre." },
  { frase: "Programa de 64 bits funciona em Windows de 32 bits.", verdade: false, explicacao: "O sistema precisa ser de 64 bits. O contrário costuma funcionar." },
  { frase: "Antes de instalar vários programas, vale criar um snapshot da máquina virtual.", verdade: true, explicacao: "Se algo der errado, a VM volta ao estado anterior em segundos." },
  { frase: "Manter os programas atualizados ajuda na segurança do computador.", verdade: true, explicacao: "As atualizações corrigem falhas que vírus e golpes aproveitam." },
  { frase: "O botão Download maior e mais colorido do site é sempre o verdadeiro.", verdade: false, explicacao: "Botões grandes e piscando costumam ser propaganda. Baixe do site oficial." },
  { frase: "Instalação personalizada mostra o que vai ser instalado junto.", verdade: true, explicacao: "Na personalizada você vê e desmarca o que vem de carona." },
];
