import type { ReactNode } from "react";
import { SessionWrapper } from "@/components/SessionWrapper";
import { HeroBg } from "@/components/HeroBg";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <div className="relative min-h-screen">
        <HeroBg />
        <div className="relative z-10">{children}</div>
      </div>
    </SessionWrapper>
  );
}
