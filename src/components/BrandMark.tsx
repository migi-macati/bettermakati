import { Link } from 'react-router';

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 group"
      aria-label="BetterMakati home"
    >
      <img
        src="/bettermakati-mark.svg"
        width={compact ? 48 : 56}
        height={compact ? 36 : 44}
        alt=""
        aria-hidden="true"
        className={compact ? 'h-9 w-12 shrink-0' : 'h-11 w-14 shrink-0'}
      />
      <div className="leading-tight">
        <div
          className={
            compact
              ? 'text-lg font-normal tracking-tight'
              : 'text-xl font-normal tracking-tight'
          }
        >
          <span className="text-primary-800">Better</span>
          <span className="text-primary-800 font-bold">Makati</span>
        </div>
        {!compact && (
          <div className="text-xs text-gray-600 mt-0.5 hidden min-[400px]:block">
            Independent civic information portal
          </div>
        )}
      </div>
    </Link>
  );
}
