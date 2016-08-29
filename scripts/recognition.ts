declare var webkitSpeechRecognition: any;

class Recognition {
    // trigger when mic is ready to record
    onStart: Function;
    // trigger when an error happen
    onError: Function;
    // trigger when user click on mic to finish recognition
    onEnd: Function;
    // trigger when got speech recognite result
    onResult: Function;
    // final transcript
    finalTranscript = "";
    // interim transcript
    interimTranscript = "";
    // interim transcript
    sentTranscript = "";
    // auto restart when stop
    autoRestart: boolean;
    // recognition sevice
    recognition: any;
    // record button
    startImg = document.getElementById("start_img") as HTMLImageElement;
    startTimestamp: number;
    ignoreOnend: boolean;

    constructor() {
        var self = this;
        var recognizing = false;
        var counter = 0;
        var lastTranscript = "";

        // create recognition object
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        
        if (true) {
            setInterval(() => {
                if (!recognizing) return;
                // check if got any new text
                var transcript = this.interimTranscript || this.finalTranscript;
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
        this.recognition.onstart = () => {
            recognizing = true;
            // change start image src
            this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif";
            // raise event onStart
            if (typeof (self.onStart) === "function") { self.onStart(); }
        };

        // trigger when an error happen
        this.recognition.onerror = event => {
            // no speech even
            if (event.error === "no-speech") {
                this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
                this.ignoreOnend = true;
            }
            // can't capture audio
            if (event.error === "audio-capture") {
                this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
                this.ignoreOnend = true;
            }
            // user denied micro permission
            if (event.error === "not-allowed") {
                this.ignoreOnend = true;
            }
            // raise on error event
            if (typeof (self.onError) === "function") { self.onError(event); }
        };

        // trigger when user click on mic to finish recognition
        this.recognition.onend = () => {
            recognizing = false;

            // send transcript before stop
            this.sentTranscript = this.finalTranscript || this.interimTranscript;
            if (this.sentTranscript) {
                // clear transcript
                this.finalTranscript = this.interimTranscript = "";
                // send subtitle
                this.sendSubtitle(this.sentTranscript);
            }

            if (this.ignoreOnend) {
                // raise on end event
                if (typeof (self.onEnd) === "function") { self.onEnd(); }
                if (this.autoRestart) this.restart();
                return;
            }
            this.startImg.src = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
            if (!this.finalTranscript) {
                // raise on end event
                if (typeof (self.onEnd) === "function") { self.onEnd(); }
                if (this.autoRestart) this.restart();
                return;
            }
            if (this.autoRestart) this.restart();
        };

        // trigger when got speech recognite result
        this.recognition.onresult = event => {
            this.finalTranscript = "";
            this.interimTranscript = "";
            if (typeof (event.results) == "undefined") {
                this.recognition.onend = null;
                this.recognition.stop();

                // raise on result event
                if (typeof (self.onResult) === "function") { self.onResult(event); }
                return;
            }
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    this.finalTranscript += event.results[i][0].transcript;
                } else {
                    this.interimTranscript += event.results[i][0].transcript;
                }
            }
            this.finalTranscript = Utils.capitalize(this.finalTranscript);
            // this is end of a sentence
            if (this.finalTranscript) {
                this.sentTranscript = this.finalTranscript;
                // clear transcript
                this.finalTranscript = "";
                // send subtitle
                this.sendSubtitle(this.sentTranscript);
            }

            // raise on result event
            if (typeof (self.onResult) === "function") { self.onResult(event); }
        };

        // trigger when user click on start image
        this.startImg.onclick = () => {
            // if recognizing speech then stop it
            if (recognizing) {
                // prevent auto restart
                this.autoRestart = false;
                // stop service
                this.stop();
                return;
            }

            // start service
            this.start();
        }
    }

    sendSubtitle(subtitle: string) {
        Conference.sendSubtitle(subtitle);
    }
    
    stop() {
        // stop recognition
        this.recognition.stop();
    }

    restart() {
        // restart service
        this.autoRestart = false;
        this.start();
    }

    start() {
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
    }
}