// Custom hook for handling async operations
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

interface UseAsyncOptions {
  manual?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const { manual = false, onSuccess, onError } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const response = await asyncFunction();
      setState({ status: 'success', data: response, error: null });
      onSuccess?.(response);
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ status: 'error', data: null, error: err });
      onError?.(err);
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (!manual) {
      execute();
    }
  }, []);

  return { ...state, execute };
};
