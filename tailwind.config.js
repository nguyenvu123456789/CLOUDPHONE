//@ts-check

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,cjs,mjs,cts,mts}"],
  theme: {
    screens: {
      // 480x640 
      "cm-vga": "30rem",
      // 240x320
      "cm-qvga": "15rem",
      // 128x160
      "cm-qqvga": { max: "8rem" },
    },
    fontFamily: {
      sans: ["Roboto", "var(--font-roboto)", "var(--font-noto)"],
    },
    // https://gitlab.cloudmosa.com/gitlab/engineers/longan/-/blob/next/tailwind.config.js
    extend: {
      // https://banc.digital/blog/typography-font-sizes-styles-formats
      fontSize: {
        "cm-size-10": ["0.625rem", "1.2"],
      },
      colors: {
        "cm-blue-009": "#0093e0",
        "cm-blue-1a7": "#1a73e8", // puffin new blue
        "cm-blue-b0e": "#b0e2fb",
        "cm-red-f43": "#f43030",
        "cm-red-f43-80": "rgba(244, 48, 48, 0.8)",
        "cm-red-d31": "#d3172a",
        "cm-red-ef9": "#ef9597",
        "cm-orange-f28": "#f28205",
        "cm-yellow-f2b": "#f2b911",
        "cm-green-3ac": "#3ac060",
        "cm-green-00a": "#00a539",
        "cm-green-95d": "#95d9a3",
        "cm-gray-323": "#323232",
        "cm-gray-323-50": "rgba(50, 50, 50, 0.5)",
        "cm-gray-505": "#505050",
        "cm-gray-888": "#888",
        "cm-gray-888-50": "rgba(136, 136, 136, 0.5)",
        "cm-gray-888-20": "rgba(136, 136, 136, 0.2)",
        "cm-gray-beb": "#bebebe",
        "cm-gray-f0f": "#f0f0f0",
        "cm-gray-202": "#202020",
        "cm-white-fff-90": "rgba(255, 255, 255, 0.9)",
        "cm-white-fff-50": "rgba(255, 255, 255, 0.5)",
      },
      boxShadow: {
        cm: "0 0 10px 0 rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
