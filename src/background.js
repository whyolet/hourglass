// Whyolet Hourglass: Background Script
// Copyright (C) 2019-2024 Denis Ryzhkov - https://whyolet.com/

'use strict';

importScripts("core.js");

chrome.runtime.onStartup.addListener(load);

async function load() {
  const stored = await chrome.storage.local.get(null);
  render(stored.minutes_left, stored.minutes_entered);

  if (stored.minutes_left) chrome.alarms.create(name, {periodInMinutes: 1});
  else chrome.alarms.clearAll();
}

function render(minutes_left, minutes_entered) {
  chrome.action.setBadgeText({text: String(minutes_left || "")});
  if (!minutes_left || !minutes_entered) return;

  // When all time is left: calm=1, color=blue
  // When last minute is left: calm=0, color=red
  const all = Number(minutes_entered - 1);
  const calm = all ? Number(minutes_left - 1) / all : 0;
  const min = 66;
  const max = 255 - min;

  chrome.action.setBadgeBackgroundColor({color: [
    min + Math.round(max - max * calm),  // Red
    min,  // Green
    min + Math.round(max * calm),  // Blue
    min + max,  // Opaque
  ]});
}

chrome.action.onClicked.addListener(async () => {
  const stored = await chrome.storage.local.get({minutes_entered: 3});
  await reopen_offscreen();

  const response = await chrome.runtime.sendMessage({
    target: "minutes",
    minutes: stored.minutes_entered,
  });
  const minutes = response?.minutes ?? 0;

  chrome.storage.local.set(
    minutes ? {
      minutes_entered: minutes,
      minutes_left: minutes
    } : {minutes_left: minutes},
    load
  );
});

chrome.alarms.onAlarm.addListener(async () => {
  const stored = await chrome.storage.local.get(Object.assign({
    minutes_left: 0,
    minutes_entered: 0,
  }, options));

  if (stored.minutes_left <= 0) return;

  await chrome.storage.local.set({minutes_left: --stored.minutes_left});
  render(stored.minutes_left, stored.minutes_entered);

  if (stored.tick_tock && (stored.minutes_left || !stored.cuckoo)) {
    play(audios.tick_tock, stored.volume);
  }

  if (stored.minutes_left) return;

  chrome.alarms.clearAll();
  if (stored.cuckoo) play(audios.cuckoo, stored.volume);

  chrome.notifications.create(name, {
    type: "basic",
    title: name,
    message: "Done!",
    iconUrl: "images/icon128.png",
  });
});
