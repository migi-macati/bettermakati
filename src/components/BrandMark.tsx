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
      className="inline-flex items-center"
      aria-label="BetterMakati home"
    >
      <img
        src={inverse ? '/bettermakati-logo-reverse.svg' : '/bettermakati-logo.svg'}
        width={compact ? 116 : 132}
        height={compact ? 72 : 82}
        alt="BetterMakati"
        className={
          compact
            ? 'h-[56px] w-auto shrink-0 object-contain'
            : 'h-[62px] w-auto shrink-0 object-contain sm:h-[68px]'
        }
      />
    </Link>
  );
}
