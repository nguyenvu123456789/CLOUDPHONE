import { FeaturePhoneLayout } from "@/ui/templates/FeaturePhoneLayout";

export default function AboutPage() {
  return (
    <FeaturePhoneLayout className="text-center items-center text-xs cm-qvga:text-2xl">
      <h1 className="text-xl font-bold mb-4">About Page</h1>
      <p className="text-gray-700">
        This is the About Page. You navigated here by clicking the button on the Home Page.
      </p>
    </FeaturePhoneLayout>
  );
}
