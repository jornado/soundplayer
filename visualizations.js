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
