// Cover (V21.04): a hotlinked image on a plain placeholder, shared by the blog and case studies pages.
import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

// A banner on a plain image placeholder: a flat light grey block with an image icon in the middle. The real
// banner (hotlinked from the live blog, untouched; srcset is the live page's own 500/800/1080/1600px copies)
// fades in on top only once it has loaded. If it can't load (the claude.ai artifact blocks outside images),
// it's removed and the placeholder stays: no broken-image icons. `square` fills its parent (the list's
// thumbnails); otherwise the frame is 16:9, the banners' own shape, so they're never cropped. `imgClass` goes
// on the banner itself. An entry with no `img` shows the placeholder alone.
export default function Banner({ p, className = '', imgClass = '', eager, square, sizes = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw' }) {
  const [state, setState] = useState('loading'); // loading | ok | failed
  const img = useRef(null);
  // An image the browser already had cached may finish before React's onLoad is attached.
  useEffect(() => { const el = img.current; if (el && el.complete) setState(el.naturalWidth ? 'ok' : 'failed'); }, []);
  return (
    <span className={'relative block overflow-hidden bg-[#efede8] ' + (square ? 'size-full' : 'aspect-video w-full') + ' ' + className}>
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-[#1a1714]/25">
        <ImageIcon className={square ? 'size-7' : 'size-9'} strokeWidth={1.5} />
      </span>
      {p.img && state !== 'failed' && (
        <img ref={img} src={p.img} srcSet={p.srcset} sizes={sizes} alt="" width="1600" height="900" loading={eager ? 'eager' : 'lazy'} decoding="async"
          fetchpriority={eager ? 'high' : undefined} onLoad={() => setState('ok')} onError={() => setState('failed')}
          className={'absolute inset-0 block size-full object-cover transition-opacity duration-500 ease-out ' + (state === 'ok' ? 'opacity-100' : 'opacity-0') + ' ' + imgClass} />
      )}
    </span>
  );
}
