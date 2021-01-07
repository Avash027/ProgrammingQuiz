import Question from "./Question";

export default Questions = (props) => {
  const questions = props.questions;
  return (
    <div className="quizDiv">
      {questions.map((ques, idx) => {
        return (
          <Question
            key={idx}
            ind={idx}
            question={ques}
            correctAns={idx}
            ans={ans[idx]}
            isAnswered={isAnswered[idx]}
            printAns={props.correct_ans[idx]}
            click={props.click}
          ></Question>
        );
      })}
    </div>
  );
};
