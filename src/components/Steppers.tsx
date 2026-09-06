import { BORDER, FAINT, MUTED, NAVY, StepIndex, STEPS } from "@/app/valuation/page";

export function Stepper({
  step,
  onJump,
  furthestUnlocked,
}: {
  step: StepIndex;
  onJump: (s: StepIndex) => void;
  furthestUnlocked: StepIndex;
}) {
  return (
    <ol className="mb-4 sm:mb-6 flex items-center overflow-x-auto">
      {STEPS.map((label, i) => {
        const idx = i as StepIndex;
        const done = idx < step;
        const active = idx === step;
        const locked = idx > furthestUnlocked;
        const isLast = i === STEPS.length - 1;
        return (
          <li key={label} className="flex flex-1 items-center min-w-0">
            <button
              type="button"
              disabled={locked}
              onClick={() => onJump(idx)}
              className={`flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-semibold transition sm:px-3 ${
                locked
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:opacity-90"
              }`}
              style={{
                backgroundColor: active ? NAVY : done ? "#24211c" : "#e8dfc8",
                color: active || done ? "white" : MUTED,
              }}
            >
              <span
                className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold"
                style={{
                  background: active
                    ? "rgba(255,255,255,0.2)"
                    : done
                      ? "rgba(255,255,255,0.15)"
                      : "#fff",
                  color: active || done ? "white" : FAINT,
                }}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="hidden sm:w-fit   sm:inline">{label}</span>
            </button>
            {!isLast && (
              <div
                className="mx-0.5 sm:mx-1 h-px w-2 sm:w-4 shrink-0"
                style={{ backgroundColor: BORDER }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}