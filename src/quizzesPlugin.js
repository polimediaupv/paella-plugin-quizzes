import Preact from 'preact'

import './quizzesPlugin.css'
import Question from './components/Question'
import {name} from '../package.json';

paella.addPlugin(function() {
    return class QuizzesPlugin extends paella.EventDrivenPlugin {
        getName() {
			return "es.upv.paella.quizzesPlugin";
        }
        
        loadDictionary() {
            // Try to load the dictionaries
            let dictionaryUrl = `${paella.baseUrl}localization/${name}-${base.dictionary.currentLanguage()}.json`;
            base.ajax.get({ url:dictionaryUrl }, function(data,type,returnCode) {
                base.dictionary.addDictionary(data);
            });
        }

        checkEnabled(next) {
            var thisClass = this;
            this.lastTimeShowed = 0;
            this._questionnaireID = base.parameters.get("questionnaire");
            this._questionnairePreview = false;
            if (base.parameters.get("questionnaire-preview")) {
                this._questionnairePreview = (base.parameters.get("questionnaire-preview").toLowerCase() === 'true');
            }
            
            
            paella.data.read("quizzes", {questionnaire:this._questionnaireID, questionnairePreview: this._questionnairePreview}, async function(data, status) {
                if (status && data) {
                    base.log.debug("questionnaire read:", data);
                    let userData = await paella.player.auth.userData();
                    if (data.dontAllowAnonymousAnswers && userData.isAnonymous) {
                        if (thisClass._questionnaireID) {
                            paella.messageBox.showError(base.dictionary.translate("Questionnaire not enabled for anonymous user"));
                        }
                        else {
                            paella.messageBox.showMessage(base.dictionary.translate("This video has a questionnaire for registered users. Login to view the questionnaire."));
                            next(false);
                        }                        
                    }
                    else {
                        if (data.dontAllowSeek && (!thisClass._questionnairePreview) ){
                            base.log.debug("Disabling seek per questionnaire request");
                            paella.player.videoContainer.seekDisabled = true;
                        }
                        thisClass._questionnaire = data;
                        thisClass.loadDictionary();
                        thisClass.prepareUI();
                        next(true);
                    }
                }
                else {
                    next(false);
                }
            });
        }    

        getEvents() {
			return [paella.events.timeUpdate];
		}

		onEvent(eventType, params) {
			var thisClass = this;

            if (eventType == paella.events.timeUpdate) {
                params.videoContainer.currentTime(true)
                .then(function (currentTime) {
                    thisClass.checkQuiz(currentTime);
                });
            }
        }

        prepareUI() {
            if (!this._layer) {
                var parent = $(document).find("#playerContainer_videoContainer")[0].parentNode;

                if (parent) {
                    this._layer = document.createElement('div');
                    this._layer .id = "quezzesRoot";
                    parent.insertBefore(this._layer, parent.firstElementChild)                   
                }
            }
        }

        async checkQuiz(currentTime) {
            if (this._asking != true) {                
                for (let index = 0; index < this._questionnaire.quizTimes.length; index++) {
                    let qg = this._questionnaire.quizTimes[index];
                    if (currentTime.toFixed(0) == qg.time.toFixed(0)){
                        var now = new Date();
                        if ((now - this.lastTimeShowed) > 1500){
                            this.lastTimeShowed = now;
                            await this.makeQuizGroup(qg);
                        }
                    }
                }
            }
        }

        async makeQuizGroup(qg) {
            paella.keyManager.enabled = false;
            this._asking = true;
            let paused = await paella.player.paused();
            await paella.player.pause();
            
            for (let index = 0; index < qg.quizzes.length; index++) {
                let quiz = qg.quizzes[index];
                await this.showQuizAndWait(quiz);
            }

            this.lastTimeShowed = new Date();
            this._asking = false;
            paella.keyManager.enabled = true;
            if (paused == false) {
                paella.player.play();
            }
        }

        showQuizAndWait(quiz) {
            let thisClass = this;            
            return new Promise((resolve)=>{
                let root;
                function onAnswer() {
                    Preact.render(null, thisClass._layer, root);
                    resolve();
                }                
                
                root = Preact.render(
                    <Question questionnaire={this._questionnaireID} questionnairePreview={this._questionnairePreview} quiz={quiz} onAnswer={onAnswer}></Question>
                    ,this._layer                    
                );
                this.autoSizeText();
            });
        }

        autoSizeText() {            
            const elements = $('.quizElement');            
            if (elements.length < 0) { return; }
        
            Array.from(elements).map((el) => {
                function resizeText() {
                  const elNewFontSize = (parseInt($(el).css('font-size').slice(0, -2)) - 1) + 'px';
                  return $(el).css('font-size', elNewFontSize);
                }
        
                const result = [];
                while (el.scrollHeight > el.offsetHeight) {
                    result.push(resizeText());
                }                
            });
        }
    }
});
