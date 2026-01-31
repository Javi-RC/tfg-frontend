import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ArrayQuestion.css';

/**
 * ArrayQuestion - Handles array inputs (phones, skills, etc.)
 */
const ArrayQuestion = ({ question, value = [], onChange }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [phoneType, setPhoneType] = useState('mobile');
  const inputId = `${question.field || 'array'}-input`;
  const selectId = `${question.field || 'array'}-type`;
  const labelText = question.label || question.question || question.field || t('questionnaire.array.addItem');

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
          id={inputId}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={question.placeholder || t('questionnaire.array.placeholder')}
          className="form-input"
          aria-label={labelText}
        />
        
        {isPhoneField && (
          <select 
            id={selectId}
            value={phoneType} 
            onChange={(e) => setPhoneType(e.target.value)}
            className="phone-type-select"
            aria-label={`${labelText} type`}
          >
            <option value="mobile">{t('questionnaire.array.mobile')}</option>
            <option value="home">{t('questionnaire.array.home')}</option>
            <option value="work">{t('questionnaire.array.work')}</option>
          </select>
        )}
        
        <button type="button" onClick={handleAdd} className="btn-add" aria-label={`Add ${labelText}`}>
          {t('questionnaire.array.add')}
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
                aria-label={`Remove ${typeof item === 'object' ? item.number || 'item' : item}`}
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
