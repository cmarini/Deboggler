import React from 'react';

import './default.css';

export default class Die extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valid: false,
        };
    }

    render() {
        let list;
        if (this.props.sort.toLowerCase() === "length") {
            list = this.props.list.sort(function (x, y) {
                var diff = y.length - x.length;
                if (diff === 0) return (x < y ? (-1) : 1);
                return diff;
            });
        } else {
            list = this.props.list.sort();
        }

        let empty = this.props.list.length <= 0 ? "empty" : "";

        return (
            <div className="resultsListWrap card-2">
                <span>{this.props.sort}</span>
                <div className={"resultsListContainer " + empty}>
                    <ul className="resultsList">
                        {list.map((word, idx) =>
                            <li key={idx}>
                                {word}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}
