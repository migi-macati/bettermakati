import { useEffect, useState } from 'react';

const API = 'https://budget.bettergov.ph/api/v1/hgab/2027';
type State = 'loading' | 'available' | 'unavailable';

/**
 * BM-C054: source-status entry point. Do not turn a place-name search or a
 * shared DPWH office into an unverified citywide total.
 */
export default function NationalBudgetContext() {
  const [state, setState] = useState<State>('loading');
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(API, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Budget API unavailable');
        return response.json() as Promise<unknown>;
      })
      .then(data => {
        if (!data || typeof data !== 'object') throw new Error('Invalid API response');
        setState('available');
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('unavailable');
        else setState('unavailable');
      })
      .finally(() => clearTimeout(timeout));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  return (
    <section id="national-budget" className="mt-6 rounded-2xl border border-primary-200 bg-white p-5" aria-labelledby="national-budget-heading">
      <p className="text-xs font-bold uppercase tracking-wider text-primary-700">National government · FY 2027</p>
      <h2 id="national-budget-heading" className="mt-2 text-xl font-extrabold text-gray-950">National budget projects affecting Makati</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        Compare the National Expenditure Program with House Bill 10858 using BetterGov.PH's source-linked project records. These are proposed appropriations, not spending or completed projects. A project appearing in only one version requires verification before calling it an addition or deletion.
      </p>
      <p className="mt-3 text-sm text-gray-700">
        <strong>Coverage warning:</strong> The public API currently searches project titles by place name and groups DPWH lines by engineering office. Neither method establishes a complete Makati citywide project list. Shared-office totals must not be attributed wholly to Makati.
      </p>
      <p className="mt-3 text-xs text-gray-600" role="status" aria-live="polite">
        Budget API: {state === 'loading' ? 'checking connection…' : state === 'available' ? 'reachable (Makati coverage not yet verified)' : 'connection unavailable; source links remain accessible'}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <a className="rounded-lg border border-primary-300 px-4 py-2 text-primary-800 hover:bg-primary-50" href="https://budget.bettergov.ph/hgab/2027/overview" target="_blank" rel="noopener noreferrer">2027 national budget comparison ↗</a>
        <a className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50" href="https://budget.bettergov.ph/docs" target="_blank" rel="noopener noreferrer">API and source documentation ↗</a>
      </div>
      <p className="mt-3 text-xs text-gray-600" lang="fil">
        Paalala: Panukalang alokasyon ang NEP at House bill, hindi aktuwal na gastos. Hindi pa kumpleto o nabe-verify ang listahan ng mga proyektong partikular sa Makati.
      </p>
    </section>
  );
}
