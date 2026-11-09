import type { Metadata } from "next";
import { InfoEssencialRedesAula2 } from "@/features/curso/InfoEssencialRedesAula2";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - Redes, Aula 2",
  description:
    "Animações e atividades da Aula 2 de Redes do curso Informática Essencial: segurança de redes, malwares, phishing, firewall e DMZ, senhas, criptografia, VPN e logs.",
};

export default function Page() {
  return <InfoEssencialRedesAula2 />;
}
