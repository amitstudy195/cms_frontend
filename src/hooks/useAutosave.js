import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to autosave data to local storage.
 * Runs on a specified interval (default 30 seconds) and only writes if the state is dirty.
 */
export const useAutosave = (data, key = "", delay = 30000) => {
  const [lastSaved, setLastSaved] = useState(null);
  const dataRef = useRef(data);
  const isDirtyRef = useRef(false);

  // Track changes to form data and flag as dirty
  useEffect(() => {
    const isInitialLoad = !dataRef.current || (Object.keys(dataRef.current).every(k => !dataRef.current[k]));
    
    if (!isInitialLoad && JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
      isDirtyRef.current = true;
    }
    dataRef.current = data;
  }, [data]);

  // Set interval timer
  useEffect(() => {
    if (!key) return;

    // Check every interval and save if dirty
    const interval = setInterval(() => {
      if (isDirtyRef.current) {
        localStorage.setItem(key, JSON.stringify(dataRef.current));
        isDirtyRef.current = false;
        
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay, key]);

  // Helper to force manual save
  const forceSave = () => {
    if (key && dataRef.current) {
      localStorage.setItem(key, JSON.stringify(dataRef.current));
      isDirtyRef.current = false;
      const now = new Date();
      setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  return { lastSaved, isDirty: isDirtyRef.current, forceSave };
};

export default useAutosave;
