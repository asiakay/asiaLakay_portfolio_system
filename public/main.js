const stateData = {
  disorder: {
    title: 'Disorder: Closed System',
    description:
      'Decisions happen in silence. Teams hear only fragments, so actions fall out of sync and trust erodes.',
    signals: [
      'Rumors replace official updates within two days of a leadership meeting.',
      'Teams escalate duplicate issues because they cannot see existing tickets.',
      'Employees wait for approval chains that stretch multiple weeks.',
    ],
    feedback: [
      'Town hall questions submitted but never acknowledged.',
      'Policy revisions shared as PDFs without change logs.',
      'Managers interpret email threads differently, creating conflicting priorities.',
    ],
    timeline: [
      {
        title: 'Decision sealed',
        note: 'Leadership finalizes guidance privately.',
      },
      {
        title: 'Leaks ripple',
        note: 'Unofficial messages circulate and raise anxiety.',
      },
      {
        title: 'Response delay',
        note: 'Teams duplicate work while waiting for clarity.',
      },
      {
        title: 'Trust dips',
        note: 'Stakeholders disengage from the process.',
      },
    ],
    activeIndex: 1,
  },
  restored: {
    title: 'Restored Rhythm: Open System',
    description:
      'Feedback loops make progress visible. Data pulses outward, timing cues align, and teams co-create responses.',
    signals: [
      'Shared dashboards show real-time policy drafts and owners.',
      'Weekly pulse surveys flag confusion early and route it to accountable teams.',
      'Live status boards display turnaround targets and celebrate resolved items.',
    ],
    feedback: [
      'Open decision logs capture rationale and invite comments.',
      'Feedback triage huddles pair policy, operations, and communications leads.',
      'Community updates include “you said, we did” callouts tied to metrics.',
    ],
    timeline: [
      {
        title: 'Signal captured',
        note: 'A shared intake form routes the concern instantly.',
      },
      {
        title: 'Loop assigned',
        note: 'Cross-functional team reviews impact within 24 hours.',
      },
      {
        title: 'Action broadcast',
        note: 'Changes and owners are published to the dashboard.',
      },
      {
        title: 'Trust reinforced',
        note: 'Stakeholders see progress and provide the next beat of feedback.',
      },
    ],
    activeIndex: 2,
  },
};

const stateTitle = document.querySelector('#stateTitle');
const stateDescription = document.querySelector('#stateDescription');
const signalList = document.querySelector('#signalList');
const feedbackList = document.querySelector('#feedbackList');
const timeline = document.querySelector('#timeline');
const stateToggle = document.querySelector('#stateToggle');
const soundToggle = document.querySelector('#soundToggle');

let currentState = 'disorder';
let soundEnabled = false;
let audioCtx = null;
let beatCancel = null;

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const soundSupported = typeof AudioContextClass === 'function';

function renderList(element, items) {
  if (!element) {
    return;
  }

  element.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);
  });

  element.appendChild(fragment);
}

function renderTimeline(element, steps, activeIndex) {
  if (!element) {
    return;
  }

  element.innerHTML = '';
  const fragment = document.createDocumentFragment();

  steps.forEach((step, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'timeline__step';

    if (index === activeIndex) {
      wrapper.classList.add('timeline__step--active');
    }

    const title = document.createElement('span');
    title.className = 'timeline__step-title';
    title.textContent = step.title;

    const note = document.createElement('p');
    note.className = 'timeline__step-note';
    note.textContent = step.note;

    wrapper.append(title, note);
    fragment.appendChild(wrapper);
  });

  element.appendChild(fragment);
}

function updateState(nextState) {
  const data = stateData[nextState];
  if (!data) {
    return;
  }

  document.body.classList.remove('state-disorder', 'state-restored');
  document.body.classList.add(`state-${nextState}`);

  if (stateTitle) {
    stateTitle.textContent = data.title;
  }

  if (stateDescription) {
    stateDescription.textContent = data.description;
  }

  renderList(signalList, data.signals);
  renderList(feedbackList, data.feedback);
  renderTimeline(timeline, data.timeline, data.activeIndex);

  if (stateToggle) {
    stateToggle.textContent =
      nextState === 'disorder'
        ? 'Switch to Restored Rhythm'
        : 'Return to Disorder State';
  }

  if (soundEnabled) {
    scheduleSoundscape();
  }
}

function stopBeats() {
  if (typeof beatCancel === 'function') {
    beatCancel();
  }
  beatCancel = null;
}

function playTone(frequency, duration, gainValue) {
  if (!audioCtx) {
    return;
  }

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gain.gain.value = gainValue;
  gain.gain.setTargetAtTime(0.0001, audioCtx.currentTime + duration * 0.7, duration * 0.4);

  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function startDisorderBeats() {
  stopBeats();

  let timeoutId;
  const schedule = () => {
    if (!soundEnabled) {
      return;
    }

    const frequency = 260 + Math.random() * 160;
    const duration = 0.18 + Math.random() * 0.07;
    const gainValue = 0.08 + Math.random() * 0.04;
    playTone(frequency, duration, gainValue);

    const wait = 200 + Math.random() * 520;
    timeoutId = setTimeout(schedule, wait);
  };

  schedule();
  beatCancel = () => clearTimeout(timeoutId);
}

function startRestoredBeats() {
  stopBeats();

  let step = 0;
  const interval = 360;
  const intervalId = setInterval(() => {
    if (!soundEnabled) {
      return;
    }

    const isDownbeat = step % 4 === 0;
    const frequency = isDownbeat ? 520 : 440;
    const gainValue = isDownbeat ? 0.12 : 0.08;
    const duration = isDownbeat ? 0.22 : 0.16;
    playTone(frequency, duration, gainValue);

    step = (step + 1) % 8;
  }, interval);

  beatCancel = () => clearInterval(intervalId);
}

function scheduleSoundscape() {
  if (!soundEnabled || !audioCtx) {
    return;
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (currentState === 'disorder') {
    startDisorderBeats();
  } else {
    startRestoredBeats();
  }
}

async function toggleSoundscape() {
  if (soundEnabled) {
    soundEnabled = false;
    stopBeats();
    if (soundToggle) {
      soundToggle.textContent = 'Start Soundscape';
    }
    return;
  }

  if (!soundSupported) {
    return;
  }

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  soundEnabled = true;
  if (soundToggle) {
    soundToggle.textContent = 'Mute Soundscape';
  }
  scheduleSoundscape();
}

function initialize() {
  updateState(currentState);

  if (stateToggle) {
    stateToggle.addEventListener('click', () => {
      currentState = currentState === 'disorder' ? 'restored' : 'disorder';
      updateState(currentState);
    });
  }

  if (soundToggle) {
    if (!soundSupported) {
      soundToggle.textContent = 'Sound unavailable in this browser';
      soundToggle.setAttribute('disabled', 'true');
    } else {
      soundToggle.addEventListener('click', () => {
        toggleSoundscape();
      });
    }
  }
}

initialize();
