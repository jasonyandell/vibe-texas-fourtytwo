import { useState, useEffect, useCallback } from 'react';

export interface UseReadyCountdownOptions {
  allPlayersReady: boolean;
  autoStartTimeout: number;
  isStarting: boolean;
  onAutoStart: () => Promise<void>;
}

export const useReadyCountdown = ({
  allPlayersReady,
  autoStartTimeout,
  isStarting,
  onAutoStart
}: UseReadyCountdownOptions) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleAutoStart = useCallback(async () => {
    if (allPlayersReady) {
      await onAutoStart();
    }
  }, [allPlayersReady, onAutoStart]);

  useEffect(() => {
    if (allPlayersReady && !isStarting) {
      setCountdown(autoStartTimeout);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            void handleAutoStart();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [allPlayersReady, autoStartTimeout, isStarting, handleAutoStart]);

  const cancelCountdown = () => setCountdown(null);

  return { countdown, cancelCountdown };
};