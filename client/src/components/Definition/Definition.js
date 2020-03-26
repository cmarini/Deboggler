import React from 'react';

import './default.css';

export default class Definition extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            def: this.props.data,
        };
    }

    lookup(word) {
        console.log(`looking up '${word}'...`);
        fetch(`/api/definition/${word}`)
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem.');
                    return;
                }
                response.json().then((data) => {
                    console.log(data);
                    this.setState({
                        def: data
                    })
                });
            }
            )
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }

    makeDefinition() {
        let def = this.state.def;
        if (!def) { return null; }
        let headword = def[0]['meta']['id'].split(':')[0] || this.props.word;
        return (
            <div className="definition-tooltip">
                <div className="tooltip-header">
                    <div className="headword">{headword}</div>
                    <a className="definition-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.merriam-webster.com/dictionary/${headword}`}>
                        {"Full Definition"}
                    </a>
                </div>
                <ul>
                    {def.map((item, idx) =>
                        <li className={"definition"}>
                            <span className={"fl"} key={idx}>
                                {item["fl"] + ": "}
                            </span>
                            <ul>
                                {item["shortdef"].map((item, idx) =>
                                    <li className={"shortdef"} key={idx}>
                                        {item}
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        )
    }

    render() {
        return (
            <div className="word"
                onClick={event => { this.lookup(this.props.word) }}
            >
                {this.props.word}
                {this.makeDefinition()}
            </div >
        );
    }
}
