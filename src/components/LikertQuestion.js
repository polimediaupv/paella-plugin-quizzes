import Preact from 'preact';


export default class LikertQuestion extends Preact.Component {
    constructor(props) {
        super(props);
        this.labels = [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
            "Not applicable"
        ];
        this.state = {
            answers: this.labels.map(()=>false),
            saving: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let newAnswers = this.state.answers;
        newAnswers.forEach((v, i)=>{
            newAnswers[i] = false;
        });
        newAnswers[event.target.name] = event.target.checked;
        this.setState({answers:newAnswers});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({saving: true});
        let answer = this.state.answers.reduce((v,x,i)=> (v==null) ? (x?i:null) : v, null)        
        let params = {
            questionnaire: this.props.questionnaire,
            questionnairePreview: this.props.questionnairePreview,
            quiz: this.props.quiz,                
        };        
        paella.data.write("quizzes", params, answer, (data, status) => {
            if (status) {
                this.props.onAnswer();
            }
            this.setState({saving: false});
        });                        
    }
    render() {
        return (        
            <form className="quizElement" onSubmit={this.handleSubmit}>
                <div className="quizQuestion" dangerouslySetInnerHTML={{__html: this.props.quiz.question}}></div>
                <div className="quizResponses">                    
                    {this.state.answers.map((_, index) => 
                        <div className='checkbox' key={index}>
                            <label>
                                <input type='radio' name={index} checked={this.state.answers[index]} onChange={this.handleChange} disabled={this.state.saving} /> {base.dictionary.translate(this.labels[index])}
                            </label>
                        </div>
                    )}                    
                </div>
                <input className="btn btn-primary" type="submit" value={base.dictionary.translate("Continue")} />
            </form>                
        );
    }
}
