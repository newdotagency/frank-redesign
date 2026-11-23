// LiveInterview (V21.1; a voice-only copy of V20's, so V19–V21 keep theirs) — the visitor plays the
// customer and Frank interviews them by voice for about two minutes, the way he would interview their
// customers. Voice only, no chat.
//   intro  — what's about to happen, and "Start interview" (always active). It opens a popover above
//            the button asking to turn on the microphone; "Turn on microphone" opens the browser's
//            prompt, and then the call opens either way. Where the microphone isn't available (blocked,
//            a frame without microphone access like the claude.ai viewer, or a browser without speech
//            recognition), the call still runs: Frank speaks, and on the visitor's turn the call shows
//            the microphone as off, with "Turn on mic" to try again and "Next question" to move on.
//   live   — Frank speaks each question (speech synthesis, with captions), then listens (speech
//            recognition, with a live transcript and a mic level). A pause ends the answer, or
//            "Done answering". He probes short answers once and follows up on the visitor's own
//            words. Four questions; the call wraps up at two minutes.
//   done   — what Frank took away: a theme, the visitor's words behind it, and the transcript.
// Everything runs in the browser and nothing is stored.
// The interview's words come from a script (SCRIPTS): V20's pop-up uses `churn`; V19's
// "Interview example" section embeds the room inline (InterviewRoom, inline) with `whyFrank`
// and listens to Frank's moves (onMove: 'follow' · 'track' · 'deeper') to light up its notes.
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Mic, MicOff, PhoneOff, RotateCcw, X } from 'lucide-react';
import FrankGlasses from '../components/FrankGlasses';
import './voice-widget.css';

const LIMIT = 120;          // seconds: the call wraps up after this
const SILENCE_MS = 1800;    // a pause this long ends the visitor's answer
const EASE = [0.23, 1, 0.32, 1];

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
const CAN_SPEAK = typeof window !== 'undefined' && 'speechSynthesis' in window;

// Pages shown inside a frame that isn't allowed the microphone (the claude.ai artifact viewer) can never
// open the browser's prompt, so the dialog says so up front.
const FRAMED_NO_MIC = typeof document !== 'undefined' && (document.permissionsPolicy || document.featurePolicy)?.allowsFeature?.('microphone') === false;

// What the call says on the visitor's turn when the microphone is off.
const MIC_OFF_NOTE = FRAMED_NO_MIC
  ? 'This preview can’t reach a microphone, so Frank moves on in a moment. On the live site, he listens here.'
  : !SR ? 'This browser can’t turn speech into text. Open the page in Chrome, Edge or Safari to answer by voice.'
  : 'Turn it on with the mic button, or Frank moves on in a moment.';
const MIC_BLOCKED_NOTE = 'Your browser blocked the microphone. Click the microphone icon in the address bar, choose Allow, then try again.';

const words = t => t.trim().split(/\s+/).filter(Boolean);

// A few of the visitor's own words to follow up on: the part around why they stopped, if they said.
const KEY = /^(because|too|couldn'?t|didn'?t|wasn'?t|don'?t|can'?t|hard|expensive|price|pricing|cost|slow|confus\w*|bug\w*|annoy\w*|never|stopped|switched|cheaper|complicated|takes|weeks|surveys?|guess\w*)$/i;
function echoOf(text) {
  const w = words(text.replace(/[.!?,;:]/g, ''));
  if (w.length < 3) return '';
  // The reason after "because", up to the next "and" / "but" / "so"; else the words around a telling one.
  const b = w.findIndex(x => /^because$/i.test(x));
  const k = b >= 0 ? b : w.findIndex(x => KEY.test(x));
  let pick;
  if (b >= 0) {
    pick = [];
    for (const x of w.slice(b + 1, b + 10)) { if (pick.length >= 3 && /^(and|but|so|then)$/i.test(x)) break; pick.push(x); }
  } else if (k >= 0) pick = w.slice(Math.max(0, k - 3), k + 5);
  else pick = w.slice(-7);
  // Don't stop on a word that leaves the thought hanging ("…for what I").
  while (pick.length > 3 && /^(I|the|a|an|to|for|of|what|and|but|my|that|with|so|was|in|on|at)$/i.test(pick[pick.length - 1])) pick.pop();
  if (pick.length < 3) return '';
  if (!/^I('|’|$)/.test(pick[0])) pick[0] = pick[0].charAt(0).toLowerCase() + pick[0].slice(1);
  return pick.join(' ');
}
// The interviews. lines[2] is the follow-up, built from the visitor's answer to lines[1].
// moves: which of Frank's moves each line is (for onMove); the probe is always 'track'.
export const SCRIPTS = {
  // "An app or subscription you stopped using" (V20).
  churn: {
    introBody: 'Frank will interview you about an app or subscription you stopped using. Four questions, about two minutes. Answer out loud, the way a customer would.',
    lines: [
      'Hi, I’m Frank. Thanks for being the customer today. Think of an app or subscription you stopped using recently. What was it, and what did you use it for?',
      'Got it. What happened that made you stop using it?',
      null,
      'If you could change one thing about it, what would it be?',
    ],
    followUp: e => (e ? `You said “${e}”. Can you tell me more about that moment?` : 'Can you tell me more about that moment?'),
    moves: { 2: 'follow', 3: 'deeper' },
    themes: [
      [/pric|expens|cost|money|afford|cheaper|paying|fee/i, 'Price versus value'],
      [/switch|alternative|instead|another (app|tool)|moved to|replaced/i, 'Switched to an alternative'],
      [/bug|crash|broke|glitch|didn'?t work|error|slow/i, 'Reliability'],
      [/complicat|confus|hard|difficult|steps|annoy|clunky|setup|set up|learn|time/i, 'Too much effort'],
      [/(didn'?t|don'?t|no longer|stopped) need|not using|forgot|rarely/i, 'The need went away'],
    ],
  },
  // "Why you'd like to use Frank" (V19, Interview example).
  whyFrank: {
    introBody: 'Frank will ask why you’d like to use him. Three questions and a follow-up, about two minutes. Answer out loud, the way a customer would.',
    lines: [
      'Hi, I’m Frank. Thanks for trying this. What made you curious about Frank today?',
      'How do you find out why your customers do what they do today?',
      null,
      'And why does getting that answer matter to you right now?',
    ],
    followUp: e => (e ? `You said “${e}”. What makes that hard?` : 'What makes that hard today?'),
    moves: { 2: 'follow', 3: 'deeper' },
    themes: [
      [/slow|weeks|time|fast|quick|days|months/i, 'Getting answers faster'],
      [/schedul|recruit|calls?\b|no.?shows?|calendar|book/i, 'No more scheduling calls'],
      [/scale|more (customers|people|users)|hundreds|enough|sample/i, 'Hearing from more customers'],
      [/survey|guess|data|analytics|numbers|dashboards?/i, 'The why behind the numbers'],
      [/budget|cost|expensive|agency|agencies|money/i, 'Research within budget'],
    ],
  },
};
const PROBE = 'Could you say a little more about that?';
const OUTRO = 'That’s really helpful, thank you. That’s everything I needed today.';
const OUTRO_TIME = 'We’re at two minutes, so I’ll stop there. That was really helpful, thank you.';
const themeOf = (themes, text) => (themes.find(([re]) => re.test(text)) || [null, 'Something to dig into'])[1];
const clip = (t, n = 180) => (t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t);
const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// A clear English voice, if the system has one we know.
function pickVoice() {
  const vs = window.speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang));
  const pref = [/Samantha/, /Google US English/, /Aria|Jenny|Guy/, /Daniel/, /Karen|Moira|Tessa/];
  for (const re of pref) { const v = vs.find(x => re.test(x.name)); if (v) return v; }
  return vs.find(v => /en-US/i.test(v.lang)) || vs[0] || null;
}

export default function LiveInterview({ open, onClose, reduced, script = SCRIPTS.churn }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{open && <Room key="room" onClose={onClose} reduced={reduced} script={script} />}</AnimatePresence>,
    document.body,
  );
}

// The room on its own, set in the page (no overlay, no page lock, no close button).
export const InterviewRoom = props => <Room inline {...props} />;

function Room({ onClose, reduced, script = SCRIPTS.churn, inline = false, onMove, onPhase, className = '', skin = 'room' }) {
  const { lines: LINES } = script;
  const titleId = inline ? 'ie-room-title' : 'li-title';
  const [phase, setPhase] = useState('intro');      // intro · live · done
  const typed = false;                               // voice only
  const [menu, setMenu] = useState(false);           // the microphone popover is open
  const [asking, setAsking] = useState(false);       // waiting for the browser's prompt
  const [hasMic, setHasMic] = useState(false);       // the microphone is on
  const [muted, setMuted] = useState(false);         // the widget's mic button: on, but not listening
  const mutedRef = useRef(false);
  const [micNote, setMicNote] = useState('');        // why it's still off, after trying again
  const [turn, setTurn] = useState('frank');         // frank · you · thinking
  const [nod, setNod] = useState(0);                 // the widget's glasses nod at each of Frank's moves
  const [msgs, setMsgs] = useState([]);              // { who: 'frank' | 'you', text }
  const [heard, setHeard] = useState({ final: '', interim: '' });
  const [draft, setDraft] = useState('');
  const [secs, setSecs] = useState(0);

  const panel = useRef(null), startBtn = useRef(null), micBtn = useRef(null), micRetry = useRef(null), doneBtn = useRef(null), field = useRef(null), meter = useRef(null);
  const alive = useRef(true);
  const step = useRef(0), probed = useRef(new Set()), byStep = useRef({});
  const rec = useRef(null), listening = useRef(false), silence = useRef(0), finalText = useRef(''), interimText = useRef('');
  const audio = useRef(null);  // { stream, ctx, raf }
  const typedRef = useRef(typed); typedRef.current = typed;
  const hasMicRef = useRef(false); hasMicRef.current = hasMic;
  const secsRef = useRef(0); secsRef.current = secs;

  // ——— Voice out
  const speak = useCallback(text => new Promise(resolve => {
    const est = 1500 + words(text).length * 420;
    if (!CAN_SPEAK) { setTimeout(resolve, Math.min(est, 9000)); return; }
    const s = window.speechSynthesis;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) u.voice = v;
    u.rate = 1.02;
    let done = false;
    const fin = () => { if (!done) { done = true; clearTimeout(safety); resolve(); } };
    const safety = setTimeout(fin, est + 2500); // some voices never report the end
    u.onend = fin; u.onerror = fin;
    s.speak(u);
  }), []);

  // ——— Voice in
  const stopListening = useCallback(() => {
    listening.current = false;
    clearTimeout(silence.current);
    try { rec.current?.stop(); } catch { /* already stopped */ }
  }, []);

  const finishAnswer = useRef(null);
  const micLost = useRef(null);
  const listen = useCallback(() => {
    finalText.current = ''; interimText.current = '';
    setHeard({ final: '', interim: '' }); setDraft('');
    setTurn('you');
    if (!hasMicRef.current || !SR) { requestAnimationFrame(() => micRetry.current?.focus()); return; }
    if (mutedRef.current) return;
    requestAnimationFrame(() => doneBtn.current?.focus());
    const r = new SR();
    r.lang = 'en-US'; r.continuous = true; r.interimResults = true;
    r.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText.current += res[0].transcript.trim() + ' ';
        else interim += res[0].transcript;
      }
      interimText.current = interim;
      setHeard({ final: finalText.current, interim });
      clearTimeout(silence.current);
      if ((finalText.current + interim).trim()) silence.current = setTimeout(() => finishAnswer.current?.(), SILENCE_MS);
    };
    r.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'network' || e.error === 'audio-capture') {
        listening.current = false;
        micLost.current?.();
      }
    };
    // Recognition stops on its own after a while; keep it going until the answer is done.
    r.onend = () => { if (listening.current && alive.current) { try { r.start(); } catch { /* restarting */ } } };
    rec.current = r; listening.current = true;
    try { r.start(); } catch { /* already started */ }
  }, []);

  // ——— The conversation
  const ask = useCallback(async (text, last = false, move = null) => {
    setMsgs(m => [...m, { who: 'frank', text }]);
    setTurn('frank');
    if (move) { onMove?.(move); setNod(n => n + 1); }
    await speak(text);
    if (!alive.current) return;
    if (last) { setPhase('done'); return; }
    listen();
  }, [speak, listen, onMove]);

  const answer = useCallback(text => {
    text = text.trim();
    if (!text) return;
    stopListening();
    const s = step.current;
    byStep.current[s] = ((byStep.current[s] || '') + ' ' + text).trim();
    setMsgs(m => [...m, { who: 'you', text }]);
    setTurn('thinking');
    setTimeout(() => {
      if (!alive.current) return;
      if (secsRef.current >= LIMIT) { ask(OUTRO_TIME, true); return; }
      if ((s === 0 || s === 1) && words(text).length < 4 && !probed.current.has(s)) {
        probed.current.add(s); ask(PROBE, false, 'track'); return;
      }
      const next = s + 1;
      step.current = next;
      if (next >= LINES.length) ask(OUTRO, true);
      else ask(next === 2 ? script.followUp(echoOf(byStep.current[1] || text)) : LINES[next], false, script.moves[next] || null);
    }, reduced ? 200 : 700);
  }, [ask, stopListening, reduced, script, LINES]);
  finishAnswer.current = () => answer(finalText.current + ' ' + interimText.current);

  // ——— Microphone level (and the permission prompt), voice mode only
  const openMic = useCallback(async () => {
    if (audio.current) return true;
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (let i = 0; i < buf.length; i++) { const d = (buf[i] - 128) / 128; sum += d * d; }
        const level = Math.min(1, Math.sqrt(sum / buf.length) * 6);
        meter.current?.style.setProperty('--lvl', level.toFixed(3));
        audio.current.raf = requestAnimationFrame(tick);
      };
      audio.current = { stream, ctx, raf: requestAnimationFrame(tick) };
      return true;
    } catch { return false; }
  }, []);
  const closeMic = useCallback(() => {
    const a = audio.current; if (!a) return;
    cancelAnimationFrame(a.raf);
    a.stream.getTracks().forEach(t => t.stop());
    a.ctx.close().catch(() => {});
    audio.current = null;
  }, []);

  // The microphone popover: "Start interview" opens it; "Turn on microphone" asks the browser, then the
  // call opens whether or not the microphone came on.
  const openMenu = () => { setAsking(false); setMenu(true); };
  const closeMenu = () => { setMenu(false); requestAnimationFrame(() => startBtn.current?.focus()); };
  const turnOnMic = useCallback(async () => {
    if (CAN_SPEAK) window.speechSynthesis.getVoices(); // load voices while the mic prompt shows
    setAsking(true);
    const ok = SR && !FRAMED_NO_MIC ? await openMic() : false;
    if (!alive.current) return;
    setAsking(false); setMenu(false);
    setHasMic(ok); hasMicRef.current = ok; setMicNote('');
    setMuted(false); mutedRef.current = false;
    step.current = 0; probed.current = new Set(); byStep.current = {};
    setMsgs([]); setSecs(0); setPhase('live');
    ask(LINES[0]);
  }, [openMic, ask, LINES]);
  // In the call: try the microphone again; if it comes on during the visitor's turn, start listening.
  const retryMic = async () => {
    if (!SR || FRAMED_NO_MIC) { setMicNote(MIC_OFF_NOTE); return; }
    const ok = await openMic();
    if (!alive.current) return;
    if (!ok) { setMicNote(MIC_BLOCKED_NOTE); return; }
    setHasMic(true); hasMicRef.current = true; setMicNote('');
    if (turn === 'you') listen();
  };
  // Without a microphone: move on to Frank's next question.
  const nextQuestion = () => {
    stopListening();
    const next = step.current + 1;
    step.current = next;
    setTurn('thinking');
    setTimeout(() => {
      if (!alive.current) return;
      if (next >= LINES.length) ask(OUTRO, true);
      else ask(next === 2 ? script.followUp('') : LINES[next], false, script.moves[next] || null);
    }, reduced ? 200 : 500);
  };
  useEffect(() => {
    if (!menu) return;
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); closeMenu(); } };
    const onDown = e => { if (!e.target.closest?.('[data-mic-pop]')) setMenu(false); };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown, true);
    return () => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('pointerdown', onDown, true); };
  }, [menu]);

  // The widget's mic button: mutes and unmutes (the stream goes silent, so the waveform rests too);
  // with the microphone off it asks for it again.
  const toggleMic = () => {
    if (!hasMic) { retryMic(); return; }
    const m = !mutedRef.current;
    mutedRef.current = m; setMuted(m);
    audio.current?.stream.getAudioTracks().forEach(t => { t.enabled = !m; });
    if (m) stopListening();
    else if (turn === 'you') listen();
  };
  // Without a microphone (the widget has no "Next question" button), Frank moves on after a pause.
  const nextRef = useRef(null); nextRef.current = nextQuestion;
  useEffect(() => {
    if (skin !== 'widget' || phase !== 'live' || turn !== 'you' || hasMic) return;
    const t = setTimeout(() => nextRef.current?.(), 6000);
    return () => clearTimeout(t);
  }, [skin, phase, turn, hasMic]);

  const skipFrank = () => { if (CAN_SPEAK) window.speechSynthesis.cancel(); };
  const endCall = () => {
    stopListening(); if (CAN_SPEAK) window.speechSynthesis.cancel();
    if (Object.keys(byStep.current).length) setPhase('done');
    else if (inline) again(); else onClose();
  };
  function again() { setPhase('intro'); setMsgs([]); setSecs(0); setTurn('frank'); onMove?.(null); }
  // The microphone stopped mid-call: the call goes on with the microphone shown as off.
  micLost.current = () => { stopListening(); closeMic(); setHasMic(false); hasMicRef.current = false; setMicNote(MIC_BLOCKED_NOTE); };

  // Tell the page which phase the call is in (V19 goes full screen while it runs).
  useEffect(() => { onPhase?.(phase); }, [phase, onPhase]);

  // The call clock; at the limit, a pending answer is taken as it stands and Frank wraps up.
  useEffect(() => {
    if (phase !== 'live') return;
    const id = setInterval(() => setSecs(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase !== 'live' || secs < LIMIT || turn !== 'you') return;
    const said = (finalText.current + ' ' + interimText.current + ' ' + draft).trim();
    if (said) answer(said); else { stopListening(); ask(OUTRO_TIME, true); }
  }, [secs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving the call: stop speaking, listening and the microphone.
  useEffect(() => {
    if (phase === 'done') { stopListening(); closeMic(); }
  }, [phase, stopListening, closeMic]);
  useEffect(() => {
    alive.current = true; // set again on mount: React's dev double-mount runs the cleanup once
    return () => {
      alive.current = false;
      listening.current = false;
      clearTimeout(silence.current);
      try { rec.current?.abort(); } catch { /* not running */ }
      if (CAN_SPEAK) window.speechSynthesis.cancel();
      closeMic();
    };
  }, [closeMic]);

  // Dialog behaviour (pop-up only): page scroll locked, Escape closes, Tab stays inside, focus starts
  // on the main action. Inline, the room is part of the page and takes focus only when used.
  useEffect(() => {
    if (inline) return;
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = [...panel.current.querySelectorAll('button:not([disabled]), a[href], textarea, [tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { html.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [onClose, inline]);
  const started = useRef(false);
  useEffect(() => {
    if (menu) { if (!asking) micBtn.current?.focus(); return; }
    if (phase !== 'intro') { started.current = true; return; }
    if (!inline || started.current) startBtn.current?.focus();
  }, [phase, inline, asking, menu]);

  const lastFrank = [...msgs].reverse().find(m => m.who === 'frank');
  const pose = menu ? 'Curious'
    : phase === 'intro' ? 'Welcome'
    : phase === 'done' ? 'Grateful'
    : turn === 'thinking' ? 'Thinking'
    : turn === 'you' ? 'Listening'
    : lastFrank?.text === PROBE ? 'Curious' : 'Attentive';
  const speaking = phase === 'live' && turn === 'frank';
  const left = Math.max(0, LIMIT - secs);

  // Headings: the pop-up is its own document (h2); inline the room sits under the section's h2 (h3).
  const H = inline ? 'h3' : 'h2';
  const body = (
      <>
        {/* Top bar: the call's status and time left, and close (pop-up only). */}
        <div className="flex items-center gap-2 px-5 pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] tabular-nums text-white/85">
            <span aria-hidden="true" className={'size-1.5 rounded-full ' + (phase === 'live' ? 'tmn-live bg-[#ff5a5f]' : 'bg-white/40')} />
            {phase === 'live' ? <>Live · {clock(secs)}<span className="sr-only">, {clock(left)} left</span></> : phase === 'done' ? `Interview ended · ${clock(secs)}` : 'Live interview · 2 min'}
          </span>
          {phase === 'live' && (
            <span aria-hidden="true" className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full origin-left rounded-full bg-[#d1f899] transition-transform duration-1000 ease-linear" style={{ transform: `scaleX(${Math.min(1, secs / LIMIT)})` }} />
            </span>
          )}
          {!inline && <button type="button" onClick={onClose} aria-label="Close live interview"
            className="ml-auto grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <X className="size-4" />
          </button>}
        </div>

        {/* Frank */}
        <div className={'flex flex-col items-center px-6 ' + (phase === 'done' ? 'pt-4' : 'pt-8')}>
          <div className={'relative grid place-items-center rounded-full bg-[#1c202b] ' + (phase === 'done' ? 'size-[72px]' : 'size-[112px]')}>
            {speaking && !reduced && [0, 1].map(i => (
              <motion.span key={i} aria-hidden="true" className="absolute inset-0 rounded-full border border-solid border-[#d1f899]/50"
                animate={{ transform: ['scale(1)', 'scale(1.5)'], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.9 }} />
            ))}
            <span className="block w-[58%]" aria-hidden="true">
              <FrankGlasses pose={pose} ink="#fffdf3" follow={false} shift={false} blink reducedMotion={reduced} />
            </span>
          </div>
          <span className="mt-3 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] text-white/85">Frank · AI Researcher</span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'intro' && (
              <motion.div key="intro" className="flex flex-1 flex-col items-center px-8 pb-7 pt-6 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <H id={titleId} className="m-0 font-['Figtree',sans-serif] text-[30px] font-medium leading-[1.1] tracking-[-0.03em]">You’re the customer</H>
                <p className="m-0 mt-3 max-w-[38ch] text-[15px] leading-[1.55] text-white/75">{script.introBody}</p>
                <p className="m-0 mt-auto max-w-[44ch] text-[12.5px] leading-[1.5] text-white/50">
                  Uses your microphone. Your browser turns your speech into text; Frank doesn’t record or save anything.
                </p>
                <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2.5">
                  <button ref={startBtn} data-mic-pop type="button" onClick={() => (menu ? closeMenu() : openMenu())} aria-haspopup="dialog" aria-expanded={menu}
                    className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-[#d1f899] px-5 text-[15px] font-medium text-[#1a1714] transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    <Mic className="size-4" />Start interview
                  </button>

                  {/* The microphone popover, above the button, growing out of it. */}
                  <AnimatePresence>
                    {menu && (
                      <div data-mic-pop className="absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-[320px] max-w-[calc(100vw-48px)] -translate-x-1/2">
                        <motion.div role="dialog" aria-labelledby="mic-title" aria-describedby="mic-body"
                          className="relative rounded-[20px] bg-[#1c202b] p-5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10"
                          style={{ transformOrigin: '50% 100%' }}
                          initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(6px) scale(0.96)' }}
                          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                          exit={{ opacity: 0, transform: reduced ? 'none' : 'translateY(4px) scale(0.97)' }}
                          transition={{ duration: 0.2, ease: EASE }}>
                          <div className="flex items-start gap-3">
                            <span className="relative grid size-10 flex-none place-items-center rounded-full bg-[#d1f899] text-[#1a1714]">
                              {asking && !reduced && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#d1f899]/50" />}
                              <Mic className="relative size-[18px]" strokeWidth={1.75} />
                            </span>
                            <div>
                              <h4 id="mic-title" className="m-0 font-['Figtree',sans-serif] text-[17px] font-medium leading-[1.25] tracking-[-0.01em]">Turn on your microphone</h4>
                              <p id="mic-body" className="m-0 mt-1 text-[13.5px] leading-[1.5] text-white/65">
                                {asking ? 'Choose Allow in your browser’s prompt, next to the address bar.' : 'Frank interviews you by voice. When your browser asks, choose Allow.'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-end gap-2">
                            <button type="button" onClick={closeMenu}
                              className="inline-flex h-9 cursor-pointer items-center rounded-full border-0 bg-transparent px-3.5 text-[13.5px] text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                              Not now
                            </button>
                            <button ref={micBtn} type="button" onClick={turnOnMic} disabled={asking}
                              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-[#d1f899] px-4 text-[13.5px] font-medium text-[#1a1714] transition-[transform,opacity] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                              <Mic className="size-3.5" />{asking ? 'Waiting…' : 'Turn on microphone'}
                            </button>
                          </div>
                          {/* The pointer down to the button. */}
                          <span aria-hidden="true" className="absolute -bottom-[6px] left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#1c202b] shadow-[1px_1px_0_rgba(255,255,255,0.1)]" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {phase === 'live' && (
              <motion.div key="live" className="flex min-h-0 flex-1 flex-col px-7 pb-6 pt-5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <H id={titleId} className="sr-only">Live interview with Frank</H>
                <p className="m-0 text-center text-[12px] text-white/55" aria-hidden="true">
                  {turn === 'frank' ? 'Frank is speaking' : turn === 'thinking' ? 'Frank is thinking' : hasMic ? 'Listening — answer out loud' : 'Your turn — your microphone is off'}
                </p>
                {/* Frank's question, as a caption (and read to screen readers). */}
                <div className="mt-3 text-center" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {lastFrank && (
                      <motion.p key={msgs.lastIndexOf(lastFrank)} className="m-0 mx-auto max-w-[34ch] font-serif text-[19px] leading-[1.45] text-white"
                        initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                        {lastFrank.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* The visitor's answer: the live transcript. */}
                <div className="mt-auto">
                  {turn === 'you' && !hasMic && (
                    <div className="min-h-[3em] text-center" role="status">
                      <p className="m-0 text-[15px] leading-[1.5] text-white/90">Your microphone is off, so Frank can’t hear you.</p>
                      <p className="m-0 mx-auto mt-1 max-w-[42ch] text-[12.5px] leading-[1.5] text-white/50">{micNote || MIC_OFF_NOTE}</p>
                    </div>
                  )}
                  {turn === 'you' && hasMic && (
                    <p className="m-0 min-h-[3em] text-center text-[15px] leading-[1.5] text-white/90">
                      {heard.final}<span className="text-white/45">{heard.interim}</span>
                      {!heard.final && !heard.interim && <span className="text-white/40">Start talking…</span>}
                    </p>
                  )}
                  {/* Controls */}
                  <div className="mt-5 flex items-center justify-center gap-2.5">
                    {turn === 'you' && !hasMic && (
                      <>
                        <button ref={micRetry} type="button" onClick={retryMic}
                          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-white/10 px-4 text-[13.5px] text-white transition-colors duration-150 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                          <MicOff className="size-4 text-[#ff8a8f]" />Turn on mic
                        </button>
                        <button type="button" onClick={nextQuestion}
                          className="inline-flex h-9 cursor-pointer items-center rounded-full border-0 bg-white px-4 text-[13.5px] font-medium text-[#0e1016] transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                          Next question
                        </button>
                      </>
                    )}
                    {turn === 'you' && hasMic && (
                      <>
                        <span ref={meter} aria-hidden="true" className="flex h-9 items-center gap-[3px] rounded-full bg-white/10 px-3" style={{ '--lvl': 0 }}>
                          {[0.5, 0.8, 1, 0.8, 0.5].map((k, i) => (
                            <span key={i} className="w-[3px] rounded-full bg-[#d1f899] transition-[height] duration-75" style={{ height: `calc(4px + ${k * 16}px * var(--lvl))` }} />
                          ))}
                        </span>
                        <button ref={doneBtn} type="button" onClick={() => finishAnswer.current?.()}
                          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-white px-4 text-[13.5px] font-medium text-[#0e1016] transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                          <Check className="size-4" />Done answering
                        </button>
                      </>
                    )}
                    {turn === 'frank' && CAN_SPEAK && (
                      <button type="button" onClick={skipFrank}
                        className="inline-flex h-9 cursor-pointer items-center rounded-full border-0 bg-white/10 px-4 text-[13.5px] text-white transition-colors duration-150 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Skip to my turn
                      </button>
                    )}
                    <button type="button" onClick={endCall} aria-label="End interview"
                      className="grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-[#e5484d] text-white transition-transform duration-150 ease-out active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      <PhoneOff className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'done' && <Takeaway key="done" byStep={byStep.current} msgs={msgs} onAgain={again} onClose={onClose} themes={script.themes} H={H} titleId={titleId} />}
          </AnimatePresence>
        </div>

      </>
  );


  // ——— The widget skin (V21.11's Interview example): the same call as a voice widget. A double
  // bezel (a thin tinted shell holding the white core, concentric corners, no drop shadow). At its
  // heart the voice core: Frank's glasses in a lime orb over a 28-bar waveform, both answering the
  // call: rings pulse out and the bars ripple while Frank speaks, both follow your microphone level
  // while he listens, a dashed ring turns while he thinks, and they breathe while idle. Frank's line
  // reads as a caption under it, your words under that. The microphone popover rises from the start
  // button; the end shows what Frank took away.
  const WBTN = 'inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 px-4 text-[13.5px] transition-[background-color,transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:cursor-default disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714] ';
  const W_PRIMARY = WBTN + 'bg-[#1a1714] font-medium text-white hover:bg-[#2a2622]';
  const W_QUIET = WBTN + 'bg-[#1a1714]/[0.06] text-ink hover:bg-[#1a1714]/[0.1]';
  const listeningNow = phase === 'live' && turn === 'you' && hasMic && !muted;
  const mode = phase !== 'live' ? 'idle' : turn === 'frank' ? 'speak' : turn === 'thinking' ? 'think' : listeningNow ? 'listen' : 'idle';
  const status = phase === 'live'
    ? (turn === 'frank' ? 'Frank is speaking' : turn === 'thinking' ? 'Frank is thinking' : !hasMic ? 'Your turn' : muted ? 'Microphone muted' : 'Listening')
    : phase === 'done' ? 'Interview ended' : 'Ready when you are';
  const BARS = 28;
  const widgetBody = (
    <>
      {/* Top bar: who this is, and the call time. */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1714]/[0.05] px-2.5 py-1 text-[12px] text-ink-2">
          Frank<span className="text-ink-3">· Demo interview</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1714]/[0.05] px-2.5 py-1 text-[12px] tabular-nums text-ink-2" aria-live="off">
          {phase === 'live' && <span aria-hidden="true" className="tmn-live size-1.5 rounded-full bg-[#ff5a5f]" />}
          {phase === 'intro' ? '2 min' : clock(secs)}
          {phase === 'live' && <span className="sr-only">, {clock(left)} left</span>}
        </span>
      </div>

      {/* The voice core: the orb and the waveform, sharing your microphone level (--lvl). */}
      {phase !== 'done' && (
        <div ref={meter} className="flex flex-col items-center px-5 pt-7" style={{ '--lvl': 0 }}>
          {/* Frank's circle: 96px in V21.04 (104px before, then 80px). */}
          <div className="relative grid size-[96px] place-items-center">
            {listeningNow && <span aria-hidden="true" className="vw-halo absolute inset-0 rounded-full bg-[#d1f899]/50" />}
            {speaking && !reduced && [0, 1].map(i => (
              <motion.span key={i} aria-hidden="true" className="absolute inset-0 rounded-full border border-solid border-[#a0d05f]"
                animate={{ transform: ['scale(1)', 'scale(1.6)'], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: [0.23, 1, 0.32, 1], delay: i * 0.9 }} />
            ))}
            {phase === 'live' && turn === 'thinking' && !reduced && (
              <motion.span aria-hidden="true" className="absolute -inset-2 rounded-full border-[1.5px] border-dashed border-[#a0d05f]"
                animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
            )}
            <motion.span className="relative grid size-[96px] place-items-center rounded-full bg-[#d1f899] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-6px_14px_rgba(143,194,79,0.35)]"
              animate={mode === 'idle' && !reduced ? { transform: ['scale(1)', 'scale(1.03)', 'scale(1)'] } : { transform: 'scale(1)' }}
              transition={mode === 'idle' ? { duration: 3.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] } : { duration: 0.3 }}>
              {/* V21.04: Frank himself instead of the glasses: the first 3 seconds of his greeting video, looping,
                  muted, framed on his face inside a thin lime rim. Reduced motion: its first frame, still. */}
              <span className="absolute inset-[3px] overflow-hidden rounded-full bg-[#1a1714]" aria-hidden="true">
                {reduced
                  ? <img src="/videos/frank-greeting.jpg" alt="" className="size-full origin-[50%_32%] scale-[1.7] object-cover" />
                  : <video src="/videos/frank-greeting.mp4" poster="/videos/frank-greeting.jpg" autoPlay muted loop playsInline preload="auto"
                      className="size-full origin-[50%_32%] scale-[1.7] object-cover" />}
              </span>
            </motion.span>
          </div>
          <p className="m-0 mt-4 text-[12.5px] text-ink-3" aria-live="polite">{status}</p>
          <div aria-hidden="true" data-mode={mode}
            className={'vw-bars mt-3 flex h-9 w-full max-w-[300px] items-center justify-between transition-colors duration-300 '
              + (mode === 'speak' ? 'text-[#8fc24f]' : mode === 'listen' ? 'text-[#1a1714]' : 'text-[#1a1714]/25')}>
            {Array.from({ length: BARS }, (_, i) => {
              const c = (i - (BARS - 1) / 2) / ((BARS - 1) / 2);
              const k = (0.35 + 0.65 * (1 - c * c)) * (0.75 + 0.25 * Math.abs(Math.sin(i * 1.7)));
              return <span key={i} style={{ '--k': k.toFixed(3), '--d': `${-(i * 0.11).toFixed(2)}s` }} />;
            })}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {phase === 'intro' && (
          <motion.div key="intro" className="px-6 pb-2 pt-2 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <H id={titleId} className="m-0 font-['Figtree',sans-serif] text-[24px] font-medium leading-[1.15] tracking-[-0.02em] text-ink">Got two minutes?</H>
            <p className="m-0 mx-auto mt-2 max-w-[34ch] font-serif text-[15px] leading-[1.5] text-ink-2">Try a sample Frank interview: three quick questions, answered out loud.</p>
          </motion.div>
        )}
        {phase === 'live' && (
          <motion.div key="live" className="px-6 pb-2 pt-5 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <H id={titleId} className="sr-only">Live interview with Frank</H>
            <div className="flex min-h-[78px] items-start justify-center" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {lastFrank && (
                  <motion.p key={msgs.lastIndexOf(lastFrank)} className="m-0 max-w-[30ch] font-serif text-[18px] leading-[1.4] text-ink [text-wrap:balance]"
                    initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                    {lastFrank.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            {/* Your words, as Frank hears them; or why he can't. */}
            <div className="mx-auto mt-2 min-h-[46px] max-w-[34ch] text-[14px] leading-[1.5]">
              {turn === 'you' && hasMic && !muted && (
                <p className="m-0 text-ink-2">{heard.final}<span className="text-ink-3">{heard.interim}</span>
                  {!heard.final && !heard.interim && <span className="text-ink-3">Start talking…</span>}</p>
              )}
              {turn === 'you' && hasMic && muted && <p className="m-0 text-ink-3">Unmute to answer.</p>}
              {turn === 'you' && !hasMic && (
                <div role="status" className="rounded-[14px] bg-[#f6f5f1] px-3.5 py-2.5 text-left">
                  <p className="m-0 text-[13.5px] text-ink">Your microphone is off, so Frank can’t hear you.</p>
                  <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">{micNote || MIC_OFF_NOTE}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {phase === 'done' && <WidgetTakeaway key="done" byStep={byStep.current} onAgain={again} themes={script.themes} H={H} titleId={titleId} />}
      </AnimatePresence>

      {/* Controls. */}
      {phase !== 'done' && (
        <div className="relative mt-auto flex items-center justify-center gap-2 px-5 pb-5 pt-4">
          {phase === 'intro' && (
            <>
              {/* Start: the mic sits in its own circle at the button's end. V21.04: a quiet note under it that
                  nothing is needed first. */}
              <div className="flex flex-col items-center gap-4">
                <button ref={startBtn} data-mic-pop type="button" onClick={() => (menu ? closeMenu() : openMenu())} aria-haspopup="dialog" aria-expanded={menu} aria-describedby="ie-no-signup"
                  className="group inline-flex h-12 cursor-pointer items-center gap-3 rounded-full border-0 bg-[#1a1714] py-1.5 pl-5 pr-1.5 text-[14.5px] font-medium text-white transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2a2622] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
                  Start interview
                  <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#d1f899] text-[#1a1714] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:scale-105">
                    <Mic className="size-4" strokeWidth={1.75} />
                  </span>
                </button>
                <p id="ie-no-signup" className="m-0 text-[12.5px] text-ink-3">No sign-up needed</p>
              </div>
              {/* The microphone popover, rising from the start button. */}
              <AnimatePresence>
                {menu && (
                  <div data-mic-pop className="absolute bottom-[calc(100%-4px)] left-1/2 z-10 w-[328px] max-w-[calc(100%-24px)] -translate-x-1/2">
                    <motion.div role="dialog" aria-labelledby="mic-title" aria-describedby="mic-body"
                      className="rounded-[18px] bg-white p-4 text-left ring-1 ring-[#1a1714]/[0.08] shadow-[0_18px_44px_-16px_rgba(26,23,20,0.35)]"
                      style={{ transformOrigin: '50% 100%' }}
                      initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(6px) scale(0.96)' }}
                      animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                      exit={{ opacity: 0, transform: reduced ? 'none' : 'translateY(4px) scale(0.97)' }}
                      transition={{ duration: 0.2, ease: EASE }}>
                      <div className="flex items-start gap-3">
                        <span className="relative grid size-9 flex-none place-items-center rounded-full bg-[#d1f899] text-[#1a1714]">
                          {asking && !reduced && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#d1f899]/60" />}
                          <Mic className="relative size-4" strokeWidth={1.75} />
                        </span>
                        <div>
                          <h4 id="mic-title" className="m-0 text-[15px] font-medium leading-snug text-ink">Turn on your microphone</h4>
                          <p id="mic-body" className="m-0 mt-1 text-[13px] leading-[1.5] text-ink-2">
                            {asking ? 'Choose Allow in your browser’s prompt, next to the address bar.' : 'Frank interviews you by voice. When your browser asks, choose Allow.'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-2">
                        <button type="button" onClick={closeMenu} className={W_QUIET + ' h-9'}>Not now</button>
                        <button ref={micBtn} type="button" onClick={turnOnMic} disabled={asking} className={W_PRIMARY + ' h-9'}>
                          <Mic className="size-3.5" />{asking ? 'Waiting…' : 'Turn on microphone'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </>
          )}
          {phase === 'live' && (
            <>
              {/* Two controls only: the microphone (mute, or turn it on) and End call. The mic shows as on (black) unless
                  muted; without a microphone it keeps that look and asks for it again. */}
              <button ref={micRetry} type="button" onClick={toggleMic} aria-pressed={hasMic ? muted : undefined}
                aria-label={!hasMic ? 'Turn on microphone' : muted ? 'Unmute microphone' : 'Mute microphone'}
                className={'grid size-12 cursor-pointer place-items-center rounded-full border-0 transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714] '
                  + (!muted ? 'bg-[#1a1714] text-white hover:bg-[#2a2622]' : 'bg-[#1a1714]/[0.06] text-[#d23f33] hover:bg-[#1a1714]/[0.1]')}>
                {!muted ? <Mic className="size-[18px]" strokeWidth={1.75} /> : <MicOff className="size-[18px]" strokeWidth={1.75} />}
              </button>
              <button type="button" onClick={endCall}
                className="inline-flex h-12 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border-0 bg-[#d23f33] px-6 text-[15px] font-medium text-white transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#bf372c] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
                <PhoneOff className="size-[18px]" strokeWidth={1.75} />End call
              </button>
            </>
          )}
        </div>
      )}
    </>
  );

  if (skin === 'widget') {
    // The double bezel: a thin tinted shell (32px corners) around the white core (26px, concentric).
    return (
      <div className={'rounded-[32px] bg-white/50 p-1.5 ring-1 ring-[#1a1714]/[0.06] shadow-[0_1px_1px_rgba(26,23,20,0.03),0_2px_4px_rgba(26,23,20,0.03),0_8px_16px_-4px_rgba(26,23,20,0.04),0_24px_48px_-12px_rgba(26,23,20,0.06),0_48px_96px_-24px_rgba(26,23,20,0.08)] ' + className}>
        <div ref={panel} role="region" aria-labelledby={titleId}
          className={'relative flex flex-col rounded-[26px] ' + (phase === 'intro' ? '' : 'min-h-[540px] ') + 'bg-white text-left font-sans text-ink shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(26,23,20,0.04)]'}>
          {widgetBody}
        </div>
      </div>
    );
  }
  const surface = 'relative flex flex-col overflow-hidden bg-[#0e1016] text-left font-sans text-white';
  if (inline) {
    return (
      <div ref={panel} role="region" aria-labelledby={titleId} className={surface + ' ' + className}>{body}</div>
    );
  }
  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-[#0e1016]/55 p-4 backdrop-blur-[6px]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}
        initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(12px) scale(0.98)' }}
        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
        exit={{ opacity: 0, transform: reduced ? 'none' : 'translateY(8px) scale(0.98)' }}
        transition={{ duration: 0.28, ease: EASE }}
        className={surface + ' h-[min(660px,calc(100svh-32px))] w-[min(560px,100%)] rounded-[26px] shadow-[0_40px_100px_-30px_rgba(14,16,22,0.7)]'}>
        {body}
      </motion.div>
    </motion.div>
  );
}

// What Frank took away: the theme, the visitor's own words behind it, and the full transcript.
function Takeaway({ byStep, msgs, onAgain, onClose, themes, H = 'h2', titleId = 'li-title' }) {
  const reason = byStep[1] || byStep[0] || '';
  const quote = clip(byStep[1] || byStep[2] || byStep[0] || '');
  const again = useRef(null);
  useEffect(() => { again.current?.focus(); }, []);
  return (
    <motion.div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <H id={titleId} className="m-0 text-center font-['Figtree',sans-serif] text-[24px] font-medium leading-[1.15] tracking-[-0.03em]">Thanks for being the customer</H>
      <p className="m-0 mt-1.5 text-center text-[13.5px] text-white/60">Here’s what Frank took away.</p>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-[16px] bg-[#fbfaf6] p-4 text-[#1a1714] [scrollbar-width:thin]">
        <p className="m-0 text-[11.5px] text-[#8a8378]">Theme</p>
        <p className="m-0 mt-0.5 text-[15px] font-medium">{themeOf(themes, reason)}</p>
        {quote && (
          <div className="mt-3 rounded-[10px] border border-solid border-[#e9e5dc] bg-white px-3 py-2.5">
            <p className="m-0 font-serif text-[14px] leading-snug">“{quote}”</p>
            <p className="m-0 mt-1.5 text-[11px] text-[#8a8378]">You · just now</p>
          </div>
        )}
        <p className="m-0 mt-4 text-[11.5px] text-[#8a8378]">Transcript</p>
        <ul className="m-0 mt-1.5 list-none space-y-2 p-0">
          {msgs.map((m, i) => (
            <li key={i} className="text-[13px] leading-[1.45]">
              <span className={'mr-1.5 font-medium ' + (m.who === 'frank' ? 'text-[#5b554c]' : 'text-[#1a1714]')}>{m.who === 'frank' ? 'Frank' : 'You'}</span>
              <span className={m.who === 'frank' ? 'text-[#5b554c]' : ''}>{m.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <a href="#signup" onClick={onClose}
          className="inline-flex h-11 items-center rounded-full bg-[#d1f899] px-5 text-[14.5px] font-medium text-[#1a1714] no-underline transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Sign up to interview your customers
        </a>
        <button ref={again} type="button" onClick={onAgain}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-white/10 px-5 text-[14.5px] text-white transition-colors duration-150 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <RotateCcw className="size-4" />Try again
        </button>
      </div>
    </motion.div>
  );
}

// The widget's ending: what Frank took away, compactly, on the light card.
function WidgetTakeaway({ byStep, onAgain, themes, H = 'h3', titleId }) {
  const reason = byStep[1] || byStep[0] || '';
  const quote = clip(byStep[1] || byStep[2] || byStep[0] || '');
  const again = useRef(null);
  useEffect(() => { again.current?.focus(); }, []);
  return (
    <motion.div className="px-5 pb-5 pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <H id={titleId} className="m-0 font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">Thanks for being the customer</H>
      <p className="m-0 mt-1 text-[13px] text-ink-3">Here’s what Frank took away.</p>
      <div className="mt-3.5 rounded-[14px] bg-[#f6f5f1] p-3.5">
        <p className="m-0 text-[11.5px] text-ink-3">Theme</p>
        <p className="m-0 mt-0.5 text-[15px] font-medium text-ink">{themeOf(themes, reason)}</p>
        {quote && <p className="m-0 mt-2.5 font-serif text-[14px] leading-snug text-ink-2">“{quote}”</p>}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button ref={again} type="button" onClick={onAgain}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-[#1a1714]/[0.06] px-3.5 text-[13px] text-ink transition-colors duration-150 hover:bg-[#1a1714]/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
          <RotateCcw className="size-3.5" />Try again
        </button>
        <a href="#signup" className="inline-flex h-9 items-center rounded-full bg-[#1a1714] px-3.5 text-[13px] font-medium text-white no-underline transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
          Interview your customers
        </a>
      </div>
    </motion.div>
  );
}
