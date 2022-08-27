import React from "react";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";

// reactstrap components
import {
    FormGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col,
    Row
} from "reactstrap";

class Datepicker extends React.Component {
    state = {
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now(0))
    };
    render() {
        return (
            <>
                <Row>
                    <Col xs='6' sm='4'></Col>
                    <Col xs='6' sm='4' className='text-right'>
                        <FormGroup>
                            <InputGroup className="input-group-alternative info" size='sm'>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                    inputProps={{
                                        placeholder: "Select Start Date"
                                    }}
                                    timeFormat={false}
                                    renderDay={(props, currentDate, selectedDate) => {
                                        let classes = props.className;
                                        if (
                                            this.state.startDate &&
                                            this.state.endDate &&
                                            this.state.startDate._d + "" === currentDate._d + ""
                                        ) {
                                            classes += " start-date";
                                        } else if (
                                            this.state.startDate &&
                                            this.state.endDate &&
                                            new Date(this.state.startDate._d + "") <
                                            new Date(currentDate._d + "") &&
                                            new Date(this.state.endDate._d + "") >
                                            new Date(currentDate._d + "")
                                        ) {
                                            classes += " middle-date";
                                        } else if (
                                            this.state.endDate &&
                                            this.state.endDate._d + "" === currentDate._d + ""
                                        ) {
                                            classes += " end-date";
                                        }
                                        return (
                                            <td {...props} className={classes}>
                                                {currentDate.date()}
                                            </td>
                                        );
                                    }}
                                    onChange={e => {
                                        this.setState({ startDate: e })
                                        this.props.timeCallBack(new Date(e ? e : new Date(Date.now())).toISOString(), new Date(this.state.endDate ? this.state.endDate : new Date(Date.now())).toISOString())
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col sm='4' className='text-right'>
                        <FormGroup>
                            <InputGroup className="input-group-alternative" size='sm'>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                    inputProps={{
                                        placeholder: "Select End Date"
                                    }}
                                    timeFormat={false}
                                    renderDay={(props, currentDate, selectedDate) => {
                                        let classes = props.className;
                                        if (
                                            this.state.startDate &&
                                            this.state.endDate &&
                                            this.state.startDate._d + "" === currentDate._d + ""
                                        ) {
                                            classes += " start-date";
                                        } else if (
                                            this.state.startDate &&
                                            this.state.endDate &&
                                            new Date(this.state.startDate._d + "") <
                                            new Date(currentDate._d + "") &&
                                            new Date(this.state.endDate._d + "") >
                                            new Date(currentDate._d + "")
                                        ) {
                                            classes += " middle-date";
                                        } else if (
                                            this.state.endDate &&
                                            this.state.endDate._d + "" === currentDate._d + ""
                                        ) {
                                            classes += " end-date";
                                        }
                                        return (
                                            <td {...props} className={classes}>
                                                {currentDate.date()}
                                            </td>
                                        );
                                    }}
                                    onChange={e => {
                                        this.setState({ endDate: e })
                                        this.props.timeCallBack(new Date(this.state.startDate ? this.state.startDate : new Date(Date.now())).toISOString(), new Date(e ? e : new Date(Date.now())).toISOString())
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>
                {/* <br></br> */}
                {/* <Row>&nbsp;&nbsp;&nbsp;&nbsp;<h3>{new Date(this.state.startDate ? this.state.startDate : new Date(Date.now())).toISOString() + " to " + new Date(this.state.endDate ? this.state.endDate : new Date(Date.now())).toISOString()}</h3></Row> */}
            </>
        );
    }
}

export default Datepicker;