
let btsubmit = document.getElementById("btsubmit");
btsubmit.addEventListener("click", function() {
    checkAnswer();    // ------> this function depends on the test type ( simple or bayesian )
});
let  paramss=JSON.parse(atob(params));
//Mix Answers
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestions() {
    let q=JSON.parse(atob(quest));
    for( i=0; i < q.length; i++ ){
        let question = document.createElement("div");
        question.setAttribute("class","question");
        question.innerHTML = q[i].qDom;
        document.getElementById("test").appendChild(question); 
        
        if (paramss.mixAnswers == true) {
            shuffleArray(q[i].answers); 
        }
        for ( j=0; j < q[i].answers.length; j++ ) {
           question.getElementsByClassName("answerZone")[0].innerHTML += q[i].answers[j];
        }
    }
    startTimer();
}

function saveToDB(S,userAnswers) {
    var studentName = ScormProcessGetValue("cmi.core.student_name");
                                            var dref = firebase.database().ref();
                                            dref.child("tests/Test"+paramss.testID+"/"+studentName).set({"score":S, "answers" : userAnswers});
    RecordTest(S);  //----> send score to LMS
}

// This function is called from --> showQuestions()
function startTimer() {

    let minutes = parseInt(paramss.period);
    let secondes = 59;
    let m = 0;
    let s = 0;
    let timerDom = document.getElementById('timer');
    if (minutes != 0 ) {
        minutes--;
        timer = setInterval(() => {
                
               if (minutes == 0 && secondes == 0) checkAnswer();
               else {
                    if ( secondes == 0 ) { secondes = 59; minutes = minutes - 1; }
                    else secondes = secondes-1;
                    
                    if ( minutes < 10 ) m = `0${minutes}`; else m = minutes;
                    if ( secondes < 10 ) s = '0'+secondes; else s = secondes;
                    timerDom.innerText = m+' : '+s;
                } 
        }, 1000);
    }
}


showQuestions();





