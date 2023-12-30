"use client";

import { useRef, forwardRef } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import callfunc from "call-func";
import type { BaseCompInterface } from "@/types/BaseCompInterface";

const isSiteLink = (href?: string) =>
  href && (0 === href.indexOf("/") || 0 === href.indexOf(location.origin));

export interface LinkInterface extends BaseCompInterface {
  href?: string;
  fast?: boolean;
  onClick?: Function;
}

export const Link = forwardRef(
  ({ href, fast, onClick, ...props }: LinkInterface, ref) => {
    const router = useRouter();
    const lastMove = useRef(false);
    const lastOnClick = useRef(onClick);
    lastOnClick.current = onClick;
    const nextHref = href || "";
    const nextProps: any = props;
    if (fast) {
      const onTouchMove = () => {
        lastMove.current = true;
      };
      const onTouchEnd = () => {
        if (isSiteLink(href)) {
          if (!lastMove.current) {
            router.push(nextHref);
          }
        }
        lastMove.current = false;
      };
      nextProps.onTouchMove = onTouchMove;
      nextProps.onTouchEnd = onTouchEnd;
    }
    const handleClick: React.MouseEventHandler = (e: React.MouseEvent) => {
      callfunc(lastOnClick.current, [e]);
    };
    return (
      <NextLink
        ref={ref}
        href={nextHref}
        onClick={handleClick}
        {...nextProps}
      />
    );
  }
);
