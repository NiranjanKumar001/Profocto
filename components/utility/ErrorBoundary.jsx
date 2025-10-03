"use client";

import React from 'react';
import { FaExclamationTriangle, FaRedo, FaHome, FaBug } from 'react-icons/fa';

/**
 * Enhanced Error Boundary with better user experience and recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Report error to error reporting service (if available)
    if (typeof window !== 'undefined' && window.errorReporting) {
      window.errorReporting.reportError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  reportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const issueBody = encodeURIComponent(
      `**Error ID:** ${errorId}\n\n` +
      `**Error Message:** ${error?.message || 'Unknown error'}\n\n` +
      `**Stack Trace:**\n\`\`\`\n${error?.stack || 'No stack trace available'}\n\`\`\`\n\n` +
      `**Component Stack:**\n\`\`\`\n${errorInfo?.componentStack || 'No component stack available'}\n\`\`\`\n\n` +
      `**Browser:** ${navigator.userAgent}\n` +
      `**URL:** ${window.location.href}\n` +
      `**Timestamp:** ${new Date().toISOString()}\n\n` +
      `**Additional Information:**\n(Please describe what you were doing when this error occurred)`
    );

    const githubUrl = `https://github.com/adityashirsatrao007/Profocto/issues/new?title=Bug%20Report%3A%20${encodeURIComponent(error?.message || 'Application Error')}&body=${issueBody}`;
    window.open(githubUrl, '_blank');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const { fallback: CustomFallback } = this.props;

      // If a custom fallback is provided, use it
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error}
            errorId={errorId}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            onGoHome={this.handleGoHome}
            onReportBug={this.reportBug}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>

              {/* Error Description */}
              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. An unexpected error has occurred while processing your request.
              </p>

              {/* Error ID */}
              <div className="bg-gray-50 rounded p-3 mb-6">
                <p className="text-sm text-gray-500">
                  Error ID: <code className="font-mono bg-white px-1 rounded">{errorId}</code>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaRedo className="mr-2" />
                  Try Again
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <FaRedo className="mr-1" />
                    Reload
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FaHome className="mr-1" />
                    Home
                  </button>
                </div>

                <button
                  onClick={this.reportBug}
                  className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaBug className="mr-2" />
                  Report This Issue
                </button>
              </div>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Developer Information
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 rounded text-xs">
                    <p className="font-semibold text-red-800 mb-2">Error Message:</p>
                    <p className="text-red-700 mb-3">{error.message}</p>
                    <p className="font-semibold text-red-800 mb-2">Stack Trace:</p>
                    <pre className="text-red-700 whitespace-pre-wrap text-xs overflow-auto">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export const withErrorBoundary = (Component, fallback) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Simple error fallback component for smaller sections
 */
export const SimpleErrorFallback = ({ error, onRetry, message }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center">
      <FaExclamationTriangle className="text-red-500 mr-3" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">
          {message || 'An error occurred'}
        </h3>
        {error && (
          <p className="text-xs text-red-600 mt-1">
            {error.message}
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

export default ErrorBoundary;