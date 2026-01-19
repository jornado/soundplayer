// ============ ADVANCED SYNTHESIS WITH EFFECTS ============
// Effects chain, filter processing, and modulation

// Play synth with full effects chain
async function playAdvancedSynth(options = {}) {
    await initAudio();
    setPlaying(true);

    const {
        wave = 'sawtooth',
        note = 'C3',
        drive = 0,
        bitcrush = 0,
        unison = 1,
        detune = 0,
        noise = 0,
        filterCutoff = 20000,
        filterRes = 1,
        attack = 0.01,
        decay = 0.3,
        sustain = 0.5,
        release = 0.5
    } = options;

    const nodes = [];
    const oscs = [];
    let outputNode = Tone.Destination;

    // Build effects chain (in reverse order)

    // Bit crusher
    if (bitcrush > 0 && bitcrush < 16) {
        const crusher = new Tone.BitCrusher(Math.round(bitcrush)).connect(outputNode);
        nodes.push(crusher);
        outputNode = crusher;
    }

    // Distortion/drive
    if (drive > 0) {
        const dist = new Tone.Distortion(drive).connect(outputNode);
        nodes.push(dist);
        outputNode = dist;
    }

    // Filter
    if (filterCutoff < 20000) {
        const filter = new Tone.Filter({
            type: 'lowpass',
            frequency: filterCutoff,
            Q: filterRes
        }).connect(outputNode);
        nodes.push(filter);
        outputNode = filter;
    }

    // Create oscillators with unison/detune
    const baseFreq = Tone.Frequency(note).toFrequency();
    const detuneRange = detune * 50; // cents

    for (let i = 0; i < unison; i++) {
        let oscDetune = 0;
        if (unison > 1) {
            // Spread voices evenly across detune range
            oscDetune = (i / (unison - 1) - 0.5) * 2 * detuneRange;
        }

        const osc = new Tone.Oscillator({
            frequency: baseFreq,
            type: wave,
            detune: oscDetune
        }).connect(outputNode);
        osc.volume.value = -12 - (unison > 1 ? Math.log2(unison) * 3 : 0);
        oscs.push(osc);
    }

    // Add noise layer if specified
    let noiseSynth = null;
    if (noise > 0) {
        noiseSynth = new Tone.Noise('white').connect(outputNode);
        noiseSynth.volume.value = -30 + (noise * 20);
    }

    // Start all oscillators
    oscs.forEach(osc => osc.start());
    if (noiseSynth) noiseSynth.start();

    // Apply envelope manually with volume ramp
    const totalTime = attack + decay + 0.5 + release;

    setTimeout(() => {
        oscs.forEach(osc => {
            osc.stop();
            osc.dispose();
        });
        if (noiseSynth) {
            noiseSynth.stop();
            noiseSynth.dispose();
        }
        nodes.forEach(n => n.dispose());
        setPlaying(false);
    }, totalTime * 1000);
}

// Simplified effect demos
async function playWithDrive(driveAmount, note = 'C3') {
    await playAdvancedSynth({ wave: 'sawtooth', note, drive: driveAmount });
}

async function playWithBitcrush(bits, note = 'C3') {
    await playAdvancedSynth({ wave: 'sawtooth', note, bitcrush: bits });
}

async function playWithUnison(voices, detuneAmt, note = 'C3') {
    await playAdvancedSynth({ wave: 'sawtooth', note, unison: voices, detune: detuneAmt });
}

async function playWithNoise(noiseAmt, note = 'C3') {
    await playAdvancedSynth({ wave: 'sawtooth', note, noise: noiseAmt });
}

// Play filter with specific settings
async function playFilter(filterType, cutoff, resonance, note = 'C3') {
    await initAudio();
    setPlaying(true);

    const filter = new Tone.Filter({
        type: filterType,
        frequency: cutoff,
        Q: resonance
    }).toDestination();

    const osc = new Tone.Oscillator({
        frequency: Tone.Frequency(note).toFrequency(),
        type: 'sawtooth'
    }).connect(filter);
    osc.volume.value = -12;

    osc.start();
    setTimeout(() => {
        osc.stop();
        osc.dispose();
        filter.dispose();
        setPlaying(false);
    }, 1500);
}

// Play animated filter sweep
async function playFilterSweep(filterType, fromFreq, toFreq, note = 'C3') {
    await initAudio();
    setPlaying(true);

    const filter = new Tone.Filter({
        type: filterType,
        frequency: fromFreq,
        Q: 4
    }).toDestination();

    const osc = new Tone.Oscillator({
        frequency: Tone.Frequency(note).toFrequency(),
        type: 'sawtooth'
    }).connect(filter);
    osc.volume.value = -12;

    osc.start();
    filter.frequency.rampTo(toFreq, 2);

    // Animate the canvas during sweep
    const canvas = document.getElementById('synthCanvas');
    let startTime = Date.now();
    const animate = () => {
        const elapsed = (Date.now() - startTime) / 2000;
        if (elapsed < 1) {
            const currentCutoff = fromFreq + (toFreq - fromFreq) * elapsed;
            drawFilterCurve(canvas, filterType, currentCutoff, 4);
            requestAnimationFrame(animate);
        }
    };
    animate();

    setTimeout(() => {
        osc.stop();
        osc.dispose();
        filter.dispose();
        setPlaying(false);
    }, 2500);
}

// Play envelope demonstration
async function playEnvelope(a, d, s, r, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: a, decay: d, sustain: s, release: r }
    }).toDestination();
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, a + d + 0.5);

    setTimeout(() => {
        synth.dispose();
        setPlaying(false);
    }, (a + d + 0.5 + r) * 1000 + 200);
}

// Play LFO effect demonstration
async function playLFOEffect(target, shape, rate, depth, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' }
    }).toDestination();
    synth.volume.value = -12;

    const lfo = new Tone.LFO({
        frequency: rate,
        type: shape,
        min: target === 'filter' ? 200 : (target === 'pitch' ? -depth : 1 - depth),
        max: target === 'filter' ? 2000 : (target === 'pitch' ? depth : 1)
    });

    if (target === 'tremolo' || target === 'amplitude') {
        lfo.connect(synth.volume);
        lfo.min = -24;
        lfo.max = -6;
    } else if (target === 'pitch' || target === 'vibrato') {
        lfo.connect(synth.oscillator.frequency);
        const baseFreq = Tone.Frequency(note).toFrequency();
        lfo.min = baseFreq * (1 - depth * 0.05);
        lfo.max = baseFreq * (1 + depth * 0.05);
    }

    lfo.start();
    synth.triggerAttack(note);

    setTimeout(() => {
        synth.triggerRelease();
        lfo.stop();
        setTimeout(() => {
            synth.dispose();
            lfo.dispose();
            setPlaying(false);
        }, 500);
    }, 2000);
}

// Play additive synthesis with custom harmonics
async function playHarmonics(harmonicAmps) {
    await initAudio();
    setPlaying(true);

    const fundamental = 220; // A3
    const oscs = [];

    harmonicAmps.forEach((amp, i) => {
        if (amp > 0) {
            const osc = new Tone.Oscillator({
                frequency: fundamental * (i + 1),
                type: 'sine'
            }).toDestination();
            osc.volume.value = -20 + (amp * 10);
            osc.start();
            oscs.push(osc);
        }
    });

    setTimeout(() => {
        oscs.forEach(osc => {
            osc.stop();
            osc.dispose();
        });
        setPlaying(false);
    }, 2000);
}
