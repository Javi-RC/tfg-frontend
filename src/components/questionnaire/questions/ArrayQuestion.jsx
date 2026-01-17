import React, { useState } from 'react';
import './ArrayQuestion.css';

/**
 * ArrayQuestion - Handles array inputs (phones, skills, etc.)
 */
const ArrayQuestion = ({ question, value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [phoneType, setPhoneType] = useState('mobile');

  const isPhoneField = question.field?.includes('phone');

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newItem = isPhoneField 
        ? { number: inputValue, type: phoneType }
        : inputValue;
      
      onChange([...value, newItem]);
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="array-question">
      <div className="array-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={question.placeholder || 'Add item...'}
          className="form-input"
        />
        
        {isPhoneField && (
          <select 
            value={phoneType} 
            onChange={(e) => setPhoneType(e.target.value)}
            className="phone-type-select"
          >
            <option value="mobile">Mobile</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
          </select>
        )}
        
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="array-items">
          {value.map((item, index) => (
            <div key={index} className="array-item">
              <span>
                {typeof item === 'object' 
                  ? `${item.number || JSON.stringify(item)} ${item.type ? `(${item.type})` : ''}`
                  : item}
              </span>
              <button 
                type="button"
                onClick={() => handleRemove(index)}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArrayQuestion;
