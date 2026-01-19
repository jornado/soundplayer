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

// ============ TIME SIGNATURES ============
const TIME_SIGNATURES = {
    '4/4': { beats: 4, division: 4, accent: [1, 0, 0, 0] },
    '3/4': { beats: 3, division: 4, accent: [1, 0, 0] },
    '2/4': { beats: 2, division: 4, accent: [1, 0] },
    '6/8': { beats: 6, division: 8, accent: [1, 0, 0, 1, 0, 0] },
    '5/4': { beats: 5, division: 4, accent: [1, 0, 0, 1, 0] },
    '7/8': { beats: 7, division: 8, accent: [1, 0, 0, 1, 0, 1, 0] },
    '9/8': { beats: 9, division: 8, accent: [1, 0, 0, 1, 0, 0, 1, 0, 0] },
    '12/8': { beats: 12, division: 8, accent: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] },
};

// ============ POLYRHYTHMS ============
const POLYRHYTHMS = {
    '3:2': { a: 3, b: 2, name: '3 against 2', desc: 'Hemiola' },
    '4:3': { a: 4, b: 3, name: '4 against 3', desc: 'Cross-rhythm' },
    '5:4': { a: 5, b: 4, name: '5 against 4', desc: 'Complex cross' },
    '5:3': { a: 5, b: 3, name: '5 against 3', desc: 'Quintuplet feel' },
    '7:4': { a: 7, b: 4, name: '7 against 4', desc: 'Septuplet' },
};

// ============ ARPEGGIATOR PATTERNS ============
const ARP_PATTERNS = {
    'up': { name: 'Up', gen: (n) => [...Array(n).keys()] },
    'down': { name: 'Down', gen: (n) => [...Array(n).keys()].reverse() },
    'updown': { name: 'Up-Down', gen: (n) => [...Array(n).keys(), ...[...Array(n-2).keys()].map(i => n-2-i)] },
    'downup': { name: 'Down-Up', gen: (n) => [...Array(n).keys()].reverse().concat([...Array(n-2).keys()].map(i => i+1)) },
    'random': { name: 'Random', gen: (n) => [...Array(n).keys()].sort(() => Math.random() - 0.5) },
    'order': { name: 'As Played', gen: (n) => [...Array(n).keys()] },
};

// ============ BASSLINE PATTERNS ============
const BASSLINE_PATTERNS = {
    'acid': {
        name: 'Acid 303',
        notes: [0, 0, 12, 0, 0, 7, 0, 5, 0, 0, 12, 0, 3, 0, 0, 7],
        accents: [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        slides: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
        bpm: 130
    },
    'house': {
        name: 'House',
        notes: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
        accents: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        bpm: 124
    },
    'funk': {
        name: 'Funk',
        notes: [0, -1, 7, -1, 0, 5, -1, 7, 0, -1, 5, -1, 0, 7, -1, 5],
        accents: [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
        bpm: 100
    },
    'disco': {
        name: 'Disco',
        notes: [0, 0, 12, 12, 0, 0, 7, 7, 0, 0, 12, 12, 5, 5, 7, 7],
        accents: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        bpm: 118
    },
};

// ============ MELODIC PHRASES ============
const MELODY_PHRASES = {
    'pentatonic': {
        name: 'Pentatonic Lick',
        notes: [0, 2, 4, 7, 9, 7, 4, 2],
        durations: [0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1],
    },
    'blues': {
        name: 'Blues Lick',
        notes: [0, 3, 5, 6, 7, 10, 7, 5, 3, 0],
        durations: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.25, 0.25, 0.5, 1],
    },
    'jazz': {
        name: 'Jazz Line',
        notes: [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0],
        durations: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 1],
    },
    'trance': {
        name: 'Trance Arp',
        notes: [0, 4, 7, 12, 7, 4, 0, 4, 7, 12, 16, 12, 7, 4, 7, 12],
        durations: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
    },
};

// ============ GENRE PRESETS ============
const GENRE_PRESETS = {
    'lofi': {
        name: 'Lo-Fi',
        synth: { wave: 'triangle', attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 },
        effects: { bitcrush: 10, drive: 0.1 },
        reverb: 0.6,
        bpm: 75,
    },
    'synthwave': {
        name: 'Synthwave',
        synth: { wave: 'sawtooth', attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
        effects: { chorus: 0.5, delay: 0.3 },
        reverb: 0.4,
        bpm: 100,
    },
    'techno': {
        name: 'Techno',
        synth: { wave: 'sawtooth', attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.1 },
        effects: { drive: 0.3 },
        reverb: 0.2,
        bpm: 130,
    },
    'ambient': {
        name: 'Ambient',
        synth: { wave: 'sine', attack: 1.5, decay: 0.5, sustain: 0.8, release: 3 },
        effects: { chorus: 0.3 },
        reverb: 0.8,
        bpm: 60,
    },
    'dubstep': {
        name: 'Dubstep',
        synth: { wave: 'sawtooth', attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.3 },
        effects: { drive: 0.6, bitcrush: 8 },
        reverb: 0.3,
        bpm: 140,
    },
    'house': {
        name: 'House',
        synth: { wave: 'sawtooth', attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
        effects: { chorus: 0.2 },
        reverb: 0.35,
        bpm: 124,
    },
    'trap': {
        name: 'Trap',
        synth: { wave: 'square', attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.5 },
        effects: { drive: 0.2 },
        reverb: 0.25,
        bpm: 140,
    },
    'dnb': {
        name: 'Drum & Bass',
        synth: { wave: 'sawtooth', attack: 0.001, decay: 0.15, sustain: 0.4, release: 0.2 },
        effects: { drive: 0.4 },
        reverb: 0.2,
        bpm: 174,
    },
};

// ============ FORMANT FREQUENCIES ============
const FORMANTS = {
    'a': { f1: 800, f2: 1200, f3: 2500 },   // "ah" as in father
    'e': { f1: 400, f2: 2000, f3: 2550 },   // "eh" as in bed
    'i': { f1: 280, f2: 2250, f3: 2900 },   // "ee" as in see
    'o': { f1: 500, f2: 800, f3: 2830 },    // "oh" as in go
    'u': { f1: 350, f2: 650, f3: 2700 },    // "oo" as in boot
};

// ============ CIRCLE OF FIFTHS ============
const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const RELATIVE_MINORS = { 'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
                          'F#': 'D#m', 'Db': 'Bbm', 'Ab': 'Fm', 'Eb': 'Cm', 'Bb': 'Gm', 'F': 'Dm' };

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

// ============ CHORD HELPERS ============
function getChordInversion(intervals, inversion) {
    if (inversion <= 0 || inversion >= intervals.length) return intervals;
    // Move bottom notes up an octave
    const inverted = [...intervals];
    for (let i = 0; i < inversion; i++) {
        inverted.push(inverted.shift() + 12);
    }
    return inverted;
}

function getVoiceLeading(chord1Notes, chord2Intervals, root2Midi) {
    // Find smoothest voice leading between two chords
    const chord2Notes = chord2Intervals.map(i => root2Midi + i);
    const result = [];

    chord1Notes.forEach((note1, i) => {
        // Find closest note in chord2
        let closest = chord2Notes[0];
        let minDist = Math.abs(note1 - closest);

        chord2Notes.forEach(note2 => {
            const dist = Math.abs(note1 - note2);
            if (dist < minDist) {
                minDist = dist;
                closest = note2;
            }
            // Also check octave above/below
            [note2 - 12, note2 + 12].forEach(n => {
                const d = Math.abs(note1 - n);
                if (d < minDist) {
                    minDist = d;
                    closest = n;
                }
            });
        });
        result.push(closest);
    });

    return result;
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
