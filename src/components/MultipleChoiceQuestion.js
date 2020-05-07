import Preact from 'preact';

export default class MultipleChoiceQuestion extends Preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            saved: false,
            answers:[],
            feedbacks:[],            
        }        
        this.props.quiz.responses.map(()=>{
            this.state.answers.push(false)
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let newAnswers = this.state.answers;
        newAnswers[event.target.name] = event.target.checked;        
        this.setState({answers:newAnswers});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.saved) {
            this.setState({saving: true});
            let answer = this.state.answers.map((x,i)=>x&&i).filter((v)=> v!==false);
            let params = {
                questionnaire: this.props.questionnaire,
                questionnairePreview: this.props.questionnairePreview,
                quiz: this.props.quiz,
            };            
            paella.data.write("quizzes", params, answer, (data, status) => {
                if (status) {
                    //console.log(`Quiz ${this.props.questionnaire} saved`);
                    //console.log("data response", data);
                    if (data && data.feedbacks) {                        
                        this.setState({feedbacks:data.feedbacks.reduce((o,v,i)=>{o[i]=v; return o;},{})});
                    }
                    else {
                        //console.log("no feedback. continue!!");
                        this.props.onAnswer();
                    }
                    this.setState({saved: true});
                }
                this.setState({saving: false});
            });
        }
        else {            
            this.props.onAnswer();
        }
    }
    render() {
        return (            
            <form className="quizElement" onSubmit={this.handleSubmit}>            
                <div className="quizQuestion" dangerouslySetInnerHTML={{__html: this.props.quiz.question}}></div>
                <div className="quizResponses">
                    {this.props.quiz.responses.map((response, index) => 
                        <div className='checkbox' key={index}>
                            <label>
                                <input type='checkbox' name={index} checked={this.state.answers[index]} onChange={this.handleChange} disabled={this.state.saving || this.state.saved} /> {response} 
                                { this.state.feedbacks && this.state.feedbacks[index] && this.state.feedbacks[index].feedback
                                    ? <span className={`quizFeedback  ${this.state.feedbacks[index].correct ? "quizFeedbackCorrect" : "quizFeedbackIncorrect"}`}> {this.state.feedbacks[index].feedback} </span>
                                    : null
                                }
                            </label>
                        </div>
                    )}
                </div>
                <input type="submit" className="btn btn-primary"
                    value={base.dictionary.translate("Continue")} 
                    disabled={this.state.saving} />                
            </form>
        );
    }
}
