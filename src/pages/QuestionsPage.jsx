import { useState, useEffect } from "react"
import Question from "../Question"
import { nanoid } from 'nanoid'
import Answers from "../Answers"

function Card({ children }) {
    return (
        <div className="question-wraper" >
            {children}
        </div>
    );
}
  
export default function QuestionsPage(){
    const [questions, setQuestions] = useState([])
    const [count, setCount] = useState(0)
    const [quizzical, setQuizzical] = useState(false)
    const [checkedAnswers, setChekeckedAnswers] = useState([])
    const [errorMessege, setErrorMessege] = useState("")

    // HELPER
    function shuffleArray(array){
        var m = array.length, t, i
        while (m != 0){
            i = Math.floor(Math.random() * m--)
            t = array[m] 
            array[m] = array[i]
            array[i] = t
        }
        return array
    }
    
     // API-Call and set Questions Object

    useEffect(()=>{
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(res => res.json())
        .then(data => buildQuestionSet(data.results))
    },[count])

    function buildQuestionSet(apiResult){
        setQuestions(preQuestions => apiResult.map(item => { 
            const allAnswers = item.incorrect_answers.concat(item.correct_answer)
            shuffleArray(allAnswers)
            const allAnswersWithId = allAnswers.map(item =>{
                return {
                    id:nanoid(), 
                    answer:item,
                    isHeld: false,
                    isRight: false,
                    isCheckedAnswer: false,
                    isQuizzical: false,
                    isRightButNotChosen: false,
                }
            })
            return {...item, 
                allAnswers: allAnswersWithId
            }
         }))    
    }
    
     // To hold/check a answer on/off 

    function holdAnswer(id){
        setQuestions(oldQustions => oldQustions.map (item =>{
            const allAnswers = item.allAnswers.map(item =>{
                return  item.id === id ? 
                { ...item,
                    isHeld: !item.isHeld } : item
                })
            return {...item, allAnswers}
        }))
    }

    // When a answer is checked to set right and wrong

    function checkedAnswer(){
        setQuestions(oldQustions => oldQustions.map (item =>{
            const allAnswers = item.allAnswers.map(item =>{
                return  item.isHeld && item.answer? 
                { ...item,
                    isCheckedAnswer: !item.isCheckedAnswer } : item
                })
            return {...item, allAnswers}
        }))
    }

    function setRightAnswer(){
        setQuestions(oldQustions => oldQustions.map (answers =>{
            const allAnswers = answers.allAnswers.map(item =>{
                return  item.isHeld && item.answer === answers.correct_answer? 
                        { ...item,
                            isRight: true } : item
                        })
            return {...answers, allAnswers}
        }))
    }

    function checkHowManyIsHold(){
        const holdAnswer = []
        const allAnswersGetArray = questions.map(answers =>{
            const allAnswersArray = answers.allAnswers.map(item => {
                return item.isHeld ?
                holdAnswer.push(item.answer): item
                })
            })
        return holdAnswer
    }

   
    function filterCheckedAnswers(){
        const allAnswersCollected = []
        const correctAnswers = questions.map(correctAnswer =>{
            return correctAnswer.correct_answer
        })
        const allAnswersGetArray = questions.map(answers =>{
            const allAnswersArray = answers.allAnswers.map(item => {
                 if (item.isHeld && item.answer === answers.correct_answer){
                    setRightAnswer()
                    return item.answer
                 }
            })
            return allAnswersCollected.push(...allAnswersArray)
        })
        setChekeckedAnswers(prevCheckedAnswers => allAnswersCollected.filter(item => correctAnswers.includes(item)))
    }


    function filterCorrectAnwersNotChosen(){
        const allAnswersCollected = []
        const correctAnswers = questions.map(correctAnswer =>{
            return correctAnswer.correct_answer
        })
        const allAnswersGetArray = questions.map(answers =>{
            const allAnswersArray = answers.allAnswers.map(item => {
                 if (!item.isHeld && item.answer === answers.correct_answer){
                    setUncheckedRightAnswer()
                    return item.answer
                 }
            })
            return allAnswersCollected.push(...allAnswersArray)
        })
    }

    function setUncheckedRightAnswer(){
        setQuestions(oldQustions => oldQustions.map (answers =>{
            const allAnswers = answers.allAnswers.map(item =>{
                return   item.answer === answers.correct_answer? 
                        { ...item,
                            isRightButNotChosen: true,
                            isCheckedAnswer: true,
                         } : item
                        })
            return {...answers, allAnswers}
        }))

    }

    function setGreybackground(){
        setQuestions(oldQustions => oldQustions.map (answers =>{
            const allAnswers = answers.allAnswers.map(item =>{
                return  !item.isHeld ? 
                        { ...item,
                            isQuizzical: true } : item
                        })
            return {...answers, allAnswers}
        }))
    }
 
    // Check Answers from button and play againg
    
    function checkAnswers(){
        const heldCount = checkHowManyIsHold()
        if (heldCount.length === 5){
            setQuizzical(true)
            filterCheckedAnswers()
            checkedAnswer()
            setGreybackground()
            filterCorrectAnwersNotChosen()
            setErrorMessege("")
        } else setErrorMessege("You chose the wrong amount of answers") 
    }
   
    function playAgain(){
        setQuizzical(false)
        setCount(prevCount => prevCount + 1)
    }

    return (
        <div className="question-page"  >
           <div className="all-questions-wraper">
            { 
                questions.map(question =>{
                    return (
                        <Card key={nanoid()}>
                            <Question item={question}/>
                            <div  className= "answer-div">
                                {question.allAnswers.map(answer =>{
                                    return <Answers
                                        key={nanoid()}
                                        content={answer}
                                        holdAnswer={() => holdAnswer(answer.id)}
                                    />
                                })}
                            </div>
                        </Card>
                    )
                })
            }   
            </div>
            <div className="bottom">
               {quizzical?  <p> You scored {checkedAnswers.length}/5 correct answers</p> : 
                 <p>{errorMessege}</p>}
            {quizzical? <button onClick={playAgain}> Play again </button>: <button onClick={checkAnswers}>
                    Check answers
                </button>} 
                
            </div>
           
        </div>
    ) 
}