import { Check, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SharePage({
  title,
  className = '',
}: {
  title?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copyUrl, setCopyUrl] = useState('');
  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const share = async () => {
    const url = window.location.href;
    try {
      if (canShare) {
        await navigator.share({ title: title || document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setCopyUrl(url);
    }
  };

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={share}
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-primary-700 hover:border-primary-300 hover:bg-primary-50 ${className}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" /> {t('sharePage.copied')}
          </>
        ) : canShare ? (
          <>
            <Share2 className="h-4 w-4" aria-hidden="true" /> {t('sharePage.share')}
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" aria-hidden="true" /> {t('sharePage.copy')}
          </>
        )}
      </button>
      <span className="sr-only" role="status">
        {copied ? t('sharePage.copiedStatus') : ''}
      </span>
      {copyUrl && (
        <label className="mt-2 block text-xs text-gray-600">
          {t('sharePage.copyLabel')}
          <input
            readOnly
            value={copyUrl}
            onFocus={event => event.currentTarget.select()}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm"
          />
        </label>
      )}
    </div>
  );
}
