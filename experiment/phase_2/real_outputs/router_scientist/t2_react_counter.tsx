import { useState, useCallback } from 'react';

export interface UseCounterOptions {
  initialValue?: number;
}

export function useCounter(options: UseCounterOptions = {}) {
  const [count, setCount] = useState(options.initialValue ?? 0);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(options.initialValue ?? 0), [options.initialValue]);

  return { count, increment, decrement, reset };
}
