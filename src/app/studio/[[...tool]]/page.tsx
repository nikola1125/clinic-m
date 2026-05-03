"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(
  () => import("./StudioClient"),
  { ssr: false, loading: () => <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Studio…</div> }
);

export default function StudioPage() {
  return <Studio />;
}
