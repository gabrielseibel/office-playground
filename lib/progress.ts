"use client";

import * as React from "react";
import type { Achievement, AppId, ProgressState } from "@/types/game";
import { ACHIEVEMENTS } from "@/data/achievements";

const STORAGE_KEY = "op:progress:v1";
const SESSION_FLAG = "op:session-active";
const EVENT_NAME = "op:progress-changed";
const ACHIEVEMENT_EVENT = "op:achievement";
const LEVELUP_EVENT = "op:levelup";

const EMPTY_APP_RECORD: Record<AppId, number> = {
  word: 0,
  excel: 0,
  ppt: 0,
  geral: 0,
  info: 0,
};

export const DEFAULT_PROGRESS: ProgressState = {
  xp: 0,
  combo: 0,
  bestCombo: 0,
  correct: 0,
  attempts: 0,
  fastCorrect: 0,
  shortcutCorrect: 0,
  perfectRuns: 0,
  sessionActivities: 0,
  completedByApp: { ...EMPTY_APP_RECORD },
  correctByApp: { ...EMPTY_APP_RECORD },
  categoryCorrect: {},
  achievements: [],
  bestQuizScore: 0,
  accessible: false,
  masterChallenge: null,
  completedLessons: [],
};

/** Nível 1 → 0 XP, 2 → 500, 3 → 1.000, 4 → 2.000, 5 → 3.500, 6 → 5.000, e daí em diante +2.000 por nível. */
const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500, 5000];

export function levelForXp(xp: number) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  if (xp >= lastThreshold) {
    const extra = xp - lastThreshold;
    level = LEVEL_THRESHOLDS.length + Math.floor(extra / 2000);
  }
  return level;
}

export function xpForLevel(level: number) {
  if (level <= 1) return 0;
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1];
  return (
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] +
    (level - LEVEL_THRESHOLDS.length) * 2000
  );
}

export function xpProgress(xp: number) {
  const level = levelForXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = Math.max(1, ceil - floor);
  const pct = Math.min(100, Math.round(((xp - floor) / span) * 100));
  return { level, floor, ceil, pct };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function normalize(raw: Partial<ProgressState> | null): ProgressState {
  return {
    ...DEFAULT_PROGRESS,
    ...raw,
    completedByApp: { ...EMPTY_APP_RECORD, ...raw?.completedByApp },
    correctByApp: { ...EMPTY_APP_RECORD, ...raw?.correctByApp },
    categoryCorrect: { ...raw?.categoryCorrect },
    achievements: raw?.achievements ? [...raw.achievements] : [],
    completedLessons: raw?.completedLessons ? [...raw.completedLessons] : [],
  };
}

export function loadProgress(): ProgressState {
  if (!isBrowser()) return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const state = normalize(raw ? JSON.parse(raw) : null);

    // Reset "session" activity counter once per browser tab session.
    if (!window.sessionStorage.getItem(SESSION_FLAG)) {
      window.sessionStorage.setItem(SESSION_FLAG, "1");
      state.sessionActivities = 0;
      saveProgress(state, { silent: true });
    }
    return state;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: ProgressState, opts?: { silent?: boolean }) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (!opts?.silent) {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  } catch {
    // localStorage indisponível (modo privado, quota) — segue sem persistir.
  }
}

export function resetProgress() {
  saveProgress({ ...DEFAULT_PROGRESS });
}

export function setAccessible(accessible: boolean) {
  const state = loadProgress();
  state.accessible = accessible;
  saveProgress(state);
}

interface RecordAnswerInput {
  app: AppId;
  category?: string;
  correct: boolean;
  timeMs: number;
  points: number;
  isShortcut?: boolean;
}

interface RecordAnswerResult {
  state: ProgressState;
  unlocked: Achievement[];
  leveledUp: boolean;
  newLevel: number;
}

const FAST_ANSWER_MS = 5000;
const FAST_BONUS_XP = 20;

export function recordAnswer(input: RecordAnswerInput): RecordAnswerResult {
  const state = loadProgress();
  const beforeLevel = levelForXp(state.xp);

  state.attempts += 1;
  state.completedByApp[input.app] = (state.completedByApp[input.app] ?? 0) + 1;

  if (input.correct) {
    state.correct += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.correctByApp[input.app] = (state.correctByApp[input.app] ?? 0) + 1;
    state.sessionActivities += 1;

    let gained = input.points;
    if (input.timeMs > 0 && input.timeMs < FAST_ANSWER_MS) {
      state.fastCorrect += 1;
      gained += FAST_BONUS_XP;
    }
    if (input.isShortcut) state.shortcutCorrect += 1;
    if (input.category) {
      state.categoryCorrect[input.category] =
        (state.categoryCorrect[input.category] ?? 0) + 1;
    }
    // Combo bonus, na linha do "Desafio dos 60 segundos".
    if (state.combo > 0 && state.combo % 10 === 0) gained += 300;
    else if (state.combo > 0 && state.combo % 5 === 0) gained += 100;
    else if (state.combo > 0 && state.combo % 3 === 0) gained += 50;

    state.xp += gained;
  } else {
    state.combo = 0;
  }

  const unlocked: Achievement[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.check(state)) {
      state.achievements.push(achievement.id);
      unlocked.push(achievement);
    }
  }

  saveProgress(state, { silent: true });

  const afterLevel = levelForXp(state.xp);
  const leveledUp = afterLevel > beforeLevel;

  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  for (const achievement of unlocked) {
    window.dispatchEvent(
      new CustomEvent(ACHIEVEMENT_EVENT, { detail: { id: achievement.id } })
    );
  }
  if (leveledUp) {
    window.dispatchEvent(
      new CustomEvent(LEVELUP_EVENT, { detail: { level: afterLevel } })
    );
  }

  return { state, unlocked, leveledUp, newLevel: afterLevel };
}

export function recordMasterChallenge(result: {
  word: number;
  excel: number;
  ppt: number;
}) {
  const state = loadProgress();
  const overall = Math.round((result.word + result.excel + result.ppt) / 3);
  state.masterChallenge = { ...result, overall, completedAt: new Date().toISOString() };

  const unlocked: Achievement[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.check(state)) {
      state.achievements.push(achievement.id);
      unlocked.push(achievement);
    }
  }
  saveProgress(state, { silent: true });
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  for (const achievement of unlocked) {
    window.dispatchEvent(
      new CustomEvent(ACHIEVEMENT_EVENT, { detail: { id: achievement.id } })
    );
  }
  return state;
}

const LESSON_XP = 30;

export function completeLesson(lessonId: string) {
  const state = loadProgress();
  const beforeLevel = levelForXp(state.xp);

  const already = state.completedLessons.includes(lessonId);
  if (!already) {
    state.completedLessons.push(lessonId);
    state.xp += LESSON_XP;
  }

  const unlocked: Achievement[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.check(state)) {
      state.achievements.push(achievement.id);
      unlocked.push(achievement);
    }
  }

  saveProgress(state, { silent: true });

  const afterLevel = levelForXp(state.xp);
  const leveledUp = afterLevel > beforeLevel;

  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  for (const achievement of unlocked) {
    window.dispatchEvent(
      new CustomEvent(ACHIEVEMENT_EVENT, { detail: { id: achievement.id } })
    );
  }
  if (leveledUp) {
    window.dispatchEvent(
      new CustomEvent(LEVELUP_EVENT, { detail: { level: afterLevel } })
    );
  }

  return { state, unlocked, leveledUp, newLevel: afterLevel, alreadyDone: already };
}

export function useProgress() {
  const [state, setState] = React.useState<ProgressState>(DEFAULT_PROGRESS);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setState(loadProgress());
    setMounted(true);
    function refresh() {
      setState(loadProgress());
    }
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return {
    state,
    mounted,
    recordAnswer,
    resetProgress,
    setAccessible,
    recordMasterChallenge,
    completeLesson,
  } as const;
}

export { EVENT_NAME as PROGRESS_EVENT, ACHIEVEMENT_EVENT, LEVELUP_EVENT };
