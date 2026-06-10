import type { ReactNode } from 'react';
import { Spinner, EmptyState } from './Spinner';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({ columns, rows, loading, emptyLabel, keyField }: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyLabel?: string;
  keyField: (row: T, i: number) => string | number;
}) {
  if (loading) return <Spinner />;
  if (!rows.length) return <EmptyState label={emptyLabel} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-start">
            {columns.map((c, i) => (
              <th key={i} className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="stagger">
          {rows.map((row, i) => (
            <tr key={keyField(row, i)} className="border-b border-white/5 transition hover:bg-white/[0.03]">
              {columns.map((c, j) => (
                <td key={j} className={`px-3 py-3.5 text-slate-200 ${c.className || ''}`}>{c.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
