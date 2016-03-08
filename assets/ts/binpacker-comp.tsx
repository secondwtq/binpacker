
import Button from './BasicControls/Button';
import Collapse from './BasicControls/Collapse';
import FlexView from './BasicControls/FlexView';
import FlexElement from './BasicControls/FlexElement';
import Icon from './BasicControls/Icon';
import EditableText from './BasicControls/EditableText';

import HModalImportImages from './HModalImportImages';

import Hector from './hector';
import { Rectangle, RectangleBinPackerI, RectangleBinPackerSkyline } from './binpacker';

import HModalSaveResult from './HModalSaveResult';
import { HPackedCanvas, HPackedImage } from './HPackedCanvas';

import { CachedImageData, cropImage } from './binpacker-index';
import { HPackerFolder, HPackerImageData } from './binpacker-uidata';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactAddonUpdate = require('react-addons-update');

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
                        <Button onToolbar onClick={this.onToolbarRemove.bind(this)}>
                            <Icon entry="clear" />
                        </Button>
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
            image.src = (e.target as any).result;
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
        var newState = ReactAddonUpdate(this.state, { images: { $push: [ newFolder ] } });
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
            <FlexView style={{height: '100%', overflow: 'hidden'}} className="hi-workspace"
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
