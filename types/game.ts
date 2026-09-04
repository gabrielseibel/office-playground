export type AppId = "word" | "excel" | "ppt" | "geral";

export type Difficulty = "facil" | "medio" | "dificil";

export type ActivityType =
  | "mcq"
  | "true-false"
  | "shortcut"
  | "order"
  | "click-target"
  | "chart-choice";

export interface ChartOption {
  id: string;
  label: string;
  emoji: string;
}

export interface Activity {
  id: string;
  app: AppId;
  category: string;
  type: ActivityType;
  difficulty: Difficulty;
  prompt: string;
  /** Extra context shown above the prompt (a mini document, situation, spreadsheet snippet…) */
  context?: string;
  /** mcq */
  options?: string[];
  correctIndex?: number;
  /** true-false */
  correctBool?: boolean;
  /** shortcut — normalized key combo, e.g. ["ctrl", "c"] */
  keys?: string[];
  /** order — items already in the CORRECT order; shuffled at render time */
  items?: string[];
  /** click-target — spreadsheet-like grid */
  gridRows?: number;
  gridCols?: number;
  targetLabel?: string;
  /** chart-choice */
  chartOptions?: ChartOption[];
  correctChartId?: string;
  explanation: string;
  points: number;
  timeSuggested: number;
}

export interface AnswerResult {
  correct: boolean;
  timeMs: number;
}

export interface ProgressState {
  xp: number;
  combo: number;
  bestCombo: number;
  correct: number;
  attempts: number;
  fastCorrect: number;
  shortcutCorrect: number;
  perfectRuns: number;
  sessionActivities: number;
  completedByApp: Record<AppId, number>;
  correctByApp: Record<AppId, number>;
  categoryCorrect: Record<string, number>;
  achievements: string[];
  bestQuizScore: number;
  accessible: boolean;
  completedLessons: string[];
  masterChallenge: {
    word: number;
    excel: number;
    ppt: number;
    overall: number;
    completedAt: string;
  } | null;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: AppId | "geral";
  check: (s: ProgressState) => boolean;
}
