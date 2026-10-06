/**
 * Curso Informática Essencial. UC2, Aula 4 (09/10): drivers e periféricos.
 * Dados das quatro dinâmicas da aula. Os textos seguem o material impresso
 * da aula, para o site e as cartas de papel darem a mesma resposta.
 */
import type { MemoryPair } from "@/components/game/MemoryMatch";

export type DriverColuna = "A" | "B" | "C";

export const COLUNAS: { id: DriverColuna; titulo: string; descricao: string }[] = [
  { id: "A", titulo: "O Windows reconhece sozinho", descricao: "Plug and Play, com driver genérico que já vem no sistema" },
  { id: "B", titulo: "Precisa do programa do fabricante", descricao: "Funciona por completo só com o driver ou software da marca" },
  { id: "C", titulo: "Não troca dados com o computador", descricao: "Não precisa de driver nenhum" },
];

export interface PerifericoCarta {
  id: string;
  nome: string;
  coluna: DriverColuna;
  porque: string;
}

export const PERIFERICOS: PerifericoCarta[] = [
  { id: "mouse", nome: "Mouse USB", coluna: "A", porque: "O Windows usa um driver genérico de mouse." },
  { id: "teclado", nome: "Teclado USB", coluna: "A", porque: "O Windows usa um driver genérico de teclado." },
  { id: "pendrive", nome: "Pendrive", coluna: "A", porque: "Aparece sozinho como unidade de disco." },
  { id: "hd", nome: "HD externo", coluna: "A", porque: "Aparece sozinho como unidade de disco." },
  { id: "webcam", nome: "Webcam USB comum", coluna: "A", porque: "Webcams comuns seguem um padrão que o Windows já conhece." },
  { id: "leitor", nome: "Leitor de código de barras USB", coluna: "A", porque: "Ele se comporta como um teclado que digita o código." },
  { id: "fone-bt", nome: "Fone Bluetooth", coluna: "A", porque: "Depois de pareado, o Windows usa o driver de áudio Bluetooth que já tem." },
  { id: "projetor", nome: "Projetor no HDMI", coluna: "A", porque: "Para o Windows, o projetor é só mais um monitor." },
  { id: "multi", nome: "Impressora multifuncional", coluna: "B", porque: "Imprimir até pode funcionar, mas escanear e os outros recursos pedem o programa da marca." },
  { id: "scanner", nome: "Scanner de mesa", coluna: "B", porque: "Precisa do driver do fabricante para digitalizar." },
  { id: "gpu", nome: "Placa de vídeo para jogos", coluna: "B", porque: "Sem o driver da marca, ela funciona no básico, sem desempenho." },
  { id: "mesa", nome: "Mesa digitalizadora", coluna: "B", porque: "A pressão da caneta só funciona com o driver do fabricante." },
  { id: "termica", nome: "Impressora térmica de cupom", coluna: "B", porque: "O comércio instala o driver da marca para imprimir o cupom certo." },
  { id: "estab", nome: "Estabilizador", coluna: "C", porque: "Ele só trata a energia da tomada." },
  { id: "nobreak", nome: "Nobreak sem cabo USB", coluna: "C", porque: "Sem cabo de dados, não conversa com o computador. Com cabo USB, ele usa programa de monitoramento." },
  { id: "caixas", nome: "Caixas de som no P2", coluna: "C", porque: "O som sai pela placa de som. Quem precisa de driver é a placa, não a caixa." },
];

export interface RodadaCorrida {
  procurar: string;
  ondeFica: string;
}

export const CORRIDA: RodadaCorrida[] = [
  { procurar: "Versão do driver da placa de rede", ondeFica: "Adaptadores de rede, propriedades, aba Driver" },
  { procurar: "Data do driver de vídeo", ondeFica: "Adaptadores de vídeo, propriedades, aba Driver" },
  { procurar: "Em que categoria fica o mouse", ondeFica: "Mouse e outros dispositivos apontadores" },
  { procurar: "Quantos itens existem em Controladores de som", ondeFica: "Controladores de som, vídeo e jogos" },
  { procurar: "Nome do fabricante do processador", ondeFica: "Processadores (o nome mostra Intel ou AMD)" },
  { procurar: "Onde aparece um pendrive conectado", ondeFica: "Unidades de disco e Controladores USB" },
  { procurar: "O botão que desfaz uma atualização de driver", ondeFica: "Reverter Driver, na aba Driver" },
  { procurar: "Como mostrar dispositivos ocultos", ondeFica: "Menu Exibir, Mostrar dispositivos ocultos" },
];

export const CONEXOES: MemoryPair[] = [
  { a: "Pendrive", b: "USB" },
  { a: "Monitor", b: "HDMI" },
  { a: "Fone com fio", b: "P2" },
  { a: "Fone sem fio", b: "Bluetooth" },
  { a: "Impressora do setor sem cabo", b: "Wi-Fi" },
  { a: "Controle remoto da TV", b: "IrDA (infravermelho)" },
  { a: "Internet com cabo", b: "RJ45" },
  { a: "Mouse sem fio com receptor", b: "Receptor USB" },
];

export interface FraseVM {
  frase: string;
  verdade: boolean;
  explicacao: string;
}

export const VERDADE_OU_MITO: FraseVM[] = [
  { frase: "Driver é o programa que ensina o Windows a conversar com uma peça.", verdade: true, explicacao: "Sem ele, o Windows não sabe usar o hardware." },
  { frase: "Driver mais novo sempre funciona melhor.", verdade: false, explicacao: "Uma atualização pode trazer erro. Para isso existe o Reverter Driver." },
  { frase: "Driver pode ser baixado de qualquer site que aparecer na pesquisa.", verdade: false, explicacao: "Só do Windows Update ou do site do fabricante. Site desconhecido pode trazer vírus." },
  { frase: "Desabilitar um dispositivo apaga o driver.", verdade: false, explicacao: "O driver continua lá. O dispositivo só fica desligado." },
  { frase: "O sinal amarelo no Gerenciador indica dispositivo com problema ou sem driver.", verdade: true, explicacao: "É o primeiro lugar que o técnico olha." },
  { frase: "Bluetooth alcança mais longe que Wi-Fi.", verdade: false, explicacao: "Bluetooth comum chega perto de 10 metros. O Wi-Fi vai mais longe." },
  { frase: "IrDA precisa que os aparelhos fiquem um de frente para o outro.", verdade: true, explicacao: "Infravermelho precisa de linha de visão." },
  { frase: "Estabilizador precisa de driver.", verdade: false, explicacao: "Ele só trata a energia. Não troca dados com o computador." },
  { frase: "A máquina virtual também precisa de drivers.", verdade: true, explicacao: "O pacote Adicionais para Convidado instala os drivers do hardware virtual." },
  { frase: "Plug and Play quer dizer que o Windows reconhece o aparelho sozinho.", verdade: true, explicacao: "Ele usa um driver genérico que já vem no sistema." },
  { frase: "Driver de 32 bits funciona em Windows de 64 bits.", verdade: false, explicacao: "O driver precisa ser da mesma arquitetura do sistema." },
  { frase: "Antes de mexer em driver, vale criar um ponto de restauração.", verdade: true, explicacao: "Se der errado, o técnico volta o sistema para antes da mudança." },
];
