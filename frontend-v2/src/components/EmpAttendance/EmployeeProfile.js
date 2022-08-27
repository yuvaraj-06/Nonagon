import React from "react"
import {
    Card,
    CardBody,
} from "reactstrap"
import axios from "axios"
import { nodeBaseURL } from "ApiURL"

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

class EmployeeProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            empId: "",
            name: '',
            outlet: '',
            address: '',
            dob: '23-12-2020',
            mobNo: '7483902223',
            image: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
            age: "22"
        }
        this._ismounted = true;
        // this.calculateAge(new Date(this.state.dob).toUTCString());
    }

    calculateAge(birthday) {
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        this._ismounted && this.setState({
            age: age
        })
    }

    componentDidMount() {
        this._ismounted && axios.get(
            nodeBaseURL +
            `employee/find?employee_id=${this.props.empId}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                this._ismounted && this.setState({
                    name: res.data.name,
                    empId: res.data.employee_id,
                    outlet_code: res.data.outlet_code,
                    mobNo: res.data.mobile_no,
                    position: res.data.position
                })
            })
    }
    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Card className="card-profile shadow">
                    <CardBody className="pt-0 pt-md-4">
                        {/* <Row>
                            <div className="col">
                                <div className="card-profile-image">
                                    <a href="#pablo" onClick={e => e.preventDefault()}>
                                        <img
                                            alt="Employee"
                                            className="rounded-circle"
                                            src={this.state.image}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Row>
                        <br /><br /><br /><br /> */}
                        <div className="text-center">
                            <h3>Employee Profile</h3>
                            <h3>
                                {this.state.name}
                                {/* <span className="font-weight-light"> , {this.state.age}</span> */}
                            </h3>
                            <div>
                                <span className="description h3">Mobile Number  </span>
                                <span>{this.state.mobNo}</span>

                            </div>
                            <div>
                                <span className="description h3">Employee ID  </span>
                                <span>{this.state.empId}</span>

                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}


export default connect(
    mapStateToProps,
)(EmployeeProfile);