import { LightningElement } from 'lwc';
import getRecentlyView from '@salesforce/apex/IT_RecentlyViewProductsController.getRecentlyView';
 
export default class RecentlyViewProducts extends LightningElement {
    
    newestProducts = [];
    firstProduct;
    currentNumber =0
    nextNumber = 1;
    secondProduct;
    url;
    isLoading = false;

    connectedCallback() {
        getRecentlyView()
            .then((result) =>{
                this.newestProducts = result;
                this.firstProduct = this.newestProducts[0];
                this.secondProduct = this.newestProducts[1];
             
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
            this.isLoading = true;
            this.currentNumber -= 1;
            this.nextNumber -= 1;
        }
 
        
        this.firstProduct = this.newestProducts[this.currentNumber];
        this.secondProduct = this.newestProducts[this.nextNumber];
        this.isLoading = false;
        
        this.createUrlForDetails();
    }


    nextSlide() {
        if(this.currentNumber != (this.newestProducts.length - 1)) {
            this.isLoading = true;
            this.currentNumber += 1;
            this.nextNumber +=1;
        }
       
        this.firstProduct = this.newestProducts[this.currentNumber];
        this.secondProduct = this.newestProducts[this.nextNumber];
        this.isLoading = false;
        this.createUrlForDetails();
    }

    createUrlForDetails(){
        this.url = 'https://britenet14-dev-ed.my.site.com/ithshops/s/product/' + this.firstProduct.Id;
    }

}