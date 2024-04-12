import { mixClass } from "class-lib";
import { PageMaxWidth } from "@/conf/const";
import type { BaseCompInterface } from "@/types/BaseCompInterface";

interface MainProps extends BaseCompInterface {
  fixedLogo?: boolean;
  width?: string;
  height?: string;
  scrollbarVisible?: boolean;
}

export const Main = ({
  width = PageMaxWidth,
  height,
  children,
  className,
  scrollbarVisible,
  style,
}: MainProps) => {
  let inner;
  if (scrollbarVisible) {
    inner = (
      <div className={mixClass(width, "overflow-y-auto overflow-x-hidden outline-none")}>
        {children}
      </div>
    );
  } else {
    inner = (
      <div
        data-overflow
        aria-label="inner"
        className={mixClass(
          "min-w-[42rem] overflow-y-auto outline-none",
          height
        )}
      >
        <div className={width}>{children}</div>
      </div>
    );
  }
  return (
    <main
      className={mixClass(
        "relative",
        "flex flex-1 overflow-hidden outline-none",
        "bg-cm-gray-202",
        className,
        width
      )}
      style={style}
    >
      {inner}
    </main>
  );
};
