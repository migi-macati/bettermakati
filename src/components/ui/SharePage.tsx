import { Check, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function SharePage({
  title,
  className = '',
}: {
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title || document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // User cancellation is not an error state for the page.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-primary-700 hover:border-primary-300 hover:bg-primary-50 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> Link copied
        </>
      ) : navigator.share ? (
        <>
          <Share2 className="h-4 w-4" aria-hidden="true" /> Share
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" aria-hidden="true" /> Copy link
        </>
      )}
    </button>
  );
}
