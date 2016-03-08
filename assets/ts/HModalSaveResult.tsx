"use strict";

import * as React from 'react';

import Button from './BasicControls/Button';
import { ModalContainerProps, ModalContainer, ModalDialog } from './BasicControls/Modal';

import Hector from './hector';
import { HPackerFolder } from './binpacker-uidata';
import { HPackedCanvas, HPackedImage } from './HPackedCanvas';

interface HModalSaveResultProps extends ModalContainerProps {
    data?: HPackerFolder[];
    canvasSize?: Hector;
}

export default class HModalSaveResult extends React.Component<HModalSaveResultProps, any> {
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
    
    onClickSaveImage(e: MouseEvent) {
        var imageData = (this.refs['canvas'] as HPackedCanvas).toDataURL('image/png');
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
                    <a ref="linkSaveImage" href="#" onClick={this.onClickSaveImage.bind(this)} download="sprite.png">
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
