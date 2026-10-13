import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 9;

function pageNumbers(page, pages) {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, i) => i + 1);
  }
  const set = new Set([1, 2, page - 1, page, page + 1, pages - 1, pages]);
  return [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
}

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  const numbers = pageNumbers(page, pages);
  const btn =
    "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition";

  const items = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n - numbers[i - 1] > 1) items.push(`gap-${n}`);
    items.push(n);
  });

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${btn} gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {items.map((n) =>
        typeof n === "string" ? (
          <span key={n} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={
              n === page
                ? `${btn} border-blue-600 bg-blue-600 text-white`
                : `${btn} border-slate-200 text-slate-700 hover:bg-slate-50`
            }
          >
            {n}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={`${btn} gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
