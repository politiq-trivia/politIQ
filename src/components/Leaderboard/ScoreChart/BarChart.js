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

      const yScale = this.yScale
        .padding(0.5)
        .domain(data.map(d => d.party))
        .range([0, height])

      const xScale = this.xScale
        .domain([0, maxValue])
        .range([0, width])

      const colorScale = d3.scaleOrdinal(['blue', 'red', 'green'])

      chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('x', d => {
          if (isNaN(d.score)) return 0
          else return width - xScale(d.score) + margin.right
        })
        .attr('y', d => yScale(d.party))
        .attr('height', d => yScale.bandwidth())
        .attr('width', d => {
          if (isNaN(d.score)) return 0
          else return xScale(d.score) - margin.right;
        })
        .style('fill', (d, i) => colorScale(i))

      chart.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .classed('bar-label', true)
        .attr('x', d => {
          if (isNaN(d.party)) return 0
          else return xScale(d.party)
        })
        .attr('dx', d => {
          if (isNaN(d.score)) return 0
          else return width - xScale(d.score) + 65
        })
        .attr('y', d => {
            if (isNaN(d.score)) {
              return 0
            } else return yScale(d.score) + yScale.bandwidth() / 2
          })
        .attr('dy', (d, i) => yScale(d.party) + (yScale.bandwidth() / 2) + 6)
        .text(d => {
          if (d.score === 0 || isNaN(d.score)) return null
          else return d.score.toString().split('.')[0]
        })

      const yAxis = d3.axisRight()
          .ticks(3)
          .scale(yScale)

      chart.append('g')
          .classed('y-axis', true)
          .attr('transform', `translate(${width}, 0)`)
          .call(yAxis)
    }

    drawChart() {
      const margin = { top: 40, right: 100, bottom: 60, left: 100 };
      const width = this.state.containerWidth;
      const height = 250;
      
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