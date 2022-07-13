import { LightningElement } from 'lwc';
import getRecentlyView from '@salesforce/apex/IT_RecentlyViewProductsController.getRecentlyView';
 
export default class RecentlyViewProducts extends LightningElement {
    
    newestProducts = [];
    firstProduct;
    currentNumber =0;
    url;

    connectedCallback() {
        getRecentlyView()
            .then((result) =>{
                this.newestProducts = result;
                this.firstProduct = this.newestProducts[0];
                console.log(this.newestProducts);
                this.createUrlForDetails();
            
                
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
        this.createUrlForDetails();
    }


    nextSlide() {
        if(this.currentNumber != (this.newestProducts.length - 1)) {
            this.currentNumber += 1;
        }
        console.log(this.currentNumber);
        this.firstProduct = this.newestProducts[this.currentNumber];
        this.createUrlForDetails();
    }

    createUrlForDetails(){
        this.url = 'https://britenet14-dev-ed.my.site.com/ithshops/s/product/' + this.firstProduct.Id;
    }

}