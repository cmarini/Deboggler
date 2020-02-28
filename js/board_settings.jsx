'use strict';

const BOARD_SIZE_MIN = 2;
const BOARD_SIZE_MAX = 20;

export default class BoardSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            size: this.props.initialSize,
        }
    }

    handleClick(event, val) {
        console.log(`handleClick: ${val}`);
        let newVal = this.state.size + val;
        if (newVal < BOARD_SIZE_MIN) { newVal = BOARD_SIZE_MIN}
        if (newVal > BOARD_SIZE_MAX) { newVal = BOARD_SIZE_MAX}
        this.setState({ size: newVal });
    }

    render() {
        return (
            <div>
                <span>{["Board Size: ", this.state.size, "x", this.state.size]}</span>
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
