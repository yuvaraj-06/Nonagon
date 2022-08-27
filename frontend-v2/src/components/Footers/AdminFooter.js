
/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Calendar extends React.Component {
  render() {
    return (
      <>
        <Container fluid>
          <footer className="footer pt-0">
            <Row className="align-items-center justify-content-lg-between">
              <Col lg="6">
                <div className="copyright text-center text-lg-left text-muted">
                  © {new Date().getFullYear()}{" "}
                  <a
                    className="font-weight-bold ml-1"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hyperform Technology Pvt. Ltd.
                  </a>
                </div>
              </Col>
              <Col lg="6">
                <Nav className="nav-footer justify-content-center justify-content-lg-end">
                  {/* <NavItem>
                    <NavLink
                      href="http://blog.creative-tim.com?ref=adpr-auth-footer"
                      target="_blank"
                  rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </NavLink>
                  </NavItem> */}
                  {/* <NavItem>
                    <NavLink
                      href="https://www.creative-tim.com/license?ref=adpr-admin-footer"
                      target="_blank"
                  rel="noopener noreferrer"
                    >
                      License
                    </NavLink>
                  </NavItem> */}
                </Nav>
              </Col>
            </Row>
          </footer>
        </Container>
      </>
    );
  }
}

export default Calendar;
