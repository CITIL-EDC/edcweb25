import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Set base path and asset prefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/edcweb25' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/edcweb25/' : '',
  
  // Ensure trailing slash is not added
  trailingSlash: false,
  
  // Enable experimental features for better static export
  experimental: {
    // Use experimental Turbopack only in development
    turbo: process.env.NODE_ENV === 'development' ? {} : undefined,
  },
};

export default nextConfig;
