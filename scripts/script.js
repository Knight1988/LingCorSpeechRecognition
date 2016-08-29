"use strict";
var ignore_onend;
var start_img = document.getElementById("start_img");
var start_button = document.getElementById("start_button");
var final_span = document.getElementById("final_span");
var interim_span = document.getElementById("interim_span");
var start_timestamp;
var final_transcript = "";
var recognition = new Recognition();

recognition.onStart = function () {
    // clear the text box
    final_span.innerHTML = "";
    interim_span.innerHTML = "";
    showInfo("info_speak_now");
};

recognition.onError = function (event) {
    if (event.error === "no-speech") {
        showInfo("info_no_speech");
        ignore_onend = true;
    }
    if (event.error === "audio-capture") {
        showInfo("info_no_microphone");
        ignore_onend = true;
    }
    if (event.error === "not-allowed") {
        if (event.timeStamp - start_timestamp < 100) {
            showInfo("info_blocked");
        } else {
            showInfo("info_denied");
        }
        ignore_onend = true;
    }
};

recognition.onEnd = function () {
    if (ignore_onend) {
        return;
    }
    if (!final_transcript) {
        showInfo("info_start");
        return;
    }
    showInfo("");
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById("final_span"));
        window.getSelection().addRange(range);
    }
};

recognition.onResult = function (event) {
    if (typeof (event.results) == 'undefined') {
        upgrade();
        return;
    }
    final_span.innerHTML = recognition.sentTranscript;
    interim_span.innerHTML = recognition.interimTranscript;
};

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id === s ? "inline" : "none";
            }
        }
        info.style.visibility = "visible";
    } else {
        info.style.visibility = "hidden";
    }
}

function upgrade() {
    start_button.style.visibility = "hidden";
    showInfo("info_upgrade");
}