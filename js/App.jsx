'use strict';

import Die from './Die.jsx';
import Board from './Board.jsx';
import BoardSettings from './BoardSettings.jsx';

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
