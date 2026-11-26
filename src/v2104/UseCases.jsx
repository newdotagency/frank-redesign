// UseCases (V21.04) — "One interviewer. Every use case that matters." The eleven interview templates, to the
// point, without ever listing all of them at once. On the left a short vertical wheel: five templates at a
// time, the chosen one in a fixed band in the middle (in ink, its small Figma icon in its own colours,
// Template-Icons node 2113:9800, and its fine line filling toward the next), two faded above and two below.
// Moving on slides the whole list up through the band, like a picker; clicking a faded row, the back / next
// (left / right) buttons or the arrow keys move it too. On the right, the white panel: the problem as you'd say it, what
// Frank finds out, and one button that types its question into the chat at the bottom of the screen.
// The wheel moves on by itself every 6 s while it's on screen (1024px and up); hovering or focusing the
// section pauses it, reduced motion turns it off and swaps the slide for a crossfade. Below 1024px the
// panel sits under the wheel and only a tap moves it.
// Entrance (reveal.jsx): the heading as in the other sections, then the wheel and panel rise in.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PlaybookIcon from '../components/PlaybookIcon';
import { TEMPLATE_ICONS } from '../data/templateIcons';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle } from './reveal';

// The eleven interview templates (also read by the Churn page's templates section and, by id, the header menu). problem: what you'd say (a \n starts a new line in the panel); learn: what Frank finds out; prompt: what
// "Start with this" types into the chat.
export const CASES = [
  { id: 'churn', name: 'Churn reasons', problem: 'Customers are cancelling.',
    learn: 'What led to cancellation, which expectations went unmet, and what customers will do instead.',
    prompt: 'Why are customers cancelling, and what will they do instead?' },
  { id: 'activation', name: 'Activation barriers', problem: 'People sign up but never really get started.',
    learn: 'What customers hoped to accomplish and what prevented their first useful result.',
    prompt: 'What stops new sign-ups from getting their first useful result?' },
  { id: 'trial', name: 'Trial conversion', problem: 'People try the product but don’t become paying customers.',
    learn: 'Whether they experienced enough value, what remained unresolved, and why they didn’t purchase.',
    prompt: 'Why don’t trial users become paying customers?' },
  { id: 'adoption', name: 'Feature adoption', problem: 'We built this feature, but people aren’t using it as expected.',
    learn: 'Whether customers know about it, need it, and can use it successfully, and what makes them continue or stop.',
    prompt: 'Why aren’t people using our new feature as expected?' },
  { id: 'funnel', name: 'Funnel drop-off', problem: 'People start a process but don’t finish it.',
    learn: 'What happened at a specific step, what people expected, and why they stopped. Applies to any workflow.',
    prompt: 'Why do people start our sign-up flow but not finish it?' },
  { id: 'engagement', name: 'Declining engagement', problem: 'Previously active customers are using the product less.',
    learn: 'What changed in their needs or experience, and whether another solution or workaround took over.',
    prompt: 'Why are previously active customers using the product less?' },
  { id: 'upgrade', name: 'Upgrade barriers', problem: 'Customers keep using their current plan but don’t upgrade.',
    learn: 'Whether they need additional capabilities and what prevents them from choosing a higher plan.',
    prompt: 'What stops customers on their current plan from upgrading?' },
  { id: 'requests', name: 'Feature request discovery', problem: 'We receive feature requests, but aren’t sure which problems deserve investment.',
    learn: 'The underlying problem, current workarounds, how often it occurs, and its consequences.',
    prompt: 'Which problems behind our feature requests deserve investment?' },
  { id: 'value', name: 'Customer value drivers', problem: 'Some customers keep coming back.\nWhat makes the product valuable to them?',
    learn: 'Which workflows and outcomes matter most, and why customers continue choosing the product.',
    prompt: 'What makes the product valuable to customers who keep coming back?' },
  { id: 'checkout', name: 'Checkout abandonment', problem: 'People reach checkout but don’t complete payment.',
    learn: 'What interrupted the purchase, from unresolved doubts and unexpected costs to payment friction.',
    prompt: 'Why do people reach checkout but not complete payment?' },
  { id: 'downgrade', name: 'Downgrade reasons', problem: 'Customers are moving to cheaper plans or reducing seats.',
    learn: 'Whether their needs, budgets, team usage, or perception of value changed.',
    prompt: 'Why are customers moving to cheaper plans or reducing seats?' },
];

const EVERY_MS = 6000;
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

// The template's icon in a tile; `size` is the tile's side in px. Each template has its own colours (its
// Figma Template-Icons fill and glyph) when chosen; the rest are grey on a pale tile.
function Icon({ id, size, on = true }) {
  const ic = TEMPLATE_ICONS[id];
  return (
    <span aria-hidden="true" className="grid shrink-0 place-items-center transition-[background-color,color] duration-300"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: on ? ic.bg : 'rgba(26,23,20,0.05)', color: on ? ic.fg : 'rgba(26,23,20,0.45)' }}>
      <span className="grid place-items-center" style={{ transform: `scale(${size / 30})` }}><PlaybookIcon p={{ id }} box={16} /></span>
    </span>
  );
}

// What the chosen template is for: the problem, what Frank finds out, and the button. `big` is the
// side panel (1024px and up), otherwise it opens inside the row.
function Detail({ c, onUse, big, href, kit }) {
  return (
    <div className="flex h-full flex-col">
      {(!kit || kit.labels.a) && <p className="m-0 font-sans text-[13px] text-ink-3">{kit ? kit.labels.a : 'The problem'}</p>}
      <p className={'m-0 mt-2 font-sans font-medium tracking-[-0.02em] text-ink [text-wrap:balance] [white-space:pre-line] ' + (big ? 'text-[clamp(22px,2.15vw,30px)] leading-[1.15]' : 'text-[22px] leading-[1.2]')}>
        {c.problem}
      </p>
      {c.learn && <>
        <p className={'m-0 font-sans text-[13px] text-ink-3 ' + (big ? 'mt-8' : 'mt-5')}>{kit ? kit.labels.b : 'Frank finds out'}</p>
        <p className={'m-0 mt-2 max-w-[46ch] font-sans leading-[1.5] text-ink-2 ' + (big ? 'mb-10 text-[18px]' : 'mb-6 text-[16px]')}>{c.learn}</p>
      </>}
      {!c.learn && <span className={big ? 'mb-10' : 'mb-6'} />}
      {/* Types the template's question into the chat (home page), or, with `href` (other pages, which have no chat),
          a link; the arrow sits in its own circle. */}
      {(() => {
        const to = c.href || href; // a case can carry its own link (the Roles pages' use cases)
        const Tag = to ? 'a' : 'button';
        const act = to ? { href: to } : { type: 'button', onClick: () => onUse(c) };
        return (
          <Tag {...act}
            className={'group inline-flex h-12 cursor-pointer items-center gap-3 self-start rounded-full border-0 bg-black py-1.5 pl-5 pr-1.5 font-sans text-[15px] text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#262626] active:scale-[0.98] ' + FOCUS + ' mt-auto'}>
            {kit ? kit.labels.cta : 'Start with this template'}
            <span className="grid size-9 place-items-center rounded-full bg-white/[0.14] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-px group-hover:translate-x-0.5">
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </span>
          </Tag>
        );
      })()}
    </div>
  );
}

const N = CASES.length;
const ROW = 64;     // px per row in the wheel
const SHOW = 2;     // rows visible above and below the chosen one

// The wheel. Each visible row sits at its offset from the chosen one (-2…2); rows slide when the choice
// changes, new ones come in from the edge the list is moving toward. dir: +1 forward, -1 back.
function Wheel({ list, at, dir, go, live, reduce, wide, kit }) {
  const n = list.length;
  const show = n < 5 ? 1 : SHOW; // fewer than five templates: one row each side, so no template shows twice
  const y = o => `translateY(${(o + show) * ROW}px)`;
  const rows = Array.from({ length: show * 2 + 1 }, (_, k) => k - show).map(o => ({ o, x: list[(at + o + n) % n] }));
  return (
    <div className="relative" style={{ height: ROW * (show * 2 + 1) }}
      onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}>
      {/* The band the chosen row sits in: a hairline above, and below it the line that fills toward the next. */}
      <span aria-hidden="true" className="absolute inset-x-0 h-px bg-[#1a1714]/[0.07]" style={{ top: show * ROW }} />
      <span aria-hidden="true" className="absolute inset-x-0 h-[1.5px] overflow-hidden bg-[#1a1714]/[0.07]" style={{ top: (show + 1) * ROW - 1 }}>
        {!reduce && wide && (
          <span key={at} className="ts-fill absolute inset-0 origin-left"
            style={{ background: kit ? kit.color(list[at]) : TEMPLATE_ICONS[list[at].id].fg, animationDuration: `${EVERY_MS}ms`, animationPlayState: live ? 'running' : 'paused' }} />
        )}
      </span>
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_24%,#000_76%,transparent)]">
        <AnimatePresence initial={false} custom={dir}>
          {rows.map(({ o, x }) => {
            const on = o === 0;
            return (
              <motion.button key={x.id} type="button" custom={dir} tabIndex={on ? 0 : -1}
                aria-current={on} aria-label={on ? x.name : `Show ${x.name}`}
                onClick={() => go(o)}
                variants={{
                  enter: d => ({ transform: reduce ? y(o) : y(d > 0 ? show + 1 : -show - 1), opacity: 0 }),
                  at: { transform: y(o), opacity: on ? 1 : Math.abs(o) === 1 ? 0.55 : 0.28 },
                  exit: d => ({ transform: reduce ? y(o) : y(d > 0 ? -show - 1 : show + 1), opacity: 0 }),
                }}
                initial="enter" animate="at" exit="exit"
                transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
                style={{ height: ROW }}
                className={'absolute inset-x-0 top-0 flex cursor-pointer items-center gap-4 border-0 bg-transparent px-0 text-left font-sans text-[18px] tracking-[-0.01em] sm:text-[20px] ' + FOCUS + ' ' + (on ? 'text-ink' : 'text-ink-3 hover:text-ink-2')}>
                {kit ? kit.icon(x, 32, on) : <Icon id={x.id} size={32} on={on} />}
                <span className="min-w-0 flex-1 truncate">{x.name}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ROUND = 'grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink ring-1 ring-inset ring-[#1a1714]/[0.12] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#f4f2ec] active:scale-[0.96] ' + FOCUS;

// What the panel shows for one template: its icon and name, then the detail.
const PanelBody = ({ c, wide, onUse, href, kit }) => (
  <div className="flex h-full flex-col">
    <div className="mb-7 flex items-center gap-4 lg:mb-8">
      {kit ? kit.icon(c, wide ? 56 : 44, true) : <Icon id={c.id} size={wide ? 56 : 44} />}
      <p className="m-0 font-sans text-[17px] text-ink">{c.name}</p>
    </div>
    <div className="flex flex-1 flex-col [&>div]:flex-1"><Detail c={c} onUse={onUse} big={wide} href={href} kit={kit} /></div>
  </div>
);

// Opt-in props for other pages (the home page passes only onUse, so it is unchanged):
//   head: { eyebrow, lines, sub, titleId, titleClass } replaces the heading (sub: null hides the subtitle);
//   exclude: template ids to leave out; href: the button's link (no chat on that page); sectionClass: the
//   section's spacing.
//   kit (feature pages): { cases: [{ id, name, problem, learn? }], icon(c, size, on), color(c), labels: { a, b, cta } } swaps the
//   templates, their icons and the panel's labels (a: null hides the small label, no `learn` hides the second text).
export default function UseCases({ onUse, head = null, exclude = null, href = null, sectionClass = null, kit = null }) {
  const list = kit ? kit.cases : exclude ? CASES.filter(x => !exclude.includes(x.id)) : CASES;
  const N = list.length;
  const titleId = head?.titleId || 'uc-title';
  const reduce = !!useReducedMotion();
  const [{ at, dir }, setState] = useState({ at: 0, dir: 1 });
  const go = d => { if (d) setState(st => ({ at: (st.at + d + N) % N, dir: Math.sign(d) })); };
  const [hold, setHold] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  // Only with the side panel (1024px and up): below that the panel sits under the wheel, and moving on
  // by itself would change its height under the reader.
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const live = seen && !hold && !reduce && wide;
  // Move on after EVERY_MS; pausing keeps what's left of the count (the fill stops where it is).
  const left = useRef(EVERY_MS);
  useEffect(() => { left.current = EVERY_MS; }, [at]);
  useEffect(() => {
    if (!live) return;
    const t0 = Date.now();
    const t = setTimeout(() => go(1), left.current);
    return () => { clearTimeout(t); left.current = Math.max(0, left.current - (Date.now() - t0)); };
  }, [at, live]);
  // '#template-<id>' (from the header's Solutions › Templates): choose that template and bring the section into view,
  // instantly, and again after the page has loaded (images above it change the scroll position).
  useEffect(() => {
    const pick = () => {
      const m = window.location.hash.match(/^#template-([a-z]+)$/);
      const i = m ? list.findIndex(x => x.id === m[1]) : -1;
      if (i < 0) return;
      setState({ at: i, dir: 1 });
      const sec = document.getElementById(titleId)?.closest('section');
      if (sec) window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 96); // clear of the fixed header
    };
    pick();
    window.addEventListener('hashchange', pick);
    window.addEventListener('load', pick);
    return () => { window.removeEventListener('hashchange', pick); window.removeEventListener('load', pick); };
  }, []);
  const use = c => onUse?.({ id: 'uc-' + c.id, prompt: c.prompt });
  const c = list[at];

  return (
    <section aria-labelledby={titleId} className={sectionClass || 'relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]'}>
      <div className="mx-auto max-w-[1312px]">
        <div className="max-w-[860px]">
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">{head?.eyebrow || 'Use cases'}</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id={titleId} className={head?.titleClass || ('m-0 leading-[1.04] text-ink ' + TITLE)}
            lines={head?.lines || ['One interviewer.', 'Every use case that matters.']} />
          {(head?.sub !== null) && (
            <ScrubText as="p" reduce={reduce} lag={0.15} offset={END_OFFSET} className={'mb-0 max-w-[48ch] mt-6 ' + SUBTITLE}>
              {head?.sub || '11 interview templates. Pick the question you need answered.'}
            </ScrubText>
          )}
        </div>

        <ScrubText reduce={reduce} lag={0.1} className="mt-[clamp(28px,4vw,48px)]">
          <div ref={box} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
            onFocus={() => setHold(true)} onBlur={() => setHold(false)}
            className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
            {/* Left: the wheel, and under it the back / next buttons (left and right arrows). */}
            <div role="group" aria-roledescription="carousel" aria-label="Interview templates">
              <Wheel list={list} at={at} dir={dir} go={go} live={live} reduce={reduce} wide={wide} kit={kit} />
              <div className="mt-5 flex gap-2">
                <button type="button" aria-label="Previous template" onClick={() => go(-1)} className={ROUND}><ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.75} /></button>
                <button type="button" aria-label="Next template" onClick={() => go(1)} className={ROUND}><ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.75} /></button>
              </div>
              <p className="sr-only" aria-live="polite">{c.name}, template {at + 1} of {N}</p>
            </div>

            {/* Right (below on phones): the chosen template, in a white panel edged with a hairline. */}
            <div className="relative overflow-hidden rounded-[28px] bg-white p-7 ring-1 ring-[#1a1714]/[0.08] sm:p-10 lg:rounded-[32px] lg:p-[clamp(32px,3.2vw,44px)]">
              {/* One size for every template: all eleven are laid out invisibly in the same grid cell, so the
                  panel is as tall as the longest at any width and never changes height; the chosen one
                  crossfades on top, its button pinned to the bottom. */}
              <div className="grid">
                {list.map(x => (
                  <div key={x.id} aria-hidden="true" className="invisible [grid-area:1/1]"><PanelBody c={x} wide={wide} onUse={use} href={href} kit={kit} /></div>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={c.id} className="[grid-area:1/1]"
                    initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(12px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    exit={{ opacity: 0, transform: reduce ? 'none' : 'translateY(-8px)' }}
                    transition={{ duration: reduce ? 0.2 : 0.35, ease: EASE }}>
                    <PanelBody c={c} wide={wide} onUse={use} href={href} kit={kit} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ScrubText>
      </div>
    </section>
  );
}
