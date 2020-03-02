'use strict';

import Die from './Die.js';
import Board from './Board.js';
import BoardSettings from './BoardSettings.js';
import WordList from './WordList.js';
import * as Solver from './BoardSolver.js';
import Dict from './Dict-BSS.js';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardSize: 5,
            value: "",
            dictLoaded: false,
            results: [],
        };

        this.updateBoardSize = this.updateBoardSize.bind(this);
        this.updateBoardStr = this.updateBoardStr.bind(this);
        this.handleDictDone = this.handleDictDone.bind(this);

        this.dict = new Dict();
        this.dict.dictGenerator(this.handleDictDone);
    }

    handleDictDone() {
        this.setState((prevState, props) => {
            return { dictLoaded: true }
        });
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
        let res = Solver.solve(this.dict, this.state.boardSize, this.state.value);
        console.log("SOLVE DONE");
        console.log(res);
        this.setState((prevState, props) => {
            return { results: res };
        })
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
                {this.state.dictLoaded &&
                    <div id="solveContainer">
                        <button id="solveButton"
                            onClick={event => { this.handleSolveButton(event); }}
                        >
                            {"Find Words"}
                        </button>
                    </div>
                }
                <div id="resultsWrap" className="col">
                    <div id="numWords">Found {this.state.results.length} words</div>
                    <div id="filterWrap">
                        <label>Filter:</label><input type="text" id="resultsFilter" />
                    </div>
                    <WordList
                        sort={"Alphabetical"}
                        list={this.state.results}
                    />
                    <WordList
                        sort={"Length"}
                        list={this.state.results}
                    />
                </div>
                {this.state.dictLoaded ||
                    <div id="dict-loading-tab">
                        <div id="dict-loading-tab-slider">
                            <div id="dict-loading-tab-wrap">
                                {"Loading Dictionary"}
                                <div className="loader">
                                    <div className="duo duo1">
                                        <div className="dot dot-a"></div>
                                        <div className="dot dot-b"></div>
                                    </div>
                                    <div className="duo duo2">
                                        <div className="dot dot-a"></div>
                                        <div className="dot dot-b"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const domContainer = document.querySelector('#react-boggle-board-settings');
ReactDOM.render(
    <App />,
    domContainer
);
