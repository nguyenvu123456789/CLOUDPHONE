import "@/styles/globals.css";
import { SpaceNav } from "@/ui/organisms/SpaceNav.client";
import { roboto, noto } from "@/conf/fonts";
import { getCurLang, getCurLangDirection } from "@/util/i18nUtil";
import { SetLang } from "./SetLang.client";

export const metadata = {
  title: "Cloud Feature Phone",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const curLang = getCurLang();
  const curDirection = getCurLangDirection();
  return (
    <html
      lang={curLang}
      dir={curDirection}
      className={[roboto.variable, noto.variable].join(" ")}
    >
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className="h-full text-white">
        {children}
        <SpaceNav />
        <div
          className="-left-full -top-full hidden cm-qvga:absolute cm-qvga:block cm-qvga:w-full"
          id="qvga"
        />
      </body>
      <SetLang />
    </html>
  );
}
