import React, { Component } from "react";
// react library for routing
import { Route, Switch, Redirect } from "react-router-dom";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "../routes/routes";
import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
const routesA = routes;

const mapStateToProps = (state) => {
  return {
    routes: state.routes.routes
  };
};

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: props.routes,
      sidenavOpen: true,
    };
  }

  componentDidMount() {
    if (window.innerWidth < 576) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.setState({ sidenavOpen: false });
    }
  }

  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={
              () =>
                <prop.component
                />
            }
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  toggleModal() {
    this.setState({
      modalState: !this.state.modalState
    });
  }

  getBrandText = (path, routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        path.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  toggleSidenav = e => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    this.setState({
      sidenavOpen: !this.state.sidenavOpen
    });
  };
  getNavbarTheme = () => {
    return this.props.location.pathname.indexOf(
      "admin/alternative-dashboard"
    ) === -1
      ? "dark"
      : "light";
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      routes: nextProps.routes
    });
  }

  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={this.state.routes}
          toggleSidenav={this.toggleSidenav}
          sidenavOpen={this.state.sidenavOpen}
          logo={{
            innerLink: "/admin/dashboard",
            imgSrc: require("assets/img/brand/nonagon.png"),
            imgAlt: "nonagon Logo"
          }}
        />
        <div
          className="main-content"
          ref="mainContent"
          onClick={this.closeSidenav}
        >
          <AdminNavbar
            {...this.props}
            theme={this.getNavbarTheme()}
            toggleSidenav={this.toggleSidenav}
            sidenavOpen={this.state.sidenavOpen}
            brandText={this.getBrandText(this.props.location.pathname, this.state.routes)}
            signOutUser={this.props.signOutUser}
            compName={this.props.name}
          />
          <ErrorBoundary>
            <Switch>
              {
                this.getRoutes(routesA)
              }
              <Redirect to="/admin/dashboard" />
            </Switch>
          </ErrorBoundary>
        </div>
        {this.state.sidenavOpen ? (
          <div className="backdrop d-xl-none" onClick={this.toggleSidenav} />
        ) : null}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(Admin);
