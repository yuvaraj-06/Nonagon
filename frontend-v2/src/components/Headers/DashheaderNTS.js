import React, { Component } from 'react'

import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem
} from 'reactstrap'

class Dashheader extends Component {

  render() {
    return (
      <div className="header bg-info pb-6">
        <Container fluid>
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
            </Row>


          </div>
        </Container>
      </div >
    )
  }
}

export default Dashheader