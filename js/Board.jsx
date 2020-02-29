'use strict';

import Die from './Die.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        console.log("BOARD CONSTRUCTOR");
        this.state = {
            value: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        /* Convert all non-comboCaps to lowercase */
        let modified = event.target.value;
        if (modified.length > (this.props.size * this.props.size)) {
            modified = event.target.value.substr(0, this.props.size * this.props.size);
        }
        const re = new RegExp("[^" + comboCaps + "]", 'g');
        modified = modified.replace(re, (match) => {
            return match.toLowerCase();
        });

        if (modified.length <= (this.props.size * this.props.size) &&
            boardRegex.test(modified)
        ) {
            this.setState({ value: modified });
        }
    }

    renderDie(row, col) {
        let idx = (row * this.props.size) + col;
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
                    value={this.state.value}
                    onChange={event => { this.handleInputChange(event); }}
                />
                {dieRows}
            </div>
        );
    }
}


