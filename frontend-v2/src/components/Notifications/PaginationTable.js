import React from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

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

class PaginationTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
        }
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                data: nextProps.data
            })
        }
    }

    render() {
        return (
            <>
                {
                    this.state.data.length === 0 ?
                        <span className='text-left h3'>You don't have any new notifications.</span>
                        :
                        <ToolkitProvider
                            data={this.state.data}
                            keyField="sno"
                            columns={[
                                {
                                    dataField: "sno",
                                    text: "S. No.",
                                    sort: false,
                                },
                                {
                                    dataField: "title",
                                    text: "Title",
                                    sort: false,
                                },
                                {
                                    dataField: "suspicion",
                                    text: "Suspicion",
                                    sort: false,
                                },
                                {
                                    dataField: "detail",
                                    text: "Detail",
                                    sort: false,
                                },
                                {
                                    dataField: "cam",
                                    text: "Camera",
                                    sort: false,
                                },
                                {
                                    dataField: "detected",
                                    text: "Detected At",
                                    sort: false,
                                },
                                {
                                    dataField: "action",
                                    text: "Action",
                                    sort: false,
                                },
                            ]}
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
                }
            </>
        )
    }
}

export default PaginationTable