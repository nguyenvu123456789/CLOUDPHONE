/** @type {import('next').NextConfig} */
const output = process?.env?.output || "standalone";
const headers = "export" === output ? undefined :async () => {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source:
          "/:path(.+\\.(?:ico|png|svg|jpg|jpeg|gif|webp|json|js|css|mp3|mp4|ttf|ttc|otf|woff|woff2)$)",
      },
    ];
  } 
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  output,
  headers,
};

export default nextConfig;
