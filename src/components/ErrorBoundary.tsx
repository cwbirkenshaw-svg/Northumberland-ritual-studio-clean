
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6 border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Interrupted</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                A critical error occurred in the ritual engine. The security controller has intercepted the crash.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl text-left overflow-hidden">
              <p className="text-[10px] font-mono text-red-600 break-all">
                {this.state.error?.message || 'Unknown Error'}
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-north-navy text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw size={16} />
              Reset Ritual Studio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
