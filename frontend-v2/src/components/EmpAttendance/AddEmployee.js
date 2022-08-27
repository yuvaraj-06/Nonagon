import React, { Component } from 'react'
import axios from 'axios'
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row
} from "reactstrap";

import { nodeBaseURL } from '../../ApiURL';
import classnames from "classnames";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

class OnboardingForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ErrorMsg: '',
            name: '',
            outlet: props.act.outlet,
            employeeid: "",
            mobNo: "",
            address: "",
            position: '',
            email: ""
        }
        this._ismounted = true;
    }

    handleInputChange = (e) => {
        this._ismounted && this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async () => {
        let text = document.getElementById('submitText')
        text.innerText = 'Adding Employee...'
        var config = {
            method: 'post',
            url: `${nodeBaseURL}employee/new/${this.state.employeeid}/${this.state.name}/${this.state.position}/${this.state.outlet}?address=${this.state.address}&mobile_no=${this.state.mobNo}&email=${this.state.email}`,
            headers: {
                'Authorization': `bearer ${localStorage.getItem('act')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        await axios(config)
            .then(res => {
                if (res.status === 200) {
                    this._ismounted && this.setState({
                        ErrorMsg: `${res.data.name} Onboarded Successfully`,
                        name: '',
                        outlet: this.props.act.outlet,
                        employeeid: "",
                        mobNo: "",
                        address: "",
                        position: '',
                        email: ""
                    })
                }
                text.innerText = 'Add Employee'
            })
            .catch(err => {
                text.innerText = 'Add Employee'
                this._ismounted && this.setState({
                    ErrorMsg: "Something went wrong. Please try again!"
                })
            })
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <Row className="justify-content-center">
                    <Card className="bg-secondary border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                            <div className="text-center text-muted mb-4">
                                <small>Add new employee</small>
                            </div>
                            <Form role="form">
                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedName
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="far fa-user" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Name"
                                            value={this.state.name}
                                            type="text"
                                            onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                                            name="name"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedName
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="far fa-envelope" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Email"
                                            value={this.state.email}
                                            type="email"
                                            onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                                            name="email"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedName
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fas fa-user-tag" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Position"
                                            value={this.state.position}
                                            type="text"
                                            onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                                            name="position"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedName
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-badge" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Employee ID"
                                            value={this.state.employeeid}
                                            type="text"
                                            onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                                            name="employeeid"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedName
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fas fa-phone-alt" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Mobile Number"
                                            type="tel"
                                            value={this.state.mobNo}
                                            onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                                            name="mobNo"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup
                                    className={classnames({
                                        focused: this.state.focusedEmail
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fas fa-map-marker-alt" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Employee Address"
                                            value={this.state.address}
                                            type="text"
                                            onFocus={() => this._ismounted && this.setState({ focusedEmail: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedEmail: false })}
                                            name="address"
                                            onChange={this.handleInputChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <>
                                    {this.state.ErrorMsg}
                                </>
                                <div className="text-center">
                                    <Button className="mt-4" color="info" type="button" name="submit" id="submit" onClick={this.handleSubmit}>
                                        <span id="submitText">
                                            Add {this.state.name} as new employee
                                        </span>
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Row>
            </>
        )
    }
}

//export default OnboardingForm

export default connect(
    mapStateToProps,
)(OnboardingForm);