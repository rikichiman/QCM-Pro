const {control} = require('./control');

class parameter {

    constructor(pData, parent) {     // parameter datas
        this.pData = pData;
        this.parent = parent;

        this.dom = document.createElement('div');
        this.dom.setAttribute('class','parameter');

        this.init();
    }


    init() {

        
        this.dom.appendChild( this.initTitleControl() );
        this.dom.appendChild( this.initTimeControl() );
        this.dom.appendChild( this.initBayesianControl() );
        this.dom.appendChild( this.initQuestionControl() );
        this.dom.appendChild( this.initAnswerControl() );
        this.dom.appendChild( this.initDbControl() );

    }

    initTitleControl() {
        
        let testTitle = document.createElement('div');
        testTitle.setAttribute('class','title');

        let title = document.createElement("input");
        title.setAttribute("type", "text");
        

        //testTitle.innerHTML = ` <input type="text" value = "Untitled test" > `;
        testTitle.appendChild(title);

        testTitle.getElementsByTagName('input')[0].addEventListener('focusin' , (e)=>{
            e.preventDefault();
            if ( testTitle.getElementsByTagName('input')[0].value == "Untitled test" ) {
                testTitle.getElementsByTagName('input')[0].value = '';
            }
        });

        testTitle.getElementsByTagName('input')[0].addEventListener('focusout' , (e)=>{
            e.preventDefault();
            if ( testTitle.getElementsByTagName('input')[0].value == "" ) {
                testTitle.getElementsByTagName('input')[0].value = "Untitled test";
            }
        });

        testTitle.getElementsByTagName('input')[0].addEventListener('change' , (e)=>{
            e.preventDefault();
            this.pData.title = testTitle.getElementsByTagName('input')[0].value;
            this.parent.triggerChange();
        }); 
        
        
        
        if ( this.pData.title != "Untitled test" && this.pData.title != "" ) testTitle.getElementsByTagName('input')[0].value = this.pData.title;
        else testTitle.getElementsByTagName('input')[0].value = "Untitled test";
        return testTitle;

    }

    initTimeControl() {

        let timeInput = document.createElement('div');
        timeInput.setAttribute('class', 'extraDom');
        timeInput.innerHTML = ` <input type="text" id="time" disabled>
                                Minutes `;
        timeInput.getElementsByTagName('input')[0].addEventListener('change', (e) => {
            e.preventDefault();
            this.pData.period = timeInput.getElementsByTagName('input')[0].value;
            this.parent.triggerChange();
        });

        if ( this.pData.timeOn == true && this.pData.period != 0 ) timeInput.getElementsByTagName('input')[0].value = this.pData.period;


        let timerControl = new control('Test duration', timeInput);

        

        timerControl.changeFunction = (loaded) => {
            if ( timerControl.isActive() == true ) {
                timeInput.getElementsByTagName('input')[0].removeAttribute('disabled');
                this.pData.timeOn = true;
            } else {
                timeInput.getElementsByTagName('input')[0].setAttribute('disabled',true);
                this.pData.timeOn = false;
                this.pData.period = 0;
                timeInput.getElementsByTagName('input')[0].value = '';
            }
            if ( loaded == false ) this.parent.triggerChange();
        }

        if ( this.pData.timeOn == true ) timerControl.activateControl();

        return timerControl.dom;
    }

    initBayesianControl(){
        let bayesianControl = new control('Bayesian test', null);

        bayesianControl.changeFunction = (loaded) => {
            if ( bayesianControl.isActive() == true ) {
                this.pData.bayesian = true;
            } else {
                this.pData.bayesian = false;
                console.log('c est false');
         
            }
            if ( loaded == false ) this.parent.triggerChange();
        }
        if ( this.pData.bayesian == true ) bayesianControl.activateControl();
        return bayesianControl.dom;
    }

    initQuestionControl() {

        let questionControl = new control('Mix questions', null);

        questionControl.changeFunction = (loaded) => {
            if ( questionControl.isActive() == true ) {
                this.pData.mixQuestions = true;
            } else {
                this.pData.mixQuestions = false;
                console.log('c est false');
         
            }
            if ( loaded == false ) this.parent.triggerChange();
        }
        if ( this.pData.mixQuestions == true ) questionControl.activateControl();
        return questionControl.dom;
    }

    initAnswerControl() {

        let answerControl = new control('Mix answers', null);

       

        answerControl.changeFunction = (loaded) => {
            if ( answerControl.isActive() == true ) {
                this.pData.mixAnswers = true;
            }else {
                this.pData.mixAnswers = false;
            }
            if ( loaded == false ) this.parent.triggerChange();
        }
        if ( this.pData.mixAnswers == true ) answerControl.activateControl();
        return answerControl.dom;
    }

    initDbControl() {
        let dbDiv = document.createElement('div');
        dbDiv.setAttribute('class', 'extraDom');
        dbDiv.innerHTML = ` <img src="icons/paste.png" title="Paste DataBase configuration">
                            <img src="icons/config.png" title="Show configuration">
                            <img src="icons/faq.png" title="Show answers">
                            <img src="icons/removeconfig.png" title="Remove configuration">
                               <label> Disabled </label>`;

        //-----> Paste config
        dbDiv.getElementsByTagName('img')[0].addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.readText().then( text => { 
                let t = text.substring(text.lastIndexOf('{'), text.lastIndexOf('}')+1);
                if ( t != '' ) {    
                    //console.log(t);
                    t = t.replace(/[\n\r]+/g, '');
                    t = t.replace(/\s+/g, '').trim();

                    /// ----- > convert the string to json format   "key" : "value"     the "" of the keys are missing
                   
                    let newConfig = JSON.parse( this.toJsonFormat( t ) ); 
                    
                    if (JSON.stringify(newConfig) != JSON.stringify(this.pData.dbConfig) ) {

                        this.pData.dbConfig =  newConfig ;
                        this.parent.triggerChange();
                        
                    }
                    console.log( this.pData.dbConfig );
                    
                    dbDiv.getElementsByTagName('img')[1].style.display='inline-block';
                    dbDiv.getElementsByTagName('img')[2].style.display='inline-block';
                    dbDiv.getElementsByTagName('img')[3].style.display='inline-block';
                    dbDiv.getElementsByTagName('label')[0].innerText = "Connected";
                    dbDiv.getElementsByTagName('label')[0].style.color = "green";
                }
            });
        });
        
        //-----> Show config
        dbDiv.getElementsByTagName('img')[1].addEventListener('click', (e) => {
            e.preventDefault();
            //alert(JSON.stringify(this.pData.dbConfig));
        });

        //-----> Show Answers
        dbDiv.getElementsByTagName('img')[2].addEventListener('click', (e) => {
            e.preventDefault();
            alert("Show Answers");
        });


        //----> Remove config
        dbDiv.getElementsByTagName('img')[3].addEventListener('click', (e) => {
            e.preventDefault();
            this.pData.dbConfig = {};
            dbDiv.getElementsByTagName('img')[1].style.display='none';
            dbDiv.getElementsByTagName('img')[2].style.display='none';
            dbDiv.getElementsByTagName('img')[3].style.display='none';
            dbDiv.getElementsByTagName('label')[0].innerText = "Disconnected";
            dbDiv.getElementsByTagName('label')[0].style.color = "red";
            this.parent.triggerChange();
        });

        let dbControl = new control('Receive answers', dbDiv);

        dbControl.changeFunction = (loaded) => {
            let icons =  dbDiv.getElementsByTagName('img');
            if ( dbControl.isActive() == true ) {

                this.pData.receiveAnswers = true;
                icons[0].style.display='inline-block';
                if ( Object.keys(this.pData.dbConfig).length !== 0 ) {
                    icons[1].style.display='inline-block';
                    icons[2].style.display='inline-block';   
                    icons[3].style.display='inline-block'; 
                    dbDiv.getElementsByTagName('label')[0].innerText = "Connected";
                    dbDiv.getElementsByTagName('label')[0].style.color = "green";
                    
                } else {
                    dbDiv.getElementsByTagName('label')[0].innerText = "Disconnected";
                    dbDiv.getElementsByTagName('label')[0].style.color = "red";
                }
                dbDiv.getElementsByTagName('label')[0].style.top='-8px';

            } else {

                this.pData.receiveAnswers = false;
                icons[0].style.display='none';
                icons[1].style.display='none';
                icons[2].style.display='none';
                icons[3].style.display='none';
                dbDiv.getElementsByTagName('label')[0].style.top='0px';
                dbDiv.getElementsByTagName('label')[0].innerText = "Disabled";
                dbDiv.getElementsByTagName('label')[0].style.color = "grey";
            }
            if ( loaded == false ) this.parent.triggerChange();
        }
        if ( this.pData.receiveAnswers == true ) dbControl.activateControl();
        return dbControl.dom;
    }

    toJsonFormat(t) {
        let newT='';
        let coloneFound = false;
        let opened = false;
        for ( let i=0 ; i < t.length ; i++ ) {
            if ( ['{', '}', ':', ',', '"'].includes(t[i]) == false ) {
                if ( coloneFound == false && opened == false ) { newT += '"';  opened = true };
                newT += t[i];
            } else {
                if ( t[i] == '"' ) {
                    newT += t[i++];  // consume the first "
                    while ( t[i] != '"' ) {
                        newT += t[i++];
                    }
                    newT += t[i];   // consume the last  "
                    coloneFound = false;
                }else {
                    if ( t[i] == ':') {
                        newT += '"'+ t[i]; 
                        opened = false;
                        coloneFound = true;
                    } else {
                        newT += t[i];
                    }
                }
            }
        }

        return newT;
    }

   
}

exports.parameter = parameter;