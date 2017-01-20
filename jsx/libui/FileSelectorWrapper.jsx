/***
 * React Component FileSelectorWrapper create by ZhangLiwei at 9:18
 */
var FileSelectorWrapper = React.createClass({
    selFile:function(e){
        var {file}=this.refs;
        callAsFunc(this.props.onSelect,[file.files[0]]);
    },
    onClick:function(e){
        this.refs['file'].click();
    },
    render: function () {
        return <div className="FileSelectorWrapper" onClick={this.onClick}>
            {this.props.children}
            <input type="file" ref="file" onChange={this.selFile}/>
        </div>
    }
});

module.exports = FileSelectorWrapper;