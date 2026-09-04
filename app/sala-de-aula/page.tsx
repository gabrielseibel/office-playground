import type { Metadata } from "next";
import { ClassroomMode } from "@/features/classroom/ClassroomMode";

export const metadata: Metadata = {
  title: "Sala de Aula",
  description:
    "Modo professor: projete perguntas grandes de Word, Excel e PowerPoint para a turma toda responder junto.",
};

export default function Page() {
  return <ClassroomMode />;
}
