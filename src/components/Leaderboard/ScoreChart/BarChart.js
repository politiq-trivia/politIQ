import React, { Component } from 'react';
import moment from 'moment';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3';
import { Element } from 'react-faux-dom';
import { db } from '../../../firebase';

import ResponsiveChart from './ChartWrapper';
import "./Axis.css";

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Democrat: 0,
          Republican: 0,
          Independent: 0,
          containerWidth: 600,
          loading: true,
        }
        this.xScale = scaleLinear();

        this.yScale = scaleBand();
      }
    
      componentDidMount = () => {
        this.getScores(this.props.timeFrame)
        this.getQuizzes(this.props.timeFrame)
        this.fitParentContainer();
      }

      componentDidUpdate(prevProps) {
        if (prevProps.timeFrame !== this.props.timeFrame) {
          this.getScores(this.props.timeFrame)
          this.getQuizzes(this.props.timeFrame)
          return true;
        } else {
          return false;
        }
      }

      getQuizzes = async (timeFrame) => {
        await db.getQuizzes()
          .then(response => {
            const data = response.val()
            const quizDates = Object.keys(data)
            let quizCounter = 0;
            for (let i = 0; i < quizDates.length; i++) {
              if (quizDates[i] > moment().startOf(timeFrame).format('YYYY-MM-DD')) {
                quizCounter += 1
              }
            }
            this.setState({
              numQuizzes: quizCounter,
            })
          })
      }

      getScores = async (timeFrame) => {
        await db.getScores()
          .then(response => {
            const data = response.val()
            this.getDemScores(data, 'Democrat', timeFrame)
            this.getDemScores(data, 'Republican', timeFrame)
            this.getDemScores(data, 'Independent', timeFrame)
          })
          .then(() => {
            this.setState({
              loading: false
            })
          })
      }
    
      getDemScores = async (data, affiliation, timeFrame) => {
        if (data === null) {return;}
        const userScores = []
        await db.getUserByAffiliation(affiliation)
          .then(usernames => {
            const numUsers = Object.keys(usernames).length;
            usernames.forEach((user, i) => {
              const dateObject = data[usernames[i]]
              let quizDates = []
              let submitted = []
              if (dateObject !== undefined) {
                quizDates = Object.keys(dateObject)
                // submitted scores don't get counted in the original monthly score
                if (quizDates[quizDates.length -1] === 'submitted') {
                  submitted = dateObject["submitted"]
                  quizDates.pop()
                }
              }
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().startOf(timeFrame).format('YYYY-MM-DD')) {
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              // getting the submitted scores from the last month and adding them to the total user score
              if (submitted !== []) {
                const dates = Object.keys(submitted)
                for (let j = 0; j < dates.length; j++) {
                  if (dates[j].slice(10) > moment().startOf(timeFrame).format('YYYY-MM-DD')) {
                    scoreCounter += 1
                  }
                }
              }
              userScores.push(scoreCounter)
            })
            const totalScore = userScores.reduce((a, b) => a + b, 0);
            // const totalAverageScore = totalScore / (this.state.numQuizzes * 5)
            const lengthLabel = affiliation + "length"
            this.setState({
              [affiliation]: totalScore,
              [lengthLabel]: numUsers,
            })
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
      const data = [
        { party: 'D', score: (((this.state.Democrat * this.state.Democratlength) / this.state.Democratlength).toString()) },
        { party: 'R', score: ((this.state.Republican * this.state.Republicanlength) / this.state.Republicanlength)},
        { party: 'I', score: ((this.state.Independent * this.state.Independentlength) / this.state.Independentlength)},
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
        .attr('fill', '#000')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .text('Party PolitIQs')
    }

    drawChart() {
      const margin = { top: 40, right: 100, bottom: 100, left: 100 };
      const width = this.state.containerWidth;
      const height = 300;
      
      const el = new Element('div');
      const svg = d3.select(el)
        .append('svg')
        .attr('id', 'chart')
        .attr('width', width)
        .attr('height', height)

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
              ? <p>Loading...</p>
              : <>{isNaN(this.state.Republican) && isNaN(this.state.Democrat) && isNaN(this.state.Independent) ? null : this.drawChart()}</>
            }
          </>
        )
    }

}

export default ResponsiveChart(BarChart);