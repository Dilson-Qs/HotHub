import { useEffect, useMemo, useState } from "react";

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isExpired: boolean;
}

type CountdownTarget = Date | string | null | undefined;

const toDate = (target: CountdownTarget): Date | null => {
  if (!target) return null;
  if (target instanceof Date) return target;
  const d = new Date(target);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getMidnight = () => {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight;
};

export const useCountdownTimer = (target?: CountdownTarget): CountdownTime => {
  const targetDate = useMemo(() => toDate(target) ?? getMidnight(), [target]);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: "00:00:00",
    isExpired: false,
  });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: "00:00:00",
          isExpired: true,
        } satisfies CountdownTime;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const formatted = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      return {
        hours,
        minutes,
        seconds,
        formatted,
        isExpired: false,
      } satisfies CountdownTime;
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
