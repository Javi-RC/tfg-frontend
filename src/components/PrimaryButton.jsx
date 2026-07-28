import React from 'react';
import './PrimaryButton.css';

const EMPTY_STYLE = {};

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  style = EMPTY_STYLE,
  type = 'button',
  leftIcon = null,
  rightIcon = null,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="primary-button"
      style={style}
    >
      {leftIcon && (
        <span className="primary-button-icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="primary-button-icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
