// BubbleRing — the glass bubble from motionsites.ai's "Human Machine" hero (their version is
// a video; this is CSS). It is mostly transparent, like a soap bubble:
//  • haze: a faint white glow inside, a touch brighter than the canvas;
//  • rim: a thin, blurred, iridescent ring in Frank's system colours — violet upper left,
//    brand green on the right and lower right, lilac on the left — slowly turning so the
//    colours drift around the edge;
//  • film: a second, wider and fainter ring turning the other way, so the edge shimmers and
//    looks slightly uneven, like a real bubble's film;
//  • gloss: a thin white edge for the glassy rim.
// The bubble breathes very slightly. Transform-only animation. Decorative, aria-hidden.
// Reduced motion: still.
export default function BubbleRing() {
  return (
    <div aria-hidden="true" className="v10-ring pointer-events-none absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 select-none">
      <div className="v10-ring-breathe absolute inset-0">
        <div className="v10-bubble-haze absolute inset-0 rounded-full" />
        <div className="v10-bubble-film absolute inset-0 rounded-full" />
        <div className="v10-bubble-rim absolute inset-0 rounded-full" />
        <div className="v10-bubble-gloss absolute inset-0 rounded-full" />
      </div>
    </div>
  );
}
