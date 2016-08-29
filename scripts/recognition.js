var Recognition = (function () {
    function Recognition() {
        var _this = this;
        // final transcript
        this.finalTranscript = "";
        // interim transcript
        this.interimTranscript = "";
        // interim transcript
        this.sentTranscript = "";
        // record button
        this.startImg = document.getElementById("start_img");
        var self = this;
        var recognizing = false;
        var counter = 0;
        var lastTranscript = "";
        // create recognition object
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        if (true) {
            setInterval(function () {
                if (!recognizing)
                    return;
                // check if got any new text
                var transcript = _this.interimTranscript || _this.finalTranscript;
                if (lastTranscript !== transcript) {
                    // got some new text
                    lastTranscript = transcript;
                    // reset counter
                    counter = 0;
                    return;
                }
                // increase counter
                counter++;
                // counter go over 5
                if (counter >= 5) {
                    // reset counter
                    counter = 0;
                    // restart service
                    self.autoRestart = true;
                    self.stop();
                }
            }, 1000);
        }
        // trigger when mic is ready to record
        this.recognition.onstart = function () {
            recognizing = true;
            // change start image src
            _this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif";
            // raise event onStart
            if (typeof (self.onStart) === "function") {
                self.onStart();
            }
        };
        // trigger when an error happen
        this.recognition.onerror = function (event) {
            // no speech even
            if (event.error === "no-speech") {
                _this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
                _this.ignoreOnend = true;
            }
            // can't capture audio
            if (event.error === "audio-capture") {
                _this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
                _this.ignoreOnend = true;
            }
            // user denied micro permission
            if (event.error === "not-allowed") {
                _this.ignoreOnend = true;
            }
            // raise on error event
            if (typeof (self.onError) === "function") {
                self.onError(event);
            }
        };
        // trigger when user click on mic to finish recognition
        this.recognition.onend = function () {
            recognizing = false;
            // send transcript before stop
            _this.sentTranscript = _this.finalTranscript || _this.interimTranscript;
            if (_this.sentTranscript) {
                // clear transcript
                _this.finalTranscript = _this.interimTranscript = "";
                // send subtitle
                _this.sendSubtitle(_this.sentTranscript);
            }
            if (_this.ignoreOnend) {
                // raise on end event
                if (typeof (self.onEnd) === "function") {
                    self.onEnd();
                }
                if (_this.autoRestart)
                    _this.restart();
                return;
            }
            _this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
            if (!_this.finalTranscript) {
                // raise on end event
                if (typeof (self.onEnd) === "function") {
                    self.onEnd();
                }
                if (_this.autoRestart)
                    _this.restart();
                return;
            }
            if (_this.autoRestart)
                _this.restart();
        };
        // trigger when got speech recognite result
        this.recognition.onresult = function (event) {
            _this.finalTranscript = "";
            _this.interimTranscript = "";
            if (typeof (event.results) == "undefined") {
                _this.recognition.onend = null;
                _this.recognition.stop();
                // raise on result event
                if (typeof (self.onResult) === "function") {
                    self.onResult(event);
                }
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    _this.finalTranscript += event.results[i][0].transcript;
                }
                else {
                    _this.interimTranscript += event.results[i][0].transcript;
                }
            }
            _this.finalTranscript = Utils.capitalize(_this.finalTranscript);
            // this is end of a sentence
            if (_this.finalTranscript) {
                _this.sentTranscript = _this.finalTranscript;
                // clear transcript
                _this.finalTranscript = "";
                // send subtitle
                _this.sendSubtitle(_this.sentTranscript);
            }
            // raise on result event
            if (typeof (self.onResult) === "function") {
                self.onResult(event);
            }
        };
        // trigger when user click on start image
        this.startImg.onclick = function () {
            // if recognizing speech then stop it
            if (recognizing) {
                // prevent auto restart
                _this.autoRestart = false;
                // stop service
                _this.stop();
                return;
            }
            // start service
            _this.start();
        };
    }
    Recognition.prototype.sendSubtitle = function (subtitle) {
        Conference.sendSubtitle(subtitle);
    };
    Recognition.prototype.stop = function () {
        // stop recognition
        this.recognition.stop();
    };
    Recognition.prototype.restart = function () {
        // restart service
        this.autoRestart = false;
        this.start();
    };
    Recognition.prototype.start = function () {
        // start recognition
        // clear final transcript
        this.finalTranscript = "";
        // set language to english
        this.recognition.lang = "en-US";
        // start recognition
        this.recognition.start();
        this.ignoreOnend = false;
        this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif";
        this.startTimestamp = event.timeStamp;
    };
    return Recognition;
}());
//# sourceMappingURL=recognition.js.map