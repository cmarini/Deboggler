import React from 'react';

import './default.css';

import { toComboDie } from '../dice.js';

export default class Die extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valid: false,
        };
    }

    render() {
        let valid = this.props.value ? "valid" : "invalid";
        let character = this.props.value.length <= 0 ? "\u00a0" : toComboDie(this.props.value);
        let selected = this.props.selected === this.props.idx ? "highlight" : "";
        return (
            <div
                className={["die", valid, selected].join(" ")}
                row={this.props.row}
                col={this.props.col}
                idx={this.props.idx}
                id={this.props.id}
                tabIndex={"0"}
                value={this.props.value}
                onClick={event => { this.props.callback(event); }}
            >
                {character}
            </div>
        );
    }
}
