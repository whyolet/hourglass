// Whyolet Hourglass: Core Library
// Copyright (C) 2019 Denis Ryzhkov - https://whyolet.com/#hourglass

"use strict";

var options = {
    tick_tock: true,
    cuckoo: true,
    volume: 50
};

var audios = {
    tick_tock: "audios/tick-tock.mp3",
    // Based on http://www.orangefreesounds.com/horror-creepy-clock-ticking-sound-effect/
    // https://creativecommons.org/licenses/by-nc/4.0/

    cuckoo: "audios/cuckoo-bird-sound.mp3"
    // http://www.orangefreesounds.com/cuckoo-bird-sound/
    // https://creativecommons.org/licenses/by-nc/4.0/
};

var audio;

function play(url, volume) {
    if (audio) audio.pause();
    audio = new Audio(url);
    audio.volume = volume / 100;
    audio.play();
}
