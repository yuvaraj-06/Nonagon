import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import qs from 'qs';
import jwt_decode from 'jwt-decode';
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
import { Mixpanel } from "../../../Mixpanel/mixpanel";
import { loginNodeBaseURL } from '../../../ApiURL';
import axios from 'axios';
class Reset extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      oldPassword: '',
      newPassword: '',
      ErrorMsg: '',
    };
    this._ismounted = true;
  }

  handleInputChange = (e) => {
    this._ismounted && this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async () => {
    let text = document.getElementById('submitText');
    text.innerText = 'Loading...';
    var data = qs.stringify({
      'email': this.state.email,
      'old_password': this.state.oldPassword,
      'new_password': this.state.newPassword
    });
    var config = {
      method: 'post',
      url: `${loginNodeBaseURL}auth/password/change`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };
    await axios(config)
      .then(response => {
        const user = jwt_decode(response.data.access_token);
        if (user.company !== undefined) {
          localStorage.setItem('act', response.data.access_token);
          this.props.Auth.authenticate(() => {
            this.props.loadUser(user);
            this._ismounted && this.setState({
              ErrorMsg: ""
            });
            text.innerText = 'Reset Password';
            Mixpanel.track('New user password reset', { distinct_id: jwt_decode(localStorage.getItem('act')).email });
            this.props.history.push('/admin/dashboard');
          });
        } else {
          this._ismounted && this.setState({
            ErrorMsg: "Incorrect Email/Password."
          });
        }
        text.innerText = "Reset Password";
      })
      .catch(err => {
        text.innerText = 'Reset Password';
        this._ismounted && this.setState({
          ErrorMsg: "Incorrect Email/Password. Please Try Again"
        });
      });
  };

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <>
        <AuthHeader
          title="Reset your password here since you are logging in for the first time."
          tag=""
          lead=""
        />
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className="bg-secondary border-0 mb-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>Reset password with old credentials</small>
                  </div>
                  <Form role="form">
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
                          placeholder="Old Password"
                          type="password"
                          name="oldPassword"
                          onFocus={() =>
                            this._ismounted && this.setState({ focusedPassword: true })
                          }
                          onBlur={() =>
                            this._ismounted && this.setState({ focusedPassword: false })
                          }
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
                          placeholder="Create New Password"
                          type="password"
                          name="newPassword"
                          onFocus={() =>
                            this._ismounted && this.setState({ focusedPassword: true })
                          }
                          onBlur={() =>
                            this._ismounted && this.setState({ focusedPassword: false })
                          }
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="my-4" color="info" type="button" onClick={this.handleSubmit}>
                        <span id="submitText">
                          Reset Password
                        </span>
                      </Button>
                    </div>
                    {`${this.state.ErrorMsg}`}
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

export default Reset;
