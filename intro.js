(() => {
  'use strict';
  const screen = document.createElement('div');
  screen.id = 'cinematic-intro';
  screen.setAttribute('role', 'dialog');
  screen.setAttribute('aria-modal', 'true');
  screen.setAttribute('aria-label', 'Caywarden opening film');
  screen.innerHTML = `<img src="assets/production.jpg" alt="A film by… A Roelof Beukes Production">
    <video hidden playsinline preload="none" controls aria-label="Caywarden opening film with narration"><source src="assets/opening.mp4" type="video/mp4"></video>
    <p id="intro-message" role="status" hidden></p>
    <div class="intro-actions"><button id="intro-play" type="button">Watch the opening tale</button><button class="intro-skip" type="button">Skip to game</button></div>`;
  document.body.appendChild(screen);
  const video = screen.querySelector('video');
  const image = screen.querySelector('img');
  const play = screen.querySelector('#intro-play');
  const message = screen.querySelector('#intro-message');
  const gameElements = [...document.body.children].filter(el => el !== screen && !['SCRIPT','STYLE','LINK'].includes(el.tagName));
  const previousInert = gameElements.map(el => el.inert);
  gameElements.forEach(el => { el.inert = true; });
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(el => el.remove());
    video.load();
    gameElements.forEach((el,i) => { el.inert = previousInert[i]; });
    screen.remove();
    document.removeEventListener('keydown', handleKey, true);
    document.querySelector('[data-act="cont"], [data-act="start"]')?.focus();
  }
  function handleKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); finish(); return; }
    if (event.key === 'Tab') {
      const buttons = [...screen.querySelectorAll('button')].filter(el => !el.hidden);
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus(); }
    }
    // Keep the game's global shortcuts from reacting during the film.
    event.stopPropagation();
  }
  document.addEventListener('keydown', handleKey, true);
  play.addEventListener('click', async () => {
    image.hidden = true;
    video.hidden = false;
    play.hidden = true;
    message.hidden = true;
    screen.querySelector('.intro-skip').focus();
    try { await video.play(); }
    catch { play.textContent = 'Play opening film'; play.hidden = false; message.textContent = 'Press play to start the film, or skip to the game.'; message.hidden = false; }
  });
  screen.querySelector('.intro-skip').addEventListener('click', finish);
  video.addEventListener('ended', finish);
  video.addEventListener('error', () => { message.textContent = 'The opening film could not load. You can still skip to the game.'; message.hidden = false; });
  play.focus();
})();
