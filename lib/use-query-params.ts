"use client";

import { useEffect, useState } from "react";

/**
 * Reads URL query parameters once on mount. Used to pre-apply filters when a
 * dashboard KPI links to a list (e.g. /dashboard/defects?severity=critical)
 * without wrapping statically rendered pages in a Suspense boundary.
 */
export function useInitialQuery(): URLSearchParams | null {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on the client
    setParams(new URLSearchParams(window.location.search));
  }, []);
  return params;
}
