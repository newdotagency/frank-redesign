// V19 title style for new sections (from the reference "Pieces that hold a room."): a label above the title.
// The title's face comes from v19.css (Figtree).
// V21.04: the label is a small pill instead of a hairline: all caps, light weight, lightly tracked, on a very
// light tint of its own text colour (so the same pill works on light sections and on the
// forest-green card, where the section passes a light text colour).

export const TITLE = 'font-serif font-normal tracking-[-0.03em]';

// The section subtitle: the line under a section title. One style everywhere (user rule, 2026-11-23), taken from the
// home page's "Set up an interview in seconds." (WhatIsFrank): Geist 18px, 20px from 640px, line height 1.45, warm
// grey. Callers add only spacing (mt-6 under the title), width and alignment; on a coloured panel they may swap
// the colour for one that keeps 4.5:1 contrast.
// SUBTITLE_SIZE is the same without the colour, for subtitles on dark panels (they add their own light colour).
export const SUBTITLE_SIZE = 'font-sans text-[18px] leading-[1.45] sm:text-[20px]';
export const SUBTITLE = SUBTITLE_SIZE + ' text-ink-2';

// align: 'center' (default) or 'start' for a left-aligned title. `line` is kept for the callers but no longer
// draws anything.
export function Eyebrow({ children, align = 'center', line, className = '' }) {
  return (
    <p className={'m-0 flex ' + (align === 'start' ? 'justify-start' : 'justify-center') + ' font-sans text-ink ' + className}>
      <span className="inline-flex h-8 items-center rounded-full px-3.5 text-[12.5px] font-light uppercase tracking-[0.08em] leading-none [background:color-mix(in_srgb,currentColor_2%,transparent)] [box-shadow:inset_0_0_0_1px_color-mix(in_srgb,currentColor_4.5%,transparent)]">
        {children}
      </span>
    </p>
  );
}
