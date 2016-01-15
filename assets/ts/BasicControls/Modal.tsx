
"use strict";

module HowardUtility.BasicControls {

interface ModalPortalProps extends React.Props<any> {
    leaveDuration?: number;
}

class ModalPortal extends React.Component<ModalPortalProps, any> {
    target: Element;
    component: ModalDialog;
    
    constructor(props) {
        super(props);
    }
    
    componentWillMount() { }
    componentDidMount() {
        this.target = document.body.appendChild(document.createElement('div')) as Element;
        this.update();
    }
    componentDidUpdate() {
        this.update(); }
    
    update() {
        this.component = ReactDOM.render(this.props.children as React.ReactElement<any>, this.target) as ModalDialog;
    }
    
    unmountNode() {
        ReactDOM.unmountComponentAtNode(this.target);
        document.body.removeChild(this.target);
    }
    
    componentWillUnmount() {
        if (!this.props.leaveDuration) {
            this.unmountNode();
        } else {
            this.component.handleWillUnmount(this.props.leaveDuration);
            setTimeout(this.unmountNode.bind(this), this.props.leaveDuration);
        }
    }
    
    render() { return null; }
}

interface ModalDialogProps extends React.HTMLProps<any> {
    fixed?: boolean;
    classNameClose?: string;
    onClose?: (ModalDialog) => any;
}

interface ModalDialogState {
    closing: boolean;
}

export class ModalDialog extends React.Component<ModalDialogProps, ModalDialogState> {
    constructor(props) {
        super(props);
        this.state = {
            closing: false };
    }
    
    handleWillUnmount(duration) {
        this.setState({ closing: true }); }
        
    close() {
        if (this.props.onClose) {
            this.props.onClose(this); }
    }
        
    render() {
        var style = { 'position': this.props.fixed ? 'fixed' : 'absolute' };
        _.extend(style, this.props.style);
        var cx = this.props.className ? `${this.props.className} ` : '';
        if (this.state.closing) {
            cx += this.props.classNameClose; }
        return (
            <div ref="child" className={cx} style={style}>
                {this.props.children}
            </div>
        )
    }
}

export interface ModalContainerProps extends ModalPortalProps {
    show?: boolean;
    onClose?: (ModalDialog) => any;
}

export class ModalContainer extends React.Component<ModalContainerProps, any> {
    render() {
        return this.props.show ? (<ModalPortal { ... this.props }>{this.props.children}</ModalPortal>) : null;
    }
}

}
