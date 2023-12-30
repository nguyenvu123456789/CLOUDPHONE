import "@/styles/globals.css";
import { SpaceNav } from "@/ui/organisms/SpaceNav.client";
import { roboto, noto } from "@/conf/fonts";
import { getCurLang, getCurLangDirection } from "@/util/i18nUtil";
import { SetLang } from "./SetLang.client";

export const metadata = {
  title: "Cloud Feature Phone",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const curLang = getCurLang();
  const curDirection = getCurLangDirection();
  return (
    <html lang={curLang} dir={curDirection} className={[roboto.variable, noto.variable].join(" ")}>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className="text-cm-gray-a">
        {children}
        <SpaceNav />
        <div className="-top-full -left-full hidden cm-qvga:absolute cm-qvga:block cm-qvga:w-full" id="qvga"/>
      </body>
      <SetLang />
    </html>
  );
}
