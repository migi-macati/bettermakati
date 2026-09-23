import { Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';

interface CitizenSummaryProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  points?: Array<{
    label?: string;
    text: ReactNode;
  }>;
  note?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function CitizenSummary({
  eyebrow = 'In plain language',
  title,
  summary,
  points = [],
  note,
  actions,
  className = '',
}: CitizenSummaryProps) {
  return (
    <div
      className={
        'rounded-2xl border border-primary-100 bg-primary-50/60 p-5 md:p-6 ' +
        className
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-primary-700">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            {eyebrow}
          </div>
          <h3 className="mt-1 text-lg font-extrabold text-gray-950 md:text-xl">
            {title}
          </h3>
          {summary && (
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
              {summary}
            </p>
          )}
        </div>
      </div>

      {points.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {points.map((point, index) => (
            <div key={index} className="rounded-xl border border-primary-100 bg-white p-4">
              {point.label && (
                <div className="text-xs font-bold uppercase tracking-[0.06em] text-primary-700">
                  {point.label}
                </div>
              )}
              <div className={point.label ? 'mt-1 text-sm leading-relaxed text-gray-700' : 'text-sm leading-relaxed text-gray-700'}>
                {point.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {(note || actions) && (
        <div className="mt-4 flex flex-col gap-3 border-t border-primary-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {note && (
            <div className="max-w-3xl text-xs leading-relaxed text-gray-600">
              {note}
            </div>
          )}
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
