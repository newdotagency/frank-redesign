// A small syntax highlighter for the docs' code blocks (json, bash, js, html), tuned for the dark code card:
// keys and tags in Frank's lime, strings warm, numbers and keywords violet, comments quiet. No library: one
// regex per language, applied line by line, so a block never needs more than the text it shows.
const C = {
  key: 'text-[#d1f899]', str: 'text-[#f0c987]', num: 'text-[#d1b2ff]', kw: 'text-[#d1b2ff]', com: 'text-[#8f887d] italic',
  flag: 'text-[#d1f899]', cmd: 'text-white', pun: 'text-white/45', fn: 'text-[#a9dcf5]', tag: 'text-[#d1f899]', attr: 'text-[#a9dcf5]',
};

const RULES = {
  json: [[/"(?:[^"\\]|\\.)*"(?=\s*:)/y, 'key'], [/"(?:[^"\\]|\\.)*"/y, 'str'], [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y, 'num'], [/\b(?:true|false|null)\b/y, 'kw'], [/[{}\[\],:]/y, 'pun']],
  bash: [[/#.*/y, 'com'], [/"(?:[^"\\]|\\.)*"|'[^']*'/y, 'str'], [/\$\{?[A-Za-z_][\w]*\}?/y, 'num'], [/(?<=\s)--?[A-Za-z][\w-]*/y, 'flag'], [/\b(?:curl|npm|npx|git|echo|export|cd|claude|codex)\b/y, 'cmd'], [/\\$/y, 'pun']],
  js: [[/\/\/.*|\/\*[\s\S]*?\*\//y, 'com'], [/`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y, 'str'], [/\b(?:const|let|var|function|return|if|else|new|await|async|import|from|export|try|catch|throw|true|false|null|undefined)\b/y, 'kw'], [/\b\d+(?:\.\d+)?\b/y, 'num'], [/[A-Za-z_$][\w$]*(?=\()/y, 'fn'], [/[{}()\[\];,.:=<>+\-*/!&|?]/y, 'pun']],
  html: [[/<!--[\s\S]*?-->/y, 'com'], [/<\/?[A-Za-z][\w-]*/y, 'tag'], [/\/?>/y, 'tag'], [/"[^"]*"|'[^']*'/y, 'str'], [/[A-Za-z_:][\w:.-]*(?==)/y, 'attr'], [/=/y, 'pun']],
};

export function tokens(code, lang) {
  const rules = RULES[lang === 'sh' || lang === 'shell' ? 'bash' : lang === 'javascript' || lang === 'ts' ? 'js' : lang];
  if (!rules) return [[code, null]];
  const out = [];
  let plain = '';
  let i = 0;
  while (i < code.length) {
    let hit = null;
    for (const [re, k] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i && m[0].length) { hit = [m[0], k]; break; }
    }
    if (hit) { if (plain) { out.push([plain, null]); plain = ''; } out.push(hit); i += hit[0].length; }
    else { plain += code[i]; i += 1; }
  }
  if (plain) out.push([plain, null]);
  return out;
}

export const Highlighted = ({ code, lang }) => tokens(code, lang).map(([t, k], i) => (k ? <span key={i} className={C[k]}>{t}</span> : t));
