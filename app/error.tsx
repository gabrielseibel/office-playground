"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/30">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Algo deu errado</h1>
      <p className="mt-3 text-muted-foreground">
        Encontramos um erro inesperado nesta página. Você pode tentar de novo ou
        voltar para o início.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => reset()}>
          Tentar de novo
        </Button>
        <Button asChild>
          <a href="/">Voltar para o início</a>
        </Button>
      </div>
    </main>
  );
}
