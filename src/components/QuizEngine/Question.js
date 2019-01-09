import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


class Question extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.qNum !== this.props.qNum || nextProps.selectedValue !== this.props.selectedValue || nextProps.wrong !== this.props.wrong) {
            return true;
        } else {
            return false;
        }
    }

    openNewTab = () => {
        const newState = this.props.state;
        newState.contestQuestion = true;
        const newStateJson = JSON.stringify(newState)
        localStorage.setItem("state", newStateJson)
        const url = 'quiz/' + this.props.quizID
        window.open(`/${url}`);
    }

    render() {
        const { questionObj, qNum, handleSubmit, selectedValue, nextQ, correctAnswer, wrong } = this.props;
        let qtext = questionObj["q1"]
        let a1text = questionObj["a1text"];
        let a2text = questionObj["a2text"];
        let a3text = questionObj["a3text"];
        let answerExplanation = questionObj["answerExplanation"];

        return (
            <FormControl className="question" style={{ marginBottom: '5vh'}}>
            <h1>{qNum}. {qtext}</h1>
            <RadioGroup aria-label={qtext}>
                <FormControlLabel value={a1text} control={
                <Radio
                    onChange={handleSubmit}
                    checked={selectedValue === "1"}
                    value="1"
                    aria-label="1"
                />
                } label={a1text}/>
                <FormControlLabel value={a2text} control={
                <Radio
                    onChange={handleSubmit}
                    checked={selectedValue === "2"}
                    value="2"
                    aria-label="2"
                />
                } label={a2text}/>
                <FormControlLabel value={a3text} control={
                <Radio
                    onChange={handleSubmit}
                    checked={selectedValue === "3"}
                    value="3"
                    aria-label="3"
                />
                } label={a3text}/>
            </RadioGroup>
            <div>
            {wrong === true
                ? <div style={{ marginTop: '3vh'}}>
                    <h3 style={{ color: 'red'}}>INCORRECT</h3>
                    <p>The correct answer was <span style={{ color: 'green' }}>{correctAnswer}</span>.</p>
                    <p>{answerExplanation}</p>
                    <Button variant="contained" color="primary" onClick={nextQ} style={{ display: 'block', marginBottom: '2vh'}}>Continue</Button>
                    <Button variant="contained" onClick={this.openNewTab}>Contest This Question</Button>
                </div>
                : null 
            }
            { wrong === false
                ? <div style={{ marginTop: '3vh'}}>
                    <h3 style={{ color: 'green'}}>CORRECT</h3>
                    <p>{answerExplanation}</p>
                    <Button variant="contained" color="primary" onClick={nextQ} style={{ display: 'block', marginBottom: '2vh'}}>Continue</Button>
                </div>
                : null
            }
            </div>

            </FormControl>
        )
    }
}

export default Question;