


class picture {


    constructor(parent){
        
        this.parent = parent;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class','picture');
        this.dom.innerHTML = `<img src='' class='answerImage'/>
                              <img src='icons/removeImage.png' class='deleteImage' title="Remove picture"/>`;
    
        this.imageContent = this.dom.getElementsByTagName('img')[0];
        

        this.parent.dom.getElementsByClassName('image_container')[0].appendChild(this.dom);
        this.init();
        //this.hidePicture();
    }


    init(){

        this.dom.getElementsByTagName('img')[1].addEventListener('click', (e)=>{
            e.preventDefault();            
            this.removeImage();
            this.parent.pictureRemoved();
        });

        this.hidePicture();
    }

    setImage(path) {
        this.imageContent.setAttribute('src', path);
    }

    removeImage() {
        //this.imageContent.setAttribute('src', '');
        this.hidePicture();
    }

    showPicture() {
        this.dom.style.display = 'block';
    }

    hidePicture() {
        this.dom.style.display = 'none';
    }

}

exports.picture = picture;