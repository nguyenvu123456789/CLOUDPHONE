import { FeaturePhoneContainer } from "@/ui/templates/FeaturePhoneContainer";
import { Main } from "@/ui/organisms/Main";
import type { FeaturePhoneLayoutProps } from "@/ui/templates/FeaturePhoneLayout";

export const FullPageLaout = ({
  children,
  className = "items-center text-center text-xs cm-qvga:text-2xl",
}: FeaturePhoneLayoutProps) => {
  return (
    <FeaturePhoneContainer>
      <Main className={className}>{children}</Main>
    </FeaturePhoneContainer>
  );
};
