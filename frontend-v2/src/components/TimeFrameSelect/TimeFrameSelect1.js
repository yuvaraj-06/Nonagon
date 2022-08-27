import React from "react";
import DateTimePicker from "react-datetime-picker";

class TimeFrameSelect extends React.Component {
    constructor() {
        super();
        this.state = {
            startTime: new Date(Date.now()),
            endTime: new Date(Date.now())
        };
        this._ismounted = true;
        // this.props.selectTimeFrame()
    }
    componentWillUnmount() {
        this._ismounted = false;
    }
    render() {
        return (
            <div>
                <span>From :
                <DateTimePicker
                        onChange={(newTime) => this._ismounted && this.setState({ startTime: newTime })}
                        value={this.state.startTime}
                        maxDate={new Date(Date.now())}
                    />
                </span>
                <br />
                <span> To : </span>
                <DateTimePicker
                    onChange={(newTime) => this._ismounted && this.setState({ endTime: newTime })}
                    value={this.state.endTime}
                    maxDate={new Date(Date.now())}
                />
                <br />
                <br />
                {this.state.startTime.toISOString().slice(0, -1)} to{" "}
                {this.state.endTime.toISOString().slice(0, -1)}
            </div>
        );
    }
}

export default TimeFrameSelect;
