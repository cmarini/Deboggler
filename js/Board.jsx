'use strict';

import Die from './Die.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        console.log("BOARD CONSTRUCTOR");
        this.state = {
            value: "",
            size: this.props.initialSize,
        }
    }

    handleInputChange(event) {
        /* Convert all non-comboCaps to lowercase */
        const re = new RegExp("[^" + comboCaps + "]", 'g');
        let modified = event.target.value.replace(re, (match) => {
            return match.toLowerCase();
        });

        if (modified.length <= (this.state.size * this.state.size) &&
            boardRegex.test(modified)
        ) {
            this.setState({ value: modified });
        }
    }

    renderDie(row, col) {
        let idx = (row * this.state.size) + col;
        return (
            <Die
                row={row}
                col={col}
                value={this.state.value.substr(idx, 1)}
                idx={idx}
                key={`die_${idx}`}
                id={`die_${idx}`}
            ></Die>
        )
    }

    render() {
        let row, col;
        let dieRows = [];
        for (row = 0; row < this.state.size; row++) {
            let dice = [];
            for (col = 0; col < this.state.size; col++) {
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
            <div id="react-board-wrap">
                <input
                    id="react-board-input"
                    value={this.state.value}
                    onChange={event => { this.handleInputChange(event); }}
                />
                {dieRows}
            </div>
        );
    }
}


