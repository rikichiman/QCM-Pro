var quest = [{"qDom":"<div class= 'questionZone'>    \n                            <div class='questionText'>\n                                <span class='qNumber'>Question 1:</span> \n                                tdsbdsjdnsd\n                            </div>\n                            <div class='questionPicture'></div> </div> <div class='answerZone' a> </div>","answers":[" <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q1' value = \"vgfdsg\"  aID = '1' /> vgfdsg </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"," <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q1' value = \"dfgjjhj\"  aID = '2' /> dfgjjhj </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"," <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q1' value = \"kjkh kjhgk\"  aID = '3' /> kjkh kjhgk </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"]},{"qDom":"<div class= 'questionZone'>    \n                            <div class='questionText'>\n                                <span class='qNumber'>Question 2:</span> \n                                gkljkldgsjlkjj jglfjgs\n                            </div>\n                            <div class='questionPicture'></div> </div> <div class='answerZone' a> </div>","answers":[" <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q2' value = \"ggfdgdg\"  aID = '1' /> ggfdgdg </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"," <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q2' value = \"jhghlghl\"  aID = '2' /> jhghlghl </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"]},{"qDom":"<div class= 'questionZone'>    \n                            <div class='questionText'>\n                                <span class='qNumber'>Question 3:</span> \n                                hahahahahah\n                            </div>\n                            <div class='questionPicture'></div> </div> <div class='answerZone' a> </div>","answers":[" <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q3' value = \"kkjldksf jjdfujiosdf jifdjsf\"  aID = '1' /> kkjldksf jjdfujiosdf jifdjsf </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"," <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q3' value = \"hhdhdgdd jdkjfdlkjf\"  aID = '2' /> hhdhdgdd jdkjfdlkjf </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"," <div class='answerItem'>\n                                    <div class='answerText'>\n                                        <span> <input type='radio' name='q3' value = \"kkljdflk jkljdjfs klsjfgiosjgd ksjdfklg\"  aID = '3' /> kkljdflk jkljdjfs klsjfgiosjgd ksjdfklg </span>\n                                    </div>\n                                    <div class='answerPicture'></div></div>"]}];
                       var i=0;
                       var j=0; 
                        console.log(quest);
                        var c = [{"qText":"tdsbdsjdnsd","a":1},{"qText":"gkljkldgsjlkjj jglfjgs","a":2},{"qText":"hahahahahah","a":2}]; 
                        var params =  {"testID":"e23530af-6efd-44f5-9eb2-5e7ab49b7f70","title":"TP1 omor","timeOn":true,"period":"1","mixQuestions":false,"mixAnswers":false,"receiveAnswers":true,"dbConfig":{"apiKey":"AIzaSyC-UCWhjTS2gJ0u5exYXnfOQzA90sGTBrY","authDomain":"qcms-b0fbd.firebaseapp.com","databaseURL":"https://qcms-b0fbd.firebaseio.com","projectId":"qcms-b0fbd","storageBucket":"qcms-b0fbd.appspot.com","messagingSenderId":"1036145124440","appId":"1:1036145124440:web:a43eedd0367be056e5d62d","measurementId":"G-84HGQVZ7C0"}};  //--- test parameters
                        showQuestions();
                    function showQuestions(){
                        for( i=0; i < quest.length; i++ ){
                            let question = document.createElement("div");
                            question.setAttribute("class","question");
                            question.innerHTML = quest[i].qDom;
                            document.getElementById("test").appendChild(question);
                            for ( j=0; j < quest[i].answers.length; j++ ) {
                                question.getElementsByClassName("answerZone")[0].innerHTML += quest[i].answers[j];
                            }
                        }
                        startTimer(params);
                    }
                    let btsubmit = document.getElementById("btsubmit");
                    

                    btsubmit.addEventListener("click", function(){
                        //checkAnswer();
                    });
                    

                    function checkAnswer() {
                        //Check correct answers and calculate score
                        var score = 0;
                        var userAnswers = [];
                        for ( i=0 ; i <c.length ; i++) {
                            var rbs = document.querySelectorAll(`input[name="q${i+1}"]`);
                            //console.log(rbs);    

                            var ua = {qn:`q${i+1}`, qt: c[i].qText, uc:0, at:'', state: false};
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
                        let S = Math.round((score/c.length)*20);var studentName = ScormProcessGetValue("cmi.core.student_name");
                                        var dref = firebase.database().ref();
                                        dref.child("tests/Test"+params.testID+"/function getDate() { [native code] }-function getMonth() { [native code] }1-function getFullYear() { [native code] }/"+studentName).set({"score":S, "answers" : userAnswers}); console.log('You SCORE = '+S+' / 20');
                                    console.log(userAnswers);
                                    //Send SCORE to the LMS
                                    RecordTest(S);}