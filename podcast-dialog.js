(() => {
  const dataNode = document.getElementById('elodin-podcast-data');
  const launcher = document.getElementById('elodin-podcast-launcher');
  const dialog = document.getElementById('elodin-podcast-dialog');
  if (!dataNode || !launcher || !dialog) return;

  let episodes = [];
  try {
    const parsed = JSON.parse(dataNode.textContent || '[]');
    episodes = Array.isArray(parsed)
      ? parsed.filter((episode) => episode && typeof episode.id === 'string' && typeof episode.title === 'string')
      : [];
  } catch (_) {
    episodes = [];
  }
  if (!episodes.length) {
    launcher.hidden = true;
    return;
  }

  const STORAGE_KEY = 'elodin-deep-lore-podcast-v1';
  const RECENT_LIMIT = 6;
  const title = dialog.querySelector('[data-podcast-title]');
  const meta = dialog.querySelector('[data-podcast-meta]');
  const frame = dialog.querySelector('[data-podcast-frame]');
  const spotifyLink = dialog.querySelector('[data-podcast-spotify]');
  const differentButton = dialog.querySelector('[data-podcast-different]');
  const closeButton = dialog.querySelector('[data-podcast-close]');

  let currentIndex = -1;
  let recent = [];

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Number.isInteger(saved.currentIndex) && saved.currentIndex >= 0 && saved.currentIndex < episodes.length) {
      currentIndex = saved.currentIndex;
    }
    if (Array.isArray(saved.recent)) {
      recent = saved.recent
        .filter((index) => Number.isInteger(index) && index >= 0 && index < episodes.length)
        .slice(0, RECENT_LIMIT);
    }
  } catch (_) {
    // Storage is optional. The player remains fully usable without it.
  }

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, recent: recent.slice(0, RECENT_LIMIT) }));
    } catch (_) {
      // Ignore storage failures so playback is not blocked.
    }
  };

  const chooseDifferent = () => {
    const excluded = new Set(recent);
    if (currentIndex >= 0) excluded.add(currentIndex);

    let candidates = episodes.map((_, index) => index).filter((index) => !excluded.has(index));
    if (!candidates.length) {
      candidates = episodes.map((_, index) => index).filter((index) => index !== currentIndex);
    }
    if (!candidates.length) candidates = [0];

    const previous = currentIndex;
    currentIndex = candidates[Math.floor(Math.random() * candidates.length)];
    if (previous >= 0 && previous !== currentIndex) {
      recent = [previous, ...recent.filter((index) => index !== previous)].slice(0, RECENT_LIMIT);
    }
    persist();
  };

  const renderEpisode = () => {
    if (currentIndex < 0 || currentIndex >= episodes.length) chooseDifferent();
    const episode = episodes[currentIndex];
    title.textContent = episode.title;
    meta.textContent = [episode.show, ...(Array.isArray(episode.tags) ? episode.tags : [])].filter(Boolean).join(' · ');
    frame.src = `https://open.spotify.com/embed/episode/${encodeURIComponent(episode.id)}?theme=0`;
    frame.title = `Spotify episode: ${episode.title}`;
    spotifyLink.href = `https://open.spotify.com/episode/${encodeURIComponent(episode.id)}`;
  };

  const finishClose = () => {
    frame.removeAttribute('src');
    launcher.setAttribute('aria-expanded', 'false');
  };

  const openPlayer = () => {
    renderEpisode();
    launcher.setAttribute('aria-expanded', 'true');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const closePlayer = () => {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    finishClose();
  };

  launcher.addEventListener('click', openPlayer);
  closeButton.addEventListener('click', closePlayer);
  differentButton.addEventListener('click', () => {
    chooseDifferent();
    renderEpisode();
  });

  dialog.addEventListener('close', finishClose);
  dialog.addEventListener('cancel', () => {
    setTimeout(finishClose, 0);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closePlayer();
  });

  document.addEventListener('play', (event) => {
    const media = event.target;
    if (dialog.open && (media instanceof HTMLAudioElement || media instanceof HTMLVideoElement)) closePlayer();
  }, true);
})();
