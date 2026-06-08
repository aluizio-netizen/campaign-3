"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";

export interface Page {
  id: string;
  order: number;
  src: string;
  text?: string;
}

type ViewMode = "text" | "scan";

/**
 * Leitor das páginas do material. Mostra o texto (OCR) por padrão — limpo e
 * selecionável — com um botão para ver a imagem escaneada original. Quando a
 * página não tem texto, cai automaticamente para o scan. Navegação por setas;
 * zoom controla a imagem (scan) ou o tamanho da fonte (texto).
 */
export function PageReader({ pages }: { pages: Page[] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<ViewMode>("text");

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
  const hasText = Boolean(page.text && page.text.trim().length > 0);
  const showText = mode === "text" && hasText;

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">
            Página {index + 1} / {pages.length}
          </span>

          {/* Alternância texto / scan */}
          <span className="mx-1 h-4 w-px bg-border" />
          <div className="inline-flex overflow-hidden rounded-md border">
            <button
              onClick={() => setMode("text")}
              disabled={!hasText}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs transition-colors disabled:opacity-40",
                showText ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              aria-label="Ver texto"
              title={hasText ? "Ver texto" : "Sem texto para esta página"}
            >
              <FileText className="h-3.5 w-3.5" /> Texto
            </button>
            <button
              onClick={() => setMode("scan")}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs transition-colors",
                !showText ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              aria-label="Ver original escaneado"
              title="Ver original escaneado"
            >
              <ImageIcon className="h-3.5 w-3.5" /> Original
            </button>
          </div>

          {/* Zoom (imagem) ou tamanho da fonte (texto) */}
          <span className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Diminuir"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Aumentar"
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
        {showText ? (
          <div
            className="mx-auto max-w-[800px] whitespace-pre-wrap rounded bg-card p-6 font-sans leading-relaxed text-foreground shadow-soft"
            style={{ fontSize: `${zoom}rem` }}
          >
            {page.text}
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(page.src)}
              alt={`Página ${index + 1}`}
              className="mx-auto rounded shadow-soft transition-transform"
              style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? "800px" : "none" }}
              loading="lazy"
            />
            {mode === "scan" && !hasText && (
              <p className="mx-auto mt-2 max-w-[800px] text-center text-xs text-muted-foreground">
                Esta página não tem texto extraído — exibindo o original escaneado.
              </p>
            )}
          </>
        )}
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
