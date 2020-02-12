'use strict';

import Die from './boggle_die.js';

const e = React.createElement;

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
    }

    handleInputChange(event) {
        // console.log(`handleInputChange: ${event.target.value}`);
        /* Convert all non-comboCaps to lowercase */
        const re = new RegExp("[^"+comboCaps+"]", 'g');
        let modified = event.target.value.replace(re, (match) => {
            // console.log(`match: ${match}`);
            return match.toLowerCase();
        });

        if (modified.length <= (this.props.size*this.props.size) && 
            boardRegex.test(modified)
        ) {
            this.setState({ value: modified });
        }
    }

    renderDie(row, col) {
        let idx = (row * this.props.size) + col;
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
        for (row = 0; row < this.props.size; row++) {
            let dice = [];
            for (col = 0; col < this.props.size; col++) {
                dice.push(this.renderDie(row, col));
            }
            dieRows.push(e("div", { className: "dieRow", row: row, key: `dieRow_${row}` }, dice));
        }
        // console.log(dieRows);
        return e("div", { id: "react-board-wrap" } ,
            e("input", { 
                id: "react-board-input",
                value: this.state.value,
                onChange: (event) => { this.handleInputChange(event); },
            }),
            dieRows
        );
    }
}

const domContainer = document.querySelector('#react-boggle-board');
ReactDOM.render(e(Board, { size: 20 }), domContainer);
