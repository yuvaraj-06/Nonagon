import React, { Component } from 'react'

import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem
} from 'reactstrap'
import TimeSelectLogs from "components/Dashboard/TimeSelectLogs";

class Dashheader extends Component {

  render() {
    return (
      <div className="header bg-info pb-6">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="12" xs="12">
                <h6 className="h2 text-white d-inline-block mb-0">
                  {this.props.name}
                </h6>{" "}
                <Breadcrumb
                  className="d-none d-md-inline-block ml-md-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <i className="fas fa-home" />
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      {this.props.title}
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    {this.props.name}
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
              < Col className="text-right" lg="12" xs="12">
                <TimeSelectLogs timeCallback={this.callbackTime} />
                <br />
              </Col>
            </Row>


          </div>
        </Container>
      </div >
    )
  }
}

export default Dashheader