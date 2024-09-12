'use client';

import React, { useState } from 'react';
import styles from './TagInput.module.css';

const TagInput = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Förhindra standardbeteendet för Enter
      if (input.trim()) {
        const formattedInput = capitalizeFirstLetter(input.trim());
        if (!tags.includes(formattedInput)) {
          setTags([...tags, formattedInput]);
        }
        setInput('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
            <button onClick={() => removeTag(index)}>&times;</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TagInput;
