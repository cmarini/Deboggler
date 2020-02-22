'use strict';

import reactBoard from './boggle_board.js';

const e = React.createElement;

export default class BoardSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            size: this.props.initialSize,
        }
    }

    handleInputChange(event) {
    }

    render() {
        /*
        return e("div", { id: "arrowsContainer" } ,
            e("input", { 
                id: "react-board-input",
                value: this.state.value,
                onChange: (event) => { this.handleInputChange(event); },
            }),
            dieRows
        );
        */
        return (
            <div id="arrowsContainer">
                <input id="react-board-input"
                value={this.state.value}
                onChange={handleInputChange}
                />
            </div>
        );
    }
}

const domContainer = document.querySelector('#react-boggle-board-settings');
ReactDOM.render(e(BoardSettings, { initialSize: 5 }), domContainer);


