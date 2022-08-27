
import React from "react";
// react library for routing
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  // NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button
} from "reactstrap";

class IndexNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-horizontal navbar-main navbar-dark bg-info"
          expand="lg"
          id="navbar-main"
        >
          <Container>
            <NavbarBrand to="/" tag={Link}>
              <img
                alt="..."
                src={require("assets/img/brand/nonagon.png")}
              />
            </NavbarBrand>
            <button
              aria-controls="navbar-collapse"
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navbar-collapse"
              data-toggle="collapse"
              id="navbar-collapse"
              type="button"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse
              className="navbar-custom-collapse"
              navbar
              toggler="#navbar-collapse"
            >
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/admin/dashboard">
                      <img
                        alt="..."
                        src={require("assets/img/brand/nonagon.png")}
                      />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      aria-controls="navbar-collapse"
                      aria-expanded={false}
                      aria-label="Toggle navigation"
                      className="navbar-toggler"
                      data-target="#navbar-collapse"
                      data-toggle="collapse"
                      id="navbar-collapse"
                      type="button"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="mr-auto" navbar>


              </Nav>
              <hr className="d-lg-none" />
              <Nav className="align-items-lg-center ml-lg-auto" navbar>
                {/* <NavItem>
                  <NavLink to="/auth/register" tag={Link}>
                    <span className="nav-link-inner--text">Register</span>
                  </NavLink>
                </NavItem> */}
                <NavItem className="d-none d-lg-block ml-lg-4">
                  <Link to="/auth/login">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="btn-inner--icon">
                        <i className="fas fa-sign-in-alt mr-2" />
                      </span>
                      <span className="nav-link-inner--text">Login</span>
                    </Button>
                  </Link>
                </NavItem>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default IndexNavbar;
