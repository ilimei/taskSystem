/***
 * React Component Paper create by ZhangLiwei at 13:27
 */
import * as React from "react";

function Paper(props,context) {
    var cls=CS({},"Paper",props.className);
    return <div className={cls}>
        {props.children}
    </div>
}

module.exports = Paper;