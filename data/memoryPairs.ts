import type { MemoryPair } from "@/components/game/MemoryMatch";

export const WORD_MEMORY_PAIRS: MemoryPair[] = [
  { a: "NEGRITO", b: "Ctrl + B" },
  { a: "ITÁLICO", b: "Ctrl + I" },
  { a: "SUBLINHADO", b: "Ctrl + U" },
  { a: "COPIAR", b: "Ctrl + C" },
  { a: "COLAR", b: "Ctrl + V" },
  { a: "DESFAZER", b: "Ctrl + Z" },
];

export const PPT_MEMORY_PAIRS: MemoryPair[] = [
  { a: "SLIDE", b: "Página da apresentação" },
  { a: "TRANSIÇÃO", b: "Mudança entre slides" },
  { a: "ANIMAÇÃO", b: "Movimento de um elemento" },
  { a: "LAYOUT", b: "Organização do slide" },
  { a: "TEMA", b: "Conjunto visual" },
  { a: "APRESENTAÇÃO", b: "Conjunto de slides" },
];

export const EXCEL_MEMORY_PAIRS: MemoryPair[] = [
  { a: "CÉLULA", b: "Cruzamento de linha e coluna" },
  { a: "=SOMA()", b: "Soma os valores" },
  { a: "=MÉDIA()", b: "Calcula a média" },
  { a: "=MÁXIMO()", b: "Encontra o maior valor" },
  { a: "PASTA DE TRABALHO", b: "Arquivo do Excel" },
  { a: "GRÁFICO DE LINHA", b: "Mostra tendências no tempo" },
];

export const MIXED_MEMORY_PAIRS: MemoryPair[] = [
  { a: "📝 Word", b: "Documentos de texto" },
  { a: "📊 Excel", b: "Planilhas e cálculos" },
  { a: "🎨 PowerPoint", b: "Apresentações" },
  { a: "Ctrl + C", b: "Copiar" },
  { a: "Ctrl + V", b: "Colar" },
  { a: "Ctrl + Z", b: "Desfazer" },
  { a: "Ctrl + S", b: "Salvar" },
  { a: "F5", b: "Iniciar apresentação" },
  { a: "=SOMA()", b: "Função de soma" },
  { a: "Slide", b: "Página de apresentação" },
];
