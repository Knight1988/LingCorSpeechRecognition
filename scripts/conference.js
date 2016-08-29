var Conference;
(function (Conference) {
    // connect to xsocket
    var socket = new XSockets.WebSocket("ws://210.245.83.31:4503", ["conference"]);
    // allow auto reconnect
    socket.autoReconnect();
    // conference controller
    var conferenceController = socket.controller("conference");
    // log error
    socket.onerror = function (e) {
        console.log("error", e);
    };
    // log connected
    socket.onconnected = function () {
        console.log("connected");
    };
    // send the subtitle to server
    function sendSubtitle(subtitle) {
        // get meeting id
        var meetingId = parseInt(QueryString.getParameterByName("ID"));
        // send the subtitle
        conferenceController.invoke("sendsubtitle", { meetingID: meetingId, subtitle: subtitle });
        // debug
        console.log("sent", subtitle);
    }
    Conference.sendSubtitle = sendSubtitle;
    ;
})(Conference || (Conference = {}));
//# sourceMappingURL=conference.js.map