"use client";

import { useState } from "react";
import { PageReader, type Page } from "@/components/app/page-reader";
import { cn } from "@/lib/utils";

export interface BookCollectionData {
  id: string;
  key: string;
  title: string;
  kind: string;
  pages: Page[];
}

export function BookLibrary({ collections }: { collections: BookCollectionData[] }) {
  const [active, setActive] = useState(collections[0]?.id ?? "");
  const current = collections.find((c) => c.id === active) ?? collections[0];

  if (!current) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum material de leitura disponível.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              c.id === current.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {c.title} ({c.pages.length})
          </button>
        ))}
      </div>
      <PageReader key={current.id} pages={current.pages} />
    </div>
  );
}
