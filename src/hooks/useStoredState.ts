import { useEffect, useState } from 'react';

export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError('');
    } catch {
      setStorageError(
        'This browser could not save your changes. They will last only for this session.',
      );
    }
  }, [key, value]);

  return [value, setValue, storageError] as const;
}
