
"use strict";

module HowardUtility.BasicControls {
    
interface ButtonProps extends React.HTMLProps<any> {
    className?: string;
    onToolbar?: boolean;
}

export class Button extends React.Component<ButtonProps, any> {
    render () {
        var className = 'rbtn';
        if (this.props.onToolbar) {
            className += ' rbtn-toolbar'; }
        if (this.props.className) {
            className += ' ' + this.props.className; }
        return (<button className={className} { ... this.props }>{this.props.children}</button>);
    }
}
    
}
