import { nanoid } from 'nanoid'



export default function Answers (props) {
   
        function decodeData(str){
        let txt = new DOMParser().parseFromString(str, "text/html")
        //ta bort textareat igen
        return txt.documentElement.textContent
    }
  

  function mouseEnter(event) {
    if (!props.content.isQuizzical) {
        event.currentTarget.style.background = "#D6DBF5"
    } 
   
  }
  function mouseLeave(event){
    if (!props.content.isQuizzical && props.content.isHeld) {
        event.currentTarget.style.background = "#D6DBF5"
      } else {
        event.currentTarget.style.background = "none"
      }
   }
    
    const stylesWraper = {
        backgroundColor : getBackgroundColor(),
        border: getBorderColor()
    }
    
    const stylesText = {
        color: getTextColor()
    }

    function getBackgroundColor() {  
        if (props.content.isCheckedAnswer && props.content.isRight){
            return "#94D7A2"
        } else if (props.content.isCheckedAnswer && !props.content.isRight && props.content.isHeld){
            return "#F8BCBC"
        } else if (props.content.isHeld){
            return "#D6DBF5"
        } else if(props.content.isRightButNotChosen){
            return "#fff"
        }
    }

    function getBorderColor() {
        if ( props.content.isQuizzical && props.content.isHeld){
            return "3px solid black"
        } else if ( props.content.isQuizzical && props.content.isRightButNotChosen){
            return "3px solid #0ea200"
        } else if (props.content.isQuizzical){
            return "1px solid #9199CA"
        }
    }

    function getTextColor() {
        if (props.content.isQuizzical && props.content.isRightButNotChosen){
            return "black"
        }  else if (props.content.isHeld && props.content.isCheckedAnswer){
            return "black"
        } else if (props.content.isQuizzical && !props.content.isRight) {
            return " #9199CA"
        } else if (props.content.isQuizzica) {
            return "#9199CA"
        }
    }

  
return (
    <div key={nanoid()} className="answer-holder" > 
        <button
            onClick={ props.holdAnswer } 
            onMouseEnter={ mouseEnter }
            onMouseLeave={ mouseLeave }
            className="answer-question-button"
            style={stylesWraper}
        >
            <p className="answer-text" style = {stylesText}>
                {decodeData(props.content.answer)}</p>
        </button>
    </div>
    )   
}
