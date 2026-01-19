// ============ UI FUNCTIONS ============
// DOM manipulation, animations, and interactive elements

// Set play button state
function setPlaying(playing) {
    const btn = document.getElementById('playBtn');
    if (playing) {
        btn.classList.add('playing');
        btn.textContent = '■ Playing';
    } else {
        btn.classList.remove('playing');
        btn.textContent = '▶ Play';
    }
}

// Animate the visualizer bars
function animateVisualizer() {
    const viz = document.getElementById('visualizer');
    viz.classList.remove('hidden');
    viz.innerHTML = '';

    for (let i = 0; i < 16; i++) {
        const bar = document.createElement('div');
        bar.className = 'viz-bar';
        viz.appendChild(bar);
    }

    let frame = 0;
    const animate = () => {
        if (frame > 30) {
            viz.querySelectorAll('.viz-bar').forEach(b => b.style.height = '10px');
            return;
        }
        viz.querySelectorAll('.viz-bar').forEach((bar, i) => {
            const height = Math.random() * 50 + 10;
            bar.style.height = height + 'px';
        });
        frame++;
        requestAnimationFrame(animate);
    };
    animate();
}

// Show waveform display
function animateWaveform() {
    const wf = document.getElementById('waveform');
    wf.classList.remove('hidden');
}

// Build piano keyboard display
function buildPiano(notes) {
    const piano = document.getElementById('piano');
    piano.innerHTML = '';
    piano.classList.remove('hidden');

    const midiNotes = notes.map(noteToMidi);
    let minNote = Math.min(...midiNotes) - 2;
    let maxNote = Math.max(...midiNotes) + 2;
    minNote = Math.floor(minNote / 12) * 12;
    maxNote = Math.ceil(maxNote / 12) * 12;

    const blackKeys = [1, 3, 6, 8, 10];

    for (let midi = minNote; midi <= maxNote; midi++) {
        const noteInOctave = midi % 12;
        const octave = Math.floor(midi / 12) - 1;
        const noteName = MIDI_TO_NOTE[noteInOctave] + octave;

        if (!blackKeys.includes(noteInOctave)) {
            const key = document.createElement('div');
            key.className = 'key';
            key.dataset.note = noteName;
            if (notes.includes(noteName)) key.classList.add('active');
            piano.appendChild(key);
        }
    }

    const whiteKeys = piano.querySelectorAll('.key:not(.black)');
    let whiteIndex = 0;

    for (let midi = minNote; midi <= maxNote; midi++) {
        const noteInOctave = midi % 12;
        const octave = Math.floor(midi / 12) - 1;
        const noteName = MIDI_TO_NOTE[noteInOctave] + octave;

        if (blackKeys.includes(noteInOctave)) {
            const key = document.createElement('div');
            key.className = 'key black';
            key.dataset.note = noteName;
            if (notes.includes(noteName)) key.classList.add('active');
            if (whiteKeys[whiteIndex]) whiteKeys[whiteIndex].after(key);
        } else {
            whiteIndex++;
        }
    }
}

// Setup control buttons
function setupControls(type, options) {
    const controls = document.getElementById('controls');
    controls.innerHTML = '';

    options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'control-btn' + (i === 0 ? ' active' : '');
        btn.textContent = opt.label;
        btn.onclick = () => {
            controls.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            opt.action();
        };
        controls.appendChild(btn);
    });
}

// Build drum grid visualization
function buildDrumGrid(pattern) {
    const grid = document.getElementById('drumGrid');
    grid.classList.remove('hidden');
    grid.innerHTML = '';

    // Determine which drums are used in this pattern
    const drumsUsed = [...new Set(pattern.steps.map(s => s.drum))];
    const drumOrder = [
        'kick', '808', 'snare', 'clap', 'rim',
        'hihat', 'openhat', 'shaker', 'tamb', 'tambourine', 'maracas',
        'cowbell', 'triangle', 'woodblock', 'block',
        'tom', 'tomlow', 'conga', 'congalow', 'bongo', 'bongolow',
        'crash', 'guiro'
    ];
    const orderedDrums = drumOrder.filter(d => drumsUsed.includes(d));

    const drumLabels = {
        kick: 'K', '808': '808', snare: 'S', clap: 'CL', rim: 'RM',
        hihat: 'HH', openhat: 'OH', shaker: 'SH', tamb: 'TB', tambourine: 'TB', maracas: 'MR',
        cowbell: 'CB', triangle: 'TR', woodblock: 'WB', block: 'WB',
        tom: 'TM', tomlow: 'TL', conga: 'CG', congalow: 'CL', bongo: 'BG', bongolow: 'BL',
        crash: 'CR', guiro: 'GR'
    };

    // Calculate steps based on bars (default 1 bar = 16 steps)
    const bars = pattern.bars || 1;
    const numSteps = bars * 16;
    const isCompact = document.body.classList.contains('compact') ||
                      window.innerWidth < 400;

    // For mobile with many bars, use 8th note resolution
    const stepDivision = (bars > 2 && isCompact) ? 2 : 4; // 2 = 8th notes, 4 = 16th notes
    const displaySteps = bars * 4 * (stepDivision === 2 ? 2 : 4);

    orderedDrums.forEach(drum => {
        const row = document.createElement('div');
        row.className = 'drum-row';

        const label = document.createElement('div');
        label.className = 'drum-label';
        label.textContent = drumLabels[drum];
        row.appendChild(label);

        const steps = document.createElement('div');
        steps.className = 'drum-steps';

        for (let i = 0; i < displaySteps; i++) {
            const step = document.createElement('div');
            step.className = `drum-step ${drum}`;
            const beatTime = i / stepDivision;
            step.dataset.beat = beatTime;
            step.dataset.drum = drum;

            // Add bar separator styling
            if (i > 0 && i % (4 * stepDivision) === 0) {
                step.style.marginLeft = '4px';
            }

            // Check if this step has a hit
            const hasHit = pattern.steps.some(s =>
                s.drum === drum && Math.abs(s.beat - beatTime) < 0.01
            );
            if (hasHit) {
                step.classList.add('active');
            }

            steps.appendChild(step);
        }

        row.appendChild(steps);
        grid.appendChild(row);
    });

    // Add beat markers
    const markers = document.createElement('div');
    markers.className = 'beat-marker';
    for (let i = 0; i < displaySteps; i++) {
        const marker = document.createElement('div');
        marker.className = 'beat-num';

        // Add bar separator spacing
        if (i > 0 && i % (4 * stepDivision) === 0) {
            marker.style.marginLeft = '4px';
        }

        if (i % stepDivision === 0) {
            marker.classList.add('downbeat');
            const beatNum = (i / stepDivision) + 1;
            // Show bar.beat format for multi-bar
            if (bars > 1) {
                const bar = Math.floor((beatNum - 1) / 4) + 1;
                const beat = ((beatNum - 1) % 4) + 1;
                marker.textContent = beat === 1 ? `${bar}.1` : beat;
            } else {
                marker.textContent = beatNum;
            }
        }
        markers.appendChild(marker);
    }
    grid.appendChild(markers);

    return grid;
}

// Animate drum grid during playback
function animateDrumGrid(pattern) {
    const bars = pattern.bars || 1;
    const beatDuration = 60 / pattern.bpm;
    const stepDuration = beatDuration / 4; // 16th notes
    const totalSteps = bars * 16;

    for (let i = 0; i < totalSteps; i++) {
        setTimeout(() => {
            // Remove playing class from all
            document.querySelectorAll('.drum-step.playing').forEach(el => {
                el.classList.remove('playing');
            });

            // Add playing class to current column's active steps
            const beatTime = i / 4;
            document.querySelectorAll(`.drum-step.active`).forEach(el => {
                if (Math.abs(parseFloat(el.dataset.beat) - beatTime) < 0.01) {
                    el.classList.add('playing');
                }
            });
        }, i * stepDuration * 1000);
    }
}
