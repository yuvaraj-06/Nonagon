import React, { Component } from "react";

import { Card, CardBody, CardHeader, Button, Form, FormGroup } from "reactstrap";

import axios from 'axios';
import { nodeBaseURL } from "ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode
    };
};

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `customers_attended/list/${nextProps.outletCode}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((result) => {

                const sampleData = {
                    yesterday: '20',
                    day: '10'
                };

                this.setState({ inputValue: sampleData[nextProps.time] });
            })
            .catch(console.log);
    };

    inputChangeHandler(e) {
        this.setState({ inputValue: e.target.value });
    }

    formSubmitHandler(e) {
        e.preventDefault();
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.time !== nextProps.time) {
            this.fetchData(nextProps);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <span className="h4">
                            Customer Conversion Form
                        </span>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '400px' }}>
                                <Card>
                                    <CardHeader>
                                        <span className="h4">
                                            Number of bills
                                        </span>
                                    </CardHeader>
                                    <CardBody>
                                        <Form onSubmit={this.formSubmitHandler.bind(this)}>
                                            <FormGroup>
                                                <input type="text" className="form-control form-control-muted" placeholder="Enter the number of bills" onChange={this.inputChangeHandler.bind(this)} value={this.state.inputValue} />
                                            </FormGroup>
                                            <Button color="primary" type="submit">
                                                Submit
                                            </Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

//export default Graph;

export default connect(
    mapStateToProps,
)(Graph);;