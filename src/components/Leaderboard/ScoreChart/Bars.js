import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

export default class Bars extends Component {
    constructor(props) {
        super(props)

        this.colorScale = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#ff0000', '#0000ff', '#009933'])
            .interpolate(interpolateLab)
        
    }

    render() {
        const { xScale, yScale, margin, data, height } = this.props

        const colors = ['#0000ff', '#ff0000', '#009933']
        const bars = (
            data.map((d, i) => 
                <rect 
                    key={d.party}
                    x={xScale(d.party)}
                    y={yScale(d.score)}
                    height={height - margin.bottom - yScale(d.score)}
                    width={xScale.bandwidth()}
                    fill={colors[i]}
                />,
            )
        )

        return (
            <g>{bars}</g>
        )
    }
}