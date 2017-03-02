/**
 * Created by ZhangLiwei on 2017/1/20.
 */
'use strict';

var diagnostics = process.env.MBUILD_DIAGNOSTICS;
const error=console.error.bind(console);
const log=console.log.bind(console);
const info=console.info.bind(console);

function inspect(obj, depth) {
    return require('util').inspect(obj, false, depth || 5, true);
}

exports = module.exports = function debug() {
    if (diagnostics) error.apply(console, arguments);
}

exports.inspect = function(obj, depth) {
    if (diagnostics) error(inspect(obj, depth));
}

exports.log=log;
exports.info=info;
exports.error=error;