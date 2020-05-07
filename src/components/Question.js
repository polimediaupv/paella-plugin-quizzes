import Preact from 'preact';

import ChoiceQuestion from './ChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OpenQuestion from './OpenQuestion';
import CommentQuestion from './CommentQuestion';
import LikertQuestion from './LikertQuestion';
import UnknownQuestion from './UnknownQuestion';


export default function Question(props) {
    return (
        <div className="quiz">
            {
                (props.quiz.type == "choice-question") ? ( 
                    <ChoiceQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></ChoiceQuestion>
                ) : ( (props.quiz.type == "multiple-choice-question") ? (            
                        <MultipleChoiceQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></MultipleChoiceQuestion>
                    ) : ( (props.quiz.type == "open-question") ? (            
                            <OpenQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></OpenQuestion>
                        ) : ( (props.quiz.type == "message") ? (
                                <CommentQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></CommentQuestion>
                            ) : ( (props.quiz.type == "likert-question") ? (                                    
                                    <LikertQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></LikertQuestion>
                                ) : (
                                    <UnknownQuestion questionnaire={props.questionnaire} questionnairePreview={props.questionnairePreview} quiz={props.quiz} onAnswer={props.onAnswer}></UnknownQuestion>
                                )
                            )
                        )
                    )
                )
            }
        </div>
    )
}
