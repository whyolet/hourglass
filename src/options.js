// Whyolet Hourglass: Options Script
// Copyright (C) 2019 Denis Ryzhkov - https://whyolet.com/#hourglass

"use strict";

document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get(options, function(stored) {
        for (var option in options) {
            var input = document.getElementById(option), value = stored[option];
            options[option] = value;
            if (typeof value === "boolean") input.checked = value;
            else input.value = value;
        }
    });
});

document.getElementById("volume").addEventListener("change", function(event) {
    var volume = event.target.value,
        cuckoo = document.getElementById("cuckoo").checked;
    play(cuckoo ? audios.cuckoo : audios.tick_tock, volume);
});

for (var option in options) {
    document.getElementById(option).addEventListener("change", save);
}

var statusTimeoutID;

function save(event) {
    var input = event.target, option = input.id;
    options[option] = (
        typeof options[option] === "boolean" ?
        input.checked : input.value
    );

    chrome.storage.local.set(options, function() {
        var status = document.getElementById("status");
        status.textContent = "Saved";

        if (statusTimeoutID) clearTimeout(statusTimeoutID);
        statusTimeoutID = setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
}
