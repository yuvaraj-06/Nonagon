import React, { Component } from "react";

import { Card, CardBody, Row, Button, Modal } from "reactstrap";
import { getConvertedTime, onlyDateFormat } from 'utilFunctions/getConvertedTime'

class AwardCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
        };
        this._ismounted = true;
    }


    componentWillUnmount() {
        this._ismounted = false;
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });
    };

    render() {
        return (
            <div>
                <Card className="col">
                    <CardBody>
                        <Row>
                            <img src={this.props.awardDetails.img} alt='Award' height='100%' width='100%' />
                        </Row>
                        <Row>
                            <div className='h4'>
                                {this.props.awardDetails.awardTitle}
                                <br />
                                <span className='h6 text-muted'>
                                    {this.props.awardDetails.awardDate !== null ? `Achieved on: ${getConvertedTime(this.props.awardDetails.awardDate, this.props.outletTimezone, onlyDateFormat)}` : null}
                                </span>
                            </div>
                        </Row>
                        <Row>
                            <div className="h6 text-muted">{this.props.BadgeDesc}</div>
                        </Row>
                        <div className="mt-2 mb-0 text-sm">
                            <div className="mt-1">
                                <Button
                                    color="secondary"
                                    outline
                                    type="button"
                                    size="sm"
                                    onClick={() => this.toggleModal("exampleModal")}
                                >
                                    <span className="text-info">
                                        What's Next ?
                                    </span>{" "}
                                </Button>
                            </div>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={this.state.exampleModal}
                                toggle={() => this.toggleModal("exampleModal")}
                                size="lg"
                            >
                                <div className="modal-header award-modal-header">
                                    <span>
                                        <h4 className="modal-title" id="exampleModalLabel">
                                            {this.props.awardDetails.awardTitle}
                                        </h4>
                                        <br />
                                    </span>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() => this.toggleModal("exampleModal")}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <div className="modal-body award-modal-content">
                                    <div className="award-modal-category">
                                        Next Award:
                                        <span className={`${this.props.awardDetails.awardFormula.category}`}> {this.props.awardDetails.awardFormula.category}</span>
                                    </div>
                                    <div className="award-modal-text">{this.props.awardDetails.awardFormula.text}</div>
                                </div>
                            </Modal>
                        </div>
                    </CardBody>
                </Card>
            </div>

        )
    }
}


export default AwardCards;


