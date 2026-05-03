export const metadata = {
  title: "MjekOn Studio",
  description: "Content management for MjekOn",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", margin: 0, overflow: "hidden" }}>
      {children}
    </div>
  );
}
