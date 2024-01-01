import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";
import { mixClass } from "class-lib";
import type { FeaturePhoneLayoutProps } from "@/ui/templates/FeaturePhoneLayout";

export const ConfirmLayout = ({
  backLinkContent = "No",
  children,
  ...props
}: FeaturePhoneLayoutProps) => {
  return (
    <FeaturePhoneLayout {...props} tip="" backLinkContent={backLinkContent}>
      <div
        className={mixClass(
          "text-white",
          "px-1 pt-9 text-xs",
          "cm-qvga:px-3 cm-qvga:pt-20 cm-qvga:text-2xl"
        )}
      >
        {children}
      </div>
    </FeaturePhoneLayout>
  );
};
