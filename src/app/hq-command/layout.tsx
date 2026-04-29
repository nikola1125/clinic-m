import type { ReactNode } from "react";
import { SessionWrapper } from "@/components/SessionWrapper";

export default function HqCommandLayout({ children }: { children: ReactNode }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
