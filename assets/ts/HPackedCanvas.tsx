
"use strict";

import * as React from 'react';

import { Rectangle } from './binpacker';
import Hector from './hector';
import { HPackerImageData } from './binpacker-uidata';

import Utility from './binpacker-util';

interface HPackedImageProps {
	data : HPackerImageData;
}

export class HPackedImage extends React.Component<HPackedImageProps, any> {
	render () { return (
		<div>
			{`${this.props.data.name}, ${this.props.data.packedrect.toString()}, ${this.props.data.flipped ? 'flipped' : 'normal'}`}
		</div>);
	}
}

interface HPackedCanvasProps extends React.HTMLProps<any> {
    canvasSize?: Hector;
    showBorder?: boolean;
    scale?: Hector;
}

// KEEP IN MIND, KEEP IN MIND!
//  this component focuses on DRAWING only
//   do not put code about packing (or anything else) inside!
export class HPackedCanvas extends React.Component<HPackedCanvasProps, any> {
	componentDidUpdate () {
		Utility.canvasStoreAndClearCall(this.refs['canvas'] as HTMLCanvasElement,
			(ctx) => {
				React.Children.forEach(this.props.children,
					(child) => {
						Utility.canvasContextStoreCall(ctx, (ctx) => {
							var c: HPackedImage = (child as any);
							var rect : Rectangle = c.props.data.packedrect;
							if (c.props.data.flipped) {
								var pi = c.props.data.image;
								Utility.canvasDrawImageRotated(ctx, pi.cache.element,
									pi.content_origin.x, pi.content_origin.y,
									pi.content_size.x, pi.content_size.y,
									rect.position.x + (pi.content_size.y - pi.content_size.x) / 2,
									rect.position.y + (pi.content_size.x - pi.content_size.y) / 2,
									pi.content_size.x, pi.content_size.y, Utility.mToRad(90));
							} else { c.props.data.image.renderOnContext(ctx, rect.position); }
                            if (this.props.showBorder) {
                                ctx.strokeRect(rect.position.x, rect.position.y,
                                    rect.size.x, rect.size.y);
                            }
						});
					});
			});
	}
    
    toDataURL(... any) {
        var canvas = this.refs['canvas'] as HTMLCanvasElement;
        return canvas.toDataURL.apply(canvas, arguments);
    }
	
	render () {
		return (
            <canvas { ... this.props } ref="canvas" width={this.props.canvasSize.x}
                height={this.props.canvasSize.y} />
		);
	}
}
