export function LockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M6 12V7a6 6 0 0 1 12 0v5" />
      <rect x="2" y="12" width="20" height="14" rx="4" />
      <path d="M12 17v5" />
    </svg>
  );
}
