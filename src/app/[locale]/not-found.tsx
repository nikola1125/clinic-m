import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bone)" }}
    >
      <p
        className="label-mono mb-6"
        style={{ color: "var(--muted)", letterSpacing: "0.12em" }}
      >
        404 · NOT IN THE REGISTRY
      </p>
      <h1
        className="font-heading text-center leading-none mb-10"
        style={{
          fontSize: "clamp(32px, 6vw, 72px)",
          color: "var(--ink)",
          maxWidth: 640,
        }}
      >
        This page has been discharged.
      </h1>
      <Link
        href="/"
        className="label-mono transition-opacity hover:opacity-60"
        style={{ color: "var(--muted)" }}
      >
        ← Return to the registry
      </Link>
    </div>
  );
}
