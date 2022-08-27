import React from "react";
import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";
import { Card, CardBody, Row, Col } from "reactstrap";
import Container from "reactstrap/lib/Container";

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        today: 0.0,
        yesterday: 0.0,
        weekAvg: 0.0,
        msg1: "Loading...",
        msg2: "Loading...",
      },
    };
    this._ismounted = true;
  }

  getData = (featureObject) => {
    axios
      .get(
        nodeBaseURL + `${featureObject.path}/${this.props.outletCode}/week`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("act")}`,
          },
        }
      )
      .then((res) => {
        this._ismounted &&
          this.setState({
            data: featureObject.funtionName(res),
          });
      })
      .catch((err) => {
        this._ismounted &&
          this.setState({
            data: {
              today: 0,
              yesterday: 0,
              weekAvg: 0,
              msg1: "We are facing some error while displaying this feature.",
              msg2: "We are facing some error while displaying this feature.",
            },
          });

      });
  };

  componentDidMount() {
    this._ismounted && this.getData(this.props.data);
  }

  render() {
    return (
      <Card className="col">
        <CardBody className="summary-card-main">
          <div className="summary-card-title">
            <i className="fas fa-fire" />
            {this.props.data.featureName}
          </div>
          {/* =============== Today - Yesterday =============== */}
          <Row className="summary-data">
            <Col className="data-box">
              {this.state.data.msg1}
              <span className="data-prcntg">
                {this.state.data.today !== this.state.data.yesterday
                  ? ((Math.abs(
                    this.state.data.today - this.state.data.yesterday
                  ) *
                    100) /
                    this.state.data.yesterday).toFixed(0) + "%"
                  : ""}
                .
              </span>
            </Col>
          </Row>

          <Container className="today-container">
            <Row className="summary-data sum-container today-card">
              <Col xs={5} className="today-card">
                <div className="sum-title">
                  <i className="fas fa-circle" />
                  Today
                </div>
              </Col>

              <Col xs={7} className="today-card">
                <div className="sum-title">
                  <i className="fas fa-circle" />
                  Yesterday
                </div>
              </Col>
            </Row>

            <Row className="summary-data sum-container">
              <Col xs={5} className="today-card">
                <div className="sum-data">
                  {this.state.data.today}
                  {this.state.data.today < this.state.data.yesterday ? (
                    <i className="fas fa-angle-double-down down"></i>
                  ) : this.state.data.today > this.state.data.yesterday ? (
                    <i className="fas fa-angle-double-up up"></i>
                  ) : (
                    <i className="fas fa-equals equal"></i>
                  )}
                </div>
              </Col>

              <Col xs={7} className="today-card">
                <div className="sum-data">{this.state.data.yesterday}</div>
              </Col>
            </Row>
          </Container>
          <hr />
          {/* =============== Today - Week Avg =============== */}
          <Row className="summary-data">
            <Col className="data-box">
              {this.state.data.msg2}
              <span className="data-prcntg">
                {this.state.data.today !== this.state.data.weekAvg
                  ? Math.floor(
                    (Math.abs(
                      this.state.data.today - this.state.data.weekAvg
                    ) *
                      100) /
                    this.state.data.weekAvg
                  ) + "%"
                  : ""}
                .
              </span>
            </Col>
          </Row>

          <Container className="today-container">
            <Row className="summary-data sum-container">
              <Col md={6} xs={5} className="today-card">
                <div className="sum-title">
                  <i className="fas fa-circle" />
                  Today
                </div>
              </Col>

              <Col md={6} xs={5} className="today-card">
                <div className="sum-title">
                  <i className="fas fa-circle" />
                  Weekly Avg
                </div>
              </Col>
            </Row>

            <Row className="summary-data sum-container">
              <Col md={6} xs={5} className="today-card">
                <div className="sum-data">
                  {this.state.data.today}
                  {this.state.data.today < this.state.data.weekAvg ? (
                    <i className="fas fa-angle-double-down down"></i>
                  ) : this.state.data.today > this.state.data.weekAvg ? (
                    <i className="fas fa-angle-double-up up"></i>
                  ) : (
                    <i className="fas fa-equals equal"></i>
                  )}
                </div>
              </Col>
              <Col md={6} xs={5} className="today-card">
                <div className="sum-data">{this.state.data.weekAvg}</div>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    );
  }
}

export default SummaryCard;
