import React from 'react';

import './default.css';
import './loader.css';

export default class LoadingTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let progress = "";
        if (this.props.progress) {
            progress = this.props.progress + "b";
        }
        return (
            <div id="dict-loading-tab">
            <div id="dict-loading-tab-slider">
              <div id="dict-loading-tab-wrap">
                {"Loading Dictionary "}
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
                <br></br>
                {progress}
              </div>
            </div>
          </div>
        );
    }
}
