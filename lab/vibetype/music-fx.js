/* music-fx.js — spawns drifting musical-note glyphs whenever the keyboard
   fires `vibetype:keypress`. Also triggers synth.js playNote(). */

(function () {
  'use strict';

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NOTE_GLYPHS = ['♪', '♫', '♩', '♬'];

  function emitGlyph(layer, x, y) {
    const el = document.createElement('span');
    el.className = 'note-glyph';
    el.textContent = NOTE_GLYPHS[Math.floor(Math.random() * NOTE_GLYPHS.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    layer.appendChild(el);
    setTimeout(() => el.remove(), reduceMotion() ? 1500 : 2400);
  }

  function mount(hero) {
    const layer = hero.querySelector('[data-music-fx]');
    if (!layer) return () => {};

    function onKeypress(e) {
      const d = e.detail || {};
      if (window.VibeTypeSynth && typeof d.note === 'number') {
        window.VibeTypeSynth.playNote(d.note);
      }
      emitGlyph(layer, d.originX || 0, d.originY || 0);
    }

    hero.addEventListener('vibetype:keypress', onKeypress);
    return function teardown() {
      hero.removeEventListener('vibetype:keypress', onKeypress);
    };
  }

  window.VibeTypeFx = { mount };
})();
