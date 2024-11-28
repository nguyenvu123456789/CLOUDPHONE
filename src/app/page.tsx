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
      <div>
        <h1 className="text-xl font-bold mb-4">Hello, there.</h1>
        {/* Button điều hướng */}
        <GotoLink
          href="/about"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to About Page
        </GotoLink>
      </div>
    </FeaturePhoneLayout>
  );
}

