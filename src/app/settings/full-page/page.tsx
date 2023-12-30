import { FeaturePhoneContainer } from "@/ui/templates/FeaturePhoneContainer";
import { Main } from "@/ui/organisms/Main";

export default async function FullPage() {
  return (
    <FeaturePhoneContainer>
      <Main className="items-center text-center text-xs cm-qvga:text-2xl">
        Hello, full-page. 
      </Main>
    </FeaturePhoneContainer>
  );
}
