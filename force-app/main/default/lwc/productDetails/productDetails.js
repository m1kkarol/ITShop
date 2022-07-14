import { LightningElement,api, wire, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

import getProductDetails from '@salesforce/apex/IT_ProductDetailsController.getProductDetails';
import getImagesDetails from '@salesforce/apex/IT_ProductDetailsController.getDetailsImg';
import addProductReviews from '@salesforce/apex/IT_ProductDetailsController.addProductReviews';
import getRatingValue from '@salesforce/apex/IT_ProductDetailsController.getRatingValue';
import getProductPrice from '@salesforce/apex/IT_ProductDetailsController.getProductPrice';
import Id from '@salesforce/user/Id';


export default class ProductDetails extends LightningElement {
    @api recordId;
    product =[];
    images;
    imagesUrl = [];
    currentNumber = 0;
    currentPhoto;
    detailsPhoto;
    isLoading = false;
    commentContent = '';
    rating = 0;
    userId = Id;
    ratingValue;
    price;


    @wire(getProductDetails, {productId: '$recordId'}) product;

    @wire(getImagesDetails, {productId: '$recordId'})
    getImages({error, data}) {
        this.isLoading = true;
        if(data) {
            this.images = data;
            
            for(let i = 0; i< data.length; i++){
                let url = "/sfc/servlet.shepherd/document/download/" + data[i].ContentDocumentId;
                this.imagesUrl.push(url);
            }
            
            this.currentPhoto = this.imagesUrl[0];

            if(this.imagesUrl.length > 1){
                this.detailsPhoto = this.imagesUrl[1];
                this.isLoading = false;
            } else {
                this.detailsPhoto = this.imagesUrl[0];
                this.isLoading = false;
            }
            
        }
    }

    @wire(getProductPrice, {productId: '$recordId'})
    getPrice({error, data}){
        if(data){
            this.price = data[0].expr0;
            
        }
    }

   


    connectedCallback() { 
        getRatingValue({productId: this.recordId})
            .then((result) => {
                this.ratingValue = Math.round(result[0].expr0);
                console.log(this.ratingValue);
            })
            .catch((error)=>{
                console.log(error);
            });

        // getProductPrice({productId: this.recordId}) 
        //     .then((result)=>{
        //         this.price = result[0].expr0;
        //         console.log(this.price);
        //     });
        
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

    handleCommentContent(event){
        this.commentContent = event.target.value;
    }
    handleRatingChanged(event){
        this.rating = event.detail.rating;
    }

    

    handleAddComment(){
        addProductReviews({prodId: this.recordId, userId: this.userId ,rating: this.rating, commentContent: this.commentContent})
            .then((result)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Thanks!",
                    message: 'Thanks for your comment',
                    variant: "success"
                    })
                );

                
            })
            .catch((error)=>{
                console.log(error);
            })

            
       
            // setTimeout(function(){
            //     this.template.querySelector('c-product-reviews').getComments();
            // }, 3000);
            this.template.querySelector('c-product-reviews').getComments();

            
    }

    

}