import { useCallback, useMemo, useRef, useEffect } from 'react';

interface PerformanceConfig {
  debounceDelay?: number;
  throttleDelay?: number;
  maxRenderTime?: number;
  enableVirtualization?: boolean;
  enableMemoization?: boolean;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    debounceDelay = 300,
    throttleDelay = 100,
    maxRenderTime = 16, // 60fps
    enableVirtualization = true,
    enableMemoization = true
  } = config;

  const renderStartTime = useRef<number>(0);
  const frameId = useRef<number>(0);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastCallTimes = useRef<Map<string, number>>(new Map());

  // Debounce function
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = debounceDelay,
    key: string = 'default'
  ): T => {
    return ((...args: Parameters<T>) => {
      const timeoutKey = `debounce_${key}`;
      const existingTimeout = timeoutRefs.current.get(timeoutKey);
      
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      const newTimeout = setTimeout(() => callback(...args), delay);
      timeoutRefs.current.set(timeoutKey, newTimeout);
    }) as T;
  }, [debounceDelay]);

  // Throttle function
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = throttleDelay,
    key: string = 'default'
  ): T => {
    return ((...args: Parameters<T>) => {
      const throttleKey = `throttle_${key}`;
      const lastCall = lastCallTimes.current.get(throttleKey) || 0;
      const now = Date.now();
      
      if (now - lastCall >= delay) {
        lastCallTimes.current.set(throttleKey, now);
        callback(...args);
      }
    }) as T;
  }, [throttleDelay]);

  // Performance monitoring
  const measureRender = useCallback((componentName: string) => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      if (renderTime > maxRenderTime) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [maxRenderTime]);

  // Memoization utilities
  const memoizedValue = useMemo(() => {
    if (!enableMemoization) return null;
    return new Map();
  }, [enableMemoization]);

  // Virtualization utilities
  const virtualizeList = useCallback((
    items: any[],
    containerHeight: number,
    itemHeight: number,
    scrollTop: number
  ) => {
    if (!enableVirtualization) return items;

    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );

    return {
      visibleItems: items.slice(visibleStart, visibleEnd + 1),
      startIndex: visibleStart,
      endIndex: visibleEnd,
      totalHeight: items.length * itemHeight,
      offsetY: visibleStart * itemHeight
    };
  }, [enableVirtualization]);

  // Memory optimization cleanup function
  const cleanupMemory = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    lastCallTimes.current.clear();
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }, []);

  // Collect performance metrics
  const collectPerformanceMetrics = useCallback(() => {
    const metrics = {
      renderTime: performance.now() - renderStartTime.current,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      timestamp: Date.now()
    };
    
    return metrics;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
      lastCallTimes.current.clear();
    };
  }, []);

  return {
    debounce,
    throttle,
    measureRender,
    virtualizeList,
    cleanupMemory,
    memoizedValue,
    collectPerformanceMetrics
  };
};

export default usePerformanceOptimization;