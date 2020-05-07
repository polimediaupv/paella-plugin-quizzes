
class QuizzesDataDelegateTest extends paella.DataDelegate {
    constructor() {
        super();
    }

    read(context, params, onSuccess) {
        if(typeof(onSuccess)=='function') {
            let questionnaire = params.questionnaire || "questionnaire";
            let url = `${paella.player.videoUrl}${questionnaire}.json`
            base.log.debug(`Reading questionnaire ${url}`);

            base.ajax.get({url:url},function(data,mimetype,code) {
                    if (typeof(data)=="string") {
                        data = JSON.parse(data);
                    }
                    onSuccess(data, true);
                },
                function(data,mimetype,code) {
                    base.log.debug(`Error loading questionnaire ${url}`);
                    onSuccess(null, false);
                }
            );
        }
    }
    
    write(context, params, value, onSuccess) {
        let questionnaire = params.questionnaire || "questionnaire";
        base.log.debug (`Saving questionnaire ${questionnaire}, quiz=${params.quiz}`);
        
        switch(params.quiz.type) {
            case 'choice-question':
                var resp;
                if (value!=undefined) {
                    resp = {
                        feedbacks: params.quiz.feedbacks.map((v,i)=>{ return i==value ? {feedback: v, correct: params.quiz.answers[i]} : {}})
                    };
                }
                onSuccess(resp, true);
                break;
            case 'multiple-choice-question':
                var resp;
                if (value !=undefined) {
                    resp = {
                        feedbacks: params.quiz.feedbacks.map((v,i)=>{ return value.includes(i) ? {feedback: v, correct: params.quiz.answers[i]} : {}})
                    };
                }
                onSuccess(resp, true);
                break;                
            case 'open-question':
            case 'likert-question':
            case 'message':
                if(typeof(onSuccess)=='function') {
                    onSuccess(null, true);
                }
                break;
            default:
                if(typeof(onSuccess)=='function') {
                    onSuccess(null, false);
                }
        }        
    }

    remove(context, params, onSuccess) {
        if(typeof(onSuccess)=='function') {
            onSuccess(null, false);
        }
    }
}

paella.dataDelegates.QuizzesDataDelegateTest = QuizzesDataDelegateTest;
