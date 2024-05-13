// Whyolet Hourglass: Offscreen Script
// Copyright (C) 2019-2024 Denis Ryzhkov - https://whyolet.com/

"use strict";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const target = message?.target;

  if (target === "minutes") {
    let minutes = window.prompt("Minutes:", String(message.minutes));
    minutes = /^\d+$/.test(minutes) ? Number(minutes) : 0;
    minutes = Math.min(minutes, 9999);  // `setBadgeText` supports max 4 chars
    sendResponse({minutes});

  } else if (target === "play") {
    const audio = new Audio(message.url);
    audio.volume = message.volume / 100;
    audio.play();
  }
});
