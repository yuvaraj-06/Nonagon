import React, { Component } from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

import { nodeBaseURL } from '../../ApiURL';

const moment = require('moment-timezone');

class ActionableNotifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      HygieneIndex: 0,
      diff: 0,
      rec_diff: 0,
      hi_warning: "",
      hygieneIndex_record_time: moment.tz("Asia/Kolkata").format("h:mm A"),
      peakRushHour: "",
      peakRushHourCount: 0,
    };
  }

  componentDidMount() {
    fetch(nodeBaseURL + `report/insights/${this.props.outlet}`)
      .then(response => response.json())
      .then(
        (res) => {
          this._ismounted && this.setState({
            HygieneIndex: parseFloat(res.hygieneIndex)
          });
        }
      );

    fetch(nodeBaseURL + `customercount/minmax/${this.props.outlet}/day`)
      .then(response => response.json())
      .then(
        (res) => {
          this._ismounted && this.setState({
            peakRushHour: res.max.time + ":00",
            peakRushHourCount: res.max.count
          });
        }
      );

    // initial fetch request for weeklt deviation stats
    //this.getWeekStats(this.props)

    // setting interval for fetch calls
    this.timer = setInterval(() => {
      this.compareHygieneIndex(this.props);
    }, 30000);

  }

  getWeekStats(props) {

    try {

      fetch(nodeBaseURL + `sopdeviation/weekstats/${props.compCode}/${props.compLocationCode}`)
        .then(response => response.json()
        )
        .then(
          (res) => {
            this._ismounted && this.setState({
              no_gloves_count: res.no_gloves,
              no_hairnet_count: res.no_hairnet,

            });
          }
        )
        .catch(err => {
          console.warn("ERR at componentDidMount weekstats", err);
          this.timer = null;
        });

    } catch (e) {
      console.warn("Error: ", e);
    }


  }

  compareHygieneIndex(props) {

    fetch(nodeBaseURL + `report/insights/${this.props.outlet}`)
      .then(response => response.json())
      .then(
        (res) => {

          let new_hi = res.hygieneIndex;

          let diff = new_hi - this.state.HygieneIndex;

          if (this.state.HygieneIndex === 0) {
            diff = 0;
          } else {

            diff = diff / this.state.HygieneIndex * 100;

            // show alert if current diff is even lesser than last recorded diff
            if (diff < this.state.rec_diff) {
              this._ismounted && this.setState({
                hi_warning: "Hygiene Index has not improved since last recorded 15 min ago",
                rec_diff: diff,
                insights_card_height: "230px"
              });
            }
          }

          this._ismounted && this.setState({
            HygieneIndex: new_hi,
            diff: diff,
            hygieneIndex_record_time: moment.tz("Asia/Kolkata").format("h:mm A")

          });

        }
      );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  sanatizenotification = () => {
    if (this.state.peakRushHour >= 200) {
      return (
        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
          <div className="checklist-item checklist-item-warning">
            <div className="checklist-info">
              <h5 className="checklist-title mb-0">
                {this.state.peakRushHourCount !== 0 ? this.state.peakRushHourCount : '-'} visits, Please Sanatize!
              </h5>
              <p>
                <span className="text-error" style={{ fontSize: "small", color: "red" }}>{this.state.hi_warning}</span>
              </p>
              <small>{this.state.peakRushHour}</small>
            </div>
            <div>
              <div className="custom-control custom-checkbox custom-checkbox-warning">
                <input
                  className="custom-control-input"
                  id="chk-todo-task-2"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="chk-todo-task-2"
                />
              </div>
            </div>
          </div>
        </ListGroupItem>
      );
    }
  };

  hygieneIndexnotification = () => {
    if (this.state.diff < 0) {
      return (
        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
          <div className="checklist-item checklist-item-success">
            <div className="checklist-info">
              <h5 className="checklist-title mb-0">
                Current Hygiene index is
                {this.state.HygieneIndex !== 0 ? " " + Math.round(this.state.HygieneIndex * 100) / 100 + " " : ' - '}
                and is changed by
                {this.state.diff !== 0 ? " " + Math.round(this.state.diff * 100) / 100 + " " : ' - '}
                %
              </h5>
              <p>
                <span className="text-error" style={{ fontSize: "small", color: "red" }}>{this.state.hi_warning}</span>
              </p>
              <small>{this.state.hygieneIndex_record_time}</small>
            </div>
            <div>
              <div className="custom-control custom-checkbox custom-checkbox-success">
                <input
                  className="custom-control-input"
                  defaultChecked
                  id="chk-todo-task-1"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="chk-todo-task-1"
                />
              </div>
            </div>
          </div>
        </ListGroupItem>
      );
    }
  };


  render() {
    return (
      <Card>
        <CardHeader>
          <h5 className="h3 mb-0">Actionable Notifications</h5>
        </CardHeader>

        <CardBody className="p-0">
          <ListGroup data-toggle="checklist" flush>
            {this.hygieneIndexnotification}

            {this.sanatizenotification}

          </ListGroup>
        </CardBody>
      </Card>
    );
  }
}

export default ActionableNotifications;