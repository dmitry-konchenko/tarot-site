import type { NextConfig } from "next";

const nextConfig = {
  output: 'export', // для статического экспорта
  trailingSlash: true,
  images: {
    unoptimized: true, // если используете изображения
  },
}

module.exports = nextConfig
export default nextConfig;
