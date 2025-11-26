/**
 * useThrottle 커스텀 훅
 * 함수 호출 빈도를 제한하여 성능 최적화
 */

import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRan = useRef<number>(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();

      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    }) as T,
    [callback, delay]
  );
}
