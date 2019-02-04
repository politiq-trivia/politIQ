import React, { Component } from 'react';
import { db } from '../../firebase';
import { getPolitIQ } from '../../utils/calculatePolitIQ';

class HighestScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            highScore: 0,
        }
    }

    componentDidMount() {
        this.getUsersWithScores(this.props.timeframe)
    }

    calculateHighestPolitIQ = async (usernames, timeframe) => {
        let politIQs = [];
        let politObjects = [];

        for (let i = 0; i < usernames.length; i++) {
            const politIQ = await getPolitIQ(usernames[i], timeframe)
            politIQs.push(
                // username: usernames[i],
                politIQ
            )
            politObjects.push({
                username: usernames[i],
                politIQ,
            })
        }

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
                    ? <div style={{ border: '1px solid black', padding: '1vh', width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: "2vh"}}>
                        <h2>Highest PolitIQ this {this.props.timeframe}:</h2>
                        <h1>{this.state.name}</h1>
                        <h3>{this.state.highScore}</h3>
                      </div>
                    : null
                }
            </>
        )
    }
}

export default HighestScore;