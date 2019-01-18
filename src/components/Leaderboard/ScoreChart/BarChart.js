import React, { Component } from 'react';
import moment from 'moment';
import { scaleBand, scaleLinear } from 'd3-scale';
import { db } from '../../../firebase';

import Axis from './Axis';
import Bars from './Bars';
import ResponsiveChart from './ChartWrapper';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Democrat: 0,
          Republican: 0,
          Independent: 0,
        }
        this.xScale = scaleBand();
        this.yScale = scaleLinear();
      }
    
      componentDidMount = () => {
        this.getScores(this.props.timeFrame)
        this.getQuizzes(this.props.timeFrame)
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
            const lengthLabel = affiliation + "length"
            this.setState({
              [affiliation]: totalScore,
              [lengthLabel]: numUsers,
            })
          })
      }

    render () {
        const margin = { top: 10, right: 20, bottom: 60, left: 30 };
        const width = 300;
        const height = 600;

        const data = [
          { party: 'Democrat', score: (this.state.Democrat / this.state.Democratlength) },
          { party: 'Republican', score: (this.state.Republican / this.state.Republicanlength) },
          { party: 'Independent', score: (this.state.Independent / this.state.Independentlength) },
        ]

        const maxValue = Math.max(...data.map(d => d.score));
        // const maxValue = this.state.numQuizzes * 5;

        const xScale = this.xScale
          .padding(0.5)
          .domain(data.map(d => d.party))
          .range([margin.left, width - margin.right])

        const yScale = this.yScale
          .domain([0, maxValue])
          .range([height - margin.bottom, margin.top])

        const xProps = {
          orient: 'Bottom',
          scale: xScale,
          translate: `translate(0, ${height - margin.bottom})`,
          tickSize: height - margin.top - margin.bottom,
        }

        const yProps = {
          orient: 'Left',
          scale: yScale,
          translate: `translate(${margin.left}, 0)`,
          tickSize: width - margin.left - margin.right,
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <div style={{ transform: 'rotate(-180deg)' }}>
              <p style={{ writingMode: 'vertical-rl', height: '100%', fontWeight: 'bold' }}>Average Score</p>

            </div>
            <svg id="chart" width={width} height={height}>
                <Axis {...xProps}/>
                <Axis {...yProps} />
                <Bars 
                  xScale={xScale}
                  yScale={yScale}
                  margin={margin}
                  data={data}
                  maxValue={maxValue}
                  height={height}
                  width={width}
                />

            </svg>
          </div>
            // <Chart
            //     width={'450px'}
            //     height={'75px'}
            //     chartType="BarChart"
            //     loader={<div>Loading</div>}
            //     data={[
            //         [
            //             'Team', 
            //             'Score', 
            //             { role: 'style' },
            //             {
            //                 sourceColumn: 0,
            //                 role: 'annotation',
            //                 type: 'string',
            //                 calc: 'stringify',
            //             },
            //         ],
            //         ['Democrats', this.state.Democrat, 'blue', null],
            //         ["Republicans", this.state.Republican, 'red', null],
            //         ["Independents", this.state.Independent, 'green', null]
            //     ]}
            //     options={{
            //         chartArea: { width: '65%'},
            //         hAxis: {
            //             minValue: 0,
            //         },
            //         legend: { position: 'none' }
            //     }}
            //     className="barChart"
            // />
        )
    }

}

export default ResponsiveChart(BarChart);