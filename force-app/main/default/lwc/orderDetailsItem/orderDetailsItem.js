import { LightningElement, api } from 'lwc';

export default class OrderDetailsItem extends LightningElement {
    @api
    item;
    itemId;

    prodDetails;

    connectedCallback(){
        this.itemId = JSON.parse(JSON.stringify(this.item));
        this.prodDetails = window.location.origin + '/ithshops/s/product/' + this.itemId.productId;
    }

    
}