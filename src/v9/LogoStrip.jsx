// LogoStrip — the social-proof row from V11, below the hero: a short line of copy on the left
// and a slow marquee of customer logos on the right. Two copies of the list slide left by 50%
// over 48s (linear, CSS — off the main thread); the edges fade out; hovering or focusing the
// strip pauses it so a logo can be read. Logos are knocked to black at 50% and lift on hover.
// Reduced motion: no marquee — the logos wrap into a still, centred row.
import ducati from './logos/ducati.webp';
import bosch from './logos/bosch.webp';
import haier from './logos/haier.webp';
import philips from './logos/philips.webp';
import audi from './logos/audi.webp';
import pandg from './logos/pandg.webp';

const LOGOS = [
  { src: ducati, alt: 'Ducati' }, { src: bosch, alt: 'Bosch' }, { src: haier, alt: 'Haier' },
  { src: philips, alt: 'Philips' }, { src: audi, alt: 'Audi' }, { src: pandg, alt: 'P&G' },
];

const List = ({ copy }) => (
  <ul className={'lg-list' + (copy ? ' lg-copy' : '')} aria-hidden={copy || undefined}>
    {LOGOS.map(l => (
      <li key={l.alt} className="lg-slot"><img className="lg" src={l.src} alt={copy ? '' : l.alt} loading="lazy" /></li>
    ))}
  </ul>
);

export default function LogoStrip() {
  return (
    <section aria-labelledby="lg-title" className="relative px-4 sm:pl-[clamp(16px,4vw,48px)] sm:pr-0">
      <div className="mx-auto max-w-[1312px]">
        <div className="lg-row grid items-center gap-3 py-9 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10">
          <p id="lg-title" className="m-0 max-w-[17ch] text-[16px] leading-[1.45] text-ink-2">Trusted by 1,000+ brands worldwide.</p>
          <div className="lg-strip" tabIndex={0} role="region" aria-label="Customer logos, paused on hover or focus">
            <div className="lg-track">
              <List />
              <List copy />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
