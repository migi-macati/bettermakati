import { Link } from 'react-router';

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="BetterMakati home">
      <img
        src="/bettermakati-mark.svg"
        alt=""
        aria-hidden="true"
        className={compact ? 'h-9 w-9' : 'h-11 w-11'}
      />
      <div className="leading-tight">
        <div className={compact ? 'text-lg font-extrabold tracking-tight' : 'text-xl font-extrabold tracking-tight'}>
          <span className="text-primary-800">Better</span>
          <span className="text-secondary-700">Makati</span>
        </div>
        {!compact && (
          <div className="text-[11px] text-gray-600 mt-0.5">Independent civic information portal</div>
        )}
      </div>
    </Link>
  );
}
