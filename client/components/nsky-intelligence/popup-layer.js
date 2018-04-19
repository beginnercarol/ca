
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import autoBind from 'react-autobind';
import cn from 'classnames';

export default class PopupLayer extends Component {
    constructor(props) {
        super(props)
        autoBind(this)
        this.state = {
            styleLayerShow: "",
            showChild: props.visible
        }

    }
    componentDidMount() {
        this.setState({
            styleLayerShow: "layer-show"
        });


    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setState({
                styleLayerShow: "layer-show"
            });

            setTimeout(() => {
                this.setState({
                    showChild: true
                })
            }, 1500);

        } else {
            this.setState({
                styleLayerShow: ""
            });
            setTimeout(() => {
                this.setState({
                    showChild: false
                })
            }, 1500);

        }
    }


    closeLayer() {
        console.log('closeLayer');
        this.props.onCancel();
    }

    render() {
        const { className, onCancel } = this.props

        var wrapClassName = cn({
            [className]: className
        })

        return (
            <div className={wrapClassName + " " + this.state.styleLayerShow}>
                {this.state.showChild ? this.props.children : null}
            </div>
        )
    }
}

PopupLayer.PropTypes = {
    visible: PropTypes.bool,
    wrapClassName: PropTypes.string,
    onCancel: PropTypes.func
}

