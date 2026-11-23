// ParticleSphere — an interactive 3D sphere of particles (Three.js via @react-three/fiber).
//
//  • 5,000 points on a Fibonacci (golden-spiral) lattice, radius 1.6, one BufferGeometry with a
//    per-point random `aSeed`. 15% of points (random) take the highlight colour.
//  • Custom ShaderMaterial (output converted to sRGB, so the hex colours render exactly): soft round dots (solid centre, short radial falloff), 3–5 px by seed,
//    size-attenuated; normal alpha blending, depthWrite off. Far-side points render at 40% opacity.
//  • Vertex-shader motion: 3D simplex noise displaces each point along its normal (amp 0.08,
//    freq 1.2, speed 0.25); per-point twinkle ±20%. The group spins on Y (0.08 rad/s), tilted 15° on X.
//  • Intro: points start at random positions within 6 units at 0 opacity and converge over 1.8 s
//    (ease-out-expo), staggered by aSeed (up to 0.4 s).
//  • Interaction (mouse only): tilt toward the cursor (±0.3 rad, lerp 0.05); pointer repulsion
//    against an invisible sphere (0.5-unit radius, up to 0.25 units out, springs back); hover eases
//    the noise amplitude 0.08 → 0.14 over ~0.6 s. Touch devices: auto-rotation only.
//  • Atmosphere: cream background, a soft radial glow behind, and a back-face fresnel halo (r 1.75).
//  • Below 768 px: 2,500 points, scale 0.8. DPR capped at 2. Render loop pauses off-screen or when
//    the tab is hidden. Geometry and materials are disposed on unmount.
//  • prefers-reduced-motion: no intro, no noise, no rotation, no interaction — a static sphere.
import { useEffect, useMemo, useRef, useState } from 'react';
import { sphereGrainGradient } from './grain';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = {
  background: '#FFFDF3',
  particle: '#D8AFFB',
  highlight: '#D0FA94',
  glow: '#D0FA94',
  halo: '#D8AFFB',
  spot: '#FFFFFF',       // optional third particle colour, used when spotRatio > 0
};

const HOVER_AMP_RATIO = 0.14 / 0.08;  // hover raises the noise amplitude by this factor
const NOISE_FREQ = 1.2;
const NOISE_SPEED = 0.25;
const TILT_X = (15 * Math.PI) / 180;
const MAX_TILT = 0.3;
const INTRO = 1.8, INTRO_STAGGER = 0.4, START_RADIUS = 6;
const REPEL_RADIUS = 0.5, REPEL_DIST = 0.25;
const HALO_RATIO = 1.75 / 1.6;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// ── Shaders ──────────────────────────────────────────────────────────────────────────
// 3D simplex noise: Ashima Arts / Stefan Gustavson (MIT).
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const POINTS_VERT = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uAmp;
uniform float uFreq;
uniform float uSpeed;
uniform float uPixelRatio;
uniform vec3 uHit;
uniform float uRepel;
attribute vec3 aStart;
attribute float aSeed;
attribute float aHighlight;
attribute float aSpot;
varying float vAlpha;
varying float vHighlight;
varying float vSpot;
${SIMPLEX}
float easeOutExpo(float t){ return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t); }
void main(){
  vec3 n = normalize(position);
  // Breathing: noise along the normal.
  float noise = snoise(position * uFreq + vec3(uTime * uSpeed));
  vec3 p = position + n * noise * uAmp;
  // Cursor repulsion (uHit is in the sphere's local space), smooth falloff.
  float d = distance(position, uHit);
  float push = (1.0 - smoothstep(0.0, ${REPEL_RADIUS.toFixed(2)}, d)) * uRepel;
  p += n * push * ${REPEL_DIST.toFixed(2)};
  // Intro: converge from a random start, ease-out-expo, staggered by seed.
  float t = clamp((uIntro - aSeed * ${INTRO_STAGGER.toFixed(2)}) / ${INTRO.toFixed(2)}, 0.0, 1.0);
  float e = easeOutExpo(t);
  p = mix(aStart, p, e);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = mix(3.0, 5.0, aSeed);
  gl_PointSize = size * uPixelRatio * (6.0 / -mv.z);

  // Far side at 40% opacity (smooth across the silhouette), ±20% twinkle, fade in with the intro.
  float facing = normalize(normalMatrix * n).z;
  float side = mix(0.4, 1.0, smoothstep(-0.15, 0.15, facing));
  float twinkle = 1.0 + 0.2 * sin(uTime + aSeed * 6.28318);
  vAlpha = clamp(side * twinkle, 0.0, 1.0) * e;
  vHighlight = aHighlight;
  vSpot = aSpot;
}`;

const POINTS_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uHighlightColor;
uniform vec3 uSpotColor;
varying float vAlpha;
varying float vHighlight;
varying float vSpot;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.55, 1.0, d);   // solid centre, short radial falloff
  if (a * vAlpha < 0.01) discard;
  vec3 c = mix(mix(uColor, uHighlightColor, vHighlight), uSpotColor, vSpot);
  gl_FragColor = vec4(c, a * vAlpha);
  #include <colorspace_fragment>
}`;

const HALO_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const HALO_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.0);
  gl_FragColor = vec4(uColor, f * uOpacity);
  #include <colorspace_fragment>
}`;

// ── Geometry ─────────────────────────────────────────────────────────────────────────
function makeGeometry(count, radius, spotRatio) {
  const position = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const highlight = new Float32Array(count);
  const spot = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Fibonacci lattice: +0.5 offset keeps points off the exact poles.
    const y = 1 - ((i + 0.5) / count) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN_ANGLE;
    position[i * 3] = Math.cos(theta) * r * radius;
    position[i * 3 + 1] = y * radius;
    position[i * 3 + 2] = Math.sin(theta) * r * radius;
    // Intro start: a random point inside a 6-unit ball.
    const u = Math.random() * 2 - 1, phi = Math.random() * Math.PI * 2, rr = Math.cbrt(Math.random()) * START_RADIUS;
    const s = Math.sqrt(1 - u * u);
    start[i * 3] = Math.cos(phi) * s * rr;
    start[i * 3 + 1] = u * rr;
    start[i * 3 + 2] = Math.sin(phi) * s * rr;
    seed[i] = Math.random();
    highlight[i] = Math.random() < 0.15 ? 1 : 0;
    spot[i] = Math.random() < spotRatio ? 1 : 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(position, 3));
  g.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('aHighlight', new THREE.BufferAttribute(highlight, 1));
  g.setAttribute('aSpot', new THREE.BufferAttribute(spot, 1));
  g.computeBoundingSphere();
  return g;
}

// ── Media helpers ────────────────────────────────────────────────────────────────────
function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

// ── Scene ────────────────────────────────────────────────────────────────────────────
function Sphere({ count, radius, colors, noiseAmplitude, rotationSpeed, interactive, reduced, scale, halo, spotRatio }) {
  const tiltGroup = useRef(null);
  const spinGroup = useRef(null);
  const hover = useRef(false);
  const hitWorld = useRef(new THREE.Vector3(0, 0, 10));
  const { gl, invalidate } = useThree();

  const geometry = useMemo(() => makeGeometry(count, radius, spotRatio), [count, radius, spotRatio]);
  const pointsMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: POINTS_VERT,
    fragmentShader: POINTS_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: reduced ? 100 : 0 },
      uAmp: { value: reduced ? 0 : noiseAmplitude },
      uFreq: { value: NOISE_FREQ },
      uSpeed: { value: NOISE_SPEED },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uHit: { value: new THREE.Vector3(0, 0, 10) },
      uRepel: { value: 0 },
      uColor: { value: new THREE.Color(colors.particle) },
      uHighlightColor: { value: new THREE.Color(colors.highlight) },
      uSpotColor: { value: new THREE.Color(colors.spot) },
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const haloMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: HALO_VERT,
    fragmentShader: HALO_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: { uColor: { value: new THREE.Color(colors.halo) }, uOpacity: { value: reduced ? 0.35 : 0 } },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const haloGeometry = useMemo(() => new THREE.SphereGeometry(radius * HALO_RATIO, 64, 64), [radius]);
  const hitGeometry = useMemo(() => new THREE.SphereGeometry(radius, 48, 48), [radius]);
  const hitMaterial = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }), []);

  // Live colour overrides.
  useEffect(() => {
    pointsMaterial.uniforms.uColor.value.set(colors.particle);
    pointsMaterial.uniforms.uHighlightColor.value.set(colors.highlight);
    pointsMaterial.uniforms.uSpotColor.value.set(colors.spot);
    haloMaterial.uniforms.uColor.value.set(colors.halo);
    invalidate();
  }, [colors.particle, colors.highlight, colors.halo, colors.spot, pointsMaterial, haloMaterial, invalidate]);

  // Dispose GPU resources.
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => haloGeometry.dispose(), [haloGeometry]);
  useEffect(() => () => hitGeometry.dispose(), [hitGeometry]);
  useEffect(() => () => { pointsMaterial.dispose(); haloMaterial.dispose(); hitMaterial.dispose(); }, [pointsMaterial, haloMaterial, hitMaterial]);

  // Reduced motion: a static frame — no intro, no noise, fixed 15° tilt.
  useEffect(() => {
    if (!reduced) return;
    pointsMaterial.uniforms.uIntro.value = 100;
    pointsMaterial.uniforms.uAmp.value = 0;
    haloMaterial.uniforms.uOpacity.value = 0.35;
    invalidate();
  }, [reduced, pointsMaterial, haloMaterial, invalidate]);

  const clock = useRef({ time: 0, intro: 0, spin: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDelta) => {
    const u = pointsMaterial.uniforms;
    u.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);
    if (reduced) {
      if (tiltGroup.current) tiltGroup.current.rotation.set(TILT_X, 0, 0);
      return;
    }
    const dt = Math.min(rawDelta, 0.1); // no jump after a pause
    const c = clock.current;
    c.time += dt; c.intro += dt; c.spin += dt * rotationSpeed;
    u.uTime.value = c.time;
    u.uIntro.value = c.intro;
    haloMaterial.uniforms.uOpacity.value = 0.35 * Math.min(1, c.intro / INTRO);

    // Hover: ease the noise amplitude (≈98% of the way in 0.6 s).
    const ampTarget = hover.current && interactive ? noiseAmplitude * HOVER_AMP_RATIO : noiseAmplitude;
    u.uAmp.value += (ampTarget - u.uAmp.value) * (1 - Math.exp(-dt / 0.15));

    // Tilt toward the cursor, smoothed (lerp 0.05 per frame).
    const tx = interactive ? -state.pointer.y * MAX_TILT : 0;
    const ty = interactive ? state.pointer.x * MAX_TILT : 0;
    const tg = tiltGroup.current;
    if (tg) {
      tg.rotation.x += (TILT_X + tx - tg.rotation.x) * 0.05;
      tg.rotation.y += (ty - tg.rotation.y) * 0.05;
    }
    if (spinGroup.current) spinGroup.current.rotation.y = c.spin;

    // Repulsion: hit point into the points' local space; strength springs in and out.
    if (spinGroup.current) {
      spinGroup.current.updateWorldMatrix(true, false);
      tmp.copy(hitWorld.current);
      spinGroup.current.worldToLocal(tmp);
      u.uHit.value.copy(tmp);
    }
    const repelTarget = hover.current && interactive ? 1 : 0;
    u.uRepel.value += (repelTarget - u.uRepel.value) * (1 - Math.exp(-dt / 0.12));
  });

  const pointerHandlers = interactive && !reduced ? {
    onPointerMove: e => { hitWorld.current.copy(e.point); hover.current = true; },
    onPointerOver: e => { hitWorld.current.copy(e.point); hover.current = true; },
    onPointerOut: () => { hover.current = false; },
  } : {};

  return (
    <group ref={tiltGroup} rotation={[TILT_X, 0, 0]} scale={scale}>
      {halo && <mesh geometry={haloGeometry} material={haloMaterial} renderOrder={0} />}
      <group ref={spinGroup}>
        <points geometry={geometry} material={pointsMaterial} renderOrder={1} frustumCulled={false} />
      </group>
      <mesh geometry={hitGeometry} material={hitMaterial} {...pointerHandlers} />
    </group>
  );
}

// ── Public component ─────────────────────────────────────────────────────────────────
export default function ParticleSphere({
  count = 5000,
  radius = 1.6,
  colors: colorOverrides,
  noiseAmplitude = 0.08,
  rotationSpeed = 0.08,
  interactive = true,
  halo = true,           // the lavender fresnel halo around the silhouette (V12 turns it off)
  spotRatio = 0,         // share of particles drawn in colors.spot (V12: white spots)
  glowSize = 55,         // where the background glow fades out, in % of the container's half-size,
                         // or 'sphere' to make the glow exactly the sphere's on-screen size
  grain = false,         // grain-gradient glow (lime fields + stipple, dissolving at the sphere's edge)
  still = false,         // V21.11: always the static sphere (as with reduced motion): no intro, noise, spin or pointer
  className = '',
  style,
}) {
  const colors = { ...DEFAULT_COLORS, ...colorOverrides };
  const small = useMedia('(max-width: 767px)');
  const touch = useMedia('(hover: none), (pointer: coarse)');
  const reduced = useMedia('(prefers-reduced-motion: reduce)') || still;
  const wrap = useRef(null);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);

  // Pause when off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const vis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const frameloop = reduced ? 'demand' : onScreen && pageVisible ? 'always' : 'never';
  const finalCount = small ? Math.min(count, 2500) : count;
  // The sphere's silhouette radius as a fraction of the canvas half-height (camera z = 6, fov 45°).
  const sphereFrac = Math.tan(Math.asin(Math.min((radius * (small ? 0.8 : 1)) / 6, 0.99))) / Math.tan((22.5 * Math.PI) / 180);

  return (
    <div ref={wrap} aria-hidden="true" className={'relative h-full w-full overflow-hidden ' + className}
      style={{ background: colors.background, ...style }}>
      {/* Soft glow behind the sphere: 35% at the centre, transparent by `glowSize`% of the radius (55 by default).
          glowSize="sphere": a square glow sized from the container height (like the camera), fading
          out exactly at the sphere's silhouette. */}
      {grain ? (
        <div className="pointer-events-none absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2"
          style={sphereGrainGradient(sphereFrac)} />
      ) : glowSize === 'sphere' ? (
        <div className="pointer-events-none absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2"
          style={{ background: `radial-gradient(circle closest-side at 50% 50%, ${hexA(colors.glow, 0.35)} 0%, ${hexA(colors.glow, 0.28)} ${(sphereFrac * 60).toFixed(1)}%, ${hexA(colors.glow, 0)} ${(sphereFrac * 100).toFixed(1)}%)` }} />
      ) : (
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle closest-side at 50% 50%, ${hexA(colors.glow, 0.35)} 0%, ${hexA(colors.glow, 0)} ${glowSize}%)` }} />
      )}
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 2]}
        frameloop={frameloop}
        // Measure the real layout size (offsetWidth/Height), not the on-screen box: inside a
        // transformed parent (e.g. the hero's scroll-wrap scale) the on-screen box is already
        // scaled, and sizing the canvas from it would shrink it twice and pull it off-centre.
        resize={{ offsetSize: true }}
        camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}>
        <Sphere key={finalCount} count={finalCount} radius={radius} colors={colors}
          noiseAmplitude={noiseAmplitude} rotationSpeed={rotationSpeed}
          interactive={interactive && !touch} reduced={reduced} scale={small ? 0.8 : 1} halo={halo} spotRatio={spotRatio} />
      </Canvas>
    </div>
  );
}


// '#RRGGBB' + alpha → rgba() for the CSS glow.
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
