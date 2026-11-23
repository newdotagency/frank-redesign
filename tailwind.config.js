/** Tokens mirror the Frank Design System variables in Homepage V5 (.fk). */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F9F8F5',
        paper: '#fcfcfb',
        ink: { DEFAULT: '#1a1714', 2: '#5c554d', 3: '#7d766e' },
        line: { DEFAULT: '#e5e5e5', 2: '#ebe8e3' },
        brand: { DEFAULT: '#d1f899', fg: '#2a321e', strong: '#a0d05f' },
        violet: { 100: '#f3eefc', 200: '#ece1fd', 400: '#d1b2ff' },
        primary: '#171717',
        // V2 — "Warm cream editorial" tokens from DESIGN-2.md
        egg: '#fdfcfc', taupe: '#f5f3f1', stone: '#ebe8e4', hair: '#e5e5e5',
        graphite: '#44403b', smoke: '#777169', ash: '#a59f97',
        spark: '#0447ff', ember: '#ff4704',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        gmono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      transitionTimingFunction: { frank: 'cubic-bezier(.16,1,.3,1)', out: 'cubic-bezier(.23,1,.32,1)' },
    },
  },
  // hover: only fires on devices that can really hover (no sticky hover after a tap)
  future: { hoverOnlyWhenSupported: true },
  plugins: [],
};
