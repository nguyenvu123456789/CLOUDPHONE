import build from "reshow-build";
import { Main } from "@/ui/organisms/Main";
import { PageNav } from "@/ui/organisms/PageNav";
import { EnterTip } from "@/ui/organisms/PageLink.client";
import { PageLinkIconSize } from "@/conf/const";
import { FeaturePhoneContainer } from "@/ui/templates/FeaturePhoneContainer";
import { DefaultPageGoToBackLink } from "../organisms/DefaultPageGoToBackLink";
import type {
  BaseCompInterface,
  ChildrenType,
  ComponentType,
} from "@/types/BaseCompInterface";

export interface FeaturePhoneLayoutProps extends BaseCompInterface {
  body?: ChildrenType | ComponentType;
  stickyHeader?: ChildrenType | ComponentType;
  optionLink?: ChildrenType | ComponentType;
  backLink?: ChildrenType | ComponentType;
  enterLink?: ChildrenType | ComponentType;
  backLinkContent?: ChildrenType;
  tip?: ChildrenType | ComponentType;
  className?: string;
  scrollbarVisible?: boolean;
}

const DefaultOptionLink = () => <div className={PageLinkIconSize} />;

export const FeaturePhoneLayout = ({
  optionLink = DefaultOptionLink,
  backLink = DefaultPageGoToBackLink,
  enterLink = EnterTip,
  stickyHeader = null,
  tip,
  className,
  backLinkContent,
  children,
  scrollbarVisible,
}: FeaturePhoneLayoutProps) => {
  return (
    <FeaturePhoneContainer>
      {build(stickyHeader)()}
      <Main className={className} scrollbarVisible={scrollbarVisible}>
        {children}
      </Main>
      <PageNav>
        {build(optionLink)()}
        {build(enterLink)({ tip })}
        {build(backLink)(undefined, backLinkContent)}
      </PageNav>
    </FeaturePhoneContainer>
  );
};
