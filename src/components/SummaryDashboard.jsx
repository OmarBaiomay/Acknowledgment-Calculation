import { formatEgp, formatEur } from "../utils/format";

function Stat({ label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-50 ring-slate-200 text-slate-900",
    brand: "bg-brand-50 ring-brand-100 text-brand-800",
    emerald: "bg-emerald-50 ring-emerald-100 text-emerald-800",
    amber: "bg-amber-50 ring-amber-100 text-amber-800",
    rose: "bg-rose-50 ring-rose-100 text-rose-800",
  };
  return (
    <div className={`rounded-xl ring-1 ring-inset p-4 ${tones[tone]}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function SummaryDashboard({ summary }) {
  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-white">
        <h2 className="text-base font-semibold">Acknowledgment Summary</h2>
        <p className="mt-0.5 text-xs text-white/70">
          Final consolidated totals — react instantly to any input change.
        </p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-5">
        <Stat
          label="Total Intervention (EGP)"
          value={formatEgp(summary.totalInterventionEgp)}
          tone="slate"
        />
        <Stat
          label="Total Intervention (EUR)"
          value={formatEur(summary.totalInterventionEur)}
          tone="brand"
        />
        <Stat
          label="Grant (EUR)"
          value={formatEur(summary.grantEur)}
          tone="emerald"
        />
        <Stat
          label="Paid by LM"
          value={formatEur(summary.paidByLm)}
          tone="amber"
        />
        <Stat
          label="Paid by Beneficiary"
          value={formatEur(summary.paidByBeneficiary)}
          tone={summary.paidByBeneficiary < 0 ? "rose" : "slate"}
        />
      </div>
    </section>
  );
}
