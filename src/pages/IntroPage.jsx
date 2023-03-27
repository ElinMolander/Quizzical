import { Link } from "react-router-dom";
import { useState } from "react"
import { useEffect } from "react"


export default  function IntroPage(){
    const [questions, setQuestions] = useState([])
    useEffect(()=>{
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(res => res.json())
        .then(data => setQuestions(data.results))
    },[])

    const StyledLink = {
        color:"#F5F7FB",
        backgroundColor:"#4D5B9E",
        padding:".5em 2em",
        fontSize: "1.2em",
        borderRadius: "15px",
        marginTop: "1em"
    }
    function start(){
       setQuestions(oldQustions => oldQustions.map(item => {
            return {...item, isHeld:false, id:nanoid(), allAnswers: item.incorrect_answers.concat(item.correct_answer) }
     }))  
       
        }
    return (
        <div className="intro-page">
            <div className="intro-wraper">
                <h1 className="logo">Quizzical</h1>
                <h2 className="descriptive-text"> Test your knowlege</h2>
                <Link to="/questions" style={StyledLink}  onClick={start}> Start quiz</Link>
                
                
           
            </div>
              
            
            
        </div>
    
    )
}