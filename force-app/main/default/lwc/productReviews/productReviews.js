import { LightningElement, api, wire } from 'lwc';


import getProductReviews from '@salesforce/apex/IT_ProductDetailsController.getProductReviews';

export default class ProductReviews extends LightningElement {

    @api productId;
    reviews;

    


    

    connectedCallback() {
         getProductReviews({prodId: this.productId})
            .then((result)=>{
                this.reviews = result;
               
                
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    @api 
    getComments() {
        getProductReviews({prodId: this.productId})
            .then((result)=>{
                this.reviews = result;
            
                
            })
            .catch((error)=>{
                console.log(error);
            })
    }
}