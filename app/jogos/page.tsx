import type { Metadata } from "next";
import { Suspense } from "react";
import { Arcade } from "@/features/games/Arcade";

export const metadata: Metadata = {
  title: "Arcade de Informática",
  description:
    "Escolha um minigame de Word, Excel, PowerPoint ou Geral, filtre por dificuldade e ganhe XP jogando enquanto aprende.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Arcade />
    </Suspense>
  );
}
