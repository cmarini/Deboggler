'use strict';
import Die from './boggle_die.js';
const e = React.createElement;

class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    renderDie(row, col) {
        let idx = (row * this.props.size) + col;
        return e(Die, {
            row: row, 
            col: col, 
            idx: idx,
            key: `die_${idx}`,
            id: `die_${idx}`
        });
    }

    render() {
        let row, col;
        let rows = [];
        for (row = 0; row < this.props.size; row++) {
            let dice = [];
            for (col = 0; col < this.props.size; col++) {
                dice.push(this.renderDie(row, col));
            }
            rows.push(e("div", { className: "dieRow", row: row, key: `dieRow_${row}` }, dice));
        }
        console.log(rows);
        return rows;
    }
}

const domContainer = document.querySelector('#react-boggle-board');
ReactDOM.render(e(Board, { size: 5 }), domContainer);
