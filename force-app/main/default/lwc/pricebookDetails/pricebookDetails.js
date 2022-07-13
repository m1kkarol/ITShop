import { LightningElement, wire } from 'lwc';

import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import selectedPricebook from '@salesforce/messageChannel/Pricebook_Details__c';

import getAllPricebookEntries from '@salesforce/apex/IT_PricebookManagerController.getAllPricebookEntries';
import updatePricebookPercent from '@salesforce/apex/IT_PricebookManagerController.updatePricebookPercent';
import updatePricebookCurrency from '@salesforce/apex/IT_PricebookManagerController.updatePricebookCurrency';


const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Standard Price', fieldName: 'Price', type: 'currency'},
    { label: 'New Price', fieldName: 'NewPrice', type: 'currency'},
]

export default class PricebookDetails extends LightningElement {

    subscription = null;
    recordId;
    columns = columns;
    allData;
    curr;
    percentage;
    productIds;
    isChecked = false;
    newPrices;
    isAllProducts = false;
    curr;
    percentage;
    newPrices = [];

    @wire(MessageContext)
    messageContext;


    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                selectedPricebook,
                (message) => this.handleRecordId(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handlePercentage(event){
        this.percentage = event.target.value;

        getAllPricebookEntries({recordId: this.recordId})
        .then((result)=>{
             this.allData = [];
                for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice * (parseInt(1) - (this.percentage / 100)),
                        }


                    this.allData.push(productsPrice);
                    console.log(this.allData.NewPrice);
                    console.log(this.percentage);
            }
        })
        .catch((error) =>{
            console.log(error);
        })
  
    }   
    
    handleCurrency(event) {
        this.curr = event.target.value;
        

        getAllPricebookEntries({recordId: this.recordId})
        .then((result)=>{
             this.allData = [];
                for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice + parseInt(this.curr),
                        }


                    this.allData.push(productsPrice);
                    console.log(this.curr);
                    console.log(this.allData.NewPrice);
            }
        })
        .catch((error) =>{
            console.log(error);
        })
      
    }

    handleCheckbox(event) {
        this.isChecked = !this.isChecked;
        console.log(this.isChecked);
    }

    
     
    handleRecordId(message){
        this.recordId = message.recordId;

        this.getAllPricebooks(this.recordId);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    addMoreProducts(){
        this.isAllProducts = true;
    }

    handleCloseModale(event) {
        this.isAllProducts = event.detail;
        console.log('test');

        this.getAllPricebooks(this.recordId);
    }

    updatePrice() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows(); 
        if(selectedRecords.length > 0) {
            
            let entryId = [];    
            for(let i = 0; i < selectedRecords.length; i++) {
                entryId.push(selectedRecords[i].Id);
            }  
            console.log(entryId);
            
        
            if(this.isChecked){
                updatePricebookCurrency({ids: entryId, pricebookId: this.recordId, price: this.curr})
                .then((result)=>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                        title: "Price Updated",
                        message: 'You increase price of products by ' + this.curr,
                        variant: "success"
                        })
                    );

                
                    this.allData = [];
                    for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                            Id: result[i].Id,
                            ProductId: result[i].Product2Id,
                            Name: result[i].Product2.Name,
                            Price: result[i].UnitPrice,
                            NewPrice: result[i].UnitPrice + parseInt(this.curr),
                        }


                    this.allData.push(productsPrice);
                    }

                    this.getAllPricebooks(this.recordId);
                    
                })
            } else if(!this.isChecked) {
                updatePricebookPercent({ids: entryId, pricebookId: this.recordId, price: this.percentage})
                .then((result)=>{

                    this.dispatchEvent(
                        new ShowToastEvent({
                        title: "Price Updated",
                        message: 'You make discount by ' + this.percentage,
                        variant: "success"
                        })
                    );

                    this.allData = [];
                    for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice * (parseInt(1) - (this.percentage / 100)),
                        }


                    this.allData.push(productsPrice);
                    console.log(this.allData);
            }
                    
                    
                })
            }

        }


    }


    getAllPricebooks(recordId) {
        getAllPricebookEntries({recordId: recordId})
        .then((result)=>{
             this.allData = [];
                for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice
                        } 


                    this.allData.push(productsPrice);
                    console.log(this.allData[i].Id);
            }
        })
        .catch((error) =>{
            console.log(error);
        })
    }

}