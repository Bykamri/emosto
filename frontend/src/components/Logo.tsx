export function LogoMark({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 32" className={className} aria-hidden="true">
      <g fill="var(--margin)">
        <rect x="2.5" y="0" width="3" height="13" rx="1.5" />
        <rect x="2.5" y="15" width="3" height="9" rx="1.5" />
        <rect x="2.5" y="26" width="3" height="6" rx="1.5" />
      </g>
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="font-serif text-2xl leading-none font-semibold italic tracking-tight">
        Emosto
      </span>
    </span>
  )
}
