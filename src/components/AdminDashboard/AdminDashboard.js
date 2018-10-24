import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import AddQuiz from './AddQuiz';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: true,
    }
  }

  toggleAddQuiz = () => {
    console.log('toggle add client is being called')
    this.setState({
      addingQuiz: !this.state.addingQuiz
    })
  }

  // add question function
  // each time it is clicked, it adds another add question component to the add quiz component
  // need a counter (in state)

  render() {
    return (
      <div>
        { this.state.addingQuiz ? <AddQuiz /> :
          <div className="dashboard">
            <Paper>
              <h1>This is the admin dashboard</h1>
              <Button color="primary" onClick={this.toggleAddQuiz}>Create New Quiz</Button>
            </Paper>
          </div>
        }
      </div>
    )
  }
}



export default AdminDashboard;
