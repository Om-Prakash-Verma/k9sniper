import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let errorMessage = 'An unexpected error occurred.';
      let details = '';

      try {
        if (error?.message) {
          const parsed = JSON.parse(error.message);
          if (parsed.error) {
            errorMessage = 'Permission Denied';
            details = `You do not have permission to perform this ${parsed.operationType} operation on ${parsed.path}.`;
          }
        }
      } catch (e) {
        errorMessage = error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-brand-bg-secondary rounded-[3rem] p-12 border border-brand-accent-secondary/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter mb-4">
              {errorMessage}
            </h2>
            <p className="text-brand-text/60 mb-8 leading-relaxed">
              {details || 'Something went wrong while loading the application. Please try refreshing the page.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-premium w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-brand-bg-secondary font-bold uppercase tracking-widest"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
