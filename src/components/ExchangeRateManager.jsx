import { useState } from "react";
import { formatRate, toNumber } from "../utils/format";

export default function ExchangeRateManager({ rates, onChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const updateRate = (month, value) => {
    const next = rates.map((r) =>
      r.month === month ? { ...r, rate: toNumber(value) } : r,
    );
    onChange(next);
  };

  return (
    <aside className="card p-5 lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Monthly Euro Rates
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            EUR &rarr; EGP conversion rates. Edit any value to update all
            calculations instantly.
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th">Month</th>
                <th className="table-th text-right">Euro Rate (EGP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rates.map((r) => (
                <tr key={r.month} className="hover:bg-slate-50">
                  <td className="table-td font-medium text-slate-800">
                    {r.month}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        step="0.00001"
                        value={r.rate}
                        onChange={(e) => updateRate(r.month, e.target.value)}
                        className="input-sm w-32 text-right"
                        aria-label={`Euro rate for ${r.month}`}
                      />
                      <span className="text-xs text-slate-400">
                        ({formatRate(r.rate)})
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </aside>
  );
}
