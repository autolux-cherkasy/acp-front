import { useState } from "react";

export function useDisclosure<T = true>() {
  const [data, setData] = useState<T | null>(null);

  return {
    isOpen: data !== null,
    data,
    open: (payload: T) => setData(payload),
    close: () => setData(null),
  };
}
