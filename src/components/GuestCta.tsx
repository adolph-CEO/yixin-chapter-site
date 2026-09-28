import { site } from "@/lib/content";

/** 給潛在來賓的轉換出口（受眾 A） */
export default function GuestCta() {
  const c = site.guestCta;
  return (
    <section className="bg-soft">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
        <div>
          <div className="eyebrow text-accent">For Guests</div>
          <h2 className="headline text-3xl md:text-5xl mt-4 leading-[1.25]">{c.title}</h2>
          <p className="mt-6 text-muted leading-8 max-w-xl">{c.note}</p>
        </div>
        <div className="md:text-right">
          <div className="text-sm text-muted leading-7 mb-6">
            {site.meeting.day}　{site.meeting.time}<br />{site.meeting.place}
          </div>
          <a href={c.url} className="inline-flex bg-indigo text-white px-8 py-4 text-sm font-bold tracking-[0.25em] hover:bg-accent transition">
            {c.buttonLabel} →
          </a>
        </div>
      </div>
    </section>
  );
}
