import React from 'react';
import Board from './components/Board/Board.js';
import BoardSettings from './components/BoardSettings/BoardSettings.js';
import Results from './components/Results/Results.js';
import * as Solver from './components/BoardSolver.js';
import Dict from './components/Dict-BSS.js';
import { comboCaps, boardRegex } from './components/dice.js';

// const got = require('got');
// import Got from 'got';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 5,
      value: "",
      dictLoaded: false,
      results: [],
      solved: false,
    };

    this.updateBoardSize = this.updateBoardSize.bind(this);
    this.updateBoardStr = this.updateBoardStr.bind(this);
    this.handleDictDone = this.handleDictDone.bind(this);

    this.dict = new Dict();
    this.dict.dictGenerator(this.handleDictDone);
  }

  isBoardFull() {
    return this.state.value.length === (this.state.boardSize * this.state.boardSize);
  }

  handleDictDone() {
    this.setState((prevState, props) => {
      return { dictLoaded: true }
    });
  }

  updateBoardSize(newVal) {
    console.log(`updateBoardSize(${newVal})`);
    this.setState((prevState, props) => {
      return {
        boardSize: newVal,
        value: this.state.value.substr(0, newVal * newVal)
      }
    });
  }

  updateBoardStr(event) {
    let modified = event.target.value;
    let maxStrLen = this.state.boardSize * this.state.boardSize;
    if (modified.length > (maxStrLen)) {
      modified = modified.substr(0, maxStrLen);
    }
    /* Convert all non-comboCaps to lowercase */
    const re = new RegExp("[^" + comboCaps + "]", 'g');
    modified = modified.replace(re, (match) => {
      return match.toLowerCase();
    });

    if (boardRegex.test(modified)) {
      if (modified !== this.state.value) {
        this.setState((prevState, props) => {
          return {
            value: modified,
            results: [],
            solved: false,
          };
        });
      }
    }
  }

  handleSolveButton() {
    console.log("SOLVE BUTTON");
    let res = Solver.solve(this.dict, this.state.boardSize, this.state.value);
    this.setState((prevState, props) => {
      return {
        results: res,
        solved: true
      };
    })
    console.log("SOLVE BUTTON DONE");
  }

  render() {
    return (
      <div>
        <BoardSettings size={this.state.boardSize}
          updateCallback={this.updateBoardSize}
        />
        <div className={"col"}>
          <div className={"react-boggle-board"}>
            <Board size={this.state.boardSize}
              updateCallback={this.updateBoardStr}
              value={this.state.value}
            />
          </div>
          {this.state.dictLoaded && this.isBoardFull() &&
            <div id="solveContainer">
              <button id="solveButton"
                onClick={event => { this.handleSolveButton(event); }}
              >
                {"Find Words"}
              </button>
            </div>
          }
        </div>
        {this.state.solved &&
          <Results className={"col"} list={this.state.results} />
        }
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

export default App;
