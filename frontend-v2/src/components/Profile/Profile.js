import React, { Component } from "react";
import Avatar from "react-avatar";
import "./Profile.scss";
import { Card, CardTitle, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { Shine } from "./Shine";

const mapStateToProps = (state) => {
  return {
    outletCode: state.outletCode.outletCode,
    companyServices: state.services.companyServices,
  };
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  componentDidMount() {
    if (this.props.data != null)
      this.setState({
        ...this.props.data,
      });
  }

  render() {
    if (this.props.data != null) {
      return (
        <>
          <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
            Your Profile
            <br />
            <br />
          </CardTitle>
          <div className="profile-page">
            <Row>
              <Col lg={6} md={12}>
                <div className="profile-card-1">
                  <Row>
                    <Col className="main">
                      <Avatar
                        name={this.props.data.company}
                        maxInitials={2}
                        className="avatar"
                        unstyled
                      />
                      <div className="title ml-4">
                        <div className="name">{this.props.data.name}</div>
                        <div className="company">{this.props.data.company}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="email">
                      Email Id: &nbsp;
                      <span className="">{this.props.data.email}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="role">
                      Role: &nbsp;
                      <span className="">{this.props.data.role}</span>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div className="profile-card-2">
                  <Row>
                    <Col className="title">
                      Outlets &nbsp;
                      <span>({this.props.data.outlets.length})</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="outlets">
                      {this.props.data.outlets.map((outlet, key) => {
                        return (
                          <>
                            <div key={key}>{outlet}</div>
                          </>
                        );
                      })}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </>
      );
    } else {
      return (
        <>
          <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
            Your Profile
            <br />
            <br />
          </CardTitle>
          <div className="profile-page-psudo">
            <Shine />
            <Row>
              <Col lg={6} md={12}>
                <div className="profile-card-1">
                  <Row>
                    <Col className="main">
                      <Avatar
                        name="‎ㅤㅤㅤ"
                        maxInitials={2}
                        className="avatar"
                        unstyled
                      />
                      <div className="title ml-4">
                        <div className="name">
                          {"ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ"}
                        </div>
                        <div className="company">{"ㅤㅤㅤ"}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="email">
                      Email Id: &nbsp;
                      <span className="">{"ㅤㅤㅤㅤㅤㅤㅤ"}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="role">
                      Role: &nbsp;
                      <span className="">{"ㅤㅤㅤㅤㅤㅤ"}</span>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div className="profile-card-2">
                  <Row>
                    <Col className="title">Outlets &nbsp;</Col>
                  </Row>
                  <Row>
                    <Col className="outlets">
                      <div>{"ㅤㅤㅤㅤㅤㅤㅤㅤ"}</div>
                      <div>{"ㅤㅤㅤㅤㅤㅤㅤㅤ"}</div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </>
      );
    }
  }
}

export default connect(mapStateToProps)(Profile);
