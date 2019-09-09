import React from 'react';
import { db } from '../../firebase';

const QuizContext = React.createContext(null);

const QuizProvider = async Component => {
    class quizProvider extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                quizzes: [],
            }
        }

        componentDidMount() {
            this.getQuizzes();
        }

        getQuizzes = async () => {
            await db.getQuizzes()
            .then(response => {
                const data = response.val()
                console.log(data, 'data')
                if (data === null) {
                    return 'No quizzes available'
                }
                this.setState({ data })
                // localStorage.setItem('quizzes', JSON.stringify(data))
            })
        }

        render() {
            return (
                <QuizContext.Provider value={this.state.quizzes}>
                    <Component {...this.props}/>
                </QuizContext.Provider>
            )
        }
    }
    return quizProvider;
}

export { QuizContext, QuizProvider };