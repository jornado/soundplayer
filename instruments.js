// ============ INSTRUMENT DEFINITIONS ============
// All Tone.js instrument configurations

let instruments = {};
let audioUnlocked = false;

// Detect iOS/Safari
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Show iOS unlock if needed
function checkAudioContext() {
    if (isIOS() && Tone.context.state !== 'running') {
        document.getElementById('iosUnlock').classList.remove('hidden');
    }
}

async function initAudio() {
    if (instruments.poly) return;

    // Ensure audio context is started
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
    audioUnlocked = true;

    // ============ POLYPHONIC SYNTHS ============

    // Default polyphonic synth for chords
    instruments.poly = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.5 }
    }).toDestination();
    instruments.poly.volume.value = -6;

    // Supersaw
    instruments.supersaw = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 }
    }).toDestination();
    instruments.supersaw.volume.value = -10;

    // Pad
    instruments.pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2 }
    }).toDestination();
    instruments.pad.volume.value = -8;

    // Organ
    instruments.organ = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.1 }
    }).toDestination();
    instruments.organ.volume.value = -8;

    // Strings (slow attack pad)
    instruments.strings = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.8, decay: 0.3, sustain: 0.7, release: 1.5 }
    }).toDestination();
    instruments.strings.volume.value = -10;

    // Brass stab
    instruments.brass = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.3 }
    }).toDestination();
    instruments.brass.volume.value = -8;

    // ============ MONOPHONIC SYNTHS ============

    // Reese bass
    instruments.reese = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.3 },
        filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5, baseFrequency: 200, octaves: 2 }
    }).toDestination();
    instruments.reese.volume.value = -6;

    // Lead
    instruments.lead = new Tone.MonoSynth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
        filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.3, baseFrequency: 300, octaves: 3 }
    }).toDestination();
    instruments.lead.volume.value = -8;

    // 303 acid
    instruments.acid303 = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.1 },
        filterEnvelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.2, baseFrequency: 150, octaves: 4 }
    }).toDestination();
    instruments.acid303.volume.value = -6;

    // Sub bass (pure sine)
    instruments.sub = new Tone.MonoSynth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.5 }
    }).toDestination();
    instruments.sub.volume.value = -4;

    // Wobble bass
    instruments.wobble = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.3 },
        filterEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.5, baseFrequency: 100, octaves: 3 }
    }).toDestination();
    instruments.wobble.volume.value = -6;

    // ============ FM SYNTHS ============

    // 808 bass
    instruments.bass808 = new Tone.MembraneSynth({
        pitchDecay: 0.08,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 1.4 }
    }).toDestination();
    instruments.bass808.volume.value = -4;

    // FM bass
    instruments.fmbass = new Tone.FMSynth({
        harmonicity: 1,
        modulationIndex: 3,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.3 },
        modulation: { type: 'square' },
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.3 }
    }).toDestination();
    instruments.fmbass.volume.value = -6;

    // Bell/FM
    instruments.bell = new Tone.FMSynth({
        harmonicity: 8,
        modulationIndex: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 1.4, sustain: 0, release: 0.2 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.2 }
    }).toDestination();
    instruments.bell.volume.value = -8;

    // ============ OTHER SYNTHS ============

    // Pluck
    instruments.pluck = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.9
    }).toDestination();
    instruments.pluck.volume.value = -6;

    // ============ DRUMS ============

    instruments.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 8,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
    }).toDestination();
    instruments.kick.volume.value = -4;

    instruments.snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
    }).toDestination();
    instruments.snare.volume.value = -8;

    instruments.hihat = new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
    }).toDestination();
    instruments.hihat.volume.value = -12;

    instruments.clap = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 }
    }).toDestination();
    instruments.clap.volume.value = -10;

    instruments.openhat = new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
    }).toDestination();
    instruments.openhat.volume.value = -12;

    instruments.rim = new Tone.MembraneSynth({
        pitchDecay: 0.008, octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();
    instruments.rim.volume.value = -6;

    instruments.tom = new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 4,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.2 }
    }).toDestination();
    instruments.tom.volume.value = -6;

    instruments.crash = new Tone.MetalSynth({
        frequency: 300,
        envelope: { attack: 0.001, decay: 1.5, release: 0.3 },
        harmonicity: 5.1, modulationIndex: 40, resonance: 4000, octaves: 1.5
    }).toDestination();
    instruments.crash.volume.value = -10;

    // ============ PERCUSSION ============

    instruments.shaker = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.03 }
    }).toDestination();
    instruments.shaker.volume.value = -14;

    instruments.tamb = new Tone.MetalSynth({
        frequency: 300, harmonicity: 8, modulationIndex: 20,
        resonance: 1000, octaves: 0.5,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }
    }).toDestination();
    instruments.tamb.volume.value = -16;

    instruments.cowbell = new Tone.MetalSynth({
        frequency: 560, harmonicity: 4, modulationIndex: 8,
        resonance: 2000, octaves: 0.5,
        envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
    }).toDestination();
    instruments.cowbell.volume.value = -10;

    instruments.conga = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 }
    }).toDestination();
    instruments.conga.volume.value = -6;

    instruments.congalow = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 }
    }).toDestination();
    instruments.congalow.volume.value = -6;

    instruments.bongo = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.03 }
    }).toDestination();
    instruments.bongo.volume.value = -6;

    instruments.bongolow = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.03 }
    }).toDestination();
    instruments.bongolow.volume.value = -6;

    instruments.woodblock = new Tone.MembraneSynth({
        pitchDecay: 0.005, octaves: 1,
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 }
    }).toDestination();
    instruments.woodblock.volume.value = -4;

    instruments.triangle = new Tone.MetalSynth({
        frequency: 800, harmonicity: 12, modulationIndex: 2,
        resonance: 6000, octaves: 1,
        envelope: { attack: 0.001, decay: 0.8, sustain: 0.1, release: 0.5 }
    }).toDestination();
    instruments.triangle.volume.value = -14;

    instruments.maracas = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 }
    }).toDestination();
    instruments.maracas.volume.value = -16;

    instruments.guiro = new Tone.NoiseSynth({
        noise: { type: 'brown' },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.1 }
    }).toDestination();
    instruments.guiro.volume.value = -12;

    // ============ FX INSTRUMENTS ============

    instruments.riser = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 2, decay: 0, sustain: 1, release: 0.5 }
    }).toDestination();
    instruments.riser.volume.value = -12;

    instruments.impact = new Tone.MembraneSynth({
        pitchDecay: 0.1, octaves: 4,
        envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 1 }
    }).toDestination();
    instruments.impact.volume.value = 0;

    instruments.downlifter = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 0.5 }
    }).toDestination();
    instruments.downlifter.volume.value = -10;
}
