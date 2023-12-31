import { Image } from "@/components/molecule";
import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";
import { _ } from "@/util/i18nUtil";
import { getAssetPath } from "@/util/getPath";

export default async function SettingsPage() {
  return (
    <FeaturePhoneLayout tip="">
      <div className="relative mx-1 my-2.5">
        <Image
          nextWidth={154}
          nextHeight={96}
          src={getAssetPath("logo.svg")}
          className="mx-auto block cm-qqvga:h-[3.125rem] cm-qqvga:w-[5.64rem]"
        />
      </div>
      <div className="px-1 text-cm-size-10 text-white cm-qvga:text-base">
        <div className="px-1 text-cm-size-10 text-white cm-qvga:text-base">
          {`(c) 2023-2024 YourCompany, ${_("All rights reserved.")}`}
        </div>
      </div>
    </FeaturePhoneLayout>
  );
}
