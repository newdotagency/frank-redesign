// Glasses — Frank's glasses from Homepage V5 (FrankGlasses, unchanged drawing) as the hero
// character: they turn toward the cursor and the frame shifts a few px with it, and blink
// now and then. Touch devices have no pointer to follow, so they idle with a slow blink.
// Reduced motion: still.
import { useEffect, useState } from 'react';
import FrankGlasses from '../components/FrankGlasses';

export default function Glasses({ pose, react, reactKind, reduced, className }) {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const on = () => setTouch(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    <FrankGlasses pose={pose} ink="#1a1714" react={react} reactKind={reactKind} reducedMotion={reduced}
      follow={!touch} shift={!touch} blink slowBlink={touch} className={className} />
  );
}
