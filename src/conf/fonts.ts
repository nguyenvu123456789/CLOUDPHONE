import { Roboto, Noto_Sans_TC } from "next/font/google";

/**
 * Font loading strategy
 * https://nextjs.org/docs/messages/google-font-display
 * https://www.w3.org/TR/css-fonts-4/#font-display-desc
 */

export const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-roboto",
  display: "block",
});
export const noto = Noto_Sans_TC({
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-noto",
  preload: false,
  display: "swap",
});
