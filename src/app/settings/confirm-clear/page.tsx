import { ConfirmLayout } from "@/ui/templates/ConfirmLayout";
import { _ } from "@/util/i18nUtil";

export default async function SettingsPage() {
  return (
    <ConfirmLayout backLinkContent={null}>
      {_("Your data will be erased.")}
    </ConfirmLayout>
  );
}
