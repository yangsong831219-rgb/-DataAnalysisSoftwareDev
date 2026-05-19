import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

interface ErrorInfo {
  hasError: boolean;
  message: string;
}

export function ErrorBoundary({ children }: Props) {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({ hasError: false, message: '' });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setErrorInfo({ hasError: true, message: event.error?.message || 'Unknown error' });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (errorInfo.hasError) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        <h2>应用出错</h2>
        <p>{errorInfo.message}</p>
        <button onClick={() => window.location.reload()}>重新加载</button>
      </div>
    );
  }

  return <>{children}</>;
}