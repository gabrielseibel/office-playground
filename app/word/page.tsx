import type { Metadata } from "next";
import { WordLab } from "@/features/word/WordLab";

export const metadata: Metadata = {
  title: "Laboratório Word",
  description:
    "Brinque com negrito, itálico, sublinhado, fontes, cores e alinhamentos enquanto aprende o Microsoft Word.",
};

export default function Page() {
  return <WordLab />;
}
