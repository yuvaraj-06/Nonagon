import React, { Component } from "react";
import featuresJSON from "jsons/featuresJSON";
import { getNotOptedFeatures } from "utilFunctions/getNotOptedFeatures";
import { connect } from "react-redux";
import { Card, CardTitle, Row, Col, Button } from "reactstrap";
import "./ExploreMoreFeatures.scss";
import ExploreMoreCard from "./ExploreMoreCards";
import { sendRequestNewFeaturesEmail } from "components/EmailJS/email";
import jwt_decode from 'jwt-decode';
import { NotifyWrapper } from "components/Alerts/Notify";

const mapStateToProps = (state) => {
  return {
    outletCode: state.outletCode.outletCode,
    companyServices: state.services.companyServices,
    act: jwt_decode(state.act.act),
  };
};

class ExploreMoreFeatures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outletName: this.props.companyServices[this.props.outletCode]
        ? this.props.companyServices[this.props.outletCode].outlet_location
        : "Outlet Name Unvailable",
      featureCodes: getNotOptedFeatures(
        this.props.companyServices[this.props.outletCode]
          ? this.props.companyServices[this.props.outletCode].sector
          : null,
        Object.keys(featuresJSON),
        this.props.companyServices[this.props.outletCode]
          ? this.props.companyServices[this.props.outletCode].services
          : []
      ),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      outletName: nextProps.companyServices[nextProps.outletCode]
        ? nextProps.companyServices[nextProps.outletCode].outlet_location
        : "Outlet Name Unvailable",
      featureCodes: getNotOptedFeatures(
        nextProps.companyServices[nextProps.outletCode]
          ? nextProps.companyServices[nextProps.outletCode].sector
          : null,
        Object.keys(featuresJSON),
        nextProps.companyServices[nextProps.outletCode]
          ? nextProps.companyServices[nextProps.outletCode].services
          : []
      ),
    });
  }

  render() {
    let optedFeaturesArray = [];

    const handelCheckbox = (feat, checkboxState) => {
      if (checkboxState) {
        if (!optedFeaturesArray.includes(feat)) optedFeaturesArray.push(feat);
      } else {
        if (optedFeaturesArray.includes(feat))
          optedFeaturesArray.splice(optedFeaturesArray.indexOf(feat), 1);
      }
    };

    const handelSubmitFeatures = () => {
      var emailJSONObject = {
        user_name: this.props.act.name,
        outlet_code: this.props.outletCode,
        outlet_name: this.props.companyServices[this.props.outletCode]
          ? this.props.companyServices[this.props.outletCode].outlet_location
          : "Outlet Name Unavailable",
        features_list: optedFeaturesArray.toString(),
        user_email: this.props.act.email,
        outlets_access: this.props.act.outlets.toString()
      }
      sendRequestNewFeaturesEmail(emailJSONObject).then(a => {
        NotifyWrapper.success('We have successfully recieved your request for new features.')
      }).catch(err => {
        NotifyWrapper.warning('Oops we are facing some error in receiving your request. Please wait for some time.')
      })
    };

    return (
      <Card className="explr-page">
        <CardTitle tag="h3" className="text-uppercase mt-4 mb-5 mx-1">
          Explore Features for {this.state.outletName} Outlet
        </CardTitle>
        <Row className="explr-cards">
          {this.state.featureCodes.map((item, key) => (
            <Col sm="12" md="6" lg="4" key={key}>
              <ExploreMoreCard
                data={featuresJSON[item]}
                featCode={item}
                tooltipID={this.state.featureCodes.indexOf(item)}
                handelCheckbox={handelCheckbox}
              />
            </Col>
          ))}
        </Row>
        <Row className="explr-submit">
          <Button type="submit" className="btn" onClick={handelSubmitFeatures}>
            Request for features
          </Button>
        </Row>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(ExploreMoreFeatures);
