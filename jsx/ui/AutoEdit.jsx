/***
 * React Component AutoEdit create by ZhangLiwei at 8:07
 */
var React = require("react");
var Marked=require("marked");
var hljs = require('../marked/highlight');
Marked.setOptions({
    renderer: new Marked.Renderer({
        highlight: function(code, lang) {
            if (lang)
                return hljs.highlightAuto(code, [lang]).value;
            else
                return hljs.highlightAuto(code).value;
        }
    }),
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        if (lang)
            return hljs.highlightAuto(code, [lang]).value;
        else
            return hljs.highlightAuto(code).value;
    }
});

var AutoEdit = React.createClass({
    getInitialState:function(){
        return {
            value:this.props.value||"",
            html:{__html:Marked(this.props.value||"")},
            preview:this.props.preview||false
        }
    },
    clear:function(){
        this.refs["editor"].value="";
        this.setState({
            value:"",
            html:{__html:""},
            preview:false
        });
    },
    insertCode:function(){
        var editor=this.refs["editor"];
        var start=editor.selectionStart;
        var end=editor.selectionEnd;
        var oldValue=editor.value;
        var prevValue=oldValue.substring(0,start);
        var endValue=oldValue.substring(end);
        if(prevValue.length==0||prevValue.endsWith("\n")){
            editor.value=prevValue+"```\n\n```"+endValue;
            editor.setSelectionRange(start+4,start+4);
        }else{
            editor.value=prevValue+"\n```\n\n```"+endValue;
            editor.setSelectionRange(start+5,start+5);
        }
    },
    insertImg:function(code){
        var editor=this.refs["editor"];
        var start=editor.selectionStart;
        var end=editor.selectionEnd;
        var oldValue=editor.value;
        var prevValue=oldValue.substring(0,start);
        var endValue=oldValue.substring(end);
        editor.value=prevValue+code+endValue;
        editor.setSelectionRange(start+code.length,start+code.length);
    },
    stopPrevent:function(e){
        e.preventDefault();
        e.stopPropagation();
    },
    onKeyDown:function(e){
        var me=this;
        var clipboard = e.clipboardData;
        var type = clipboard.items[0].type;
        console.dir(type);
        if (type.match(/image/)) {
            var blob = clipboard.items[0].getAsFile();
            var formData=new FormData();
            formData.append("avatar",blob,"test.png");
            PostFormData("api/upload/avatar",formData)
                .then(function(data){
                    if(data.success){
                        me.insertImg("![title](/uploads/" + data.result + ")");
                        me.saveValue({
                            target:me.refs["editor"]
                        })
                    }else{
                        alert(data.result)
                    }
                    console.dir(data);
                }).catch(function(e){
                console.dir(e);
            });
        }
        e.stopPropagation();
    },
    saveValue:function(e){
        var editor=e.target;
        editor.style.height="100px";
        var scrollHeight=editor.scrollHeight;
        if(!this.props.noLimitHeight&&scrollHeight>400){
            scrollHeight=400;
        }
        this.minHeight=scrollHeight;
        editor.style.height=scrollHeight+"px";
        var value=e.target.value;
        this.state.markdown=value;
        this.state.html={__html:Marked(value)};
        callAsFunc(this.props.change,[value]);
        this.forceUpdate();
    },
    preview:function(){
        this.setState({preview:!this.state.preview});
    },
    shouldHide:function(e){
        if(this.state.preview){
            e.stopPropagation();
            e.preventDefault();
        }
    },
    componentDidUpdate:function(){
        if(this.state.preview){
            var {preview}=this.refs;
            var scrollHeight=preview.scrollHeight;
            if(this.minHeight&&scrollHeight<this.minHeight){
                scrollHeight=this.minHeight;
            }
            if(scrollHeight<100){
                scrollHeight=100;
            }
            preview.style.height=scrollHeight+"px";
        }
    },
    render: function () {
        var tStyle={},sStyle={};
        if(this.state.preview){
            tStyle.display="none";
        }else{
            sStyle.display="none";
        }
        var cls=CS({
            "icon-eye-open":!this.state.preview,
            "icon-eye-close":this.state.preview
        });
        return <div className="AutoEdit">
            <div className="prevContainer">
                <textarea placeholder={this.props.placeholder}
                          defaultValue={this.state.value}
                          onBlur={this.shouldHide}
                          onChange={this.saveValue}
                          onPaste={this.onKeyDown}
                          style={tStyle}
                          ref="editor"/>
                <div className="prev" dangerouslySetInnerHTML={this.state.html} style={sStyle} ref="preview"></div>
            </div>
            <div className="toolbar">
                <i className="icon-code" onMouseDown={this.stopPrevent} onClick={this.insertCode}/>
                <i className={cls} onMouseDown={this.stopPrevent} onClick={this.preview}/>
                {this.props.children}
            </div>
        </div>
    }
});

module.exports = AutoEdit;