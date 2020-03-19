import React from 'react';

import './default.css';

import Die from '../Die/Die.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
    }

    componentDidMount() {
        this.boardInput.focus();
    }

    renderDie(row, col) {
        let idx = (row * this.props.size) + col;
        return (
            <Die
                row={row}
                col={col}
                value={this.props.value.substr(idx, 1)}
                idx={idx}
                key={`die_${idx}`}
                id={`die_${idx}`}
                callback={this.dieClickCallback}
            ></Die>
        )
    }

    dieClickCallback() {

    }

    render() {
        let row, col;
        let dieRows = [];
        for (row = 0; row < this.props.size; row++) {
            let dice = [];
            for (col = 0; col < this.props.size; col++) {
                dice.push(this.renderDie(row, col));
            }
            dieRows.push(
                <div
                    className="dieRow"
                    row={row}
                    key={`dieRow_${row}`}
                >
                    {dice}
                </div>
            );
        }
        return (
            <div className="react-board-wrap">
                <input
                    ref={(input) => { this.boardInput = input; }}
                    className="react-board-input"
                    value={this.props.value}
                    onChange={event => { this.props.updateCallback(event); }}
                />
                {dieRows}
            </div>
        );
    }
}


