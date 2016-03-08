
"use strict";

import * as React from 'react';
    
interface EditableTextProps extends React.HTMLProps<any> {
    disabled?: boolean;
    onChange?: (Object) => any;
    value?: string;
}

interface EditableTextState {
    editing?: boolean;
    tempValue?: string;
}

export default class EditableText extends React.Component<EditableTextProps, EditableTextState> {
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
