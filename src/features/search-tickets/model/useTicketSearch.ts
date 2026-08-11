import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Пошук виконує бекенд (search покриває № броні, прізвище й телефон),
 * тому тут лишається тільки поле вводу з дебаунсом.
 */
export function useTicketSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, debouncedQuery };
}
