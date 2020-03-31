import React from 'react';

import './default.css';

export default class Definition extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            def: this.props.data,
            showDef: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                showDef: false,
            })
        }
    }

    lookup(word) {
        if (this.state.def) {
            console.log(`already looked up '${word}'`);
            this.setState({
                showDef: true,
            })
            return;
        }
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
                        def: data,
                        showDef: true,
                    })
                });
            }
            )
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }

    handleWordClick(event) {
        this.lookup(this.props.word)
    }

    render() {
        return (
            <div>
                <div className="word"
                    onClick={event => { this.handleWordClick(event) }}
                >
                    {this.props.word}
                </div>
                {this.state.showDef &&
                    this.makeDefinition()
                }
            </div>
        );
    }

    makeDefinition() {
        let def = this.state.def;
        if (!def) { return null; }
        let headword = this.props.word;
        let deflist = <li>{"No Definitions Found"}</li>;
        let key_inc = 0;
        try {
            headword = def[0]['meta']['id'].split(':')[0];
            deflist = def.map((item, idx) =>
                <li className={"definition"} key={key_inc++}>
                    <span className={"fl"} >
                        {item["fl"] + ": "}
                    </span>
                    <ul>
                        {item["shortdef"].map((item, idx) =>
                            <li className={"shortdef"} key={key_inc++}>
                                {item}
                            </li>
                        )}
                    </ul>
                </li>
            );
        }
        catch (err) {
            console.log("Unexpected definition data structure");
        }
        return (
            <div
                className="definition-tooltip"
                ref={this.setWrapperRef}
            >
                <div className="tooltip-header">
                    <div className="headword">{headword}</div>
                    <a className="definition-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.merriam-webster.com/dictionary/${headword}`}
                    >
                        {"Definition Page"}
                    </a>
                </div>
                <ul>
                    {deflist}
                </ul>
            </div>
        )
    }
}
