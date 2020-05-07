import Preact from 'preact';


export default function UnknownQuestion(props) {
    let quizType = props.quiz.type;

    return (        
        <form className="quizElement">            
            <h1>
                <strong>{base.dictionary.translate("ERROR")}</strong>
            </h1>
            <h2>
                {base.dictionary.translate(`No question UI for type '${quizType}'`)}
            </h2>
            <div className="btn btn-primary" onClick={() => {props.onAnswer(null);}}>
                {base.dictionary.translate("Continue")}
            </div>
        </form>
    );
}
