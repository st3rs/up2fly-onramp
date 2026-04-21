import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-md w-full text-center accent-glow">
            <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Something went wrong</h2>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              An unexpected error occurred. This might be due to a network issue or a temporary service interruption.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Application</span>
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-black/40 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-red-400 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
