const {question} = require('./question');
const {parameter} = require('./parameter');
const { uuid } = require('uuidv4');

const fs = require('fs');

class test {
    static testData = null;
    static hasChanged = false;
    static testPath = null;     // path to the test folder
    
    constructor(tData) {
        //console.log(tData);
        this.tData = tData;
        test.testData = this.tData;
        if ( !this.tData.params.hasOwnProperty('testID') ) {    // If the opned test doesn't have an ID
            this.tData.params.testID = uuid();
        }


        this.dom = document.getElementById('test');
        this.loaded = (this.isTestDataEmpty(tData))? false : true;
        this.dom.innerHTML=`<div class="header">
                                
                            </div>
                            <div class='questions'>
                            </div>
                            <img src='./icons/addQuestion.png' class='addQuestion'>`;
        this.questions = new Array();
        this.init();
    }

    getData() {

        return this.tData;
    }

    init() {
        let add = this.dom.getElementsByClassName('addQuestion')[0];
        

        add.addEventListener('click', ()=> {
            // Add Question DATA
            let qData = {
                quid : uuid(),    // get a unique ID for the question
                qText : '',
                qImg:'',
                answers : []
            }
            
            this.addQuestion(qData);
            
            console.log("Add a new question");
            console.log(qData);
        });

        this.initParameters();

        if ( this.loaded ) {
            // call loading function !
            this.addQuestions();
        }

    }

    initParameters() {

        let testParameter = new  parameter(this.tData.params, this);
        this.dom.getElementsByClassName('header')[0].appendChild( testParameter.dom );

    }

    removeQuestion(question) {
        let questions = this.dom.getElementsByClassName('questions')[0];
        questions.removeChild(question.dom);
        this.questions.splice(question.id - 1, 1);
        
        this.tData.questions.splice(question.id - 1, 1);   // remove question data from the json object tData

        this.reorderQuestions();
        this.triggerChange();    // change was made event
    }

    addQuestions() {

        for( let i=0; i < this.tData.questions.length ; i++ ) {

            this.addQuestion( this.tData.questions[i] );

        }
        this.loaded = false;   // reset it to false after loading completed !!
    }

    addQuestion(qData) {

        let questions = this.dom.getElementsByClassName('questions')[0];
        let q = new question(this.questions.length+1, this, qData);  // create new question object

        questions.appendChild(q.dom);
        this.questions.push(q);       // inserer l objet question
        
        if (  this.loaded == false /*this.isQuestionDataEmpty(qData)*/) { 

            q.dom.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});  // make it visible inside the window
            this.tData.questions.push(qData);    // inserer les datas de question 'json' pour les objets created par event
            this.triggerChange();               // change was made event
        
        }
    }

    reorderQuestions() {
        for ( let id = 0 ; id < this.questions.length ; id++) {
            this.questions[id].updateId(id+1);
        }
    }

    triggerChange() {
        test.hasChanged = true;
    }

    copyToMedia(file) {
        let newPath = test.testPath +'\\medias\\'+file.name ;
        fs.copyFileSync(file.path, newPath);
        return '\\medias\\'+file.name;
    }

    getTestPath(){
        return test.testPath;
    }

    isTestDataEmpty(tData) {
        if ( tData.questions.length == 0 ) return true;
        return false;
    }

    getAndCheckAnswers(){

        // --- > TODO 

    }


}

exports.test = test;