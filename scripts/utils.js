var Utils;
(function (Utils) {
    var firstChar = /\S/;
    function capitalize(s) {
        return s.replace(firstChar, function (m) { return m.toUpperCase(); });
    }
    Utils.capitalize = capitalize;
    var twoLine = /\n\n/g;
    var oneLine = /\n/g;
    function linebreak(s) {
        return s.replace(twoLine, "<p></p>").replace(oneLine, "<br>");
    }
    Utils.linebreak = linebreak;
})(Utils || (Utils = {}));
//# sourceMappingURL=utils.js.map