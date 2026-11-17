import type { Metadata } from "next";
import { OficinaDeCabos } from "@/features/curso/OficinaDeCabos";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - Redes, Aula 3: Oficina de Cabos",
  description:
    "Simulador de crimpagem de cabos de rede, leitura de testador, diagnóstico de defeitos e montagem da rede de uma clínica com roteador, switch, hub, patch panel e terminal.",
};

export default function Page() {
  return <OficinaDeCabos />;
}
