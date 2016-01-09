/// <reference path="../../typings/lodash/lodash.d.ts" />
"use strict";

module HowardUtility.BinPacker {

class HPackerImageData {
	constructor(public image : PackerImageStripped,
		public name : string) { }
	packedrect : Rectangle;
	flipped : boolean = false;
}

interface CollapseProps extends React.Props<any> {
    open?: boolean;
}

class Collapse extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { open, children } = this.props;
        var height;
        if (open) {
            height = `${this.refs['inner'].clientHeight}px`;
        } else {
            height = '0px';
        }
        return (
            <div ref="wrapper" style={ { height } }
                    className={`rcoll-wrap${open ? ' rcoll-open' : ''}`}>
                <div ref="inner" { ... this.props }>{children}</div>
            </div>
        );
    }
}

interface FlexViewProps extends React.HTMLProps<any> {
    row?: boolean;
    column?: boolean;
    reversed?: boolean;
    grow?: number;
    center?: boolean;
    spaceAround?: boolean;
    spaceBetween?: boolean;
    flexWrap?: boolean;
    flexWrapReverse?: boolean;
    alignItems?: string;
}

class FlexView extends React.Component<FlexViewProps, any> {
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
		if (this.props['grow']) {
			style.flexGrow = style.WebkitFlexGrow = this.props['grow']; }
		if (this.props['center']) {
			style.justifyContent = style.WebkitJustifyContent = 'center'; }
		else if (this.props['spaceAround']) {
			style.justifyContent = style.WebkitJustifyContent = 'space-around'; }
		else if (this.props['spaceBetween']) {
			style.justifyContent = style.WebkitJustifyContent = 'space-between'; }

		if (this.props['flexWrap']) {
			style.flexWrap = style.WebkitFlexWrap = 'wrap'; }
		else if (this.props['flexWrapReverse']) {
			style.flexWrapReverse = style.WebkitFlexWrapReverse = 'wrap-reverse'; }

		_.extend(style, this.props.style);

		return (<div { ... this.props } style={style}>{this.props.children}</div>);
	}
}

interface FlexElementProps extends React.Props<any> {
    grow?: number;
    style?: any;
}

class FlexElement extends React.Component<FlexElementProps, any> {
	render () {
		var style: any = { };
		if (this.props['grow']) {
			style.flexGrow = style.WebkitFlexGrow = this.props['grow']; }
		_.extend(style, this.props.style);
		return (<div { ... this.props } style={style}>{this.props.children}</div>);
	}
}

interface IconProps extends React.Props<any> {
    className?: string;
    entry?: string;
    size?: number;
    style?: any;
}

class Icon extends React.Component<IconProps, any> {
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

interface ButtonProps extends React.HTMLProps<any> {
    className?: string;
}

class Button extends React.Component<ButtonProps, any> {
    render () {
        var className = 'rbtn';
        if (this.props.className) {
            className += ' ' + this.props.className; }
        return (<button className={className} { ... this.props }>{this.props.children}</button>);
    }
}

interface EditableTextProps extends React.Props<any> {
    disabled?: boolean;
    isSpan?: boolean;
    onChange?: (Event) => any;
    value?: string;
}

class EditableText extends React.Component<EditableTextProps, any> {
    
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
        if (this.props.onChange) {
            e.target = { value: this.refs['ele'].innerHTML };
            this.props.onChange(e);
        }
    }
    
    render() {
        const { handleChange, props } = this;
        if (props.isSpan) {
            return (
                <span { ... props } ref="ele"
                        contentEditable={!props.disabled}
                        onInput={handleChange} onBlur={handleChange}>
                    {props.value}
                </span>
            );
        } else {
            return (
                <div { ... props } ref="ele"
                        contentEditable={!props.disabled}
                        onInput={handleChange} onBlur={handleChange}>
                    {props.value}
                </div>
            );
        }
    }
}

var HImagesList = ({ children }) => (<ul className="h-ul">{children}</ul>);

interface HImagesListItemProps extends React.Props<any> {
    data?: HPackerImageData;
    onNameChanged?: (string) => any;
}

class HImagesListItemState {
    detail_open: boolean = false;
}

class HImagesListItem extends React.Component<HImagesListItemProps, HImagesListItemState> {
    
    constructor(props) {
        super(props);
        
        this.state = new HImagesListItemState();
    }
    
    onNameChanged(e) {
        if (this.props.onNameChanged) {
            this.props.onNameChanged(e.target.value);
        }
    }
    
    render() {
        const { data } = this.props;
        const { name, image } = data;
        var style = {
            'backgroundImage': `url(${image.cache.element.src})`
        };
        return (
            <li className="h-li">
                <div>
                    <FlexView spaceBetween alignItems="center">
                        <span className="h-li-preview" style={style}></span>
                        <span>{name}</span>
                        <Button onClick={(() => this.setState({ detail_open: !this.state.detail_open })).bind(this)}>
                            <Icon entry="expand_more"></Icon>
                        </Button>
                    </FlexView>
                    <Collapse open={this.state.detail_open} className="h-li-detail-cont">
                        <div>Name: <EditableText value={name} onChange={this.onNameChanged.bind(this)}></EditableText></div>
                        <div>Original size: {image.size.x} x {image.size.y}</div>
                        <div>Cropped size: {image.content_size.x} x {image.content_size.y}</div>
                    </Collapse>
                </div>
            </li>
        );
    }
}

interface HPreviewProps extends React.Props<any> {
	image : PackerImageStripped;
}

class HPreview extends React.Component<HPreviewProps, any> {
	
	// if using componentWillUpdate, content painted on canvas would
	//	be reset when resizing it
	componentDidUpdate() {
		var img = this.props.image;
		if (img) {
			canvasStoreAndClearCall(this.refs['canvas'],
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

interface HPackedCanvasProps extends React.HTMLProps<any> {
    canvasSize?: Hector;
    showBorder?: boolean;
    scale?: Hector;
}

// KEEP IN MIND, KEEP IN MIND!
//  this component focuses on DRAWING only
//   do not put code about packing inside!
class HPackedCanvas extends React.Component<HPackedCanvasProps, any> {
    
	componentDidUpdate () {
		canvasStoreAndClearCall(this.refs['canvas'],
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
                            if (this.props.showBorder) {
                                ctx.strokeRect(rect.position.x, rect.position.y,
                                    rect.size.x, rect.size.y);
                            }
						});
					});
			});
	}
	
	render () {
		return (
			<div className="h-packed-canvas" { ... this.props }>
				<canvas ref="canvas" width={this.props.canvasSize.x} height={this.props.canvasSize.y}></canvas>
			</div>
		);
	}
}

interface HPackerAppState {
	images? : Array<HPackerImageData>;
	packer? : RectangleBinPackerI;
    size?: Hector;
    showBorder?: boolean;
}

class HPackerApp extends React.Component<any, HPackerAppState> {
	
    // React with ES6 calss has no Mixins ...
    // mixins: [ React.addons.LinkedStateMixin ]
    
	constructor(props : any) {
		super(props);
		this.state = {
			images: new Array<HPackerImageData>(),
			packer:  new RectangleBinPackerSkyline(new Hector(512, 512)),
            size: new Hector(512, 512),
            showBorder: true
		};
		
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}
    
    // this function does not care whether the data is
    //  in the current state currently
    packerInsert(data: HPackerImageData) {
        data.packedrect = this.state.packer.insertSingle(data.image.content_size);
        if (!data.packedrect) {
            return false;  }
        if (data.packedrect.size.x != data.image.content_size.x) {
            data.flipped = true; }
        return true;
    }
    
    // I'm out of choice ...
    //  for dynamic removal/scaling etc ...
    //  we must find a way to rearrange the packer
    //  which is not included in our current algorithm
    //  so we can only repack it every time ...
    packerRepackAll() {
        this.state.packer = new RectangleBinPackerSkyline(this.state.size);
        for (var image of this.state.images) {
            this.packerInsert(image); }
    }
	
	handleDragOver(e : React.DragEvent) {
		e.preventDefault(); }
		
	handleDrop(e : React.DragEvent) {
		e.preventDefault();
		var file = e.dataTransfer.files[0];
        // only continue if dropped in an image
		if (!file.type.match(/image.*/)) {
			return; }
		var name = file.name;
		var reader = new FileReader();
		reader.onload = (e) => {
			var image = new Image();
			image.onload = () => {
				cropImage(new CachedImageData(image), (cropped_img) => {
					var data = new HPackerImageData(cropped_img, name);
					if (this.packerInsert(data)) {
                        this.setState({
                            images : this.state.images.concat([ data ]) });
                    }
				});
			};
			image.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
    
	render () {
        
        var setSize = ((prop) =>
            (e) => {
                var that = this;
                this.setState({
                    size: (that.state.size[prop] = parseInt(e.target.value), that.state.size)
                });
                this.packerRepackAll();
            }
        );
        
		return (
            <FlexView style={{height: '100%'}} className="hi-workspace"
                    onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                <FlexView column grow={1} style={{overflow: 'hidden'}}>
                    <HPackedCanvas canvasSize={this.state.size}
                            showBorder={this.state.showBorder} style={{flexGrow: 1}}>
                        {this.state.images.map(function (img : HPackerImageData) {
                            return <HPackedImage data={img}></HPackedImage>; })}
                    </HPackedCanvas>
                    <FlexElement>
                        <HPreview
                            image={this.state.images.length ? this.state.images[this.state.images.length-1].image : undefined}>
                        </HPreview>
                        
                        <input type="checkbox" id="hi-showborder"
                            checked={this.state.showBorder}
                            onChange={((e) => this.setState({ showBorder: e.target.checked })).bind(this)}>
                        </input>
                        <label htmlFor="hi-showborder">Show Border</label>
                        
                        <input type="number" min="0" max="4096" step="256"
                            value={this.state.size.x.toString()}
                            onChange={setSize('x')}>
                        </input>
                        <input type="number" min="0" max="4096" step="256"
                            value={this.state.size.y.toString()}
                            onChange={setSize('y')}>
                        </input>
                    </FlexElement>
                </FlexView>
                <FlexView>
                    <HImagesList>
                        {this.state.images.map((img : HPackerImageData) =>
                            <HImagesListItem data={img}
                                onNameChanged={((name) => this.setState({ images: (img.name = name, this.state.images) })).bind(this)} />
                        )}
                    </HImagesList>
                </FlexView>
            </FlexView>
		);
	}
}

ReactDOM.render(<HPackerApp />,
    document.getElementById('rct-plchder'));

}
