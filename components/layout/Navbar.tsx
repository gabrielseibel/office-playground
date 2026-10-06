"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Gamepad2,
  Lightbulb,
  Home,
  FileSpreadsheet,
  FileText,
  Presentation,
  Info,
  Trophy,
  GraduationCap,
  Crown,
  Compass,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { XPPill } from "@/components/game/XPBar";

const items: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  short?: string;
}[] = [
  { label: "Início", href: "/#inicio", icon: Home },
  { label: "Trilha", href: "/trilha", icon: Compass },
  { label: "Word", href: "/word", icon: FileText },
  { label: "Excel", href: "/excel", icon: FileSpreadsheet },
  { label: "PowerPoint", href: "/powerpoint", icon: Presentation },
  { label: "Arcade", href: "/jogos", icon: Gamepad2 },
  { label: "Conquistas", href: "/conquistas", icon: Trophy },
  { label: "Sala de Aula", href: "/sala-de-aula", icon: GraduationCap },
  { label: "Desafio Mestre", href: "/desafio-mestre", icon: Crown },
  {
    label: "Curso - Informática Essencial - Aula 4",
    // No menu do computador o nome longo vai em duas linhas para não
    // empurrar os outros itens; no menu do celular aparece por extenso.
    eyebrow: "Curso - Informática Essencial",
    short: "Aula 4",
    href: "/curso-informatica-essencial-aula-4",
    icon: Cpu,
  },
  { label: "Dicas", href: "/#dicas", icon: Lightbulb },
  { label: "Sobre", href: "/#sobre", icon: Info },
];

export function Navbar() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          aria-label="Navegação principal"
          className={cn(
            "flex items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-300",
            scrolled
              ? "glass-strong shadow-soft-lg"
              : "border-transparent bg-transparent"
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-1 focus-ring"
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-emerald-500 to-orange-500 text-white shadow-lg shadow-blue-600/30">
              <Sparkles className="h-5 w-5" />
              <span className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Office Playground</span>
              <span className="text-[10px] text-muted-foreground">
                aprenda brincando
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(item.href.split("#")[0]) &&
                  item.href !== "/#dicas" &&
                  item.href !== "/#sobre" &&
                  item.href !== "/#inicio");
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-white/40 hover:text-foreground dark:hover:bg-white/5",
                      active &&
                        "bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300"
                    )}
                  >
                    {item.eyebrow ? (
                      <span className="flex flex-col whitespace-nowrap leading-none">
                        <span className="text-[9px] font-medium opacity-70">
                          {item.eyebrow}
                        </span>
                        <span className="mt-0.5">{item.short}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <XPPill className="hidden sm:flex" />
            <button
              onClick={toggle}
              aria-label="Alternar modo escuro"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/50 text-foreground/70 transition hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Abrir menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/50 text-foreground/70 transition hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 xl:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden"
          >
            <div className="mx-auto mt-2 max-w-7xl px-4">
              <div className="glass-strong rounded-2xl border p-3 shadow-soft-lg">
                <ul className="flex flex-col gap-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-white/40 dark:hover:bg-white/5"
                        >
                          <Icon className="h-4 w-4 text-blue-600" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
