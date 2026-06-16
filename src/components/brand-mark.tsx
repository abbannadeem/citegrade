/**
 * Citegrade brand mark — a miniature instrument readout: an ink chip with two
 * stacked bars, the lower one in signal-lime. Replaces the generic sparkle.
 */
export function BrandMark({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="22" height="22" rx="5.5" fill="#15141A" />
      <line
        x1="6.5"
        y1="9"
        x2="17.5"
        y2="9"
        stroke="#FFFFFF"
        strokeOpacity="0.32"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="6.5"
        y1="15"
        x2="14.5"
        y2="15"
        stroke="#C6F24E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
