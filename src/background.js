// Whyolet Hourglass: Background Script
// Copyright (C) 2019 Denis Ryzhkov - https://whyolet.com/#hourglass

'use strict';

var name = "Whyolet Hourglass";

chrome.runtime.onStartup.addListener(load);

function load() {
    chrome.storage.local.get(null, function(stored) {
        render(stored.minutes_left, stored.minutes_entered);
        if (stored.minutes_left) chrome.alarms.create(name, {periodInMinutes: 1});
        else chrome.alarms.clearAll();
    });
}

function render(minutes_left, minutes_entered) {
    chrome.browserAction.setBadgeText({text: String(minutes_left || "")});

    if (minutes_left && minutes_entered) {
        // When all time is left: calm=1, color=blue
        // When last minute is left: calm=0, color=red
        var all = Number(minutes_entered - 1);
        var calm = all ? Number(minutes_left - 1) / all : 0;
        var min = 66;
        var max = 255 - min;

        chrome.browserAction.setBadgeBackgroundColor({color: [
            min + Math.round(max - max * calm),  // Red
            min,  // Green
            min + Math.round(max * calm),  // Blue
            min + max,  // Opaque
        ]});
    }
}

chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.local.get({minutes_entered: 3}, function(stored) {
        var minutes = window.prompt("Minutes:", String(stored.minutes_entered));
        minutes = /^\d+$/.test(minutes) ? Number(minutes) : 0;
        minutes = Math.min(minutes, 9999);  // `setBadgeText` supports max 4 chars

        chrome.storage.local.set(
            minutes ? {
                minutes_entered: minutes,
                minutes_left: minutes
            } : {minutes_left: minutes},
            load
        );
    });
});

chrome.alarms.onAlarm.addListener(function() {
    chrome.storage.local.get(Object.assign({
        minutes_left: 0,
        minutes_entered: 0,
    }, options), function(stored) {
        if (stored.minutes_left <= 0) return;

        chrome.storage.local.set({minutes_left: --stored.minutes_left});
        render(stored.minutes_left, stored.minutes_entered);

        if (stored.tick_tock
            && (stored.minutes_left || !stored.cuckoo)
        ) play(audios.tick_tock, stored.volume);

        if (stored.minutes_left) return;

        chrome.alarms.clearAll();

        if (stored.cuckoo) play(audios.cuckoo, stored.volume);

        chrome.notifications.create(name, {
            type: "basic",
            title: name,
            message: "Done!",

            iconUrl: "images/icon128.png"
            // Based on Whyolet Icon - https://whyolet.com/
            // by Alina Chirkova-Huszcza - http://maiwelin.com/
        });
    });
});
