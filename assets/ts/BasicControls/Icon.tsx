
"use strict";

import * as React from 'react';
import * as _ from 'lodash';
    
interface IconProps extends React.Props<any> {
    className?: string;
    entry?: string;
    size?: number;
    style?: any;
}

export default class Icon extends React.Component<IconProps, any> {
    static defaultProps = {
       'size': 18
    }
    
    render () {
        var className = 'material-icons';
        if (this.props.className) {
            className += ' ' + this.props.className; }
        var style = _.extend({
            fontSize: this.props.size
        }, this.props.style);
        return (<i style={style} className={className} { ... this.props }>{this.props.entry}</i>);
    }
}
