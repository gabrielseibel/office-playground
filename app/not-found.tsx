import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="mt-3 text-muted-foreground">
        Esse caminho não existe no Office Playground. Talvez você tenha digitado o
        endereço errado ou o link esteja desatualizado.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </main>
  );
}
