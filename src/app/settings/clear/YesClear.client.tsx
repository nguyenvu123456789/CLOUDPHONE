"use client";
import { useEffect } from "react";
import { GotoLink } from "@/ui/organisms/PageLink.client";
import { useRouter } from "next/navigation";

const confirmClearUrl = "/settings/confirm-clear";

export const YesClear = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.prefetch(confirmClearUrl));
  }, []);
  const handleClick = () => {
    setTimeout(() => {
      console.log("Data is cleared.");
    }, 300);
    router.replace(confirmClearUrl);
  };
  return <GotoLink onClick={handleClick}>Yes</GotoLink>;
};
