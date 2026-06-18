import { useState, useCallback } from 'react';

export function useCounter(initialCount: number = 0) {
  const [count, setCount] = useState<number>(initialCount);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  return { count, increment, decrement, reset };
}

/*
The consensus view of state management in React promotes custom hooks to encapsulate component logic, ensuring reusability and clean separation of concerns. The strongest opposing view suggests that simple count states are better kept inline or managed via global state managers if the count must be synchronized across disparate parts of the UI, arguing that custom hooks add unnecessary abstraction layers for basic primitives. The business opportunity lies in building a visual hook builder that allows developers to design and generate custom React state and API integration hooks through a node-based interface. We can launch this product as a free developer tool on platforms like Product Hunt and developer subreddits to build initial usage. Monetization can be structured around team collaboration workspaces, version-controlled hook registries, and automated unit test generation for custom hooks. Scaling the SaaS will involve integrating with GitHub to scan repositories and automatically suggest custom hooks to replace duplicated state logic. Our opinion would change if standard React APIs introduced automatic state-sharing primitives that render custom hook wrappers obsolete.
*/
