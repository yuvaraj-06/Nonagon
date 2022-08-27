import React, { Component } from 'react';
import {
    ReactPictureAnnotation,
    defaultShapeStyle,
    DefaultInputSection
} from "react-picture-annotation";

import {
    Row,
    Col,
    Button,
    // Input,
    Form,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";

class CustomSOP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            imgs: null,
            buttonToggle: "none",
            selectId: "",
            data: [],
            msg: ""
        };
    }

    onSelect = (selectId) => {
        // console.log(selectId)
        // this._ismounted && this.setState({
        //     selectId: selectId
        // })
    };

    onChange = (data) => {
        // console.log(data)
        // this._ismounted && this.setState({
        //     data: data
        // })
    };

    handleInputChange = (e) => {
        this._ismounted && this.setState({
            imgs: e.target.files,
            buttonToggle: "block"
        });
    };

    onSubmit = () => {
        this._ismounted && this.setState({
            msg: "Annotation Submitted",
            buttonToggle: "none"
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <h3 className="mb-0">File browser</h3>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="custom-file">
                                        <input
                                            className="custom-file-input"
                                            id="customFileLang"
                                            lang="en"
                                            type="file"
                                            accept="image/*"
                                            multiple="true"
                                            onChange={this.handleInputChange}
                                        />
                                        <label
                                            className="custom-file-label"
                                            htmlFor="customFileLang"
                                        >
                                            Select file
                                        </label>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h3 className="mb-0">Image</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="p-3">
                                    <ReactPictureAnnotation
                                        image={(this.state.imgs !== null) ? URL.createObjectURL(this.state.imgs[0]) : this.state.imgs}
                                        onSelect={this.onSelect}
                                        onChange={this.onChange}
                                        width={this.state.width}
                                        height={this.state.height}
                                        annotationStyle={{
                                            ...defaultShapeStyle,
                                            shapeStrokeStyle: "#c421ff",
                                            transformerBackground: "black"
                                        }}
                                        inputElement={(value, onChange, onDelete) => (
                                            <DefaultInputSection
                                                placeholder={"Tag/ Class"}
                                                {...{ value, onChange, onDelete }}
                                            />
                                        )}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <div >
                            <center>
                                <Button style={{ display: this.state.buttonToggle }} onClick={this.onSubmit}>
                                    Submit Annotation
                                </Button>
                            </center>
                        </div>
                    </Col>
                </Row>
                <p style={{ "textColor": '#1d8cf8' }}>{this.state.msg}</p>
            </div>
        );
    }
}
export default CustomSOP;