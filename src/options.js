// Whyolet Hourglass: Options Script
// Copyright (C) 2019-2024 Denis Ryzhkov - https://whyolet.com/

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const stored = await chrome.storage.local.get(options);

  for (let option in options) {
    const input = document.getElementById(option);
    const value = stored[option];
    options[option] = value;

    if (typeof value === "boolean") input.checked = value;
    else input.value = value;
  }
});

document.getElementById("volume").addEventListener("change", (event) => {
  const volume = event.target.value;
  const cuckoo = document.getElementById("cuckoo").checked;
  play(cuckoo ? audios.cuckoo : audios.tick_tock, volume);
});

for (let option in options) {
  document.getElementById(option).addEventListener("change", save);
}

let statusTimeoutID;

async function save(event) {
  const input = event.target;
  const option = input.id;
  options[option] = typeof options[option] === "boolean" ? input.checked : input.value;
  await chrome.storage.local.set(options);

  const status = document.getElementById("status");
  status.textContent = "Saved";
  if (statusTimeoutID) clearTimeout(statusTimeoutID);
  statusTimeoutID = setTimeout(() => {
    status.textContent = "";
  }, 750);
}
