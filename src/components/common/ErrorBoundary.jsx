import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import i18n from '../../i18n';
import './ErrorBoundary.css';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="errorboundary-container"
          role="alert"
        >
          <AlertTriangle
            size={64}
            color="var(--color-error)"
            className="errorboundary-icon"
          />
          <h2
            className="errorboundary-title"
          >
            {i18n.t('errors.title')}
          </h2>
          <p
            className="errorboundary-message"
          >
            {i18n.t('errors.description')}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="errorboundary-retry-btn"
          >
            <RefreshCw size={18} />
            {i18n.t('errors.retry')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
