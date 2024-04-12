import { PageMaxWidth, PageMaxHeight } from "@/conf/const";
import { mixClass } from "class-lib";

export const FeaturePhoneContainer = (props: any) => (
  <section
    {...props}
    className={mixClass(
      "mx-auto flex flex-col overflow-hidden",
      PageMaxHeight,
      PageMaxWidth,
      props.className
    )}
  />
);
