import { Link } from 'react-router';

export default function BrandMark({
  compact = false,
  inverse = false,
  stacked = false,
}: {
  compact?: boolean;
  inverse?: boolean;
  stacked?: boolean;
}) {
  return (
    <Link
      to="/"
      className="inline-flex items-center"
      aria-label="BetterMakati home"
    >
      <img
        src={stacked
          ? (inverse ? '/bettermakati-logo-reverse.svg' : '/bettermakati-logo.svg')
          : (inverse ? '/bettermakati-logo-horizontal-reverse.svg' : '/bettermakati-logo-horizontal.svg')}
        width={stacked ? 132 : 360}
        height={stacked ? 82 : 76}
        alt="BetterMakati"
        className={
          stacked
            ? 'h-20 w-auto shrink-0 object-contain'
            : compact
              ? 'h-auto w-[210px] max-w-full shrink-0 object-contain'
              : 'h-auto w-[170px] shrink-0 object-contain min-[360px]:w-[210px] sm:w-[240px]'
        }
      />
    </Link>
  );
}
