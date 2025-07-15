import { useEffect, useRef } from 'react';

export const useBackgroundTasks = (callback: () => void, interval: number = 5000) => {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<number | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Check if requestIdleCallback is available
    const supportsIdleCallback = 'requestIdleCallback' in window;

    const runTask = () => {
      if (supportsIdleCallback) {
        // Use requestIdleCallback for better performance
        requestIdleCallback(() => {
          callbackRef.current();
        });
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          callbackRef.current();
        }, 0);
      }
    };

    // Run task initially
    runTask();

    // Set up interval
    intervalRef.current = window.setInterval(runTask, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval]);
};