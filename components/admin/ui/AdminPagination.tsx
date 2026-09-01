"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT_OPTIONS = [10, 25, 50, 100];

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
  onLimit: (limit: number) => void;
  itemLabel?: string;
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  onPage,
  onLimit,
  itemLabel = "items",
}: AdminPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btn =
    "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all select-none";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 mt-3 border-t border-[hsl(var(--adm-border)/0.4)]">
      {/* Left — rows per page + count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(var(--adm-muted-foreground))] whitespace-nowrap">Rows per page</span>
          <select
            value={limit}
            onChange={(e) => { onLimit(Number(e.target.value)); onPage(1); }}
            className="h-8 rounded-lg border border-[hsl(var(--adm-border))] bg-[hsl(var(--adm-background))] px-2 text-xs font-semibold text-[hsl(var(--adm-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] cursor-pointer"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-[hsl(var(--adm-muted-foreground))]">
          {total === 0 ? "No results" : `${from}–${to} of ${total} ${itemLabel}`}
        </span>
      </div>

      {/* Right — page buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            className={`${btn} border border-[hsl(var(--adm-border))] bg-[hsl(var(--adm-card))] text-[hsl(var(--adm-foreground))] hover:bg-[hsl(var(--adm-accent))] disabled:opacity-35 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {pages.map((p, i) =>
            p === "…" ? (
              <span
                key={`el-${i}`}
                className="flex h-8 w-6 items-end justify-center pb-1 text-[hsl(var(--adm-muted-foreground))] text-xs"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p as number)}
                className={`${btn} ${
                  p === page
                    ? "bg-[hsl(var(--adm-primary))] text-white shadow-sm"
                    : "border border-[hsl(var(--adm-border))] bg-[hsl(var(--adm-card))] text-[hsl(var(--adm-foreground))] hover:bg-[hsl(var(--adm-accent))] hover:border-[hsl(var(--adm-primary)/0.3)]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPage(page + 1)}
            disabled={page === totalPages}
            className={`${btn} border border-[hsl(var(--adm-border))] bg-[hsl(var(--adm-card))] text-[hsl(var(--adm-foreground))] hover:bg-[hsl(var(--adm-accent))] disabled:opacity-35 disabled:cursor-not-allowed`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
