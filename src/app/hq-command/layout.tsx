import type { ReactNode } from "react";
import { SessionWrapper } from "@/components/SessionWrapper";
import { HeroBg } from "@/components/HeroBg";

export default function HqCommandLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <div className="relative min-h-screen">
        <HeroBg />
        {children}
      </div>
    </SessionWrapper>
  );
}
