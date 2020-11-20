import React from 'react';
import { diceLookup } from '../dice';

import './default.css';

export default class BoardGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dieSetSelection: 0,
            currentSize: this.props.size,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        console.log(`Selected ${event.target.value}`);
        this.setState({ dieSetSelection: event.target.value });
    }

    handleClick(event) {
        let str = '';
        let dieCount = this.props.size ** 2;
        console.log(`Die Selection: ${this.state.dieSetSelection}`);
        console.log(`Die Count: ${dieCount}`);
        console.log(diceLookup);
        if (diceLookup[dieCount]) {
            /* Generate board from selected die set */
            let selection = this.state.dieSetSelection;
            let dice = diceLookup[dieCount][selection].dice;
            /* Create a randomized order of dice */
            let dieSelector = [...Array(dieCount).keys()];
            for (let i = dieSelector.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                const temp = dieSelector[i];
                dieSelector[i] = dieSelector[j];
                dieSelector[j] = temp;
            }
            for (let i = 0; i < dieCount; i++) {
                str += dice[dieSelector[i]].substr((Math.floor(Math.random() * dice[dieSelector[i]].length)), 1);
            }
            console.log(dice);
        } else {
            /* Generate random board string */
            console.log(`handleClick: Randomize ${dieCount}`);
            for (let i = 0; i < dieCount; i++) {
                str += (Math.floor(Math.random() * 26 + 10)).toString(36);
            }
        }
        console.log(`Random Board: ${str}`);
        this.props.updateCallback(str);
    }

    componentDidUpdate(prevProps, prevState) {
        // If the board changed size, reset the dieSetSelection
        if (this.props.size !== prevProps.size) {
            console.log(`PROPS CHANGE: ${prevProps.size} -> ${this.props.size}`);
            this.setState({
                currentSize: this.props.size,
                dieSetSelection: 0
            });
        }
    }

    render() {
        let dice = null;
        if (diceLookup[this.props.size ** 2]) {
            dice = diceLookup[this.props.size ** 2];
        }
        return (
            <div>
                <span>{"Randomize Board"}</span>
                <div className="arrowsContainer">
                    <button
                        onClick={event => { this.handleClick(event); }}
                    >
                        {"Randomize"}
                    </button>
                    {dice &&
                        <label>
                            Select Dice Set
                    <select value={this.state.dieSetSelection} onChange={this.handleChange}>
                                {dice.map((set, idx) =>
                                    <option value={idx} key={idx}>
                                        {set.name}
                                    </option>
                                )}
                            </select>
                        </label>
                    }
                </div>
            </div>
        );
    }
}
