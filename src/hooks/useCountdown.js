import { useState, useCallback, useRef, useEffect } from 'react';

export const useCountdown = (initialValue = 5.5) => {
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef(null);

  const startCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setCountdown(initialValue);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newValue = prev - 0.1;
        if (newValue <= 0) {
          clearInterval(interval);
          countdownIntervalRef.current = null;
          return 0;
        }
        return Math.round(newValue * 10) / 10;
      });
    }, 100);

    countdownIntervalRef.current = interval;
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return { countdown, startCountdown };
};

