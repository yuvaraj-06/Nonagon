import React, { Component } from "react";

import { connect } from "react-redux";
import {
  Row,
  Col,
  Button,
  Card,
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
import BenchMarkForm from "./BenchMarkForm";
import BenchMarkTool from "./BenchMarkTool";

import "./VideoPlayback.scss";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    companyServices: state.services.companyServices,
  };
};

class VideoPlayback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToolActive: false,
    };
    this._ismounted = true;
  }

  toggleTool = () => {
    this.setState({
      isToolActive: true,
    });
  };
  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <>
        <div className="header bg-info pb-6">
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6" xs="7">
                <h6 className="h2 text-white d-inline-block mb-0">
                  {this.props.name}
                </h6>{" "}
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
                      {"Benchmarking Tool"}
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    {this.props.name}
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
            </Row>
          </div>
          <Container fluid>
            {this.state.isToolActive ? (
              <BenchMarkTool />
            ) : (
              <BenchMarkForm toogleTool={this.toggleTool} />
            )}
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(VideoPlayback);
