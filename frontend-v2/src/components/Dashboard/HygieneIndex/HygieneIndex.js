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

import Graph from './Graph';
// import Details from './Details'

import axios from 'axios';

import { nodeBaseURL } from '../../../ApiURL';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import ComparisonGraph from 'components/HourWiseComparison/ComparisonGraph';
import { Link } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletCode: state.outletCode.outletCode,
    companyServices: state.services.companyServices
  };
};

class HygieneIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      HygieneIndex: 0,
      time: this.props.time,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      services: props.companyServices[props.outletCode] ? props.companyServices[props.outletCode].services : []
    };
    this._ismounted = true;
  }

  toggleTooltip = () => {
    this._ismounted &&
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
      });
  };

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL + `hygieneIndex/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then(res => {
        this._ismounted && this.setState({
          HygieneIndex: res.data
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

  toggleModal = state => {
    this._ismounted && this.setState({
      [state]: !this.state[state]
    });
  };

  render() {
    return (
      <Card className="card-stats" >
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle
                tag="h5"
                className="text-uppercase text-muted mb-0"
              >
                Hygiene Index
              </CardTitle>

              {
                (this.state.HygieneIndex === 0)
                  ?
                  <span className="h2 font-weight-bold mb-0">
                    -
                  </span>
                  :
                  (this.state.HygieneIndex < 2.5)
                    ?
                    <span className="h2 font-weight-bold mb-0" style={{ color: 'red' }}>
                      {Math.round(this.state.HygieneIndex * 100) / 100}
                    </span>
                    :
                    <span className="h2 font-weight-bold mb-0">
                      {Math.round(this.state.HygieneIndex * 100) / 100}
                    </span>
              } / 5

            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-hand-sparkles" />
              </div>
            </Col>
          </Row>
          <div className="mt-3 mb-0 text-sm">
            <span className="">Calculated using detected deviations</span>
            <br />
            <div className="pt-1">
              <Button color="secondary" outline type="button" size="sm" onClick={() => this.toggleModal("exampleModal")}>
                <span className="text-info">
                  <i className="fa fa-question-circle" /> Learn More
                </span>{" "}
              </Button>
              <Link to='/admin/hygiene-index'>
                <Button
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
              <div className="explr-i" id="explr-tooltip-HygieneIndex">
                <i className=" fas fa-info" />
              </div>
              <Tooltip
                placement="top-start"
                isOpen={this.state.tooltipOpen}
                target="explr-tooltip-HygieneIndex"
                toggle={() => this.toggleTooltip()}
              >
                {this.state.services.includes('HI.FNB') ? 'Hygiene Index is calculated based on features like: mask detection, hairnet detection, glove detection, floor mopping, handwash tracking.' : 'Hygiene Index is calculated based on features like mask detection, floor mopping, sanitisation alerts.'}
              </Tooltip>
            </Col>
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state.exampleModal}
              toggle={() => this.toggleModal("exampleModal")}
              size="lg"
            >
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Hygiene Index
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
                <Row>
                  <Col>
                    {/* <LiveFeed mlPort={'ws-sop'} /> */}
                  </Col>
                </Row>
                {/* <Details outlet={this.props.outlet} time={this.state.time} startDate={this.props.startDate}
                  endDate={this.props.endDate} /> */}
                <Row>
                  <Col>
                    <Graph outlet={this.props.outlet} time={this.state.time} startDate={this.props.startDate}
                      endDate={this.props.endDate} />
                  </Col>
                </Row>
                <ComparisonGraph
                  dataType='Hygiene Value'
                  route='hygieneIndex/hourwise'
                  outletCode={this.props.outlet}
                />
                <h5 className='ml-2'>
                  Fun Fact: The Hygiene Index is an aggregated accumulation of your daily hygiene checks done by monitoring floor mop frequency, mask deviations, social distancing violations, open dustbins detected, sanitization frequency with respect to crowd presence duration, and many more parameters

                </h5>
              </div>
            </Modal>
          </div>
        </CardBody>
      </Card>
    );
  }
}

//export default HygieneIndex;

export default connect(
  mapStateToProps,
)(HygieneIndex);