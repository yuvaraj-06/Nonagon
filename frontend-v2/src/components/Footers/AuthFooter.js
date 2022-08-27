
/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5" id="footer-main">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left text-muted">
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
              <Col xl="6">
                <Nav className="nav-footer justify-content-center justify-content-xl-end">
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
                      href="https://www.creative-tim.com/license?ref=adpr-auth-footer"
                      target="_blank"
                  rel="noopener noreferrer"
                    >
                      License
                    </NavLink>
                  </NavItem> */}
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
