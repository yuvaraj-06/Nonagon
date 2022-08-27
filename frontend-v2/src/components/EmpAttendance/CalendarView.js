import React from "react";
import {
    Card,
    CardBody
} from 'reactstrap'

export default class CalendarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightedDates: this.props.highlightedDates
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                highlightedDates: nextProps.highlightedDates,
            });
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardBody>
                        <h2>Present Dates</h2>
                        {
                            this.state.highlightedDates.map((item, key) => {
                                return (
                                    <div key={key}>
                                        <i className="fas fa-calendar text-info" />&nbsp;&nbsp;
                                        <span>{new Date(item).toLocaleDateString() + ", " + new Date(item).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                                    </div>
                                )
                            })
                        }

                    </CardBody>
                </Card>
            </div >
        );
    }
}
