import React from 'react';

import './default.css';

import Die from '../Die/Die.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            selected: 0,
        }
        this.handleDieClick = this.handleDieClick.bind(this);
    }

    componentDidMount() {
        this.boardInput.focus();
    }

    handleDieClick(event) {
        let idx = parseInt(event.target.getAttribute('idx'));
        this.boardInput.focus();
        this.setSelection(idx);
    }
    handleSelectionChange(event) {
        let idx = event.target.selectionStart;
        this.setSelection(idx);
    }
    setSelection(idx) {
        this.boardInput.setSelectionRange(idx, idx + 1);
        idx = this.boardInput.selectionStart;
        this.setState((prevState, props) => {
            return { selected: idx };
        })
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
                callback={this.handleDieClick}
                selected={this.state.selected}
            ></Die>
        )
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
                    // onKeyUp={event => { this.handleKeyUp(event); }}
                    onSelect={event => { this.handleSelectionChange(event); }}
                />
                {dieRows}
            </div>
        );
    }
}


