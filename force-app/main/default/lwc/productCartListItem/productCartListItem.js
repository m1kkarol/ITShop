import { LightningElement, api, wire } from 'lwc';

import updateQuantity from '@salesforce/apex/IT_ProductCartListController.updateQuantity';
import removeProduct from '@salesforce/apex/IT_ProductCartListController.removeProduct';

import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import increaseCart from '@salesforce/messageChannel/Shopping_Cart__c';

export default class ProductCartListItem extends LightningElement {

    @api productCartListItem
    productQuantity;
    isLoading = false;
    @api productId;
    prodUrl;

    
    @wire(MessageContext)
    messageContext;





    handleIncreaseCart() {
        const payload = { flag: 1};

        publish(this.messageContext, increaseCart, payload);
    }


    connectedCallback(){
        this.productQuantity = this.productCartListItem.Quantity;
        this.prodUrl = window.location.origin + "/ithshops/s/product/" + this.productCartListItem.Id;
    }

    get total(){
        return this.productQuantity * this.productCartListItem.Price;
    }

    handleQuantity(event){
        this.productQuantity = event.target.value;
        console.log(this.productId); 
        if(this.productQuantity > 10){
            this.productQuantity = 10;
        }
        
        updateQuantity({prodId: this.productCartListItem.Id, quantity: this.productQuantity})
            .then(()=>{
                
                const changeSubtotal = new CustomEvent('changesubtotal');
                this.dispatchEvent(changeSubtotal);
            })

    }

    handleRemove(){
        removeProduct({prodId: this.productCartListItem.Id})
            .then(()=>{
                this.handleIncreaseCart();
                const deleteProd = new CustomEvent('deleteprod');
                this.dispatchEvent(deleteProd);
            })
    }

}