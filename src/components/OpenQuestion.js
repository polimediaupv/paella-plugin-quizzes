import Preact from 'preact';


export default class OpenQuestion extends Preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            saving: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({answer: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({saving: true});        
        let params = {
            questionnaire: this.props.questionnaire,
            questionnairePreview: this.props.questionnairePreview,
            quiz: this.props.quiz,                
        };        
        paella.data.write("quizzes", params, this.state.answer, (data, status) => {
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
                    <textarea className='form-control' rows='4' 
                        placeholder={base.dictionary.translate("Write your answer")}
                        value={this.state.answer}
                        disabled={this.state.saving}
                        onChange={this.handleChange} >
                    </textarea>
                </div>
                <input className="btn btn-primary" type="submit" value={base.dictionary.translate("Continue")} />
            </form>                
        );
    }
}
