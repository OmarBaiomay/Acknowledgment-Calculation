import { useEffect } from "react";
import { formatEgp, formatEur, formatRate, toNumber } from "../utils/format";

function MonthSelect({ rates, value, onChange, id }) {
  return (
    <select
      id={id}
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select month…</option>
      {rates.map((r) => (
        <option key={r.month} value={r.month}>
          {r.month}
        </option>
      ))}
    </select>
  );
}

function RateBadge({ rate }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-xs font-medium text-slate-500">
        Auto-fetched Euro rate
      </span>
      <span className="text-sm font-semibold text-brand-700">
        {rate > 0 ? formatRate(rate) : "—"}
      </span>
    </div>
  );
}

function CardShell({ title, subtitle, children, accent = "brand" }) {
  const accents = {
    brand: "from-brand-500 to-brand-700",
    emerald: "from-emerald-500 to-emerald-700",
    amber: "from-amber-500 to-amber-700",
  };
  return (
    <div className="card overflow-hidden">
      <div
        className={`bg-gradient-to-r ${accents[accent]} px-5 py-3 text-white`}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-white/80">{subtitle}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ScenarioCalculators({
  rates,
  scenarios,
  onChange,
  postArrivalEgpFromItems,
}) {
  // Auto-sync the postArrival EGP total from the line items table.
  useEffect(() => {
    if (
      scenarios.postArrival.totalPaidByCaseWorkerEGP !== postArrivalEgpFromItems
    ) {
      onChange({
        ...scenarios,
        postArrival: {
          ...scenarios.postArrival,
          totalPaidByCaseWorkerEGP: postArrivalEgpFromItems,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postArrivalEgpFromItems]);

  // Whenever a month changes, lock in the corresponding euro rate.
  useEffect(() => {
    let next = scenarios;
    let mutated = false;
    const lookup = (month) => {
      const r = rates.find((x) => x.month === month);
      return r ? r.rate : 0;
    };

    const aRate = lookup(scenarios.postArrival.month);
    if (aRate !== scenarios.postArrival.euroRate) {
      next = {
        ...next,
        postArrival: { ...next.postArrival, euroRate: aRate },
      };
      mutated = true;
    }
    const r1 = lookup(scenarios.postReturn1Month.month);
    if (r1 !== scenarios.postReturn1Month.euroRate) {
      next = {
        ...next,
        postReturn1Month: { ...next.postReturn1Month, euroRate: r1 },
      };
      mutated = true;
    }
    const r2 = lookup(scenarios.postReturn2Months.month);
    if (r2 !== scenarios.postReturn2Months.euroRate) {
      next = {
        ...next,
        postReturn2Months: { ...next.postReturn2Months, euroRate: r2 },
      };
      mutated = true;
    }
    if (mutated) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scenarios.postArrival.month,
    scenarios.postReturn1Month.month,
    scenarios.postReturn2Months.month,
    rates,
  ]);

  const update = (key, patch) => {
    onChange({ ...scenarios, [key]: { ...scenarios[key], ...patch } });
  };

  // Derived figures
  const pa = scenarios.postArrival;
  const paEur = pa.euroRate > 0 ? pa.totalPaidByCaseWorkerEGP / pa.euroRate : 0;

  const r1 = scenarios.postReturn1Month;
  const r1Egp = toNumber(r1.grant) * toNumber(r1.euroRate);

  const r2 = scenarios.postReturn2Months;
  const r2GrantEgp = toNumber(r2.grant) * toNumber(r2.euroRate);
  const r2DeltaEgp = toNumber(r2.totalInEgp) - r2GrantEgp;

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-base font-semibold text-slate-900">
          Scenario Calculators
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Pick the execution month for each scenario — the matching Euro rate
          locks in automatically.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* 1. Post Arrival */}
        <CardShell
          title="1. Post Arrival"
          subtitle="Auto-uses the Post Arrival cost from the items table"
          accent="brand"
        >
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="pa-month">
                Execution month
              </label>
              <div className="mt-1">
                <MonthSelect
                  id="pa-month"
                  rates={rates}
                  value={pa.month}
                  onChange={(m) => update("postArrival", { month: m })}
                />
              </div>
            </div>
            <RateBadge rate={pa.euroRate} />
            <div>
              <label className="label">Total paid by case worker (EGP)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pa.totalPaidByCaseWorkerEGP}
                onChange={(e) =>
                  update("postArrival", {
                    totalPaidByCaseWorkerEGP: toNumber(e.target.value),
                  })
                }
                className="input mt-1"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Synced from the &ldquo;Post Arrival&rdquo; line item; you may
                override.
              </p>
            </div>
            <div className="rounded-lg bg-brand-50 p-3 ring-1 ring-inset ring-brand-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">In EUR</span>
                <span className="font-semibold text-brand-700">
                  {formatEur(paEur)}
                </span>
              </div>
            </div>
          </div>
        </CardShell>

        {/* 2. Post Return in 1 month */}
        <CardShell
          title="2. Post Return in 1 month"
          subtitle="Grant in EUR converted at execution-month rate"
          accent="emerald"
        >
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="r1-grant">
                Grant (EUR)
              </label>
              <input
                id="r1-grant"
                type="number"
                step="0.01"
                min="0"
                value={r1.grant}
                onChange={(e) =>
                  update("postReturn1Month", {
                    grant: toNumber(e.target.value),
                  })
                }
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label" htmlFor="r1-month">
                Execution month
              </label>
              <div className="mt-1">
                <MonthSelect
                  id="r1-month"
                  rates={rates}
                  value={r1.month}
                  onChange={(m) => update("postReturn1Month", { month: m })}
                />
              </div>
            </div>
            <RateBadge rate={r1.euroRate} />
            <div className="rounded-lg bg-emerald-50 p-3 ring-1 ring-inset ring-emerald-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Grant in EGP</span>
                <span className="font-semibold text-emerald-700">
                  {formatEgp(r1Egp)}
                </span>
              </div>
            </div>
          </div>
        </CardShell>

        {/* 3. Post Return in 2 months */}
        <CardShell
          title="3. Post Return in 2 months"
          subtitle="Compare a grant in EUR vs. a target total in EGP"
          accent="amber"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="r2-grant">
                  Grant (EUR)
                </label>
                <input
                  id="r2-grant"
                  type="number"
                  step="0.01"
                  min="0"
                  value={r2.grant}
                  onChange={(e) =>
                    update("postReturn2Months", {
                      grant: toNumber(e.target.value),
                    })
                  }
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="label" htmlFor="r2-egp">
                  Total in EGP
                </label>
                <input
                  id="r2-egp"
                  type="number"
                  step="0.01"
                  min="0"
                  value={r2.totalInEgp}
                  onChange={(e) =>
                    update("postReturn2Months", {
                      totalInEgp: toNumber(e.target.value),
                    })
                  }
                  className="input mt-1"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="r2-month">
                Execution month
              </label>
              <div className="mt-1">
                <MonthSelect
                  id="r2-month"
                  rates={rates}
                  value={r2.month}
                  onChange={(m) => update("postReturn2Months", { month: m })}
                />
              </div>
            </div>
            <RateBadge rate={r2.euroRate} />
            <div className="space-y-2">
              <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Grant in EGP</span>
                  <span className="font-semibold text-amber-700">
                    {formatEgp(r2GrantEgp)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Difference (EGP target &minus; grant in EGP)
                  </span>
                  <span
                    className={`font-semibold ${
                      r2DeltaEgp >= 0 ? "text-slate-700" : "text-rose-600"
                    }`}
                  >
                    {formatEgp(r2DeltaEgp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardShell>
      </div>
    </section>
  );
}
