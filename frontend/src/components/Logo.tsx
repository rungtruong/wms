// WMS Tailwind Logo — React + TailwindCSS
// Primary brand color: rgba(33,128,141,1) (#21808D)
// - <WMSLogo variant="mark" />: compact icon
// - <WMSLogo variant="full" tagline />: full lockup with tagline
// - <WMSLogo className="h-10" color="rgba(33,128,141,1)" /> to override color

export function WMSLogo({
  variant = "mark",
  className = "h-10 w-auto",
  color,
  tagline = false,
}: {
  variant?: "mark" | "full";
  className?: string;
  color?: string; // any CSS color
  tagline?: boolean;
}) {
  // Prefer CSS var if present; else fallback to prop; else default teal
  const brand = color || "var(--color-teal-500, rgba(33,128,141,1))";

  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={className}
        role="img"
        aria-label="WMS logo mark"
      >
        {/* Background rounded squircle */}
        <rect
          x="8"
          y="8"
          width="240"
          height="240"
          rx="56"
          style={{ fill: brand }}
        />
        {/* Stylized W M S monogram using paths */}
        <g
          fill="none"
          stroke="#fff"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* W */}
          <path d="M48 84l24 88 24-56 24 56 24-88" />
          {/* M */}
          <path d="M144 172l0-72 24 36 24-36 0 72" />
          {/* S (smooth curve) */}
          <path d="M208 96c-18-18-46-12-46 6 0 28 50 14 50 42 0 20-28 30-50 12" />
        </g>
      </svg>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`.replace(
        "h-",
        ""
      )}
    >
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-2">
          <span
            className="font-extrabold tracking-tight"
            style={{ color: brand, fontSize: "1.9em" }}
          >
            WMS
          </span>
          <span className="uppercase text-[0.70em] font-semibold tracking-[0.2em] text-neutral-500">
            v1
          </span>
        </div>
        {tagline && (
          <span className="text-neutral-500 text-[0.82em] mt-0.5">
            Warranty Management System
          </span>
        )}
      </div>
    </div>
  );
}
