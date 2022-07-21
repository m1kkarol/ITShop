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
import updatePricebookNewPrice from '@salesforce/apex/IT_PricebookManagerController.updatePricebookNewPrice';


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
    value = 'amount';
    newPrice;

    useNewPrice = false;
    usePercentage = false;
    useAmount = true;

    @wire(MessageContext)
    messageContext;

    get options(){
        return [
            {label: 'Percentage', value: 'percentage'},
            {label: 'Amount', value: 'amount'},
            {label: 'New price', value: 'newPrice'},
        ]
    }

    handleChange(event){
        this.value = event.detail.value;
        if(this.value == 'amount'){
            this.useNewPrice = false;
            this.usePercentage = false;
            this.useAmount = true;
        }
        if(this.value == 'percentage'){
            this.useNewPrice = false;
            this.usePercentage = true;
            this.useAmount = false;
        }
        if(this.value == 'newPrice'){
            this.useNewPrice = true;
            this.usePercentage = false;
            this.useAmount = false;
        }

    }

    handleNewPrice(event){
        this.newPrice = event.target.value;


        getAllPricebookEntries({recordId: this.recordId})
        .then((result)=>{
             this.allData = [];
                for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: this.newPrice
                        }


                    this.allData.push(productsPrice);
                    
                   
            }
        })
        .catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        })
    }

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
                 
            }
        })
        .catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
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
                    
            }
        })
        .catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        })
      
    }

    handleCheckbox(event) {
        this.isChecked = !this.isChecked;
        
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
  

        this.getAllPricebooks(this.recordId);
    }

    updatePrice() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows(); 
        if(selectedRecords.length > 0) {
            
            let entryId = [];    
            for(let i = 0; i < selectedRecords.length; i++) {
                entryId.push(selectedRecords[i].Id);
            }  
          
            
        
            if(this.useAmount){
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
            } else if(this.usePercentage) {
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
                    
            }
                    
                    
                })
            }
            else if(this.useNewPrice) {
                updatePricebookNewPrice({ids: entryId, pricebookId: this.recordId, newPrice: this.newPrice})
                .then((result)=>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                        title: "Price Updated",
                        message: 'You set new price: €' + this.newPrice,
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
                        NewPrice: this.newPrice,
                        }


                    this.allData.push(productsPrice);
                  
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
   
            }
        })
        .catch((error) =>{

        })
    }

}