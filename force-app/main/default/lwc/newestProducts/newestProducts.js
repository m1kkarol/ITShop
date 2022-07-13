import { LightningElement, api } from 'lwc';
import getNewestProducts from '@salesforce/apex/IT_ProductsController.getNewestProduct';

export default class NewestProducts extends LightningElement {

    newestProducts = [];
    firstProduct;
    currentNumber = 0;

    connectedCallback() {
        getNewestProducts()
            .then((result) =>{
                this.newestProducts = result;
                this.firstProduct = this.newestProducts[0];
                console.log(this.newestProducts);
                console.log(this.firstProduct);
                console.log(this.currentNumber);
            
                
            })
            .catch((error)=>{
                console.log(error);
            })
            
    }

    backSlide() {
        if(this.currentNumber != 0) {
            this.currentNumber -= 1;
        }
        console.log(this.currentNumber);
        this.firstProduct = this.newestProducts[this.currentNumber];
    }


    nextSlide() {
        if(this.currentNumber != (this.newestProducts.length - 1)) {
            this.currentNumber += 1;
        }
        console.log(this.currentNumber);
        this.firstProduct = this.newestProducts[this.currentNumber];
    }
}