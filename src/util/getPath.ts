"use client";

import { usePathname } from "next/navigation";

export const getPath = () => {
  const p = usePathname();
  return {
    isInMyApps: 0 === p.indexOf('/my-apps/')
  }
};
