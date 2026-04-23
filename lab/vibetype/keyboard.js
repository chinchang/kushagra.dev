/* keyboard.js — builds a skeuomorphic key row and auto-presses keys on a
   jittered interval. Exposes VibeTypeKeyboard.mount(container, opts) which
   returns a teardown fn. Each press dispatches `vibetype:keypress` on the
   container with { detail: { key, keyEl, note, rect } } so music-fx.js
   can render a variant-specific emission at the right position.

   Notes map to a C-major pentatonic (C4, D4, E4, G4, A4) plus their
   octave. `keyboard.js` only decides *which* note each key plays; the
   actual audio is handled by synth.js and is gated behind user click. */

(function () {
  'use strict';

  // Keycaps — spells out V-I-B-E  T-Y-P-E with a few extras to fill the row.
  const KEYS = ['V', 'I', 'B', 'E', 'T', 'Y', 'P', 'E'];

  // Pentatonic scale — no dissonance no matter which keys fire.
  const SCALE = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function mount(container, opts) {
    if (!container) return () => {};
    opts = opts || {};
    const minGap = opts.minGap || 380;
    const maxGap = opts.maxGap || 1100;

    // Build key DOM.
    container.innerHTML = '';
    const keys = KEYS.map((label, i) => {
      const btn = document.createElement('span');
      btn.className = 'key';
      const legend = document.createElement('span');
      legend.className = 'key__legend';
      legend.textContent = label;
      btn.appendChild(legend);
      btn.dataset.note = String(SCALE[i % SCALE.length]);
      btn.dataset.index = String(i);
      container.appendChild(btn);
      return btn;
    });

    let timer = null;
    let lastIndex = -1;
    let alive = true;

    function pressOne() {
      if (!alive || !keys.length) return;
      // Pick a random key, avoid immediate repeats.
      let idx;
      do { idx = Math.floor(Math.random() * keys.length); }
      while (keys.length > 1 && idx === lastIndex);
      lastIndex = idx;

      const keyEl = keys[idx];
      const note = parseFloat(keyEl.dataset.note);

      keyEl.classList.add('is-pressed');

      // Position the emission origin above the pressed key, expressed
      // relative to the kbd-stage (the FX layer's coordinate space).
      const stage = container.parentElement;
      const stageRect = stage ? stage.getBoundingClientRect() : { left: 0, top: 0, width: 0 };
      const keyRect = keyEl.getBoundingClientRect();
      const originX = keyRect.left + keyRect.width / 2 - stageRect.left;
      const originY = keyRect.top - stageRect.top;

      container.dispatchEvent(new CustomEvent('vibetype:keypress', {
        bubbles: true,
        detail: { key: keyEl.textContent, keyEl, note, originX, originY },
      }));

      setTimeout(() => {
        keyEl.classList.remove('is-pressed');
      }, reduceMotion() ? 240 : 130);
    }

    function schedule() {
      if (!alive) return;
      const delay = reduceMotion()
        ? rand(maxGap, maxGap + 800)
        : rand(minGap, maxGap);
      timer = setTimeout(() => {
        pressOne();
        schedule();
      }, delay);
    }

    // Small initial delay so a variant-swap doesn't flash a press immediately.
    timer = setTimeout(schedule, 250);

    return function teardown() {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }

  window.VibeTypeKeyboard = { mount, KEYS, SCALE };
})();
