'use strict';

import Die from './boggle_die.js';
import Board from './boggle_board.js';
import BoardSettings from './board_settings.js';

class App extends React.Component {
    render() {
        return (
            <div>
                <BoardSettings initialSize={5} />
                <div id={"react-boggle-board"}>
                    <Board initialSize={5} />
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
