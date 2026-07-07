export function FlexSlotLogo({
  size = "md",
  showWordmark = false,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;

  return (
    <span className="flexslot-logo">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="32" height="32" rx="8" fill="#ea580c" />
        <rect x="6" y="12" width="7" height="8" rx="1.5" fill="white" fillOpacity="0.92" />
        <path
          d="M14 16h4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 16l2-2M18 16l2 2"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="19" y="12" width="7" height="8" rx="1.5" fill="white" fillOpacity="0.92" />
      </svg>
      {showWordmark ? (
        <span className="flexslot-wordmark">
          Flex<span className="flexslot-wordmark-accent">Slot</span>
        </span>
      ) : null}
    </span>
  );
}
