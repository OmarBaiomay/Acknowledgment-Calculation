import { formatEgp, toNumber } from "../utils/format";
import { newId } from "../utils/defaults";

export default function CostInputTable({ lineItems, onChange, totalEgp }) {
  const updateItem = (id, key, value) => {
    onChange(
      lineItems.map((it) =>
        it.id === id
          ? { ...it, [key]: key === "costEGP" ? toNumber(value) : value }
          : it,
      ),
    );
  };

  const addRow = () => {
    onChange([
      ...lineItems,
      { id: newId(), item: "Post Return - New", costEGP: 0 },
    ]);
  };

  const removeRow = (id) => {
    onChange(lineItems.filter((it) => it.id !== id));
  };

  return (
    <section className="card p-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Intervention Cost Items (EGP)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Enter Post Arrival and Post Return cost lines. The total is
            calculated automatically.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={addRow}>
          + Add row
        </button>
      </header>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="table-th w-12">#</th>
              <th className="table-th">Item</th>
              <th className="table-th text-right">Cost (EGP)</th>
              <th className="table-th w-20 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {lineItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="table-td text-slate-400">{idx + 1}</td>
                <td className="table-td">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      updateItem(item.id, "item", e.target.value)
                    }
                    className="input-sm w-full"
                    aria-label="Item description"
                  />
                </td>
                <td className="table-td">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.costEGP}
                    onChange={(e) =>
                      updateItem(item.id, "costEGP", e.target.value)
                    }
                    className="input-sm w-40 text-right"
                    aria-label="Cost in EGP"
                  />
                </td>
                <td className="table-td text-right">
                  <button
                    type="button"
                    className="btn-danger text-xs"
                    onClick={() => removeRow(item.id)}
                    aria-label={`Remove ${item.item}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {lineItems.length === 0 && (
              <tr>
                <td colSpan={4} className="table-td text-center text-slate-400">
                  No line items. Add a row to begin.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50/80">
              <td className="table-td" colSpan={2}>
                <span className="font-semibold text-slate-700">
                  Total
                </span>
              </td>
              <td className="table-td text-right font-semibold text-slate-900">
                {formatEgp(totalEgp)}
              </td>
              <td className="table-td"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
