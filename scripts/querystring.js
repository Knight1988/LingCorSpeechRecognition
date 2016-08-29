var QueryString;
(function (QueryString) {
    function getParameterByName(name) {
        var url = window.location.href.toLowerCase();
        name = name.toLowerCase().replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        var val = "";
        if (results && results[2]) {
            val = decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        if (typeof (val) !== "string")
            val = "";
        return val;
    }
    QueryString.getParameterByName = getParameterByName;
})(QueryString || (QueryString = {}));
//# sourceMappingURL=querystring.js.map