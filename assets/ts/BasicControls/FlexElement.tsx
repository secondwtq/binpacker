
"use strict";

module HowardUtility.BasicControls {
    
interface FlexElementProps extends React.HTMLProps<any> {
    grow?: number;
    style?: any;
}

export class FlexElement extends React.Component<FlexElementProps, any> {
	render () {
		var style: any = { };
		if (this.props['grow']) {
			style.flexGrow = style.WebkitFlexGrow = this.props['grow']; }
		_.extend(style, this.props.style);
		return (<div { ... this.props } style={style}>{this.props.children}</div>);
	}
}
    
}
