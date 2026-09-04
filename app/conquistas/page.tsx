import type { Metadata } from "next";
import { AchievementsPage } from "@/features/achievements/AchievementsPage";

export const metadata: Metadata = {
  title: "Conquistas",
  description: "Acompanhe seu XP, nível, jornada por programa e o mural de badges desbloqueados.",
};

export default function Page() {
  return <AchievementsPage />;
}
