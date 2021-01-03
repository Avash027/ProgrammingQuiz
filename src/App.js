import React, { Component } from "react";
import Questions from "./utils/Question";
import Appbar from "./utils/Appbar";
import { Button, TextField } from "@material-ui/core";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      correct_ans: [],
      ans: [],
      hasGeneratedQuiz: false,
      score: 0,
      isAnswered: [],
      topic: "18",
      difficulty: "easy",
      value: "10",
      hasErrorOccured: 0,
    };
  }

  generateQuiz = async (event) => {
    event.preventDefault();

    const noOfQues = parseInt(this.state.value);

    if (noOfQues <= 0 || noOfQues > 50 || !Number.isInteger(noOfQues)) {
      alert("Enter Valid No. of Questions");
      return;
    }

    let response = await fetch(
      `https://opentdb.com/api.php?amount=${this.state.value}&category=${this.state.topic}&type=multiple`
    );
    let data = await response.json();

    if (data.response_code !== 0) {
      this.setState({
        hasErrorOccured: 1,
      });
      return;
    }

    const { results } = data;

    let questions = [];
    let ans = [];
    let correct_ans = [];
    let isAnswered = [];
    for (var i = 0; i < results.length; i++) {
      isAnswered.push("no");
      questions.push(results[i].question);
      correct_ans.push(results[i].correct_answer);
      var temp = [results[i].correct_answer, ...results[i].incorrect_answers];
      shuffleArray(temp);
      ans.push(temp);
    }

    this.setState({
      score: 0,
      questions: questions,
      correct_ans: correct_ans,
      ans: ans,
      hasGeneratedQuiz: true,
      isAnswered: isAnswered,
    });
  };

  submitAnswer = (event) => {
    event.preventDefault();
    // event.target.className
    let isAns = [...this.state.isAnswered];
    if (event.target.className === this.state.correct_ans[event.target.id]) {
      isAns[event.target.id] = "right";
      this.setState({
        score: this.state.score + 1,
        isAnswered: isAns,
      });
    } else {
      isAns[event.target.id] = "wrong";
      this.setState({
        isAnswered: isAns,
      });
    }

    const allAnswered = isAns.every((val) => {
      return val === "right" || val === "wrong";
    });
    if (allAnswered) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    let elem = "";

    const { questions, ans, isAnswered } = this.state;

    if (this.state.hasErrorOccured) {
      elem = (
        <center>
          <h1>Something Went Wrong !!!</h1>
        </center>
      );
    } else if (this.state.hasGeneratedQuiz) {
      elem = (
        <div className="quizDiv">
          {questions.map((ques, idx) => {
            return (
              <Questions
                key={idx}
                ind={idx}
                question={ques}
                correctAns={idx}
                ans={ans[idx]}
                isAnswered={isAnswered[idx]}
                printAns={this.state.correct_ans[idx]}
                click={(event) => this.submitAnswer(event)}
              ></Questions>
            );
          })}
        </div>
      );
    } else {
      elem = "";
    }

    return (
      <div>
        <Appbar
          score={this.state.score}
          size={this.state.correct_ans.length}
        ></Appbar>
        <br></br>
        <center>
          <TextField
            id="standard-basic"
            label="Enter"
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          ></TextField>

          <br></br>
          <br></br>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.generateQuiz}
          >
            Generate
          </Button>
        </center>
        <br></br>
        {elem}
      </div>
    );
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default App;
