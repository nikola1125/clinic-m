"use client";

import Link from "next/link";
import { Activity, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="border-t border-foreground/5 py-16 lg:py-24"
      style={{ background: "var(--footer-bg)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-card">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Zenith<span className="text-primary">Health</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-6 text-foreground/50 max-w-xs">
              Providing world-class oncology care with a personal touch. Your
              health is our priority — from diagnosis to recovery.
            </p>
            <div className="mt-8 flex gap-4">
              {/* Twitter */}
              <Link
                href="#"
                className="text-foreground/40 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="#"
                className="text-foreground/40 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              {/* LinkedIn */}
              <Link
                href="#"
                className="text-foreground/40 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Tumor Surgery",
                "Follow-up Care",
                "Minimally Invasive",
                "Multidisciplinary Eval",
                "Book Appointment",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#services"
                    className="text-sm text-foreground/60 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Clinic
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Our Specialists",
                "Patient Stories",
                "About Zenith",
                "Careers",
                "Research",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#doctors"
                    className="text-sm text-foreground/60 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-sm text-foreground/60 transition-colors hover:text-primary">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+15550000000">+1 (555) 000-0000</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                contact@zenithhealth.com
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <span>
                  123 Medical Plaza,
                  <br />
                  Wellness City, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-foreground/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-foreground/40 text-center md:text-left">
            © {new Date().getFullYear()} Zenith Health Group. All medical
            services provided by licensed specialists.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-xs text-foreground/40 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-foreground/40 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-foreground/40 hover:text-primary transition-colors"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
