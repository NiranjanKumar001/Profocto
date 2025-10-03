import { useState, useEffect, useCallback } from 'react';

/**
 * Performance utilities for optimizing component rendering and user interactions
 */

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Enhanced auto-save hook with better user feedback
 * @param {Function} saveFunction - Function to call for saving
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} Auto-save utilities
 */
export const useAutoSave = (saveFunction, delay = 1000) => {
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);

  const debouncedSave = useCallback(
    (data) => {
      const debouncedFn = debounce(async (d) => {
        try {
          setSaveStatus('saving');
          await saveFunction(d);
          setSaveStatus('saved');
          setLastSaved(new Date());
        } catch (error) {
          setSaveStatus('error');
          console.error('Auto-save failed:', error);
        }
      }, delay);
      debouncedFn(data);
    },
    [saveFunction, delay]
  );

  const triggerSave = useCallback((data) => {
    setSaveStatus('pending');
    debouncedSave(data);
  }, [debouncedSave]);

  return {
    triggerSave,
    saveStatus,
    lastSaved,
    getSaveStatusMessage: () => {
      switch (saveStatus) {
        case 'saving': return 'Saving...';
        case 'saved': return lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : 'All changes saved';
        case 'pending': return 'Changes pending...';
        case 'error': return 'Save failed - please try again';
        default: return '';
      }
    }
  };
};

/**
 * Hook for optimized form input handling with debounced updates
 * @param {*} initialValue - Initial form value
 * @param {Function} onDebouncedChange - Callback for debounced changes
 * @param {number} delay - Debounce delay
 * @returns {Object} Form input utilities
 */
export const useOptimizedInput = (initialValue, onDebouncedChange, delay = 300) => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  const debouncedCallback = useCallback(
    (value) => {
      const debouncedFn = debounce((v) => {
        onDebouncedChange(v);
        setIsTyping(false);
      }, delay);
      debouncedFn(value);
    },
    [onDebouncedChange, delay]
  );

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    setIsTyping(true);
    debouncedCallback(newValue);
  }, [debouncedCallback]);

  // Update display value when external value changes
  useEffect(() => {
    setDisplayValue(initialValue);
  }, [initialValue]);

  return {
    value: displayValue,
    onChange: handleChange,
    isTyping,
    // For external updates without triggering onChange
    setValue: setDisplayValue
  };
};

/**
 * Keyboard navigation utilities for accessibility
 */
export const KeyboardNavigation = {
  KEYS: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab',
    HOME: 'Home',
    END: 'End'
  },

  /**
   * Check if key is an activation key (Enter or Space)
   * @param {string} key - Key name
   * @returns {boolean}
   */
  isActivationKey: (key) => {
    return key === KeyboardNavigation.KEYS.ENTER || key === KeyboardNavigation.KEYS.SPACE;
  },

  /**
   * Handle keyboard activation (Enter/Space) with callback
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Function} callback - Callback to execute
   */
  handleActivation: (event, callback) => {
    if (KeyboardNavigation.isActivationKey(event.key)) {
      event.preventDefault();
      callback(event);
    }
  },

  /**
   * Create keyboard event handler for arrow navigation
   * @param {Object} options - Navigation options
   * @returns {Function} Event handler
   */
  createArrowNavigationHandler: ({ onUp, onDown, onLeft, onRight, onHome, onEnd }) => {
    return (event) => {
      switch (event.key) {
        case KeyboardNavigation.KEYS.ARROW_UP:
          event.preventDefault();
          onUp?.(event);
          break;
        case KeyboardNavigation.KEYS.ARROW_DOWN:
          event.preventDefault();
          onDown?.(event);
          break;
        case KeyboardNavigation.KEYS.ARROW_LEFT:
          event.preventDefault();
          onLeft?.(event);
          break;
        case KeyboardNavigation.KEYS.ARROW_RIGHT:
          event.preventDefault();
          onRight?.(event);
          break;
        case KeyboardNavigation.KEYS.HOME:
          event.preventDefault();
          onHome?.(event);
          break;
        case KeyboardNavigation.KEYS.END:
          event.preventDefault();
          onEnd?.(event);
          break;
      }
    };
  }
};

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
  /**
   * Measure component render time
   * @param {string} componentName - Name of the component
   * @returns {Function} Cleanup function
   */
  measureRenderTime: (componentName) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  },

  /**
   * Optimize large lists with virtual scrolling helpers
   * @param {Array} items - Array of items
   * @param {number} containerHeight - Height of container
   * @param {number} itemHeight - Height of each item
   * @param {number} scrollTop - Current scroll position
   * @returns {Object} Virtualization data
   */
  getVirtualizedData: (items, containerHeight, itemHeight, scrollTop) => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      offsetY,
      totalHeight: items.length * itemHeight
    };
  }
};