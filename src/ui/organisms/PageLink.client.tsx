"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createReducer } from "reshow-flux-base";
import { useReturn } from "reshow-return";
import { usePrevious, useRefUpdate } from "reshow-hooks";
import callfunc, { getEventKey } from "call-func";
import { mixClass } from "class-lib";
import { useKeyClick } from "@/ui/organisms/useKeyClick.client";
import build from "reshow-build";
import type {
  BaseCompInterface,
  ChildrenType,
  ComponentType,
} from "@/types/BaseCompInterface";

const [tipStore, dispatchTip] = createReducer(
  (_state: object, action: { tip: ChildrenType | ComponentType }) => ({
    tip: action.tip,
  }),
  { tip: null }
);
export { dispatchTip };

interface PageLinkProps extends BaseCompInterface {
  autoBack?: boolean;
}

interface EnterProps extends BaseCompInterface {
  onEnter?: Function;
  tabIndex?: number;
}

export const GotoLink = ({
  children,
  className,
  href,
  autoBack,
  onClick,
}: PageLinkProps) => {
  const lastEl = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleClick = (e?: any) => {
    e?.preventDefault();
    callfunc(onClick);
    const href = lastEl.current?.getAttribute("data-href") as string;
    if (href) {
      router.push(href);
    } else if (autoBack) {
      router.back();
    }
  };
  const handleKey = (e: KeyboardEvent) => {
    switch (getEventKey(e)) {
      case 27:
      case "Escape":
        handleClick(e);
        break;
    }
  };
  useKeyClick(handleKey);
  return (
    <div
      ref={lastEl}
      data-href={href}
      className={mixClass(
        className,
        "pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
      )}
      tabIndex={-1}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export const GotoBackLink = ({ children }: BaseCompInterface) => {
  const router = useRouter();
  const handleClick = (e?: any) => {
    e.preventDefault();
    router.back();
  };
  const handleKey: EventListener = (e: Event) => {
    switch (getEventKey(e)) {
      case 8:
      case "Backspace":
        history.go(-1);
        break;
    }
  };
  useKeyClick(handleKey);
  return (
    <div
      className="pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
      tabIndex={-1}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export const useEnter = (onEnter?: Function) => {
  const lastOnEnter = useRefUpdate(onEnter);
  const handleEnter = (_e?: any) => {
    callfunc(lastOnEnter.current);
  };

  const handleKey: EventListener = (e: Event) => {
    switch (getEventKey(e)) {
      case 13:
      case "Enter":
        handleEnter(e);
        break;
    }
  };
  useKeyClick(handleKey);
  return handleEnter;
};

export const EnterLink = ({
  tabIndex = -1,
  children,
  className,
  onEnter,
}: EnterProps) => {
  const handleEnter = useEnter(onEnter);
  return (
    <div
      className={mixClass(
        className,
        "relative grow overflow-hidden whitespace-nowrap text-center font-bold"
      )}
      onClick={handleEnter}
      tabIndex={tabIndex}
    >
      {children}
    </div>
  );
};

export const EnterTip = ({ tip }: { tip?: ChildrenType | ComponentType }) => {
  const state = useReturn(["tip"], tipStore);
  const preTip = usePrevious(tip);
  if (preTip !== tip) {
    dispatchTip({ tip });
    state.tip = tip;
  }
  return <EnterLink>{build(state.tip)()}</EnterLink>;
};
