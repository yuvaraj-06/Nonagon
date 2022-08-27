
import React from "react";
// react library for routing
import { Route, Switch, Redirect } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import Login from "views/pages/auth/Login";
// import Register from "views/pages/auth/Register"
import Reset from "views/pages/auth/reset";
class Auth extends React.Component {

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
            Auth={this.props.Auth}
            loadUser={this.props.loadUser}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="main-content" ref="mainContent">
          <AuthNavbar />
          <Switch>
            {/* {this.getRoutes(routes)} */}
            <Route
              path={"/auth/login"}
              render={props => <Login {...props}
                Auth={this.props.Auth}
                loadUser={this.props.loadUser} />}
            />
            {/* <Route
              path={"/auth/register"}
              render={props => <Register {...props}
                Auth={this.props.Auth}
                loadUser={this.props.loadUser} />}
            /> */}
            <Route
              path={"/auth/reset"}
              render={props => <Reset {...props}
                Auth={this.props.Auth}
                loadUser={this.props.loadUser} />}
            />
            <Redirect from="*" to="/auth/login" />
          </Switch>
        </div>
        <AuthFooter />
      </>
    );
  }
}

export default Auth;
