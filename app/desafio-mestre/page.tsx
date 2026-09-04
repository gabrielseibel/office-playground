import type { Metadata } from "next";
import { MasterChallenge } from "@/features/master/MasterChallenge";

export const metadata: Metadata = {
  title: "Desafio Mestre",
  description:
    "O grande desafio final: uma missão só misturando Word, Excel e PowerPoint, com avaliação completa ao final.",
};

export default function Page() {
  return <MasterChallenge />;
}
