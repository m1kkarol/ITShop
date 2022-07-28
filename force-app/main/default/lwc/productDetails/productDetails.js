import { LightningElement,api, wire, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import { publish, MessageContext } from 'lightning/messageService';
import increaseSize from '@salesforce/messageChannel/Shopping_Cart__c';

import getProductDetails from '@salesforce/apex/IT_ProductDetailsController.getProductDetails';
import getImagesDetails from '@salesforce/apex/IT_ProductDetailsController.getDetailsImg';
import addProductReviews from '@salesforce/apex/IT_ProductDetailsController.addProductReviews';
import getRatingValue from '@salesforce/apex/IT_ProductDetailsController.getRatingValue';
import getProductPrice from '@salesforce/apex/IT_ProductDetailsController.getProductPrice';
import getStandardPrice from '@salesforce/apex/IT_ProductDetailsController.getStandardPrice';
import addProductToCart from '@salesforce/apex/IT_ProductDetailsController.addProductToCart';
import getCache from '@salesforce/apex/IT_ProductDetailsController.getCache';
import getCacheSize from '@salesforce/apex/IT_ProductCartListController.getCacheSize';


import checkComments from '@salesforce/apex/IT_ProductDetailsController.checkComments';

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
    quantity = 1;
    productsFromCache;
    oldPrice;
    isLower = false;
    commentSection;
    renderAddComment;
    cacheSize;

    @wire(MessageContext)
    messageContext;


    handleIncreaseCart() {
        const payload = { flag: 1};

        publish(this.messageContext, increaseSize, payload);
    }

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
            this.price = Math.round(data[0].expr0 * 100) / 100;

            getStandardPrice({productId: this.recordId})
                .then((result)=>{
                    this.oldPrice = Math.round(result.UnitPrice * 100) / 100;
            
                    if(this.oldPrice > this.price){
                    this.isLower = true;
                } else{
                    this.price = this.oldPrice;
                    this.isLower = false;
                }
                })
            
        }
    }
    
    connectedCallback() { 
        getRatingValue({productId: this.recordId})
            .then((result) => {
                this.ratingValue = Math.round(result[0].expr0);
               
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            });

        checkComments({userId: this.userId, productId: this.recordId})
            .then((result)=>{
                this.commentSection = result;
                if(this.commentSection.length > 0){
                    this.renderAddComment = false;
                } else{
                    this.renderAddComment = true;
                }
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            })
        
    }

    handleQuantity(event){
        this.quantity = event.target.value;

        if(this.quantity > 10){
            this.quantity = 10;
        }
    }
    handleProdClick(){
        this.isLoading = true;
        
       
        addProductToCart({prodId: this.recordId, price: this.price, quantity: this.quantity})
            .then((result)=>{
                this.handleIncreaseCart();
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Product Added!",
                    message: 'You added product to cart',
                    variant: "success"
                    })
                );
                this.isLoading = false;
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            })
    }

    handleTest(){
        getCache()
        .then((result)=>{
            this.productsFromCache = result;
           
        });

    
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
                
                eval("$A.get('e.force:refreshView').fire();");
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Thanks!",
                    message: 'Thanks for your comment, we need to approve it',
                    variant: "success"
                    })
                );

                
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            })
            
    }

    

}