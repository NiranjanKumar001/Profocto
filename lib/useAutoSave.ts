import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  data: any;
  interval?: number; // Auto-save interval in milliseconds (default: 60000 = 1 minute)
  debounceDelay?: number; // Debounce delay for changes (default: 2000ms)
  enabled?: boolean; // Whether auto-save is enabled
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  isUserActive: boolean;
  lastSaved: Date | null;
  triggerSave: () => Promise<void>;
}

export function useAutoSave({
  onSave,
  data,
  interval = 60000, // 1 minute
  debounceDelay = 2000, // 2 seconds
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const lastDataRef = useRef<string>('');
  const lastSavedDataRef = useRef<string>(''); // Track what was last saved to database
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();
  const isSavingRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Initialize with current data on mount to prevent initial save
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initialData = JSON.stringify(data);
      lastDataRef.current = initialData;
      lastSavedDataRef.current = initialData;
      isInitializedRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Track user activity (mouse move, keyboard, scroll, touch)
  useEffect(() => {
    const markUserActive = () => {
      setIsUserActive(true);
      
      // Clear existing timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      // Set user as inactive after 2 minutes of no activity
      activityTimeoutRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 120000); // 2 minutes
    };

    // Activity event listeners
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, markUserActive, { passive: true });
    });

    // Initial mark as active
    markUserActive();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, markUserActive);
      });
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // Trigger save function - only saves if data has actually changed
  const triggerSave = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    const currentData = JSON.stringify(data);
    
    // Skip save if current data is identical to last saved data
    if (currentData === lastSavedDataRef.current) {
      console.log('Auto-save skipped: No changes detected');
      hasUnsavedChangesRef.current = false;
      return;
    }

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      
      await onSave();
      
      // Update both refs after successful save
      setLastSaved(new Date());
      lastDataRef.current = currentData;
      lastSavedDataRef.current = currentData;
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't update lastSavedDataRef on failure so it retries
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [onSave, data, enabled]);

  // Debounced save on data changes
  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed from last check
    if (currentData === lastDataRef.current) {
      return;
    }

    // Update last data ref
    lastDataRef.current = currentData;

    // Check if data differs from last saved version
    if (currentData !== lastSavedDataRef.current) {
      hasUnsavedChangesRef.current = true;
    } else {
      hasUnsavedChangesRef.current = false;
      return; // No need to schedule save if already in sync with DB
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save - wait for user to stop typing
    saveTimeoutRef.current = setTimeout(() => {
      if (isUserActive && hasUnsavedChangesRef.current) {
        triggerSave();
      }
    }, debounceDelay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, enabled, isUserActive, debounceDelay, triggerSave]);

  // Auto-save interval (every minute if user is active and has unsaved changes)
  useEffect(() => {
    if (!enabled) return;

    autoSaveIntervalRef.current = setInterval(() => {
      // Only auto-save if:
      // 1. User is active
      // 2. There are unsaved changes
      // 3. Not currently saving
      if (isUserActive && hasUnsavedChangesRef.current && !isSavingRef.current) {
        triggerSave();
      }
    }, interval);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [enabled, interval, isUserActive, triggerSave]);

  // Save before page unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current && !isSavingRef.current) {
        // Trigger save synchronously
        triggerSave();
        
        // Show browser confirmation dialog
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [triggerSave]);

  return {
    isSaving,
    isUserActive,
    lastSaved,
    triggerSave,
  };
}
