/// <reference path="../../typings/lodash/lodash.d.ts" />
"use strict";

module HowardUtility.BinPacker {

interface CollapseProps extends React.Props<any> {
    open?: boolean;
}

interface CollapseState {
    height?: string;
    inAnimate?: boolean;
}

class Collapse extends React.Component<any, CollapseState> {
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

interface FlexElementProps extends React.HTMLProps<any> {
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
    onToolbar?: boolean;
}

class Button extends React.Component<ButtonProps, any> {
    render () {
        var className = 'rbtn';
        if (this.props.onToolbar) {
            className += ' rbtn-toolbar'; }
        if (this.props.className) {
            className += ' ' + this.props.className; }
        return (<button className={className} { ... this.props }>{this.props.children}</button>);
    }
}

interface EditableTextProps extends React.HTMLProps<any> {
    disabled?: boolean;
    onChange?: (Object) => any;
    value?: string;
}

interface EditableTextState {
    editing?: boolean;
    tempValue?: string;
}

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
    constructor(props) {
        super(props);
        
        this.state = {
            editing: false,
            tempValue: props.value,
        };
    }
    
    componentWillUpdate(nextProps, nextState: EditableTextState) {
        if (this.state.editing && !nextState.editing) {
            var nextValue = this.state.tempValue;
            if (nextValue !== this.props.value) {
                if (this.props.onChange) {
                    var e = { target: { value: this.state.tempValue } };
                    this.props.onChange(e);
                }
            }
        } else if (!this.state.editing && nextState.editing) {
            this.setState({ tempValue: this.props.value });
        }
    }
    
    componentDidUpdate(prevProps: EditableTextProps, prevState) {
        if (this.state.editing) {
            (this.refs['element'] as HTMLInputElement).focus();
        }
    }
    
    handleClick(e) {
        if (!this.props.disabled) {
            this.setState({ editing: true });
        }
    }
    
    handleEditBlur(e) {
        this.setState({ editing: false });
    }
    
    handleEditChange(e) {
        this.setState({ tempValue: e.target.value });
    }
    
    render() {
        const { handleClick, handleEditBlur, handleEditChange, props } = this;
        if (this.state.editing) {
            // TODO: handle keyboard confirm
            return (<input { ... this.props } onBlur={handleEditBlur.bind(this)}
                        onChange={handleEditChange.bind(this)}
                        ref="element" value={this.state.tempValue} />);
        } else {
            return (<span { ... this.props } onClick={handleClick.bind(this)}>{props.value}</span>)
        }
    }
}

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

class ModalDialog extends React.Component<ModalDialogProps, ModalDialogState> {
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

interface ModalContainerProps extends ModalPortalProps {
    show?: boolean;
    onClose?: (ModalDialog) => any;
}

class ModalContainer extends React.Component<ModalContainerProps, any> {
    render() {
        return this.props.show ? (<ModalPortal { ... this.props }>{this.props.children}</ModalPortal>) : null;
    }
}

class HPackerFolder {
    constructor(public name: string) { }
    images: HPackerImageData[] = [ ];
    get length () { return this.images.length; }
}

class HPackerImageData {
	constructor(public image : PackerImageStripped,
		public name : string) { }
	packedrect : Rectangle;
	flipped : boolean = false;
}

type HImageListItem = HImagesListFolderItem | HImagesListImageItem;

interface HImagesListProps extends React.Props<any> {
    data?: HPackerFolder[];
    onChangeName?: Function;
    callbackAddFilesTo?: Function;
}

interface HImagesListState {
    selectedItem: HImageListItem;
}

class HImagesList extends React.Component<HImagesListProps, HImagesListState> {
    
    constructor (props) {
        super(props);
        this.state = { selectedItem: null };
    }
    
    handleSelect (target) {
        this.setState({ selectedItem: target });
    }
    
    getSelectedFolder () {
        const { data } = this.props;
        if (this.state.selectedItem) {
            return data[data.length - 1];
        } else {
            if (data.length) {
                return data[data.length - 1];
            } else { return null; }
        }
    }
    
    onChangeName (e, target) {
        if (this.props.onChangeName) {
            this.props.onChangeName.call(this, e, target);
        }
    }
    
    render () {
        return (
            <ul className="h-ul">
                {this.props.data.map((folder) =>
                    <HImagesListFolderItem key={folder.name} data={folder}
                        selectedItem={this.state.selectedItem}
                        onSelected={this.handleSelect.bind(this)}
                        onChangeName={this.onChangeName.bind(this)}
                        callbackAddFilesTo={this.props.callbackAddFilesTo} />
                )}
            </ul>
        );
    }
}

interface HImagesListFolderItemProps extends React.Props<any> {
    data?: HPackerFolder;
    selectedItem?: HImageListItem;
    onSelected?: (Object) => any;
    onChangeName?: Function;
    callbackAddFilesTo?: Function;
}

interface HImagesListImageItemProps extends React.Props<any> {
    data?: HPackerImageData;
    onNameChanged?: (string) => any;
    selectedItem?: HImageListItem;
    onSelected?: (Object) => any;
}

interface HImagesListItemState {
    detail_open?: boolean;
    modalImport?: boolean;
}

class HImagesListFolderItem extends React.Component<HImagesListFolderItemProps, HImagesListItemState> {
    constructor(props) {
        super(props);
        this.state = {
            detail_open: false,
            modalImport: false
        };
    }
    
    selected() { return this.props.selectedItem === this; }
    select() { if (this.props.onSelected) { this.props.onSelected.call(this, this); } }
    
    onChangeName(e, target) {
        if (this.props.onChangeName) {
            this.props.onChangeName.call(this, e, target);
        }
    }
    
    onToolbarRemove() {
        
    }
    
    onModalAddFile(e) {
        this.props.callbackAddFilesTo(e.files, this.props.data);
    }
    
    render() {
        const { data } = this.props;
        const { name, images } = data;
        return (
            <li className={`h-li${ this.selected() ? ' h-li-focus' : '' }`}>
                <HModalImportImages show={this.state.modalImport}
                    onConfirm={this.onModalAddFile.bind(this)}
                    onClose={() => this.setState({ modalImport: false })} />
                    
                <FlexView className="h-li-titlediv" spaceBetween alignItems="center" onClick={this.select.bind(this)}>
                    <Icon size={36} entry={ this.state.detail_open ? 'folder_open' : 'folder' } />
                    <EditableText className="h-li-name" value={name}
                        onChange={(e) => this.onChangeName(e, this.props.data)} />
                    <Button onClick={(() => this.setState({ detail_open: !this.state.detail_open })).bind(this)}>
                        <Icon entry="expand_more"></Icon>
                    </Button>
                </FlexView>
                <Collapse open={this.state.detail_open} className="h-li-subfolder-cont">
                    <hr className="rnomargin" />
                    <FlexView flexEnd>
                        <Button onToolbar onClick={() => this.setState({ modalImport: true })}>
                            <Icon entry="add" />
                        </Button>
                        <Button onToolbar><Icon entry="clear" /></Button>
                    </FlexView>
                    <hr className="rnomargin" />
                    <ul className="h-ul">
                        {images.map((image) => (
                            <HImagesListImageItem key={image.name} data={image}
                                selectedItem={this.props.selectedItem}
                                onSelected={this.props.onSelected} />
                                )
                            )
                        }
                    </ul>
                </Collapse>
            </li>
        );
    }
}

class HImagesListImageItem extends React.Component<HImagesListImageItemProps, HImagesListItemState> {
    constructor(props) {
        super(props);
        this.state = {
            detail_open: false
        }
    }
    
    onNameChanged(e) {
        if (this.props.onNameChanged) {
            this.props.onNameChanged(e.target.value); }
    }
    
    selected() { return this.props.selectedItem === this; }
    select() { if (this.props.onSelected) { this.props.onSelected.call(this, this); } }
    
    render() {
        const { data } = this.props;
        const { name, image } = data;
        var style = {
            'backgroundImage': `url(${image.cache.element.src})`
        };
        // <div>Name: <EditableText value={name} onChange={this.onNameChanged.bind(this)}></EditableText></div>
        return (
            <li className={`h-li${ this.selected() ? ' h-li-focus' : '' }`}>
                <FlexView className="h-li-titlediv" spaceBetween alignItems="center" onClick={this.select.bind(this)}>
                    <span className="h-li-preview" style={style}></span>
                    <span className="h-li-name">{name}</span>
                    <Button onClick={(() => this.setState({ detail_open: !this.state.detail_open })).bind(this)}>
                        <Icon entry="expand_more"></Icon>
                    </Button>
                </FlexView>
                <Collapse open={this.state.detail_open} className="h-li-detail-cont">
                    <div>Original size: {image.size.x} x {image.size.y}</div>
                    <div>Cropped size: {image.content_size.x} x {image.content_size.y}</div>
                </Collapse>
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
//   do not put code about packing (or anything else) inside!
class HPackedCanvas extends React.Component<HPackedCanvasProps, any> {
	componentDidUpdate () {
		canvasStoreAndClearCall(this.refs['canvas'] as any,
			(ctx) => {
				React.Children.forEach(this.props.children,
					(child) => {
						canvasContextStoreCall(ctx, (ctx) => {
							var c: HPackedImage = (child as any);
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
    
    getCanvasRef() {
        return (this.refs['canvas'] as HTMLCanvasElement);
    }
	
	render () {
		return (
            <canvas { ... this.props } ref="canvas" width={this.props.canvasSize.x}
                height={this.props.canvasSize.y} />
		);
	}
}

interface HModalImportImagesProps extends ModalContainerProps {
    onConfirm: Function;
}

class HModalImportImages extends React.Component<HModalImportImagesProps, any> {
    constructor(props) {
        super(props);
        this.state = { files: [ ] };
    }
    
    close() {
        this.setState({ files: [ ] });
        (this.refs['dialog'] as ModalDialog).close();
    }
    
    // TODO: promisify it, too
    handleConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm({
                'target': this,
                'files': this.state.files
            });
        }
        this.close();
    }
    
    handleSelectFile() {
        var files = [ ];
        Array.prototype.forEach.call((this.refs['files'] as HTMLInputElement).files,
            (file) => files.push(file));
        var newState = React.addons.update(this.state,
            { files: { $push: files } });
        this.setState(newState);
    }
    
    // www.zhangxinxu.com/wordpress/2015/11/html-input-type-file
    //  why 'position:absolute; clip:rect(0 0 0 0);'?
    render () {
        return (
            <ModalContainer { ... this.props } leaveDuration={600}>
                <ModalDialog ref="dialog" className="rhead" classNameClose="closing" onClose={this.props.onClose}>
                    <h4>Select files:</h4>
                    <input ref="files" type="file" id="import-file" accept="image/*" multiple
                        onChange={this.handleSelectFile.bind(this)} />
                    <hr />
                    <div className="ralign-right">
                        <Button onClick={this.close.bind(this)}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleConfirm.bind(this)}>
                            Import
                        </Button>
                    </div>
                </ModalDialog>
            </ModalContainer>
        );
    }
}

interface HModalSaveResultProps extends ModalContainerProps {
    data?: HPackerFolder[];
    canvasSize?: Hector;
}

class HModalSaveResult extends React.Component<HModalSaveResultProps, any> {
    constructor(props) {
        super(props);
    }
    
    componentDidUpdate() {
        if (this.props.show) {
            (this.refs['canvas'] as HPackedCanvas).forceUpdate();
        }
    }
    
    close() {
        (this.refs['dialog'] as ModalDialog).close();
    }
    
    saveImage(e: MouseEvent) {
        var imageData = (this.refs['canvas'] as HPackedCanvas).getCanvasRef().toDataURL('image/png');
        (this.refs['linkSaveImage'] as HTMLLinkElement).href = imageData;
    }
    
    render () {
        return (
            <ModalContainer { ... this.props } leaveDuration={600}>
                <ModalDialog ref="dialog" className="rhead" classNameClose="closing" onClose={this.props.onClose}>
                    <h4>Save Sprite</h4>
                    <hr />
                    <div className="hi-save-preview">
                        <HPackedCanvas ref="canvas" showBorder={false} canvasSize={this.props.canvasSize}>
                            {this.props.data.map((folder) =>
                                folder.images.map((image) =>
                                    <HPackedImage data={image}></HPackedImage>))}
                        </HPackedCanvas>
                    </div>
                    <hr />
                    <a ref="linkSaveImage" href="#" onClick={this.saveImage.bind(this)} download="sprite.png">
                        <Button>Save Image to ...</Button>
                    </a>
                    <Button>Save Definition to ...</Button>
                    <hr />
                    <div className="ralign-right">
                        <Button onClick={this.close.bind(this)}>Close</Button>
                    </div>
                </ModalDialog>
            </ModalContainer>
        );
    }
}

interface HPackerAppState {
	images? : HPackerFolder[];
	packer? : RectangleBinPackerI;
    size?: Hector;
    showBorder?: boolean;
    
    modalImport?: boolean;
    modalSave?: boolean;
}

class HPackerApp extends React.Component<any, HPackerAppState> {
	
    // React with ES6 calss has no Mixins ...
    // mixins: [ React.addons.LinkedStateMixin ]
    
	constructor(props : any) {
		super(props);
		this.state = {
			images: new Array<HPackerFolder>(),
			packer:  new RectangleBinPackerSkyline(new Hector(512, 512)),
            size: new Hector(512, 512),
            showBorder: true,
            
            modalImport: false,
            modalSave: false
		};
        this.state.images.push(new HPackerFolder('1'));
		
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
        for (var folder of this.state.images) {
            for (var image of folder.images) {
                this.packerInsert(image);
            }
        }
    }
    
    // TODO: should returns a Promise
    //  maybe the change of state should also be delayed
    addFileTo (file: File, folder: HPackerFolder) {
        var name = file.name;
        console.log(`adding ${name} ...`);
        var reader = new FileReader();
        var { images } = this.state;
        var that = this;
        reader.onload = (e) => {
            var image = new Image();
            image.onload = () => {
                cropImage(new CachedImageData(image), (cropped_img) => {
                    var data = new HPackerImageData(cropped_img, name);
                    if (this.packerInsert(data)) {
                        this.setState({
                            images : (folder.images.push(data), images) });
                    }
                });
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    addFilesTo (files: FileList | File[], folder: HPackerFolder) {
        Array.prototype.forEach.call(files, (file) => {
            // only continue if dropped in an image
            if (!file.type.match(/image.*/)) {
                return; }
            this.addFileTo(file, folder);
        });
    }
	
	handleDragOver(e : React.DragEvent) {
		e.preventDefault(); }
		
	handleDrop(e : React.DragEvent) {
		e.preventDefault();
        // support for multiple files
        this.addFilesTo(e.dataTransfer.files, (this.refs['layers'] as HImagesList).getSelectedFolder());
	}
    
    onToolbarCreateNewFolder() {
        var folderName = (this.state.images.length + 1).toString();
        var newFolder = new HPackerFolder(folderName);
        var newState = React.addons.update(this.state, { images: { $push: [ newFolder ] } });
        this.setState(newState);
    }
    
    onModalAddFile(e: { files: FileList }) {
        this.addFilesTo(e.files, (this.refs['layers'] as HImagesList).getSelectedFolder());
    }
    
    onNameChanged(e, target) {
        target.name = e.target.value;
        this.setState({ images: this.state.images });
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
        // <HPreview
        //     image={this.state.images.length ? this.state.images[this.state.images.length-1].image : undefined}>
        // </HPreview>
		return (
            <FlexView style={{height: '100%'}} className="hi-workspace"
                    onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    
                <HModalImportImages show={this.state.modalImport}
                    onConfirm={this.onModalAddFile.bind(this)}
                    onClose={() => this.setState({ modalImport: false })} />
                <HModalSaveResult show={this.state.modalSave}
                    data={this.state.images} canvasSize={this.state.size}
                    onClose={() => this.setState({ modalSave: false })} />
                    
                <FlexView column grow={1} style={{overflow: 'hidden'}}>
                    <FlexElement className="h-packed-canvas" grow={1}>
                        <HPackedCanvas canvasSize={this.state.size}
                                showBorder={this.state.showBorder} style={{flexGrow: 1}}>
                            {this.state.images.map((folder) =>
                                folder.images.map((image) =>
                                    <HPackedImage data={image}></HPackedImage>))}
                        </HPackedCanvas>
                    </FlexElement>
                    <FlexView column shrink={0}>
                        <FlexView style={{padding: '4px'}}>
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
                        </FlexView>
                        <div><hr className="rnomargin" /></div>
                        <FlexView spaceBetween alignItems="center">
                            <div>
                                <Button onToolbar onClick={() => this.setState({ modalImport: true })}>
                                    <Icon entry="add_circle_outline" />
                                </Button>
                                <Button onToolbar onClick={() => this.setState({ modalSave: true })}>
                                    <Icon entry="save" />
                                </Button>
                            </div>
                            <div>by secondwtq 2015-2016</div>
                            <div>
                                <Button onToolbar>
                                    <Icon entry="info_outline" />
                                </Button>
                                <Button onToolbar onClick={this.onToolbarCreateNewFolder.bind(this)}>
                                    <Icon entry="create_new_folder" />
                                </Button>
                            </div>
                        </FlexView>
                    </FlexView>
                </FlexView>
                
                <FlexView className="h-right-view">
                    <HImagesList ref="layers" data={this.state.images}
                        onChangeName={this.onNameChanged.bind(this)}
                        callbackAddFilesTo={this.addFilesTo.bind(this)} />
                </FlexView>
            </FlexView>
		);
	}
}

ReactDOM.render(<HPackerApp />,
    document.getElementById('rct-plchder'));

}
