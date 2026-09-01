"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire-and-forget — never block rendering
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", page: pathname }),
    }).catch(() => {});
  }, [pathname]);
}
