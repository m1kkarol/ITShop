import { LightningElement, api } from 'lwc';
import getNewestProducts from '@salesforce/apex/IT_ProductsController.getNewestProduct';

export default class NewestProducts extends LightningElement {

    newestProducts = [];
    firstProduct;
    currentNumber = 0;
    url;

    connectedCallback() {
        getNewestProducts()
            .then((result) =>{
                this.newestProducts = result;
                this.firstProduct = this.newestProducts[0]; 
                this.createUrlForDetails();  
                     
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

    backSlide() {
        if(this.currentNumber != 0) {
            this.currentNumber -= 1;
        }


        this.firstProduct = this.newestProducts[this.currentNumber];
        this.createUrlForDetails();
    }


    nextSlide() {
        if(this.currentNumber != (this.newestProducts.length - 1)) {
            this.currentNumber += 1;
        }
        this.firstProduct = this.newestProducts[this.currentNumber];
        this.createUrlForDetails();
    }

    createUrlForDetails() {
       this.url = window.location.origin + '/ithshops/s/product/' + this.firstProduct.Id;
    }
}