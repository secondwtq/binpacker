/// <reference path="../../typings/react/react.d.ts" />

// "use strict";

module HowardUtility.BinPacker {

import React = __React;

class HPackerImageData {
	constructor(public image : PackerImageStripped,
		public name : string) { }
	packedrect : Rectangle;
	flipped : boolean = false;
}

class HImagesList extends React.Component<any, any> {
	render () {
		return (<ul>{this.props.children}</ul>);
	}
}

class HImagesListItem extends React.Component<any, any> {
	render () {
		return (
			<li>
				{this.props.children}
			</li>	
		);
	}
}

class HPreviewProps {
	image : PackerImageStripped;
}

class HPreview extends React.Component<HPreviewProps, any> {
	
	// if using componentWillUpdate, content painted on canvas would
	//	be reset when resizing it
	componentDidUpdate() {
		var img = this.props.image;
		if (img) {
			canvasStoreAndClearCall(React.findDOMNode(this.refs['canvas']),
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
		return <canvas ref="canvas" width={size.x} height={size.y}></canvas>;
	}
}

interface HPackedImageProps {
	data : HPackerImageData;
}

class HPackedImage extends React.Component<HPackedImageProps, any> {
	render () { return (
		<div>
			{`${this.props.data.name}, ${this.props.data.packedrect.toString()}, ${this.props.data.flipped ? 'flipped' : 'normal'}`}
		</div>);
	}
}

class HPackedCanvas extends React.Component<any, any> {
	
	componentDidUpdate () {
		canvasStoreAndClearCall(React.findDOMNode(this.refs['canvas']),
			(ctx) => {
				React.Children.forEach(this.props.children,
					(child) => {
						canvasContextStoreCall(ctx, (ctx) => {
							var c = (child as HPackedImage);
							var rect : Rectangle = c.props.data.packedrect;
							if (c.props.data.flipped) {
								var pi = c.props.data.image;
								canvasDrawImageRotated(ctx, pi.cache.element,
									pi.content_origin.x, pi.content_origin.y,
									pi.content_size.x, pi.content_size.y,
									rect.position.x + (pi.content_size.y - pi.content_size.x) / 2,
									rect.position.y + (pi.content_size.x - pi.content_size.y) / 2,
									pi.content_size.x, pi.content_size.y, mToRad(90));
							} else { c.props.data.image.renderOnContext(ctx, rect.position); }
							ctx.strokeRect(rect.position.x, rect.position.y,
								rect.size.x, rect.size.y);
						});
					});
			});
	}
	
	render () {
		return (
			<div>
				<canvas ref="canvas" width="1024" height="1024"></canvas>
			</div>
		);
	}
}

interface HPackerAppState {
	images? : Array<HPackerImageData>;
	packer? : RectangleBinPackerI;
}

class HPackerApp extends React.Component<any, HPackerAppState> {
	
	constructor(props : any) {
		super(props);
		this.state = {
			images: new Array<HPackerImageData>(),
			packer:  new RectangleBinPackerSkyline(new Hector(1024, 1024))
		};
		
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}
	
	handleDragOver(e : React.DragEvent) {
		e.preventDefault(); }
		
	handleDrop(e : React.DragEvent) {
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		if (!file.type.match(/image.*/)) {
			return; }
		var name = file.name;
		var reader = new FileReader();
		reader.onload = (e) => {
			var image = new Image();
			image.onload = () => {
				cropImage(new CachedImageData(image), (cropped_img) => {
					var data = new HPackerImageData(cropped_img, name);
					data.packedrect = this.state.packer.insertSingle(cropped_img.content_size);
					console.log(data.packedrect.size.x, cropped_img.content_size.x);
					if (data.packedrect.size.x != cropped_img.content_size.x) {
						data.flipped = true; }
					this.setState({
						images : this.state.images.concat([ data ]) });
				});
			};
			image.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	
	render () {
		return (
			<div ref="mainDiv" onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
				<HPackedCanvas>
					{this.state.images.map(function (img : HPackerImageData) {
						return <HPackedImage data={img}></HPackedImage>; })}
				</HPackedCanvas>
				<HImagesList>
					{this.state.images.map(function (img : HPackerImageData) {
						return <HImagesListItem>{img.name}</HImagesListItem>;
					})}
				</HImagesList>
				<HPreview
					image={this.state.images.length ? this.state.images[this.state.images.length-1].image : undefined}>
				</HPreview>
			</div>
		);
	}
}

React.render(<HPackerApp />, document.getElementById('rct-plchder'));

}
