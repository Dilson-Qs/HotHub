import { useState, useEffect } from 'react';

const AGE_VERIFICATION_KEY = 'hothub_age_verified';

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (stored === null) {
      setIsVerified(null); // Never verified - show modal
    } else {
      setIsVerified(stored === 'true'); // true if verified, false if denied
    }
    setIsLoading(false);
  }, []);

  const verify = () => {
    localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    setIsVerified(true);
  };

  const deny = () => {
    setIsVerified(false);
  };

  const reset = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsVerified(null);
    setIsLoading(true);
  };

  return {
    isVerified,
    isLoading,
    verify,
    deny,
    reset
  };
};
