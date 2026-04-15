import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.18", "192.168.1.57"],
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
