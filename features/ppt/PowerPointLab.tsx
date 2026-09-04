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
import {
  OfficeTitleBar,
  RibbonTabs,
  RibbonGroup,
  RibbonIconButton,
} from "@/components/office/OfficeChrome";

const PPT_COLOR = "#D24726";
const RIBBON_TABS = [
  "Arquivo",
  "Página Inicial",
  "Inserir",
  "Design",
  "Transições",
  "Animações",
  "Apresentação de Slides",
  "Revisão",
  "Exibir",
];

type ThemeKey = "sunset" | "ocean" | "forest" | "lavender";
type LayoutKey = "title" | "two" | "image" | "blank";
type ShapeKey = "rect" | "circle" | "tri" | "star" | "hex";

interface Theme {
  bg: string;
  text: string;
  label: string;
}

const THEMES: Record<ThemeKey, Theme> = {
  sunset: { bg: "from-orange-300 via-rose-400 to-pink-500", text: "#1f2937", label: "Pôr do sol" },
  ocean: { bg: "from-cyan-300 via-sky-500 to-indigo-600", text: "#fff", label: "Oceano" },
  forest: { bg: "from-emerald-300 via-teal-500 to-cyan-700", text: "#fff", label: "Floresta" },
  lavender: { bg: "from-purple-300 via-violet-500 to-fuchsia-600", text: "#fff", label: "Lavanda" },
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

const TIPS = [
  "Use a paleta ao lado para mudar as cores do título e do texto.",
  "Adicione formas com os botões de Desenho — elas podem ser arrastadas pelo slide!",
  "Cada layout muda a estrutura do conteúdo.",
  "Experimente a transição 'Flip' para um toque cinematográfico.",
];

/** Isolado para que a troca de dica a cada 5s não re-renderize o slide inteiro. */
function TipRotator() {
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        Dica do momento
      </h3>
      <motion.p
        key={tipIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-sm leading-relaxed text-muted-foreground"
      >
        {TIPS[tipIndex]}
      </motion.p>
    </div>
  );
}

/**
 * Definido FORA do PowerPointLab de propósito: um componente criado dentro
 * do corpo de outro componente vira um "tipo novo" a cada render, então o
 * React desmontava e remontava TODAS as formas do slide a cada 5s (quando a
 * dica trocava) ou a qualquer clique no ribbon — a causa principal da tela
 * do PowerPoint travando. Como componente fixo aqui fora, ele só re-renderiza
 * de verdade, sem remontar.
 */
function DragShape({
  shape,
  onDragEnd,
  onRemove,
}: {
  shape: Slide["shapes"][0];
  onDragEnd: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -300, right: 300, top: -150, bottom: 150 }}
      onDragEnd={(_, info) => {
        onDragEnd(
          shape.id,
          Math.max(0, Math.min(95, ((info.point.x + 400) / 800) * 100)),
          Math.max(0, Math.min(95, ((info.point.y + 200) / 400) * 100))
        );
      }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      onDoubleClick={() => onRemove(shape.id)}
      title="Arraste para mover · duplo-clique para remover"
      style={{ background: shape.color, opacity: 0.95 }}
      className={cn(
        "absolute grid h-12 w-12 cursor-grab place-items-center text-xs shadow-xl active:cursor-grabbing",
        shape.type === "circle" ? "rounded-full" : "rounded-md"
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
}

export function PowerPointLab() {
  const [slides, setSlides] = React.useState<Slide[]>(INITIAL_SLIDES);
  const [current, setCurrent] = React.useState(0);
  const [theme, setTheme] = React.useState<ThemeKey>("sunset");
  const [font, setFont] = React.useState(FONTS[0].value);
  const [titleColor, setTitleColor] = React.useState("#ffffff");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [transition, setTransition] = React.useState(TRANSITIONS[0]);
  const [shapeCounter, setShapeCounter] = React.useState(1);

  const slide = slides[current];
  const t = THEMES[theme];

  function updateSlide(patch: Partial<Slide>) {
    setSlides((prev) => prev.map((s, i) => (i === current ? { ...s, ...patch } : s)));
  }

  function addShape(type: ShapeKey) {
    const id = `s-${shapeCounter}`;
    setShapeCounter((c) => c + 1);
    updateSlide({
      shapes: [...slide.shapes, { id, type, x: 50, y: 60, size: 32, color: "#ffffff" }],
    });
  }

  const handleShapeDragEnd = React.useCallback((id: string, x: number, y: number) => {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === current
          ? { ...s, shapes: s.shapes.map((sh) => (sh.id === id ? { ...sh, x, y } : sh)) }
          : s
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleShapeRemove = React.useCallback((id: string) => {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === current ? { ...s, shapes: s.shapes.filter((sh) => sh.id !== id) } : s
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

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

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-orange-50/40 via-background to-background pt-24 dark:from-orange-950/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-soft-lg dark:border-white/10 dark:bg-[#1c1c22]"
          >
            <OfficeTitleBar color={PPT_COLOR} icon="P" fileName="Apresentação1 - PowerPoint" />
            <RibbonTabs color={PPT_COLOR} tabs={RIBBON_TABS} active="Página Inicial" />

            {/* Faixa de opções */}
            <div className="flex items-stretch gap-1 overflow-x-auto border-b border-black/10 bg-white px-2 py-2 dark:border-white/10 dark:bg-white/5">
              <RibbonGroup label="Slides">
                <div className="flex items-center gap-1">
                  <LayoutIcon className="h-3.5 w-3.5 text-orange-700 dark:text-orange-300" />
                  <select
                    value={slide.layout}
                    onChange={(e) => updateSlide({ layout: e.target.value as LayoutKey })}
                    className="h-7 rounded border border-black/10 bg-white px-1.5 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/10"
                  >
                    <option value="title">Título</option>
                    <option value="two">Duas colunas</option>
                    <option value="image">Imagem em destaque</option>
                    <option value="blank">Em branco</option>
                  </select>
                </div>
                <RibbonIconButton onClick={addSlide} label="Novo slide">
                  <Plus className="h-3.5 w-3.5" />
                </RibbonIconButton>
              </RibbonGroup>

              <RibbonGroup label="Design" className="min-w-[10rem]">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5 shrink-0 text-orange-700 dark:text-orange-300" />
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as ThemeKey)}
                      className="h-6 flex-1 rounded border border-black/10 bg-white px-1 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/10"
                    >
                      {Object.entries(THEMES).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <TypeIcon className="h-3.5 w-3.5 shrink-0 text-orange-700 dark:text-orange-300" />
                    <select
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="h-6 flex-1 rounded border border-black/10 bg-white px-1 text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/10"
                    >
                      {FONTS.map((f) => (
                        <option key={f.label} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </RibbonGroup>

              <RibbonGroup label="Desenho">
                <RibbonIconButton onClick={() => addShape("rect")} label="Quadrado">
                  <Square className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton onClick={() => addShape("circle")} label="Círculo">
                  <Circle className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton onClick={() => addShape("tri")} label="Triângulo">
                  <Triangle className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton onClick={() => addShape("star")} label="Estrela">
                  <Star className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <RibbonIconButton onClick={() => addShape("hex")} label="Hexágono">
                  <Hexagon className="h-3.5 w-3.5" />
                </RibbonIconButton>
                <span className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" />
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  title="Cor do título"
                  className="h-6 w-6 cursor-pointer rounded border-none bg-transparent"
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  title="Cor do texto"
                  className="h-6 w-6 cursor-pointer rounded border-none bg-transparent"
                />
              </RibbonGroup>
            </div>

            {/* Slide */}
            <div className="bg-[#e9e9ec] p-4 dark:bg-black/30 sm:p-8">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-sm shadow-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`slide-${current}-${theme}`}
                    initial={transition.from}
                    animate={transition.enter}
                    exit={transition.from}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br",
                      t.bg
                    )}
                    style={{ fontFamily: font }}
                  >
                    {slide.layout === "title" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                        <h2
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSlide({ title: e.currentTarget.textContent ?? "" })}
                          className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl"
                          style={{ color: titleColor, fontFamily: font }}
                        >
                          {slide.title}
                        </h2>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSlide({ text: e.currentTarget.textContent ?? "" })}
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
                            onBlur={(e) => updateSlide({ title: e.currentTarget.textContent ?? "" })}
                            className="text-2xl font-bold md:text-4xl"
                            style={{ color: titleColor, fontFamily: font }}
                          >
                            {slide.title}
                          </h2>
                          <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateSlide({ text: e.currentTarget.textContent ?? "" })}
                            className="text-sm md:text-base"
                            style={{ color: textColor, fontFamily: font }}
                          >
                            {slide.text}
                          </p>
                        </div>
                        <div className="flex items-center justify-center bg-white/10 p-8">
                          <ImageIcon className="h-24 w-24 text-white/60" />
                        </div>
                      </div>
                    )}

                    {slide.layout === "image" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                        <div className="text-7xl drop-shadow-lg md:text-8xl">{slide.imageEmoji ?? "🖼️"}</div>
                        <h2
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSlide({ title: e.currentTarget.textContent ?? "" })}
                          className="text-2xl font-bold md:text-4xl"
                          style={{ color: titleColor, fontFamily: font }}
                        >
                          {slide.title}
                        </h2>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSlide({ text: e.currentTarget.textContent ?? "" })}
                          className="max-w-md text-sm md:text-base"
                          style={{ color: textColor, fontFamily: font }}
                        >
                          {slide.text}
                        </p>
                      </div>
                    )}

                    {slide.layout === "blank" && (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <p className="text-sm italic opacity-80" style={{ color: textColor }}>
                          Slide em branco — adicione formas para começar.
                        </p>
                      </div>
                    )}

                    {slide.shapes.map((shape) => (
                      <div
                        key={shape.id}
                        style={{ left: `${shape.x}%`, top: `${shape.y}%`, transform: "translate(-50%, -50%)" }}
                        className="absolute"
                      >
                        <DragShape shape={shape} onDragEnd={handleShapeDragEnd} onRemove={handleShapeRemove} />
                      </div>
                    ))}

                    <div className="absolute bottom-3 right-4 rounded-full bg-black/30 px-2.5 py-1 text-[10px] text-white">
                      {current + 1} / {slides.length}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Miniaturas + navegação */}
            <div className="flex items-center justify-between border-t border-black/10 bg-[#f3f2f1] px-4 py-2 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  className="grid h-8 w-8 place-items-center rounded border border-black/10 bg-white text-foreground/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/10"
                  aria-label="Slide anterior"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
                  className="grid h-8 w-8 place-items-center rounded border border-black/10 bg-white text-foreground/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/10"
                  aria-label="Próximo slide"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
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
                      i === current ? "w-8 bg-orange-500" : "w-2.5 bg-orange-300/50 hover:bg-orange-300"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={reset}
                className="grid h-8 w-8 place-items-center rounded border border-black/10 bg-white text-foreground/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/10"
                aria-label="Reiniciar"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4"
          >
            <TipRotator />

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
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
                        : "border-black/10 bg-white text-foreground/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    )}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200/60 bg-orange-50/60 p-5 dark:border-orange-400/15 dark:bg-orange-400/5">
              <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Apresentar (modo ideia)
              </h3>
              <p className="mt-2 text-xs text-foreground/70">
                Pressione{" "}
                <kbd className="rounded border border-orange-300/40 bg-white px-1.5 py-0.5 font-mono text-[10px] text-foreground dark:bg-white/10">
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
