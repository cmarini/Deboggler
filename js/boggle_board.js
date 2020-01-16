'use strict';

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

class Die extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    handleChange(event) {
        let str = event.target.value;
        let curLen = this.state.value.length;
        if (str.length > curLen) {
            if (str.substring(0,curLen) === this.state.value.substring(0,curLen)) {
                str = str.substring(curLen);
            }
        }
        let char = str.substring(0, 1);
        console.log(`${this.state.value} -> ${char}`);
        this.setState({ value: char });
    }

    render() {
        return e("input", {
            className: "die invalid",
            row: this.props.row,
            col: this.props.col,
            idx: this.props.idx,
            id: this.props.id,
            tabIndex: "0",
            value: this.state.value,
            onChange: (event) => {
                console.log(event);
                console.log(`event value = ${event.target.value}`);
                console.log(`state value = ${this.state.value}`);
                this.handleChange(event);
            }
        }, this.props.value);
    }
}

const domContainer = document.querySelector('#react-boggle-board');
ReactDOM.render(e(Board, { size: 5 }), domContainer);
