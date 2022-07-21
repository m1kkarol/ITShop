import { LightningElement, wire } from 'lwc';

import getCacheSize from '@salesforce/apex/IT_ProductCartListController.getCacheSize';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import increaseCart from '@salesforce/messageChannel/Shopping_Cart__c';

export default class ShopingCart extends LightningElement {

    shopingUrl;
    cartSize;

    renderedCallback(){
        this.shopingUrl = window.location.origin + '/ithshops/s/shoping-cart'
    }

    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                increaseCart,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {

        getCacheSize({})
        .then((result)=>{
            this.cartSize = result;
        })
    }

    connectedCallback() {
        this.subscribeToMessageChannel();

        getCacheSize({})
        .then((result)=>{
            this.cartSize = result;
        })
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading contact',
                message: reduceErrors(error).join(', '),
                variant: 'error',
            })
        );
    }





}