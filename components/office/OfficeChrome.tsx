"use client";

/**
 * Peças de "casca" reaproveitadas pelos três laboratórios (Word/Excel/
 * PowerPoint) para que a janela simulada pareça mesmo com o programa real:
 * barra de título colorida, abas do menu (faixa de opções) e grupos de
 * botões com legenda embaixo, como no Office de verdade.
 *
 * De propósito, tudo aqui é opaco (sem backdrop-blur) e sem animação em
 * loop — uma janela de aplicativo de verdade não é "vidro fosco" flutuando
 * sobre bolhas coloridas, e isso também tira peso da tela.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export function OfficeTitleBar({
  color,
  icon,
  fileName,
}: {
  color: string;
  icon: React.ReactNode;
  fileName: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-t-xl px-3 py-2 text-white"
      style={{ background: color }}
    >
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[3px] bg-white/25 text-[11px] font-bold">
          {icon}
        </span>
        <span className="truncate">{fileName}</span>
      </div>
      <div className="flex items-center gap-2 opacity-70" aria-hidden>
        <span className="block h-2.5 w-2.5 rounded-[2px] border border-white/70" />
        <span className="block h-2.5 w-2.5 border border-white/70" />
        <span className="block h-2.5 w-2.5 rounded-full border border-white/70" />
      </div>
    </div>
  );
}

export function RibbonTabs({
  color,
  tabs,
  active,
}: {
  color: string;
  tabs: string[];
  active: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5 overflow-x-auto bg-[#f3f2f1] px-2 pt-2 dark:bg-white/[0.04]"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={!isActive}
            title={isActive ? undefined : "Só a aba Página Inicial funciona neste laboratório"}
            className={cn(
              "shrink-0 rounded-t-md px-3 py-1.5 text-[12.5px] font-medium transition disabled:cursor-default",
              isActive
                ? "bg-white text-foreground shadow-[inset_0_2px_0_var(--ribbon-accent)] dark:bg-white/10"
                : "text-foreground/35"
            )}
            style={isActive ? ({ "--ribbon-accent": color } as React.CSSProperties) : undefined}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export function RibbonGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-between gap-1.5 border-r border-black/[0.06] px-2 pb-1 last:border-r-0 dark:border-white/10",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-1">{children}</div>
      <span className="text-[10px] leading-none text-foreground/45">{label}</span>
    </div>
  );
}

export function RibbonIconButton({
  active,
  onClick,
  label,
  children,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={!!active}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded text-foreground/75 transition disabled:cursor-not-allowed disabled:opacity-30",
        active
          ? "bg-black/10 text-foreground shadow-inner dark:bg-white/15"
          : "hover:bg-black/[0.06] dark:hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

export function RibbonDivider() {
  return null;
}
