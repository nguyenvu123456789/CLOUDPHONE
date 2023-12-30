import { ConfirmComp } from "@/ui/organisms/ConfirmComp";
import { _ } from "@/util/i18nUtil";

export default async function SettingsPage() {
  return (
    <ConfirmComp backLinkContent={null}>
      {_("Your data will be erased.")}
    </ConfirmComp>
  );
}
