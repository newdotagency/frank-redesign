// BrandMarquee (V21.04): the "Trusted by" logo row. From 640px up: the quiet wrapped row. On phones: one line of logos sliding by slowly
// (the list is doubled and shifted by half, so it loops seamlessly; edges fade). Reduced motion: the row stays still and scrolls by hand.
export default function BrandMarquee({ brands, logos }) {
  const Item = ({ b: [name, key, h], hide }) => (
    <li className="flex shrink-0 items-center" aria-hidden={hide || undefined}>
      {!hide && <span className="sr-only">{name}</span>}
      <span aria-hidden="true" className="flex items-center [&>svg]:h-full [&>svg]:w-auto" style={{ height: h }} dangerouslySetInnerHTML={{ __html: logos[key] }} />
    </li>
  );
  return (
    <>
      <ul className="m-0 mt-8 hidden list-none flex-wrap items-center justify-center gap-x-14 gap-y-6 p-0 text-[#a39d93] sm:flex">
        {brands.map((b) => <Item key={b[1]} b={b} />)}
      </ul>
      <div className="brand-marquee -mx-4 mt-8 overflow-hidden text-[#a39d93] sm:hidden">
        <ul className="brand-marquee-track m-0 flex w-max list-none items-center gap-12 p-0 pr-12">
          {brands.map((b) => <Item key={b[1]} b={b} />)}
          {brands.map((b) => <Item key={b[1] + '2'} b={b} hide />)}
        </ul>
      </div>
    </>
  );
}
