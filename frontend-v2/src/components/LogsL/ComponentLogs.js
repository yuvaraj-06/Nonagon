import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import ReactBSAlert from "react-bootstrap-sweetalert";
import {
    Card, CardHeader, Row, Col,
    // Button
} from "reactstrap";
// import { CSVLink } from "react-csv";

const pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: true,
    showTotal: true,
    withFirstAndLast: false,
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
        <div className="dataTables_length" id="datatable-basic_length">
            <label>
                Show{" "}
                {
                    <select
                        name="datatable-basic_length"
                        aria-controls="datatable-basic"
                        className="form-control form-control-sm"
                        onChange={(e) => onSizePerPageChange(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                }{" "}
                entries.
            </label>
        </div>
    ),
});

class ComponentLogs extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     data: this.props.data || []
        // }
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    // this function will copy to clipboard an entire table,
    // so you can paste it inside an excel or csv file
    copyToClipboardAsTable = (el) => {
        var body = document.body,
            range,
            sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
            document.execCommand("copy");
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
            range.execCommand("Copy");
        }
        this._ismounted && this.setState({
            alert: (
                <ReactBSAlert
                    success
                    style={{ display: "block", marginTop: "-100px" }}
                    title="Good job!"
                    onConfirm={() => this._ismounted && this.setState({ alert: null })}
                    onCancel={() => this._ismounted && this.setState({ alert: null })}
                    confirmBtnBsStyle="info"
                    btnSize=""
                >
                    Copied to clipboard!
                </ReactBSAlert>
            ),
        });
    };

    render() {
        return (
            <>
                <Row >
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <h3 className="mb-0">{this.props.logsName} Logs ({this.props.logsData.length})</h3>
                                    </Col>
                                    <Col className='text-right'>
                                        {/* {
                                            this.props.logsData.length !== 0 ?
                                                <CSVLink
                                                    style={{ textDecoration: "none" }}
                                                    data={this.props.logsData}
                                                    ref={(r) => (this.surveyLink = r)}
                                                    filename={
                                                        this.props.logsName + " Logs " + new Date().toLocaleDateString("en-GB") +
                                                        " " +
                                                        new Date().toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }) +
                                                        ".csv"
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button size='sm' color='primary'>Download</Button>
                                                </CSVLink>
                                                :
                                                <span className='h4 text-muted'>Nothing to Download</span>
                                        } */}
                                    </Col>

                                </Row>
                                <Row>
                                    <h4 className="float-left h4 text-muted mt-4 ml-3">
                                        ({this.props.daterange})
                                    </h4>
                                </Row>
                            </CardHeader>
                            <ToolkitProvider
                                data={this.props.logsData}
                                keyField="timestamp"
                                columns={this.props.logsColumnInfo}
                                search
                            >
                                {(props) => (
                                    <div className="py-4 table-responsive">
                                        <BootstrapTable
                                            {...props.baseProps}
                                            bootstrap4={true}
                                            pagination={pagination}
                                            bordered={false}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default ComponentLogs;
