interface Props {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  values,
  width = 80,
  height = 24,
  className,
}: Props) {
  if (values.length < 2) {
    return (
      <svg width={width} height={height} className={className}>
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </svg>
    );
  }
  const min = 0;
  const max = 100;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const y = height - ((v - min) / (max - min)) * height;
      return `${i * step},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = values[values.length - 1];
  const color =
    last >= 90
      ? "#10b981"
      : last >= 75
        ? "#84cc16"
        : last >= 60
          ? "#f59e0b"
          : last >= 40
            ? "#f97316"
            : "#f43f5e";
  return (
    <svg width={width} height={height} className={className}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </svg>
  );
}
