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

  // Debounce hook
  const useDebounce = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = debounceDelay
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]) as T;
  }, [debounceDelay]);

  // Throttle hook
  const useThrottle = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = throttleDelay
  ): T => {
    const lastCallRef = useRef<number>(0);

    return useCallback((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }, [callback, delay]) as T;
  }, [throttleDelay]);

  // Memoization hook
  const useMemoizedCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
  ): T => {
    return useMemo(() => callback, deps);
  }, []);

  // Performance monitoring
  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderTimer = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    if (renderTime > maxRenderTime) {
      console.warn(`⚠️ Slow render detected: ${renderTime.toFixed(2)}ms (target: ${maxRenderTime}ms)`);
    }
  }, [maxRenderTime]);

  // Virtual scrolling hook
  const useVirtualScrolling = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number,
    scrollTop: number
  ) => {
    return useMemo(() => {
      if (!enableVirtualization) {
        return {
          visibleItems: items,
          startIndex: 0,
          endIndex: items.length - 1,
          totalHeight: items.length * itemHeight
        };
      }

      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount + 1, items.length - 1);
      
      const visibleItems = items.slice(startIndex, endIndex + 1);
      const totalHeight = items.length * itemHeight;

      return {
        visibleItems,
        startIndex,
        endIndex,
        totalHeight
      };
    }, [items, itemHeight, containerHeight, scrollTop, enableVirtualization]);
  }, [enableVirtualization]);

  // Lazy loading hook
  const useLazyLoading = useCallback((
    loadMore: () => void,
    hasMore: boolean,
    threshold: number = 100
  ) => {
    const observerRef = useRef<IntersectionObserver>();

    const lastElementRef = useCallback((node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      }, { threshold });

      if (node) observerRef.current.observe(node);
    }, [loadMore, hasMore, threshold]);

    useEffect(() => {
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    return lastElementRef;
  }, []);

  // Image lazy loading
  const useLazyImage = useCallback((src: string, placeholder?: string) => {
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [src]);

    const handleLoad = () => {
      setIsLoaded(true);
      setIsError(false);
    };

    const handleError = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    return {
      ref: imgRef,
      src: imageSrc,
      isLoaded,
      isError,
      onLoad: handleLoad,
      onError: handleError
    };
  }, []);

  // Bundle splitting hook
  const useCodeSplitting = useCallback(<T>(
    importFn: () => Promise<T>,
    fallback?: React.ComponentType
  ) => {
    const [Component, setComponent] = useState<React.ComponentType | null>(fallback || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setIsLoading(true);
      setError(null);

      importFn()
        .then((module: any) => {
          setComponent(() => module.default || module);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }, [importFn]);

    return { Component, isLoading, error };
  }, []);

  // Memory optimization
  const useMemoryOptimization = useCallback(() => {
    const cleanupFunctions = useRef<Array<() => void>>([]);

    const addCleanup = useCallback((cleanup: () => void) => {
      cleanupFunctions.current.push(cleanup);
    }, []);

    const cleanup = useCallback(() => {
      cleanupFunctions.current.forEach(fn => fn());
      cleanupFunctions.current = [];
    }, []);

    useEffect(() => {
      return cleanup;
    }, [cleanup]);

    return { addCleanup, cleanup };
  }, []);

  // Performance metrics collection
  const collectPerformanceMetrics = useCallback(() => {
    const metrics = {
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      } : null
    };

    return metrics;
  }, []);

  // Web Workers hook
  const useWebWorker = useCallback(<T, R>(
    workerScript: string,
    onMessage?: (result: R) => void,
    onError?: (error: Error) => void
  ) => {
    const workerRef = useRef<Worker | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      try {
        workerRef.current = new Worker(workerScript);
        
        if (onMessage) {
          workerRef.current.onmessage = (e) => {
            onMessage(e.data);
            setIsLoading(false);
          };
        }

        if (onError) {
          workerRef.current.onerror = (error) => {
            onError(error);
            setIsLoading(false);
          };
        }
      } catch (error) {
        console.error('Failed to create worker:', error);
      }

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }, [workerScript, onMessage, onError]);

    const postMessage = useCallback((data: T) => {
      if (workerRef.current) {
        setIsLoading(true);
        workerRef.current.postMessage(data);
      }
    }, []);

    return { postMessage, isLoading };
  }, []);

  return {
    useDebounce,
    useThrottle,
    useMemoizedCallback,
    startRenderTimer,
    endRenderTimer,
    useVirtualScrolling,
    useLazyLoading,
    useLazyImage,
    useCodeSplitting,
    useMemoryOptimization,
    collectPerformanceMetrics,
    useWebWorker
  };
};

export default usePerformanceOptimization;
