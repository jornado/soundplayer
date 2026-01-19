# Music Sound Player

**Embeddable audio examples for Obsidian music guides**

🔗 **Live URL:** https://jornado.github.io/soundplayer/

Supports chords, scales, intervals, drums, synths, and FX. Works on iPhone, iPad, and desktop.

---

## Usage Examples

### Chords

```markdown
[🔊 C Major 7](https://jornado.github.io/soundplayer/?chord=Cmaj7)
[🔊 D minor](https://jornado.github.io/soundplayer/?chord=Dm)
[🔊 F# sus2](https://jornado.github.io/soundplayer/?chord=F%23sus2)
```

<iframe src="https://jornado.github.io/soundplayer/?chord=Cmaj7&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?chord=Cmaj7&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

### Progressions (Chord Transitions)

Play multiple chords in sequence to hear transitions:

```markdown
[🔊 C → G7](https://jornado.github.io/soundplayer/?progression=C,G7)
[🔊 Am → E7 → Am](https://jornado.github.io/soundplayer/?progression=Am,E7,Am)
[🔊 ii-V-I](https://jornado.github.io/soundplayer/?progression=Dm7,G7,Cmaj7)
```

<iframe src="https://jornado.github.io/soundplayer/?progression=Dm7,G7,Cmaj7&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?progression=Dm7,G7,Cmaj7&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

**With custom tempo:**
```markdown
[🔊 Slow transition](https://jornado.github.io/soundplayer/?progression=C,Am&tempo=1200)
[🔊 Fast transition](https://jornado.github.io/soundplayer/?progression=C,Am&tempo=400)
```

### Scales

```markdown
[🔊 C Dorian](https://jornado.github.io/soundplayer/?scale=dorian&root=C)
[🔊 A Harmonic Minor](https://jornado.github.io/soundplayer/?scale=harmonic-minor&root=A)
[🔊 E Blues](https://jornado.github.io/soundplayer/?scale=blues&root=E)
```

<iframe src="https://jornado.github.io/soundplayer/?scale=dorian&root=C&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?scale=dorian&root=C&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

### Intervals

```markdown
[🔊 Tritone](https://jornado.github.io/soundplayer/?interval=tritone&root=C)
[🔊 Perfect 5th](https://jornado.github.io/soundplayer/?interval=perfect-5th&root=G)
[🔊 Minor 3rd](https://jornado.github.io/soundplayer/?interval=minor-3rd&root=A)
```

<iframe src="https://jornado.github.io/soundplayer/?interval=tritone&root=C&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?interval=tritone&root=C&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

### Drums & Percussion

```markdown
[🥁 Kick](https://jornado.github.io/soundplayer/?drum=kick)
[🥁 808](https://jornado.github.io/soundplayer/?drum=808)
[🥁 Snare](https://jornado.github.io/soundplayer/?drum=snare)
[🥁 Hi-Hat](https://jornado.github.io/soundplayer/?drum=hihat)
[🥁 Clap](https://jornado.github.io/soundplayer/?drum=clap)
[🪇 Shaker](https://jornado.github.io/soundplayer/?drum=shaker)
[🪘 Conga](https://jornado.github.io/soundplayer/?drum=conga)
[🔔 Cowbell](https://jornado.github.io/soundplayer/?drum=cowbell)
[🔺 Triangle](https://jornado.github.io/soundplayer/?drum=triangle)
```

<iframe src="https://jornado.github.io/soundplayer/?drum=kick&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?drum=kick&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

### Drum Patterns (Presets)

Play complete drum grooves (1 bar):

```markdown
[🥁 Four on the Floor](https://jornado.github.io/soundplayer/?pattern=four-on-floor)
[🥁 Breakbeat](https://jornado.github.io/soundplayer/?pattern=breakbeat)
[🥁 Trap](https://jornado.github.io/soundplayer/?pattern=trap)
[🥁 Rock](https://jornado.github.io/soundplayer/?pattern=rock)
[🥁 Disco](https://jornado.github.io/soundplayer/?pattern=disco)
[🥁 Drum & Bass](https://jornado.github.io/soundplayer/?pattern=dnb)
[🥁 Half-time](https://jornado.github.io/soundplayer/?pattern=halftime)
```

<iframe src="https://jornado.github.io/soundplayer/?pattern=four-on-floor&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

### Custom Drum Patterns

Build your own patterns with precise beat placement (1-4 bars):

**Beat notation:** `1` = beat 1, `1.5` = 8th note, `1.25` = 16th note

```markdown
[🥁 Basic Rock](https://jornado.github.io/soundplayer/?kick=1,3&snare=2,4&hihat=8ths&bpm=110)
[🥁 Syncopated](https://jornado.github.io/soundplayer/?kick=1,2.5&snare=2,4&hihat=16ths&bpm=95)
[🥁 2-Bar Groove](https://jornado.github.io/soundplayer/?bars=2&kick=1,3,5,7.5&snare=2,4,6,8&hihat=8ths&bpm=100)
```

<iframe src="https://jornado.github.io/soundplayer/?kick=1,3&snare=2,4&hihat=8ths&bpm=110&compact" width="280" height="180" style="border:none;border-radius:12px;"></iframe>

**Compact format** (all drums in one param):
```markdown
[🥁 House](https://jornado.github.io/soundplayer/?beats=kick:1,2,3,4|snare:2,4|hihat:8ths&bpm=124)
```

**Shorthand patterns:**
- `16ths` - all 16th notes
- `8ths` - all 8th notes
- `4ths` - all quarter notes
- `offbeat` - offbeats only (1.5, 2.5, 3.5, 4.5)
- `backbeat` - beats 2 and 4

<iframe src="https://jornado.github.io/soundplayer/?bars=2&kick=1,3,5,7&snare=2,4,6,8&hihat=8ths&openhat=2,6&bpm=118&compact" width="280" height="200" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?kick=1,3&snare=2,4&hihat=8ths&bpm=110&compact" width="280" height="180" style="border:none;border-radius:12px;"></iframe>
```

### Synths

```markdown
[🎹 Supersaw](https://jornado.github.io/soundplayer/?synth=supersaw&note=C3)
[🎹 Reese Bass](https://jornado.github.io/soundplayer/?synth=reese&note=E1)
[🎹 303 Acid](https://jornado.github.io/soundplayer/?synth=acid303&note=C2)
[🎹 Pluck](https://jornado.github.io/soundplayer/?synth=pluck&note=G4)
[🎹 Pad](https://jornado.github.io/soundplayer/?synth=pad&note=C4)
[🎹 Lead](https://jornado.github.io/soundplayer/?synth=lead&note=E5)
```

<iframe src="https://jornado.github.io/soundplayer/?synth=supersaw&note=C3&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Embed code:**
```html
<iframe src="https://jornado.github.io/soundplayer/?synth=supersaw&note=C3&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

### FX

```markdown
[💥 Riser](https://jornado.github.io/soundplayer/?fx=riser)
[💥 Impact](https://jornado.github.io/soundplayer/?fx=impact)
[💥 Sweep](https://jornado.github.io/soundplayer/?fx=sweep)
```

<iframe src="https://jornado.github.io/soundplayer/?fx=riser&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

---

## Synthesis Education

### Waveforms

Compare basic oscillator shapes with visual representation:

```markdown
[〰️ Sine Wave](https://jornado.github.io/soundplayer/?wave=sine)
[⬛ Square Wave](https://jornado.github.io/soundplayer/?wave=square)
[📐 Sawtooth](https://jornado.github.io/soundplayer/?wave=saw)
[🔺 Triangle](https://jornado.github.io/soundplayer/?wave=triangle)
```

<iframe src="https://jornado.github.io/soundplayer/?wave=saw&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Compare all waveforms side-by-side:**

<iframe src="https://jornado.github.io/soundplayer/?compare=waves&compact" width="280" height="200" style="border:none;border-radius:12px;"></iframe>

### Filters

Hear and visualize different filter types:

```markdown
[🔻 Low-Pass](https://jornado.github.io/soundplayer/?filter=lowpass&cutoff=1000&res=4)
[🔺 High-Pass](https://jornado.github.io/soundplayer/?filter=highpass&cutoff=500&res=2)
[◆ Band-Pass](https://jornado.github.io/soundplayer/?filter=bandpass&cutoff=800&res=8)
[◇ Notch](https://jornado.github.io/soundplayer/?filter=notch&cutoff=1000&res=4)
```

<iframe src="https://jornado.github.io/soundplayer/?filter=lowpass&cutoff=1000&res=4&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Filter sweep with animation:**

```markdown
[🌊 LP Sweep Up](https://jornado.github.io/soundplayer/?sweep=lowpass&from=200&to=8000)
[🌊 HP Sweep Down](https://jornado.github.io/soundplayer/?sweep=highpass&from=4000&to=200)
```

<iframe src="https://jornado.github.io/soundplayer/?sweep=lowpass&from=200&to=4000&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Compare all filters:**

<iframe src="https://jornado.github.io/soundplayer/?compare=filters&compact" width="280" height="200" style="border:none;border-radius:12px;"></iframe>

### Envelopes (ADSR)

Visualize and hear different envelope shapes:

```markdown
[🎸 Pluck](https://jornado.github.io/soundplayer/?envelope=pluck)
[🎹 Pad](https://jornado.github.io/soundplayer/?envelope=pad)
[🎺 Brass](https://jornado.github.io/soundplayer/?envelope=brass)
[🥁 Perc](https://jornado.github.io/soundplayer/?envelope=perc)
```

<iframe src="https://jornado.github.io/soundplayer/?envelope=pluck&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Custom ADSR:**

```markdown
[Custom](https://jornado.github.io/soundplayer/?envelope=custom&a=0.3&d=0.2&s=0.6&r=1.0)
```

<iframe src="https://jornado.github.io/soundplayer/?envelope=custom&a=0.5&d=0.3&s=0.4&r=0.8&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**Compare envelopes:**

<iframe src="https://jornado.github.io/soundplayer/?compare=envelopes&compact" width="280" height="200" style="border:none;border-radius:12px;"></iframe>

### LFO (Modulation)

Hear different modulation effects:

```markdown
[📳 Tremolo](https://jornado.github.io/soundplayer/?lfo=tremolo&rate=6&depth=0.8)
[〰️ Vibrato](https://jornado.github.io/soundplayer/?lfo=vibrato&rate=5&depth=0.3)
[🌊 Filter Wobble](https://jornado.github.io/soundplayer/?lfo=filter&rate=2&depth=0.7)
```

<iframe src="https://jornado.github.io/soundplayer/?lfo=tremolo&rate=6&depth=0.8&shape=sine&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

**LFO shapes:**
- `shape=sine` - Smooth modulation
- `shape=square` - On/off gating
- `shape=triangle` - Linear sweep
- `shape=saw` - Ramp up/down

### Harmonics (Additive Synthesis)

Build sounds from individual harmonics:

```markdown
[Fundamental only](https://jornado.github.io/soundplayer/?harmonics=1)
[Odd harmonics (square-ish)](https://jornado.github.io/soundplayer/?harmonics=1,0,0.33,0,0.2,0,0.14)
[All harmonics (saw-ish)](https://jornado.github.io/soundplayer/?harmonics=1,0.5,0.33,0.25,0.2,0.17,0.14,0.12)
```

<iframe src="https://jornado.github.io/soundplayer/?harmonics=1,0.5,0.33,0.25,0.2&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

### Saturation/Drive

Add warmth and grit with distortion:

```markdown
[🔥 Warm](https://jornado.github.io/soundplayer/?drive=0.2)
[🔥 Driven](https://jornado.github.io/soundplayer/?drive=0.5)
[🔥 Distorted](https://jornado.github.io/soundplayer/?drive=0.8)
```

<iframe src="https://jornado.github.io/soundplayer/?drive=0.5&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

### Bit Crushing

Create lo-fi, grainy textures:

```markdown
[📟 Heavy crush (4-bit)](https://jornado.github.io/soundplayer/?bitcrush=4)
[📟 Lo-fi (8-bit)](https://jornado.github.io/soundplayer/?bitcrush=8)
[📟 Light crush (12-bit)](https://jornado.github.io/soundplayer/?bitcrush=12)
```

<iframe src="https://jornado.github.io/soundplayer/?bitcrush=6&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

### Unison & Detune

Make sounds fuller and wider:

```markdown
[🎹 Thick (3 voices)](https://jornado.github.io/soundplayer/?unison=3&detune=0.2)
[🎹 Wide (5 voices)](https://jornado.github.io/soundplayer/?unison=5&detune=0.3)
[🎹 Massive (7 voices)](https://jornado.github.io/soundplayer/?unison=7&detune=0.5)
```

<iframe src="https://jornado.github.io/soundplayer/?unison=5&detune=0.3&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

### Noise Layer

Add breathiness and texture:

```markdown
[💨 Breathy](https://jornado.github.io/soundplayer/?noise=0.2)
[💨 Textured](https://jornado.github.io/soundplayer/?noise=0.4)
[💨 Noisy](https://jornado.github.io/soundplayer/?noise=0.7)
```

<iframe src="https://jornado.github.io/soundplayer/?noise=0.3&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>

---

## All Parameters

### Chord Parameters

| Param | Values | Example |
|-------|--------|---------|
| `chord` | Any chord name | `Cmaj7`, `Dm`, `F#sus2`, `Bb7` |
| `octave` | 2-6 | `4` (default) |

**Supported chord types:**

| Category | Types |
|----------|-------|
| **Triads** | `maj`, `min`/`m`, `dim`, `aug`, `sus2`, `sus4`, `5`/`power` |
| **7th** | `maj7`, `7`/`dom7`, `min7`/`m7`, `dim7`, `m7b5`/`hdim7`, `mmaj7`, `aug7`, `7sus4` |
| **Extended** | `maj9`, `9`, `m9`, `add9`, `madd9`, `6`, `m6`, `6/9`, `m6/9` |
| | `maj11`, `11`, `m11`, `maj13`, `13`, `m13` |
| **Altered** | `7b9`, `7#9`, `7b5`, `7#11`, `7b13`, `7alt`, `7#5#9`, `7b5b9` |
| **Other** | `quartal`, `quintal` |

### Scale Parameters

| Param | Values | Example |
|-------|--------|---------|
| `scale` | Scale name | `dorian`, `blues`, `pentatonic` |
| `root` | Root note | `C`, `F#`, `Bb` |
| `octave` | 2-6 | `4` (default) |

**Supported scales:**
`major`/`ionian`, `minor`/`aeolian`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `locrian`, `harmonic-minor`, `melodic-minor`, `pentatonic`, `minor-pentatonic`, `blues`, `chromatic`, `whole-tone`

### Interval Parameters

| Param | Values | Example |
|-------|--------|---------|
| `interval` | Interval name | `tritone`, `perfect-5th` |
| `root` | Root note | `C`, `G` |

**Supported intervals:**
`unison`, `minor-2nd`, `major-2nd`, `minor-3rd`, `major-3rd`, `perfect-4th`, `tritone`, `perfect-5th`, `minor-6th`, `major-6th`, `minor-7th`, `major-7th`, `octave`

### Drum Parameters

| Category | Values |
|----------|--------|
| **Kit** | `kick`, `808`, `snare`, `clap`, `rim` |
| **Cymbals** | `hihat`, `openhat`, `crash` |
| **Shakers** | `shaker`, `tamb`, `maracas`, `guiro` |
| **Bells** | `cowbell`, `triangle`, `woodblock` |
| **Toms** | `tom`, `tomlow`, `conga`, `congalow`, `bongo`, `bongolow` |

### Drum Pattern Parameters (Presets)

| Param | Values | BPM | Description |
|-------|--------|-----|-------------|
| `pattern` | `four-on-floor` | 120 | House/Techno classic |
| | `breakbeat` | 100 | Syncopated funk |
| | `trap` | 140 | Hi-hat rolls |
| | `rock` | 110 | Classic rock |
| | `disco` | 118 | Open hi-hat groove |
| | `dnb` | 174 | Fast jungle |
| | `halftime` | 140 | Slow, heavy feel |

### Custom Pattern Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `bars` | `1`-`4` | Number of bars (default: 1) |
| `bpm` | `60`-`200` | Tempo (default: 120) |
| `kick` | Beat numbers | Kick drum hits |
| `snare` | Beat numbers | Snare hits |
| `hihat` | Beat numbers or shorthand | Hi-hat hits |
| `openhat` | Beat numbers | Open hi-hat hits |
| `clap` | Beat numbers | Clap hits |
| `808` | Beat numbers | 808 kick hits |
| `crash` | Beat numbers | Crash cymbal |
| `rim` | Beat numbers | Rim shot |
| `tom` | Beat numbers | Tom hit |
| `beats` | Compact format | All drums in one param |

**Beat number format:**
- `1` = beat 1 (downbeat)
- `1.5` = 8th note after beat 1
- `1.25` = first 16th note after beat 1
- `1.75` = third 16th note after beat 1
- `2,4` = beats 2 and 4

**Shorthand values:**
- `16ths` = all 16th notes
- `8ths` = all 8th notes
- `4ths` = quarter notes
- `offbeat` = offbeats (1.5, 2.5, etc.)
- `backbeat` = beats 2 and 4 of each bar

**Compact format:**
`beats=kick:1,3|snare:2,4|hihat:8ths`

### Synth Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `synth` | `supersaw` | Detuned saws (trance/EDM) |
| | `reese` | Detuned bass (DnB/dubstep) |
| | `acid303` | TB-303 style (acid/techno) |
| | `bass808` | TR-808 bass (hip-hop/trap) |
| | `sub` | Pure sine sub bass |
| | `wobble` | LFO modulated bass |
| | `fmbass` | FM synthesis bass |
| | `pluck` | Plucked string |
| | `pad` | Soft sustained |
| | `lead` | Square wave melody |
| | `organ` | Sustained organ tone |
| | `strings` | Slow attack string pad |
| | `brass` | Brass stab sound |
| | `bell` | FM bell/chime |
| `note` | Note + octave | `C3`, `E1`, `G4` |

### FX Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `fx` | `riser` | 2-bar noise build |
| | `sweep` | 4-bar filter sweep |
| | `downlifter` | Falling noise sweep |
| | `impact` | Downbeat hit |
| | `boom` | Low sub impact |

### Waveform Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `wave` | `sine` | Pure tone, no harmonics |
| | `square` | Hollow, odd harmonics |
| | `saw`/`sawtooth` | Bright, all harmonics |
| | `triangle` | Soft, odd harmonics |
| | `pulse` | Variable width square |
| `note` | Note + octave | `C4`, `A3` (default: C4) |

### Filter Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `filter` | `lowpass` | Cuts high frequencies |
| | `highpass` | Cuts low frequencies |
| | `bandpass` | Keeps band around cutoff |
| | `notch` | Removes band at cutoff |
| `cutoff` | `20`-`20000` | Filter frequency in Hz |
| `res` | `0`-`20` | Resonance/Q factor |

### Filter Sweep Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `sweep` | Filter type | `lowpass`, `highpass`, etc. |
| `from` | Hz | Starting frequency |
| `to` | Hz | Ending frequency |

### Envelope Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `envelope` | `pluck` | Fast attack, no sustain |
| | `pad` | Slow attack, long release |
| | `organ` | Instant attack, full sustain |
| | `strings` | Medium attack, sustain |
| | `brass` | Quick attack, medium sustain |
| | `perc` | Instant attack, quick decay |
| | `custom` | Use a/d/s/r params |
| `a` | `0.001`-`2` | Attack time (seconds) |
| `d` | `0.001`-`2` | Decay time (seconds) |
| `s` | `0`-`1` | Sustain level |
| `r` | `0.001`-`3` | Release time (seconds) |

### LFO Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `lfo` | `tremolo` | Volume modulation |
| | `vibrato` | Pitch modulation |
| | `filter` | Filter cutoff mod |
| `shape` | `sine`, `square`, `triangle`, `saw` | LFO waveform |
| `rate` | `0.1`-`20` | Speed in Hz |
| `depth` | `0`-`1` | Modulation amount |

### Harmonics Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `harmonics` | Comma-separated | Amplitude of each harmonic |
| | Example: `1,0.5,0.33,0.25` | Fundamental + overtones |

### Effects Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `drive` | `0`-`1` | Saturation/distortion amount (0.2=warm, 0.5=driven, 0.8=distorted) |
| `bitcrush` | `4`-`16` | Bit depth for lo-fi effect (4=crushed, 8=lo-fi, 12=subtle) |
| `unison` | `1`-`9` | Number of stacked voices (more=fuller) |
| `detune` | `0`-`1` | Detune spread between unison voices (0.3 typical) |
| `noise` | `0`-`1` | Noise layer amount (0.2=breathy, 0.5=textured, 0.8=noisy) |
| `wave` | Waveform type | Base wave for effects (default: sawtooth) |
| `note` | Note + octave | Pitch to play (default: C3) |

### Spatial Effects Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `reverb` | `room`, `hall`, `plate`, `cathedral` | Reverb type (adds space/depth) |
| `delay` | `8n`, `4n`, `16n`, etc. | Delay time (rhythmic notation) |
| `feedback` | `0`-`0.9` | Delay feedback amount |
| `chorus` | `0`-`1` | Chorus depth (0.3=subtle, 0.6=lush, 0.9=thick) |
| `phaser` | `0.1`-`5` | Phaser rate in Hz (0.3=slow, 1=medium, 3=fast) |
| `pan` | `0`-`1` | Stereo position (0=left, 0.5=center, 1=right) |
| `sidechain` | `2`-`16` | Number of pumping beats |
| `bpm` | `60`-`200` | Tempo for sidechain effect |

### Advanced Synthesis Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `fm` | Any value | Enable FM synthesis mode |
| `ratio` | `0.5`-`16` | Carrier:modulator frequency ratio |
| `mod` | `0`-`20` | Modulation index (higher=more harmonics) |
| `ringmod` | `100`-`2000` | Ring modulator frequency in Hz |
| `pwm` | `0.1`-`0.9` | Initial pulse width |
| `rate` | `0.1`-`10` | PWM modulation rate in Hz |
| `formant` | `a`, `e`, `i`, `o`, `u` | Vowel formant synthesis |

### Rhythm & Timing Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `metronome` | `40`-`240` | BPM for metronome clicks |
| `beats` | `1`-`32` | Number of clicks to play |
| `accent` | `2`-`8` | Accent every N beats (default: 4) |
| `timesig` | `4/4`, `3/4`, `6/8`, `5/4`, `7/8`, etc. | Time signature to demonstrate |
| `poly` | `3:2`, `4:3`, `5:4`, `5:3`, `7:4` | Polyrhythm to demonstrate |
| `swing` | `0`-`1` | Swing amount (0=straight, 0.5=medium, 0.8=heavy shuffle) |
| `bars` | `1`-`4` | Number of bars to play |

### Music Theory Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `chord` + `inversion` | `1`, `2`, `3` | Chord inversion (1st, 2nd, 3rd) |
| `voicelead` | Chord progression | Smooth voice leading demo (e.g., `C,Am,F,G`) |
| `circle` | `fifths` | Circle of fifths progression |
| `start` | Note name | Starting key for circle (default: C) |
| `steps` | `1`-`12` | How many keys around the circle |

### Arpeggiator Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `arp` | `up`, `down`, `updown`, `downup`, `random` | Arpeggio pattern |
| `chord` | Chord name | Chord to arpeggiate (e.g., `Cm7`) |
| `rate` | `4`, `8`, `16`, `32` | Note rate (default: 8 = 8th notes) |
| `octaves` | `1`-`3` | Octave range for arpeggio |

### Bassline Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `bassline` | `acid`, `house`, `funk`, `disco` | Bassline pattern style |
| `root` | Note name | Root note (default: C) |
| `octave` | `1`-`3` | Bass octave (default: 2) |

### Melody Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `melody` | `pentatonic`, `blues`, `jazz`, `trance` | Melodic phrase style |
| `root` | Note name | Starting note (default: C) |
| `octave` | `3`-`5` | Melody octave (default: 4) |

### Genre Preset Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `genre` | `lofi` | Lo-fi: bitcrushed triangle, slow BPM |
| | `synthwave` | Synthwave: chorused saw, delay |
| | `techno` | Techno: aggressive saw, fast |
| | `ambient` | Ambient: slow sine, lots of reverb |
| | `dubstep` | Dubstep: driven saw, bitcrush |
| | `house` | House: chorused saw, 124 BPM |
| | `trap` | Trap: square wave, 140 BPM |
| | `dnb` | Drum & Bass: driven saw, 174 BPM |

### Compare Mode

| Param | Values | Shows |
|-------|--------|-------|
| `compare` | `waves` | 4 waveforms side-by-side |
| | `filters` | 4 filter types |
| | `envelopes` | 4 envelope presets |
| | `modes` | 7 church modes (use with `root=`) |

### Display Parameters

| Param | Effect |
|-------|--------|
| `compact` | Minimal UI for embeds |

---

## Obsidian Integration Tips

### Inline Links
```markdown
The **Cmaj7** chord [🔊](https://jornado.github.io/soundplayer/?chord=Cmaj7) has a dreamy quality.
```

### Reference Section
```markdown
## Audio Examples

| Sound | Link |
|-------|------|
| Cmaj7 | [🔊 Play](https://jornado.github.io/soundplayer/?chord=Cmaj7) |
| Dorian | [🔊 Play](https://jornado.github.io/soundplayer/?scale=dorian&root=D) |
| 808 Kick | [🔊 Play](https://jornado.github.io/soundplayer/?drum=808) |
```

### Embedded Player
```html
<iframe src="https://jornado.github.io/soundplayer/?chord=Dm7&compact" width="280" height="160" style="border:none;border-radius:12px;"></iframe>
```

---

## Technical Notes

- Uses [Tone.js](https://tonejs.github.io/) for synthesis
- No server required — runs in browser
- Audio starts on tap/click (iOS requirement)
- Auto-detects iframe for compact mode
- All sounds are synthesized (no samples needed)

---

## Project Structure

The codebase is organized into separate modules for maintainability:

```
chord-player/
├── index.html          # Minimal HTML, loads all modules
├── styles.css          # All CSS styles
├── data.js             # Chord types, scales, intervals, patterns, helpers
├── instruments.js      # Tone.js instrument definitions
├── visualizations.js   # Canvas drawing (waveforms, filters, envelopes)
├── ui.js               # DOM manipulation, piano, drum grid, animations
├── playback.js         # Basic playback functions (chords, drums, synths)
├── effects.js          # Advanced synthesis with effects chain
├── router.js           # URL parameter parsing and initialization
└── README.md           # Documentation
```

### Module Dependencies

```
data.js          (no deps)
instruments.js   → Tone.js
visualizations.js (no deps)
ui.js            → data.js
playback.js      → instruments.js, ui.js, data.js
effects.js       → instruments.js, ui.js, visualizations.js
router.js        → all modules
```

### Adding New Features

1. **New chord type**: Add to `CHORD_TYPES` in `data.js`
2. **New scale**: Add to `SCALE_TYPES` in `data.js`
3. **New drum pattern**: Add to `DRUM_PATTERNS` in `data.js`
4. **New time signature**: Add to `TIME_SIGNATURES` in `data.js`
5. **New polyrhythm**: Add to `POLYRHYTHMS` in `data.js`
6. **New arpeggio pattern**: Add to `ARP_PATTERNS` in `data.js`
7. **New bassline**: Add to `BASSLINE_PATTERNS` in `data.js`
8. **New melody phrase**: Add to `MELODY_PHRASES` in `data.js`
9. **New genre preset**: Add to `GENRE_PRESETS` in `data.js`
10. **New vowel formant**: Add to `FORMANTS` in `data.js`
11. **New instrument**: Add to `initAudio()` in `instruments.js`
12. **New effect**: Add to `effects.js` and handle in `router.js`
13. **New URL parameter**: Add case in `init()` in `router.js`
