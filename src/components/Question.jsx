
export default function Question (props){

function decodeData(str){
        let txt = new DOMParser().parseFromString(str, "text/html")
        return txt.documentElement.textContent
    }
        return  <h1 className="question-text">{decodeData(props.item.question)}</h1>
    }