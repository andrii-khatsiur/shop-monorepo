import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useBooleanParams<T extends string>(
  names: T[]
): Record<T, boolean | undefined> {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const result = {} as Record<T, boolean | undefined>;
    for (const name of names) {
      const value = searchParams.get(name);
      result[name] = value === null ? undefined : value === "true";
    }
    return result;
  }, [searchParams, names]);
}

export function useStringParams<T extends string>(
  names: T[]
): Record<T, string | undefined> {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const result = {} as Record<T, string | undefined>;
    for (const name of names) {
      result[name] = searchParams.get(name) || undefined;
    }
    return result;
  }, [searchParams, names]);
}
