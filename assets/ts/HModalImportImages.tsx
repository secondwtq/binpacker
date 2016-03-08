"use strict";

import * as React from 'react';
import ReactAddonUpdate = require('react-addons-update');

import Button from './BasicControls/Button';
import { ModalContainerProps, ModalContainer, ModalDialog } from './BasicControls/Modal';

interface HModalImportImagesProps extends ModalContainerProps {
    onConfirm: Function;
}

export default class HModalImportImages extends React.Component<HModalImportImagesProps, any> {
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
        var newState = ReactAddonUpdate(this.state,
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
