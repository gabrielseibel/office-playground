import type { MemoryPair } from "@/components/game/MemoryMatch";

export const WORD_MEMORY_PAIRS: MemoryPair[] = [
  { a: "NEGRITO", b: "Ctrl + N" },
  { a: "ITÁLICO", b: "Ctrl + I" },
  { a: "SUBLINHADO", b: "Ctrl + S" },
  { a: "SALVAR", b: "Ctrl + B" },
  { a: "CENTRALIZAR", b: "Ctrl + E" },
  { a: "COPIAR", b: "Ctrl + C" },
  { a: "COLAR", b: "Ctrl + V" },
  { a: "DESFAZER", b: "Ctrl + Z" },
];

export const INFO_MEMORY_PAIRS: MemoryPair[] = [
  { a: "🛡️ Antivírus", b: "Protege contra vírus" },
  { a: "🗜️ Compactador", b: "Reduz e junta arquivos" },
  { a: "📄 Leitor de PDF", b: "Abre arquivos PDF" },
  { a: "🌐 Navegador", b: "Acessa sites" },
  { a: "📡 Roteador", b: "Distribui a internet" },
  { a: "🖨️ Scanner", b: "Digitaliza o papel" },
  { a: "🔋 Nobreak", b: "Mantém a energia" },
  { a: "💾 Backup", b: "Cópia de segurança" },
  { a: "☁️ Nuvem", b: "Arquivos na internet" },
  { a: "📁 Pasta", b: "Organiza arquivos" },
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
  { a: "Ctrl + B", b: "Salvar no Word" },
  { a: "Ctrl + S", b: "Salvar no PowerPoint" },
  { a: "F5", b: "Iniciar apresentação" },
  { a: "=SOMA()", b: "Função de soma" },
  { a: "Slide", b: "Página de apresentação" },
];
