import { useState, useEffect } from "react";

/**
 * Custom hook to debounce rapid value changes (e.g., keystrokes in search input).
 * Returns the debounced value after the specified delay.
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
