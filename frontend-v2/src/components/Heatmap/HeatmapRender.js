import React, { Component } from 'react';
import h337 from 'heatmap.js'
import Image from './road.jpeg'

class HeatmapRender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeatmap: false,
            points: this.props.points,
        }
    }

    toggleHeatmap = () => {
        this.state.showHeatmap ? this.setState({ showHeatmap: false }) : this.setState({ showHeatmap: true })
    }

    handleHeatmap = () => {
        let heatmapInstance = h337.create({
            container: document.querySelector(".heatmap"),
            gradient: {
                "1": "blue"
            },
            opacity: 0.5
        });

        let data = {
            max: 500,
            min: 0,
            data: this.state.points
        };
        heatmapInstance.setData(data);
    }

    componentDidMount() {
        this.handleHeatmap()
    }

    render() {
        return (
            <div>
                {/* <Button onClick={this.toggleHeatmap}>showHeatMap</Button> */}
                <div className='heatmap' id='heatmap-div'>
                    <img src={Image} alt="road" height='500' width='500' />
                </div>
            </div>
        );
    }
}

export default HeatmapRender;