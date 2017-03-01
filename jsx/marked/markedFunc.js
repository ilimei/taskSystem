/**
 * Created by ZhangLiwei on 2017/2/25.
 */
var Marked = require("marked");
var hljs = require('./highlight');
Marked.setOptions({
    renderer: new Marked.Renderer({
        highlight: function (code, lang) {
            if (lang)
                return hljs.highlightAuto(code, [lang]).value;
            else
                return hljs.highlightAuto(code).value;
        }
    }),
    gfm: true,
    breaks: true,
    highlight: function (code, lang) {
        if (lang)
            return hljs.highlightAuto(code, [lang]).value;
        else
            return hljs.highlightAuto(code).value;
    }
});
module.exports = Marked;