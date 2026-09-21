import type { Activity, Difficulty } from "@/types/game";

/**
 * Atalhos do Microsoft 365 (português), exatamente como nas tabelas de referência
 * do curso. É a fonte única: as perguntas de atalhos, as dicas e os jogos usam
 * estes dados — se um atalho mudar, muda aqui.
 *
 * Observação sobre a Tabela do Word: "Selecionar tudo" aparece com Ctrl+A, o mesmo
 * atalho de "Abrir". Por essa ambiguidade, "Selecionar tudo" ficou de fora.
 */

export type ShortcutApp = "word" | "excel" | "ppt";

export interface ShortcutDef {
  /** verbo no infinitivo: "salvar o documento" */
  does: string;
  /** como aparece na tela, ex.: "Ctrl + B" */
  display: string;
  level: Difficulty;
  /** combinação normalizada, só quando dá para pressionar no navegador sem fechar a aba */
  press?: string[];
  /** igual nos três programas: não precisa de entrada extra na lista de dicas */
  common?: boolean;
  /** já existe uma atividade de "pressionar a tecla" escrita à mão para este atalho */
  hasPressActivity?: boolean;
}

export const APP_NAME: Record<ShortcutApp, string> = {
  word: "Word",
  excel: "Excel",
  ppt: "PowerPoint",
};

export const SHORTCUTS_BY_APP: Record<ShortcutApp, ShortcutDef[]> = {
  word: [
    { does: "abrir um documento existente", display: "Ctrl + A", level: "facil", press: ["ctrl", "a"], hasPressActivity: true },
    { does: "criar um novo documento", display: "Ctrl + O", level: "facil", press: ["ctrl", "o"] },
    { does: "salvar o documento", display: "Ctrl + B", level: "facil", press: ["ctrl", "b"] },
    { does: "fechar o documento", display: "Ctrl + W", level: "medio" },
    { does: "recortar o conteúdo selecionado", display: "Ctrl + X", level: "facil", press: ["ctrl", "x"], common: true, hasPressActivity: true },
    { does: "copiar o conteúdo selecionado", display: "Ctrl + C", level: "facil", press: ["ctrl", "c"], common: true, hasPressActivity: true },
    { does: "colar o conteúdo da área de transferência", display: "Ctrl + V", level: "facil", press: ["ctrl", "v"], common: true, hasPressActivity: true },
    { does: "colar apenas o texto, sem a formatação", display: "Ctrl + Shift + V", level: "dificil", press: ["ctrl", "shift", "v"] },
    { does: "aplicar negrito ao texto", display: "Ctrl + N", level: "facil" },
    { does: "aplicar itálico ao texto", display: "Ctrl + I", level: "facil", press: ["ctrl", "i"], hasPressActivity: true },
    { does: "sublinhar o texto", display: "Ctrl + S", level: "facil", press: ["ctrl", "s"], hasPressActivity: true },
    { does: "diminuir a fonte em 1 ponto", display: "Ctrl + [", level: "dificil" },
    { does: "aumentar a fonte em 1 ponto", display: "Ctrl + ]", level: "dificil" },
    { does: "centralizar o texto", display: "Ctrl + E", level: "medio", press: ["ctrl", "e"] },
    { does: "alinhar o texto à esquerda", display: "Ctrl + Q", level: "medio" },
    { does: "alinhar o texto à direita", display: "Ctrl + R", level: "medio", press: ["ctrl", "r"] },
    { does: "cancelar um comando", display: "Esc", level: "facil", press: ["escape"] },
    { does: "desfazer a ação anterior", display: "Ctrl + Z", level: "facil", press: ["ctrl", "z"], common: true, hasPressActivity: true },
    { does: "refazer a ação anterior", display: "Ctrl + Y", level: "facil", press: ["ctrl", "y"], common: true, hasPressActivity: true },
    { does: "ampliar o zoom", display: "Ctrl + Sinal de adição (+)", level: "medio" },
    { does: "reduzir o zoom", display: "Ctrl + Sinal de subtração (-)", level: "medio" },
    { does: "voltar o zoom para 100%", display: "Ctrl + 0", level: "medio", press: ["ctrl", "0"] },
    { does: "aumentar ou diminuir o zoom com o mouse", display: "Ctrl + Rolagem do mouse", level: "medio" },
    { does: "dividir a janela do documento", display: "Ctrl + Alt + S", level: "dificil" },
    { does: "remover a divisão da janela do documento", display: "Alt + Shift + C", level: "dificil" },
  ],
  excel: [
    { does: "fechar uma pasta de trabalho", display: "Ctrl + W", level: "medio" },
    { does: "abrir uma pasta de trabalho", display: "Ctrl + A", level: "facil", press: ["ctrl", "a"], hasPressActivity: true },
    { does: "ir para a guia Página Inicial", display: "Alt + H", level: "medio" },
    { does: "salvar uma pasta de trabalho", display: "Ctrl + B", level: "facil", press: ["ctrl", "b"] },
    { does: "copiar a seleção", display: "Ctrl + C", level: "facil", press: ["ctrl", "c"], common: true, hasPressActivity: true },
    { does: "colar a seleção", display: "Ctrl + V", level: "facil", press: ["ctrl", "v"], common: true, hasPressActivity: true },
    { does: "desfazer a ação recente", display: "Ctrl + Z", level: "facil", press: ["ctrl", "z"], common: true, hasPressActivity: true },
    { does: "remover o conteúdo da célula", display: "Delete (Apagar)", level: "facil", press: ["delete"] },
    { does: "escolher uma cor de preenchimento", display: "Alt + C, R", level: "dificil" },
    { does: "cortar a seleção", display: "Ctrl + X", level: "facil", press: ["ctrl", "x"], common: true, hasPressActivity: true },
    { does: "ir para a guia Inserir", display: "Alt + N", level: "medio" },
    { does: "aplicar negrito", display: "Ctrl + Alt + N", level: "dificil" },
    { does: "centralizar o conteúdo da célula", display: "Alt + H, A, C", level: "dificil" },
    { does: "ir para a guia Layout da Página", display: "Alt + P", level: "medio" },
    { does: "ir para a guia Dados", display: "Alt + A", level: "medio" },
    { does: "ir para a guia Exibir", display: "Alt + W", level: "medio" },
    { does: "abrir o menu de contexto", display: "Shift + F10", level: "medio", press: ["shift", "f10"] },
    { does: "adicionar bordas", display: "Alt + C, B", level: "dificil" },
    { does: "excluir uma coluna", display: "Alt + H, D, C", level: "dificil" },
    { does: "ir para a guia Fórmulas", display: "Alt + M", level: "medio" },
    { does: "ocultar as linhas selecionadas", display: "Ctrl + 9", level: "medio", press: ["ctrl", "9"] },
    { does: "ocultar as colunas selecionadas", display: "Ctrl + 0", level: "medio", press: ["ctrl", "0"] },
  ],
  ppt: [
    { does: "criar uma nova apresentação", display: "Ctrl + N", level: "facil" },
    { does: "adicionar um novo slide", display: "Ctrl + M", level: "facil", press: ["ctrl", "m"] },
    { does: "aplicar negrito ao texto selecionado", display: "Ctrl + B", level: "facil", press: ["ctrl", "b"] },
    { does: "abrir a caixa de diálogo Fonte", display: "Ctrl + T", level: "medio" },
    { does: "recortar o texto, objeto ou slide selecionado", display: "Ctrl + X", level: "facil", press: ["ctrl", "x"], common: true, hasPressActivity: true },
    { does: "copiar o texto, objeto ou slide selecionado", display: "Ctrl + C", level: "facil", press: ["ctrl", "c"], common: true, hasPressActivity: true },
    { does: "colar o texto, objeto ou slide copiado", display: "Ctrl + V", level: "facil", press: ["ctrl", "v"], common: true, hasPressActivity: true },
    { does: "inserir um hiperlink", display: "Ctrl + K", level: "medio", press: ["ctrl", "k"] },
    { does: "inserir um novo comentário", display: "Ctrl + Alt + M", level: "dificil" },
    { does: "desfazer a última ação", display: "Ctrl + Z", level: "facil", press: ["ctrl", "z"], common: true, hasPressActivity: true },
    { does: "refazer a última ação", display: "Ctrl + Y", level: "facil", press: ["ctrl", "y"], common: true, hasPressActivity: true },
    { does: "ir para o próximo slide", display: "Page Down", level: "medio", press: ["pagedown"] },
    { does: "ir para o slide anterior", display: "Page Up", level: "medio", press: ["pageup"] },
    { does: "iniciar a apresentação de slides", display: "F5", level: "facil", press: ["f5"] },
    { does: "encerrar a apresentação de slides", display: "Esc", level: "facil", press: ["escape"] },
    { does: "imprimir uma apresentação", display: "Ctrl + P", level: "facil", press: ["ctrl", "p"] },
    { does: "salvar a apresentação", display: "Ctrl + S", level: "facil", press: ["ctrl", "s"], hasPressActivity: true },
    { does: "fechar o PowerPoint", display: "Ctrl + Q", level: "medio" },
  ],
};

const POINTS: Record<Difficulty, number> = { facil: 100, medio: 120, dificil: 150 };
const SECONDS: Record<Difficulty, number> = { facil: 15, medio: 18, dificil: 22 };
const PREFIX: Record<ShortcutApp, string> = { word: "w", excel: "e", ppt: "p" };

/** Alternativas erradas escolhidas sem sorteio, para o resultado ser igual no servidor e no navegador. */
function distractors(list: ShortcutDef[], index: number): string[] {
  const own = list[index];
  const usesCtrl = own.display.startsWith("Ctrl");
  const candidates = list.filter(
    (c, i) =>
      i !== index &&
      !c.display.includes(own.display) &&
      !own.display.includes(c.display) &&
      c.display.startsWith("Ctrl") === usesCtrl
  );
  const pool = candidates.length >= 3 ? candidates : list.filter((_, i) => i !== index);
  const start = (index * 7) % pool.length;
  const picked: string[] = [];
  for (let k = 0; picked.length < 3 && k < pool.length; k++) {
    const display = pool[(start + k) % pool.length].display;
    if (display !== own.display && !picked.includes(display)) picked.push(display);
  }
  return picked;
}

function buildActivities(): Activity[] {
  const out: Activity[] = [];
  (Object.keys(SHORTCUTS_BY_APP) as ShortcutApp[]).forEach((app) => {
    const list = SHORTCUTS_BY_APP[app];
    const appName = APP_NAME[app];
    list.forEach((s, i) => {
      const wrong = distractors(list, i);
      const correctIndex = (i * 5 + 1) % 4;
      const options = [...wrong];
      options.splice(correctIndex, 0, s.display);
      out.push({
        id: `sc-${PREFIX[app]}-${i + 1}`,
        app,
        category: "atalhos",
        type: "mcq",
        difficulty: s.level,
        prompt: `No ${appName}, qual é o atalho para ${s.does}?`,
        options,
        correctIndex,
        explanation: `No ${appName} (Microsoft 365), ${s.display} serve para ${s.does}.`,
        points: POINTS[s.level],
        timeSuggested: SECONDS[s.level],
      });
      if (s.press && !s.common && !s.hasPressActivity) {
        out.push({
          id: `sc-${PREFIX[app]}-${i + 1}-tecla`,
          app,
          category: "atalhos",
          type: "shortcut",
          difficulty: s.level,
          prompt: `No ${appName}: ${s.does}`,
          keys: s.press,
          explanation: `No ${appName} (Microsoft 365), ${s.display} serve para ${s.does}.`,
          points: POINTS[s.level] + 20,
          timeSuggested: 8,
        });
      }
    });
  });
  return out;
}

export const SHORTCUT_ACTIVITIES: Activity[] = buildActivities();

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Entradas para a lista de dicas (só atalhos que cabem em "tecla + tecla"). */
export function shortcutTips() {
  const tips: { keys: string[]; app: ShortcutApp; title: string; description: string }[] = [];
  (Object.keys(SHORTCUTS_BY_APP) as ShortcutApp[]).forEach((app) => {
    SHORTCUTS_BY_APP[app].forEach((s) => {
      if (s.common || /[,(]|Rolagem|adição|subtração/.test(s.display)) return;
      tips.push({
        keys: s.display.split(" + "),
        app,
        title: capitalize(s.does),
        description: `No ${APP_NAME[app]} (Microsoft 365), ${s.display} serve para ${s.does}.`,
      });
    });
  });
  return tips;
}
