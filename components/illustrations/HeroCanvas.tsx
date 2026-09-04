"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Sheet,
  Presentation,
  Circle,
  Triangle,
  Square,
  MousePointer2,
  Hash,
  Star,
  Calculator,
} from "lucide-react";

interface FloatingItem {
  Icon: React.ComponentType<{ className?: string }>;
  className: string;
  initial: { x: number; y: number };
  delay: number;
  duration: number;
  hue: "blue" | "green" | "orange";
}

const ITEMS: FloatingItem[] = [
  {
    Icon: FileText,
    className:
      "h-10 w-10 text-blue-600 bg-blue-100/80 dark:bg-blue-400/10 border border-blue-300/60 dark:border-blue-400/30 shadow-lg",
    initial: { x: 0, y: 0 },
    delay: 0,
    duration: 6,
    hue: "blue",
  },
  {
    Icon: Sheet,
    className:
      "h-10 w-10 text-emerald-600 bg-emerald-100/80 dark:bg-emerald-400/10 border border-emerald-300/60 dark:border-emerald-400/30 shadow-lg",
    initial: { x: 0, y: 0 },
    delay: 0.5,
    duration: 7,
    hue: "green",
  },
  {
    Icon: Presentation,
    className:
      "h-10 w-10 text-orange-600 bg-orange-100/80 dark:bg-orange-400/10 border border-orange-300/60 dark:border-orange-400/30 shadow-lg",
    initial: { x: 0, y: 0 },
    delay: 1,
    duration: 8,
    hue: "orange",
  },
  {
    Icon: Calculator,
    className: "h-7 w-7 text-emerald-700",
    initial: { x: 0, y: 0 },
    delay: 0.2,
    duration: 9,
    hue: "green",
  },
  {
    Icon: Hash,
    className: "h-6 w-6 text-blue-600",
    initial: { x: 0, y: 0 },
    delay: 1.4,
    duration: 7,
    hue: "blue",
  },
  {
    Icon: Star,
    className: "h-6 w-6 text-orange-500",
    initial: { x: 0, y: 0 },
    delay: 0.7,
    duration: 8,
    hue: "orange",
  },
  {
    Icon: Circle,
    className: "h-7 w-7 text-blue-500/70",
    initial: { x: 0, y: 0 },
    delay: 0.3,
    duration: 9,
    hue: "blue",
  },
  {
    Icon: Triangle,
    className: "h-6 w-6 text-emerald-500/70",
    initial: { x: 0, y: 0 },
    delay: 1.1,
    duration: 10,
    hue: "green",
  },
  {
    Icon: Square,
    className: "h-5 w-5 text-orange-500/70",
    initial: { x: 0, y: 0 },
    delay: 1.6,
    duration: 7,
    hue: "orange",
  },
  {
    Icon: MousePointer2,
    className: "h-6 w-6 text-foreground/50",
    initial: { x: 0, y: 0 },
    delay: 0.8,
    duration: 9,
    hue: "blue",
  },
];

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randPos(seed: number) {
  return {
    x: getRandom(2, 90),
    y: getRandom(8, 80),
  };
}

/**
 * Número de "partículas" de fundo. Mantido baixo de propósito: cada uma
 * roda uma animação infinita para sempre enquanto a Home estiver aberta —
 * poucas partículas custam pouco, muitas travam computadores mais fracos
 * (como os de laboratório de informática) sem ganho visual proporcional.
 */
const PARTICLE_COUNT = 14;

export function HeroCanvas() {
  const [positions, setPositions] = React.useState<{ x: number; y: number }[]>(
    []
  );
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    setPositions(ITEMS.map((_, i) => randPos(i)));
  }, []);

  if (positions.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {ITEMS.map((item, i) => {
        const pos = positions[i] ?? { x: 50, y: 50 };
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    x: [0, 18, -10, 0],
                    y: [0, -16, 12, 0],
                    rotate: [0, 6, -4, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.5, delay: item.delay },
              scale: { duration: 0.5, delay: item.delay },
              x: { repeat: Infinity, duration: item.duration, ease: "easeInOut" },
              y: {
                repeat: Infinity,
                duration: item.duration * 0.9,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Infinity,
                duration: item.duration * 1.1,
                ease: "easeInOut",
              },
            }}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            className={`grid place-items-center rounded-2xl p-2 ${item.className}`}
          >
            <item.Icon className="h-5 w-5" />
          </motion.div>
        );
      })}

      {/* Grid lines decoration */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="heroGrid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* Constelação de partículas — só anima quando o usuário não pediu movimento reduzido. */}
      {!prefersReducedMotion &&
        Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const x = getRandom(0, 100);
          const y = getRandom(0, 100);
          const size = getRandom(2, 5);
          const dur = getRandom(6, 12);
          return (
            <motion.span
              key={`p-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: dur,
                repeat: Infinity,
                delay: getRandom(0, 5),
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: 9999,
                background:
                  i % 3 === 0 ? "#2563eb" : i % 3 === 1 ? "#16a34a" : "#ea580c",
              }}
            />
          );
        })}
    </div>
  );
}
