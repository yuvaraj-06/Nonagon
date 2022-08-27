import React, { Component } from 'react'

import {
    Button
} from 'reactstrap'
import { connect } from 'react-redux';
import { updateTimeSelect } from '../../redux'

const mapStateToProps = (state) => {
    return {
        time: state.time.time
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTimeSelect: (payload) => {
            dispatch(updateTimeSelect(payload))
        }
    };
}

const returnButtonColorArray = (time) => {
    var id = time === 'day' ? 0 : time === 'yesterday' ? 1 : time === 'week' ? 2 : time === 'month' ? 3 : 0
    var colors = ["info", "info", "info", "info"]
    colors[id] = "secondary"
    return colors
}

class TimeSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            time: props.time,
            colors: returnButtonColorArray(props.time),
        }
        this._ismounted = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this._ismounted && this.setState({
            time: nextProps.time,
            colors: returnButtonColorArray(nextProps.time)
        })
    }
    componentWillUnmount() { // delete the interval just before component is removed
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <Button
                    color={this.state.colors[0]}
                    size="sm"
                    onClick={e => {
                        e.preventDefault()
                        this.props.updateTimeSelect('day')
                    }
                    }
                >
                    Today
                </Button>
                <Button
                    color={this.state.colors[1]}
                    size="sm"
                    onClick={e => {
                        e.preventDefault()
                        this.props.updateTimeSelect('yesterday')
                    }
                    }
                >
                    Yesterday
                </Button>
                <Button
                    color={this.state.colors[2]}
                    size="sm"
                    onClick={e => {
                        e.preventDefault()
                        this.props.updateTimeSelect('week')
                    }
                    }
                >
                    Last 7 Days
                </Button>
                <Button
                    color={this.state.colors[3]}
                    size="sm"
                    onClick={e => {
                        e.preventDefault()
                        this.props.updateTimeSelect('month')
                    }
                    }
                >
                    Last 30 Days
                </Button>
            </>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeSelect);