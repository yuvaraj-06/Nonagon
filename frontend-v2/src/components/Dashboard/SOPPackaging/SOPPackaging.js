import React, { Component } from 'react'

import {
  Card,
  CardBody,
  Row,
  CardTitle,
  Col,
  Modal,
  Button
} from 'reactstrap'

import HairnetGraph from './HairnetGraph'
import GlovesGraph from './GlovesGraph'
import MaskGraph from './MaskGraph'

import axios from 'axios'

import { nodeBaseURL } from '../../../ApiURL'

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time
  };
}

class PersonalHygieneDeviation extends Component {


  constructor(props) {
    super(props)
    this.state = {
      exampleModal: false,
      hairnet: 0,
      glove: 0,
      mask: 0,
      time: this.props.time
    }
    this._ismounted = true;
  }

  toggleModal = state => {
    this._ismounted && this.setState({
      [state]: !this.state[state]
    });
  };

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL + `sopDeviation/packaging/aggregate/${nextProps.outlet}/${nextProps.time}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then(res => {
        this._ismounted && this.setState({
          hairnet: res.data.hairnet,
          mask: res.data.mask,
          glove: res.data.gloves
        })
      })
      .catch(err => {

      });
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({
        time: nextProps.time
      })
      this.fetchData(nextProps)
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <Card className="card-stats">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle
                tag="h5"
                className="text-uppercase text-muted mb-0"
              >
                Packaging Area Hygiene Deviation
              </CardTitle>
              <div className="mt-2 mb-1">

                <Row>
                  <Col md="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <center>
                        <span className="h4 text-red">
                          Hairnet
                        </span>
                        <br />
                        {/* {this.state.hairnet !== 0 ? this.state.hairnet : '-'} */}
                        {this.state.hairnet}
                      </center>
                    </span>
                  </Col>
                  {/* {this.state.mask !== 0 ? */}
                  <Col md="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <center>
                        <span className="h4 text-info">
                          Masks
                        </span>
                        <br />
                        {/* {this.state.mask !== 0 ? this.state.mask : '-'} */}
                        {this.state.mask}
                      </center>
                    </span>
                  </Col>
                  {/* : ""} */}
                  <Col md="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <center>
                        <span className="h4 text-orange">
                          Gloves
                        </span>
                        <br />
                        {/* {this.state.glove !== 0 ? this.state.glove : '-'} */}
                        {this.state.glove}
                      </center>
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                <i className="fas fa-tape"></i>
              </div>
            </Col>
          </Row>
          <div className="mb-0 text-sm">

            <div className="mt-2">

              <Button color="secondary" outline type="button" size="sm" onClick={() => this.toggleModal("exampleModal")}>
                <span className="text-info">
                  <i className="fa fa-question-circle" /> Learn More
                </span>{" "}
              </Button>
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
                Hygiene Equipment Deviation
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
            <div className="modaltime-body">
              <Row>
                <Col lg="12">
                  <HairnetGraph outlet={this.props.outlet} time={this.state.time} />
                </Col>
                <Col lg="12">
                  <GlovesGraph outlet={this.props.outlet} time={this.state.time} />
                </Col>
                <Col lg="12">
                  <MaskGraph outlet={this.props.outlet} time={this.state.time} />
                </Col>
              </Row>
            </div>
          </Modal>
        </CardBody>
      </Card>
    )
  }
}

//export default PersonalHygieneDeviation;

export default connect(
  mapStateToProps,
)(PersonalHygieneDeviation);