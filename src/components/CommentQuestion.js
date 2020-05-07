import Preact from 'preact';



export default class CommentQuestion extends Preact.Component {
    constructor(props) {
        super(props);
        this.state = {            
            saving: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({saving: true});
        let params = {
            questionnaire: this.props.questionnaire,
            questionnairePreview: this.props.questionnairePreview,
            quiz: this.props.quiz,                
        };
        paella.data.write("quizzes", params, null, (data, status) => {
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
                <input className="btn btn-primary" type="submit" value={base.dictionary.translate("Continue")} />
            </form>
        );
    }
}
