const { app, BrowserWindow, ipcMain, dialog  } = require('electron');

function createWindow () {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 1000,
    height: 1100,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('UI.html');
  //win.removeMenu();
}


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);
 
});

ipcMain.on('save-course', (event, arg) => {   // Opération de sauvegarde déclenchée
  console.log(arg);
  let path = dialog.showSaveDialogSync(null , { title:"Enregistrer le cours", filters: [{name:"fichiers .json", extensions:['json']}] } );
  console.log(path);
});


app.whenReady()
.then(createWindow)
.catch(e=>{
  
});