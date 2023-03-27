import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'


export default function Answers (props){

        function decodeData(str){
        let txt = new DOMParser().parseFromString(str, "text/html")
        //ta bort textareat igen
        return txt.documentElement.textContent
    }
   
    const stylesWraper = {
        backgroundColor : getBackgroundColor(),
        color : getColor(),
        border: getBorderColor()
    }
    
    const stylesText = {
        color: getTextColor()
    }
    function getBackgroundColor(){  
        if (props.content.isCheckedAnswer && props.content.isRight){
            return "#94D7A2"
        } else if (props.content.isCheckedAnswer && !props.content.isRight && props.content.isHeld){
            return "#F8BCBC"
        } else if (props.content.isHeld){
            return "#D6DBF5"
        } else if(props.content.isRightButNotChosen){
            return "#94D7A2"
        }
    }

    function getColor(){
        if (props.content.isRightButNotChosen && props.content.isQuizzical ){
            return "yellow"
        } 
        
    }

    function getBorderColor(){
        if (props.content.isRightButNotChosen && props.content.isQuizzical ){
            return "0 solid white"
        } else if (props.content.isHeld && props.content.isCheckedAnswer){
            return "0 solid white"
        } else if (props.content.isQuizzical ){
            return "1px solid #9199CA"
        }
    }

    function getTextColor(){
        if (props.content.isQuizzical && props.content.isRightButNotChosen){
            return "#293264"
        } else if (props.content.isHeld && props.content.isCheckedAnswer && props.content.isRight){
            return "#293264"
        } else if (props.content.isHeld && props.content.isCheckedAnswer){
            return "#9199CA"
        } else if (props.content.isQuizzical) {
            return "#9199CA"
        }
    }

    

    return  (
        <div key={nanoid()}  className="answer-holder"> 
        <div 
            onClick={props.holdAnswer}
            className="answer-container"
            style={stylesWraper}
           >
                <p className="answer-text" style = {stylesText}>
                    {decodeData(props.content.answer)}</p>
            </div>
        </div>
    )   
}
