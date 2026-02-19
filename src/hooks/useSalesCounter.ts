import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hothub-sales-counters';
const GLOBAL_COUNTER_KEY = 'global';

interface SalesCounters {
  [key: string]: {
    count: number;
    lastUpdated: number;
  };
}

const getStoredCounters = (): SalesCounters => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveCounters = (counters: SalesCounters) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
};

// Generate believable base counts for products
const generateBaseCount = (productId: string): number => {
  // Use product ID to generate consistent but varied base counts
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 150 + (hash % 400); // Range: 150-549
};

export const useGlobalSalesCounter = (baseCount: number = 1240) => {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const counters = getStoredCounters();
    const globalData = counters[GLOBAL_COUNTER_KEY];

    if (globalData) {
      // Calculate additional sales since last visit (1 per minute away, capped)
      const minutesAway = Math.floor((Date.now() - globalData.lastUpdated) / 60000);
      const additionalSales = Math.min(minutesAway, 50); // Cap at 50 new sales
      setCount(globalData.count + additionalSales);
    } else {
      setCount(baseCount);
    }
  }, [baseCount]);

  useEffect(() => {
    // Random increment every 20-60 seconds
    const getRandomInterval = () => Math.floor(Math.random() * 40000) + 20000;

    const scheduleIncrement = () => {
      const timeout = setTimeout(() => {
        const increment = Math.floor(Math.random() * 5) + 1; // +1 to +5
        setCount(prev => {
          const newCount = prev + increment;
          const counters = getStoredCounters();
          counters[GLOBAL_COUNTER_KEY] = { count: newCount, lastUpdated: Date.now() };
          saveCounters(counters);
          return newCount;
        });
        scheduleIncrement();
      }, getRandomInterval());

      return timeout;
    };

    const timeout = scheduleIncrement();
    return () => clearTimeout(timeout);
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => {
      const counters = getStoredCounters();
      counters[GLOBAL_COUNTER_KEY] = { count, lastUpdated: Date.now() };
      saveCounters(counters);
    };
  }, [count]);

  return count;
};

export const useProductSalesCounter = (productId: string) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counters = getStoredCounters();
    const productData = counters[productId];

    if (productData) {
      // Small increment based on time away
      const minutesAway = Math.floor((Date.now() - productData.lastUpdated) / 60000);
      const additionalSales = Math.min(Math.floor(minutesAway / 5), 10); // 1 sale per 5 min, cap 10
      setCount(productData.count + additionalSales);
    } else {
      setCount(generateBaseCount(productId));
    }
  }, [productId]);

  useEffect(() => {
    // Slower increment for individual products: every 60-180 seconds
    const getRandomInterval = () => Math.floor(Math.random() * 120000) + 60000;

    const scheduleIncrement = () => {
      const timeout = setTimeout(() => {
        const increment = Math.floor(Math.random() * 3) + 1; // +1 to +3
        setCount(prev => {
          const newCount = prev + increment;
          const counters = getStoredCounters();
          counters[productId] = { count: newCount, lastUpdated: Date.now() };
          saveCounters(counters);
          return newCount;
        });
        scheduleIncrement();
      }, getRandomInterval());

      return timeout;
    };

    const timeout = scheduleIncrement();
    return () => clearTimeout(timeout);
  }, [productId]);

  return count;
};
