'use client';

import React, { useState, useEffect } from 'react';
import styles from './TagInput.module.css';

const TagInput = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    // Uppdatera lokalt state när tags prop ändras
    setInput('');
  }, [tags]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      setTags([...tags, input]);
      setInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
