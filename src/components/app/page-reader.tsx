"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";

export interface Page {
  id: string;
  order: number;
  src: string;
}

/**
 * Leitor das páginas escaneadas do material. Exibe os arquivos de imagem do
 * usuário (hospedados em /public/media). Navegação por setas e zoom simples.
 */
export function PageReader({ pages }: { pages: Page[] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, pages.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  if (pages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhuma página disponível.</p>
    );
  }

  const page = pages[index];

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-2 border-b p-2">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            Página {index + 1} / {pages.length}
          </span>
          <span className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, pages.length - 1))}
          disabled={index === pages.length - 1}
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted disabled:opacity-40"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-auto bg-muted/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(page.src)}
          alt={`Página ${index + 1}`}
          className="mx-auto rounded shadow-soft transition-transform"
          style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? "800px" : "none" }}
          loading="lazy"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex gap-1.5 overflow-x-auto border-t p-2">
        {pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className={cn(
              "h-12 w-9 shrink-0 overflow-hidden rounded border bg-card",
              i === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
            aria-label={`Ir para a página ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(p.src)} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
