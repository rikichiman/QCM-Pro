const {picture} = require('./picture');

class answer {

    constructor(id, answerData, parent) {
        this.id = id;
        this.parent = parent;
        this.loaded = ( this.isAnswerDataEmpty(answerData) ) ? false : true;
        
        
        this.dom = document.createElement('div');
        this.dom.setAttribute('class','answer_item');
        this.dom.innerHTML = ` <div class="text_zone">
                                    <input type="text" class="intext answer_Text"/>
                                    <div class="circle"></div>
                                    <div class="icon_zone">
                                        <img src="icons/image.png" title="Add picture"/>
                                        <img src="icons/remove.png" title="Remove"/>
                                        <img src="icons/tdown24.png" title="Wrong answer"/>
                                        <input type="file" accept="image/*" hidden>
                                    </div>
                                </div>
                                <div class="image_container">

                                </div>`;

        this.answerData = answerData;     
        this.answerPic = new picture(this);
        //this.dom.getElementsByClassName('image_container')[0].appendChild(this.answerPic.dom);                       
        this.initEvent();
    }

    initEvent() {

        let d = this.dom.getElementsByTagName('img')[1];
        
        d.addEventListener('click', ()=> {
            console.log('remove answer');
            this.parent.removeAnswer(this);
        });
        
        this.initDataBinding();

        if ( this.loaded ) {

            //  Display answer data in the DOM !!
            this.dataToDom();

        }
    }

    dataToDom() {
        this.dom.getElementsByTagName('input')[0].value = this.answerData.aText;
        if ( this.answerData.aPicture != '' ) {
            this.answerPic.setImage(this.parent.getTestPath()+this.answerData.aPicture);
            this.answerPic.showPicture();
        }
        this.togglePicture(this.answerData.isCorrect);
    }

    initDataBinding() {
        this.toggleCorrect();
        this.answerTextChange();
        this.answerPictureChange();
    }


    answerTextChange(){

        this.dom.getElementsByTagName('input')[0].addEventListener('input',(e) => {
            e.preventDefault();
            this.answerData.aText = this.dom.getElementsByTagName('input')[0].value;     // change the json data
            console.log('text change event !!');
            console.log(this.parent.questionData);

            this.triggerChange();    // change was made event
        });

    }

    toggleCorrect() {

        let img = this.dom.getElementsByTagName('img')[2];
        img.addEventListener('click', ()=> {
            this.answerData.isCorrect = !this.answerData.isCorrect;      // change the json data

            this.togglePicture(this.answerData.isCorrect);
            console.log(this.id);
            this.triggerChange();    // change was made event
        });
    }

    togglePicture( isCorrect ) {
        let img = this.dom.getElementsByTagName('img')[2];
        //change the picture
        let src = (isCorrect)?'icons/tup24.png':'icons/tdown24.png';
        let title = (isCorrect)?'Correct answer':'Wrong answer';

        img.setAttribute('src', src);
        img.setAttribute('title', title);
    }

    answerPictureChange(){
        //TODO
        let img = this.dom.getElementsByTagName('img')[0];
        let inp = this.dom.getElementsByTagName('input')[1];

        img.addEventListener('click', ()=> {
            console.log('add picture');
            inp.click();
        });

        // File input  change event !
        inp.addEventListener('change', (e)=> {
            if (inp.files[0]) {
                
                this.answerData.aPicture = this.parent.copyToMedia(inp.files[0]);
                this.answerPic.setImage(this.parent.getTestPath()+this.answerData.aPicture);
                this.answerPic.showPicture();
                console.log(inp.files[0]);

                this.triggerChange();    // change was made event
            }
        });
    }

    pictureRemoved(){
        this.answerData.aPicture = '';
        this.triggerChange();
    }

    updateId(newId) {
        this.id = newId;
        console.log('ID updated !!');
    }

    triggerChange (){
        this.parent.triggerChange();
    }

    isAnswerDataEmpty(aData) {
        if ( aData.aText == '' && aData.aPicture == '' && aData.isCorrect == false ) return true;
        return false;
    }

}

exports.answer = answer;