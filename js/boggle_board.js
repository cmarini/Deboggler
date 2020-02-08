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
        this.state = {
            value: '',
            valid: false,
        };
        this.inputRef = React.createRef();
    }

    validateDie(string, increment) {
        console.log(`validateDie: die=${this.props.idx} str='${string}' inc=${increment}`);
        this.setState({ value: string, valid: string.length>0?true:false });
        $(`#die_${this.props.idx + increment}`).focus();
    }

    handleChange(event) {
        let str = event.target.value;
        let curLen = this.state.value.length;
        let next = 1;
        if (str.length > curLen) {
            if (str.substring(0,curLen) === this.state.value.substring(0,curLen)) {
                str = str.substring(curLen);
            }
        }
        else {
            next = -1;
        }
        let char = str.substring(0, 1);

        this.validateDie(char, next);
    }

    handleKeyUp(event) {
        if (event.key == "Backspace" && event.target.value == "") {
            this.validateDie("", -1);
            this.setState({ valid: false });
        }
    }

    render() {
        return e("input", {
            className: "die " + (this.state.valid==true?"valid":"invalid"),
            // className: "die " + this.state.valid?"valid":"invalid",
            row: this.props.row,
            col: this.props.col,
            idx: this.props.idx,
            id: this.props.id,
            ref: this.inputRef,
            tabIndex: "0",
            value: this.state.value,
            onChange: (event) => {
                this.handleChange(event);
            },
            onKeyUp: (event) => {
                this.handleKeyUp(event);
            },
        }, this.props.value);
    }
}

const domContainer = document.querySelector('#react-boggle-board');
ReactDOM.render(e(Board, { size: 5 }), domContainer);