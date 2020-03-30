import React from 'react';
import Board from './components/Board/Board.js';
import BoardSettings from './components/BoardSettings/BoardSettings.js';
import Results from './components/Results/Results.js';
import * as Solver from './components/BoardSolver.js';
import Dict from './components/Dict-BSS.js';
import { comboCaps, boardRegex } from './components/dice.js';
// import Dictionary from './components/Dictionary.js';
import Definition from './components/Definition/Definition.js';
import LoadingTab from './components/LoadingTab/LoadingTab.js';

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
    this.handleDictDownloading = this.handleDictDownloading.bind(this);

    this.dict = new Dict();
    this.dict.dictGenerator(this.handleDictDone, this.handleDictDownloading);
  }

  isBoardFull() {
    return this.state.value.length === (this.state.boardSize * this.state.boardSize);
  }
  isBoardEmpty() {
    return this.state.value.length === 0;
  }

  handleDictDone() {
    this.setState((prevState, props) => {
      return { dictLoaded: true }
    });
  }

  handleDictDownloading(progressEvent) {
    this.setState((prevState, props) => {
      return { downloadProgress: progressEvent.loaded }
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
  handleClearButton() {
    console.log("CLEAR BUTTON");
    this.setState((prevState, props) => {
      return {
        results: [],
        solved: false,
        value: "",
      };
    })
  }

  render() {
    return (
      <div>
        <Definition
          word={"test"}
          // data={dictdata}
        >
          {/* {"Test"} */}
        </Definition>
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
          {!this.isBoardEmpty() &&
            <div id="solveContainer">
              <button id="clearButton"
                onClick={event => { this.handleClearButton(event); }}
              >
                {"Clear Board"}
              </button>
            </div>
          }
        </div>
        {this.state.solved &&
          <Results className={"col"} list={this.state.results} />
        }
        {this.state.dictLoaded ||
          <LoadingTab progress={this.state.downloadProgress} />
        }
      </div>
    );
  }
}

export default App;
