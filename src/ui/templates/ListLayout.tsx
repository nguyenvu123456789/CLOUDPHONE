import { mixClass } from "class-lib";
import { Item, List } from "@/components/molecule";
import { Link } from "@/components/Link";
import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";
import type { BaseCompInterface } from "@/types/BaseCompInterface";
import type { FeaturePhoneLayoutProps } from "@/ui/templates/FeaturePhoneLayout";

export const ListItem = ({ children, id, href }: BaseCompInterface) => {
  return (
    <Item
      component={<Link />}
      href={href}
      id={id}
      className={mixClass(
        "block cursor-pointer text-white outline-none focus:bg-cm-blue-05a focus:font-bold",
        "p-1 text-xs cm-qvga:p-1.5 cm-qvga:text-2xl"
      )}
    >
      {children}
    </Item>
  );
};

export const ListLayout = ({
  tip = "",
  children,
  ...props
}: FeaturePhoneLayoutProps) => {
  return (
    <FeaturePhoneLayout {...props} tip={tip}>
      <List>{children}</List>
    </FeaturePhoneLayout>
  );
};
