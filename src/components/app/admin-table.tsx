import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AdminTableColumn {
  key: string;
  label: string;
  className?: string;
}

/**
 * Tabela genérica reutilizável para as listagens do painel admin.
 * `rows` é uma matriz de células (ReactNode) na mesma ordem das `columns`.
 */
export function AdminTable({
  columns,
  rows,
}: {
  columns: AdminTableColumn[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors hover:bg-muted/40">
              {row.map((cell, j) => (
                <td
                  key={columns[j]?.key ?? j}
                  className={cn("px-4 py-3 align-middle", columns[j]?.className)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
