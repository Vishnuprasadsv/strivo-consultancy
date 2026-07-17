import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-full max-w-xl bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-card flex flex-col items-center">
            {/* Warning Icon with micro-animation */}
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <FiAlertTriangle size={32} />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-[#131111] mb-2 uppercase tracking-wide">
              Something went wrong
            </h1>
            <p className="text-sm text-[#454545] max-w-md mb-6 leading-relaxed">
              An unexpected error occurred while loading this page. The application has been halted to prevent further instability.
            </p>

            {/* Details accordion for developer debugging */}
            {this.state.error && (
              <details className="w-full text-left mb-8 border border-[#E5E7EB] rounded overflow-hidden">
                <summary className="bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-[#454545] cursor-pointer hover:bg-[#F2F4F6] transition-colors outline-none select-none">
                  Technical Details (Debug Info)
                </summary>
                <div className="p-4 bg-[#F8FAFC] border-t border-[#E5E7EB] max-h-40 overflow-y-auto font-mono text-[10px] text-[#DC2626] whitespace-pre-wrap">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <p className="opacity-80">
                    {this.state.errorInfo?.componentStack}
                  </p>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#012959] hover:bg-[#003280] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                style={{ height: '40px' }}
              >
                <FiRefreshCw size={14} />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-2.5 border border-[#E5E7EB] text-[#454545] hover:bg-[#F2F4F6] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
                style={{ height: '40px' }}
              >
                <FiHome size={14} />
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
