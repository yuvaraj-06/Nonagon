import React from "react";
import { Container, Card } from "reactstrap";

import DashheaderNTS from "components/Headers/DashheaderNTS";

import Profile from "components/Profile/Profile";
import "components/Summary/SummaryCard.scss";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import { connect } from "react-redux";
import { nodeBaseURL } from "ApiURL";
import axios from "axios";

const mapStateToProps = (state) => {
  return {
    email: jwt_decode(state.act.act).email,
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class ProfileTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._ismounted = true;
  }
  fetchData = (email) => {
    this._ismounted &&
      axios
        .get(nodeBaseURL + `users/${email}`, {
          headers: {
            Authorization: `bearer ${localStorage.getItem("act")}`,
          },
        })
        .then((res) => {
          this.setState({ userDetails: res.data });
          console.log(res.data);
        })
        .catch(console.log);
  };

  componentDidMount() {
    this._ismounted && this.fetchData(this.props.email);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    return (
      <>
        <DashheaderNTS title="Profile" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card className="pb-5">
              {this.state.userDetails != null ? (
                <Profile data={this.state.userDetails} />
              ) : (
                <Profile data={null} />
              )}
            </Card>
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(ProfileTab);
