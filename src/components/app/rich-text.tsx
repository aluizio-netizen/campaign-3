import { Fragment } from "react";

/**
 * Renderizador leve de texto: trata quebras de linha (\n) e **negrito**.
 * Suficiente para o conteúdo das aulas sem depender de lib de Markdown.
 */
export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
      {lines.map((line, i) => (
        <p key={i} className={line.trim() === "" ? "h-1" : undefined}>
          {renderBold(line)}
        </p>
      ))}
    </div>
  );
}

function renderBold(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
