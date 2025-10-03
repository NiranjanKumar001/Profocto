"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaCheck, FaSpinner, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced auto-save status component with better user feedback
 * Shows save status with appropriate icons and animations
 */
const AutoSaveStatus = ({ 
  saveStatus = 'saved', 
  lastSaved = null, 
  className = '',
  showFullMessage = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show status when there's activity, hide when saved for a while
  useEffect(() => {
    if (saveStatus !== 'saved') {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const getStatusConfig = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: FaSpinner,
          text: 'Saving...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          iconClass: 'animate-spin'
        };
      case 'saved':
        return {
          icon: FaCheck,
          text: lastSaved 
            ? `Saved at ${lastSaved.toLocaleTimeString()}` 
            : 'All changes saved',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          iconClass: ''
        };
      case 'pending':
        return {
          icon: FaClock,
          text: 'Changes pending...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          iconClass: ''
        };
      case 'error':
        return {
          icon: FaExclamationTriangle,
          text: 'Save failed - please try again',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          iconClass: ''
        };
      default:
        return {
          icon: FaClock,
          text: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          iconClass: ''
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  if (!isVisible && saveStatus === 'saved') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
          ${statusConfig.color} ${statusConfig.bgColor}
          border border-current border-opacity-20
          ${className}
        `}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Icon 
          className={`text-sm ${statusConfig.iconClass}`} 
          aria-hidden="true"
        />
        {(showFullMessage || saveStatus !== 'saved') && (
          <span className="font-medium">
            {statusConfig.text}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Hook for enhanced auto-save functionality with better user experience
 * @param {Function} saveFunction - Function to call for saving
 * @param {Object} data - Data to save
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} Auto-save utilities and status
 */
export const useEnhancedAutoSave = (saveFunction, data, delay = 1000) => {
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debounced save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId;
      return (dataToSave) => {
        clearTimeout(timeoutId);
        setSaveStatus('pending');
        setHasUnsavedChanges(true);
        
        timeoutId = setTimeout(async () => {
          try {
            setSaveStatus('saving');
            await saveFunction(dataToSave);
            setSaveStatus('saved');
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
          } catch (error) {
            setSaveStatus('error');
            console.error('Auto-save failed:', error);
            // Retry after 5 seconds
            setTimeout(() => {
              if (saveStatus === 'error') {
                debouncedSave(dataToSave);
              }
            }, 5000);
          }
        }, delay);
      };
    })(),
    [saveFunction, delay, saveStatus]
  );

  // Trigger save when data changes
  useEffect(() => {
    if (data) {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  // Manual save function
  const forceSave = useCallback(async () => {
    if (!data) return;
    
    try {
      setSaveStatus('saving');
      await saveFunction(data);
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  }, [data, saveFunction]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    saveStatus,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
    AutoSaveStatusComponent: (props) => (
      <AutoSaveStatus 
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        {...props}
      />
    )
  };
};

export default AutoSaveStatus;