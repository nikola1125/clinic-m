import type { ReactNode } from "react";
import { SessionWrapper } from "@/components/SessionWrapper";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
