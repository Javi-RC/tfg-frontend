import React from 'react';
import './SecondaryButton.css';

const EMPTY_STYLE = {};

export default function SecondaryButton({
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
      className="secondary-button"
      style={style}
    >
      {leftIcon && (
        <span className="secondary-button-icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="secondary-button-icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
