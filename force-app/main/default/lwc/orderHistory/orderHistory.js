import { LightningElement, wire } from 'lwc';

import getOrders from '@salesforce/apex/IT_OrderHistoryController.getOrders';

import Id from '@salesforce/user/Id';

export default class OrderHistory extends LightningElement {

    userId = Id;
    orders;
    renderOrders;
    
    @wire(getOrders, {userId: '$userId'})
    getOrders({error,data}){
        if(data){
            this.orders = data;
            if(this.orders.length > 0){
                this.renderOrders = true;
            } else{
                this.renderOrders = false;
            }
            
        } else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

}