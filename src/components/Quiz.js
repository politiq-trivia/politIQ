// this component will:
// 1. grab the date id from the url
// 2. render a screen that first says are you ready to play today's quiz? or nah, idk
// 3. grab that quiz from the db
// 4. save all the questions in state
// 5. display the questions on the screen one at a time
// 6. store the user's answers in state
// 7. want to show them right away if they got the question right or wrong?

import React, { Component } from 'react';
import loadingGif from '../loadingGif.gif'

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionsArray: []
    }
  }
  render() {
    const isLoading = () => {
      if (this.state.questionsArray.length === 0) {
        return (
          <img src={loadingGif} alt="loading gif"/>
        )
      } else {
        return (
          <p> questions</p>
        )
      }
    }
    return (
      <div>
        <p> dis the quiz</p>
        {isLoading()}
      </div>
    )
  }
}

export default Quiz;
