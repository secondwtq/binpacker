
"use strict";

import * as React from 'react';
    
interface CollapseProps extends React.Props<any> {
    open?: boolean;
}

interface CollapseState {
    height?: string;
    inAnimate?: boolean;
}

export default class Collapse extends React.Component<any, CollapseState> {
    constructor(props) {
        super(props);
        this.state = {
            height: '0px',
            inAnimate: false
        };
    }
    
    updateHeight() {
        var height;
        if (!this.props.open) {
            if (this.state.inAnimate) {
                height = `${(this.refs['inner'] as Element).clientHeight}px`;
                setTimeout(() => requestAnimationFrame(() => this.setState({ inAnimate: false })), 0);
            } else { height = '0px'; }
        } else {
            height = this.state.inAnimate ? `${(this.refs['inner'] as Element).clientHeight}px` : 'auto';
        }
        if (height !== this.state.height) {
            this.setState({ height }); }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.open != this.props.open) {
            if (this.refs['wrapper']) {
                this.setState({ inAnimate: true });
                var transitionEndHandler = (e) => {
                    this.setState({ inAnimate: false });
                    (this.refs['wrapper'] as Element).removeEventListener('transitionend', transitionEndHandler, false);
                    e.stopPropagation();
                }
                (this.refs['wrapper'] as Element).addEventListener('transitionend', transitionEndHandler, false);
            }
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.updateHeight(); }
    
    render() {
        console.log(`height ${this.state.height}`);
        const { open, children } = this.props;
        return (
            <div ref="wrapper" style={ { height: this.state.height } }
                    className={`rcoll-wrap${open ? ' rcoll-open' : ''}`}>
                <div ref="inner" { ... this.props }></div>
            </div>
        );
    }
}
