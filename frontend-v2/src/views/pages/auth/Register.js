import React from "react";
import axios from 'axios'
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
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
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
import { loginNodeBaseURL } from '../../../ApiURL';

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ErrorMsg: '',
      name: '',
      outlet: '',
      position: '',
      email: '',
      password: ''
    }
    this._ismounted = true;
    Mixpanel.track('Register Page', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }

  handleInputChange = (e) => {
    this._ismounted && this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    let text = document.getElementById('submitText')
    text.innerText = 'Loading...'
    this._ismounted && axios.post(
      loginNodeBaseURL + 'signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.password,
        outlet: this.state.outlet,
        position: this.state.position
      },
        {
          headers: {
            'Authorization': `bearer ${localStorage.getItem('act')}`
          }
        }
      )
    })
      .then(response => response.json())
      .then(user => {
        if (user.userCreated) {
          this.props.Auth.authenticate(() => {
            this.props.loadUser(user)
            this._ismounted && this.setState({
              ErrorMsg: ""
            })
            text.innerText = 'Create Account'
            this.props.history.push('/admin/dashboard')
          })
        } else {
          this._ismounted && this.setState({
            ErrorMsg: "Incorrect Email/Password. Please Try Again"
          })
        }
        text.innerText = "Create Account"
      })
      .catch(err => {
        text.innerText = 'Create Account'
        //this.SetMsg("Incorrect Email/Password. Please Try Again")
        this._ismounted && this.setState({
          ErrorMsg: "Incorrect Email/Password. Please Try Again"
        })
      })
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <>
        <AuthHeader
          title="Create an account"
          lead="To get your company code please contact us at crm@nonagon.ai."
        />
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Col lg="6" md="8">
              <Card className="bg-secondary border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>Sign up with credentials</small>
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
                            <i className="ni ni-hat-3" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Name"
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
                            <i className="ni ni-shop" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Company Name"
                          type="text"
                          onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                          name="compName"
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
                            <i className="ni ni-key-25" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Outlet Code"
                          type="text"
                          onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                          name="outlet"
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
                            <i className="ni ni-map-big" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Company Location"
                          type="text"
                          onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                          name="compLocation"
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
                            <i className="ni ni-key-25" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Company Location Code"
                          type="text"
                          onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                          name="compLocationCode"
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
                          placeholder="Position"
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
                        focused: this.state.focusedEmail
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email"
                          type="email"
                          onFocus={() => this._ismounted && this.setState({ focusedEmail: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedEmail: false })}
                          name="email"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup
                      className={classnames({
                        focused: this.state.focusedPassword
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="password"
                          onFocus={() =>
                            this._ismounted && this.setState({ focusedPassword: true })
                          }
                          onBlur={() =>
                            this._ismounted && this.setState({ focusedPassword: false })
                          }
                          name="password"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                    </FormGroup>


                    <Row className="my-4">
                      <Col xs="12">
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input
                            className="custom-control-input"
                            id="customCheckRegister"
                            type="checkbox"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckRegister"
                          >
                            <span className="text-muted">
                              I agree with the{" "}
                              <a
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                Privacy Policy
                              </a>
                            </span>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button className="mt-4" color="info" type="button" name="submit" id="submit" onClick={this.handleSubmit}>
                        <span id="submitText">
                          Create account
                        </span>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Register;
