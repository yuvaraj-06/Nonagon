import React from "react";
// import {
//     Container
// } from 'reactstrap'

// import Dashheader from 'components/Headers/DashheaderNTS'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import VideoPlayback from "components/VideoPlayback/VideoPlayback";
class VideoPlaybackTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Video Playback Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Video Playback Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Video Playback Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                {/* <Dashheader title="Video Playback" />
                <Container className="mt--6" fluid> */}
                <ErrorBoundary>
                    <VideoPlayback />
                </ErrorBoundary>
                {/* </Container> */}
            </>
        );
    }
}

export default VideoPlaybackTab;
