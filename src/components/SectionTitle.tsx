export default function SectionTitle({ eyebrow, title, desc, light }: { eyebrow: string; title: string; desc?: string; light?: boolean }) {
  return (
    <div className="mb-8 md:mb-12">
      <div className={`eyebrow ${light ? "text-white/50" : "text-muted"}`}>{eyebrow}</div>
      <h2 className={`headline text-3xl md:text-4xl mt-3 ${light ? "text-white" : ""}`}>{title}</h2>
      <span className="block h-0.5 w-12 bg-accent mt-5" />
      {desc && <p className={`mt-5 max-w-2xl leading-8 ${light ? "text-white/70" : "text-muted"}`}>{desc}</p>}
    </div>
  );
}
