export default function ScreenScroll({
  children,
  withTabBar = false,
  topPad = "66px",
  className = "",
}: {
  children: React.ReactNode;
  withTabBar?: boolean;
  topPad?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex-1 overflow-y-auto px-[22px] ${className}`}
      style={{ paddingTop: topPad, paddingBottom: withTabBar ? "108px" : "40px" }}
    >
      {children}
    </div>
  );
}
