"use client";

import { useEffect, useState } from "react";

/**
 * Menunda pembaruan nilai selama `delayMs` milidetik untuk mencegah fetch berlebih
 * saat pengguna mengetik di kolom pencarian. Nilai string kosong diteruskan seketika
 * agar tombol reset filter langsung bereaksi.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const isCleared = typeof value === "string" && value === "";
    const timer = setTimeout(() => {
      setDebounced(value);
    }, isCleared ? 0 : delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
