var fs = require('fs');
const { ipcRenderer, remote } = require('electron');
const {dialog, Menu, MenuItem} = remote;
const {test} = require('./js/test');
const {scormGeny} = require('./js/scormGeny');
//const {dataLoader} = require('./js/dataLoader');  // Not used
const { uuid } = require('uuidv4');


let timeOut = null;   //used in regularSave function
let openedFile = null;
let t = null;

let tData = null;
//let dL = null;    // Not used



// Vérifier si le cours a besoin d'être enregistré avant de fermer l'appli
window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    if ( t.hasChanged == true &&  openedFile != null) {
       // let answer = saveMessage();
       // (answer==1)?saveFunction():null;
       // One last save to be sure is UP to date
        if (process.platform == 'darwin') {
            saveTest(openedFile+'/manifest.json');     // this is for MAC machines
        }else{
            saveTest(openedFile+'\\manifest.json');     // this is for windows machiness
        }
    }
});

document.getElementById('new').addEventListener('click', (e) =>{
    e.preventDefault();
    newTest();
    regularSave();  
});

document.getElementById('open').addEventListener('click', (e) =>{
    e.preventDefault();
    openTest();
    regularSave();   // start automatic save
});

document.getElementById('exit_test').addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timeOut);   // stop automatic save
    
    // One last save to be sure is UP to date
    if (process.platform == 'darwin') {
        saveTest(openedFile+'/manifest.json');     // this is for MAC machines
    }else{
        saveTest(openedFile+'\\manifest.json');     // this is for windows machiness
    }
    openedFile = null;
    tData = null;
    t = null;    
    test.testPath = null;  // static variable of the class test

    document.getElementById('test').innerHTML='';   // Effacer les divs du test
    document.getElementById('welcome').style.display='block';
    document.getElementById('exitparent').style.display='none';
    
});

document.getElementById('scorm_test').addEventListener('click', (e) => { 
    e.preventDefault();
    console.log(' Generate scorm process start ..');
    console.log(tData);

    // TODO !!!
    let mySco = new scormGeny(tData, openedFile);
    mySco.generate();


});


openTest = () => {
    let options = { title:"Ouvrir un Test",
                    defaultPath:(openedFile!=null)?openedFile:(process.platform != 'darwin')?'C:\\':'/', 
                    properties:["openDirectory"]
                };

    //Synchronous
    let dir = dialog.showOpenDialogSync(options);
    
    // Step 1 : check if manifest.json exists ?!  inside the selected folder
    if (fs.existsSync(dir+'/manifest.json')) {
        //file exists
        console.log("Ceci est un Test !");
        openedFile = dir[0];        //-----> chemin du cours
        
        test.testPath = dir[0];   // variable static 
        console.log(test.testPath);
        // Step 2 : Load the course
       if ( loadTest(dir + '/manifest.json') )  {
           document.getElementById('welcome').style.display='none';
           document.getElementById('exitparent').style.display='block';
           document.getElementById('testpath').getElementsByTagName('span')[0].innerText = dir;
           coursePath = dir;
        }
    }else {
        console.log("Fichier manifest inexistant !");
    }
}


loadTest = (path) => {
  
   // Chargement du cours à partir d'un fichier JSON
   let jsonFile = JSON.parse(fs.readFileSync(path, 'utf8'));
   
   if (jsonFile.hasOwnProperty('params') && jsonFile.hasOwnProperty('questions')) {
       
        

        tData = jsonFile;       // --- > assign the jsonfile content to  tData global variable
        t = new test(tData);
        //dL = new dataLoader(tData.params);
        return 1;
    }else {
       // Afficher un message d'erreur: ( Format du fichier non adequate )
       //TODO
       console.log("Fichier manifest corrompu !");
       return 0;
   }

}




function newTest() {
    
    let path = dialog.showSaveDialogSync(null , {   title:"Enregistrer un test QCM", 
                                                    defaultPath:(openedFile!=null)?openedFile:(process.platform != 'darwin')?'C:\\':'/', 
                                                    properties:[""]
                                                } );
    if (path != undefined) {
        openedFile = path;
        // Create necessary test folders !
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
            if (process.platform == 'darwin') fs.mkdirSync(path+'/medias');    // for MAC
            else fs.mkdirSync(path+'\\medias');                                 // for windows
            process.chdir("../");
        }
        document.getElementById('welcome').style.display='none';
        document.getElementById('exitparent').style.display='block';
        document.getElementById('testpath').getElementsByTagName('span')[0].innerText = openedFile;

        tData = {
            
            params: {
                testID: uuid(),   // ID for the TEST
                title:'',
                timeOn: false,
                period: 0,
                mixQuestions: false,
                mixAnswers: false,
                receiveAnswers: false,
                dbConfig:{}
            },      // les parametres du test :  chrono, titre etc..c est pas encore clair
            questions : []
        }

        t = new test(tData);
        test.testPath = openedFile;   // static variable of the class test
        //console.log(test.testPath);
    }
}

// Fonction de sauvegarde à interval de temp régulier  3 secondes
regularSave = () => {
    timeOut = setInterval(() => {
        if ( openedFile != null && test.hasChanged == true ) {
            if (process.platform == 'darwin') {
                saveTest(openedFile+'/manifest.json');     // this is for MAC machines
            }else{
                saveTest(openedFile+'\\manifest.json');     // this is for windows machiness
            }
            
                
                //console.log("Save to : "+openedFile+'\\manifest.json');
        }
    }, 3000);
}


function saveTest(path) {
    fs.writeFile(path, JSON.stringify(tData, null, 4), function (err) {
        if (err) throw err;
        console.log('Test is Saved!');
        test.hasChanged = false;
    }); 
}