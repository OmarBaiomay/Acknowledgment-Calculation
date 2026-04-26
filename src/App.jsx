import { useMemo, useState } from "react";
import ExchangeRateManager from "./components/ExchangeRateManager";
import CostInputTable from "./components/CostInputTable";
import ScenarioCalculators from "./components/ScenarioCalculators";
import SummaryDashboard from "./components/SummaryDashboard";
import { DEFAULT_EXCHANGE_RATES, DEFAULT_LINE_ITEMS } from "./utils/defaults";
import { toNumber } from "./utils/format";

const initialScenarios = {
  postArrival: {
    month: "1(2025)",
    euroRate: DEFAULT_EXCHANGE_RATES[0].rate,
    totalPaidByCaseWorkerEGP: 0,
  },
  postReturn1Month: {
    grant: 250,
    month: "2(2025)",
    euroRate: DEFAULT_EXCHANGE_RATES[1].rate,
  },
  postReturn2Months: {
    grant: 250,
    totalInEgp: 12000,
    month: "3(2025)",
    euroRate: DEFAULT_EXCHANGE_RATES[2].rate,
  },
};

export default function App() {
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);
  const [lineItems, setLineItems] = useState(DEFAULT_LINE_ITEMS);
  const [scenarios, setScenarios] = useState(initialScenarios);

  // Cost table totals
  const totalEgpFromItems = useMemo(
    () => lineItems.reduce((acc, it) => acc + toNumber(it.costEGP), 0),
    [lineItems],
  );

  const postArrivalEgpFromItems = useMemo(
    () =>
      lineItems
        .filter((it) => /post\s*arrival/i.test(it.item))
        .reduce((acc, it) => acc + toNumber(it.costEGP), 0),
    [lineItems],
  );

  const postReturnEgpFromItems = useMemo(
    () =>
      lineItems
        .filter((it) => /post\s*return/i.test(it.item))
        .reduce((acc, it) => acc + toNumber(it.costEGP), 0),
    [lineItems],
  );

  // Summary calculations
  const summary = useMemo(() => {
    const pa = scenarios.postArrival;
    const r1 = scenarios.postReturn1Month;
    const r2 = scenarios.postReturn2Months;

    const paidByLm = pa.euroRate > 0 ? pa.totalPaidByCaseWorkerEGP / pa.euroRate : 0;

    // Grant EUR = sum of post-return grants (entered directly in EUR)
    const grantEur = toNumber(r1.grant) + toNumber(r2.grant);

    // Total Intervention EGP = sum of all line items in EGP
    const totalInterventionEgp = totalEgpFromItems;

    // Total Intervention EUR:
    //   - Post-arrival items converted at post-arrival month rate
    //   - Post-return items converted at the (most relevant) post-return month rate.
    //     We use postReturn1Month rate for post-return items, falling back to
    //     postReturn2Months rate if the first is missing.
    const postReturnRate =
      r1.euroRate > 0 ? r1.euroRate : r2.euroRate > 0 ? r2.euroRate : 0;

    const postArrivalEur =
      pa.euroRate > 0 ? postArrivalEgpFromItems / pa.euroRate : 0;
    const postReturnEur =
      postReturnRate > 0 ? postReturnEgpFromItems / postReturnRate : 0;
    const totalInterventionEur = postArrivalEur + postReturnEur;

    // Paid by Beneficiary = whatever is not covered by LM and the grants.
    const paidByBeneficiary = totalInterventionEur - paidByLm - grantEur;

    return {
      totalInterventionEgp,
      totalInterventionEur,
      grantEur,
      paidByLm,
      paidByBeneficiary,
    };
  }, [
    scenarios,
    totalEgpFromItems,
    postArrivalEgpFromItems,
    postReturnEgpFromItems,
  ]);

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card">
              <span className="text-base font-bold">A</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Acknowledgment Calculation
              </h1>
              <p className="text-xs text-slate-500">
                EUR &harr; EGP intervention &amp; grant tracker
              </p>
            </div>
          </div>
          <span className="pill">Reactive · v1.0</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <ExchangeRateManager
              rates={exchangeRates}
              onChange={setExchangeRates}
            />
          </div>

          <div className="space-y-6 lg:col-span-8 xl:col-span-9">
            <CostInputTable
              lineItems={lineItems}
              onChange={setLineItems}
              totalEgp={totalEgpFromItems}
            />

            <ScenarioCalculators
              rates={exchangeRates}
              scenarios={scenarios}
              onChange={setScenarios}
              postArrivalEgpFromItems={postArrivalEgpFromItems}
            />

            <SummaryDashboard summary={summary} />
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center gap-1 text-center text-xs text-slate-400">
          <span>
            Built with React + Tailwind. All calculations update reactively;
            values are formatted to 2 decimal places.
          </span>
          <span>
            Built with{" "}
            <a
              href="https://b-code.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 hover:text-brand-700 hover:underline"
            >
              &copy; 2026 B-Code
            </a>{" "}
            <span className="text-slate-300">|</span>{" "}
            <span className="font-medium text-slate-500">Omar Elbayoumi</span>
          </span>
        </footer>
      </main>
    </div>
  );
}
