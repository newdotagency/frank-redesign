// Scenes for the "How it works" card (a StepVisual `scene`: { active, reduce }): the original page's visual for the
// step, standing in a white panel on the card's lime. It rises in when its step becomes active.
import { motion } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1];

export const imageScene = (src, alt = '') => function ImageScene({ active, reduce }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-[7%]">
      <motion.img src={src} alt={alt} loading="lazy" draggable={false}
        className="max-h-full max-w-full rounded-[18px] bg-white object-contain shadow-[0_26px_60px_-24px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.06]"
        initial={false}
        animate={active || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: active && !reduce ? 0.12 : 0 }} />
    </div>
  );
};
