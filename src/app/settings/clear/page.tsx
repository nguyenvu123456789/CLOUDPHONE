import { YesClear } from "./YesClear.client";
import { ConfirmComp } from "@/ui/organisms/ConfirmComp";
import { _ } from "@/util/i18nUtil";

export default async function SettingsPage() {
  return (
    <ConfirmComp optionLink={<YesClear />}>
      {_("Are you sure to clear data?")}
    </ConfirmComp>
  );
}
