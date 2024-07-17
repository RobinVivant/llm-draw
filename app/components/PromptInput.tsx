import React, { useState } from 'react';

export function PromptInput() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="prompt-container">
      <textarea
        id="prompt-input"
        placeholder="Enter additional prompt here..."
        className={`prompt-input ${isExpanded ? 'expanded' : ''}`}
      />
    </div>
  );
}
