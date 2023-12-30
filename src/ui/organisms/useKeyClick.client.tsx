"use client";
import { useEffect, useRef } from "react";
import { win } from "win-doc";
import callfunc from "call-func";

export const useKeyClick = (cb: Function) => {
  const hasKeyDown = useRef(false);
  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (!hasKeyDown.current) {
        return false;
      } else {
        hasKeyDown.current = false;
        callfunc(cb, [e]);
      }
    };
    const handleKeydown = () => {
      hasKeyDown.current = true;
    };
    win().addEventListener("keydown", handleKeydown);
    win().addEventListener("keyup", handleKeyup);
    return () => {
      win().removeEventListener("keydown", handleKeydown);
      win().removeEventListener("keyup", handleKeyup);
    };
  }, [cb]);
};
