"use strict";

import * as React from 'react';

import Hector from './hector';
import { PackerImage, PackerImageStripped } from './binpacker-index';
    
interface HPreviewProps extends React.Props<any> {
	image : PackerImageStripped;
}

export default class HPreview extends React.Component<HPreviewProps, any> {
	
	// if using componentWillUpdate, content painted on canvas would
	//	be reset when resizing it
	componentDidUpdate() {
		var img = this.props.image;
		if (img) {
			canvasStoreAndClearCall(this.refs['canvas'] as any,
				(ctx) => {
					PackerImage.prototype.renderOnContext.call(img, ctx);
					ctx.strokeRect(img.content_origin.x, img.content_origin.y,
						img.content_size.x, img.content_size.y);
				});
		}
	}
	
	render () {
		var size : Hector;
		if (this.props.image) {
			size = this.props.image.size;
		} else { size = new Hector(128, 128); }
		return (<canvas ref="canvas" width={size.x} height={size.y}></canvas>);
	}
}
