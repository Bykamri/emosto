export function ParagraphStrip({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) {
    return <div aria-hidden="true" className="h-2 rounded-full bg-line" />
  }
  return (
    <div aria-hidden="true" className="flex h-2 gap-1">
      {paragraphs.map((p, i) => (
        <span
          key={i}
          className="min-w-2 rounded-full bg-margin"
          style={{ flexGrow: Math.max([...p].length, 20), flexBasis: 0 }}
        />
      ))}
    </div>
  )
}
