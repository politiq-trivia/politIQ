import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import ReactCountdownClock from 'react-countdown-clock';
import Scroll from 'react-scroll-to-element';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';

import './quiz.css';


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: '',
            clicked: false,
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.qNum !== this.props.qNum || nextProps.selectedValue !== this.props.selectedValue || nextProps.wrong !== this.props.wrong) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
        // console.log(this.props.myRef.cur)
        if(this.props.myRef.current !== null) {
            window.scrollTo({
                left: 0, 
                top:this.props.myRef.current.offsetTop,
                behavior: 'smooth'
            })
        } else {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
        }
        // this.scrollToMyRef()
        // console.log(this.props.myRef, 'my ref')
    }

    openNewTab = () => {
        const newState = this.props.state;
        newState.contestQuestion = true;
        const newStateJson = JSON.stringify(newState)
        localStorage.setItem("state", newStateJson)
        const url = 'quiz/' + this.props.quizID
        window.open(`/${url}`);
    }

    scrollToMyRef = () => window.scrollTo(0, this.props.myRef.offsetTop)

    render() {
        const { questionObj, qNum, handleSubmit, selectedValue, nextQ, correctAnswer, wrong, clicked } = this.props;
        let qtext = questionObj["q1"]
        let a1text = questionObj["a1text"];
        let a2text = questionObj["a2text"];
        let a3text = questionObj["a3text"];
        let answerExplanation = questionObj["answerExplanation"];

        const backgroundColor = (num) => {
            if (selectedValue === '') return;
            if (selectedValue === num && wrong === false) {
                return '#B6E1BE';
            } else if (selectedValue === num && wrong === true) {
                return '#E1B6B6';
            }
        }

        return (
            <>
                <div style={{ display: 'flex' }}>
                    <h1>{qNum}. {qtext}</h1>
                </div>

                <FormControl className="question" style={{ marginBottom: '5vh'}}>


                <RadioGroup aria-label={qtext}>
                    <Paper style={{ backgroundColor: backgroundColor("1") }} id="1" onClick={ wrong === null ? handleSubmit : null } className="answer">
                        <FormControlLabel value={a1text} id="1" control={
                        <Radio
                            checked={selectedValue === "1"}
                            value="1"
                            aria-label="1"
                            id="1"
                            disabled={wrong !== null} 
                        />
                        } label={a1text} />
                    </Paper>

                    <Paper style={{ marginTop: '2vh', backgroundColor: backgroundColor("2")}} id="2" onClick={ wrong === null ? handleSubmit : null } className="answer">
                        <FormControlLabel value={a2text} id="2" control={
                        <Radio
                            checked={selectedValue === "2"}
                            value="2"
                            id="2"
                            aria-label="2"
                            disabled={wrong !== null}
                        />
                        } label={a2text} />
                    </Paper>
                    {/* <hr width="100%" ref={this.props.innerRef}/> */}
                    <Paper style={{ marginTop: '2vh', backgroundColor: backgroundColor("3")}} id="3" onClick={ wrong === null ? handleSubmit : null } className="answer">
                        <FormControlLabel value={a3text} id="3" control={
                        <Radio
                            checked={selectedValue === "3"}
                            value="3"
                            id="3"
                            aria-label="3"
                            disabled={wrong !== null}
                        />
                        } label={a3text}/>
                    </Paper>

                </RadioGroup>
                <div>
                {wrong === true
                    ? 
                    // <Scroll type="id" element="explanation" >
                        <div style={{ marginTop: '3vh'}} id="explanation"ref={this.props.myRef}>
                            <h3 style={{ color: 'red', display: 'inline', marginRight: '1vw'}}>INCORRECT</h3>
                            <p style={{ display: 'inline'}}>The correct answer was <span style={{ color: 'green' }}>{correctAnswer}</span>.</p>
                            <p>{answerExplanation}</p>
                            <Button variant="contained" color="primary" onClick={nextQ} style={{ display: 'block', marginBottom: '2vh'}}>Continue</Button>
                            <Button variant="contained" onClick={this.openNewTab}>Contest This Question</Button>
                        </div>
                    // </Scroll>
                    : null 
                }
                { wrong === false
                    ? 
                    // <Scroll type="id" element="explanation">
                        <div style={{ marginTop: '3vh'}} id="explanation" ref={this.props.myRef}>
                            <h3 style={{ color: 'green'}}>CORRECT</h3>
                            <p>{answerExplanation}</p>
                            <Button variant="contained" color="primary" onClick={nextQ} style={{ display: 'block', marginBottom: '2vh'}}>Continue</Button>
                        </div>
                    // </Scroll>
                    : null
                }
                </div>

                <MediaQuery maxWidth={415}>
                        <div className={clicked ? 'dontShowClock' : 'showClock'} style={{ marginLeft: '43%', marginRight: 'auto', marginTop: '4vh', width: '21%' }} >
                            <ReactCountdownClock key={this.props.currentQ} seconds={60} size={60} color="#a54ee8" style={{ marginLeft: 'auto', marginRight: 'auto' }} alpha={0.9} onComplete={() => this.props.checkCorrect()} paused={this.state.clicked}/>
                        </div>
                </MediaQuery>
                </FormControl>

            </>
        )
    }
}

export default Question;