import React, { useState, useCallback } from 'react';

export function PromptInput() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [promptValue, setPromptValue] = useState('');

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptValue(e.target.value);
  }, []);

  return (
    <div className="prompt-container">
      <textarea
        id="prompt-input"
        placeholder="Enter additional prompt here..."
        className={`prompt-input ${isExpanded ? 'expanded' : ''}`}
        value={promptValue}
        onChange={handleChange}
      />
      <button className="expand-button" onClick={handleExpand}>
        {isExpanded ? '▲' : '▼'}
      </button>
    </div>
  );
}
