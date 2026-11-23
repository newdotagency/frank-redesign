// VoiceOrb — DESIGN-2's "audio sphere" product visual, made Frank's: a soft violet/orange
// sphere (the only place the two sparks appear) with Frank's glasses in a white disc.
// It reacts to the composer: slow drift at rest, livelier while Frank listens, a gentle
// pulse while drafting. Reduced motion: static sphere, glasses still change expression.
import { motion } from 'framer-motion';
import FrankGlasses from '../components/FrankGlasses';

const SPHERE = [
  'radial-gradient(circle at 28% 30%, #ffb08f 0%, rgba(255,176,143,0) 42%)',
  'radial-gradient(circle at 72% 28%, #0447ff 0%, rgba(4,71,255,0) 52%)',
  'radial-gradient(circle at 62% 78%, #ff4704 0%, rgba(255,71,4,0) 50%)',
  'radial-gradient(circle at 30% 72%, #f6a8cf 0%, rgba(246,168,207,0) 55%)',
  'radial-gradient(circle at 50% 50%, #f4ddd6 0%, #efe3f4 100%)',
].join(',');

const CAPTION = {
  idle: 'Frank · ready to interview',
  listening: 'Listening…',
  drafting: 'Drafting your interview guide…',
  ready: 'Interview guide ready',
};

export default function VoiceOrb({ mode = 'idle', pose, react, reactKind, reduced, size = 220 }) {
  const lively = mode === 'listening' || mode === 'drafting';
  return (
    <figure className="flex flex-col items-center gap-4" aria-hidden="true">
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        {/* Sphere: soft edge via radial mask, so it has no hard rim */}
        <motion.div className="absolute inset-0 rounded-full"
          style={{ background: SPHERE, WebkitMaskImage: 'radial-gradient(circle, #000 64%, transparent 71%)', maskImage: 'radial-gradient(circle, #000 64%, transparent 71%)' }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: lively ? 9 : 26, ease: 'linear', repeat: Infinity }} />
        {/* Breath: the sphere swells a touch while Frank is listening or drafting */}
        <motion.div className="absolute inset-[6%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 62%)' }}
          animate={reduced ? undefined : (lively ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 })}
          transition={{ duration: mode === 'drafting' ? 1.2 : 2.4, ease: [0.45, 0, 0.55, 1], repeat: lively ? Infinity : 0 }} />
        {/* Centre disc with the glasses */}
        <div className="relative grid size-[68px] place-items-center rounded-full bg-egg" style={{ boxShadow: 'var(--shadow-subtle)' }}>
          <FrankGlasses pose={pose} ink="#000000" follow react={react} reactKind={reactKind} reducedMotion={reduced} className="w-[42px]" />
        </div>
      </div>
      <figcaption className="font-gmono text-[12px] leading-[1.6] text-smoke">{CAPTION[mode]}</figcaption>
    </figure>
  );
}
