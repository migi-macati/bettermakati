import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

/** Keep the city ledger distinct from the national project comparison. */
export default function NationalBudgetContext() {
  const { i18n } = useTranslation();
  const fil = i18n.resolvedLanguage === 'fil';
  return (
    <section
      id="national-budget"
      className="mt-6 rounded-2xl border border-primary-200 bg-white p-5"
      aria-labelledby="national-budget-heading"
    >
      <h2 id="national-budget-heading" className="text-xl font-bold">
        {fil
          ? 'Pambansang budget 2027 at Makati'
          : 'National budget 2027 and Makati'}
      </h2>
      <p className="mt-2 max-w-3xl text-sm">
        {fil
          ? 'Tingnan ang pambansang panukala at mga proyektong may Makati sa pamagat, kasama ang mga bersyon, source PDF at limitasyon ng datos. Hiwalay ang mga ito sa budget ng lungsod sa pahinang ito.'
          : 'Explore the national proposal and projects with Makati in their titles, with version amounts, source PDFs and coverage limits. These are separate from the city budget on this page.'}
      </p>
      <Link
        to="/budget-2027"
        className="mt-3 inline-block font-semibold text-primary-800 underline"
      >
        {fil ? 'Tingnan ang Budget 2027' : 'Explore Budget 2027'}
      </Link>
    </section>
  );
}
