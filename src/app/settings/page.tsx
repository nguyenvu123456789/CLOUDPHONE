import { mixClass } from "class-lib";
import { Item, List } from "@/components/molecule";
import { Link } from "@/components/Link";
import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";
import { _ } from "@/util/i18nUtil";
import type { BaseCompInterface } from "@/types/BaseCompInterface";

const SettingItem = ({ children, id, href }: BaseCompInterface) => {
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

export default async function SettingsPage() {
  return (
    <FeaturePhoneLayout tip="">
      <List>
        <SettingItem id="clear_data" href="/settings/clear">
          {_("Clear Data")}
        </SettingItem>
        <SettingItem id="about" href="/settings/about">
          {_("About")}
        </SettingItem>
        <SettingItem id="about" href="/settings/full-page">
          Full Page 
        </SettingItem>
      </List>
    </FeaturePhoneLayout>
  );
}
