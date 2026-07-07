import React from 'react';
import { BlinkBlur } from 'react-loading-indicators';

const LoadingIndicator = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white z-50">
      <BlinkBlur color="var(--color-primary)" size="small" text="Loading..." textColor="var(--color-primary)" />
    </div>
  );
};

export default LoadingIndicator;
