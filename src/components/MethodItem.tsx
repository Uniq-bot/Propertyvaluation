const GOLD  = "#d6a936";
const TEXT  = "#10151f";
const MUTED = "#475569";

interface MethodItemProps {
  number: string;
  title: string;
  description: string;
}

export function MethodItem({ number, title, description }: MethodItemProps) {
  return (
    <div className="flex gap-3">
      <div className="font-mono text-sm font-bold" style={{ color: GOLD }}>
        {number}
      </div>
      <div>
        <p className="text-base font-semibold" style={{ color: TEXT }}>
          {title}
        </p>
        <p className="mt-0.5 text-sm leading-5" style={{ color: MUTED }}>
          {description}
        </p>
      </div>
    </div>
  );
}
