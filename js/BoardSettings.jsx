'use strict';

const BOARD_SIZE_MIN = 2;
const BOARD_SIZE_MAX = 20;

export default class BoardSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, val) {
        console.log(`handleClick: ${val}`);
        let newVal = this.props.size + val;
        if (newVal < BOARD_SIZE_MIN) { newVal = BOARD_SIZE_MIN }
        if (newVal > BOARD_SIZE_MAX) { newVal = BOARD_SIZE_MAX }
        this.props.updateCallback(newVal);
    }

    render() {
        return (
            <div>
                <span>{["Board Size: ", this.props.size, "x", this.props.size]}</span>
                <div className="arrowsContainer">
                    <div className="arrowBox up outset"
                        onClick={e => this.handleClick(e, 1)}
                    >
                        <div className="arrow up"></div>
                    </div>
                    <div className="arrowBox down outset"
                        onClick={e => this.handleClick(e, -1)}
                    >
                        <div className="arrow down"></div>
                    </div>
                </div>
            </div>
        );
    }
}
