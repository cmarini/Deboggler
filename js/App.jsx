'use strict';

import Die from './Die.js';
import Board from './Board.js';
import BoardSettings from './BoardSettings.js';

class App extends React.Component {
    constructor(props) {
        console.log("APP CONSTRUCTOR");

        super(props);
        this.state = {
            boardSize: 5,
            value: "",
        };

        this.updateBoardSize = this.updateBoardSize.bind(this);
        this.updateBoardStr = this.updateBoardStr.bind(this);
    }

    updateBoardSize(newVal) {
        console.log(`updateBoardSize(${newVal})`);
        this.setState((prevState, props) => {
            return { boardSize: newVal }
        });
    }

    updateBoardStr(event) {
        /* Convert all non-comboCaps to lowercase */
        let modified = event.target.value;
        if (modified.length > (this.state.boardSize * this.state.boardSize)) {
            modified = event.target.value.substr(0, this.state.boardSize * this.state.boardSize);
        }
        const re = new RegExp("[^" + comboCaps + "]", 'g');
        modified = modified.replace(re, (match) => {
            return match.toLowerCase();
        });

        if (modified.length <= (this.state.boardSize * this.state.boardSize) &&
            boardRegex.test(modified)
        ) {
            this.setState((prevState, props) => {
                return { value: modified };
            });
        }
    }

    handleSolveButton() {
        console.log("SOLVE BUTTON");
    }

    render() {
        return (
            <div>
                <BoardSettings size={this.state.boardSize}
                    updateCallback={this.updateBoardSize}
                />
                <div className={"react-boggle-board"}>
                    <Board size={this.state.boardSize}
                        updateCallback={this.updateBoardStr}
                        value={this.state.value}
                    />
                </div>

                <div id="solveContainer">
                    <button id="solveButton"
                        onClick={event => { this.handleSolveButton(event); }}
                    >
                        Find Words
                    </button>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#react-boggle-board-settings');
ReactDOM.render(
    <App />,
    domContainer
);
