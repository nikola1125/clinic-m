import type { ReactNode } from "react";
import { SessionWrapper } from "@/components/SessionWrapper";

export default function MeetLayout({ children }: { children: ReactNode }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
