"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { API_BASE_URL } from "@/lib/api";

const SUBJECTS = [
  "General enquiry",
  "Patient support",
  "Press & media",
  "Medical information",
  "Partnership / B2B",
  "Privacy / data request",
  "Security vulnerability",
  "Billing",
];

const OFFICES = [
  {
    city: "Tiranë HQ",
    address: "Rruga Ismail Qemali 35\nTiranë 1001, Albania",
    email: "info@mjekon.com",
  },
  {
    city: "Berlin",
    address: "Friedrichstraße 68\n10117 Berlin, Germany",
    email: "eu@mjekon.com",
  },
];

const CONTACT_EMAILS = [
  { label: "PRESS", email: "press@mjekon.com" },
  { label: "MEDICAL", email: "medical@mjekon.com" },
  { label: "SECURITY", email: "security@mjekon.com" },
  { label: "DPO / PRIVACY", email: "privacy@mjekon.com" },
];

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus("sent");
    } catch (err: any) {
      setErrorMsg(err.message ?? "An error occurred. Please try email directly.");
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <section className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              CONTACT
            </p>
            <h1
              className="font-heading leading-none"
              style={{ fontSize: "clamp(32px,5vw,64px)", color: "var(--ink)" }}
            >
              Get in touch.
            </h1>
          </section>

          {/* Two columns: form + address */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0 py-12">

            {/* Form */}
            <div className="lg:pr-12 lg:border-r" style={{ borderColor: "var(--line)" }}>
              {status === "sent" ? (
                <div className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
                  <p className="label-mono mb-3" style={{ color: "var(--sage)" }}>
                    MESSAGE SENT
                  </p>
                  <p
                    className="text-[15px]"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                  >
                    Thank you, {name}. We will reply to {email} within one business day.
                  </p>
                  <button
                    onClick={() => {
                      setName(""); setEmail(""); setSubject(SUBJECTS[0]);
                      setMessage(""); setStatus("idle");
                    }}
                    className="label-mono mt-6 transition-opacity hover:opacity-60"
                    style={{ color: "var(--muted)" }}
                  >
                    ← Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* Name */}
                  <div>
                    <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
                      NAME *
                    </p>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arta Kelmendi"
                      className="w-full bg-transparent outline-none text-[15px] py-2"
                      style={{
                        borderBottom: "1px solid var(--ink)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
                      EMAIL *
                    </p>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arta@example.com"
                      className="w-full bg-transparent outline-none text-[15px] py-2"
                      style={{
                        borderBottom: "1px solid var(--ink)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
                      SUBJECT
                    </p>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-transparent outline-none text-[15px] py-2 label-mono cursor-pointer"
                      style={{
                        borderBottom: "1px solid var(--ink)",
                        color: "var(--ink)",
                        appearance: "none",
                      }}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ background: "var(--bone)" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
                      MESSAGE *
                    </p>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full bg-transparent outline-none text-[15px] py-2 resize-none"
                      style={{
                        borderBottom: "1px solid var(--ink)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div style={{ borderTop: "1px solid var(--oxblood)", paddingTop: "0.75rem" }}>
                      <p className="label-mono" style={{ color: "var(--oxblood)" }}>
                        {errorMsg}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="label-mono h-11 px-8 transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{
                        background: "var(--ink)",
                        color: "var(--bone)",
                        borderRadius: "var(--r)",
                      }}
                    >
                      {status === "sending" ? "Sending…" : "Send message →"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Address block */}
            <div className="lg:pl-12 pt-8 lg:pt-0 flex flex-col gap-8">
              {/* Offices */}
              {OFFICES.map((o) => (
                <div key={o.city} style={{ borderBottom: "1px solid var(--line)", paddingBottom: "1.5rem" }}>
                  <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
                    {o.city.toUpperCase()}
                  </p>
                  <p
                    className="text-[14px] leading-relaxed whitespace-pre-line mb-2"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                  >
                    {o.address}
                  </p>
                  <a
                    href={`mailto:${o.email}`}
                    className="label-mono transition-opacity hover:opacity-60"
                    style={{ color: "var(--muted)" }}
                  >
                    {o.email}
                  </a>
                </div>
              ))}

              {/* Direct emails */}
              <div>
                <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
                  DIRECT CONTACTS
                </p>
                <div className="flex flex-col gap-2">
                  {CONTACT_EMAILS.map(({ label, email }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="label-mono" style={{ color: "var(--muted)" }}>
                        {label}
                      </span>
                      <a
                        href={`mailto:${email}`}
                        className="label-mono transition-opacity hover:opacity-60"
                        style={{ color: "var(--ink)", fontSize: 10 }}
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
