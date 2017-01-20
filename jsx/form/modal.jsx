var React = require("react");

var Modal=React.createClass({
    propTypes:{
        onHide:React.PropTypes.func,
        cantClose:React.PropTypes.bool,
        lg:React.PropTypes.bool,
        sm:React.PropTypes.bool,
        blg:React.PropTypes.bool
    },
	getInitialState:function() {
	    return {
	        show:false,
	        onHide:null
	    };
	},
	hide:function(){
        this.setState({show:false});
		setTimeout(function(){
			callAsFunc(this.state.onHide);
			callAsFunc(this.props.onHide);
		},160,this);
	},
	componentDidMount:function() {
		setTimeout(function(){
            this.setState({show:true});
		},1,this);
	},
	renderClose:function(){
		if(!this.props.cantClose){
			return <button type="button" className="close" onClick={this.hide}>
				          <span>&times;</span>
				        </button>
		}
	},
    renderFooter:function(btn){
        if(btn.length) {
           return <div className="modal-footer">
                {btn}
            </div>
        }
    },
	render:function(){
		var content=CTA(this.props.children,["btn"]);
		var modalCls=CS({
            "modal fade":true,
            "in":this.state.show
        });
		var modalDialogCls=CS({
            "modal-dialog":true,
            "modal-lg":this.props.lg,
            "modal-sm":this.props.sm,
            "modal-blg":this.props.blg
        });
		return <div className={modalCls} style={{overflow:"auto",display:"block",backgroundColor:"rgba(0,0,0,0.2)"}}>
			<div className={modalDialogCls}>
				<div className="modal-content">
					<div className="modal-header">
				        {this.renderClose()}
				        <h5 className="modal-title">{this.props.title}</h5>
				    </div>
				    <div className="modal-body">
				        {content.default}
				    </div>
                    {this.renderFooter(content.btn)}
				</div>
			</div>
		</div>
	}
});
module.exports=Modal;