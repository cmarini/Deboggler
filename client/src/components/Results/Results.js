import React from 'react';

import './default.css';
import WordList from '../WordList/WordList.js';

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            valid: true,
            filtered: this.props.list,
        };
    }

    handleInput(str) {
        this.setState((prevState, props) => {
            return {
                filter: str,
                filtered: this.props.list.filter((w, i) => {
                    return !(w.search(str.toLowerCase()));
                })
            };
        });
    }

    render() {
        return (
            <div id="resultsWrap" className="col">
                <div id="numWords">Found {this.props.list.length} words</div>
                <div id="filterWrap">
                    <label>Filter:</label>
                    <input type="text" id="resultsFilter"
                        onChange={event => { this.handleInput(event.target.value); }}
                    />
                </div>
                <WordList
                    sort={"Alphabetical"}
                    list={this.state.filtered}
                />
                <WordList
                    sort={"Length"}
                    list={this.state.filtered}
                />
            </div>
        );
    }
}
