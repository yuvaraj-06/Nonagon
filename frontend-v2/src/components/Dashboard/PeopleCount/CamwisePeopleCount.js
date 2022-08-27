import React, { Component } from "react";

// import { Card, CardBody, Row, CardTitle, Button } from "reactstrap";

import axios from "axios";

import { nodeBaseURL } from "../../../ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

class CamwisePeopleCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: this.props.time,
            outlet: jwt_decode(localStorage.getItem('act')).outlet,
            cameraDetails: [{
                camera: 'cam_1',
                camera_location: 'Ch 04'
            },
            {
                camera: 'cam_2',
                camera_location: 'Ch 08'
            },
            {
                camera: 'cam_3',
                camera_location: 'Ch 11'
            },
            {
                camera: 'cam_4',
                camera_location: 'Ch 12'
            }],
            drange: this.props.drange,
            data: []
        };
        this._ismounted = true;
    }

    fetchCamData = () => {
        // fetchCamData = () => {
        // axios
        //     .get(
        //         nodeBaseURL +
        //         `cameras/${nextProps.outlet}`,
        //         {
        //             headers: {
        //                 'Authorization': `bearer ${localStorage.getItem('act')}`
        //             }
        //         }
        //     )
        //     .then((res) => {
        // await this._ismounted && this.setState({
        //     // cameraDetails: res.data
        //     cameraDetails: res.data
        // });
        this.state.cameraDetails.map(i => this.fetchData(this.state, i))
        // })
        // .catch(err => {

        // });
    }

    fetchData = (nextProps, cam) => {
        axios
            .get(
                nodeBaseURL +
                `customers/cam/${nextProps.outlet}/${nextProps.time}/${cam.camera}`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `bearer ${localStorage.getItem('act')}`

                    }
                }
            )
            .then((res) => {
                var x = res.data
                x.cam_name =
                    this._ismounted && this.setState({
                        data: [...this.state.data, res.data]
                    });
            })
            .catch(err => {

            });
    }

    componentDidMount() {
        this.fetchCamData(this.state);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.time !== nextProps.time) {
            this._ismounted && this.setState({
                time: nextProps.time,
            });
            this.fetchCamData(this.state);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div></div>
            // <Card>
            //     <CardBody className='text-left'>
            //         <Row>
            //             <div className="col-center">
            //                 <CardTitle className='h5 ml-4'>
            //                     Camera wise People Count
            //                 </CardTitle>
            //             </div>
            //         </Row>
            //         <Row className='ml-4'>
            //             {this.state.data.map((i, key) => {
            //                 return (
            //                     <div className='text-center' key={key}>
            //                         <Button style={{ borderRadius: 30 }} size='sm' color='orange' className='h6 text-white mr-4 mb-4 circle bg-gradient-orange'>
            //                             <span>
            //                                 {i.people_count_avg.toFixed(0)}
            //                                 <br></br>
            //                                 {this.state.cameraDetails[key].camera_location}
            //                             </span>
            //                         </Button>
            //                     </div>
            //                 )
            //             })}
            //         </Row>
            //     </CardBody>
            // </Card >
        );
    }
}

//export default CamwisePeopleCount;

export default connect(
    mapStateToProps,
)(CamwisePeopleCount);