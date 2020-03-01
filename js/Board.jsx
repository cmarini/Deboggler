'use strict';

import Die from './Die.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
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
                    className="react-board-input"
                    value={this.props.value}
                    onChange={event => { this.props.updateCallback(event); }}
                />
                {dieRows}
            </div>
        );
    }
}


