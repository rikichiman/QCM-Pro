


class dataLoader {


    constructor(params) {
        
        this.testName = params.title;
        this.dbConfig = params.dbConfig;
        this.dataBase = null;
        this.appCreated = false;


        if ( JSON.stringify( this.dbConfig ) != JSON.stringify({})) {
            this.initRef();
        }


    }

    initRef() {
        
        firebase.initializeApp(this.dbConfig);
        this.dataBase = firebase.database();
        this.appCreated = true;
        this.getAnswers();
    }

    
    removeApp() {
        if ( this.appCreated == true ) {
            firebase.app().delete().then( () => {
                console.log("App removed !");
                this.appCreated = false;
                this.dataBase = null;
            });
        }
    }

    getAnswers() {
        console.log('------- Liste des reponses -------');
        let stdAnswers = this.dataBase.ref('tests/'+this.testName);

        stdAnswers.once('value').then((snapshot) =>{
            let data = snapshot.val();
            console.log(data);
        });


    }





}


exports.dataLoader = dataLoader;