import React from "react";
import { Paper } from "@material-ui/core";
import "./css/disableDiv.css";

function Questions(props) {
  const text = props.ind + 1 + " . " + props.question;
  let ans = "";

  if (props.isAnswered !== "no") {
    ans = (
      <h3
        dangerouslySetInnerHTML={{
          __html: "Correct Answer : " + props.printAns,
        }}
      ></h3>
    );
  }

  return (
    <div className={props.isAnswered.toString()}>
      <Paper elevation={props.isAnswered.toString() === "no" ? 4 : 1}>
        <h2
          dangerouslySetInnerHTML={{ __html: text }}
          className={props.isAnswered.toString()}
        ></h2>
        <br></br>
        <button
          id={props.correctAns}
          className={props.ans[0]}
          onClick={props.click}
          dangerouslySetInnerHTML={{ __html: props.ans[0] }}
        ></button>

        <button
          id={props.correctAns}
          className={props.ans[1]}
          onClick={props.click}
          dangerouslySetInnerHTML={{ __html: props.ans[1] }}
        ></button>
        <button
          id={props.correctAns}
          className={props.ans[2]}
          onClick={props.click}
          dangerouslySetInnerHTML={{ __html: props.ans[2] }}
        ></button>
        <button
          id={props.correctAns}
          className={props.ans[3]}
          onClick={props.click}
          dangerouslySetInnerHTML={{ __html: props.ans[3] }}
        ></button>
        <br></br>
        {ans}
        <br></br>
      </Paper>
    </div>
  );
}

export default Questions;
