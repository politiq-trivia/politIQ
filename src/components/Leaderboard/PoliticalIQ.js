import React, {
    Component
} from 'react';
import TodaysQuizButton from '../StaticPages/TodaysQuizButton';
import { getPolitIQ } from '../../utils/calculatePolitIQ';

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
            this.getIQ(authUser.uid, 'month')
            this.setState({
                uid: authUser.uid
            })
        }
    }

    getIQ = async (uid, timeframe) => {
       const iq = await getPolitIQ(uid, timeframe)
       this.setState({
           politIQ: iq,
       })
    }

    render() {
        return ( 
            <div>
                <div>
                    <p>Your politIQ for this month: </p>
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