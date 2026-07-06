import React from 'react';
import { BlinkBlur } from 'react-loading-indicators';

const LoadingIndicator = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white z-50">
      <BlinkBlur color="#4279dc" size="small" text="Loading..." textColor="#333" />
    </div>
  );
};

export default LoadingIndicator;
