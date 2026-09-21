import { Link } from 'react-router';

export default function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 group"
      aria-label="BetterMakati home"
    >
      <img
        src={inverse ? '/bettermakati-mark-white.svg' : '/bettermakati-mark.svg'}
        width={compact ? 48 : 56}
        height={compact ? 36 : 44}
        alt=""
        aria-hidden="true"
        className={compact ? 'h-9 w-12 shrink-0' : 'h-11 w-14 shrink-0'}
      />
      <div className="leading-tight min-w-0">
        <div
          className={
            compact
              ? 'brand-wordmark text-lg'
              : 'brand-wordmark text-xl'
          }
        >
          <span className={inverse ? 'text-white' : 'brand-wordmark-better'}>Better</span>
          <span className={inverse ? 'text-white' : 'brand-wordmark-makati'}>Makati</span>
        </div>
        {!compact && (
          <div
            className={
              inverse
                ? 'mt-0.5 hidden min-[400px]:block text-xs text-white/72'
                : 'mt-0.5 hidden min-[400px]:block text-xs text-gray-600'
            }
          >
            Independent civic platform for Makati
          </div>
        )}
      </div>
    </Link>
  );
}
