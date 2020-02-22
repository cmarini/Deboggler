'use strict';

import Die from './boggle_die.js';

const e = React.createElement;

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            size: this.props.initialSize,
        }
    }

    handleInputChange(event) {
        /* Convert all non-comboCaps to lowercase */
        const re = new RegExp("[^"+comboCaps+"]", 'g');
        let modified = event.target.value.replace(re, (match) => {
            return match.toLowerCase();
        });

        if (modified.length <= (this.state.size*this.state.size) && 
            boardRegex.test(modified)
        ) {
            this.setState({ value: modified });
        }
    }

    renderDie(row, col) {
        let idx = (row * this.state.size) + col;
        return e(Die, {
            row: row, 
            col: col, 
            value: this.state.value.substr(idx, 1),
            idx: idx,
            key: `die_${idx}`,
            id: `die_${idx}`
        });
    }

    render() {
        let row, col;
        let dieRows = [];
        for (row = 0; row < this.state.size; row++) {
            let dice = [];
            for (col = 0; col < this.state.size; col++) {
                dice.push(this.renderDie(row, col));
            }
            dieRows.push(e("div", { className: "dieRow", row: row, key: `dieRow_${row}` }, dice));
        }
        /* 
        return e("div", { id: "react-board-wrap" } ,
            e("input", { 
                id: "react-board-input",
                value: this.state.value,
                onChange: (event) => { this.handleInputChange(event); },
            }),
            dieRows
        ); 
        */
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

const domContainer = document.querySelector('#react-boggle-board');
export let reactBoard = e(Board, { initialSize: 5 });
ReactDOM.render(reactBoard, domContainer);


