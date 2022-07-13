import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

import PricebookObject from '@salesforce/schema/Pricebook2';
import PricebookName from '@salesforce/schema/Pricebook2.Name';
import IsActive from '@salesforce/schema/Pricebook2.IsActive';
import Description from '@salesforce/schema/Pricebook2.Description';
import StartDate from '@salesforce/schema/Pricebook2.Start_Date__c';
import EndDate from '@salesforce/schema/Pricebook2.End_Date__c';
import getAllProductsWithPrices from '@salesforce/apex/IT_PricebookManagerController.getAllProductPrices';
import updatePricebookCurrency from '@salesforce/apex/IT_PricebookManagerController.updatePricebookCurrency';
import updatePricebookPercent from '@salesforce/apex/IT_PricebookManagerController.updatePricebookPercent';
import addProducts from '@salesforce/apex/IT_PricebookManagerController.addProductsToPricebook';


const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Standard Price', fieldName: 'Price', type: 'currency'},
    
]

export default class NewPricebook extends LightningElement {
    isModalOpen;
    pricebookObject = PricebookObject;
    pricebookName = PricebookName; 
    isActive = IsActive;
    pricebookDescription = Description;
    startDate = StartDate;
    endDate = EndDate;
    @track columns = columns
    @track allData;
    @api recordId;
    isAdded = false;
    curr;
    percentage;
    productIds;
    isChecked = false;
    newPrices;

    

    handleSuccess(event){ 
        this.isAdded = true;
        this.recordId = event.detail.id;
        console.log(this.recordId);
    }

    connectedCallback() { 
        getAllProductsWithPrices()
            .then((result)=>{
                
                 this.allData = [];
                for(let i = 0; i < result.length; i++) {
                    let productsPrice = {
                        Id: result[i].Id,
                        ProductId: result[i].Product2Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice
                    }

                    this.allData.push(productsPrice);
                    console.log(this.allData);
                }
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    closeModal(event){

        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows(); 
        if(selectedRecords.length > 0) {
            
            let productIds = [];    
            for(let i = 0; i < selectedRecords.length; i++) {
                productIds.push(selectedRecords[i].ProductId);
            }
            console.log(productIds);
            console.log(this.recordId);

            addProducts({pricebookId: this.recordId, productId: productIds})
            .then((result)=>{
                console.log('udalo sie');
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    
        this.isModalOpen = false;

        const closeModal = new CustomEvent("closemodal", {
            detail: this.isModalOpen
        });

        this.dispatchEvent(closeModal);

        
    }

    handlePercentage(event){
        this.percentage = event.target.value;
        console.log(this.percentage);
        
    }   
    
    handleCurrency(event) {
        this.curr = event.target.value;
      
    }

    handleCheckbox(event) {
        this.isChecked = !this.isChecked;
        console.log(this.isChecked);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch(actionName) {
            case 'show_details':
                console.log('test');
                break;
            default: 
        }  
    }


    cancelModal(event){
        this.isModalOpen = false;

        const closeModal = new CustomEvent("justclosemodal", {
            detail: this.isModalOpen
        });

        this.dispatchEvent(closeModal);
    }
}