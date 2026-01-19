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

// ============ SPATIAL EFFECTS ============

// Play with reverb
async function playWithReverb(reverbType = 'hall', note = 'C4') {
    await initAudio();
    setPlaying(true);

    const reverbSettings = {
        'room': { decay: 1.5, preDelay: 0.01 },
        'hall': { decay: 3, preDelay: 0.02 },
        'plate': { decay: 2, preDelay: 0.01 },
        'cathedral': { decay: 6, preDelay: 0.05 },
    };
    const settings = reverbSettings[reverbType] || reverbSettings.hall;

    const reverb = new Tone.Reverb({
        decay: settings.decay,
        preDelay: settings.preDelay,
        wet: 0.6
    }).toDestination();

    await reverb.generate();

    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.8 }
    }).connect(reverb);
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '4n');

    setTimeout(() => {
        synth.dispose();
        reverb.dispose();
        setPlaying(false);
    }, (settings.decay + 1) * 1000);
}

// Play with delay
async function playWithDelay(delayTime = '8n', feedback = 0.4, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const delay = new Tone.FeedbackDelay({
        delayTime: delayTime,
        feedback: feedback,
        wet: 0.5
    }).toDestination();

    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.3 }
    }).connect(delay);
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '8n');

    setTimeout(() => {
        synth.dispose();
        delay.dispose();
        setPlaying(false);
    }, 3000);
}

// Play with chorus
async function playWithChorus(depth = 0.5, note = 'C3') {
    await initAudio();
    setPlaying(true);

    const chorus = new Tone.Chorus({
        frequency: 2.5,
        delayTime: 3.5,
        depth: depth,
        wet: 0.6
    }).toDestination();
    chorus.start();

    const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.8 }
    }).connect(chorus);
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '2n');

    setTimeout(() => {
        synth.dispose();
        chorus.dispose();
        setPlaying(false);
    }, 2500);
}

// Play with phaser
async function playWithPhaser(rate = 0.5, note = 'C3') {
    await initAudio();
    setPlaying(true);

    const phaser = new Tone.Phaser({
        frequency: rate,
        octaves: 3,
        baseFrequency: 350,
        wet: 0.6
    }).toDestination();

    const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 }
    }).connect(phaser);
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '1n');

    setTimeout(() => {
        synth.dispose();
        phaser.dispose();
        setPlaying(false);
    }, 3000);
}

// Play with panning
async function playWithPanning(panValue = 0, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const panner = new Tone.Panner(panValue * 2 - 1).toDestination(); // Convert 0-1 to -1 to 1

    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 }
    }).connect(panner);
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '2n');

    setTimeout(() => {
        synth.dispose();
        panner.dispose();
        setPlaying(false);
    }, 1500);
}

// Play sidechain pumping effect
async function playSidechain(pumpBeats = 4, bpm = 128) {
    await initAudio();
    setPlaying(true);

    const beatDuration = 60 / bpm;
    const compressor = new Tone.Compressor({
        threshold: -30,
        ratio: 12,
        attack: 0.003,
        release: 0.25
    }).toDestination();

    // Pad sound (gets ducked)
    const pad = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.5, decay: 0.2, sustain: 0.8, release: 1 }
    }).connect(compressor);
    pad.volume.value = -6;

    // Kick for sidechain trigger
    const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
    }).connect(compressor);
    kick.volume.value = 0;

    // Start pad
    pad.triggerAttack('C3');

    // Play kicks to trigger sidechain
    const now = Tone.now();
    for (let i = 0; i < pumpBeats; i++) {
        kick.triggerAttackRelease('C1', '8n', now + i * beatDuration);
    }

    setTimeout(() => {
        pad.triggerRelease();
        setTimeout(() => {
            pad.dispose();
            kick.dispose();
            compressor.dispose();
            setPlaying(false);
        }, 1000);
    }, pumpBeats * beatDuration * 1000);
}

// ============ ADVANCED SYNTHESIS ============

// FM synthesis demo
async function playFM(ratio = 2, modulationIndex = 5, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const synth = new Tone.FMSynth({
        harmonicity: ratio,
        modulationIndex: modulationIndex,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.3 }
    }).toDestination();
    synth.volume.value = -12;

    synth.triggerAttackRelease(note, '2n');

    setTimeout(() => {
        synth.dispose();
        setPlaying(false);
    }, 2000);
}

// Ring modulation
async function playRingMod(modFreq = 440, note = 'C4') {
    await initAudio();
    setPlaying(true);

    // Create carrier and modulator
    const carrier = new Tone.Oscillator({
        frequency: Tone.Frequency(note).toFrequency(),
        type: 'sine'
    });

    const modulator = new Tone.Oscillator({
        frequency: modFreq,
        type: 'sine'
    });

    // Multiply signals together (ring mod)
    const multiply = new Tone.Multiply().toDestination();
    carrier.connect(multiply);
    modulator.connect(multiply.factor);

    carrier.volume.value = -6;
    modulator.volume.value = 0;

    carrier.start();
    modulator.start();

    setTimeout(() => {
        carrier.stop();
        modulator.stop();
        carrier.dispose();
        modulator.dispose();
        multiply.dispose();
        setPlaying(false);
    }, 2000);
}

// Pulse width modulation
async function playPWM(pulseWidth = 0.5, rate = 2, note = 'C4') {
    await initAudio();
    setPlaying(true);

    const synth = new Tone.PulseOscillator({
        frequency: Tone.Frequency(note).toFrequency(),
        width: pulseWidth
    }).toDestination();
    synth.volume.value = -12;

    // Modulate pulse width with LFO
    const lfo = new Tone.LFO({
        frequency: rate,
        min: 0.1,
        max: 0.9
    }).connect(synth.width);

    lfo.start();
    synth.start();

    setTimeout(() => {
        synth.stop();
        lfo.stop();
        synth.dispose();
        lfo.dispose();
        setPlaying(false);
    }, 2500);
}

// Formant synthesis (vowel sounds)
async function playFormant(vowel = 'a', note = 'C3') {
    await initAudio();
    setPlaying(true);

    const formantData = FORMANTS[vowel] || FORMANTS['a'];
    const baseFreq = Tone.Frequency(note).toFrequency();

    // Create bandpass filters for each formant
    const filters = [];
    const gains = [];

    [formantData.f1, formantData.f2, formantData.f3].forEach((freq, i) => {
        const filter = new Tone.Filter({
            type: 'bandpass',
            frequency: freq,
            Q: 10
        });
        const gain = new Tone.Gain(1 - i * 0.3).toDestination();
        filter.connect(gain);
        filters.push(filter);
        gains.push(gain);
    });

    // Create sawtooth source
    const osc = new Tone.Oscillator({
        frequency: baseFreq,
        type: 'sawtooth'
    });
    osc.volume.value = -6;

    filters.forEach(f => osc.connect(f));
    osc.start();

    setTimeout(() => {
        osc.stop();
        osc.dispose();
        filters.forEach(f => f.dispose());
        gains.forEach(g => g.dispose());
        setPlaying(false);
    }, 2000);
}

// ============ RHYTHM & TIMING ============

// Metronome
async function playMetronome(bpm = 120, beats = 4, accent = 4) {
    await initAudio();
    setPlaying(true);

    const beatDuration = 60 / bpm;

    // High click for accent, low for regular beat
    const clickHigh = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();
    clickHigh.volume.value = -6;

    const clickLow = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();
    clickLow.volume.value = -10;

    const now = Tone.now();
    for (let i = 0; i < beats; i++) {
        const time = now + i * beatDuration;
        if (i % accent === 0) {
            clickHigh.triggerAttackRelease('G5', '32n', time);
        } else {
            clickLow.triggerAttackRelease('C5', '32n', time);
        }
    }

    setTimeout(() => {
        clickHigh.dispose();
        clickLow.dispose();
        setPlaying(false);
    }, beats * beatDuration * 1000 + 200);
}

// Time signature demo
async function playTimeSignature(timeSig = '4/4', bpm = 100, bars = 2) {
    await initAudio();
    setPlaying(true);

    const sig = TIME_SIGNATURES[timeSig] || TIME_SIGNATURES['4/4'];
    const beatDuration = 60 / bpm / (sig.division / 4); // Adjust for division

    const clickHigh = new Tone.MembraneSynth({
        pitchDecay: 0.008, octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();
    clickHigh.volume.value = -6;

    const clickLow = new Tone.MembraneSynth({
        pitchDecay: 0.008, octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();
    clickLow.volume.value = -10;

    const now = Tone.now();
    const totalBeats = sig.beats * bars;

    for (let i = 0; i < totalBeats; i++) {
        const time = now + i * beatDuration;
        const beatInMeasure = i % sig.beats;
        if (sig.accent[beatInMeasure] === 1) {
            clickHigh.triggerAttackRelease('G5', '32n', time);
        } else {
            clickLow.triggerAttackRelease('C5', '32n', time);
        }
    }

    setTimeout(() => {
        clickHigh.dispose();
        clickLow.dispose();
        setPlaying(false);
    }, totalBeats * beatDuration * 1000 + 200);
}

// Polyrhythm demo
async function playPolyrhythm(polyType = '3:2', bpm = 90, bars = 2) {
    await initAudio();
    setPlaying(true);

    const poly = POLYRHYTHMS[polyType] || POLYRHYTHMS['3:2'];
    const barDuration = (60 / bpm) * 4; // Duration of one bar in 4/4

    // Calculate timing for each rhythm
    const aInterval = barDuration / poly.a;
    const bInterval = barDuration / poly.b;

    const clickA = new Tone.MembraneSynth({
        pitchDecay: 0.008, octaves: 2,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }
    }).toDestination();
    clickA.volume.value = -6;

    const clickB = new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
    }).toDestination();
    clickB.volume.value = -12;

    const now = Tone.now();

    // Play rhythm A
    for (let bar = 0; bar < bars; bar++) {
        for (let i = 0; i < poly.a; i++) {
            const time = now + bar * barDuration + i * aInterval;
            clickA.triggerAttackRelease('C4', '32n', time);
        }
    }

    // Play rhythm B
    for (let bar = 0; bar < bars; bar++) {
        for (let i = 0; i < poly.b; i++) {
            const time = now + bar * barDuration + i * bInterval;
            clickB.triggerAttackRelease('32n', time);
        }
    }

    setTimeout(() => {
        clickA.dispose();
        clickB.dispose();
        setPlaying(false);
    }, bars * barDuration * 1000 + 200);
}

// Swing/shuffle demo
async function playWithSwing(swingAmount = 0.5, bpm = 100) {
    await initAudio();
    setPlaying(true);

    const beatDuration = 60 / bpm;
    const swingOffset = swingAmount * 0.33 * beatDuration; // Max swing is about 33% of an 8th note

    const hihat = new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
    }).toDestination();
    hihat.volume.value = -12;

    const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 8,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
    }).toDestination();
    kick.volume.value = -6;

    const now = Tone.now();
    const bars = 2;

    for (let bar = 0; bar < bars; bar++) {
        for (let beat = 0; beat < 4; beat++) {
            const baseTime = now + bar * 4 * beatDuration + beat * beatDuration;

            // Kick on 1 and 3
            if (beat === 0 || beat === 2) {
                kick.triggerAttackRelease('C1', '8n', baseTime);
            }

            // Hi-hat on downbeat
            hihat.triggerAttackRelease('32n', baseTime);

            // Hi-hat on upbeat (with swing)
            hihat.triggerAttackRelease('32n', baseTime + beatDuration * 0.5 + swingOffset);
        }
    }

    setTimeout(() => {
        hihat.dispose();
        kick.dispose();
        setPlaying(false);
    }, bars * 4 * beatDuration * 1000 + 200);
}

// ============ SEQUENCES ============

// Arpeggiator
async function playArpeggio(chordNotes, pattern = 'up', rate = 8, octaves = 1) {
    await initAudio();
    setPlaying(true);

    const arpPattern = ARP_PATTERNS[pattern] || ARP_PATTERNS['up'];
    const noteDuration = 60 / 120 / (rate / 4); // Based on 120 BPM

    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
    }).toDestination();
    synth.volume.value = -12;

    // Build full note list with octaves
    let fullNotes = [];
    for (let oct = 0; oct < octaves; oct++) {
        chordNotes.forEach(note => {
            const midi = noteToMidi(note) + oct * 12;
            fullNotes.push(midiToNote(midi));
        });
    }

    // Get arp sequence
    const sequence = arpPattern.gen(fullNotes.length);
    const playNotes = sequence.map(i => fullNotes[i]);

    // Play 2 cycles
    const now = Tone.now();
    for (let cycle = 0; cycle < 2; cycle++) {
        playNotes.forEach((note, i) => {
            const time = now + (cycle * playNotes.length + i) * noteDuration;
            synth.triggerAttackRelease(note, noteDuration * 0.8, time);
        });
    }

    setTimeout(() => {
        synth.dispose();
        setPlaying(false);
    }, 2 * playNotes.length * noteDuration * 1000 + 500);
}

// Bassline pattern player
async function playBassline(patternName = 'acid', root = 'C', octave = 2) {
    await initAudio();
    setPlaying(true);

    const pattern = BASSLINE_PATTERNS[patternName] || BASSLINE_PATTERNS['acid'];
    const bpm = pattern.bpm;
    const stepDuration = 60 / bpm / 4; // 16th notes
    const rootMidi = NOTE_TO_MIDI[root] + (octave + 1) * 12;

    const synth = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.1 },
        filterEnvelope: { attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.2, baseFrequency: 200, octaves: 3 }
    }).toDestination();
    synth.volume.value = -6;

    const now = Tone.now();
    pattern.notes.forEach((semitone, i) => {
        if (semitone !== -1) { // -1 = rest
            const note = midiToNote(rootMidi + semitone);
            const time = now + i * stepDuration;
            const accent = pattern.accents ? pattern.accents[i] : 0;
            const velocity = 0.5 + accent * 0.4;

            if (pattern.slides && pattern.slides[i] && i < pattern.notes.length - 1) {
                // Slide to next note
                synth.triggerAttack(note, time, velocity);
                const nextNote = pattern.notes[i + 1];
                if (nextNote !== -1) {
                    synth.frequency.rampTo(Tone.Frequency(midiToNote(rootMidi + nextNote)).toFrequency(), stepDuration * 0.8, time);
                }
            } else {
                synth.triggerAttackRelease(note, stepDuration * 0.8, time, velocity);
            }
        }
    });

    setTimeout(() => {
        synth.dispose();
        setPlaying(false);
    }, pattern.notes.length * stepDuration * 1000 + 500);
}

// Melodic phrase player
async function playMelody(phraseName = 'pentatonic', root = 'C', octave = 4) {
    await initAudio();
    setPlaying(true);

    const phrase = MELODY_PHRASES[phraseName] || MELODY_PHRASES['pentatonic'];
    const rootMidi = NOTE_TO_MIDI[root] + (octave + 1) * 12;
    const bpm = 100;
    const beatDuration = 60 / bpm;

    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 }
    }).toDestination();
    synth.volume.value = -12;

    let currentTime = Tone.now();
    phrase.notes.forEach((semitone, i) => {
        const note = midiToNote(rootMidi + semitone);
        const duration = phrase.durations[i] * beatDuration;
        synth.triggerAttackRelease(note, duration * 0.9, currentTime);
        currentTime += duration;
    });

    const totalDuration = phrase.durations.reduce((a, b) => a + b, 0) * beatDuration;
    setTimeout(() => {
        synth.dispose();
        setPlaying(false);
    }, totalDuration * 1000 + 500);
}

// Genre preset player
async function playGenre(genreName = 'lofi', note = 'C3') {
    await initAudio();
    setPlaying(true);

    const preset = GENRE_PRESETS[genreName] || GENRE_PRESETS['lofi'];
    const nodes = [];
    let outputNode = Tone.Destination;

    // Add reverb if specified
    if (preset.reverb > 0) {
        const reverb = new Tone.Reverb({
            decay: preset.reverb * 4,
            wet: preset.reverb
        }).connect(outputNode);
        await reverb.generate();
        nodes.push(reverb);
        outputNode = reverb;
    }

    // Add effects
    if (preset.effects.chorus) {
        const chorus = new Tone.Chorus({
            frequency: 2.5,
            delayTime: 3.5,
            depth: preset.effects.chorus,
            wet: 0.5
        }).connect(outputNode);
        chorus.start();
        nodes.push(chorus);
        outputNode = chorus;
    }

    if (preset.effects.delay) {
        const delay = new Tone.FeedbackDelay({
            delayTime: '8n',
            feedback: preset.effects.delay,
            wet: 0.3
        }).connect(outputNode);
        nodes.push(delay);
        outputNode = delay;
    }

    if (preset.effects.bitcrush) {
        const crusher = new Tone.BitCrusher(preset.effects.bitcrush).connect(outputNode);
        nodes.push(crusher);
        outputNode = crusher;
    }

    if (preset.effects.drive) {
        const dist = new Tone.Distortion(preset.effects.drive).connect(outputNode);
        nodes.push(dist);
        outputNode = dist;
    }

    // Create synth with preset envelope
    const synth = new Tone.Synth({
        oscillator: { type: preset.synth.wave },
        envelope: {
            attack: preset.synth.attack,
            decay: preset.synth.decay,
            sustain: preset.synth.sustain,
            release: preset.synth.release
        }
    }).connect(outputNode);
    synth.volume.value = -12;

    // Play a chord
    const rootMidi = noteToMidi(note);
    synth.triggerAttackRelease(note, '2n');

    setTimeout(() => {
        synth.dispose();
        nodes.forEach(n => n.dispose());
        setPlaying(false);
    }, 3000);
}
