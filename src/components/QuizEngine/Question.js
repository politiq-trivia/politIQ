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
        let a4text = questionObj["a4text"];

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
                <FormControlLabel value={a4text} control={
                <Radio
                    onChange={handleSubmit}
                    checked={selectedValue === "4"}
                    value="4"
                    aria-label="4"
                />
                } label={a4text}/>
            </RadioGroup>
            <div>
            {wrong
                ? <div style={{ marginTop: '3vh'}}>
                    <Button variant="contained" color="primary" onClick={nextQ}>Continue</Button>
                    <p>INCORRECT - The correct answer was <span style={{ color: 'green' }}>{correctAnswer}</span>.</p>
                    <Button variant="contained" onClick={this.openNewTab}>Contest This Question</Button>
                </div>
                : null
            }
            </div>

            </FormControl>
        )
    }
}

export default Question;