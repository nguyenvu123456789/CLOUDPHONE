import { mixClass } from "class-lib";
import { BaseCompInterface } from "@/types/BaseCompInterface";
export const PageNav = ({ children }: BaseCompInterface) => (
  <footer
    dir="ltr"
    className={mixClass(
      "pointer-events-none box-border flex min-w-full px-1 py-0.5",
      "bg-black text-white",
      "min-h-[1.25rem] text-xs cm-qvga:min-h-[2.375rem] cm-qvga:text-2xl"
    )}
  >
    {children}
  </footer>
);
