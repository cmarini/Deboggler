import React from 'react';
import { diceLookup } from '../dice';

import './default.css';

export default class BoardGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dieSetSelection: 0,
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
        let strlen = this.props.size ** 2;
        if (diceLookup[strlen]) {
            /* Generate board from selected die set */
            let dice = diceLookup[strlen][this.state.dieSetSelection].dice;
            for (let i = dice.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = dice[i]
                dice[i] = dice[j]
                dice[j] = temp
            }
            for (let i = 0; i < strlen; i++) {
                str += dice[i].substr((Math.floor(Math.random() * dice[i].length)), 1);
            }
            console.log(dice);
        } else {
            /* Generate random board string */
            console.log(`handleClick: Randomize ${strlen}`);
            for (let i = 0; i < strlen; i++) {
                str += (Math.floor(Math.random() * 26 + 10)).toString(36);
            }
        }
        console.log(`Random Board: ${str}`);
        this.props.updateCallback(str);
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
