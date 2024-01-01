import { YesClear } from "./YesClear.client";
import { ConfirmLayout } from "@/ui/templates/ConfirmLayout";
import { _ } from "@/util/i18nUtil";

export default async function SettingsPage() {
  return (
    <ConfirmLayout optionLink={<YesClear />}>
      {_("Are you sure to clear data?")}
    </ConfirmLayout>
  );
}
