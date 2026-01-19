// ============ BASIC PLAYBACK FUNCTIONS ============
// Core playback for chords, scales, drums, synths, and FX

let playbackMode = 'together'; // 'together' or 'sequence'
let currentMode = 'chord';

// Play chord (notes played together or sequentially)
async function playChord(notes, instrument = 'poly') {
    await initAudio();
    setPlaying(true);

    const synth = instruments[instrument] || instruments.poly;

    if (playbackMode === 'sequence') {
        const now = Tone.now();
        notes.forEach((note, i) => {
            synth.triggerAttackRelease(note, '4n', now + i * 0.15);
        });
        setTimeout(() => setPlaying(false), notes.length * 150 + 800);
    } else {
        synth.triggerAttackRelease(notes, '2n');
        setTimeout(() => setPlaying(false), 1200);
    }
}

// Play scale (ascending notes)
async function playScale(notes) {
    await initAudio();
    setPlaying(true);

    const now = Tone.now();
    notes.forEach((note, i) => {
        instruments.poly.triggerAttackRelease(note, '8n', now + i * 0.2);
    });
    setTimeout(() => setPlaying(false), notes.length * 200 + 500);
}

// Play single drum hit
async function playDrum(type) {
    await initAudio();
    setPlaying(true);
    animateVisualizer();

    switch(type) {
        case 'kick':
            instruments.kick.triggerAttackRelease('C1', '8n');
            break;
        case '808':
            instruments.bass808.triggerAttackRelease('C1', '2n');
            break;
        case 'snare':
            instruments.snare.triggerAttackRelease('8n');
            break;
        case 'hihat':
            instruments.hihat.triggerAttackRelease('32n');
            break;
        case 'openhat':
            instruments.openhat.triggerAttackRelease('8n');
            break;
        case 'clap':
            instruments.clap.triggerAttackRelease('8n');
            break;
        case 'crash':
            instruments.crash.triggerAttackRelease('4n');
            setTimeout(() => setPlaying(false), 1500);
            return;
        case 'rim':
            instruments.rim.triggerAttackRelease('G3', '16n');
            break;
        case 'tom':
            instruments.tom.triggerAttackRelease('G2', '8n');
            break;
        case 'tomlow':
            instruments.tom.triggerAttackRelease('C2', '8n');
            break;
        case 'shaker':
            instruments.shaker.triggerAttackRelease('16n');
            break;
        case 'tamb':
        case 'tambourine':
            instruments.tamb.triggerAttackRelease('16n');
            break;
        case 'cowbell':
            instruments.cowbell.triggerAttackRelease('8n');
            break;
        case 'conga':
            instruments.conga.triggerAttackRelease('G4', '8n');
            break;
        case 'congalow':
            instruments.congalow.triggerAttackRelease('C4', '8n');
            break;
        case 'bongo':
            instruments.bongo.triggerAttackRelease('E5', '8n');
            break;
        case 'bongolow':
            instruments.bongolow.triggerAttackRelease('C5', '8n');
            break;
        case 'woodblock':
        case 'block':
            instruments.woodblock.triggerAttackRelease('G4', '16n');
            break;
        case 'triangle':
            instruments.triangle.triggerAttackRelease('8n');
            break;
        case 'maracas':
            instruments.maracas.triggerAttackRelease('32n');
            break;
        case 'guiro':
            instruments.guiro.triggerAttackRelease('8n');
            break;
    }

    setTimeout(() => setPlaying(false), 600);
}

// Play drum pattern
async function playDrumPattern(patternOrName) {
    await initAudio();
    setPlaying(true);

    // Accept either a pattern name string or a pattern object
    const pattern = typeof patternOrName === 'string'
        ? DRUM_PATTERNS[patternOrName]
        : patternOrName;
    if (!pattern) return;

    // Animate the grid
    animateDrumGrid(pattern);

    const beatDuration = 60 / pattern.bpm; // seconds per beat
    const now = Tone.now();

    pattern.steps.forEach(step => {
        const time = now + (step.beat * beatDuration);

        switch(step.drum) {
            case 'kick':
                instruments.kick.triggerAttackRelease('C1', '8n', time);
                break;
            case '808':
                instruments.bass808.triggerAttackRelease('C1', '4n', time);
                break;
            case 'snare':
                instruments.snare.triggerAttackRelease('8n', time);
                break;
            case 'hihat':
                instruments.hihat.triggerAttackRelease('32n', time);
                break;
            case 'openhat':
                instruments.openhat.triggerAttackRelease('8n', time);
                break;
            case 'clap':
                instruments.clap.triggerAttackRelease('8n', time);
                break;
            case 'crash':
                instruments.crash.triggerAttackRelease('4n', time);
                break;
            case 'rim':
                instruments.rim.triggerAttackRelease('G3', '16n', time);
                break;
            case 'tom':
                instruments.tom.triggerAttackRelease('G2', '8n', time);
                break;
            case 'tomlow':
                instruments.tom.triggerAttackRelease('C2', '8n', time);
                break;
            case 'shaker':
                instruments.shaker.triggerAttackRelease('16n', time);
                break;
            case 'tamb':
            case 'tambourine':
                instruments.tamb.triggerAttackRelease('16n', time);
                break;
            case 'cowbell':
                instruments.cowbell.triggerAttackRelease('8n', time);
                break;
            case 'conga':
                instruments.conga.triggerAttackRelease('G4', '8n', time);
                break;
            case 'congalow':
                instruments.congalow.triggerAttackRelease('C4', '8n', time);
                break;
            case 'bongo':
                instruments.bongo.triggerAttackRelease('E5', '8n', time);
                break;
            case 'bongolow':
                instruments.bongolow.triggerAttackRelease('C5', '8n', time);
                break;
            case 'woodblock':
            case 'block':
                instruments.woodblock.triggerAttackRelease('G4', '16n', time);
                break;
            case 'triangle':
                instruments.triangle.triggerAttackRelease('8n', time);
                break;
            case 'maracas':
                instruments.maracas.triggerAttackRelease('32n', time);
                break;
            case 'guiro':
                instruments.guiro.triggerAttackRelease('8n', time);
                break;
        }
    });

    // Calculate total duration based on bars
    const bars = pattern.bars || 1;
    const totalDuration = bars * 4 * beatDuration * 1000;
    setTimeout(() => setPlaying(false), totalDuration + 200);
}

// Play synth preset
async function playSynth(type, note = 'C3') {
    await initAudio();
    setPlaying(true);
    animateWaveform();

    const synth = instruments[type];
    if (synth) {
        // Polyphonic synths play chords
        if (['supersaw', 'pad', 'organ', 'strings', 'brass'].includes(type)) {
            const rootMidi = noteToMidi(note);
            const notes = [0, 4, 7].map(i => midiToNote(rootMidi + i));
            synth.triggerAttackRelease(notes, '2n');
            if (type === 'strings') {
                setTimeout(() => setPlaying(false), 3000);
                return;
            }
        } else {
            synth.triggerAttackRelease(note, '2n');
        }
    }

    setTimeout(() => setPlaying(false), 1500);
}

// Play FX sound
async function playFX(type) {
    await initAudio();
    setPlaying(true);
    animateVisualizer();

    switch(type) {
        case 'riser':
            instruments.riser.triggerAttackRelease('2n');
            setTimeout(() => setPlaying(false), 2500);
            return;
        case 'sweep':
            instruments.riser.triggerAttackRelease('1n');
            setTimeout(() => setPlaying(false), 3000);
            return;
        case 'downlifter':
            instruments.downlifter.triggerAttackRelease('2n');
            setTimeout(() => setPlaying(false), 2000);
            return;
        case 'impact':
            instruments.impact.triggerAttackRelease('C1', '4n');
            break;
        case 'boom':
            instruments.impact.triggerAttackRelease('C0', '2n');
            setTimeout(() => setPlaying(false), 1500);
            return;
    }

    setTimeout(() => setPlaying(false), 1000);
}

// Play raw waveform
async function playWaveform(type, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const osc = new Tone.Oscillator({
        frequency: Tone.Frequency(note).toFrequency(),
        type: type
    }).toDestination();
    osc.volume.value = -12;

    osc.start();
    setTimeout(() => {
        osc.stop();
        osc.dispose();
        setPlaying(false);
    }, 1500);
}
