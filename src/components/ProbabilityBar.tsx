export default function ProbabilityBar({ p }: { p: number }) {
  const percent = Math.round(p * 100);

  return (
    <div className="w-full mt-1">
      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full relative"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, var(--accent), #7aff8a)"
          }}
        >
          <span
            className="absolute top-0 bottom-0 w-1/3 bg-white/30 blur-sm animate-shine"
            style={{ left: "-30%" }}
          />
        </div>
      </div>
      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{percent}% шанс</div>
    </div>
  );
}