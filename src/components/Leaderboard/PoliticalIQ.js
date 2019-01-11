import React, {
    Component
} from 'react';
import moment from 'moment';
import { db } from '../../firebase';
import TodaysQuizButton from '../StaticPages/TodaysQuizButton';

class PoliticalIQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            politIQ: 0,
            noScores: true,
            loaded: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('authUser')) {
            const authUser = JSON.parse(localStorage.getItem('authUser'))
            this.setState({
                uid: authUser.uid
            })

            this.getQuizzes()
                .then(() => {
                    this.getScores(authUser.uid)
                        .then(() => {
                            if (this.state.noScores === false) {
                                this.calculatePoliticalIQ()
                            }
                        })
                })
        }
    }

    getQuizzes = async () => {
        await db.getQuizzes()
            .then(response => {
                const data = response.val()
                // store the dates in a weekly array to see how many have been in the last week
                const quizDates = Object.keys(data)
                const lastWeek = []
                for (let i = 0; i < quizDates.length; i++) {
                    if (quizDates[i] > moment().startOf('week').format('YYYY-MM-DD')) {
                        lastWeek.push(quizDates[i])
                    }
                }
                this.setState({
                    quizzesInLastWeek: lastWeek.length,
                })
            })
    }

    getScores = async (uid) => {
        await db.getScoresByUid(uid)
            .then(response => {
                const data = response.val();
                if (data === null) {
                    this.setState({
                        noScores: true,
                        loaded: true,
                    }) 
                } else {
                    let scoreCounter = 0;
                    const scoreDates = Object.keys(data);
                    for (let i = 0; i < scoreDates.length; i++) {
                        if (scoreDates[i] > moment().startOf('week').format('YYYY-MM-DD')) {
                            scoreCounter += data[scoreDates[i]]
                        }
                    }
                    this.setState({
                        weeklyScore: scoreCounter,
                        noScores: false,
                    })
                }
            })
    }

    // calculate the political IQ for this week
    calculatePoliticalIQ = () => {
        const score = this.state.weeklyScore;
        const quizNum = this.state.quizzesInLastWeek;
        const qNum = 5;

        const averageScore = score / qNum;
        const politIQ = Math.round((averageScore / quizNum) * 100);

        this.setState({
            politIQ,
            loaded: true,
        })
    }



    render() {
        return ( 
            <div>
                <div>
                    <p>Your politIQ for this week: </p>
                    <h2>{this.state.politIQ}</h2>
                </div>
                {this.state.noScores && this.state.loaded === true
                    ? <div>
                        <h3 style={{ marginBottom: '3vh'}}>You don't have any scores yet! <br/>Start taking quizzes to build up your PolitIQ</h3>
                        <TodaysQuizButton buttonText={"Take Today's Quiz"}/>
                    </div>
                    : null
                }
            


            </div> 
        )
    }
}

export default PoliticalIQ;