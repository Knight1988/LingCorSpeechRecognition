module Conference {
    declare var XSockets: any;

    // connect to xsocket
    var socket = new XSockets.WebSocket("ws://210.245.83.31:4503", ["conference"]);
    // allow auto reconnect
    socket.autoReconnect();
    // conference controller
    var conferenceController = socket.controller("conference");

    // log error
    socket.onerror = e => {
        console.log("error", e);
    };

    // log connected
    socket.onconnected = () => {
        console.log("connected");
    };

    // send the subtitle to server
    export function sendSubtitle(subtitle: string) {
        // get meeting id
        var meetingId = parseInt(QueryString.getParameterByName("ID"));
        // send the subtitle
        conferenceController.invoke("sendsubtitle", { meetingID: meetingId, subtitle: subtitle });
        // debug
        console.log("subtitle sent", { meetingID: meetingId, subtitle: subtitle });
    };
}