import React, { Component } from 'react'
import { Replay } from "vimond-replay";
import "vimond-replay/index.css";
import HlsjsVideoStreamer from "vimond-replay/video-streamer/hlsjs";

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        outletCode: state.outletCode.outletCode,
        companyServices: state.services.companyServices
    };
}

const replayOptions = {
    videoStreamer: {
        hlsjs: {
            customConfiguration: {
                capLevelToPlayerSize: true,
                maxBufferLength: 200,
                liveDurationInfinity: true
            }
        }
    }
};

class HLSFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cam_no: 'live',
            outletCode: props.outletCode,
            companyServices: props.companyServices,
        }
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                cam_no: nextProps.cam_no,
                outletCode: nextProps.outletCode,
                companyServices: nextProps.companyServices
            })
        }
    }

    render() {
        return (
            this._ismounted &&
            <Replay
                source={`https://stream.nonagon.ai/hls/${this.state.outletCode}_${this.state.cam_no}.m3u8`}
                options={replayOptions}>
                <HlsjsVideoStreamer />
            </Replay>
        )
    }
}

export default connect(
    mapStateToProps
)(HLSFeed)