import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import os from "os";

const withNextIntl = createNextIntlPlugin();

// Automatically collect every IPv4 address on this machine so HMR works
// from any device on any network (hotspot, LAN, VPN, WSL, etc.)
// without ever manually editing this list.
const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface?.family === "IPv4" && !iface.internal)
  .map((iface) => iface!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localIPs,
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
