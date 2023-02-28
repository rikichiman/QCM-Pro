let timeOut = null;   //used in regularSave function
let openedFile = null;
let t = null;
let tData = null;
let dL = null;    // Not used halo there


 // Vérifier si le cours a besoin d'être enregistré avant de fermer l'appli
window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    if ( t.hasChanged == true &&  openedFile != null) {
       // let answer = saveMessage();
       // (answer==1)?saveFunction():null;
       // One last save to be sure is UP to date
        if (['darwin','linux'].includes(process.platform )) {
            saveTest(openedFile+'/manifest.json');     // this is for MAC machines
        }else{
            saveTest(openedFile+'\\manifest.json');     // this is for windows machiness
        }
    }
});

document.getElementById('exit_test').addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timeOut);   // stop automatic save
    
    // One last save to be sure is UP to date
    if (['darwin','linux'].includes(process.platform )) {
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
    // TODO !!!
    scoModule.generateSco();     //===> See preload.js for definition
    alertSuccess("Scorm package Done");
});

document.getElementById('new').addEventListener('click', (e) =>{
    e.preventDefault();
    ipcRenderer.send("NewTest",1);    // send New Test signal to main process
});

ipcRenderer.on('newFolder', (f) => {
    newTest(f);    //f is the folder path
    regularSave(); 
});

// Open an existing test
document.getElementById('open').addEventListener('click', (e) =>{
    e.preventDefault();
    ipcRenderer.send("OpenTest",1);    // send Open Test signal to main process 
});

ipcRenderer.on('testFolder', (f) => {
    openTest(f);
    regularSave();   // start automatic save
});

openTest = (folder) => {
   // Step 1 : check if manifest.json exists ?!  inside the selected folder
    if (fs.existsSync(folder+'/manifest.json')) {
        //file exists
        console.log("Ceci est un Test !");
        openedFile = folder;        //-----> chemin du cours
        test.setTestPath(folder[0]);   // variable static testPath inside test.js
        
        // Step 2 : Load the course
       if ( loadTest(folder + '/manifest.json') )  {
           document.getElementById('welcome').style.display='none';
           document.getElementById('exitparent').style.display='block';
           document.getElementById('testpath').getElementsByTagName('span')[0].innerText = folder[0];
           //coursePath = dir;
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
        t = test.create(tData);
        return 1;
    }else {
       // Afficher un message d'erreur: ( Format du fichier non adequate )
       //TODO
       console.log("Fichier manifest corrompu !");
       return 0;
   }

}

function newTest(path) {

    if (path != undefined) {
        openedFile = path;
        // Create necessary test folders !
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
            if (['darwin','linux'].includes(process.platform )) fs.mkdirSync(path+'/medias');    // for MAC
            else fs.mkdirSync(path+'\\medias');                                 // for windows
            process.chdir("../");
        }
        document.getElementById('welcome').style.display='none';
        document.getElementById('exitparent').style.display='block';
        document.getElementById('testpath').getElementsByTagName('span')[0].innerText = openedFile;

        tData = {
            
            params: {
                testID: uuid.generate(),   // ID for the TEST
                title:'',
                timeOn: false,
                period: 0,
                bayesian: false,         // True or false 
                mixQuestions: false,
                mixAnswers: false,
                receiveAnswers: false,
                dbConfig:{}
            },      // les parametres du test :  chrono, titre etc..c est pas encore clair
            questions : []
        }
        t = test.create(tData);
        test.setTestPath(openedFile);   // static variable of the class test
    }
}

// Fonction de sauvegarde à interval de temp régulier  3 secondes
regularSave = () => {
    timeOut = setInterval(() => {
        if ( openedFile != null && test.hasChanged() == true ) {
            if (['darwin','linux'].includes(process.platform )) {
                saveTest(openedFile+'/manifest.json');     // this is for MAC machines
            }else{
                saveTest(openedFile+'\\manifest.json');     // this is for windows machiness
            }
            
                
                console.log("Save to : "+openedFile+'\\manifest.json');
        }
    }, 3000);
}

function saveTest(path) {

    fs.writeFile(path, JSON.stringify(test.getTestData(), null, 4), function (err) {
        if (err) throw err;
        console.log('Test is Saved!');
        test.setHasChanged(false);
        alertSuccess("Test saved");
    }); 
    
}

function alertSuccess(message) {
    Toastify.toast({
      text: message,
      duration: 2500,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      offset: {
        x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: 60 // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
    });
}