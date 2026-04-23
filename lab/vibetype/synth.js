/* synth.js — tiny Web Audio synth with a soft attack/release envelope.
   Muted until the user clicks the audio chip (autoplay policy).

   Exposes window.VibeTypeSynth:
     - enable()   → user gesture; create/resume AudioContext, persist on.
     - disable()  → mute and persist off.
     - toggle()   → flip.
     - isOn()     → boolean.
     - playNote(freq) → if on, play a pentatonic note (soft marimba-ish). */

(function () {
  'use strict';

  const KEY = 'vibetype:audio';
  let ctx = null;
  let masterGain = null;
  let on = false;

  function ensureContext() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function enable() {
    const c = ensureContext();
    if (!c) return false;
    if (c.state === 'suspended') c.resume();
    on = true;
    try { localStorage.setItem(KEY, 'on'); } catch {}
    return true;
  }

  function disable() {
    on = false;
    try { localStorage.setItem(KEY, 'off'); } catch {}
  }

  function toggle() { return on ? (disable(), false) : enable(); }
  function isOn() { return on; }

  function playNote(freq) {
    if (!on || !ctx || !masterGain) return;
    const now = ctx.currentTime;

    // Main tone — triangle for a soft, woody timbre.
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    // A subtle sine an octave up adds sparkle.
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = freq * 2;

    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, now);
    voice.gain.exponentialRampToValueAtTime(0.6, now + 0.008);
    voice.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.08;

    osc.connect(voice).connect(masterGain);
    shimmer.connect(shimmerGain).connect(voice);

    osc.start(now);
    shimmer.start(now);
    osc.stop(now + 1.7);
    shimmer.stop(now + 1.7);
  }

  // Boot: we never auto-resume audio (autoplay policy). We only read the
  // last-known preference so the chip's visual state reflects reality.
  // Actual sound requires a user click that calls enable().
  let lastPref = null;
  try { lastPref = localStorage.getItem(KEY); } catch {}

  window.VibeTypeSynth = {
    enable, disable, toggle, isOn, playNote,
    lastPreference: lastPref,
  };
})();
