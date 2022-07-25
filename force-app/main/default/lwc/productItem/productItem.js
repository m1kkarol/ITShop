import { LightningElement, api, wire } from 'lwc';
import getProductPrice from '@salesforce/apex/IT_ProductDetailsController.getProductPrice';
import getStandardPrice from '@salesforce/apex/IT_ProductDetailsController.getStandardPrice';

export default class ProductItem extends LightningElement {

    @api product;
    price;
    oldPrice;
    isLower = false;
    
    get url() {
        return 'https://britenet14-dev-ed.my.site.com/ithshops/s/product/' + this.product.Id;
    }

    @wire(getProductPrice, {productId: '$product.Id'})
    getPrice({error, data}){
        if(data){
            
            this.price = Math.round(data[0].expr0 * 100) / 100;
            
            getStandardPrice({productId: this.product.Id})
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

}
   