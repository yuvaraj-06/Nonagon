import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Row,
  Col,
  Card,
  Collapse,
} from "reactstrap";

import featuresJSON from "jsons/featuresJSON";
import featureList from "jsons/featureList";

// import TimeSelect from "components/Dashboard/TimeSelect";
import { Mixpanel } from "../../../Mixpanel/mixpanel";
import axios from "axios";
import { loginNodeBaseURL } from "ApiURL";
//notifications and timeframeselect
// import VideoStream from "components/HLSStream/VideoStream";
import NotificationsList from "components/Notifications/NotificationsList";
import TimeFrameSelect from "components/TimeFrameSelect/TimeFrameSelect";
import handleDateRange from "utilFunctions/handleDateRange";
// import DisabledCard from "components/DisabledCard/DisabledCard";

// import CountDownTimer from "components/CountdownTimer/CountDownTimer"

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";

import Graph1 from "components/Dashboard/EntryExit/Graph";
// import loadingGIF from "assets/gif/cardsLoading.gif";
// import getDashboardCards from "utilFunctions/getDashboardCards";
// import { getNotOptedFeatures } from "utilFunctions/getNotOptedFeatures";

// import getDashboardLogs from "utilFunctions/getDashboardLogs";
// import CardBody from "reactstrap/lib/CardBody";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletCode: state.outletCode.outletCode,
    companyServices: state.services.companyServices,
    compCode: jwt_decode(state.act.act).company,
    outletTimezone: state.outletCode.outletTimezone,
  };
};

// const requiredTime = 1626095820 - Date.now() / 1000; // use UNIX timestamp in seconds
const requiredTime = -1;

const showStream = {
  show: false,
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date(),
      date =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
    this.state = {
      toggleCollapse: "qualityCards",
      act: props.act,
      name: props.act.name,
      outlet: props.outletCode,
      theme: this.props.theme,
      company: props.act.company,
      time: props.time,
      startDate: "",
      endDate: "",
      //next 3 lines harcode daterange from 1 nov2020 to 1 mar 2021
      // time: 'None',
      // startDate: '2020-10-31T18:30:00.000',
      // endDate: '2021-02-28T18:30:00.000',
      datetime: date,
      daterange: "Loading...",
      showStream: localStorage.getItem("stream")
        ? JSON.parse(localStorage.getItem("stream")).show
        : showStream.show,
      // cards: getDashboardCards(props.companyServices[props.outletCode].services),
      companyServices: props.companyServices,
      timeZone: props.companyServices[props.outletCode]
        ? props.companyServices[props.outletCode].timezone
        : null,
    };
    this._ismounted = true;
    Mixpanel.track("Dashboard Tab", {
      distinct_id: this.props.act.email,
      email: this.props.act.email,
    });
    Mixpanel.time_event("Dashboard Tab Time", {
      distinct_id: this.props.act.email,
      email: this.props.act.email,
    });
  }

  callbackTimeFrame = (startDate, endDate) => {
    this._ismounted &&
      this.setState({ time: "None", startDate: startDate, endDate: endDate });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._ismounted &&
      this.setState({
        act: nextProps.act,
        time: nextProps.time,
        daterange: handleDateRange(nextProps.time, nextProps.outletTimezone),
        outlet: nextProps.outletCode,
        timeZone: nextProps.companyServices[nextProps.outletCode]
          ? nextProps.companyServices[nextProps.outletCode].timezone
          : null,
      });
  }
  showStream = () => {
    this._ismounted &&
      this.setState({
        showStream: this.state.showStream === true ? false : true,
      });
    localStorage.setItem(
      "stream",
      JSON.stringify({ show: !this.state.showStream })
    );
  };

  fetchCompanyServices = (compCode) => {
    axios
      .get(loginNodeBaseURL + `outlets/services/${compCode}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("act")}`,
        },
      })
      .then((res) => {
        this._ismounted &&
          this.setState({
            companyServices: res.data,
          });
        this.props.updateCompanyServices(res.data);
        return res.data;
      })
      .catch((err) => {
        this._ismounted &&
          this.setState({
            errMsg:
              "We are currently facing some issue. Please raise an issue in support tab.",
            loadingMsg:
              "We are currently facing some issue. Please raise an issue in support tab.",
          });
      });
  };

  componentDidMount() {

    if(!window.localStorage.getItem("loaded")){
      window.localStorage.setItem("loaded", true)
      window.location.reload()    
    };

    this._ismounted &&
      this.setState({
        daterange: handleDateRange(this.props.time, this.props.outletTimezone),
      });
    if (!this.props.companyServices[this.props.outletCode])
      this.fetchCompanyServices(this.props.compCode);
  }

  componentWillUnmount() {
    this._ismounted = false;
    Mixpanel.track("Dashboard Tab Time", {
      distinct_id: this.props.act.email,
      email: this.props.act.email,
    });
  }

  render() {
    return (
      <>
        <div className="header bg-info pb-6">
          <Container fluid className="dashboard-tab-container">
            <ErrorBoundary>
              <div className="header-body">
                <Row className="align-items-center py-4">
                  <Col lg="6" xs="7">
                    <Breadcrumb
                      className="d-none d-md-inline-block ml-md-4"
                      listClassName="breadcrumb-links breadcrumb-dark"
                    >
                      <BreadcrumbItem>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <i className="fas fa-home" />
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Dashboard
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem
                        aria-current="page"
                        className="active"
                      ></BreadcrumbItem>
                    </Breadcrumb>
                  </Col>
                  {/* <Col lg="6" xs="6">
                  <a onClick={(e) => this.setState({ showStream: !this.state.showStream })}>
                    <i className="fas fa-bell text-secondary" />
                  </a>
                </Col> */}
                  <Col className="text-right" lg="6" xs="6">
                    <a
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                          showTimeFrameSelect:
                            this.state.showTimeFrameSelect === true
                              ? false
                              : true,
                        });
                      }}
                    >
                      {/* {
                      !this.state.showTimeFrameSelect ?
                        <i className="fas fa-calendar-plus text-secondary" />
                        :
                        <i className="fas fa-calendar-minus text-secondary " />
                    } */}
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        this.showStream();
                      }}
                    >
                      {/* {!this.state.showStream ? (
                        <i className="fas fa-video text-secondary" />
                      ) : (
                        <i className="fas fa-video-slash text-secondary" />
                      )} */}
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {/* <TimeSelect /> */}
                  </Col>
                </Row>

                {this.state.showTimeFrameSelect ? (
                  <Row>
                    <Col className="text-right">
                      <TimeFrameSelect timeCallBack={this.callbackTimeFrame} />
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                {this.state.showStream ? (
                  <Row>
                    <Col sm="12">
                      {/* <VideoStream
                        showStream={true}
                        time={
                          this.state.time === "None" ? "month" : this.state.time
                        }
                        name={this.state.name}
                        company={this.state.company}
                        cams={this.state.cams}
                      /> */}
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                <NotificationsList />

                {/* <Row>
                <Col xs="6" sm="4"></Col>
                <Col xs="6" sm="4">
                  <CountDownTimer />
                </Col>
                <Col xs="6" sm="4"></Col>
              </Row> */}
                {/* show cards here */}
                <Graph1 />
              </div>
            </ErrorBoundary>
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
