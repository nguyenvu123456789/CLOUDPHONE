import { ListLayout, ListItem } from "@/ui/templates/ListLayout";
import { _ } from "@/util/i18nUtil";

export default async function SettingsPage() {
  return (
    <ListLayout>
      <ListItem id="clear_data" href="/settings/clear">
        {_("Clear Data")}
      </ListItem>
      <ListItem id="about" href="/settings/about">
        {_("About")}
      </ListItem>
      <ListItem id="about" href="/settings/full-page">
        Full Page
      </ListItem>
    </ListLayout>
  );
}
