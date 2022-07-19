import { LightningElement, api } from 'lwc';

import updateQuantity from '@salesforce/apex/IT_ProductCartListController.updateQuantity';
import removeProduct from '@salesforce/apex/IT_ProductCartListController.removeProduct';

export default class ProductCartListItem extends LightningElement {

    @api productCartListItem
    productQuantity;
    isLoading = false;


    connectedCallback(){
        this.productQuantity = this.productCartListItem.Quantity;
        
    }

    get total(){
        return this.productQuantity * this.productCartListItem.Price;
    }

    handleQuantity(event){
        this.productQuantity = event.target.value;
        
        updateQuantity({prodId: this.productCartListItem.Id, quantity: this.productQuantity})
            .then(()=>{
                
                const changeSubtotal = new CustomEvent('changesubtotal');
                this.dispatchEvent(changeSubtotal);
            })

    }

    handleRemove(){
        removeProduct({prodId: this.productCartListItem.Id})
            .then(()=>{
                console.log('test');
                const deleteProd = new CustomEvent('deleteprod');
                this.dispatchEvent(deleteProd);
            })
    }

}