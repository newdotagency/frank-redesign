// DockGlasses — Frank's glasses in a lime disc beside the docked chat bar (from V11): a light
// grain at the bottom of the disc, and the lenses blink slowly (CSS, .dg-lens in v9.css).
// Shown only on wide screens (.dock-glasses), decorative.
export default function DockGlasses() {
  return (
    <div aria-hidden="true" className="dock-glasses absolute bottom-0 right-[calc(100%+12px)] size-[58px] place-items-center overflow-hidden rounded-full border border-[rgba(26,23,20,0.10)] bg-[#d1f899] leading-none shadow-[0_1px_2px_rgba(26,23,20,0.04),0_6px_16px_-4px_rgba(26,23,20,0.06),0_28px_56px_-20px_rgba(64,44,24,0.16)]">
      <svg focusable="false" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.85] mix-blend-overlay"
        style={{ WebkitMaskImage: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 35%, transparent 75%)', maskImage: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 35%, transparent 75%)' }}>
        <filter id="dg-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.2" intercept="-0.6" /><feFuncG type="linear" slope="2.2" intercept="-0.6" />
            <feFuncB type="linear" slope="2.2" intercept="-0.6" /><feFuncA type="linear" slope="0" intercept="1" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#dg-grain)" />
      </svg>
      <svg viewBox="12 56 260 168" className="relative block h-auto w-[42px] overflow-visible">
        <g fill="none" stroke="#1a1714" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9">
          <path d="M61.44,150.49C57.76,150.7 55.47,154.76 55.33,158.57" />
          <path d="M227.34,151.03C229.31,151.16 229.43,153.48 228.64,155.72" />
          <g className="dg-lens">
            <path d="M61.44,150.49C61.69,129.68 78.6,112.27 99.51,111.7C120.62,111.38 137.78,128.3 137.76,149.38C137.75,170.59 120.37,187.91 99.02,188.03C77.88,188.25 61.19,171.42 61.44,150.49Z" />
            <path d="M152.28,149.43C152.25,128.36 169.29,111.62 190.13,112.14C210.61,112.9 227.08,130.36 227.34,151.03C227.6,171.83 211.38,188.48 190.67,188.19C169.6,188 152.31,170.63 152.28,149.43Z" />
          </g>
          <path d="M137.76,149.38C142.6,146.8 147.44,146.82 152.28,149.43" />
          <path d="M75.81,99.34C91.97,98.79 108.28,98.41 124.68,98.2" />
          <path d="M163.94,98.4C180.17,98.78 196.23,99.33 212.03,100.05" />
        </g>
      </svg>
    </div>
  );
}
