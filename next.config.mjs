/** @type {import('next').NextConfig} */

// Kiểm tra môi trường hoặc gán giá trị mặc định
const output = process?.env?.output || "export"; // Đặt mặc định là 'export'
const basePath = process?.env?.basePath || "/CLOUDPHONE"; // Gán đường dẫn phù hợp
const headers =
  output === "export"
    ? undefined // Không cần headers nếu output là 'export'
    : async () => {
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
      };

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  output, // Xuất output dạng 'export'
  basePath, // Đường dẫn gốc của ứng dụng
  headers, // Headers chỉ áp dụng nếu không phải 'export'
};

export default nextConfig;
