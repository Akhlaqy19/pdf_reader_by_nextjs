/** @type {import('next').NextConfig} */
const nextConfig = {
  // devIndicators: {
  //   buildActivity: false,
  // },

  devIndicators: {
    buildActivityPosition: "bottom-right",
  },

  // darkMode: "class",
  reactStrictMode: true,
  // غیرفعال کردن کش برای development
  // ...(process.env.NODE_ENV === 'development' && {
  //   onDemandEntries: {
  //     maxInactiveAge: 0,
  //     pagesBufferLength: 0,
  //   },
  // }),
  // experimental: {
  //   ...(process.env.NODE_ENV === 'development' && {
  //     isrMemoryCacheSize: 0, // غیرفعال کردن ISR cache
  //   }),
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lib.rafed.net",
        pathname: "/fonts/**",
      },
      {
        protocol: "https",
        hostname: "lib.rafed.net",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "lib.rafed.net",
        pathname: "/Books/**",
      },
    ],
  },
};

export default nextConfig;
