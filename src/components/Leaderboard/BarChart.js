import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import moment from 'moment';
import { db } from '../../firebase';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Democrat: 0,
          Republican: 0,
          Independent: 0,
        }
      }
    
      componentDidMount = () => {
        this.getScores()
      }

      getScores = async () => {
        await db.getScores()
          .then(response => {
            const data = response.val()
            this.getDemScores(data, 'Democrat')
            this.getDemScores(data, 'Republican')
            this.getDemScores(data, 'Independent')
          })
      }
    
      getDemScores = async (data, affiliation) => {
        const userScores = []
        await db.getUserByAffiliation(affiliation)
          .then(usernames => {
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
                if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              // getting the submitted scores from the last month and adding them to the total user score
              if (submitted !== []) {
                const dates = Object.keys(submitted)
                for (let j = 0; j < dates.length; j++) {
                  if (dates[j].slice(10) > moment().startOf('month').format('YYYY-MM-DD')) {
                    scoreCounter += 1
                  }
                }
              }
              userScores.push(scoreCounter)
            })
            const totalScore = userScores.reduce((a, b) => a + b, 0);
            this.setState({
              [affiliation]: totalScore
            })
          })
      }

    render () {
        return (
            <Chart
                width={'450px'}
                height={'75px'}
                chartType="BarChart"
                loader={<div>Loading</div>}
                data={[
                    [
                        'Team', 
                        'Score', 
                        { role: 'style' },
                        {
                            sourceColumn: 0,
                            role: 'annotation',
                            type: 'string',
                            calc: 'stringify',
                        },
                    ],
                    ['Democrats', this.state.Democrat, 'blue', null],
                    ["Republicans", this.state.Republican, 'red', null],
                    ["Independents", this.state.Independent, 'green', null]
                ]}
                options={{
                    chartArea: { width: '65%'},
                    hAxis: {
                        minValue: 0,
                    },
                    legend: { position: 'none' }
                }}
                className="barChart"
            />
        )
    }

}

export default BarChart;