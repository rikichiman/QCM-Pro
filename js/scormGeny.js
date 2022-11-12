var fs = require('fs');
path = require('path');
const { test } = require('./test');

class scormGeny {


    constructor(tData, testPath){
        
        this.tData = tData;
        this.testPath = testPath;
    
    }


    generate(){

        this.questions = new Array();   // array to save question's text with the correct answer number !
        this.prepareFolder();
        this.makeTest( this.tData.questions );

    }


    prepareFolder() {

        if ( fs.existsSync( this.testPath ) ){
            
            if (fs.existsSync(this.testPath+'\\ScoTEST')) {
                fs.rmdirSync(this.testPath+'\\ScoTEST' , { recursive : true});
            }
            
            fs.mkdirSync(this.testPath+'\\ScoTEST');
            
            fs.mkdirSync(this.testPath+'\\ScoTEST\\medias');   // pictures folder
            
            fs.mkdirSync(this.testPath+'\\ScoTEST\\html');   // test html file 
            fs.mkdirSync(this.testPath+'\\ScoTEST\\html\\css');   // 
            fs.mkdirSync(this.testPath+'\\ScoTEST\\html\\js');   // 
            
            
            //-----> copy all the media files to the scorm media folder !
            fs.readdir(this.testPath+'\\medias', (err, files) => {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                //listing all files using forEach
                files.forEach( (file) => {
                    // Do whatever you want to do with the file
                    
                    fs.copyFileSync( this.testPath+'\\medias\\'+file, this.testPath+'\\ScoTEST\\medias\\'+file);
                });
                
            });

            // copy the scorm configuration  files to the scorom folder

            let scoCONF = path.join(__dirname, '../scoGEN');
            // Copie des fichiers de configuration SCORM dans le dossier généré cible  ( scormPath )
            fs.copyFileSync(scoCONF+'\\adlcp_rootv1p2.xsd', this.testPath+'\\ScoTEST\\adlcp_rootv1p2.xsd');
            fs.copyFileSync(scoCONF+'\\ims_xml.xsd', this.testPath+'\\ScoTEST\\ims_xml.xsd');
            fs.copyFileSync(scoCONF+'\\imscp_rootv1p1p2.xsd', this.testPath+'\\ScoTEST\\imscp_rootv1p1p2.xsd');
            fs.copyFileSync(scoCONF+'\\imsmd_rootv1p2p1.xsd', this.testPath+'\\ScoTEST\\imsmd_rootv1p2p1.xsd');
            fs.copyFileSync(scoCONF+'\\imsmanifest.xml', this.testPath+'\\ScoTEST\\imsmanifest.xml');
            
            fs.copyFileSync(scoCONF+'\\finish.png', this.testPath+'\\ScoTEST\\medias\\finish.png');
            // copier le fichier de style du test HTML
            fs.copyFileSync(scoCONF+'\\style.css', this.testPath+'\\ScoTEST\\html\\css\\style.css');
            // copier le fichier JS scormfunctions.js 
            fs.copyFileSync(scoCONF+'\\scormfunctions.js', this.testPath+'\\ScoTEST\\html\\js\\scormfunctions.js');
        }

    }

    makeTest(qList) {

        let doc = `<html> <head><link rel="stylesheet" href="css/style.css"><script src="js/scormfunctions.js"  type="text/javascript"></script></head><body onload="loadFunction();" oncontextmenu = "return false">`;

        doc += `<div id="test"></div>
                <div id="control">
                    <button class="Gbuton" id="btsubmit">Envoyer les reponses</button>
                    <span id="timer"> 10 : 59 </span>
                </div>
                <div id="finish" >
                    <span class="end"> 
                        <center>Fin du test. Vos réponses sont envoyées !
                            Appuyez sur "Terminer l'activite" pour revenir au cours.</center>
                    </span>
                    <center><img src="../medias/finish.png"/></center>
                </div>
                <script src="js/testQCM.js"></script>`;

                if ( this.tData.params.receiveAnswers == true && Object.keys(this.tData.params.dbConfig).length > 0 ) {

                    doc += `<script src="https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js"></script>
                            <script src="https://www.gstatic.com/firebasejs/8.0.1/firebase-database.js"></script>
                            <script>
                            // TODO: Replace the following with your app's Firebase project configuration
                            
                            var firebaseConfig = JSON.parse('${JSON.stringify(this.tData.params.dbConfig)}');
                            // Initialize Firebase
                            firebase.initializeApp(firebaseConfig);
                            var database = firebase.database();
                            </script>`;
                }
                
                doc += `</body></html>`;
        
        fs.writeFileSync( this.testPath+'\\ScoTEST\\html\\index.html', doc );

        this.makeJS( this.makeQuestions( qList ) );

        //console.log(this.questions);
    }

    makeJS( questionsDOM ) {

        let jsCode = `var quest = ${JSON.stringify(questionsDOM)};
                       var i=0;
                       var j=0; 
                        console.log(quest);
                        var c = ${JSON.stringify(this.questions)}; 
                        var params =  ${JSON.stringify(this.tData.params)};  //--- test parameters
                        showQuestions();
                    function showQuestions(){
                        for( i=0; i < quest.length; i++ ){
                            let question = document.createElement("div");
                            question.setAttribute("class","question");
                            question.innerHTML = quest[i].qDom;
                            document.getElementById("test").appendChild(question);`
                            
                    if (this.tData.params.mixAnswers == true) {
                        jsCode+=` 
                                //Mixer les reponses
                                shuffleArray(array) {
                                    for (let i = array.length - 1; i > 0; i--) {
                                        const j = Math.floor(Math.random() * (i + 1));
                                        [array[i], array[j]] = [array[j], array[i]];
                                    }
                                }
                                shuffleArray(quest[i].answers); 
                            `
                    }
                    jsCode+=`
                            for ( j=0; j < quest[i].answers.length; j++ ) {
                                question.getElementsByClassName("answerZone")[0].innerHTML += quest[i].answers[j];
                            }
                        }
                        startTimer(params);
                    }
                    let btsubmit = document.getElementById("btsubmit");
                    

                    btsubmit.addEventListener("click", function(){
                        checkAnswer();
                    });
                    

                    function checkAnswer() {
                        //Check correct answers and calculate score
                        var score = 0;
                        var userAnswers = [];
                        for ( i=0 ; i <c.length ; i++) {
                            var rbs = document.querySelectorAll(\`input[name="q\${i+1}"]\`);
                            //console.log(rbs);    

                            var ua = {qn:\`q\${i+1}\`, qt: c[i].qText, uc:0, at:'', state: false};
                            for (var rb of rbs) {
                                if (rb.checked) {
                                    ua.at = rb.value;
                                    ua.uc = rb.getAttribute('aID');
                                    ua.state = ( ua.uc == c[i].a )?true: false;
                                    if(ua.state) score++;
                                    break;
                                }
                            }
                            userAnswers.push(ua);
                        }
                        let S = Math.round((score/c.length)*20);`;
                        if ( this.tData.params.receiveAnswers == true && Object.keys(this.tData.params.dbConfig).length > 0 ) {
                            jsCode += `var studentName = ScormProcessGetValue("cmi.core.student_name");
                                        var dref = firebase.database().ref();
                                        dref.child("tests/Test"+params.testID+"/"+studentName).set({"score":S, "answers" : userAnswers});`
                        }    
                        jsCode += ` console.log('You SCORE = '+S+' / 20');
                                    console.log(userAnswers);
                                    //Send SCORE to the LMS
                                    RecordTest(S);}`;
        fs.writeFileSync( this.testPath+'\\ScoTEST\\html\\js\\testQCM.js', jsCode );
    }



    makeQuestions ( qList ) {

        let questions = [];
                
        let i=1;
        qList.forEach(qData => {
            questions.push( this.makeQuestion( qData, i++ ) ); 
        });

        return questions;
    }

    makeQuestion( qData, qnumber ) {

        
        let question = {
            qDom:'',
            answers:[]
        }
        
        let questionDOM = ``;
        

        questionDOM += `<div class= 'questionZone'>    
                            <div class='questionText'>
                                <span class='qNumber'>Question ${qnumber}:</span> 
                                ${qData.qText}
                            </div>
                            <div class='questionPicture'>`;

        if (qData.qImg != '' ) {
            questionDOM += `<center> <img src='..${qData.qImg.replace(/\\/g, "/")}' /> </center>`
        }

        questionDOM += `</div> </div> <div class='answerZone' a> </div>`;

        //create answers
        this.questions.push({qUID:qData.quid,qText:qData.qText, a:0});
        question.qDom = questionDOM;
        question.answers = this.makeAnswers( qData.answers, qnumber ) ;
        
        
        return question;                                    
    }

    makeAnswers( aList, qnumber ) {    // aList is the answer list for a question
        
        let answers = [];
        
        let answerNumber = 1;
        aList.forEach(aData => {
               answers.push( this.makeAnswer( aData, qnumber, answerNumber++ ) ); 
        });

        return answers;

    }

    makeAnswer( aData, qnumber, answerNumber ) {

        let answerDOM = '';
        
        answerDOM = ` <div class='answerItem'>
                                    <div class='answerText'>
                                        <span> <input type='radio' name='q${qnumber}' value = "${aData.aText}"  aID = '${answerNumber}' /> ${aData.aText} </span>
                                    </div>
                                    <div class='answerPicture'>`;

        if ( aData.aPicture != '' ) {    
            answerDOM += `<center> <img src='..${aData.aPicture.replace(/\\/g, "/")}' /> </center>`; 
        }
        answerDOM += `</div></div>`;

        if (aData.isCorrect == true) this.questions[qnumber-1].a = answerNumber;

        return answerDOM;
    }

    

}

exports.scormGeny = scormGeny;