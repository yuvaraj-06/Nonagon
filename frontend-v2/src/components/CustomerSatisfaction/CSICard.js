import React, { Component } from "react";

import {
  Card,
  CardBody,
  Row,
  CardTitle,
  Col,
  Modal,
  Button,
  Tooltip,
} from "reactstrap";

import axios from "axios";
import handleDateRange from "utilFunctions/handleDateRange";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import { nodeBaseURL } from "ApiURL";
import Chart from "./Chart";
import happy from "assets/img/emoji/happy.png";
import sad from "assets/img/emoji/sad.png";
import angry from "assets/img/emoji/angry.png";
import confused from "assets/img/emoji/confused.png";
import disgusted from "assets/img/emoji/disgusted.png";
import surprised from "assets/img/emoji/surprised.png";
import calm from "assets/img/emoji/calm.png";
import fear from "assets/img/emoji/fear.png";

import "./CSICard.scss";
import { Link } from "react-router-dom";
const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outlet: state.outletCode.outletCode,
    outletTimezone: state.outletCode.outletTimezone
  };
};

const emojiList = {
  HAPPY: happy,
  SAD: sad,
  ANGRY: angry,
  CONFUSED: confused,
  DISGUSTED: disgusted,
  SURPRISED: surprised,
  CALM: calm,
  FEAR: fear,
};

const getTop3EmotionsList = (apiData) => {
  var objKeys = Object.keys(apiData);
  var listOfEmotionsDescSort = objKeys
    .map((item) => {
      return {
        key: item,
        value: apiData[item],
        emoji: emojiList[item],
      };
    })
    .sort((a, b) => {
      return b.value - a.value;
    });
  return listOfEmotionsDescSort.slice(0, 3);
};

class CSICard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      time: props.time,
      daterange: handleDateRange(props.time, props.outletTimezone),
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      emotionData: {},
      tooltipOpen: false,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customer_emotions/aggregate/${nextProps.outlet}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this.setState({ emotionData: res.data });
        })
        .catch(console.log);
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted &&
        this.setState({
          time: nextProps.time,
          daterange: handleDateRange(nextProps.time, nextProps.outletTimezone),
          outlet: nextProps.outlet,
        });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  toggleModal = (state) => {
    this._ismounted &&
      this.setState({
        [state]: !this.state[state],
      });
  };
  toggleTooltip = () => {
    this._ismounted &&
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
      });
  };

  render() {
    return (
      <Card className="card-stats">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Customer Emotions
              </CardTitle>
              <div>
                <Row className="mt-4 mb-2">
                  {getTop3EmotionsList(this.state.emotionData).map(
                    (item, index) => {
                      return (
                        <Col
                          md="4"
                          className="d-flex align-items-center"
                          key={index}
                        >
                          <span className="h1 m-0 text-red">
                            <img alt='' src={item.emoji} width='25px'></img></span>
                          <p style={{ margin: "2px 0 0 5px" }} className="h4">
                            {Object.values(this.state.emotionData).reduce(
                              (a, b) => a + b,
                              0
                            ) > 0
                              ? (
                                (item.value /
                                  Object.values(
                                    this.state.emotionData
                                  ).reduce((a, b) => a + b, 0)) *
                                100
                              ).toFixed(0)
                              : 0}
                            %
                          </p>
                        </Col>
                      );
                    }
                  )}
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-smile" />
              </div>
            </Col>
          </Row>

          <div className="mt-2 mb-0 text-sm">
            <Row>
              <div className="pt-1">
                <Button
                  color="secondary"
                  outline
                  type="button"
                  size="sm"
                  onClick={() => this.toggleModal("exampleModal")}
                >
                  <span className="text-info">
                    <i className="fa fa-question-circle" /> Learn More
                  </span>{" "}
                </Button>
                <Link to='/admin/customer-emotions'>
                  <Button
                    // className="disabled-modal"
                    color="secondary"
                    outline
                    type="button"
                    size="sm"
                  >
                    <span className="text-info">
                      <i className="fas fa-paper-plane" /> Go To Page
                    </span>{" "}
                  </Button>
                </Link>
              </div>
              <Col>
                <div className="explr-i" id="explr-tooltip">
                  <i className=" fas fa-info" />
                </div>
                <Tooltip
                  placement="top-start"
                  isOpen={this.state.tooltipOpen}
                  target="explr-tooltip"
                  toggle={() => this.toggleTooltip()}
                >
                  The AI monitors the emotion of the customer visiting the store
                  provided the customer's face is clearly visible in the CCTV
                </Tooltip>
              </Col>
            </Row>
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state.exampleModal}
              toggle={() => this.toggleModal("exampleModal")}
              size="lg"
            >
              <div className="modal-header">
                <span>
                  <h4 className="modal-title" id="exampleModalLabel">
                    Customer Sentiment
                  </h4>
                  <br />
                  <h4 className="h4 text-muted">({this.state.daterange})</h4>
                </span>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("exampleModal")}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <Chart />
              </div>
            </Modal>
          </div>
        </CardBody>
      </Card>
    );
  }
}

//export default PeopleCount;

export default connect(mapStateToProps)(CSICard);
