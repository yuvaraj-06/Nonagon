import React from 'react';

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
  Row,
} from "reactstrap";
import jwt_decode from 'jwt-decode';
import qs from 'qs';
import classnames from "classnames";
import axios from 'axios';
import { notificationURL } from '../../ApiURL';
import CardHeader from 'reactstrap/lib/CardHeader';

class OnboardingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      company: jwt_decode(localStorage.getItem('act')).outlet.split('-')[0],
      fetchedOutlets: [],
      outlets: [],
      role: 'operator',
      ErrorMsg: 'Loading...'
    };
    this._ismounted = true;
  }

  handleInputChange1 = (e) => {
    this._ismounted && this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleInputChange = (e) => {
    if (e.target.value !== 'operator') {
      this._ismounted && this.setState({
        [e.target.name]: e.target.value,
        outlets: []
      });
    } else {
      this._ismounted && this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  handleSubmit = async () => {
    let text = document.getElementById('submitText');
    text.innerText = 'Loading...';
    var data = qs.stringify({
      'name': this.state.name,
      'email': this.state.email,
      'company': this.state.company,
      'role': this.state.role,
      'outlets': this.state.outlets.toString(),
      'password': 'nonagon',
      'password_re': 'nonagon'
    });

    var config = {
      method: 'post',
      url: `${notificationURL}users/new`,
      headers: {
        'Authorization': `bearer ${localStorage.getItem('act')}`
      },
      data: data
    };

    await axios(config)
      .then(res => {
        if (res.data.name === this.state.name) {
          this._ismounted && this.setState({
            ErrorMsg: `User Onboarded Successfully`,
            name: '',
            email: '',
            outlets: []
          });
        } else if (res.data.detail) {
          this._ismounted && this.setState({
            ErrorMsg: res.data.detail
          });
        }
        text.innerText = "Submit";
      })
      .catch(err => {
        text.innerText = 'Submit';
        this._ismounted && this.setState({
          ErrorMsg: "Something went wrong. Please try again!"
        });
      });
  };

  fetchData = (nextProps) => {
    axios.get(
      notificationURL +
      `outlets/list/${nextProps.company}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`
        }
      }
    )
      .then((res) => {
        this._ismounted && this.setState({
          fetchedOutlets: res.data,
          ErrorMsg: ""
        });
      })
      .catch(err => {
        this._ismounted && this.setState({
          ErrorMsg: "Unable to Find Outlets"
        });
      });
  };

  handleCheckBox = (e) => {
    this.setState({ outlets: [...this.state.outlets, e.target.value] });
    // console.log([...this.state.outlets, e.target.value])
  };

  componentDidMount() {
    this.fetchData(this.state);
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   this.fetchData(this.state)
  // }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <Card className="bg-secondary border-0">
            <CardHeader className='text-center'>Onboard new Person</CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup
                  className={classnames({
                    focused: this.state.name
                  })}
                >
                  <InputGroup className="input-group-merge input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-user text-primary" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Name"
                      value={this.state.name}
                      type="text"
                      onFocus={() => this._ismounted && this.setState({ focusedName: true })}
                      onBlur={() => this._ismounted && this.setState({ focusedName: false })}
                      name="name"
                      onChange={this.handleInputChange1}
                    />
                  </InputGroup>
                </FormGroup>


                <FormGroup
                  className={classnames({
                    focused: this.state.contact_name
                  })}
                >
                  <InputGroup className="input-group-merge input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-envelope text-primary" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      value={this.state.email}
                      type="email"
                      onFocus={() =>
                        this._ismounted && this.setState({ focusedPassword: true })
                      }
                      onBlur={() =>
                        this._ismounted && this.setState({ focusedPassword: false })
                      }
                      name="email"
                      onChange={this.handleInputChange1}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-merge input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-badge text-primary" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="select"
                      placeholder="Role"
                      name="role"
                      value={this.state.role}
                      position={this.state.role}
                      onFocus={() => this._ismounted && this.setState({ focusedRole: true })}
                      onBlur={() => this._ismounted && this.setState({ focusedRole: false })}
                      onChange={this.handleInputChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="operator">Operator</option>
                    </Input>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <span className='h4'>Select Notification Profile</span>
                </FormGroup>

                {
                  this.state.role === 'operator' ?
                    this.state.fetchedOutlets.map((item, key) => {
                      return (
                        <div key={key}>
                          <FormGroup
                            className={classnames({
                              focused: this.state.name
                            })}
                          >
                            <div className="ml-3">
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <Input
                                type="checkbox"
                                value={item}
                                onFocus={() => this._ismounted && this.setState({ focusedOutlets: true })}
                                onBlur={() => this._ismounted && this.setState({ focusedOutlets: false })}
                                name={item}
                                onChange={this.handleCheckBox}
                              />
                              {item}

                            </div>
                          </FormGroup>
                        </div>
                      );
                    })
                    :
                    this.state.role === 'admin' || this.state.role === 'manager' || this.state.role === '' ?
                      < FormGroup
                        className={classnames({
                          focused: this.state.name
                        })}
                      >
                        <div className="ml-3">
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <Input
                            type="checkbox"
                            value={"manager"}
                            onFocus={() => this._ismounted && this.setState({ focusedOutlets: true })}
                            onBlur={() => this._ismounted && this.setState({ focusedOutlets: false })}
                            name={"manager"}
                            onChange={this.handleCheckBox}
                          />
                          {"Manager"}

                        </div>
                      </FormGroup>
                      :
                      ''
                }
                <>
                  <center>{this.state.ErrorMsg}</center>
                </>

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
    );
  }
}
export default OnboardingForm;