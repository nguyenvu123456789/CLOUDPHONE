"use client";
import { useEffect } from "react";
import { setCookie } from "get-cookie";
import { useRouter } from "next/navigation";
import { CLANG } from "@/conf/const";

export const SetLang = () => {
  const router = useRouter();
  useEffect(() => {
    const oUrl = new URL(document.URL);
    if (oUrl.search) {
      const oSearch = new URLSearchParams(oUrl.search);
      const intl = oSearch.get("intl");
      if (intl) {
        setCookie(CLANG, intl);
        setTimeout(() => router.refresh());
      }
    }
  }, []);
  return null;
};
