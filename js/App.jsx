'use strict';

import Die from './Die.js';
import Board from './Board.js';
import BoardSettings from './BoardSettings.js';

class App extends React.Component {
    constructor(props) {
        console.log("APP CONSTRUCTOR");

        super(props);
        this.state = { boardSize: 5 };

        this.updateBoardSize = this.updateBoardSize.bind(this);
    }

    updateBoardSize(newVal) {
        console.log(`updateBoardSize(${newVal})`);
        this.setState({ boardSize: newVal });
    }

    render() {
        return (
            <div>
                <BoardSettings size={this.state.boardSize}
                    updateCallback={this.updateBoardSize}
                />
                <div className={"react-boggle-board"}>
                    <Board size={this.state.boardSize} />
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
