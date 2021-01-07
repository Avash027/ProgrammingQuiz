import React, { Component } from "react";
import Appbar from "./Styling/Appbar"; //Using Material-UI here
import { Button, TextField } from "@material-ui/core";

import Questions from "./QuestionGeneration/Questions"; //This is for presenting the questions

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [], //Stores all the questions
      correct_ans: [], //Stores all the correct answers
      ans: [], //Stores all the options . It is a 2-D array
      hasGeneratedQuiz: false,
      score: 0,
      isAnswered: [],
      topic: "18", //Programming questions are defined as topic 18 in database
      difficulty: "easy",
      value: "10",
      hasErrorOccured: 0, //Incase
    };
  }

  generateQuiz = async (event) => {
    event.preventDefault();

    const noOfQues = parseInt(this.state.value);

    //For validating user input
    if (noOfQues <= 0 || noOfQues > 50 || !Number.isInteger(noOfQues)) {
      alert("Enter Valid No. of Questions");
      return;
    }

    let response = await fetch(
      `https://opentdb.com/api.php?amount=${this.state.value}&category=${this.state.topic}&type=multiple`
    );
    let data = await response.json();
    //If data could not be fetched we print the error
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
      isAnswered.push("no"); //Initially none of the questions are answered
      questions.push(results[i].question);
      correct_ans.push(results[i].correct_answer);
      var temp = [results[i].correct_answer, ...results[i].incorrect_answers];
      shuffleArray(temp); //This is to shuffle the array
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

    let isAns = [...this.state.isAnswered];
    //The class name shows the option selected by the user
    //And id shows the index of correct answer
    if (event.target.className === this.state.correct_ans[event.target.id]) {
      //If the answer is correct
      isAns[event.target.id] = "right";
      this.setState({
        score: this.state.score + 1,
        isAnswered: isAns,
      });
    } else {
      //If the answer is wrong
      isAns[event.target.id] = "wrong";
      this.setState({
        isAnswered: isAns,
      });
    }

    //After the user enters the answer we check if all the questions are answered
    const allAnswered = isAns.every((val) => {
      return val === "right" || val === "wrong";
    });
    //If all answered we scroll to top to show the score to user
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
    let content = "";

    if (this.state.hasErrorOccured) {
      content = (
        <center>
          <h1>Something Went Wrong !!!</h1>
        </center>
      );
    } else if (this.state.hasGeneratedQuiz) {
      content = (
        <Questions
          data={this.state}
          click={(event) => this.submitAnswer(event)}
        ></Questions>
      );
    } else {
      content = "";
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
        {content}
      </div>
    );
  }
}

/**
 *
 * @param {An array of strings} array
 *
 */

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default App;
