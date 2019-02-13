import React, { Component } from 'react';
import { db } from '../../firebase';
import { getPolitIQ } from '../../utils/calculatePolitIQ';

import Card from '@material-ui/core/Card';

class HighestScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            highScore: 0,
        }
    }

    componentDidMount() {
        this.getUsersWithScores(this.props.timeFrame)
    }

    calculateHighestPolitIQ = async (usernames, timeframe) => {
        let politIQs = [];
        let politObjects = [];

        for (let i = 0; i < usernames.length; i++) {
            const politIQ = await getPolitIQ(usernames[i], timeframe)
            console.log({politIQ}, 'this is the politIQ for each user')
            politIQs.push(
                // username: usernames[i],
                politIQ
            )
            politObjects.push({
                username: usernames[i],
                politIQ,
            })
        }

        console.log(politIQs, 'politIQs')
        console.log({timeframe})

        // return the one that is the highest.
        const max = Math.max(...politIQs);

        // if there are no scores, return
        if (max === 0) {
            this.setState({
                highScore: 0,
            })
            return;
        }
        const index = politIQs.indexOf(max)
        db.getDisplayNames(usernames[index])
            .then((response) => {
                const data = response.val()
                const name = data.displayName;
                this.setState({
                    highScore: max,
                    name,
                })
                console.log(data.displayName, 'this should be a name')
            })
    }

    getUsersWithScores = async (timeframe) => {
        await db.getScores()
        .then((response) => {
            const data = response.val();
            const usernames = Object.keys(data);
            this.calculateHighestPolitIQ(usernames, timeframe)
        })
    }

    render() {
        return (
            <>
                {this.state.highScore !== 0
                    ?
                     <Card style={{ paddingBottom: '4vh', width: '40%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h2>Highest PolitIQ this {this.props.timeFrame}:</h2>
                        <div className="highScoreHolder">
                            <h1>{this.state.name}</h1>
                            <h1>{this.state.highScore}</h1>
                        </div>
                      </Card>
                     : null
                }
            </>
        )
    }
}

export default HighestScore;