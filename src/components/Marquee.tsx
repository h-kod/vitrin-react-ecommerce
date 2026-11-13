/** Dekoratif kayan metin şeridi. Yalnız CSS; hover'da durur, reduced-motion'da statik kalır. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t, i) => (
        <li key={t} className={`font-display text-6xl font-semibold uppercase leading-none sm:text-8xl ${i % 2 ? "text-stroke" : ""}`}>
          {t}
          <span className="ml-10 text-accent">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-hidden className="marquee relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-line py-6">
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
