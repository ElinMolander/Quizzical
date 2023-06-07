import { useState, useEffect } from "react"
import Question from "../components/Question"
import { nanoid } from 'nanoid'
import Answers from "../components/Answers"
import { Link } from "react-router-dom";

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
    const [loading, setLoading] = useState(false)
    const [storedCategoryNum, setStoredCategoryNum] = useState(()=> {
        const savedNum =localStorage.getItem("categoryValue")
        const parsedItem = JSON.parse(savedNum)
        return parsedItem || 0
    })
    const [storedDifficulty, setStoredDifficulty] = useState(()=> {
        const savedDifficulty = localStorage.getItem("difficulty")
        const parsedItem = JSON.parse(savedDifficulty)
        return parsedItem || "medium"
    })
    
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
    
    useEffect(()=>{
        setLoading(true)
        fetch(`https://opentdb.com/api.php?amount=5&category=${storedCategoryNum}&difficulty=${storedDifficulty}&type=multiple`)
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
            setLoading(false)
            return {...item, 
                allAnswers: allAnswersWithId
            }
         }))    
    }
   
    if (loading) {
        return <h1 className="Loading-text">Loading...</h1>
    }

    function questionContainsAnswer(question, heldAnswerId){
        const checkedAnswers = question.allAnswers.filter(answer => {
           return answer.id === heldAnswerId
        })
        return checkedAnswers.length !== 0
    }

    function holdAnswer(heldAnswerId){
        if (quizzical) {
            return ""
        }
        setQuestions(oldQuestions => oldQuestions.map (question => {
            if(questionContainsAnswer(question, heldAnswerId)){      
                question.allAnswers = question.allAnswers.map(answer => {
                    return {
                        ...answer,
                        isHeld: answer.id === heldAnswerId
                    }
                })
            }
            return question
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
                holdAnswer.push(item.answer) : item
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

    function setIsQuizzical(){
        setQuestions(oldQustions => oldQustions.map (answers => {
            const allAnswers = answers.allAnswers.map(item => {
                return item? 
                        { ...item,
                            isQuizzical: true } : item
                        })
            return {...answers, allAnswers}
        }))
    }
 
    function checkAnswers(){
       const heldCount = checkHowManyIsHold()
        if (heldCount.length === 5){
            setQuizzical(true)
            filterCheckedAnswers()
            checkedAnswer()
            setIsQuizzical()
            filterCorrectAnwersNotChosen()
            setErrorMessege("")
        } else setErrorMessege("Oops! wrong amount, Try again!") 
    }
   
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

    function playAgain(){
        setQuizzical(false)
        setCount(prevCount => prevCount + 1)
    }

    return (
        <div className="question-page">
           <div className="all-questions-wraper">
            { 
                questions.map(question =>{
                    return (
                        <Card key={nanoid()}>
                            <Question item={question} 
                                    checkHowManyIsHoldInAnswers={() => checkHowManyIsHoldInAnswers(question)}/>
                            <div className= "answer-div">
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
               {quizzical?  <p> You Scored {checkedAnswers.length}/5 Correct Answers</p> : 
                 <p>{errorMessege}</p>}
                {quizzical? <Link to="/" onClick={playAgain} className="styled-link"> Play again </Link>: 
                        <button className="check-answers-button" onClick={checkAnswers}>
                    Check answers
                </button>} 
            </div>
        </div>
    ) 
}