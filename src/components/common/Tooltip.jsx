import React, { useState, useRef, useEffect } from 'react';

/**
 * Accessible Tooltip Component
 * Provides contextual information with proper ARIA attributes
 */
export default function Tooltip({ children, content, position = 'top', delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
        default:
          break;
      }

      // Ensure tooltip stays within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;

      setCoords({ top, left });
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? tooltipId.current : undefined}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      {isVisible && content && (
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          role="tooltip"
          style={{
            ...styles.tooltip,
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {content}
          <div style={{
            ...styles.arrow,
            ...getArrowStyle(position)
          }} />
        </div>
      )}
    </>
  );
}

function getArrowStyle(position) {
  const arrowSize = 6;
  switch (position) {
    case 'top':
      return {
        bottom: `-${arrowSize}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderTop: `${arrowSize}px solid #1F2937`,
      };
    case 'bottom':
      return {
        top: `-${arrowSize}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid #1F2937`,
      };
    case 'left':
      return {
        right: `-${arrowSize}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderLeft: `${arrowSize}px solid #1F2937`,
      };
    case 'right':
      return {
        left: `-${arrowSize}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid #1F2937`,
      };
    default:
      return {};
  }
}

const styles = {
  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    lineHeight: '1.4',
    maxWidth: '250px',
    wordWrap: 'break-word',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'none',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
};
