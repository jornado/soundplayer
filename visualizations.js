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

function drawFilterCurve(canvas, filterType, cutoff, resonance, color = '#e94560') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = w / 2;
    const height = h / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height * i / 4);
        ctx.lineTo(width, height * i / 4);
        ctx.stroke();
    }

    // Draw filter response
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const cutoffNorm = cutoff / 20000; // Normalize to 0-1
    const cutoffX = cutoffNorm * width;
    const resBoost = resonance * 0.3;

    for (let x = 0; x < width; x++) {
        const freq = x / width;
        let gain;

        switch(filterType) {
            case 'lowpass':
                if (freq < cutoffNorm) {
                    gain = 1 + (freq > cutoffNorm * 0.7 ? resBoost * Math.sin((freq - cutoffNorm * 0.7) / (cutoffNorm * 0.3) * Math.PI / 2) : 0);
                } else {
                    gain = Math.max(0, 1 - (freq - cutoffNorm) * 4) * (1 + resBoost);
                }
                break;
            case 'highpass':
                if (freq > cutoffNorm) {
                    gain = 1 + (freq < cutoffNorm * 1.3 ? resBoost * Math.sin((cutoffNorm * 1.3 - freq) / (cutoffNorm * 0.3) * Math.PI / 2) : 0);
                } else {
                    gain = Math.max(0, 1 - (cutoffNorm - freq) * 4) * (1 + resBoost);
                }
                break;
            case 'bandpass':
                const bandwidth = 0.2;
                const dist = Math.abs(freq - cutoffNorm);
                gain = Math.max(0, 1 - dist / bandwidth) * (1 + resBoost * 0.5);
                break;
            case 'notch':
                const notchWidth = 0.1;
                const notchDist = Math.abs(freq - cutoffNorm);
                gain = notchDist < notchWidth ? notchDist / notchWidth : 1;
                break;
            default:
                gain = 1;
        }

        const y = height - gain * height * 0.8 - height * 0.1;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Draw cutoff line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cutoffX, 0);
    ctx.lineTo(cutoffX, height);
    ctx.stroke();
    ctx.setLineDash([]);
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
