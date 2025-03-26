
import React, { useState } from 'react';

const StealthButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const activateStealthMode = () => {
    // In a real implementation, this would save the current state
    // and redirect to a safe website
    window.location.href = 'https://news.google.com';
  };

  return (
    <div className="relative">
      <button
        onClick={activateStealthMode}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
        aria-label="Emergency Exit"
      >
        <span className="absolute w-full h-full rounded-full animate-ping-slow bg-destructive/40"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-white rounded-md shadow-md text-sm text-foreground/90 animate-fade-in">
          Emergency Exit: Click to quickly leave this site
        </div>
      )}
    </div>
  );
};

export default StealthButton;
