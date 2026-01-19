// ============ CANVAS VISUALIZATIONS ============
// Drawing functions for waveforms, filters, envelopes, LFOs, and harmonics

function drawWaveform(canvas, type, color = '#e94560') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const cycles = 3;
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * cycles * Math.PI * 2;
        let y;

        switch(type) {
            case 'sine':
                y = Math.sin(phase);
                break;
            case 'square':
                y = Math.sin(phase) > 0 ? 1 : -1;
                break;
            case 'sawtooth':
            case 'saw':
                y = 1 - 2 * ((phase % (Math.PI * 2)) / (Math.PI * 2));
                break;
            case 'triangle':
                y = 2 * Math.abs(2 * ((phase / (Math.PI * 2)) % 1) - 1) - 1;
                break;
            case 'pulse':
                const pulseWidth = 0.25;
                y = ((phase % (Math.PI * 2)) / (Math.PI * 2)) < pulseWidth ? 1 : -1;
                break;
            default:
                y = Math.sin(phase);
        }

        const py = centerY - y * amplitude;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
    }

    ctx.stroke();
}

function drawFilterCurve(canvas, filterType, cutoff, resonance, color = '#4ade80') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const padding = { top: 10, bottom: 25, left: 5, right: 5 };
    const graphHeight = height - padding.top - padding.bottom;
    const graphWidth = width - padding.left - padding.right;

    ctx.clearRect(0, 0, width, height);

    // Draw grid - horizontal lines with dB labels
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '8px system-ui';
    ctx.textAlign = 'right';

    const dbLevels = [0, -6, -12, -18];
    dbLevels.forEach((db, i) => {
        const y = padding.top + (i / (dbLevels.length - 1)) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    });

    // Draw frequency markers (logarithmic)
    const freqMarkers = [100, 500, 1000, 5000, 10000];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    freqMarkers.forEach(freq => {
        const x = padding.left + (Math.log10(freq / 20) / Math.log10(20000 / 20)) * graphWidth;
        // Vertical grid line
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
        // Label
        const label = freq >= 1000 ? (freq / 1000) + 'k' : freq;
        ctx.fillText(label, x, height - 8);
    });

    // Calculate filter response points
    const cutoffNorm = Math.log10(cutoff / 20) / Math.log10(20000 / 20); // Logarithmic
    const cutoffX = padding.left + cutoffNorm * graphWidth;
    const resBoost = resonance * 0.4;

    const points = [];
    for (let x = 0; x <= graphWidth; x++) {
        const freqNorm = x / graphWidth; // 0-1 in log space
        let gain;

        switch(filterType) {
            case 'lowpass':
                if (freqNorm < cutoffNorm) {
                    gain = 1 + (freqNorm > cutoffNorm * 0.8 ? resBoost * Math.sin((freqNorm - cutoffNorm * 0.8) / (cutoffNorm * 0.2) * Math.PI / 2) : 0);
                } else {
                    const rolloff = (freqNorm - cutoffNorm) / (1 - cutoffNorm);
                    gain = Math.max(0.01, Math.pow(1 - rolloff, 2)) * (1 + resBoost * Math.max(0, 1 - rolloff * 3));
                }
                break;
            case 'highpass':
                if (freqNorm > cutoffNorm) {
                    gain = 1 + (freqNorm < cutoffNorm * 1.2 ? resBoost * Math.sin((cutoffNorm * 1.2 - freqNorm) / (cutoffNorm * 0.2) * Math.PI / 2) : 0);
                } else {
                    const rolloff = (cutoffNorm - freqNorm) / cutoffNorm;
                    gain = Math.max(0.01, Math.pow(1 - rolloff, 2)) * (1 + resBoost * Math.max(0, 1 - rolloff * 3));
                }
                break;
            case 'bandpass':
                const bandwidth = 0.15;
                const dist = Math.abs(freqNorm - cutoffNorm);
                if (dist < bandwidth) {
                    gain = (1 - dist / bandwidth) * (1 + resBoost * 0.5);
                } else {
                    gain = Math.max(0.01, Math.pow(1 - (dist - bandwidth) * 2, 2));
                }
                break;
            case 'notch':
                const notchWidth = 0.08;
                const notchDist = Math.abs(freqNorm - cutoffNorm);
                gain = notchDist < notchWidth ? (notchDist / notchWidth) * 0.9 + 0.1 : 1;
                break;
            default:
                gain = 1;
        }

        const px = padding.left + x;
        const py = padding.top + (1 - Math.min(1.3, gain)) / 1.3 * graphHeight;
        points.push({ x: px, y: py });
    }

    // Draw filled area under curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, color + '60');
    gradient.addColorStop(1, color + '10');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Draw filter response line with glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw cutoff line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cutoffX, padding.top);
    ctx.lineTo(cutoffX, height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cutoff frequency label
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    const cutoffLabel = cutoff >= 1000 ? (cutoff / 1000).toFixed(1) + 'k' : cutoff;
    ctx.fillText(cutoffLabel, cutoffX, padding.top - 2);
}

function drawEnvelope(canvas, a, d, s, r, color = '#e94560') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const padding = 10;

    ctx.clearRect(0, 0, width, height);

    // Normalize times
    const total = a + d + 0.5 + r; // 0.5 for sustain hold
    const attackX = padding + (a / total) * (width - padding * 2);
    const decayX = attackX + (d / total) * (width - padding * 2);
    const sustainX = decayX + (0.5 / total) * (width - padding * 2);
    const releaseX = width - padding;

    const top = padding;
    const bottom = height - padding;
    const sustainY = top + (1 - s) * (bottom - top);

    // Draw envelope shape
    ctx.fillStyle = `${color}33`;
    ctx.beginPath();
    ctx.moveTo(padding, bottom);
    ctx.lineTo(attackX, top);
    ctx.lineTo(decayX, sustainY);
    ctx.lineTo(sustainX, sustainY);
    ctx.lineTo(releaseX, bottom);
    ctx.closePath();
    ctx.fill();

    // Draw envelope line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, bottom);
    ctx.lineTo(attackX, top);
    ctx.lineTo(decayX, sustainY);
    ctx.lineTo(sustainX, sustainY);
    ctx.lineTo(releaseX, bottom);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('A', attackX, bottom + 12);
    ctx.fillText('D', (attackX + decayX) / 2, bottom + 12);
    ctx.fillText('S', (decayX + sustainX) / 2, bottom + 12);
    ctx.fillText('R', (sustainX + releaseX) / 2, bottom + 12);
}

function drawLFO(canvas, shape, rate, depth, color = '#e94560') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.35 * depth;

    ctx.clearRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw LFO shape
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const cycles = rate / 2;
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * cycles * Math.PI * 2;
        let y;

        switch(shape) {
            case 'sine':
                y = Math.sin(phase);
                break;
            case 'square':
                y = Math.sin(phase) > 0 ? 1 : -1;
                break;
            case 'saw':
            case 'sawtooth':
                y = 1 - 2 * ((phase % (Math.PI * 2)) / (Math.PI * 2));
                break;
            case 'triangle':
                y = 2 * Math.abs(2 * ((phase / (Math.PI * 2)) % 1) - 1) - 1;
                break;
            default:
                y = Math.sin(phase);
        }

        const py = centerY - y * amplitude;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
    }

    ctx.stroke();
}

function drawHarmonics(canvas, harmonics, color = '#e94560') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const barWidth = width / (harmonics.length * 2);
    const maxAmp = Math.max(...harmonics);

    ctx.clearRect(0, 0, width, height);

    harmonics.forEach((amp, i) => {
        const x = (i * 2 + 0.5) * barWidth;
        const barHeight = (amp / maxAmp) * (height - 20);

        ctx.fillStyle = color;
        ctx.fillRect(x, height - barHeight - 10, barWidth, barHeight);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(i + 1, x + barWidth / 2, height - 2);
    });
}

// Piano roll style melody visualization
function drawMelodyRoll(container, notes, durations, rootName = 'C', color = '#e94560') {
    container.innerHTML = '';
    container.classList.remove('hidden');

    // Calculate pitch range for scaling
    const minNote = Math.min(...notes);
    const maxNote = Math.max(...notes);
    const range = maxNote - minNote || 12; // Default to octave if all same note

    // Total duration for time scaling
    const totalDuration = durations.reduce((a, b) => a + b, 0);

    // Create piano roll lanes (pitch markers)
    const laneContainer = document.createElement('div');
    laneContainer.className = 'melody-lanes';

    // Determine semitones to show
    const paddedMin = minNote - 2;
    const paddedMax = maxNote + 2;
    const semitoneRange = paddedMax - paddedMin;

    // Create horizontal pitch lines
    for (let i = 0; i <= semitoneRange; i++) {
        const lane = document.createElement('div');
        lane.className = 'melody-lane';
        const semitone = paddedMax - i;
        // Highlight octave lines
        if (semitone % 12 === 0) {
            lane.classList.add('octave-line');
        }
        laneContainer.appendChild(lane);
    }
    container.appendChild(laneContainer);

    // Create note blocks
    const notesContainer = document.createElement('div');
    notesContainer.className = 'melody-notes';

    let currentTime = 0;
    notes.forEach((semitone, i) => {
        const block = document.createElement('div');
        block.className = 'melody-note';
        block.dataset.index = i;

        // Position: left is time-based, bottom is pitch-based
        const left = (currentTime / totalDuration) * 100;
        const width = (durations[i] / totalDuration) * 100;
        const bottom = ((semitone - paddedMin) / semitoneRange) * 100;

        block.style.left = `${left}%`;
        block.style.width = `${Math.max(width - 0.5, 1)}%`;
        block.style.bottom = `${bottom}%`;
        block.style.setProperty('--note-color', color);

        // Color variation based on pitch
        const hueShift = (semitone % 12) * 15;
        block.style.filter = `hue-rotate(${hueShift}deg)`;

        notesContainer.appendChild(block);
        currentTime += durations[i];
    });
    container.appendChild(notesContainer);

    // Add contour line connecting notes
    const contourSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contourSvg.classList.add('melody-contour');
    contourSvg.setAttribute('viewBox', '0 0 100 100');
    contourSvg.setAttribute('preserveAspectRatio', 'none');

    // Build path
    let pathD = '';
    currentTime = 0;
    notes.forEach((semitone, i) => {
        const x = ((currentTime + durations[i] / 2) / totalDuration) * 100;
        const y = 100 - ((semitone - paddedMin) / semitoneRange) * 100;

        if (i === 0) {
            pathD = `M ${x} ${y}`;
        } else {
            pathD += ` L ${x} ${y}`;
        }
        currentTime += durations[i];
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('opacity', '0.6');
    contourSvg.appendChild(path);
    container.appendChild(contourSvg);

    // Add beat markers
    const beatMarkers = document.createElement('div');
    beatMarkers.className = 'melody-beats';
    const beats = Math.ceil(totalDuration);
    for (let i = 0; i <= beats; i++) {
        const marker = document.createElement('div');
        marker.className = 'melody-beat-marker';
        marker.style.left = `${(i / totalDuration) * 100}%`;
        if (i > 0 && i < beats) {
            marker.classList.add('minor');
        }
        beatMarkers.appendChild(marker);
    }
    container.appendChild(beatMarkers);

    return container;
}

// Animate melody roll during playback
function animateMelodyRoll(container, durations, bpm = 100) {
    const beatDuration = 60 / bpm;
    const noteBlocks = container.querySelectorAll('.melody-note');

    let currentTime = 0;
    durations.forEach((duration, i) => {
        const noteElement = noteBlocks[i];
        if (!noteElement) return;

        // Highlight note when it plays
        setTimeout(() => {
            // Remove playing from all
            noteBlocks.forEach(n => n.classList.remove('playing'));
            noteElement.classList.add('playing');
        }, currentTime * beatDuration * 1000);

        currentTime += duration;
    });

    // Clear all highlights after melody completes
    setTimeout(() => {
        noteBlocks.forEach(n => n.classList.remove('playing'));
    }, currentTime * beatDuration * 1000);
}

// ============ EFFECT VISUALIZATIONS ============

// Delay visualization - shows echo repetitions fading
function drawDelayViz(container, delayTime, feedback, color = '#4ade80') {
    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.className = 'delay-viz';

    // Calculate number of visible echoes based on feedback
    const numEchoes = Math.min(8, Math.ceil(Math.log(0.05) / Math.log(feedback)));

    for (let i = 0; i <= numEchoes; i++) {
        const echo = document.createElement('div');
        echo.className = 'delay-echo';
        const opacity = Math.pow(feedback, i);
        const height = 60 * opacity;
        echo.style.height = `${height}%`;
        echo.style.opacity = opacity;
        echo.style.setProperty('--delay-color', color);
        echo.style.animationDelay = `${i * 0.1}s`;

        // Label for first and last
        if (i === 0) {
            echo.dataset.label = 'DRY';
        } else if (i === 1) {
            echo.dataset.label = delayTime;
        }

        wrapper.appendChild(echo);
    }

    // Add time axis
    const axis = document.createElement('div');
    axis.className = 'delay-axis';
    axis.innerHTML = `<span>0</span><span>Time →</span>`;
    wrapper.appendChild(axis);

    container.appendChild(wrapper);
    return container;
}

// Reverb visualization - decay tail curve
function drawReverbViz(container, reverbType, color = '#a78bfa') {
    container.innerHTML = '';
    container.classList.remove('hidden');

    const decayTimes = { room: 0.8, hall: 2.5, plate: 1.5, cathedral: 4 };
    const decay = decayTimes[reverbType] || 1.5;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('reverb-viz');
    svg.setAttribute('viewBox', '0 0 200 60');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Create decay curve path
    let pathD = 'M 10 55';

    // Initial spike
    pathD += ' L 15 10';

    // Exponential decay
    for (let x = 15; x <= 190; x += 2) {
        const t = (x - 15) / 175;
        const y = 10 + 45 * (1 - Math.exp(-t * 5 / decay));
        pathD += ` L ${x} ${y}`;
    }

    // Fill area
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fillPath.setAttribute('d', pathD + ' L 190 55 Z');
    fillPath.setAttribute('fill', `url(#reverbGrad-${reverbType})`);
    fillPath.setAttribute('opacity', '0.4');

    // Gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `reverbGrad-${reverbType}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('x2', '100%');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', color);
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', color);
    stop2.setAttribute('stop-opacity', '0');
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Stroke line
    const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    strokePath.setAttribute('d', pathD);
    strokePath.setAttribute('stroke', color);
    strokePath.setAttribute('stroke-width', '2');
    strokePath.setAttribute('fill', 'none');

    svg.appendChild(fillPath);
    svg.appendChild(strokePath);

    // Label
    const label = document.createElement('div');
    label.className = 'reverb-label';
    label.innerHTML = `<span>Direct</span><span>Early reflections</span><span>Tail (~${decay}s)</span>`;

    container.appendChild(svg);
    container.appendChild(label);
    return container;
}

// Stereo panning visualization
function drawPanningViz(container, panValue, color = '#f472b6') {
    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.className = 'panning-viz';

    // Left speaker
    const leftSpeaker = document.createElement('div');
    leftSpeaker.className = 'pan-speaker left';
    leftSpeaker.innerHTML = '🔊';
    const leftLevel = Math.max(0, 1 - panValue * 2);
    leftSpeaker.style.opacity = 0.3 + leftLevel * 0.7;

    // Pan indicator track
    const track = document.createElement('div');
    track.className = 'pan-track';

    const indicator = document.createElement('div');
    indicator.className = 'pan-indicator';
    indicator.style.left = `${panValue * 100}%`;
    indicator.style.setProperty('--pan-color', color);
    track.appendChild(indicator);

    // Center mark
    const center = document.createElement('div');
    center.className = 'pan-center';
    track.appendChild(center);

    // Right speaker
    const rightSpeaker = document.createElement('div');
    rightSpeaker.className = 'pan-speaker right';
    rightSpeaker.innerHTML = '🔊';
    const rightLevel = Math.max(0, (panValue - 0.5) * 2);
    rightSpeaker.style.opacity = 0.3 + rightLevel * 0.7;

    // Labels
    const labels = document.createElement('div');
    labels.className = 'pan-labels';
    labels.innerHTML = '<span>L</span><span>C</span><span>R</span>';

    wrapper.appendChild(leftSpeaker);
    wrapper.appendChild(track);
    wrapper.appendChild(rightSpeaker);
    container.appendChild(wrapper);
    container.appendChild(labels);

    return container;
}

// Chorus visualization - multiple offset waves
function drawChorusViz(canvas, depth, rate = 2, color = '#22d3ee') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.3;

    ctx.clearRect(0, 0, width, height);

    // Number of chorus voices based on depth
    const voices = Math.floor(2 + depth * 4);
    const detuneRange = depth * 0.15;

    for (let v = 0; v < voices; v++) {
        const offset = (v - voices / 2) * detuneRange;
        const alpha = 0.3 + (1 - Math.abs(offset) / detuneRange) * 0.5;

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = v === Math.floor(voices / 2) ? 2 : 1;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const phase = (x / width) * 4 * Math.PI * (1 + offset);
            const y = centerY - Math.sin(phase) * amplitude;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${voices} voices`, width / 2, height - 5);
}

// Phaser visualization - comb filter notches
function drawPhaserViz(canvas, rate, color = '#fb923c') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw frequency response with notches
    const notches = 4;
    const notchWidth = 0.08;

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '10');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x < width; x++) {
        const freq = x / width;
        let gain = 1;

        // Create notches at harmonic intervals
        for (let n = 1; n <= notches; n++) {
            const notchPos = n / (notches + 1);
            const dist = Math.abs(freq - notchPos);
            if (dist < notchWidth) {
                gain *= dist / notchWidth;
            }
        }

        const y = (1 - gain * 0.8) * height;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const freq = x / width;
        let gain = 1;

        for (let n = 1; n <= notches; n++) {
            const notchPos = n / (notches + 1);
            const dist = Math.abs(freq - notchPos);
            if (dist < notchWidth) {
                gain *= dist / notchWidth;
            }
        }

        const y = (1 - gain * 0.8) * height * 0.9 + 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Rate indicator
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`↔ ${rate.toFixed(1)}Hz sweep`, 5, height - 5);
}

// Sidechain pumping visualization
function drawSidechainViz(container, beats, bpm, color = '#ef4444') {
    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.className = 'sidechain-viz';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 50');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Draw pumping waveform
    let pathD = 'M 0 25';
    const beatWidth = 200 / beats;

    for (let b = 0; b < beats; b++) {
        const x = b * beatWidth;

        // Sharp dip at beat
        pathD += ` L ${x} 25`;
        pathD += ` L ${x + 2} 45`; // Duck down

        // Recovery curve (exponential)
        for (let t = 0; t <= 1; t += 0.1) {
            const px = x + 2 + t * (beatWidth - 4);
            const py = 45 - 20 * (1 - Math.exp(-t * 4));
            pathD += ` L ${px} ${py}`;
        }
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');

    // Fill
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fillPath.setAttribute('d', pathD + ' L 200 50 L 0 50 Z');
    fillPath.setAttribute('fill', color + '30');

    svg.appendChild(fillPath);
    svg.appendChild(path);

    // Beat markers
    for (let b = 0; b < beats; b++) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        marker.setAttribute('x1', b * beatWidth);
        marker.setAttribute('y1', '0');
        marker.setAttribute('x2', b * beatWidth);
        marker.setAttribute('y2', '50');
        marker.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        marker.setAttribute('stroke-dasharray', '2,2');
        svg.appendChild(marker);
    }

    wrapper.appendChild(svg);

    // Labels
    const labels = document.createElement('div');
    labels.className = 'sidechain-labels';
    labels.innerHTML = '<span>Kick hits → ducking</span>';
    wrapper.appendChild(labels);

    container.appendChild(wrapper);
    return container;
}

// ============ SYNTHESIS VISUALIZATIONS ============

// FM synthesis visualization
function drawFMViz(canvas, ratio, modIndex, color = '#8b5cf6') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.35;

    ctx.clearRect(0, 0, width, height);

    // Draw modulator (faint)
    ctx.strokeStyle = '#60a5fa';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 4 * Math.PI;
        const y = centerY - Math.sin(phase * ratio) * amplitude * 0.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw carrier with FM applied
    ctx.strokeStyle = color;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 4 * Math.PI;
        const modulator = Math.sin(phase * ratio) * modIndex;
        const y = centerY - Math.sin(phase + modulator) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`Mod (${ratio}:1)`, 5, 12);
    ctx.fillStyle = color;
    ctx.fillText('Carrier', 5, 24);
}

// Ring modulation visualization
function drawRingModViz(canvas, modFreq, color = '#f43f5e') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.35;

    ctx.clearRect(0, 0, width, height);

    // Carrier frequency (relative to mod)
    const carrierRatio = 440 / modFreq;

    // Draw result of ring mod (multiplication)
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 6 * Math.PI;
        const carrier = Math.sin(phase * carrierRatio);
        const modulator = Math.sin(phase);
        const y = centerY - (carrier * modulator) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Show envelope hint
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 6 * Math.PI;
        const y = centerY - Math.abs(Math.sin(phase)) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${modFreq}Hz × signal`, width / 2, height - 5);
}

// PWM visualization with animated pulse width
function drawPWMViz(canvas, pulseWidth, rate, color = '#10b981') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    ctx.clearRect(0, 0, width, height);

    // Draw multiple pulse widths to show modulation range
    const widths = [pulseWidth * 0.5, pulseWidth, Math.min(0.9, pulseWidth * 1.5)];
    const alphas = [0.2, 1, 0.2];

    widths.forEach((pw, idx) => {
        ctx.strokeStyle = color;
        ctx.globalAlpha = alphas[idx];
        ctx.lineWidth = idx === 1 ? 2 : 1;
        ctx.beginPath();

        const cycles = 3;
        for (let x = 0; x < width; x++) {
            const phase = (x / width) * cycles;
            const inPulse = (phase % 1) < pw;
            const y = centerY - (inPulse ? 1 : -1) * amplitude;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevPhase = ((x - 1) / width) * cycles;
                const prevInPulse = (prevPhase % 1) < pw;
                if (prevInPulse !== inPulse) {
                    // Vertical transition
                    ctx.lineTo(x, centerY - (prevInPulse ? 1 : -1) * amplitude);
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Width indicator
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`Width: ${Math.round(pulseWidth * 100)}% ↔ ${rate}Hz`, width / 2, height - 5);
}

// Unison/detune visualization - stacked waves
function drawUnisonViz(canvas, voices, detuneAmt, color = '#f59e0b') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.3;

    ctx.clearRect(0, 0, width, height);

    // Draw each voice with slight detune
    for (let v = 0; v < voices; v++) {
        const detune = (v - (voices - 1) / 2) * detuneAmt * 0.1;
        const alpha = 0.2 + 0.6 / voices;

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const phase = (x / width) * 4 * Math.PI * (1 + detune);
            const y = centerY - Math.sin(phase) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Draw combined result (thicker, brighter)
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        let sum = 0;
        for (let v = 0; v < voices; v++) {
            const detune = (v - (voices - 1) / 2) * detuneAmt * 0.1;
            const phase = (x / width) * 4 * Math.PI * (1 + detune);
            sum += Math.sin(phase);
        }
        const y = centerY - (sum / voices) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${voices} voices • ${Math.round(detuneAmt * 100)}% spread`, width / 2, height - 5);
}

// Bitcrush visualization - stepped/quantized wave
function drawBitcrushViz(canvas, bits, color = '#ec4899') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    ctx.clearRect(0, 0, width, height);

    // Quantization levels
    const levels = Math.pow(2, bits);
    const stepSize = 2 / levels;

    // Draw original sine (faint)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        const y = centerY - Math.sin(phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw quantization levels
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let l = 0; l < levels; l++) {
        const y = centerY - ((l / (levels - 1)) * 2 - 1) * amplitude;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw crushed wave
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sampleRate = bits <= 4 ? 8 : bits <= 6 ? 4 : 2; // Lower bits = more sample reduction
    let lastY = centerY;

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        let value = Math.sin(phase);

        // Quantize
        value = Math.round(value / stepSize) * stepSize;

        // Sample rate reduction (step effect)
        if (x % sampleRate === 0) {
            lastY = centerY - value * amplitude;
        }

        if (x === 0) ctx.moveTo(x, lastY);
        else ctx.lineTo(x, lastY);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${bits}-bit (${levels} levels)`, width / 2, height - 5);
}

// Drive/saturation visualization
function drawDriveViz(canvas, driveAmount, color = '#ef4444') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    ctx.clearRect(0, 0, width, height);

    // Draw clean sine (faint)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        const y = centerY - Math.sin(phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw saturated wave
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        let value = Math.sin(phase);

        // Apply soft clipping / saturation
        const gain = 1 + driveAmount * 4;
        value = value * gain;
        value = Math.tanh(value); // Soft clip

        const y = centerY - value * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Clipping threshold lines
    if (driveAmount > 0.3) {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, centerY - amplitude * 0.9);
        ctx.lineTo(width, centerY - amplitude * 0.9);
        ctx.moveTo(0, centerY + amplitude * 0.9);
        ctx.lineTo(width, centerY + amplitude * 0.9);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(driveAmount * 100)}% saturation`, width / 2, height - 5);
}

// Noise layer visualization
function drawNoiseViz(canvas, noiseAmount, color = '#94a3b8') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;
    const centerY = height / 2;
    const amplitude = height * 0.35;

    ctx.clearRect(0, 0, width, height);

    // Generate consistent noise (seeded by position)
    const noise = [];
    for (let x = 0; x < width; x++) {
        noise.push((Math.sin(x * 123.456) * 43758.5453) % 1 * 2 - 1);
    }

    // Draw clean signal
    ctx.strokeStyle = '#60a5fa';
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        const y = centerY - Math.sin(phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw signal + noise
    ctx.strokeStyle = color;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        const phase = (x / width) * 3 * Math.PI * 2;
        const signal = Math.sin(phase);
        const noiseVal = noise[x] * noiseAmount;
        const y = centerY - (signal * (1 - noiseAmount * 0.5) + noiseVal) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(noiseAmount * 100)}% noise`, width / 2, height - 5);
}
