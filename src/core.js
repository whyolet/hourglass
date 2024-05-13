// Whyolet Hourglass: Core Library
// Copyright (C) 2019-2024 Denis Ryzhkov - https://whyolet.com/

"use strict";

const name = "Whyolet Hourglass";

const options = {
  tick_tock: true,
  cuckoo: true,
  volume: 50
};

const audios = {
  tick_tock: "audios/tick-tock.mp3",
  // Based on http://www.orangefreesounds.com/horror-creepy-clock-ticking-sound-effect/
  // https://creativecommons.org/licenses/by-nc/4.0/

  cuckoo: "audios/cuckoo-bird-sound.mp3"
  // http://www.orangefreesounds.com/cuckoo-bird-sound/
  // https://creativecommons.org/licenses/by-nc/4.0/
};

async function reopen_offscreen() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });
  if (contexts.length) await chrome.offscreen.closeDocument();

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: name,
  });
}

async function play(url, volume) {
  await reopen_offscreen();
  chrome.runtime.sendMessage({target: "play", url, volume});
}
