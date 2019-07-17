import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { Element } from 'react-faux-dom';
import { db } from '../../../firebase';
import { getPolitIQ } from '../../../utils/calculatePolitIQ';

import ResponsiveChart from './ChartWrapper';
import LoadingGif from '../../../6.gif';
import "./Axis.css";

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Democrat: 0,
          Republican: 0,
          Independent: 0,
          containerWidth: 250,
          loading: true,
        }
        this.xScale = scaleLinear();

        this.yScale = scaleBand();
      }
    
      componentDidMount = () => {
        this.getScores(this.props.timeFrame)
        this.fitParentContainer();
      }

      getScores = async (timeFrame) => {
        const scores = JSON.parse(localStorage.getItem('allScores'))
        let uidArray = [];

        for (let i = 0; i < scores.data.length; i++) {
          uidArray.push(scores.data[i].user)
        }
        this.sortUserByAffiliation(uidArray)
      }

      sortUserByAffiliation = async (data) => {
        // the data is an array of UIDs. 
        let republicans = [];
        let democrats = [];
        let independents = [];
        let i = 0;
        while (i < data.length) {
          const user = data[i]
          const rawAffiliation = await db.getAffiliation(user)
          const affiliation = rawAffiliation.val()
          if (affiliation === "Republican") {
            republicans.push(user)
          } else if (affiliation === "Democrat") {
            democrats.push(user)
          } else if (affiliation === "Independent") {
            independents.push(user)
          }
          i++
        }
        this.getAvgPolitIQs('Democrat', democrats)
        this.getAvgPolitIQs('Republican', republicans)
        this.getAvgPolitIQs('Independent', independents)

        this.setState({
          loading: false,
        })
      }

      getAvgPolitIQs = async (affiliation, data) => {
        // data is an array of uids
        const numUsers = data.length;
        let totalPolitIQs = 0;
        let i = 0;
        while (i < data.length) {
          const politIQ = await getPolitIQ(data[i])
          totalPolitIQs += politIQ
          i++
        }
        const avgPolitIQ = Math.round(totalPolitIQs / numUsers)
        this.setState({
          [affiliation]: avgPolitIQ
        })
      }

      fitParentContainer() {
        const { containerWidth } = this.state
        const currentContainerWidth = window.innerWidth * 0.9

        const shouldResize = containerWidth !== (currentContainerWidth)

        if (window.innerWidth > 600) {
          return;
        } else if (shouldResize) {
            this.setState({
                containerWidth: currentContainerWidth,
            })
        }
    }

    plot(chart, width, height, margin) {
      // the data should be average score for each team - the score divided by the number of people on each team.
      const data = [
        { party: 'D', score: this.state.Democrat },
        { party: 'R', score: this.state.Republican},
        { party: 'I', score: this.state.Independent},
      ]

      const maxValue = Math.max(...data.map(d => d.score));

      const xScale = d3.scaleBand()
        .domain(data.map(d => d.party))
        .range([0, width])

      const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0])

      const colorScale = d3.scaleOrdinal(['blue', 'red', 'green'])

      chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('x', d => xScale(d.party))
        .attr('y', d => yScale(d.score))
        .attr('height', d => (height - yScale(d.score)))
        .attr('width', d => xScale.bandwidth())
        .style('fill', (d, i) => colorScale(i))

      chart.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .classed('bar-label', true)
        .attr('x', d => xScale(d.party) + xScale.bandwidth()/2)
        .attr('dx', 0)
        .attr('y', d => yScale(d.score))
        .attr('dy', -6)
        .text(d => {
          if (d.score === 0 || isNaN(d.score)) return null
          else return d.score.toString().split('.')[0]
        })

      const xAxis = d3.axisBottom()
          .ticks(3)
          .scale(xScale)

      chart.append('g')
          .classed('x axis', true)
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis)
      
      chart.select('.x.axis')
        .append('text')
        .attr('x', width/2)
        .attr('y', 60)
        .attr('fill', 'white')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .text('Average Party PolitIQs')
    }

    drawChart() {
      const margin = { top: 40, right: 0, bottom: 100, left: 0 };
      const width = this.state.containerWidth;
      const height = 300;
      
      const el = new Element('div');
      const svg = d3.select(el)
        .append('svg')
        .attr('id', 'chart')
        .attr('width', width)
        .attr('height', height)
        .classed('chartHolder', true)

      const chart = svg.append('g')
        .classed('display', true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      this.plot(chart, chartWidth, chartHeight, margin)

      return el.toReact();
    }


    render () {
        return (
          <>
            {this.state.loading 
              ? <div className="chartHolder"><img src={LoadingGif} alt="loading" /></div>
              : <div>{isNaN(this.state.Republican) && isNaN(this.state.Democrat) && isNaN(this.state.Independent) ? null : this.drawChart()}</div>
            }
          </>
        )
    }

}

export default ResponsiveChart(BarChart);