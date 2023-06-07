import { Link } from "react-router-dom"
import { useState } from "react"
import { useEffect, useRef } from "react"


export default function IntroPage(){
    const [count, setCount] = useState(0) 
    const [categoryNum, setCategoryNum] = useState(0)
    const [difficulty, setDifficulty] = useState("medium")
    const refCategory = useRef("");
    const refDifficulty = useRef("");

    useEffect(()=>{
        localStorage.setItem('categoryValue', JSON.stringify(categoryNum))
        localStorage.setItem('difficulty', JSON.stringify(difficulty))
    },[count])

    function changeCategory() {
        setCategoryNum(refCategory.current.value)
        setCount(prevCount => prevCount + 1)
    }
    function changeDiffuculty() {
        setDifficulty(refDifficulty.current.value)
        setCount(prevCount => prevCount + 1)
    }

    return (
        <div className="intro-page">
            <div className="intro-wraper">
                <h1 className="logo">Quizzical</h1>
                <h2 className="descriptive-text"> Test your knowlege</h2>
                <label htmlFor="category-select">Select Category:</label> 
                <div onChange={changeCategory}  className="custom-select">
                    <select name="category" id="category-select" ref={refCategory}>
                        <option value="0">Random Category</option>
                        <option value="9">General Knowlege</option>
                        <option value="10">Books</option>
                        <option value="11">Films</option>
                        <option value="25">Art</option>
                        <option value="15">Video Games</option>
                        <option value="29">Comics</option>
                        <option value="18">Computers</option>
                        <option value="17">Science & Nature</option>
                        <option value="22">Geography</option>
                        <option value="23">History</option> 
                    </select>
                </div>
                <label htmlFor="diffuculty-select">Select Diffuculty:</label> 
                <div onChange={changeDiffuculty} className="custom-select">
                <select name="diffuculty" id="diffuculty-select" ref={refDifficulty}>
                        <option >Select Diffuculty:</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <Link to="/questions" className="styled-link" > Start quiz</Link>
            </div>
        </div>
    )
}