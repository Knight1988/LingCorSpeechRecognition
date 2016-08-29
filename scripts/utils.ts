module Utils {
    var firstChar = /\S/;
    export function capitalize(s: string) {
        return s.replace(firstChar, m => m.toUpperCase());
    }

    var twoLine = /\n\n/g;
    var oneLine = /\n/g;
    export function linebreak(s: string) {
        return s.replace(twoLine, "<p></p>").replace(oneLine, "<br>");
    }
}