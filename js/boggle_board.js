'use strict';

const e = React.createElement;

class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    renderDie(row, col) {
        return e(Die, { row: row, col: col, key: `die_${row}_${col}`});
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

class Die extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return e("div", { className: "die invalid", row: this.props.row, col: this.props.col });
    }
}

const domContainer = document.querySelector('#react-boggle-board');
ReactDOM.render(e(Board, {size:3}), domContainer);
