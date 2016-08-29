module QueryString {
    export function getParameterByName(name: string) {
        const url = window.location.href.toLowerCase();
        name = name.toLowerCase().replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        let val = "";
        if (results && results[2]) {
            val = decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        if (typeof (val) !== "string") val = "";
        return val;
    }
}