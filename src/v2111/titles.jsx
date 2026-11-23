// V19 title style for new sections (from the reference "Pieces that hold a room."): an eyebrow
// above the title — a short hairline, then a small, widely tracked all-caps label in warm grey.
// The title's face comes from v19.css (Figtree).

export const TITLE = 'font-serif font-normal tracking-[-0.03em]';

// The label is written in sentence case and set in caps by CSS, so screen readers say it normally.
// align: 'center' (default) or 'start' for a left-aligned title. line={false} drops the hairline.
export function Eyebrow({ children, align = 'center', line = true, className = '' }) {
  return (
    <p className={'m-0 flex items-center ' + (align === 'start' ? 'justify-start' : 'justify-center') + ' gap-4 font-sans text-[12px] font-normal uppercase leading-none tracking-[0.16em] text-ink-2 sm:gap-5 sm:text-[13px] ' + className}>
      {line && <span aria-hidden="true" className="h-px w-9 bg-current opacity-70 sm:w-12" />}
      {children}
    </p>
  );
}
