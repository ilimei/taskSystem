/**
 * Created by ZhangLiwei on 2017/1/20.
 */
'use strict';

var diagnostics = process.env.MBUILD_DIAGNOSTICS;

function inspect(obj, depth) {
    return require('util').inspect(obj, false, depth || 5, true);
}

exports = module.exports = function debug() {
    if (diagnostics) console.error.apply(console, arguments);
}

exports.inspect = function(obj, depth) {
    if (diagnostics) console.error(inspect(obj, depth));
}

exports.log=function log(){
    console.log.apply(console, arguments);
}