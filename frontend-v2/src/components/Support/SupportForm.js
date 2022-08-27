import React from 'react'

import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroup,
    Row,
} from "reactstrap";
import jwt_decode from 'jwt-decode';
import classnames from "classnames";
import CardHeader from 'reactstrap/lib/CardHeader';
import { connect } from 'react-redux';
import { sendEmail } from 'components/EmailJS/email'

const mapStateToProps = (state) => {
    return {
        outletCode: state.outletCode.outletCode
    }
}

class SupportForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            message: '',
            name: jwt_decode(localStorage.getItem('act')).name,
            email: jwt_decode(localStorage.getItem('act')).email,
            company: jwt_decode(localStorage.getItem('act')).outlet.split('-')[0],
            currentOutlet: props.outletCode,
            outlets: jwt_decode(localStorage.getItem('act')).outlets.toString(),
            role: jwt_decode(localStorage.getItem('act')).role,
            msg: '',
            msg2: ''
        }
        this._ismounted = true;
    }

    handleInputChange1 = (e) => {
        this._ismounted && this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = () => {
        if (this.state.message !== '' && this.state.title !== '') {
            sendEmail({ ...this.state })
            this.setState({
                msg: 'Your message was delivered,',
                msg2: ' we will try to work on it.',
                title: '',
                message: ''
            })
        } else {
            this.setState({
                msg: 'Cannot send an empty message,',
                msg2: ' please try to describe the issue.'
            })
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Row className="justify-content-center">
                    <Card className="bg-secondary border-0">
                        <CardHeader className='text-center'>Ask for support</CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                            <Form role="form">

                                <FormGroup
                                    className={classnames({
                                        focused: this.state.title
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <Input
                                            placeholder="Title"
                                            value={this.state.title}
                                            type="text"
                                            onFocus={() => this._ismounted && this.setState({ focusedTitle: true })}
                                            onBlur={() => this._ismounted && this.setState({ focusedTitle: false })}
                                            name="title"
                                            onChange={this.handleInputChange1}
                                        />
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup
                                    className={classnames({
                                        focused: this.state.message
                                    })}
                                >
                                    <InputGroup className="input-group-merge input-group-alternative">
                                        <Input
                                            placeholder="Message"
                                            value={this.state.message}
                                            type="textarea"
                                            onFocus={() =>
                                                this._ismounted && this.setState({ focusedText: true })
                                            }
                                            onBlur={() =>
                                                this._ismounted && this.setState({ focusedText: false })
                                            }
                                            name="message"
                                            onChange={this.handleInputChange1}
                                        />
                                    </InputGroup>
                                </FormGroup>

                                {
                                    this.state.msg !== '' ?
                                        <div>
                                            <span className='text-muted h5'>{this.state.msg}<br />{this.state.msg2}</span>
                                            <br />
                                        </div>
                                        :
                                        null
                                }
                                <div className="text-center">
                                    <Button className="mt-4" color="info" type="button" name="submit" id="submit" onClick={this.handleSubmit}>
                                        <span id="submitText">Submit</span>
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Row>
            </div >
        )
    }
}
export default connect(
    mapStateToProps
)(SupportForm);