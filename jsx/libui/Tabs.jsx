/***
 * React Component Tabs create by ZhangLiwei at 17:29
 */
import React from "react"

class Tabs extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {
        data: []
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        data: React.PropTypes.array,
        onSelect: React.PropTypes.func
    }

    /**
     * component state
     */
    state = {
        select: null
    }

    constructor(props) {
        super(props);
        var {data}=props;

        if (Array.isArray(data) && data.length) {
            this.state.select = data[0];
        }
    }

    handleSelectTab(v) {
        callAsFunc(this.props.onSelect, [v]);
        this.setState({select: v});
    }

    renderData() {
        return this.props.data.map(function (v) {
            var cls = CS({
                "nav-link": true,
                "active": this.state.select.text == v.text
            });

            return <li className="nav-item" onClick={this.handleSelectTab.bind(this, v)}>
                <a className={cls} href="#">{v.text}</a>
            </li>
        }, this);
    }


    render() {
        return <ul className="Tabs nav nav-tabs">
            {this.renderData()}
        </ul>
    }
}

export default Tabs;