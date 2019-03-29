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
        this.getUsersWithScores()
    }

    calculateHighestPolitIQ = async (usernames) => {
        let politIQs = [];
        let politObjects = [];

        for (let i = 0; i < usernames.length; i++) {
            const politIQ = await getPolitIQ(usernames[i])
            politIQs.push(
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
                if (data === null) return;
                const name = data.displayName;
                this.setState({
                    highScore: max,
                    name,
                })
            })
    }

    getUsersWithScores = async () => {
        await db.getScores()
        .then((response) => {
            const data = response.val();
            const usernames = Object.keys(data);
            this.calculateHighestPolitIQ(usernames)
        })
    }

    render() {
        return (
            <>
                {this.state.highScore !== 0
                    ?
                     <Card style={{ paddingBottom: '4vh', width: '40%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h2>Current politIQ Leader:</h2>
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