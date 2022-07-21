import { LightningElement, wire } from 'lwc';

import getOrders from '@salesforce/apex/IT_OrderHistoryController.getOrders';

import Id from '@salesforce/user/Id';

export default class OrderHistory extends LightningElement {

    userId = Id;
    orders;
    
    @wire(getOrders, {userId: '$userId'})
    getOrders({error,data}){
        if(data){
            this.orders = data;
            console.log(this.orders);
            
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