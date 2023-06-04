
export default function Question (props){

function decodeData(str){
    let txt = new DOMParser().parseFromString(str, "text/html")

    //ta bort textareat igen
    return txt.documentElement.textContent
    }
        return  <h1 className="question-text">{decodeData(props.item.question)}</h1>
    }