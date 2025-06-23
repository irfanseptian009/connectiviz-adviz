"use client";

import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
            <p className="text-red-500 mb-4">Something went wrong with authentication.</p>
            <pre className="bg-red-100 p-4 rounded text-sm text-left text-red-800">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/signin';
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
