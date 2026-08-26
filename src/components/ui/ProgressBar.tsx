export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-[3px] rounded-full bg-black/[0.08] overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
