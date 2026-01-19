// ============ CHORD DEFINITIONS ============
const CHORD_TYPES = {
    // Triads
    'maj': [0, 4, 7], 'major': [0, 4, 7], '': [0, 4, 7],
    'min': [0, 3, 7], 'minor': [0, 3, 7], 'm': [0, 3, 7],
    'dim': [0, 3, 6], 'aug': [0, 4, 8],
    'sus2': [0, 2, 7], 'sus4': [0, 5, 7],
    // 7th chords
    'maj7': [0, 4, 7, 11], '7': [0, 4, 7, 10], 'dom7': [0, 4, 7, 10],
    'min7': [0, 3, 7, 10], 'm7': [0, 3, 7, 10],
    'dim7': [0, 3, 6, 9], 'hdim7': [0, 3, 6, 10], 'm7b5': [0, 3, 6, 10],
    'minmaj7': [0, 3, 7, 11], 'mmaj7': [0, 3, 7, 11],
    'aug7': [0, 4, 8, 10], '7#5': [0, 4, 8, 10],
    '7sus4': [0, 5, 7, 10],
    // Extended chords
    'maj9': [0, 4, 7, 11, 14], '9': [0, 4, 7, 10, 14],
    'min9': [0, 3, 7, 10, 14], 'm9': [0, 3, 7, 10, 14],
    'add9': [0, 4, 7, 14], 'madd9': [0, 3, 7, 14],
    '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9],
    '6/9': [0, 4, 7, 9, 14], 'm6/9': [0, 3, 7, 9, 14],
    'maj11': [0, 4, 7, 11, 14, 17], '11': [0, 4, 7, 10, 14, 17],
    'min11': [0, 3, 7, 10, 14, 17], 'm11': [0, 3, 7, 10, 14, 17],
    'maj13': [0, 4, 7, 11, 14, 21], '13': [0, 4, 7, 10, 14, 21],
    'min13': [0, 3, 7, 10, 14, 21], 'm13': [0, 3, 7, 10, 14, 21],
    // Altered dominants
    '7b9': [0, 4, 7, 10, 13], '7#9': [0, 4, 7, 10, 15],
    '7b5': [0, 4, 6, 10], '7#11': [0, 4, 7, 10, 18],
    '7b13': [0, 4, 7, 10, 20], '7alt': [0, 4, 6, 10, 13],
    '7#5#9': [0, 4, 8, 10, 15], '7b5b9': [0, 4, 6, 10, 13],
    // Quartal/quintal
    'quartal': [0, 5, 10], 'quintal': [0, 7, 14],
    // Power chord
    '5': [0, 7], 'power': [0, 7, 12],
};

// ============ SCALE DEFINITIONS ============
const SCALE_TYPES = {
    'major': [0, 2, 4, 5, 7, 9, 11], 'ionian': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10], 'aeolian': [0, 2, 3, 5, 7, 8, 10],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10],
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
    'melodic-minor': [0, 2, 3, 5, 7, 9, 11],
    'pentatonic': [0, 2, 4, 7, 9],
    'minor-pentatonic': [0, 3, 5, 7, 10],
    'blues': [0, 3, 5, 6, 7, 10],
    'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'whole-tone': [0, 2, 4, 6, 8, 10],
};

// ============ INTERVAL DEFINITIONS ============
const INTERVALS = {
    'unison': 0, 'minor-2nd': 1, 'major-2nd': 2, 'minor-3rd': 3,
    'major-3rd': 4, 'perfect-4th': 5, 'tritone': 6, 'perfect-5th': 7,
    'minor-6th': 8, 'major-6th': 9, 'minor-7th': 10, 'major-7th': 11,
    'octave': 12,
};

// ============ NOTE MAPPINGS ============
const NOTE_TO_MIDI = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

const MIDI_TO_NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ============ DRUM PATTERNS ============
const DRUM_PATTERNS = {
    'four-on-floor': {
        name: 'Four on the Floor',
        desc: 'House/Techno classic',
        bpm: 120,
        steps: [
            { beat: 0, drum: 'kick' }, { beat: 0, drum: 'hihat' },
            { beat: 0.5, drum: 'hihat' },
            { beat: 1, drum: 'kick' }, { beat: 1, drum: 'snare' }, { beat: 1, drum: 'hihat' },
            { beat: 1.5, drum: 'hihat' },
            { beat: 2, drum: 'kick' }, { beat: 2, drum: 'hihat' },
            { beat: 2.5, drum: 'hihat' },
            { beat: 3, drum: 'kick' }, { beat: 3, drum: 'snare' }, { beat: 3, drum: 'hihat' },
            { beat: 3.5, drum: 'hihat' },
        ]
    },
    'breakbeat': {
        name: 'Breakbeat',
        desc: 'Syncopated funk pattern',
        bpm: 100,
        steps: [
            { beat: 0, drum: 'kick' }, { beat: 0, drum: 'hihat' },
            { beat: 0.5, drum: 'hihat' },
            { beat: 1, drum: 'snare' }, { beat: 1, drum: 'hihat' },
            { beat: 1.5, drum: 'hihat' }, { beat: 1.75, drum: 'kick' },
            { beat: 2, drum: 'hihat' },
            { beat: 2.5, drum: 'kick' }, { beat: 2.5, drum: 'hihat' },
            { beat: 3, drum: 'snare' }, { beat: 3, drum: 'hihat' },
            { beat: 3.5, drum: 'hihat' },
        ]
    },
    'trap': {
        name: 'Trap',
        desc: 'Hip-hop/trap with hi-hat rolls',
        bpm: 140,
        steps: [
            { beat: 0, drum: '808' }, { beat: 0, drum: 'hihat' },
            { beat: 0.25, drum: 'hihat' }, { beat: 0.5, drum: 'hihat' }, { beat: 0.75, drum: 'hihat' },
            { beat: 1, drum: 'snare' }, { beat: 1, drum: 'hihat' },
            { beat: 1.25, drum: 'hihat' }, { beat: 1.5, drum: 'hihat' }, { beat: 1.75, drum: 'hihat' },
            { beat: 2, drum: '808' }, { beat: 2, drum: 'hihat' },
            { beat: 2.25, drum: 'hihat' }, { beat: 2.5, drum: 'hihat' }, { beat: 2.75, drum: 'hihat' },
            { beat: 3, drum: 'snare' }, { beat: 3, drum: 'hihat' },
            { beat: 3.25, drum: 'hihat' }, { beat: 3.5, drum: 'hihat' }, { beat: 3.5, drum: 'clap' },
            { beat: 3.75, drum: 'hihat' },
        ]
    },
    'rock': {
        name: 'Rock',
        desc: 'Classic rock beat',
        bpm: 110,
        steps: [
            { beat: 0, drum: 'kick' }, { beat: 0, drum: 'hihat' },
            { beat: 0.5, drum: 'hihat' },
            { beat: 1, drum: 'snare' }, { beat: 1, drum: 'hihat' },
            { beat: 1.5, drum: 'hihat' },
            { beat: 2, drum: 'kick' }, { beat: 2, drum: 'hihat' },
            { beat: 2.5, drum: 'kick' }, { beat: 2.5, drum: 'hihat' },
            { beat: 3, drum: 'snare' }, { beat: 3, drum: 'hihat' },
            { beat: 3.5, drum: 'hihat' },
        ]
    },
    'disco': {
        name: 'Disco',
        desc: 'Open hi-hat groove',
        bpm: 118,
        steps: [
            { beat: 0, drum: 'kick' },
            { beat: 0.5, drum: 'openhat' },
            { beat: 1, drum: 'kick' }, { beat: 1, drum: 'snare' },
            { beat: 1.5, drum: 'openhat' },
            { beat: 2, drum: 'kick' },
            { beat: 2.5, drum: 'openhat' },
            { beat: 3, drum: 'kick' }, { beat: 3, drum: 'snare' },
            { beat: 3.5, drum: 'openhat' },
        ]
    },
    'dnb': {
        name: 'Drum & Bass',
        desc: 'Fast jungle pattern',
        bpm: 174,
        steps: [
            { beat: 0, drum: 'kick' }, { beat: 0, drum: 'hihat' },
            { beat: 0.5, drum: 'hihat' }, { beat: 0.75, drum: 'snare' },
            { beat: 1, drum: 'hihat' },
            { beat: 1.5, drum: 'kick' }, { beat: 1.5, drum: 'hihat' },
            { beat: 2, drum: 'snare' }, { beat: 2, drum: 'hihat' },
            { beat: 2.5, drum: 'hihat' },
            { beat: 3, drum: 'kick' }, { beat: 3, drum: 'hihat' },
            { beat: 3.5, drum: 'hihat' },
        ]
    },
    'halftime': {
        name: 'Half-time',
        desc: 'Slow, heavy feel',
        bpm: 140,
        steps: [
            { beat: 0, drum: 'kick' }, { beat: 0, drum: 'hihat' },
            { beat: 0.5, drum: 'hihat' },
            { beat: 1, drum: 'hihat' },
            { beat: 1.5, drum: 'hihat' },
            { beat: 2, drum: 'snare' }, { beat: 2, drum: 'hihat' },
            { beat: 2.5, drum: 'hihat' },
            { beat: 3, drum: 'hihat' },
            { beat: 3.5, drum: 'kick' }, { beat: 3.5, drum: 'hihat' },
        ]
    },
};

// ============ HELPER FUNCTIONS ============
function parseNote(noteStr) {
    const match = noteStr.match(/^([A-G][#b]?)(\d)?$/i);
    if (!match) return null;
    const [, note, octave] = match;
    const noteName = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
    return `${noteName}${octave || 4}`;
}

function midiToNote(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const note = MIDI_TO_NOTE[midi % 12];
    return `${note}${octave}`;
}

function noteToMidi(noteStr) {
    const match = noteStr.match(/^([A-G][#b]?)(\d)$/i);
    if (!match) return 60;
    const [, note, octave] = match;
    const noteName = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
    return NOTE_TO_MIDI[noteName] + (parseInt(octave) + 1) * 12;
}

// ============ CUSTOM PATTERN PARSER ============
function parseCustomPattern(params) {
    const bars = Math.min(parseInt(params.get('bars')) || 1, 4);
    const bpm = parseInt(params.get('bpm')) || 120;
    const totalBeats = bars * 4;

    const steps = [];
    const drumParams = [
        'kick', '808', 'snare', 'clap', 'hihat', 'openhat', 'crash', 'rim', 'tom', 'tomlow',
        'shaker', 'tamb', 'tambourine', 'cowbell', 'conga', 'congalow', 'bongo', 'bongolow',
        'woodblock', 'block', 'triangle', 'maracas', 'guiro'
    ];

    drumParams.forEach(drum => {
        if (params.has(drum)) {
            const value = params.get(drum);
            const beats = parseBeats(value, totalBeats);
            beats.forEach(beat => {
                steps.push({ beat: beat, drum: drum });
            });
        }
    });

    // Also support compact format: beats=kick:1,2,3,4|snare:2,4
    if (params.has('beats')) {
        const beatsStr = params.get('beats');
        const parts = beatsStr.split('|');
        parts.forEach(part => {
            const [drum, values] = part.split(':');
            if (drum && values && drumParams.includes(drum)) {
                const beats = parseBeats(values, totalBeats);
                beats.forEach(beat => {
                    steps.push({ beat: beat, drum: drum });
                });
            }
        });
    }

    return {
        name: 'Custom Pattern',
        desc: `${bars} bar${bars > 1 ? 's' : ''}`,
        bpm: bpm,
        bars: bars,
        steps: steps
    };
}

function parseBeats(value, totalBeats) {
    // Handle shorthand patterns
    if (value === '16ths') {
        return Array.from({ length: totalBeats * 4 }, (_, i) => i * 0.25);
    }
    if (value === '8ths') {
        return Array.from({ length: totalBeats * 2 }, (_, i) => i * 0.5);
    }
    if (value === '4ths' || value === 'quarters') {
        return Array.from({ length: totalBeats }, (_, i) => i);
    }
    if (value === 'offbeat') {
        return Array.from({ length: totalBeats }, (_, i) => i + 0.5);
    }
    if (value === 'backbeat') {
        const beats = [];
        for (let bar = 0; bar < totalBeats / 4; bar++) {
            beats.push(bar * 4 + 1);
            beats.push(bar * 4 + 3);
        }
        return beats;
    }

    // Parse comma-separated beat numbers (1-indexed in URL, 0-indexed internally)
    return value.split(',').map(b => {
        const beat = parseFloat(b.trim());
        return beat - 1;
    }).filter(b => !isNaN(b) && b >= 0 && b < totalBeats);
}
