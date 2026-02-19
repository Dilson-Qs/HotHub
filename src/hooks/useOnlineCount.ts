import { useState, useEffect } from 'react';

export const useOnlineCount = (baseCount: number = 85) => {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 20000) + 20000; // 20-40 seconds

    const updateCount = () => {
      setCount(prev => {
        // Random change between -5 and +8
        const change = Math.floor(Math.random() * 14) - 5;
        const newCount = prev + change;
        // Keep within reasonable bounds (60-120)
        return Math.max(60, Math.min(120, newCount));
      });
    };

    const scheduleUpdate = () => {
      const timeout = setTimeout(() => {
        updateCount();
        scheduleUpdate();
      }, getRandomInterval());
      return timeout;
    };

    const timeout = scheduleUpdate();
    return () => clearTimeout(timeout);
  }, []);

  return count;
};
