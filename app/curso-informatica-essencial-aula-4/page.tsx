import type { Metadata } from "next";
import { InfoEssencialAula4 } from "@/features/curso/InfoEssencialAula4";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - Aula 4",
  description:
    "Dinâmicas da Aula 4 do curso Informática Essencial: quem precisa de driver, corrida do Gerenciador de Dispositivos, conexão certa e verdade ou mito dos drivers.",
};

export default function Page() {
  return <InfoEssencialAula4 />;
}
