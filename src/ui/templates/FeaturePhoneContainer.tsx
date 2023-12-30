import { PageMaxWidth } from "@/conf/const";
import { mixClass } from "class-lib";

export const FeaturePhoneContainer = (props: any) => (
  <section
    {...props}
    className={mixClass(
      "mx-auto flex max-h-40 min-h-[10rem] flex-col overflow-hidden cm-qvga:max-h-80 cm-qvga:min-h-[20rem]",
      PageMaxWidth,
      props.className
    )}
  />
);
