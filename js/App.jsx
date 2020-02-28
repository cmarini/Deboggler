'use strict';

import Die from './Die.js';
import Board from './Board.js';
import BoardSettings from './BoardSettings.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { boardSize: 5 };
    }

    updateBoardSize(size) {

    }

    render() {
        return (
            <div>
                <BoardSettings initialSize={5}
                    updateCallback={this.updateBoardSize}
                />
                <div id={"react-boggle-board"}>
                    <Board initialSize={this.state.boardSize} />
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
