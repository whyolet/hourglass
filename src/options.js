// Whyolet Hourglass 0.1.0 - Options
// Copyright (C) 2019 Denis Ryzhkov - https://whyolet.com/#hourglass

"use strict";

var options = {
    tick_tock: true,
    cuckoo: true
};

document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get(options, function(stored) {
        for (var option in options)
            document.getElementById(option).checked = stored[option];
    });
});

document.getElementById("save").addEventListener("click", function() {
    for (var option in options)
        options[option] = document.getElementById(option).checked;

    chrome.storage.local.set(options, function() {
        var status = document.getElementById("status");
        status.textContent = "Options saved";

        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
});
