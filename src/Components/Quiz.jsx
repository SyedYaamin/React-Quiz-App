import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const quizQuestions = async () => {
      try {
        const response = await axios.get("https://the-trivia-api.com/v2/questions");
        console.log(response.data);
        const formattedQuestions = response.data.map((q) => {
          return {
            question: q.question.text,
            correct_answer: q.correctAnswer,
            answers: [...q.incorrectAnswers, q.correctAnswer].sort(() => Math.random() - 0.5),
          };
        });
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    quizQuestions();
  }, []);

  const selectedQuestion = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="rounded-3xl mt-5 min-h-[30rem] w-[40rem] bg-gray-300">
        {showScore ? (
          <h1 className="text-black text-2xl font-semibold p-10">
            You scored {score} out of {questions.length}
          </h1>
        ) : (
          <>
            {questions.length > 0 && (
              <>
                <h1 className="text-black text-2xl font-semibold p-10">
                  Q: {currentQuestion + 1} {questions[currentQuestion].question}
                </h1>
                <hr className="h-px bg-black mx-10 border-0 dark:bg-black" />
                <ul>
                  {questions[currentQuestion].answers.map((answer, index) => (
                    <li key={index} onClick={() => selectedQuestion(answer)} className={`text-black text-xl px-5 py-3 h-15 rounded-3xl mt-5 mx-10 ${ selectedAnswer === answer ? 'bg-gray-600' : 'bg-white'}`} style={{ cursor: 'pointer' }}>
                      {answer}
                    </li>
                  ))}
                </ul>
                <button className="bg-blue-950 text-center p-3 w-28 rounded-2xl my-5 mx-14" onClick={nextQuestion} disabled={!selectedAnswer}>
                  Next
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
