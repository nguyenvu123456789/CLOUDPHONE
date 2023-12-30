import { Icon } from "@/components/molecule";
import { BackArrowIcon } from "@/components/Svg";
import { GotoBackLink } from "@/ui/organisms/PageLink.client";
import { PageLinkIconSize } from "@/conf/const";
import type { BaseCompInterface } from "@/types/BaseCompInterface";

export const DefaultPageGoToBackLink = ({ children }: BaseCompInterface) => {
  children = children || (
    <Icon className={`fill-white ${PageLinkIconSize}`}>
      <BackArrowIcon />
    </Icon>
  );
  return <GotoBackLink>{children}</GotoBackLink>;
};
