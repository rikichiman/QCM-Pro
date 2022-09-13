const {answer} = require('./answer');
const {picture} = require('./picture');

class question {


constructor(number, parent, questionData) {               // deleteFunction comes from parent
    this.id = number;   //Question's number
    this.parent = parent;


    this.loaded = (this.isQuestionDataEmpty(questionData)) ? false : true;    // check if it s a loaded question

    this.dom = document.createElement('div');
    this.dom.setAttribute('class','question');
    this.dom.innerHTML= `   <img src="icons/deleteComp.png" title="Remove"/> 
                            <div class="question_zone">
                                <div class="intext_wrapper">
                                    <label>Question ${number} </label>
                                    <div class="intext" contenteditable=""> </div>
                                    <img src="icons/image.png" title="Add picture"/>
                                    <input type="file" accept="image/*" hidden>
                                </div>
                                <div class="image_container">
                                    
                                </div>
                            </div>
                            <div class="answer">
                                <div class="possible_answer">
                                    <span>Possible answers</span>
                                    <div class="answer_items">
                                        <!-- Here goes the possible item answers-->
                                    </div>
                                </div>
                                <div class="addAnswer">
                                    <img src="icons/addAnswer.png" title="Add answer">
                                    <span>Add answer</span>
                                </div>
                            </div>`;
    
    this.questionData = questionData;
    if ( !this.questionData.hasOwnProperty('quid') ) {    // If the opned question doesn't have an ID
        this.questionData.quid = uuid();
    }
    //this.questionData.qText = 'Speed man is me ?';

    this.answers = new Array();   // list for answers
    
    this.questionPic = new picture(this);
    
    this.initEvent();
    
}


initEvent() {

    this.addAnswerEvent();

    this.deleteQuestionEvent();

    this.initDataBinding();

    if ( this.loaded ) {

        this.dataToDom();     // display question datas   text and picture
        // add Answers 
        this.addAnswers();

    }
    
}

addAnswerEvent () {
    let d = this.dom.getElementsByClassName('addAnswer')[0];
    //let answerZone = this.dom.getElementsByClassName('answer_items')[0];

    d.addEventListener('click', (e)=>{
        //Add Answer DATA !
        let aData = {
            aText : '',
            aPicture : '',
            isCorrect : false
        }

        this.addAnswer(aData);        
    });

}

addAnswer(aData) {
    let answerZone = this.dom.getElementsByClassName('answer_items')[0];

    let ans = new answer(this.answers.length+1, aData, this);    // Create new answer object
    this.answers.push(ans);
    
    answerZone.appendChild(ans.dom);    // show answer dom 
    
    if ( this.loaded == false ) {
        this.questionData.answers.push(aData);   // push only data created by event
        this.dom.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        this.triggerChange();
    }
}

addAnswers() {

    for ( let i=0 ; i < this.questionData.answers.length ; i++ ) {
        this.addAnswer( this.questionData.answers[i] );
    }
    this.loaded = false;   // reset it to false after loading completed !!

}

dataToDom() {
    // display question datas in the DOM
    this.dom.getElementsByClassName('intext')[0].innerText = this.questionData.qText;
    if ( this.questionData.qImg != '' ) {
        
        this.questionPic.setImage(this.getTestPath()+this.questionData.qImg);
        this.questionPic.showPicture();
    }



}

deleteQuestionEvent() {

    // TODO !!
    let d = this.dom.getElementsByTagName('img')[0];

    d.addEventListener('click', ()=> {
        console.log('supprimer la question !');

        this.parent.removeQuestion(this);

    });

}

initDataBinding() {

    this.questionImageChange();
    this.questionTextChange();

}

questionTextChange() {
    this.dom.getElementsByClassName('intext')[0].addEventListener('input', (e)=>{
        e.preventDefault();

        this.questionData.qText = this.dom.getElementsByClassName('intext')[0].innerText;

        console.log(this.questionData);
        this.triggerChange();    // change was made event

    });
}

questionImageChange() {
    let d = this.dom.getElementsByTagName('img')[1];
    let inp = this.dom.getElementsByTagName('input')[0];
    

    d.addEventListener('click', ()=> {
        console.log('Ajouter une image a la question !');
        inp.click();
    });

    // File input  change event !
    inp.addEventListener('change', (e)=> {
        if (inp.files[0]) {
            
            
            this.questionData.qImg = this.copyToMedia(inp.files[0]);
            this.questionPic.setImage(this.getTestPath()+this.questionData.qImg);
            this.questionPic.showPicture();
            
            console.log(inp.files[0]);
            this.triggerChange();    // change was made event
        }


    });
}


removeAnswer(answer) {
    
    let answerZone = this.dom.getElementsByClassName('answer_items')[0];

    answerZone.removeChild(answer.dom);
    this.answers.splice(answer.id - 1, 1);
    this.reorderAnswers();

    this.triggerChange();      // Change was made event 
}

reorderAnswers(){

    //console.log(this.answers.length);
    for ( let id = 0 ; id < this.answers.length ; id++) {
        this.answers[id].updateId(id+1);
    }
}

updateId(newId) {
    this.id = newId;
    let label = this.dom.getElementsByTagName('label')[0];
    label.innerText = 'Question '+this.id;
}

pictureRemoved(){
    this.questionData.qImg = '';
    this.triggerChange();
}

triggerChange (){
    this.parent.triggerChange();
}

copyToMedia(file) {
    return this.parent.copyToMedia(file);
}

getTestPath() {
    return this.parent.getTestPath();
}

isQuestionDataEmpty(qData) {

    if ( qData.qText == '' && qData.qImg == '' && qData.answers.length == 0 ) return true;

    return false;

}

}


exports.question = question;