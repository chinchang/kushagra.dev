/* app.js — boots the keyboard + music-fx on the hero and wires the audio chip. */

(function () {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const kbdContainer = hero.querySelector('[data-keyboard]');
  if (window.VibeTypeFx) window.VibeTypeFx.mount(hero);
  if (kbdContainer && window.VibeTypeKeyboard) window.VibeTypeKeyboard.mount(kbdContainer);

  /* ---------- Audio chip ---------------------------------------- */

  const chip = document.getElementById('audioChip');
  if (chip && window.VibeTypeSynth) {
    const syncChip = () => {
      const on = window.VibeTypeSynth.isOn();
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      chip.querySelector('.audio-chip__label').textContent =
        on ? 'Sound on · press M to mute' : 'Click to hear it';
    };
    syncChip();

    chip.addEventListener('click', () => {
      if (window.VibeTypeSynth.isOn()) window.VibeTypeSynth.disable();
      else window.VibeTypeSynth.enable();
      syncChip();
    });

    window.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (t && t.isContentEditable) return;
      if (e.key.toLowerCase() === 'm') {
        if (window.VibeTypeSynth.isOn()) window.VibeTypeSynth.disable();
        else window.VibeTypeSynth.enable();
        syncChip();
        e.preventDefault();
      }
    });
  }
})();
