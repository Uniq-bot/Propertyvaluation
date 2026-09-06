import { BORDER, MUTED, NAVY } from "@/app/valuation/page";

export function StepCard({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg bg-white p-4 sm:p-5 md:p-7"
      style={{ borderColor: BORDER }}
    >
      <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold" style={{ color: NAVY }}>
        {title}
      </h2>
      {helper && (
        <p className="mt-1.5 text-xs sm:text-sm md:text-base" style={{ color: MUTED }}>
          {helper}
        </p>
      )}
      <div className="mt-4 sm:mt-6">{children}</div>
    </div>
  );
}