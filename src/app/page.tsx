import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";
import { GotoLink } from "@/ui/organisms/PageLink.client";
import { Icon } from "@/components/molecule";
import { HamburgerIcon } from "@/components/Svg";

export default async function HomePage() {
  return (
    <FeaturePhoneLayout
      className="text-center items-center text-xs cm-qvga:text-2xl"
      optionLink={
        <GotoLink href="/settings">
          <Icon className="h-4 w-4 fill-white cm-qvga:h-6 cm-qvga:w-6">
            <HamburgerIcon />
          </Icon>
        </GotoLink>
      }
    >
      Hello, there.
    </FeaturePhoneLayout>
  );
}
