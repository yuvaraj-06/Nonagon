import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  Media,
  Navbar,
  NavItem,
  Nav,
  Card,
  CardBody,
  Container,
} from "reactstrap";
import qs from 'qs';
import axios from 'axios';
import { notificationURL, loginNodeBaseURL, pusherBeamsInstanceID } from '../../ApiURL';
// import notification from 'assets/audio/notification.mp3'
import BellNotifications from "components/Notifications/BellNotifications";
import jwt_decode from "jwt-decode";
import { connect } from 'react-redux';
import { updateOutletCode, updateCompanyServices, updateRoutes, updateOutletCameraDetails } from "redux/index";
import { getTrimmedString } from "utilFunctions/getTrimmedString";
import { getRoutesArray } from "routes/routesArray";
import Ticker from "components/TimezonedTicker/ticker";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { getLiveNotificationsOutletArray } from "utilFunctions/getLiveNotificationOutletsArray";
import { Link } from "react-router-dom";

// disabled subscribing to beams client because it was showing blank page
let isBeamsSubscribed = true;

// let apiCallsSuccessful = {
//   fetchData: false,
//   fetchOutletCamerasDetails: false,
//   fetchCompanyServices: false
// };

const subscribeToPusherBeams = (outlets) => {
  if (outlets.length > 0) {
    if (!isBeamsSubscribed) {
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: pusherBeamsInstanceID,
      });
      beamsClient
        .start()
        .then(() => beamsClient.getDeviceInterests())
        .then((interests) => {
          // checking if device interests are aligned with outlets
          // console.log(areUserOutletsAlignedWithDeviceInterests(outlets, interests))
          return areUserOutletsAlignedWithDeviceInterests(outlets, interests);
        })
        .then((deviceInterestsAndUserOutletsMatch) => {
          if (!deviceInterestsAndUserOutletsMatch) {
            // updating device interests
            // console.log('updated new device interests');
            return beamsClient.setDeviceInterests(outlets);
          }
        })
        .then(() => isBeamsSubscribed = true)
        // testing if beams device interests is working perfectly
        // .then(() => beamsClient.getDeviceInterests())
        // .then((interests) => {
        //   console.log(areUserOutletsAlignedWithDeviceInterests(outlets, interests))
        // })
        .catch(
          console.error()
        );
    }
  }
};

const areUserOutletsAlignedWithDeviceInterests = (userOutletsNotifArray, beamsDeviceInterests) => {
  if (userOutletsNotifArray.every(item => beamsDeviceInterests.includes(item)) &&
    beamsDeviceInterests.every(item => userOutletsNotifArray.includes(item))) { return true; }
  return false;
};

const mapStateToProps = (state) => {
  return {
    outlets: jwt_decode(state.act.act).outlets,
    outletCode: state.outletCode.outletCode,
    outletServices: state.services.outletServices,
    companyServices: state.services.companyServices,
    compCode: jwt_decode(state.act.act).company,
    time: state.time.time,
    role: jwt_decode(state.act.act).role,
    outletTimezone: state.outletCode.outletTimezone
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOutletCode: (payload) => {
      dispatch(updateOutletCode(payload));
    },
    updateCompanyServices: (payload) => {
      dispatch(updateCompanyServices(payload));
    },
    updateRoutes: (payload) => {
      dispatch(updateRoutes(payload));
    },
    updateOutletCameraDetails: (payload) => {
      dispatch(updateOutletCameraDetails(payload))
    }
  };
};

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotifications: true,
      role: props.role,
      notifications: [],
      notifDropDownOpen: false,
      notifState: false,
      companyServices: props.companyServices,
      outletCode: props.outletCode,
    };
    this._ismounted = true;
  }
  // function that on mobile devices makes the search open
  openSearch = () => {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  };
  // function that on mobile devices makes the search close
  closeSearch = () => {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  };

  getUserOutletAccessList = (userOutlets) => {
    return userOutlets.map((item) => {
      let userOutletAccessArray;
      this.state.companyServices[item] ?
        userOutletAccessArray = {
          outletCode: item,
          outletName: this.state.companyServices[item].outlet_location
        }
        :
        userOutletAccessArray = {
          outletCode: undefined,
          outletName: 'Loading Outlet'
        };
      return userOutletAccessArray;
    });
  };

  pusherBeamsErrorFallback = () => {
    // alert('This browser does not support push notifications')
  };

  pusherBeamsErrorFallback = () => {
    // alert('This browser does not support push notifications')
  }

  fetchData = (nextProps) => {
    axios.get(
      notificationURL +
      `notification/list/${nextProps.outletCode}/${nextProps.time}`,
      {
        headers: {

        }
      }
    )
      .then((res) => {
        var x = res.data.map((item, key) => {
          var action = item.action !== '' && item.operator !== '' ?
            `${item.action}`
            //  by ${item.operator} at ${moment(item.timestamp).format('DD-MM-YYYY / HH:mm:ss')}`
            :
            "No action taken";
          return (
            {
              sno: res.data.indexOf(item) + 1,
              action: action,
              title: item.title,
              suspicion: item.suspicion_level,
              detail: item.content,
              cam: item.camera_location,
              detected: item.timestamp,
              outlet_code: item.outlet_code
            }
          );
        });
        this._ismounted && this.setState({
          notifications: x,
          loadingMsg: ''
        });

      })
      .catch(err => {

      });
  };

  toggleNotifDropDown = (e) => {
    this.setState({ notifState: !this.state.notifState });
    document.addEventListener("click", this.handleOutsideClick, false);
  };

  handleOutsideClick = e => {
    this.setState({ notifState: false });
    document.removeEventListener("click", this.handleOutsideClick, false);
  };

  updateNotification = async (outlet, timestamp, action, name, item) => {
    var data = qs.stringify({
      'outlet_code': outlet,
      'timestamp': timestamp,
      "action": action,
      "operator": name,
      "data": JSON.stringify(item)
    });
    var config = {
      method: 'post',
      url: `${notificationURL}notification/update`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      data: data
    };
    await axios(config)
      .then(res => {
        if (res.status === 200) {
          this.fetchData(this.state);
        }
      })
      .catch(err => {

      });
  };

  newNotification = async (data) => {
    this._ismounted
      // && new Audio(notification).play()
      && this.setState({
        notifications: [data, ...this.state.notifications]
      });
    this._ismounted && this.toggleNotifDropDown();
    //autoignoring notification 3 mins after arrival for operator
    var name = this.state.name;
    var updateNotification = this.updateNotification;
    this.state.role === 'operator' && this._ismounted && setTimeout(
      function () {
        updateNotification(data.outlet_code, data.timestamp, "Autoforwarded", name, data);
      },
      10000);
  };

  fetchCompanyServices = (compCode) => {
    axios.get(
      loginNodeBaseURL +
      `outlets/services/${compCode}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`
        }
      }
    )
      .then((res) => {
        this._ismounted && this.setState({
          companyServices: res.data
        });
        this.props.updateCompanyServices(res.data);
        return res.data;
      })
      .catch(err => {
        this._ismounted && this.setState({
          errMsg: 'We are currently facing some issue. Please raise an issue in support tab.',
          loadingMsg: 'We are currently facing some issue. Please raise an issue in support tab.'
        });
      });
  };

  fetchOutletCamerasDetails = (outletCode) => {
    axios.get(
      loginNodeBaseURL +
      `cameras/${outletCode}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`
        }
      }
    )
      .then((res) => {
        res.data.cam_full = 'All Cameras'
        // res.data.all_cam = 'All Cameras'
        this.props.updateOutletCameraDetails({
          outletCameraDetails: res.data,
          outletTimezone: this.props.companyServices[this.props.outletCode] ? this.props.companyServices[this.props.outletCode].timezone : null
        })
      })
      .catch(this.props.updateOutletCameraDetails({ outletCameraDetails: { cam_full: 'All Cameras', cam_1: 'Camera 1' }, outletTimezone: null }))
  }

  getOutletNameObject = (outletDetails) => {
    let code = outletDetails.map(item => { return item.outletCode; });
    let name = outletDetails.map(item => { return item.outletName; });
    let outletNameObject = {};
    for (let i = 0; i < code.length; i++) {
      outletNameObject[code[i]] = name[i];
    }
    return outletNameObject;
  };

  getOutletNameObject = (outletDetails) => {
    let code = outletDetails.map(item => { return item.outletCode })
    let name = outletDetails.map(item => { return item.outletName })
    let outletNameObject = {}
    for (let i = 0; i < code.length; i++) {
      outletNameObject[code[i]] = name[i]
    }
    return outletNameObject
  }

  componentDidMount() {
    this._ismounted && this.fetchData(this.props);
    this._ismounted && this.fetchCompanyServices(jwt_decode(localStorage.getItem('act')).company);
    this._ismounted && this.fetchOutletCamerasDetails(this.props.outletCode)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({
        outletCode: nextProps.outletCode,
      });
      subscribeToPusherBeams(
        getLiveNotificationsOutletArray(nextProps.outlets, nextProps.companyServices));
      this._ismounted && this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  logoutMixpanel = () => {
    this.props.signOutUser();
  };

  render() {
    return (
      <>
        <Navbar
          className={classnames(
            "navbar-top navbar-expand border-bottom",
            { "navbar-dark bg-info": this.props.theme === "dark" },
            { "navbar-light bg-secondary": this.props.theme === "light" }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen={true}>
              {/* <Form
                className={classnames(
                  "navbar-search form-inline mr-sm-3",
                  { "navbar-search-light": this.props.theme === "dark" },
                  { "navbar-search-dark": this.props.theme === "light" }
                )}
              >
                <FormGroup className="mb-0">
                  <InputGroup className="input-group-alternative input-group-merge">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-search" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Search" type="text" />
                  </InputGroup>
                </FormGroup>
                
                <button
                  aria-label="Close"
                  className="close"
                  type="button"
                  onClick={this.closeSearch}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </Form> */}
              <div className="text-white h2 mb-0 ml-3 font-weight-bolder">
                Hello {this.props.name},
                <br />
                <span className="text-white h3 mb-0font-weight-bold">
                  Welcome to the Dashboard!
                </span>
              </div>





              <Nav className="align-items-center ml-md-auto" fixed='true' navbar>
                <NavItem className="d-xl-none">
                  <div
                    className={classnames(
                      "pr-3 sidenav-toggler",
                      { active: this.props.sidenavOpen },
                      { "sidenav-toggler-dark": this.props.theme === "dark" }
                    )}
                    onClick={this.props.toggleSidenav}
                  >
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                    </div>
                  </div>
                </NavItem>
                {/* <NavItem className="d-sm-none">
                  <NavLink onClick={this.openSearch}>
                    <i className="fas" />
                  </NavLink>
                </NavItem> */}
              </Nav>

              {/* <UncontrolledDropdown nav>
                <DropdownToggle className="nav-link pr-0" color="text-primary" tag="a">
                  <Nav className="align-items-center ml-auto ml-md-0" navbar>
                    <span onClick={(e) => this.setState({ showNotifications: !this.state.showNotifications })}>
                      <i className="ni ni-bell-55 nav-link" />
                    </span>
                  </Nav>
                </DropdownToggle>
                <DropdownMenu right> */}


              <Nav className="outlet-time" fixed='true' navbar>
                <span className="text-white ">
                  <i className="far fa-clock"></i>
                </span>
                <div className='text-white'>
                  <Ticker />
                </div>&nbsp;&nbsp;
              </Nav>

              <Dropdown
                isOpen={this.state.notifDropDownOpen}
                toggle={this.toggleNotifDropDown}
                down='true'
              >
                <Nav className="align-items-center ml-auto ml-md-0" navbar>
                  {/* <span className="avatar avatar-sm rounded-circle bg-white text-primary" */}
                  <span className="text-white"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => { this.toggleNotifDropDown(); }} >
                    <i className="ni ni-bell-55" />
                  </span>&nbsp;&nbsp;
                  <span className='text-white'>{this.state.notifications.length > 0 ? this.state.notifications.length : null}</span>
                </Nav>
                {
                  this.state.notifState ? <Card className='main-notifications'>
                    <CardBody>
                      <BellNotifications
                        notifications={this.state.notifications}
                        outletsNameObject={this.getOutletNameObject(this.getUserOutletAccessList(Object.keys(this.props.companyServices)))}
                      />
                    </CardBody>
                  </Card> : null
                }
              </Dropdown>
              {/* <Notifications /> */}
              {/* </UncontrolledDropdown> */}

              <Nav className="align-items-center ml-auto ml-md-0" navbar style={{ cursor: 'pointer' }}>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      {/* <span className="avatar avatar-sm rounded-circle bg-white text-primary"> */}
                      <span className="text-white">
                        <i className="fas fa-store-alt"></i>
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {getTrimmedString(this.state.companyServices[this.state.outletCode] ? this.state.companyServices[this.props.outletCode].outlet_location : 'Loading Outlet', 10)}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    {
                      this.getUserOutletAccessList(this.props.outlets)
                        .map((item, index) => {
                          return (
                            <div key={index}>
                              <DropdownItem
                                href="/auth/login"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.props.updateOutletCode({
                                    outletCode: item.outletCode,
                                    outletTimezone: this.state.companyServices[item.outletCode] ? this.state.companyServices[item.outletCode].timezone : null
                                  });
                                  if (this.state.companyServices[item.outletCode]) {
                                    this.props.updateRoutes(getRoutesArray(this.state.companyServices[item.outletCode].services));
                                  }
                                }}
                              >
                                <span>{item.outletName}</span>
                              </DropdownItem>
                            </div>
                          );
                        })
                    }
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>

              <Nav className="align-items-center ml-auto ml-md-0" navbar style={{ cursor: 'pointer' }}>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      {/* <span className="avatar avatar-sm rounded-circle text-primary bg-white"> */}
                      <span className="text-white">
                        <i className="fas fa-user"></i>
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {this.props.name}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      href="/auth/login"
                      onClick={() => {
                        this.logoutMixpanel();
                      }}
                    >
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => { },
  sidenavOpen: false,
  theme: "dark"
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"])
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminNavbar);
