import { useMemo, useState } from "react";

export function useSearch<T>(items: T[], predicate: (item: T, query: string) => void) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return query.trim() ? items.filter((i) => predicate(i, query)) : items;
  }, [items, query]);

  return { query, setQuery, filtered };
}
