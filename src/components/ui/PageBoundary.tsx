import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

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
    return (
      <section className="container px-5 py-16" role="alert">
        <h1 className="text-3xl font-bold text-gray-900">
          This page couldn’t load
        </h1>
        <p className="mt-3 max-w-xl text-gray-600">
          Check your connection and try again. You can also return to the
          homepage.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="brand-btn-primary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
          <a href="/" className="brand-btn-secondary">
            Go to homepage
          </a>
        </div>
      </section>
    );
  }
}
