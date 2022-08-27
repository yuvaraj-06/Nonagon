import React, { Component } from 'react'

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
    Input,
    Button,
    FormText
} from 'reactstrap'
import CalendarView from './CalendarView';
import EmployeeProfile from "./EmployeeProfile"
import axios from 'axios'
import { nodeBaseURL } from '../../ApiURL'
import FormGroup from 'reactstrap/lib/FormGroup';
import InputGroup from 'reactstrap/lib/InputGroup';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

class ViewAttendance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewemp: false,
            empid: '',
            outlet: jwt_decode(localStorage.getItem('act')).outlet,
            highlightedDates: [],
            errText: ''
        }
        this._ismounted = true;
    }

    handleInputChange = (e) => {
        this._ismounted && this.setState({
            [e.target.name]: e.target.value
        })
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `attendance/list/${nextProps.outlet}/${nextProps.empid}/month`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                if (res.data.length !== 0) {
                    this._ismounted && this.setState({
                        highlightedDates: res.data.map((item, key) => {
                            return item.Date;
                        }),
                        viewemp: true,
                        errText: ''
                    })
                } else {
                    this._ismounted && this.setState({
                        viewemp: false,
                        highlightedDates: [],
                        errText: 'Employee with above ID was not added with us!'
                    })
                }
            })
            .catch(err => {
                this._ismounted && this.setState({
                    errText: 'Invalid Employee ID',
                    viewemp: false
                })
            })
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <div>
                    <Container>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h4">Search using Employee ID</CardTitle>
                                    </CardHeader>
                                    <CardBody >
                                        <Col>
                                            <FormGroup>
                                                <InputGroup>
                                                    <Input
                                                        type="text"
                                                        name="empid"
                                                        value={this.state.empid}
                                                        placeholder="Enter employee id to search"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <FormGroup>
                                            <FormText>{this.state.errText}</FormText>
                                        </FormGroup>
                                        <Col>
                                            <Button
                                                color="info"
                                                type="button"
                                                name="submit"
                                                id="submit"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    this.fetchData(this.state);
                                                }}
                                            >
                                                Search employee attendance
                                            </Button>
                                        </Col>
                                    </CardBody>
                                </Card>
                                {
                                    this.state.viewemp ? <EmployeeProfile empId={this.state.empid} /> : ''
                                }
                            </Col>
                            <Col>
                                {
                                    this.state.viewemp ? <CalendarView highlightedDates={this.state.highlightedDates} /> : ''
                                }
                            </Col>
                        </Row>
                    </Container>
                </div>
                {/* <h2 align='center'>Camera not specified</h2> */}
            </div>
        )
    }
}

export default connect(
    mapStateToProps
)(ViewAttendance)