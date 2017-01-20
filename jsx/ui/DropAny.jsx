var DropIcon=require("./DropIcon");
var React = require("react");
/***
 * React Component DropAny create by ZhangLiwei at 8:22
 */
var DropAny = React.extend(DropIcon,{
    renderIcon: function () {
        this.re=CTA(this.props.children,["body"]);
        if(this.re.body.length>1){
            return <div className="DropAny">
                {this.re.body}
            </div>
        }else{
            return this.re.body[0];
        }
    },
    renderChild:function(){
        return this.re.default;
    },
});

module.exports = DropAny;