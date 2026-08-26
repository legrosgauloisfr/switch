export default function PhotoPlaceholder({
  src,
  alt = "",
  radius = 16,
  className = "",
}: {
  src?: string;
  alt?: string;
  radius?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={{ borderRadius: radius }}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      style={{
        borderRadius: radius,
        backgroundImage:
          "repeating-linear-gradient(135deg, #F1F0EC 0 7px, #E7E6E1 7px 14px)",
      }}
      className={`w-full h-full ${className}`}
    />
  );
}
