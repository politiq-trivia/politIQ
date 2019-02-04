import React, { Component } from 'react';

export default class Bars extends Component {
    render() {
        const { xScale, yScale, margin, data } = this.props

        const colors = ['#0000ff', '#ff0000', '#009933']
        const bars = (
            data.map((d, i) => 
                <rect 
                    key={d.party}
                    x={margin.left}
                    y={yScale(d.party)}
                    height={yScale.bandwidth()}
                    width={xScale(d.score) - margin.left}
                    fill={colors[i]}
                />
            )  
        )


        return (
            <g>{bars}</g>
        )
    }
}