"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Type as TypeIcon,
  Palette,
  Layout as LayoutIcon,
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  Image as ImageIcon,
  Play,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniChallenge } from "@/components/common/MiniChallenge";

type ThemeKey = "sunset" | "ocean" | "forest" | "lavender";
type LayoutKey = "title" | "two" | "image" | "blank";
type ShapeKey = "rect" | "circle" | "tri" | "star" | "hex";

interface Theme {
  bg: string;
  accent: string;
  text: string;
  label: string;
}

const THEMES: Record<ThemeKey, Theme> = {
  sunset: { bg: "from-orange-300 via-rose-400 to-pink-500", accent: "#fff", text: "#1f2937", label: "Pôr do sol" },
  ocean: { bg: "from-cyan-300 via-sky-500 to-indigo-600", accent: "#fff", text: "#fff", label: "Oceano" },
  forest: { bg: "from-emerald-300 via-teal-500 to-cyan-700", accent: "#fff", text: "#fff", label: "Floresta" },
  lavender: { bg: "from-purple-300 via-violet-500 to-fuchsia-600", accent: "#fff", text: "#fff", label: "Lavanda" },
};

const FONTS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier", value: "'Courier New', monospace" },
  { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
];

const TRANSITIONS = [
  { key: "fade", label: "Fade", from: { opacity: 0 }, enter: { opacity: 1 } },
  { key: "slide", label: "Slide", from: { x: 100, opacity: 0 }, enter: { x: 0, opacity: 1 } },
  { key: "zoom", label: "Zoom", from: { scale: 0.5, opacity: 0 }, enter: { scale: 1, opacity: 1 } },
  { key: "flip", label: "Flip", from: { rotateY: 90, opacity: 0 }, enter: { rotateY: 0, opacity: 1 } },
  { key: "bounce", label: "Bounce", from: { y: -50, opacity: 0 }, enter: { y: 0, opacity: 1 } },
];

const COLORS = [
  "#ffffff",
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#0f172a",
];

interface Slide {
  id: number;
  title: string;
  text: string;
  layout: LayoutKey;
  imageEmoji?: string;
  shapes: { id: string; type: ShapeKey; x: number; y: number; size: number; color: string }[];
}

const INITIAL_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Bem-vindo ao PowerPoint",
    text: "Apresentações memoráveis começam com um bom slide.",
    layout: "title",
    shapes: [],
  },
  {
    id: 2,
    title: "O que é o PowerPoint?",
    text: "Um programa para criar slides que se transformam em histórias, treinamentos e vendas.",
    layout: "two",
    shapes: [],
  },
  {
    id: 3,
    title: "Imagem em destaque",
    text: "Use imagens marcantes para ilustrar ideias complexas.",
    layout: "image",
    imageEmoji: "🎨",
    shapes: [],
  },
];

export function PowerPointLab() {
  const [slides, setSlides] = React.useState<Slide[]>(INITIAL_SLIDES);
  const [current, setCurrent] = React.useState(0);
  const [theme, setTheme] = React.useState<ThemeKey>("sunset");
  const [font, setFont] = React.useState(FONTS[0].value);
  const [titleColor, setTitleColor] = React.useState("#ffffff");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [transition, setTransition] = React.useState(TRANSITIONS[0]);
  const [shapeCounter, setShapeCounter] = React.useState(1);
  const [tipIndex, setTipIndex] = React.useState(0);

  const TIPS = [
    "Use a paleta ao lado para mudar as cores do título e do texto.",
    "Adicione formas com os botões de forma — elas podem ser arrastadas pelo slide!",
    "Cada layout muda a estrutura do conteúdo.",
    "Experimente a transição 'Flip' para um toque cinematográfico.",
  ];

  React.useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];
  const t = THEMES[theme];

  function updateSlide(patch: Partial<Slide>) {
    setSlides((prev) => prev.map((s, i) => (i === current ? { ...s, ...patch } : s)));
  }

  function addShape(type: ShapeKey) {
    const id = `s-${shapeCounter}`;
    setShapeCounter((c) => c + 1);
    updateSlide({
      shapes: [
        ...slide.shapes,
        { id, type, x: 50, y: 60, size: 32, color: "#ffffff" },
      ],
    });
  }

  function updateShape(id: string, patch: Partial<Slide["shapes"][0]>) {
    updateSlide({
      shapes: slide.shapes.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function removeShape(id: string) {
    updateSlide({ shapes: slide.shapes.filter((s) => s.id !== id) });
  }

  function addSlide() {
    const id = slides.length + 1;
    setSlides((prev) => [
      ...prev,
      { id, title: `Slide ${id}`, text: "Edite este novo slide.", layout: "title", shapes: [] },
    ]);
    setCurrent(slides.length);
  }

  function reset() {
    setSlides(INITIAL_SLIDES);
    setCurrent(0);
    setTheme("sunset");
    setFont(FONTS[0].value);
    setTitleColor("#ffffff");
    setTextColor("#ffffff");
    setTransition(TRANSITIONS[0]);
  }

  const DragShape = ({ shape }: { shape: Slide["shapes"][0] }) => {
    return (
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{ left: -300, right: 300, top: -150, bottom: 150 }}
        onDragEnd={(_, info) => {
          updateShape(shape.id, {
            x: Math.max(0, Math.min(95, ((info.point.x + 400) / 800) * 100)),
            y: Math.max(0, Math.min(95, ((info.point.y + 200) / 400) * 100)),
          });
        }}
        whileDrag={{ scale: 1.1, zIndex: 50 }}
        onDoubleClick={() => removeShape(shape.id)}
        title="Arraste para mover · duplo-clique para remover"
        style={{
          background: shape.color,
          opacity: 0.95,
        }}
        className={cn(
          "absolute grid h-12 w-12 cursor-grab place-items-center text-xs shadow-xl active:cursor-grabbing",
          shape.type === "rect" && "rounded-md",
          shape.type === "circle" && "rounded-full",
          shape.type === "tri" && "rounded-md",
          shape.type === "star" && "rounded-md",
          shape.type === "hex" && "rounded-md"
        )}
      >
        {shape.type === "tri" && (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
        )}
        {shape.type === "star" && (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" />
          </svg>
        )}
        {shape.type === "hex" && (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
          </svg>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-50/50 via-background to-rose-50/30 dark:from-orange-950/20 dark:via-background dark:to-rose-950/20" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-orange-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            href="/#aplicativos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> voltar
          </Link>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-600/10 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-400/15 dark:text-orange-300">
            <Sparkles className="h-3 w-3" />
            Laboratório PowerPoint
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Crie slides incríveis no{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              PowerPoint
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Monte, customize e anime apresentações em tempo real.
            Arraste formas, mude o tema, escolha transições.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-orange-200/30 bg-white/70 p-3 shadow-soft-lg backdrop-blur-md dark:border-orange-400/15 dark:bg-white/5"
          >
            {/* Ribbon */}
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500/10 to-rose-500/10 p-2 text-xs">
              <div className="flex items-center gap-1">
                <LayoutIcon className="h-3.5 w-3.5 text-orange-700 dark:text-orange-300" />
                <select
                  value={slide.layout}
                  onChange={(e) =>
                    updateSlide({ layout: e.target.value as LayoutKey })
                  }
                  className="rounded-md bg-transparent px-2 py-1 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                >
                  <option value="title">Título</option>
                  <option value="two">Duas colunas</option>
                  <option value="image">Imagem em destaque</option>
                  <option value="blank">Em branco</option>
                </select>
              </div>

              <Divider />

              <div className="flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-orange-700 dark:text-orange-300" />
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeKey)}
                  className="rounded-md bg-transparent px-2 py-1 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                >
                  {Object.entries(THEMES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <TypeIcon className="h-3.5 w-3.5 text-orange-700 dark:text-orange-300" />
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="rounded-md bg-transparent px-2 py-1 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                >
                  {FONTS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <Divider />

              <input
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                title="Cor do título"
                className="h-6 w-6 cursor-pointer rounded-md border-none bg-transparent"
              />
              <span className="text-[10px] text-muted-foreground">título</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                title="Cor do texto"
                className="h-6 w-6 cursor-pointer rounded-md border-none bg-transparent"
              />
              <span className="text-[10px] text-muted-foreground">texto</span>

              <Divider />

              <div className="flex items-center gap-1">
                <button
                  onClick={() => addShape("rect")}
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                  title="Quadrado"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => addShape("circle")}
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                  title="Círculo"
                >
                  <Circle className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => addShape("tri")}
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                  title="Triângulo"
                >
                  <Triangle className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => addShape("star")}
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                  title="Estrela"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => addShape("hex")}
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                  title="Hexágono"
                >
                  <Hexagon className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className="ml-auto">
                <select
                  value={transition.key}
                  onChange={(e) =>
                    setTransition(
                      TRANSITIONS.find((t) => t.key === e.target.value) ??
                        TRANSITIONS[0]
                    )
                  }
                  className="rounded-md bg-transparent px-2 py-1 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:hover:bg-white/5"
                >
                  {TRANSITIONS.map((tt) => (
                    <option key={tt.key} value={tt.key}>
                      ▶ {tt.label}
                    </option>
                  ))}
                </select>
              </span>
            </div>

            {/* Slide */}
            <div className="overflow-hidden rounded-2xl shadow-soft-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`slide-${current}-${theme}`}
                  initial={transition.from}
                  animate={transition.enter}
                  exit={transition.from}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br",
                    t.bg
                  )}
                  style={{ fontFamily: font }}
                >
                  {/* Decorative shapes */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

                  {slide.layout === "title" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                      <h2
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateSlide({ title: e.currentTarget.textContent ?? "" })
                        }
                        className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl"
                        style={{ color: titleColor, fontFamily: font }}
                      >
                        {slide.title}
                      </h2>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateSlide({ text: e.currentTarget.textContent ?? "" })
                        }
                        className="max-w-xl text-base md:text-lg"
                        style={{ color: textColor, fontFamily: font }}
                      >
                        {slide.text}
                      </p>
                    </div>
                  )}

                  {slide.layout === "two" && (
                    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col justify-center gap-3 p-8 md:p-12">
                        <h2
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateSlide({ title: e.currentTarget.textContent ?? "" })
                          }
                          className="text-2xl font-bold md:text-4xl"
                          style={{ color: titleColor, fontFamily: font }}
                        >
                          {slide.title}
                        </h2>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateSlide({ text: e.currentTarget.textContent ?? "" })
                          }
                          className="text-sm md:text-base"
                          style={{ color: textColor, fontFamily: font }}
                        >
                          {slide.text}
                        </p>
                      </div>
                      <div className="flex items-center justify-center bg-white/10 p-8 backdrop-blur-sm">
                        <ImageIcon className="h-24 w-24 text-white/60" />
                      </div>
                    </div>
                  )}

                  {slide.layout === "image" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                      <div className="text-7xl drop-shadow-lg md:text-8xl">
                        {slide.imageEmoji ?? "🖼️"}
                      </div>
                      <h2
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateSlide({ title: e.currentTarget.textContent ?? "" })
                        }
                        className="text-2xl font-bold md:text-4xl"
                        style={{ color: titleColor, fontFamily: font }}
                      >
                        {slide.title}
                      </h2>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateSlide({ text: e.currentTarget.textContent ?? "" })
                        }
                        className="max-w-md text-sm md:text-base"
                        style={{ color: textColor, fontFamily: font }}
                      >
                        {slide.text}
                      </p>
                    </div>
                  )}

                  {slide.layout === "blank" && (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <p
                        className="text-sm italic opacity-80"
                        style={{ color: textColor }}
                      >
                        Slide em branco — adicione formas para começar.
                      </p>
                    </div>
                  )}

                  {slide.shapes.map((shape) => (
                    <div
                      key={shape.id}
                      style={{
                        left: `${shape.x}%`,
                        top: `${shape.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="absolute"
                    >
                      <DragShape shape={shape} />
                    </div>
                  ))}

                  <div className="absolute bottom-3 right-4 rounded-full bg-black/30 px-2.5 py-1 text-[10px] text-white">
                    {current + 1} / {slides.length}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/40 px-3 py-2 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  aria-label="Slide anterior"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  aria-label="Próximo slide"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={addSlide}
                  className="ml-2 inline-flex items-center gap-1 rounded-xl border border-orange-300/40 bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-500/20 dark:border-orange-400/20 dark:text-orange-300"
                >
                  <Plus className="h-3.5 w-3.5" /> slide
                </button>
              </div>

              <div className="flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir para slide ${i + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition",
                      i === current
                        ? "w-8 bg-orange-500"
                        : "w-2.5 bg-orange-300/50 hover:bg-orange-300"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={reset}
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/60 text-foreground/70 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                aria-label="Reiniciar"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Dica do momento
              </h3>
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {TIPS[tipIndex]}
              </motion.p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-semibold">Transições</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {TRANSITIONS.map((tr) => (
                  <button
                    key={tr.key}
                    onClick={() => setTransition(tr)}
                    className={cn(
                      "rounded-xl border px-2 py-1.5 text-xs font-medium transition",
                      transition.key === tr.key
                        ? "border-orange-300 bg-orange-500/15 text-orange-700 dark:border-orange-400/40 dark:bg-orange-400/15 dark:text-orange-200"
                        : "border-white/20 bg-white/40 text-foreground/70 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    )}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-5 backdrop-blur-md">
              <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Apresentar (modo ideia)
              </h3>
              <p className="mt-2 text-xs text-foreground/70">
                Pressione{" "}
                <kbd className="rounded border border-orange-300/40 bg-white/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  F5
                </kbd>{" "}
                na vida real para iniciar do primeiro slide.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-orange-200/50 dark:bg-orange-500/20" />
                <Play className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs">preparado</span>
              </div>
            </div>

            <MiniChallenge
              question="Qual ferramenta do PowerPoint sugere layouts automáticos?"
              options={["Animações", "Designer", "Transições", "Estrutura de tópicos"]}
              correctIndex={1}
              explanation="O painel Designer (Design) sugere layouts com base no conteúdo do slide."
              app="ppt"
            />
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-foreground/10" />;
}
