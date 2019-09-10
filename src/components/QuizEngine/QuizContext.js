import React, { useContext } from 'react';
import { db } from '../../firebase';

const QuizContext = React.createContext(null);

const QuizProvider = (Component) => {
  class quizProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        quizzes: [],
      };
    }

    componentDidMount() {
      this.getQuizzes();
    }

    getQuizzes = async () => {
      await db.getQuizzes()
        .then((response) => {
          const data = response.val();
          if (data === null) {
            return 'No quizzes available';
          }
          this.setState({ quizzes: data });
        });
    }

    render() {
      return (
        <QuizContext.Provider value={this.state.quizzes}>
          <Component {...this.props}/>
        </QuizContext.Provider>
      );
    }
  }

  return quizProvider;
};

export { QuizContext, QuizProvider };

const useQuizValue = () => useContext(QuizContext);
export default useQuizValue;
