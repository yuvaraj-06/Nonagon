import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import qs from 'qs';
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
import { Mixpanel } from '../../../Mixpanel/mixpanel';
import { loginNodeBaseURL } from '../../../ApiURL';

import { connect } from 'react-redux';
import { updateRoutes, updateAct, updateOutletCode } from '../../../redux';

//sidebar components
import { getRoutesArray } from 'routes/routesArray';

import jwt_decode from "jwt-decode";

//mapping redux store and Dispatch to props
const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    routes: state.routes.routes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateRoutes: (payload) => {
      dispatch(updateRoutes(payload));
    },
    updateAct: (payload) => {
      dispatch(updateAct(payload));
    },
    updateOutletCode: (payload) => {
      dispatch(updateOutletCode(payload));
    }
  };
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      ErrorMsg: '',
      redirect: ""
    };
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleInputChange = (e) => {
    this._ismounted && this.setState({
      [e.target.name]: e.target.value
    });
  };

  reloadApp = () => {
    return JSON.parse(localStorage.getItem('rootState')) ? "" : window.location.reload();
  };

  handleSubmit = async () => {
    let text = document.getElementById('submitText');
    text.innerText = 'Logging you in...';
    var data = qs.stringify({
      'email': this.state.email,
      'password': this.state.password
    });
    var config = {
      method: 'post',
      url: `${loginNodeBaseURL}auth/login`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      data: data
    };
    await axios(config)
      .then(response => {
        const user = jwt_decode(response.data.access_token);
        if (!user.initial_login) {
          if (user.company !== undefined) {
            this.props.Auth.authenticate(() => {
              this.props.loadUser(user);
              this._ismounted && this.setState({
                ErrorMsg: ""
              });
              text.innerText = 'Login';
              this.props.history.push('/admin/dashboard');
            });
            this.props.updateRoutes(getRoutesArray(user.services));
            this.props.updateOutletCode({
              outletCode: user.outlets[0],
              outletTimezone: user.timezone
            });
            this.props.updateAct(response.data.access_token);
            localStorage.setItem('act', response.data.access_token);
            Mixpanel.people.set('creating new user', {
              distinct_id: this.state.email
            });
            Mixpanel.track('Successful login', {
              distinct_id: localStorage.getItem('act').email,
              email: jwt_decode(localStorage.getItem('act')).email
            });
            Mixpanel.time_event('Track Dashboard Time', {
              distinct_id: localStorage.getItem('act').email,
              email: jwt_decode(localStorage.getItem('act')).email
            });
          } else {
            text.innerText = "Login";
            Mixpanel.track('Unsuccessful login', { email: this.state.email });
            this._ismounted && this.setState({
              ErrorMsg: "Incorrect Email/Password. Please Try Again"
            });
          }
        } else if (user.initial_login) {
          text.innerText = "Login";
          this._ismounted && this.setState({
            ErrorMsg: "You need to reset your password!",
            redirect: '/auth/reset'
          });
        }

      })
      .catch(err => {
        console.warn("Error: ", err);
        text.innerText = 'Login';
        this._ismounted && this.setState({
          ErrorMsg: 'Incorrect Email/Password. Please Try Again'
        });
        console.warn("Error: ", this.state.ErrorMsg);
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <AuthHeader
          title="Welcome!"
          tag="Bringing Cameras to Life!"
          lead="Login to see AI revolutionize your workspace."
        />
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className="bg-secondary border-0 mb-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>Log in with credentials</small>
                  </div>
                  <Form role="form" onSubmit={this.handleSubmit}>
                    <FormGroup
                      className={classnames("mb-3", {
                        focused: this.state.focusedEmail
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email"
                          type="email"
                          name="email"
                          onFocus={() => this._ismounted && this.setState({ focusedEmail: true })}
                          onBlur={() => this._ismounted && this.setState({ focusedEmail: false })}
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
                          name="password"
                          onFocus={() =>
                            this._ismounted && this.setState({ focusedPassword: true })
                          }
                          onBlur={() =>
                            this._ismounted && this.setState({ focusedPassword: false })
                          }
                          onChange={this.handleInputChange}
                          onKeyDown={(e) => { if (e.keyCode === 13) { this.handleSubmit(); } }}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="my-4" color="info" type="button" onClick={this.handleSubmit}>
                        <span id="submitText">
                          Log in
                        </span>
                      </Button>
                    </div>
                    {`${this.state.ErrorMsg}`}
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                {/* <Col xs="6">
                  <a
                    className="text-light"
                    href={"reset"}
                  >
                    <small>Forgot password?</small>
                  </a>
                </Col> */}
                {/* <Col className="text-right" xs="6">
                  <a
                    className="text-light"
                    href="/register"
                    onClick={e => e.preventDefault()}
                  >
                    <small>Create new account</small>
                  </a>
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
