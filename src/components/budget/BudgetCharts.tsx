import type { ReactNode } from 'react';

type ChartItem = {
  label: string;
  value: number;
  share?: number;
};

const palette = [
  '#176238',
  '#dca514',
  '#3b8792',
  '#6f8a68',
  '#8a6f3d',
  '#466a78',
];

export function DonutChart({
  title,
  center,
  items,
}: {
  title: string;
  center: ReactNode;
  items: ChartItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items.map((item, index) => {
    const startValue = items
      .slice(0, index)
      .reduce((sum, precedingItem) => sum + precedingItem.value, 0);
    const start = (startValue / total) * 100;
    const end = ((startValue + item.value) / total) * 100;
    return `${palette[index % palette.length]} ${start}% ${end}%`;
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h3 className="font-extrabold text-gray-950">{title}</h3>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-center">
        <div
          role="img"
          aria-label={`${title}: ${items
            .map(item => `${item.label} ${item.share !== undefined ? item.share.toFixed(1) + '%' : item.value}`)
            .join(', ')}`}
          className="relative mx-auto h-44 w-44 rounded-full"
          style={{ background: `conic-gradient(${segments.join(',')})` }}
        >
          <div className="absolute inset-[24%] grid place-items-center rounded-full bg-white text-center">
            <div className="text-xl font-extrabold text-gray-950">{center}</div>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.label} className="flex items-start gap-3">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: palette[index % palette.length] }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-gray-900">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.share !== undefined ? item.share.toFixed(1) + '%' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  title,
  items,
  formatValue,
}: {
  title: string;
  items: ChartItem[];
  formatValue: (value: number) => string;
}) {
  const max = Math.max(...items.map(item => item.value), 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h3 className="font-extrabold text-gray-950">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-sm font-semibold text-gray-800">
                {item.label}
              </div>
              <div className="text-sm font-extrabold text-gray-950">
                {formatValue(item.value)}
              </div>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((item.value / max) * 100, 1)}%`,
                  backgroundColor: palette[index % palette.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonBars({
  title,
  items,
  formatValue,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
  formatValue: (value: number) => string;
}) {
  const max = Math.max(...items.map(item => item.value), 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h3 className="font-extrabold text-gray-950">{title}</h3>
      <div className="mt-6 flex h-48 items-end justify-center gap-10">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex h-full w-24 flex-col items-center justify-end"
          >
            <div className="mb-2 text-sm font-extrabold text-gray-950">
              {formatValue(item.value)}
            </div>
            <div
              className="w-full rounded-t-lg"
              style={{
                height: `${Math.max((item.value / max) * 145, 10)}px`,
                backgroundColor: palette[index % palette.length],
              }}
            />
            <div className="mt-2 text-sm font-bold text-gray-700">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FiscalTrendChart({
  title,
  items,
  formatValue,
}: {
  title: string;
  items: Array<{ year: number; receiptsM: number; expendituresM: number }>;
  formatValue: (value: number) => string;
}) {
  const max = Math.max(
    ...items.flatMap(item => [item.receiptsM, item.expendituresM]),
    1
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-extrabold text-gray-950">{title}</h3>
        <div
          className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary-700" /> Receipts
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-secondary-500" />{' '}
            Expenditures
          </span>
        </div>
      </div>

      <div
        className="mt-6 space-y-5"
        role="list"
        aria-label={`${title}, in Philippine pesos`}
      >
        {items.map(item => (
          <div
            key={item.year}
            role="listitem"
            className="grid grid-cols-[3.25rem_1fr] gap-3 items-center"
          >
            <div className="text-sm font-extrabold text-gray-700">
              {item.year}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary-700"
                    style={{
                      width: `${Math.max((item.receiptsM / max) * 100, 1)}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs font-bold text-gray-700">
                  <span className="sr-only">{item.year} receipts: </span>
                  {formatValue(item.receiptsM)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-secondary-500"
                    style={{
                      width: `${Math.max((item.expendituresM / max) * 100, 1)}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs font-bold text-gray-700">
                  <span className="sr-only">{item.year} expenditures: </span>
                  {formatValue(item.expendituresM)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
