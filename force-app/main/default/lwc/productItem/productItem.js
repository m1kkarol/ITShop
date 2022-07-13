import { LightningElement, api } from 'lwc';


export default class ProductItem extends LightningElement {

    @api product;
    
    get url() {
        return 'https://britenet14-dev-ed.my.site.com/ithshops/s/product/' + this.product.Id;
    }

}
   