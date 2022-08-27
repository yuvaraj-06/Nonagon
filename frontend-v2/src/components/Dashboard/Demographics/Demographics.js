import React, { Component } from 'react';

import {
  Card,
  CardBody,
  Row,
  CardTitle,
  Col,
  Button,
  Modal,
  Tooltip
} from 'reactstrap';

import Graph1 from './GenderGraph';
import Graph2 from './AgeGraph';

import axios from 'axios';

import { nodeBaseURL } from '../../../ApiURL';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import ComparisonGraph from 'components/HourWiseComparison/ComparisonGraph';
import { Link } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time
  };
};

class Demographics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      male: 0,
      female: 0,
      outlet: this.props.outlet,
      time: this.props.time,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      comparisonGraphFeature: 'male'
    };
    this._ismounted = true;
  }

  toggleTooltip = () => {
    this._ismounted &&
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
      });
  };

  toggleModal = state => {
    this._ismounted && this.setState({
      [state]: !this.state[state]

    });
  };

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL + `demographics/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then(res => {
        this._ismounted && this.setState({
          male: res.data.male,
          female: res.data.female
        });
      })
      .catch(err => {

      });
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({
        time: nextProps.time
      });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <Card className="card-stats demographics-card">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle
                tag="h5"
                className="text-uppercase text-muted mb-0"
              >
                Demographics
              </CardTitle>
              {this.state.male !== 0 || this.state.female !== 0 ?
                <div className="mt-4 mb-2">
                  <Row>
                    <Col lg="4" xl="5">
                      <center>
                        <div className="h2 text-red">
                          <p className="text-red" style={{ fontSize: '1.3rem' }}>
                            <i className="fa fa-male" />{" "}
                          </p>
                          {
                            (this.state.male / (this.state.male + this.state.female) * 100).toFixed(0)
                          }%
                        </div>
                      </center>

                    </Col>
                    <Col lg="4" xl="5">
                      <center>
                        <div className="h2 text-info">
                          <p className="text-info" style={{ fontSize: '1.3rem' }}>
                            <i className="fa fa-female" />{" "}
                          </p>
                          {
                            (this.state.female / (this.state.male + this.state.female) * 100).toFixed(0)
                          }%
                        </div>
                      </center>
                    </Col>
                  </Row>
                </div>
                :
                <div className="mt-4 mb-2">
                  <Row>
                    <Col lg="4" xl="5">
                      <center>
                        <div className="h2 text-red">
                          <p className="text-red">
                            <i className="fa fa-male" />{" "}
                          </p>
                          {
                            0
                          }%
                        </div>
                      </center>

                    </Col>
                    <Col lg="4" xl="5">
                      <center>
                        <div className="h2 text-info">
                          <p className="text-info">
                            <i className="fa fa-female" />{" "}
                          </p>
                          {
                            0
                          }%
                        </div>
                      </center>
                    </Col>
                  </Row>
                </div>
              }
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-venus-mars" />
              </div>
            </Col>
          </Row>
          <div className="mt-2 mb-0 text-sm">

            <div className="mt-1">

              <Button color="secondary" outline type="button" size="sm" onClick={() => this.toggleModal("exampleModal")}>
                <div className="text-info">
                  <p>
                    <i className="fa fa-question-circle" />
                  </p> Learn More
                </div>{" "}
              </Button>
              <Link to='/admin/demographics'>
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
              <Col>
                <div className="explr-i" id="explr-tooltip-grm">
                  <i className=" fas fa-info" />
                </div>
                <Tooltip
                  placement="top-start"
                  isOpen={this.state.tooltipOpen}
                  target="explr-tooltip-grm"
                  toggle={() => this.toggleTooltip()}
                >
                  The AI estimates the gender ratio of the customer visiting the store provided the customer's face is clearly visible in the CCTV.
                </Tooltip>
              </Col>
            </div>
          </div>
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.exampleModal}
            toggle={() => this.toggleModal("exampleModal")}
            size="lg"
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Demographics
              </h5>            
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
            <p className="h6">The AI analyses the gender and age group of customers, provided the face is clearly visible.</p>
              <Row>
                {
                  this.props.act.services.includes('CI.GRM') ?
                    <Col>
                      <Graph1 outlet={this.props.outlet} time={this.state.time} startDate={this.props.startDate}
                        endDate={this.props.endDate} />
                    </Col>
                    :
                    null
                }
                {
                  this.props.act.services.includes('CI.AE') ?
                    <Col>
                      <Graph2 outlet={this.props.outlet} time={this.state.time} startDate={this.props.startDate}
                        endDate={this.props.endDate} />
                    </Col>
                    :
                    null
                }
              </Row>
              <Row>
                <Col className='text-center'>
                  <Button
                    color={this.state.comparisonGraphFeature === 'male' ? 'primary' : 'white'}
                    size="sm"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({ comparisonGraphFeature: 'male' });
                    }
                    }
                  >Male</Button>
                  <Button
                    color={this.state.comparisonGraphFeature === 'female' ? 'primary' : 'white'}
                    size="sm"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({ comparisonGraphFeature: 'female' });
                    }
                    }
                  >Female</Button>
                </Col>
              </Row>
              <br />
              {
                this.state.comparisonGraphFeature === 'male' ?
                  <ComparisonGraph
                    dataType='No of Male'
                    route='demographics/gender/hourwise/male'
                    outletCode={this.props.outlet}
                  />
                  :
                  this.state.comparisonGraphFeature === 'female' ?
                    <ComparisonGraph
                      dataType='No of Female'
                      route='demographics/gender/hourwise/female'
                      outletCode={this.props.outlet}
                    />
                    :
                    null
              }
            </div>
          </Modal>
        </CardBody>
      </Card>
    );
  }
}

//export default Demographics;

export default connect(
  mapStateToProps,
)(Demographics);
