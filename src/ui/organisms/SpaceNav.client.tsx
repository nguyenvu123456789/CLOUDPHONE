"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { doc, win } from "win-doc";
import get from "get-object-value";
import { dispatchTip } from "@/ui/organisms/PageLink.client";
import SpaceNavLib from "@/util/spatial_navigation";

const handleSpaceNavFocus = () => {
  const activeElement = doc().activeElement;
  if (activeElement && activeElement !== doc().body) {
    return;
  }
  const hash = doc().location.hash;
  let bFocus = false;
  if (hash) {
    let el: HTMLElement | null = null;
    try {
      el = doc().querySelector(hash) as HTMLElement;
    } catch (e) {}
    if (el) {
      if (el.hasAttribute("title")) {
        dispatchTip({tip: el.title});
      }
      bFocus = true;
      el.focus();
      setTimeout(() => el?.focus(), 50);
    }
  }
  if (!bFocus) {
    SpaceNavLib.focusSection();
  }
};

export const SpaceNav = () => {
  const pathname = usePathname();
  const prev = useRef<any>({});
  if (prev.current.cur !== pathname) {
    prev.current.prev = prev.current.cur;
  }
  prev.current.cur = pathname;
  useEffect(() => {
    const moveToCustom = ({
      e,
      sibling,
    }: {
      e: CustomEvent;
      sibling: string;
    }) => {
      const sel = doc().querySelector("a:focus");
      const bNext = e.detail.hasNext();
      let nextItem;
      // Need always check nextItem, to avoid lastItem will jump to last two line.
      while (true) {
        nextItem = get(nextItem || sel, [sibling]) as HTMLElement;
        if (!nextItem || nextItem.clientWidth) {
          break;
        }
      }
      if (!bNext || !nextItem) {
        if (nextItem) {
          nextItem.focus();
        }
        return false; //avoid original focus
      }
    };

    SpaceNavLib.mount({
      selector: "a, .focusable",
      defaultElement: "[data-default=true]",
      events: {
        onWillfocus: (e: CustomEvent) => {
          const t = e.target as HTMLElement;
          if (t.id) {
            const newUrl = `#${t.id}`;
            win().history.replaceState(
              { ...win().history.state, as: newUrl, url: newUrl },
              "",
              newUrl
            );
          }
          if (t.hasAttribute("title")) {
            dispatchTip({tip: t.title});
          }
        },
        onWillmove: (e: CustomEvent) => {
          const { direction } = e.detail || {};
          switch (direction) {
            case "left":
              return moveToCustom({ e, sibling: "previousSibling" });
            case "right":
              return moveToCustom({ e, sibling: "nextSibling" });
          }
        },
      },
    });
    const handleState = () => {
      if ("/" === prev.current.cur) {
        win().open("", "_self")?.close();
      }
      handleSpaceNavFocus();
    };
    handleSpaceNavFocus();
    win().addEventListener("popstate", handleState);
    win().addEventListener("pageshow", handleSpaceNavFocus);
    return () => {
      win().removeEventListener("popstate", handleState);
      win().removeEventListener("pageshow", handleSpaceNavFocus);
      SpaceNavLib.unmount();
    };
  }, [pathname]);
  return null;
};
