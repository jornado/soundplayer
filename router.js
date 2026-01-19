// ============ URL ROUTING & INITIALIZATION ============
// Parse URL parameters and initialize the appropriate sound player mode

function init() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('compact') || params.get('embed') === 'true' || window.self !== window.top) {
        document.body.classList.add('compact');
    }

    let playFn = () => {};

    // PROGRESSION MODE (play chord transitions)
    if (params.has('progression')) {
        const progStr = params.get('progression');
        const chordStrs = progStr.split(',').map(s => s.trim());
        const octave = parseInt(params.get('octave')) || 4;

        // Parse each chord
        const chords = chordStrs.map(chordStr => {
            const match = chordStr.match(/^([A-G][#b]?)(.*)$/i);
            if (!match) return null;
            let [, root, type] = match;
            root = root.charAt(0).toUpperCase() + root.slice(1);
            type = type.toLowerCase();
            const intervals = CHORD_TYPES[type] || CHORD_TYPES[''];
            const rootMidi = NOTE_TO_MIDI[root] + (octave + 1) * 12;
            const notes = intervals.map(i => midiToNote(rootMidi + i));
            return { root, type: type || 'Major', notes, name: `${root}${type || ''}` };
        }).filter(Boolean);

        if (chords.length >= 2) {
            const names = chords.map(c => c.name).join(' → ');
            document.getElementById('soundType').textContent = 'Progression';
            document.getElementById('soundName').textContent = names;
            document.getElementById('description').textContent = `${chords.length} chords • Tap to hear transition`;

            // Show first chord on piano
            buildPiano(chords[0].notes);

            const tempo = parseInt(params.get('tempo')) || 800; // ms between chords

            playFn = async () => {
                await initAudio();
                setPlaying(true);

                for (let i = 0; i < chords.length; i++) {
                    const chord = chords[i];
                    buildPiano(chord.notes);

                    // Play chord
                    const synth = instruments.poly;
                    synth.triggerAttackRelease(chord.notes, '2n');

                    // Wait before next chord (except for last)
                    if (i < chords.length - 1) {
                        await new Promise(r => setTimeout(r, tempo));
                    }
                }

                setTimeout(() => setPlaying(false), 500);
            };
        }
    }

    // CHORD MODE
    else if (params.has('chord')) {
        const chordStr = params.get('chord');
        const match = chordStr.match(/^([A-G][#b]?)(.*)$/i);
        if (match) {
            let [, root, type] = match;
            root = root.charAt(0).toUpperCase() + root.slice(1);
            type = type.toLowerCase();
            const intervals = CHORD_TYPES[type];
            const octave = parseInt(params.get('octave')) || 4;

            // Check if chord type is recognized
            if (!intervals && type !== '') {
                document.getElementById('soundType').textContent = '⚠️ Unknown Type';
                document.getElementById('soundName').textContent = `"${type}"`;
                document.getElementById('description').textContent = `Chord type not recognized. Try: maj7, m7, 7, dim, aug, sus4...`;
                document.getElementById('playBtn').style.display = 'none';
                return;
            }

            const useIntervals = intervals || CHORD_TYPES[''];
            const rootMidi = NOTE_TO_MIDI[root] + (octave + 1) * 12;
            const notes = useIntervals.map(i => midiToNote(rootMidi + i));

            document.getElementById('soundType').textContent = 'Chord';
            document.getElementById('soundName').textContent = `${root} ${type || 'Major'}`;
            document.getElementById('description').textContent = notes.join(' • ');

            buildPiano(notes);
            setupControls('chord', [
                { label: 'Chord', action: () => playbackMode = 'together' },
                { label: 'Arpeggio', action: () => playbackMode = 'sequence' }
            ]);

            playFn = () => playChord(notes);
        }
    }

    // SCALE MODE
    else if (params.has('scale')) {
        const scaleType = params.get('scale').toLowerCase();
        const root = params.get('root') || 'C';
        const octave = parseInt(params.get('octave')) || 4;
        const intervals = SCALE_TYPES[scaleType] || SCALE_TYPES['major'];
        const rootMidi = NOTE_TO_MIDI[root.charAt(0).toUpperCase() + root.slice(1)] + (octave + 1) * 12;
        const notes = [...intervals, 12].map(i => midiToNote(rootMidi + i));

        document.getElementById('soundType').textContent = 'Scale';
        document.getElementById('soundName').textContent = `${root} ${scaleType.replace('-', ' ')}`;
        document.getElementById('description').textContent = notes.join(' → ');

        buildPiano(notes);
        playFn = () => playScale(notes);
    }

    // INTERVAL MODE
    else if (params.has('interval')) {
        const intervalType = params.get('interval').toLowerCase();
        const root = params.get('root') || 'C';
        const octave = parseInt(params.get('octave')) || 4;
        const semitones = INTERVALS[intervalType] ?? 7;
        const rootMidi = NOTE_TO_MIDI[root.charAt(0).toUpperCase() + root.slice(1)] + (octave + 1) * 12;
        const notes = [midiToNote(rootMidi), midiToNote(rootMidi + semitones)];

        document.getElementById('soundType').textContent = 'Interval';
        document.getElementById('soundName').textContent = intervalType.replace('-', ' ');
        document.getElementById('description').textContent = notes.join(' → ');

        buildPiano(notes);
        setupControls('interval', [
            { label: 'Together', action: () => playbackMode = 'together' },
            { label: 'Sequence', action: () => playbackMode = 'sequence' }
        ]);

        playFn = () => playChord(notes);
    }

    // DRUM PATTERN MODE (preset or custom)
    else if (params.has('pattern') || params.has('beats') ||
             params.has('kick') || params.has('snare') || params.has('hihat')) {

        let pattern;
        let isCustom = false;

        // Check for preset pattern first
        if (params.has('pattern') && !params.has('beats') &&
            !params.has('kick') && !params.has('snare')) {
            const patternName = params.get('pattern').toLowerCase();
            pattern = DRUM_PATTERNS[patternName];

            if (!pattern) {
                const available = Object.keys(DRUM_PATTERNS).join(', ');
                document.getElementById('soundType').textContent = '⚠️ Unknown Pattern';
                document.getElementById('soundName').textContent = `"${patternName}"`;
                document.getElementById('description').textContent = `Try: ${available}`;
                document.getElementById('playBtn').style.display = 'none';
                return;
            }
        } else {
            // Custom pattern from URL params
            pattern = parseCustomPattern(params);
            isCustom = true;
        }

        if (pattern && pattern.steps.length > 0) {
            const bars = pattern.bars || 1;
            document.getElementById('soundType').textContent = isCustom ? 'Custom Pattern' : 'Drum Pattern';
            document.getElementById('soundName').textContent = pattern.name;
            document.getElementById('description').textContent =
                `${pattern.desc} • ${pattern.bpm} BPM • ${bars} bar${bars > 1 ? 's' : ''}`;

            // Build the visual drum grid
            buildDrumGrid(pattern);

            playFn = () => playDrumPattern(pattern);
        } else {
            document.getElementById('soundType').textContent = '⚠️ Empty Pattern';
            document.getElementById('soundName').textContent = 'No drums specified';
            document.getElementById('description').textContent = 'Add kick=1,2,3,4 or beats=kick:1,3|snare:2,4';
            document.getElementById('playBtn').style.display = 'none';
        }
    }

    // DRUM MODE
    else if (params.has('drum')) {
        const drumType = params.get('drum').toLowerCase();
        const names = {
            kick: 'Kick Drum', snare: 'Snare', hihat: 'Hi-Hat', '808': '808 Kick',
            clap: 'Clap', crash: 'Crash Cymbal', openhat: 'Open Hi-Hat',
            rim: 'Rim Shot', tom: 'Tom', tomlow: 'Low Tom',
            shaker: 'Shaker', tamb: 'Tambourine', tambourine: 'Tambourine',
            cowbell: 'Cowbell', conga: 'Conga', congalow: 'Low Conga',
            bongo: 'Bongo', bongolow: 'Low Bongo',
            woodblock: 'Woodblock', block: 'Woodblock',
            triangle: 'Triangle', maracas: 'Maracas', guiro: 'Guiro'
        };
        const descs = {
            kick: 'Punchy electronic kick', snare: 'Noise-based snare',
            hihat: 'Closed hi-hat', '808': 'Long sub-heavy kick',
            clap: 'Electronic clap', crash: 'Cymbal crash',
            openhat: 'Open hi-hat', rim: 'Rim shot / side stick',
            tom: 'Mid tom', tomlow: 'Floor tom',
            shaker: 'White noise burst', tamb: 'Metallic jingle', tambourine: 'Metallic jingle',
            cowbell: 'Classic percussion', conga: 'High conga hit', congalow: 'Low conga hit',
            bongo: 'High bongo', bongolow: 'Low bongo',
            woodblock: 'Click percussion', block: 'Click percussion',
            triangle: 'Metallic ring', maracas: 'Short rattle', guiro: 'Scratchy scrape'
        };

        document.getElementById('soundType').textContent = 'Drum';
        document.getElementById('soundName').textContent = names[drumType] || drumType;
        document.getElementById('description').textContent = descs[drumType] || 'One-shot';

        document.getElementById('visualizer').classList.remove('hidden');
        playFn = () => playDrum(drumType);
    }

    // SYNTH MODE
    else if (params.has('synth')) {
        const synthType = params.get('synth').toLowerCase();
        const note = params.get('note') || 'C3';
        const names = {
            supersaw: 'Supersaw', reese: 'Reese Bass', pluck: 'Pluck',
            pad: 'Pad', lead: 'Lead', acid303: '303 Acid', bass808: '808 Bass',
            sub: 'Sub Bass', fmbass: 'FM Bass', wobble: 'Wobble Bass',
            bell: 'FM Bell', organ: 'Organ', strings: 'Strings', brass: 'Brass Stab'
        };
        const descs = {
            supersaw: 'Detuned saw waves • Trance/EDM',
            reese: 'Detuned bass • DnB/Dubstep',
            pluck: 'Karplus-Strong • Plucked string',
            pad: 'Soft sustained • Ambient',
            lead: 'Square wave • Melody',
            acid303: 'TB-303 style • Acid/Techno',
            bass808: 'TR-808 style • Hip-hop/Trap',
            sub: 'Pure sine sub • Hip-hop/Electronic',
            fmbass: 'FM synthesis • Modern bass',
            wobble: 'Filtered saw • Dubstep',
            bell: 'FM bell • Ambient/Cinematic',
            organ: 'Sine organ • Jazz/Soul',
            strings: 'Slow attack • Cinematic',
            brass: 'Saw stab • House/Disco'
        };

        document.getElementById('soundType').textContent = 'Synth';
        document.getElementById('soundName').textContent = names[synthType] || synthType;
        document.getElementById('description').textContent = descs[synthType] || note;

        document.getElementById('waveform').classList.remove('hidden');
        playFn = () => playSynth(synthType, note);
    }

    // FX MODE
    else if (params.has('fx')) {
        const fxType = params.get('fx').toLowerCase();
        const names = {
            riser: 'Noise Riser', sweep: 'Filter Sweep', impact: 'Impact Hit',
            downlifter: 'Downlifter', boom: 'Sub Boom'
        };
        const descs = {
            riser: '2-bar build up', sweep: '4-bar filter sweep',
            impact: 'Downbeat hit', downlifter: 'Reverse riser',
            boom: 'Deep sub impact'
        };

        document.getElementById('soundType').textContent = 'FX';
        document.getElementById('soundName').textContent = names[fxType] || fxType;
        document.getElementById('description').textContent = descs[fxType] || '';

        document.getElementById('visualizer').classList.remove('hidden');
        playFn = () => playFX(fxType);
    }

    // WAVEFORM MODE
    else if (params.has('wave')) {
        const waveType = params.get('wave').toLowerCase();
        const note = params.get('note') || 'C4';
        const names = {
            sine: 'Sine Wave', square: 'Square Wave',
            saw: 'Sawtooth Wave', sawtooth: 'Sawtooth Wave',
            triangle: 'Triangle Wave', pulse: 'Pulse Wave'
        };
        const descs = {
            sine: 'Pure tone, no harmonics',
            square: 'Hollow, odd harmonics only',
            saw: 'Bright, all harmonics',
            sawtooth: 'Bright, all harmonics',
            triangle: 'Soft, odd harmonics (weaker)',
            pulse: 'Variable harmonic content'
        };

        document.getElementById('soundType').textContent = 'Oscillator';
        document.getElementById('soundName').textContent = names[waveType] || waveType;
        document.getElementById('description').textContent = descs[waveType] || '';

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawWaveform(canvas, waveType), 50);

        playFn = () => playWaveform(waveType, note);
    }

    // DRIVE/SATURATION MODE
    else if (params.has('drive')) {
        const driveAmount = parseFloat(params.get('drive')) || 0.5;
        const note = params.get('note') || 'C3';
        const wave = params.get('wave') || 'sawtooth';

        document.getElementById('soundType').textContent = 'Saturation';
        document.getElementById('soundName').textContent = driveAmount < 0.3 ? 'Warm' : driveAmount < 0.6 ? 'Driven' : 'Distorted';
        document.getElementById('description').textContent = `Drive: ${Math.round(driveAmount * 100)}%`;

        document.getElementById('waveform').classList.remove('hidden');
        playFn = () => playAdvancedSynth({ wave, note, drive: driveAmount });
    }

    // BITCRUSH MODE
    else if (params.has('bitcrush')) {
        const bits = parseInt(params.get('bitcrush')) || 8;
        const note = params.get('note') || 'C3';
        const wave = params.get('wave') || 'sawtooth';

        document.getElementById('soundType').textContent = 'Bit Crusher';
        document.getElementById('soundName').textContent = bits <= 4 ? 'Crushed' : bits <= 8 ? 'Lo-Fi' : 'Light Crush';
        document.getElementById('description').textContent = `${bits}-bit`;

        document.getElementById('waveform').classList.remove('hidden');
        playFn = () => playAdvancedSynth({ wave, note, bitcrush: bits });
    }

    // UNISON MODE
    else if (params.has('unison')) {
        const voices = parseInt(params.get('unison')) || 5;
        const detuneAmt = parseFloat(params.get('detune')) || 0.3;
        const note = params.get('note') || 'C3';
        const wave = params.get('wave') || 'sawtooth';

        document.getElementById('soundType').textContent = 'Unison';
        document.getElementById('soundName').textContent = voices <= 3 ? 'Thick' : voices <= 5 ? 'Wide' : 'Massive';
        document.getElementById('description').textContent = `${voices} voices • ${Math.round(detuneAmt * 100)}% detune`;

        document.getElementById('waveform').classList.remove('hidden');
        playFn = () => playAdvancedSynth({ wave, note, unison: voices, detune: detuneAmt });
    }

    // NOISE LAYER MODE
    else if (params.has('noise') && !params.has('drum')) {
        const noiseAmt = parseFloat(params.get('noise')) || 0.3;
        const note = params.get('note') || 'C3';
        const wave = params.get('wave') || 'sawtooth';

        document.getElementById('soundType').textContent = 'Noise Layer';
        document.getElementById('soundName').textContent = noiseAmt < 0.3 ? 'Breathy' : noiseAmt < 0.6 ? 'Textured' : 'Noisy';
        document.getElementById('description').textContent = `Noise: ${Math.round(noiseAmt * 100)}%`;

        document.getElementById('waveform').classList.remove('hidden');
        playFn = () => playAdvancedSynth({ wave, note, noise: noiseAmt });
    }

    // FILTER MODE
    else if (params.has('filter')) {
        const filterType = params.get('filter').toLowerCase();
        const cutoff = parseInt(params.get('cutoff')) || 1000;
        const res = parseInt(params.get('res')) || parseInt(params.get('resonance')) || 1;
        const note = params.get('note') || 'C3';

        const names = {
            lowpass: 'Low-Pass Filter', highpass: 'High-Pass Filter',
            bandpass: 'Band-Pass Filter', notch: 'Notch Filter'
        };
        const descs = {
            lowpass: 'Cuts highs, keeps lows',
            highpass: 'Cuts lows, keeps highs',
            bandpass: 'Keeps frequencies around cutoff',
            notch: 'Removes frequencies at cutoff'
        };

        document.getElementById('soundType').textContent = 'Filter';
        document.getElementById('soundName').textContent = names[filterType] || filterType;
        document.getElementById('description').textContent = `${cutoff}Hz • Q: ${res}`;

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawFilterCurve(canvas, filterType, cutoff, res), 50);

        playFn = () => playFilter(filterType, cutoff, res, note);
    }

    // FILTER SWEEP MODE
    else if (params.has('sweep')) {
        const filterType = params.get('sweep').toLowerCase();
        const fromFreq = parseInt(params.get('from')) || 200;
        const toFreq = parseInt(params.get('to')) || 8000;
        const note = params.get('note') || 'C3';

        document.getElementById('soundType').textContent = 'Filter Sweep';
        document.getElementById('soundName').textContent = `${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
        document.getElementById('description').textContent = `${fromFreq}Hz → ${toFreq}Hz`;

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawFilterCurve(canvas, filterType, fromFreq, 4), 50);

        playFn = () => playFilterSweep(filterType, fromFreq, toFreq, note);
    }

    // ENVELOPE MODE
    else if (params.has('envelope')) {
        const preset = params.get('envelope').toLowerCase();
        let a, d, s, r;

        // Presets
        const presets = {
            pluck: { a: 0.01, d: 0.2, s: 0, r: 0.3 },
            pad: { a: 0.8, d: 0.3, s: 0.7, r: 1.5 },
            organ: { a: 0.01, d: 0.1, s: 1, r: 0.1 },
            strings: { a: 0.5, d: 0.2, s: 0.8, r: 0.8 },
            brass: { a: 0.1, d: 0.15, s: 0.6, r: 0.3 },
            perc: { a: 0.001, d: 0.3, s: 0, r: 0.2 }
        };

        if (presets[preset]) {
            ({ a, d, s, r } = presets[preset]);
        } else if (preset === 'custom') {
            a = parseFloat(params.get('a')) || 0.1;
            d = parseFloat(params.get('d')) || 0.2;
            s = parseFloat(params.get('s')) || 0.5;
            r = parseFloat(params.get('r')) || 0.5;
        } else {
            a = 0.1; d = 0.2; s = 0.5; r = 0.5;
        }

        document.getElementById('soundType').textContent = 'Envelope (ADSR)';
        document.getElementById('soundName').textContent = preset.charAt(0).toUpperCase() + preset.slice(1);
        document.getElementById('description').textContent = `A:${a} D:${d} S:${s} R:${r}`;

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawEnvelope(canvas, a, d, s, r), 50);

        playFn = () => playEnvelope(a, d, s, r);
    }

    // LFO MODE
    else if (params.has('lfo')) {
        const target = params.get('lfo').toLowerCase();
        const shape = params.get('shape') || 'sine';
        const rate = parseFloat(params.get('rate')) || 4;
        const depth = parseFloat(params.get('depth')) || 0.5;
        const note = params.get('note') || 'C4';

        const names = {
            tremolo: 'Tremolo', vibrato: 'Vibrato',
            filter: 'Filter LFO', amplitude: 'Amplitude LFO',
            pitch: 'Pitch LFO'
        };
        const descs = {
            tremolo: 'Volume modulation',
            vibrato: 'Pitch modulation',
            filter: 'Cutoff modulation',
            amplitude: 'Volume modulation',
            pitch: 'Frequency modulation'
        };

        document.getElementById('soundType').textContent = 'LFO';
        document.getElementById('soundName').textContent = names[target] || target;
        document.getElementById('description').textContent = `${shape} • ${rate}Hz • ${Math.round(depth * 100)}%`;

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawLFO(canvas, shape, rate, depth), 50);

        playFn = () => playLFOEffect(target, shape, rate, depth, note);
    }

    // HARMONICS MODE
    else if (params.has('harmonics')) {
        const harmonicsStr = params.get('harmonics');
        const harmonics = harmonicsStr.split(',').map(h => parseFloat(h.trim()) || 0);

        // Pad to at least 8 harmonics
        while (harmonics.length < 8) harmonics.push(0);

        document.getElementById('soundType').textContent = 'Additive Synthesis';
        document.getElementById('soundName').textContent = 'Harmonics';
        document.getElementById('description').textContent = `${harmonics.filter(h => h > 0).length} partials`;

        const canvas = document.getElementById('synthCanvas');
        canvas.classList.remove('hidden');
        setTimeout(() => drawHarmonics(canvas, harmonics), 50);

        playFn = () => playHarmonics(harmonics);
    }

    // COMPARE MODE
    else if (params.has('compare')) {
        const compareType = params.get('compare').toLowerCase();
        const grid = document.getElementById('compareGrid');
        grid.classList.remove('hidden');
        grid.innerHTML = '';

        if (compareType === 'waves') {
            const waves = ['sine', 'square', 'sawtooth', 'triangle'];
            waves.forEach(wave => {
                const item = document.createElement('div');
                item.className = 'compare-item';
                const canvas = document.createElement('canvas');
                item.appendChild(canvas);
                const label = document.createElement('div');
                label.className = 'compare-label';
                label.textContent = wave.charAt(0).toUpperCase() + wave.slice(1);
                item.appendChild(label);
                grid.appendChild(item);

                item.addEventListener('click', () => playWaveform(wave));
                setTimeout(() => drawWaveform(canvas, wave), 50);
            });

            document.getElementById('soundType').textContent = 'Compare';
            document.getElementById('soundName').textContent = 'Waveforms';
            document.getElementById('description').textContent = 'Tap each to hear';
            document.getElementById('playBtn').style.display = 'none';
        }
        else if (compareType === 'filters') {
            const filters = ['lowpass', 'highpass', 'bandpass', 'notch'];
            filters.forEach(filter => {
                const item = document.createElement('div');
                item.className = 'compare-item';
                const canvas = document.createElement('canvas');
                item.appendChild(canvas);
                const label = document.createElement('div');
                label.className = 'compare-label';
                label.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);
                item.appendChild(label);
                grid.appendChild(item);

                item.addEventListener('click', () => playFilter(filter, 1000, 4));
                setTimeout(() => drawFilterCurve(canvas, filter, 1000, 4), 50);
            });

            document.getElementById('soundType').textContent = 'Compare';
            document.getElementById('soundName').textContent = 'Filters';
            document.getElementById('description').textContent = 'Tap each to hear';
            document.getElementById('playBtn').style.display = 'none';
        }
        else if (compareType === 'envelopes') {
            const envs = [
                { name: 'Pluck', a: 0.01, d: 0.2, s: 0, r: 0.3 },
                { name: 'Pad', a: 0.8, d: 0.3, s: 0.7, r: 1.5 },
                { name: 'Organ', a: 0.01, d: 0.1, s: 1, r: 0.1 },
                { name: 'Perc', a: 0.001, d: 0.3, s: 0, r: 0.2 }
            ];
            envs.forEach(env => {
                const item = document.createElement('div');
                item.className = 'compare-item';
                const canvas = document.createElement('canvas');
                item.appendChild(canvas);
                const label = document.createElement('div');
                label.className = 'compare-label';
                label.textContent = env.name;
                item.appendChild(label);
                grid.appendChild(item);

                item.addEventListener('click', () => playEnvelope(env.a, env.d, env.s, env.r));
                setTimeout(() => drawEnvelope(canvas, env.a, env.d, env.s, env.r), 50);
            });

            document.getElementById('soundType').textContent = 'Compare';
            document.getElementById('soundName').textContent = 'Envelopes';
            document.getElementById('description').textContent = 'Tap each to hear';
            document.getElementById('playBtn').style.display = 'none';
        }
    }

    // DEFAULT - No sound specified
    else {
        document.getElementById('soundType').textContent = '🎵 Sound Player';
        document.getElementById('soundName').textContent = 'No Sound Specified';
        document.getElementById('description').textContent = 'Tap below to see examples';
        document.getElementById('playBtn').textContent = '📖 Show Usage';

        // Create help panel
        const helpPanel = document.createElement('div');
        helpPanel.id = 'helpPanel';
        helpPanel.innerHTML = `
            <div class="help-section">
                <div class="help-title">🎹 Chords & Progressions</div>
                <code>?chord=Cmaj7</code>
                <code>?progression=Am,F,C,G</code>
            </div>
            <div class="help-section">
                <div class="help-title">🎼 Scales & Intervals</div>
                <code>?scale=dorian&root=D</code>
                <code>?interval=tritone&root=C</code>
            </div>
            <div class="help-section">
                <div class="help-title">🥁 Drums & Patterns</div>
                <code>?pattern=four-on-floor</code>
                <code>?kick=1,3&snare=2,4&hihat=8ths</code>
            </div>
            <div class="help-section">
                <div class="help-title">〰️ Waveforms</div>
                <code>?wave=saw</code>
                <code>?compare=waves</code>
            </div>
            <div class="help-section">
                <div class="help-title">🔻 Filters</div>
                <code>?filter=lowpass&cutoff=1000</code>
                <code>?sweep=lowpass&from=200&to=8000</code>
            </div>
            <div class="help-section">
                <div class="help-title">📈 Envelopes & LFO</div>
                <code>?envelope=pluck</code>
                <code>?lfo=tremolo&rate=6</code>
            </div>
            <div class="help-section">
                <div class="help-title">🎛️ Synths & FX</div>
                <code>?synth=supersaw&note=C3</code>
                <code>?harmonics=1,0.5,0.33</code>
            </div>
            <div class="help-section">
                <div class="help-title">🔊 Effects</div>
                <code>?drive=0.5</code>
                <code>?unison=7&detune=0.3</code>
                <code>?bitcrush=6</code>
                <code>?noise=0.3</code>
            </div>
        `;
        helpPanel.style.cssText = `
            display: none;
            margin-top: 20px;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            text-align: left;
            max-width: 320px;
            animation: slideIn 0.3s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .help-section {
                margin-bottom: 12px;
            }
            .help-section:last-child {
                margin-bottom: 0;
            }
            .help-title {
                font-size: 12px;
                color: #e94560;
                margin-bottom: 4px;
                font-weight: 600;
            }
            #helpPanel code {
                display: block;
                background: rgba(0,0,0,0.3);
                padding: 6px 10px;
                border-radius: 6px;
                font-size: 11px;
                color: #a8d8ea;
                margin: 4px 0;
                font-family: 'SF Mono', Monaco, monospace;
            }
        `;
        document.head.appendChild(style);

        document.querySelector('.container').appendChild(helpPanel);

        let helpVisible = false;
        document.getElementById('playBtn').onclick = () => {
            helpVisible = !helpVisible;
            helpPanel.style.display = helpVisible ? 'block' : 'none';
            document.getElementById('playBtn').textContent = helpVisible ? '✕ Hide Usage' : '📖 Show Usage';
        };
    }

    // Unified event handling to prevent double-firing on touch devices
    const playBtn = document.getElementById('playBtn');
    let isTriggering = false;

    const handlePlay = async (e) => {
        if (isTriggering) return;
        isTriggering = true;

        if (e) e.preventDefault();

        try {
            await playFn();
        } finally {
            // Reset after a short delay to prevent rapid re-triggering
            setTimeout(() => { isTriggering = false; }, 300);
        }
    };

    playBtn.addEventListener('click', handlePlay);
    playBtn.addEventListener('touchstart', handlePlay, { passive: false });

    // Check if we need to show iOS unlock
    setTimeout(checkAudioContext, 100);
}

// iOS unlock handler
document.getElementById('iosUnlock')?.addEventListener('click', async () => {
    await Tone.start();
    audioUnlocked = true;
    document.getElementById('iosUnlock').classList.add('hidden');
});

// Initialize when DOM is ready
init();
