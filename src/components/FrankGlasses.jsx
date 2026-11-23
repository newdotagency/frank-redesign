// Frank glasses — a straight React port of FrankGlasses.dc.html from Homepage V5.
// Pose table, projection, easing and idle loop are unchanged; only the component
// shell moved from DCLogic to hooks. Do not redesign.
import { useEffect, useRef, useState } from 'react';

const B = 39.5;
// [brows(10), roll, dx, dy, lean, lensL(4), lensR(4), yaw, pitch], f = frames, idle = [index, amp, ms]
const P = {
  Ready:      { v: [68.5,108,120.5,108,0, 162,108,214,108,0, 0,0,0,1, 0,B,B,B, 0,B,B,B, 0,0], f: 16, idle: [13,0.006,4000] },
  Welcome:    { v: [68,98,121,98,-7, 162,98,215,98,-7, 0,0,-3,1, -1,B,B,33, -1,B,B,33, 0,6], f: 12 },
  Attentive:  { v: [68.5,102,120.5,102,0, 162,102,214,102,0, 0,0,0,1.04, 0,41,41,41, 0,41,41,41, 0,-4], f: 14 },
  Listening:  { v: [68.5,106,120.5,106,-2, 162,106,214,106,-2, 5,0,0,1, 0,B,B,36, 0,B,B,36, 9,0], f: 18, idle: [23,3,2600] },
  Empathetic: { v: [68,110,119,100,0, 163,100,214,110,0, -3,0,2,1, 1,B,37,38, 1,B,37,38, -6,-7], f: 20 },
  Curious:    { v: [61.5,119.2,105.3,93.4,0, 162.5,112.3,214.1,111.9,0, 0,0,0,1, 0,B,42,B, 0,B,38,B, 0,0], f: 12 },
  Probing:    { v: [68,103,118,112,0, 162,97,214,95,0, 2,0,0,1, 1,B,33,B, -2,B,42,B, -13,-3], f: 14 },
  Puzzled:    { v: [66,110,122,110,-18, 162,108,214,108,0, 4,0,0,1, -1,B,42,B, 1,B,37,B, 14,2], f: 14 },
  Thinking:   { v: [70,102,120,98,0, 164,96,214,92,0, -2,5,-5,1, 0,B,37,40, 0,B,37,40, -18,10], f: 18, idle: [22,3,3200] },
  Focused:    { v: [70,103,120,110,0, 162,110,212,103,0, 0,0,2,1, 0,B,32,B, 0,B,32,B, 0,-9], f: 16 },
  Insight:    { v: [68,90,121,90,-4, 162,90,215,90,-4, 0,0,-3,1.03, 0,42,44,42, 0,42,44,42, 0,8], f: 10 },
  Agreeing:   { v: [68.5,102,120.5,102,-4, 162,102,214,102,-4, 0,0,3,1, 0,B,B,32, 0,B,B,32, 0,-3], f: 12, idle: [23,5,1400] },
  Grateful:   { v: [70,108,120,108,-5, 162,108,212,108,-5, 0,0,4,0.98, 0,B,38,30, 0,B,38,30, 0,-12], f: 20 },
  Confident:  { v: [66,110,118,108,0, 165,112,210,86,0, -2,0,-1,1, 0,B,36,37, 0,B,41,37, 9,5], f: 10 },
};
const f = n => Math.round(n * 100) / 100;
const K = 0.5523, CY = 164.37, OX = 141.44, OY = 164.37, D = 700, CURV = 0.0016, BROW_Z = -16, DEG = Math.PI / 180;
const lensPts = (cx, cy, rx, t, b) => [[cx-rx,cy],
  [cx-rx,cy-K*t],[cx-K*rx,cy-t],[cx,cy-t], [cx+K*rx,cy-t],[cx+rx,cy-K*t],[cx+rx,cy],
  [cx+rx,cy+K*b],[cx+K*rx,cy+b],[cx,cy+b], [cx-K*rx,cy+b],[cx-rx,cy+K*b],[cx-rx,cy]];
const curvePts = (x1, y1, x2, y2, pk) => { const o = pk*4/3, dx = x2-x1, dy = y2-y1; return [[x1,y1],[x1+dx/3,y1+dy/3+o],[x1+2*dx/3,y1+2*dy/3+o],[x2,y2]]; };
const toD = (Q, close) => { let s = `M${f(Q[0][0])},${f(Q[0][1])}`; for (let i = 1; i < Q.length; i += 3) s += `C${f(Q[i][0])},${f(Q[i][1])} ${f(Q[i+1][0])},${f(Q[i+1][1])} ${f(Q[i+2][0])},${f(Q[i+2][1])}`; return close ? s + 'Z' : s; };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const shape = (v, depth, W) => {
  const yaw = v[22]*depth*DEG, pitch = v[23]*depth*DEG, roll = v[10]*DEG, tz = D*(1 - 1/v[13]);
  const cr = Math.cos(roll), sr = Math.sin(roll), cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pr = (X, Y, Z) => {
    let x = X - OX, y = Y - OY, z = Z;
    let y0 = y - 40; [x, y0] = [x*cr - y0*sr, x*sr + y0*cr]; y = y0 + 40;
    let z0 = z + 100; [x, z0] = [x*cyw + z0*syw, -x*syw + z0*cyw]; z = z0 - 100;
    let y1 = y - 120, z1 = z + 120; [y1, z1] = [y1*cp - z1*sp, y1*sp + z1*cp]; y = y1 + 120; z = z1 - 120;
    z += tz;
    const s = D / (D - z);
    return [OX + x*s + v[11], OY + y*s + v[12], s];
  };
  const zc = X => -CURV*(X - OX)*(X - OX);
  const onFace = (pts, zo) => pts.map(([x, y]) => pr(x, y, zo + zc(x)));
  const [ldy, lrx, lt, lbt, rdy, rrx, rt, rbt] = v.slice(14, 22);
  const lx = 94.5, rx = 188.38, ly = CY + ldy, ry = CY + rdy;
  const arm = (hx, hy, sg) => {
    const zh = zc(hx);
    const pts = [[hx, hy, zh], [hx+sg*4, hy, zh-2], [hx+sg*10, hy, zh-40], [hx+sg*13, hy+1, zh-70]];
    const h = pr(...pts[0]), e = pr(...pts[3]);
    const k = clamp(sg*(e[0] - h[0]) / 4, 0, 1);
    const Q = pts.map(p => pr(p[0] + (p[0]-pts[0][0])*(k-1), p[1] + (p[1]-pts[0][1])*(k-1), p[2] + (p[2]-pts[0][2])*(k-1)));
    return { d: k < 0.01 ? '' : toD(Q), w: f(W*(h[2]+e[2])/2), o: f(clamp(k*2.5, 0, 1)) };
  };
  const aL = arm(lx - lrx, ly, -1), aR = arm(rx + rrx, ry, 1);
  const cw = (x, y, z) => f(W * pr(x, y, z + zc(x))[2]);
  return {
    lensL: toD(onFace(lensPts(lx, ly, lrx, lt, lbt), 0), true), lensR: toD(onFace(lensPts(rx, ry, rrx, rt, rbt), 0), true),
    bridge: toD(onFace(curvePts(lx+lrx, ly, rx-rrx, ry, -2), 0)),
    lb: toD(onFace(curvePts(v[0], v[1], v[2], v[3], v[4]), BROW_Z)), rb: toD(onFace(curvePts(v[5], v[6], v[7], v[8], v[9]), BROW_Z)),
    armL: aL.d, armR: aR.d, wArmL: aL.w, wArmR: aR.w, oArmL: aL.o, oArmR: aR.o,
    wL: cw(lx, ly, 0), wR: cw(rx, ry, 0), wB: cw(OX, CY, 0),
    wLb: cw((v[0]+v[2])/2, (v[1]+v[3])/2, BROW_Z), wRb: cw((v[5]+v[7])/2, (v[6]+v[8])/2, BROW_Z),
  };
};
const bez = (x1, y1, x2, y2) => t => {
  const cx = s => 3*x1*s*(1-s)*(1-s) + 3*x2*s*s*(1-s) + s*s*s;
  const cy = s => 3*y1*s*(1-s)*(1-s) + 3*y2*s*s*(1-s) + s*s*s;
  let lo = 0, hi = 1, s = t;
  for (let i = 0; i < 22; i++) { s = (lo + hi) / 2; if (cx(s) < t) lo = s; else hi = s; }
  return cy(s);
};
const ease = bez(0.65, 0, 0.35, 1);

// Short expressive overlays on top of a pose (the original `react` channel).
function applyReaction(vv, t, kind, A) {
  const env = Math.sin(Math.PI * ease(t));
  const add = (ix, amt) => ix.forEach(i => { vv[i] += amt; });
  if (kind === 'excited') {
    const hop = Math.abs(Math.sin(t * Math.PI * 2)) * (1 - t);
    vv[12] -= 12 * A * hop; vv[13] += 0.06 * A * env; vv[23] += 7 * A * env;
    add([1, 3, 6, 8], -9 * A * env); add([4, 9], -4 * A * env); add([16, 20], 4 * A * env); add([17, 21], -5 * A * env);
  } else if (kind === 'curious') {
    vv[10] += 6 * A * env; vv[22] += 14 * A * env; vv[1] -= 11 * A * env; vv[3] -= 7 * A * env; vv[16] += 4 * A * env; vv[20] -= 2 * A * env;
  } else if (kind === 'nod') {
    const n = Math.sin(t * Math.PI * 4) * (1 - t);
    vv[23] -= 11 * A * n; vv[12] += 4 * A * Math.max(0, n); add([17, 21], -6 * A * env); add([4, 9], -3 * A * env);
  } else if (kind === 'wow') {
    add([15, 19], 3 * A * env); add([16, 17, 20, 21], 5 * A * env); add([1, 3, 6, 8], -13 * A * env); vv[13] += 0.08 * A * env; vv[23] += 5 * A * env;
  } else if (kind === 'think') {
    vv[22] -= 15 * A * env; vv[23] += 9 * A * env; vv[11] += 6 * A * env; add([1, 3], -5 * A * env); add([16, 20], -3 * A * env);
  }
}

export default function FrankGlasses({
  pose = 'Curious', ink = '#000', weight = 1, depth = 1,
  follow = false, idle = true, react = 0, reactKind = 'excited', excite = 1,
  // Optional (V3): lenses shift a few px toward the pointer; occasional blink (slow when slowBlink).
  shift = false, blink = false, slowBlink = false,
  // Optional (V21.12.1 testimonials): brows={false} draws the frame alone, without the brows.
  brows = true,
  reducedMotion = false, className = '', style,
}) {
  const name = P[pose] ? pose : 'Curious';
  const W = 7 * weight;
  const [s, setS] = useState(() => shape(P[name].v, depth, W));

  // Mutable animation state lives in a ref so the rAF loop never re-subscribes.
  const st = useRef(null);
  if (!st.current) st.current = { last: P[name].v.slice(), from: P[name].v.slice(), t0: 0, off: [0, 0], mouse: null, visible: false, raf: 0, r0: 0, nextBlink: 0, b0: 0 };
  const props = useRef({});
  props.current = { name, depth, W, follow: follow && !reducedMotion, idle: idle && !reducedMotion, reactKind, excite, reducedMotion,
    shift: shift && !reducedMotion, blink: blink && !reducedMotion, slowBlink };
  const el = useRef(null);

  const loop = useRef(null);
  loop.current = now => {
    const S = st.current, p = props.current;
    S.raf = 0;
    if (!S.visible) return;
    const pp = P[p.name];
    const k = p.reducedMotion ? 1 : Math.min(1, (now - S.t0) / (pp.f * 1000 / 30));
    const e = ease(k);
    const v = pp.v.map((x, i) => S.from[i] + (x - S.from[i]) * e);
    if (pp.idle && p.idle) { const [i, amp, per] = pp.idle; v[i] += amp * Math.sin((now - S.t0) * 2 * Math.PI / per) * e; }
    S.last = v.slice();
    let tgt = [0, 0];
    if (p.follow && S.mouse && el.current) {
      const r = el.current.getBoundingClientRect();
      const dx = (S.mouse[0] - (r.left + r.width / 2)) / window.innerWidth, dy = (S.mouse[1] - (r.top + r.height / 2)) / window.innerHeight;
      tgt = [clamp(dx * 2, -1, 1) * 16, -clamp(dy * 2, -1, 1) * 9];
    }
    S.off = [S.off[0] + (tgt[0] - S.off[0]) * 0.08, S.off[1] + (tgt[1] - S.off[1]) * 0.08];
    const vv = v.slice(); vv[22] += S.off[0]; vv[23] += S.off[1];
    // Lens shift: the whole frame drifts a few px toward the pointer (≈ 3px at 88px wide).
    if (p.shift) { vv[11] += S.off[0] * 0.55; vv[12] -= S.off[1] * 0.6; }
    // Blink: lenses squash shut and brows dip, every 2.8–6.5s. Slow, lazy blink on touch.
    if (p.blink) {
      if (!S.nextBlink) S.nextBlink = now + 1800 + Math.random() * 2500;
      if (!S.b0 && now >= S.nextBlink) S.b0 = now;
      if (S.b0) {
        const dur = p.slowBlink ? 520 : 170, t = (now - S.b0) / dur;
        if (t >= 1) { S.b0 = 0; S.nextBlink = now + 2800 + Math.random() * 3700; }
        else {
          const b = Math.sin(Math.PI * ease(t));
          [16, 17, 20, 21].forEach(i => { vv[i] *= 1 - 0.86 * b; });
          [1, 3, 6, 8].forEach(i => { vv[i] += 5 * b; });
        }
      }
    }
    if (S.r0 && !p.reducedMotion) {
      const A = Number(p.excite), dur = 700 + 350 * Math.min(A, 2), t = (now - S.r0) / dur;
      if (t >= 1) S.r0 = 0; else applyReaction(vv, t, p.reactKind, A);
    }
    setS(shape(vv, Number(p.depth), p.W));
    // In reduced motion, settle and stop instead of running a perpetual loop.
    const settled = p.reducedMotion && !S.r0;
    if (!settled) S.raf = requestAnimationFrame(t => loop.current(t));
  };
  const kick = () => { const S = st.current; if (S.visible && !S.raf) S.raf = requestAnimationFrame(t => loop.current(t)); };

  useEffect(() => {
    const S = st.current;
    S.t0 = performance.now();
    const onMove = e => { S.mouse = [e.clientX, e.clientY]; };
    window.addEventListener('mousemove', onMove, { passive: true });
    const io = new IntersectionObserver(es => es.forEach(en => { S.visible = en.isIntersecting; kick(); }), { threshold: [0, 0.5] });
    if (el.current) io.observe(el.current);
    return () => { cancelAnimationFrame(S.raf); S.raf = 0; io.disconnect(); window.removeEventListener('mousemove', onMove); };
  }, []);

  // Pose change → ease from wherever we are now.
  useEffect(() => { const S = st.current; S.from = S.last.slice(); S.t0 = performance.now(); kick(); }, [name]);
  // Reaction pulse.
  useEffect(() => { if (react) { st.current.r0 = performance.now(); kick(); } }, [react]);
  // Settings that change the drawing without a pose change.
  useEffect(() => { kick(); }, [depth, W, follow, idle, reducedMotion, shift, blink]);

  return (
    <div ref={el} className={className} style={{ lineHeight: 0, ...style }} aria-hidden="true">
      <svg viewBox="12 56 260 168" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <g fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
          <path d={s.armL} strokeWidth={s.wArmL} strokeOpacity={s.oArmL} />
          <path d={s.armR} strokeWidth={s.wArmR} strokeOpacity={s.oArmR} />
          <path d={s.lensL} strokeWidth={s.wL} />
          <path d={s.lensR} strokeWidth={s.wR} />
          <path d={s.bridge} strokeWidth={s.wB} />
          {brows && <path d={s.lb} strokeWidth={s.wLb} />}
          {brows && <path d={s.rb} strokeWidth={s.wRb} />}
        </g>
      </svg>
    </div>
  );
}
