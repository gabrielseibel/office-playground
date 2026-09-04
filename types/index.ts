export type AppId = "word" | "excel" | "ppt";

export interface AppMeta {
  id: AppId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
}

export interface Shortcut {
  keys: string[];
  app: AppId | "all";
  title: string;
  description: string;
}

export interface Curiosity {
  app: AppId | "all";
  title: string;
  text: string;
}

export interface Challenge {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  app: AppId | "all";
}

export interface ComparisonItem {
  title: string;
  bad: string;
  good: string;
  app: AppId;
}
