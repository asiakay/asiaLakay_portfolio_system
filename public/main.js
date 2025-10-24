async function loadProjects() {
  const container = document.querySelector('#projects');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const projects = await response.json();
    const fragment = document.createDocumentFragment();

    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = project.title;

      const summary = document.createElement('p');
      summary.textContent = project.summary;

      const stack = document.createElement('p');
      const stackLabel = document.createElement('strong');
      stackLabel.textContent = 'Stack: ';
      stack.appendChild(stackLabel);
      stack.append(document.createTextNode(project.stack.join(', ')));

      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Learn more';

      card.append(title, summary, stack, link);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  } catch (error) {
    console.error(error);
    container.textContent = 'Unable to load portfolio data right now.';
  }
}

async function setupTonePlayground() {
  const container = document.querySelector('#tone-app');
  if (!container) {
    return;
  }

  const waveformSelect = container.querySelector('[data-control="waveform"]');
  const frequencyInput = container.querySelector('[data-control="frequency"]');
  const volumeInput = container.querySelector('[data-control="volume"]');
  const frequencyLabel = container.querySelector('[data-frequency-label]');
  const volumeLabel = container.querySelector('[data-volume-label]');
  const startButton = container.querySelector('[data-action="start"]');
  const stopButton = container.querySelector('[data-action="stop"]');

  if (!waveformSelect || !frequencyInput || !volumeInput || !frequencyLabel || !volumeLabel || !startButton || !stopButton) {
    return;
  }

  let ToneModule;
  let oscillator = null;
  let gainNode = null;

  const ensureTone = async () => {
    if (!ToneModule) {
      ToneModule = await import('https://cdn.skypack.dev/tone@14.8.49');
    }
    return ToneModule;
  };

  const updateFrequencyLabel = () => {
    const value = Number(frequencyInput.value);
    frequencyLabel.textContent = `${value.toFixed(0)} Hz`;
    if (oscillator && oscillator.state === 'started') {
      oscillator.frequency.value = value;
    }
  };

  const updateVolumeLabel = () => {
    const value = Number(volumeInput.value);
    volumeLabel.textContent = `${value.toFixed(0)}%`;
    if (gainNode) {
      const normalized = value / 100;
      gainNode.gain.rampTo(normalized, 0.05);
    }
  };

  waveformSelect.addEventListener('change', () => {
    if (oscillator) {
      oscillator.type = waveformSelect.value;
    }
  });

  frequencyInput.addEventListener('input', updateFrequencyLabel);
  volumeInput.addEventListener('input', updateVolumeLabel);

  startButton.addEventListener('click', async () => {
    const Tone = await ensureTone();
    await Tone.start();

    const frequencyValue = Number(frequencyInput.value);
    const waveformValue = waveformSelect.value;
    const volumeValue = Number(volumeInput.value) / 100;

    if (!gainNode) {
      gainNode = new Tone.Gain(volumeValue).toDestination();
    } else {
      gainNode.gain.value = volumeValue;
    }

    if (!oscillator) {
      oscillator = new Tone.Oscillator(frequencyValue, waveformValue).connect(gainNode);
    } else {
      oscillator.frequency.value = frequencyValue;
      oscillator.type = waveformValue;
    }

    if (oscillator.state !== 'started') {
      oscillator.start();
    }

    startButton.disabled = true;
    stopButton.disabled = false;
  });

  stopButton.addEventListener('click', async () => {
    if (!oscillator) {
      return;
    }

    if (oscillator.state === 'started') {
      oscillator.stop();
    }

    startButton.disabled = false;
    stopButton.disabled = true;
  });

  updateFrequencyLabel();
  updateVolumeLabel();
}

loadProjects();
setupTonePlayground();
