import type { ReactNode } from "react";

const NAVY   = "#1a2f4e";
const GOLD   = "#EBC044";
const BORDER = "#e2d9c5";
const MUTED  = "#4b5563";

interface SectionProps {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="rounded border bg-white" style={{ borderColor: BORDER }}>
      <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}>
        <div className="flex items-start gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold"
            style={{ background: "#fdf6dc", color: "#7a5c10", border: `1px solid ${GOLD}` }}
          >
            {number}
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold" style={{ color: NAVY }}>
              {title}
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: MUTED }}>
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
