

class control {

    constructor(name, extraDom) {

        this.active = false;
        this.extraDom = extraDom;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class','control');
        this.dom.innerHTML = `  <label class='paramName'> ${name} </label>
                                <label class="switch" id="timer">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                    
                                </label>`;
        if ( extraDom != null ) this.dom.appendChild(extraDom);
        this.changeFunction = null;
        this.init();
    }


    init() {

        this.dom.getElementsByTagName('input')[0].addEventListener('click', (e)=>{
           
            let checkBox = this.dom.getElementsByTagName('input')[0];
            if ( checkBox.checked == true ) {
                this.active = true;
                console.log('is active');
            }else {
                this.active = false;
                console.log('not active');
            }
            if ( this.changeFunction != null ) this.changeFunction(false);
        });
    }

    activateControl() {

        this.dom.getElementsByTagName('input')[0].checked = true;
        this.active = true;
        if ( this.changeFunction != null ) this.changeFunction(true);

    }

    isActive() {
        return this.active;
    }

}

exports.control = control;