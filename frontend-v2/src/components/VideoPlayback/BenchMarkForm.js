import React, { Component } from "react";
import "rc-slider/assets/index.css";
import Slider, { SliderTooltip } from "rc-slider";
import ReactPlayer from "react-player";
import {
  Row,
  Col,
  Button,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Media,
  Input,
} from "reactstrap";
import axios from "axios";
import { nodeBaseURL } from "ApiURL";
import { NotifyWrapper } from "components/Alerts/Notify";
import { connect } from "react-redux";

import "./VideoPlayback.scss";
import Card from "reactstrap/lib/Card";
import moment from "moment";
import jwt_decode from "jwt-decode";

import emailjs, { init } from "emailjs-com";
init("user_Fn8g82oHikPuVMh8M2wOm");

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    companyServices: state.services.companyServices,
    act: jwt_decode(state.act.act),
  };
};

class BenchMarkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outletCode: props.outlet,
      location:
        props.companyServices[Object.keys(props.companyServices)[0]]
          .outlet_location,
      toggleOverlay: false,
      selectedHourToDisplay: 0,
      isToolActive: false,
      moveButtons: {
        start: 0,
        end: 10,
      },
      hourList: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      selectedHour: 10,
    };
    this._ismounted = true;
  }

  componentDidMount() {
    console.log("gggggggggggggg", this.props.act);
    let localData = JSON.parse(localStorage.getItem("benchMarkData"));
    if (localData != null) {
      if (localData.isSubmitted == true) {
        this.setState({
          toggleOverlay: true,
          selectedHourToDisplay: localData.selectedHour,
        });
        //   if (
        //     (new Date().getHours() == localData.selectedHour + 1 &&
        //       new Date().getMinutes() >= 50) ||
        //     new Date().getHours() > localData.selectedHour + 1
        //   ) {
        //     this.setState({
        //       isToolActive: true,
        //     });
        //   } else {
        //     this.setState({
        //       isToolActive: false,
        //     });
        //   }
        // }
      } else {
      }
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  setManualData() {}

  sendEmail() {
    if (localStorage.getItem("rootState")) {
      var accountData = JSON.parse(localStorage.getItem("rootState"));
      var companyName = accountData.name;
      var companyEmail = accountData.email;
    }
    let emailData = {
      outletCode: this.state.outletCode,
      outletLocation: this.state.location,
      timeFrame: `${this.state.selectedHour}:00 - ${
        this.state.selectedHour + 1
      }:00`,
      date: moment().format("Do MMM, YYYY"),
      companyName: companyName,
      companyEmail: companyEmail,
    };

    emailjs.send("service_lz1rwss", "template_qa3znfl", emailData);
    this.setState({
      toggleOverlay: true,
      selectedHourToDisplay: this.state.selectedHour,
    });
    localStorage.setItem(
      "benchMarkData",
      JSON.stringify({
        isSubmitted: true,
        selectedHour: this.state.selectedHour,
      })
    );
  }

  render() {
    return (
      <Card className="bnch-form">
        <div className="title">Schedule Benchmark Test</div>
        {this.state.toggleOverlay ? (
          <Container className="form-container">
            <Row>
              <Col>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Thank you for Scheduling you Benchmarking Test. Your Benchmark
                  Timings have been noted.
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div
                  style={{
                    fontSize: "1.5rem",
                    margin: "1.4rem 0 2rem",
                    fontWeight: "600",
                  }}
                >
                  {`Please Checkback At ${(this.state.selectedHourToDisplay + 1)
                    .toString()
                    .padStart(2, 0)}:30`}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>To test the previous footage click on the button below</Col>
            </Row>
            <Row>
              <Col className="pt-5">
                <Button
                  onClick={() => {
                    this.props.toogleTool();
                  }}
                >
                  Go To Tool
                </Button>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container className="form-container">
            <Row>
              <Col>
                <span>Select Your Time Slot: </span>
                <UncontrolledDropdown>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media>
                      <Button size="sm">
                        Hour {this.state.selectedHour}:00 to{" "}
                        {this.state.selectedHour + 1}:00&nbsp;&nbsp;
                        <i className="fas fa-chevron-down text-primary"></i>
                      </Button>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.hourList.map((item, index) => {
                      return (
                        <div key={index}>
                          <DropdownItem
                            onClick={(e) => {
                              e.preventDefault();
                              this._ismounted &&
                                this.setState({ selectedHour: item });

                              console.log(this.state);
                            }}
                          >
                            Hour {item}:00 to {item + 1}:00
                          </DropdownItem>
                        </div>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={() => this.sendEmail()} className="submit-btn">
                  Schedule Test
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className="pt-5">
                To test the previous footage click on the button below
              </Col>
            </Row>
            <Row>
              <Col className="pt-5">
                <Button
                  onClick={() => {
                    this.props.toogleTool();
                  }}
                >
                  Go To Tool
                </Button>
              </Col>
            </Row>
          </Container>
        )}
      </Card>
    );
  }
}

export default connect(mapStateToProps)(BenchMarkForm);
