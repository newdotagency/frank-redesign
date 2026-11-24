// Shared bits of the Product updates pages (the list and the update pages).
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { localize } from '../../lib/sitePaths';
import UPDATES from './updates.json';

export const SIGNUP = 'https://app.hifrank.ai/signup';
export const EASE = [0.23, 1, 0.32, 1];
export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
export const hrefOf = u => '/product-updates/' + u.slug;
export { UPDATES };

export function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// The ink button with its arrow in a circle (the other pages' pill).
export function Btn({ href, children, tone = 'ink' }) {
  const tones = {
    ink: ['bg-[#1a1714] text-white hover:bg-[#2a2622]', 'bg-white/[0.12]'],
    white: ['bg-white text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.08)] hover:bg-[#fafaf7]', 'bg-[#1a1714]/[0.07]'],
  }[tone];
  return (
    <a href={href} className={'group inline-flex h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ' + tones[0] + ' ' + FOCUS}>
      {children}
      <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5 ' + tones[1]}>
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </span>
    </a>
  );
}

// A date, e.g. "August 25, 2026".
export const Date_ = ({ children, className = '' }) => <time className={'font-sans text-[14px] tabular-nums text-ink-3 ' + className}>{children}</time>;

// **bold**, *italic*, `code` and [links](href) → React. Links to pages hosted here stay in the tab.
export function Inline({ x }) {
  const parts = String(x || '').split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-medium text-ink">{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="rounded-[5px] bg-[#1a1714]/[0.06] px-[5px] py-[1px] font-gmono text-[0.86em] text-ink">{p.slice(1, -1)}</code>;
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      const href = localize(m[2]);
      const here = href.startsWith('/') || href.startsWith('#');
      return <a key={i} href={href} {...(here ? {} : { target: '_blank', rel: 'noopener noreferrer' })} className="text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px] hover:decoration-ink">{m[1]}</a>;
    }
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}
