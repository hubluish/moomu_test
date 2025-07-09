import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.pinimg.com",
      // 필요하다면 다른 외부 이미지 도메인도 추가
    ],
  },
  compiler: {
    styledComponents: true,
  },
};
module.exports = nextConfig;

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
