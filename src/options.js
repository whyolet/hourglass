// Whyolet Hourglass 0.1.0 - Options
// Copyright (C) 2019 Denis Ryzhkov - https://whyolet.com/#hourglass

"use strict";

document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get(options, function(stored) {
        for (var option in options) {
            var input = document.getElementById(option), value = stored[option];
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

document.getElementById("save").addEventListener("click", function() {
    for (var option in options) {
        var input = document.getElementById(option);
        options[option] = (
            typeof options[option] === "boolean" ?
            input.checked : input.value
        );
    }

    chrome.storage.local.set(options, function() {
        var status = document.getElementById("status");
        status.textContent = "Options saved";

        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
});
