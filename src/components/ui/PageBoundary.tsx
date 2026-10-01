import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function PageBoundaryFallback({
  retry,
}: {
  retry: () => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="container px-5 py-16" role="alert">
      <h1 className="text-3xl font-bold text-gray-900">
        {t('pageBoundary.title')}
      </h1>
      <p className="mt-3 max-w-xl text-gray-600">
        {t('pageBoundary.description')}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="brand-btn-primary" onClick={retry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />{' '}
          {t('pageBoundary.tryAgain')}
        </button>
        <a href="/" className="brand-btn-secondary">
          {t('pageBoundary.home')}
        </a>
      </div>
    </section>
  );
}

export default class PageBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <PageBoundaryFallback retry={() => window.location.reload()} />;
  }
}
