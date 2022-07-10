import { LightningElement,api, wire, track } from 'lwc';

import getProductDetails from '@salesforce/apex/IT_ProductDetailsController.getProductDetails';
import getImagesDetails from '@salesforce/apex/IT_ProductDetailsController.getDetailsImg';

export default class ProductDetails extends LightningElement {
    @api recordId;
    product =[];
    images;
    imagesUrl = [];
    currentNumber = 0;
    currentPhoto;


    @wire(getProductDetails, {productId: '$recordId'}) product;

    @wire(getImagesDetails, {productId: '$recordId'})
    getImages({error, data}) {
        if(data) {
            this.images = data;
            
            for(let i = 0; i< data.length; i++){
                let url = "/sfc/servlet.shepherd/document/download/" + data[i].ContentDocumentId;
                this.imagesUrl.push(url);
            }
            
            this.currentPhoto = this.imagesUrl[0];
        }
    }

    
    

    handleTest(){
        console.log(this.product);
        console.log(this.recordId);
        console.log(this.imagesUrl);
    
    }

    backSlide() {
        
        if(this.currentNumber != 0) {
            this.currentNumber -= 1;
        }
        this.currentPhoto = this.imagesUrl[this.currentNumber];
              
    }


    nextSlide() {
        
        if(this.currentNumber != (this.imagesUrl.length - 1)) {
            this.currentNumber += 1;
        }
        this.currentPhoto = this.imagesUrl[this.currentNumber];
     
    }

}