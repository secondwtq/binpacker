
"use strict";

module HowardUtility.BasicControls {

interface FlexViewProps extends React.HTMLProps<any> {
    row?: boolean;
    column?: boolean;
    reversed?: boolean;
    grow?: number;
    shrink?: number;
    center?: boolean;
    spaceAround?: boolean;
    spaceBetween?: boolean;
    flexEnd?: boolean;
    flexWrap?: boolean;
    flexWrapReverse?: boolean;
    alignItems?: string;
}

export class FlexView extends React.Component<FlexViewProps, any> {
    static defaultProps = {
        'alignItems': 'stretch'
    };
    
	render() {

		var style: any = { 'display': 'flex', 'alignItems': this.props['alignItems'] };

		if (this.props['row']) {
			if (this.props['reversed']) {
				style.flexDirection = style.WebkitFlexDirection = 'row-reverse';
			} else {
				style.flexDirection = style.WebkitFlexDirection = 'row'; }
		} else if (this.props['column']) {
			if (this.props['reversed']) {
				style.flexDirection = style.WebkitFlexDirection = 'column-reverse';
			} else {
				style.flexDirection = style.WebkitFlexDirection = 'column'; }
		}
		if (this.props['grow'] !== undefined) {
			style.flexGrow = style.WebkitFlexGrow = this.props['grow']; }
        if (this.props['shrink'] !== undefined) {
			style.flexShrink = style.WebkitFlexShrink = this.props['shrink']; }
		if (this.props['center']) {
			style.justifyContent = style.WebkitJustifyContent = 'center'; }
		else if (this.props['spaceAround']) {
			style.justifyContent = style.WebkitJustifyContent = 'space-around'; }
		else if (this.props['spaceBetween']) {
			style.justifyContent = style.WebkitJustifyContent = 'space-between'; }
        else if (this.props['flexEnd']) {
			style.justifyContent = style.WebkitJustifyContent = 'flex-end'; }

		if (this.props['flexWrap']) {
			style.flexWrap = style.WebkitFlexWrap = 'wrap'; }
		else if (this.props['flexWrapReverse']) {
			style.flexWrapReverse = style.WebkitFlexWrapReverse = 'wrap-reverse'; }

		_.extend(style, this.props.style);

		return (<div { ... this.props } style={style}>{this.props.children}</div>);
	}
}

}
